import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { Supplier } from "@/lib/types";

/**
 * Modello commerciale canone fornitori (chat committente 04-05/06/2026):
 *
 * PRE-LANCIO (partner fondatori, is_founding_partner = true):
 *   · prenotabili → 3 mesi gratis DALLA DATA DI LANCIO, poi €29/mese
 *   · vetrina     → 1 mese gratis DALLA DATA DI LANCIO, poi €29/mese
 *   La data di lancio è unica per tutti (platform_settings.launch_date):
 *   un solo countdown, non scadenze individuali.
 *
 * POST-LANCIO (nuovi fornitori, is_founding_partner = false):
 *   · attivazione una tantum €99 (primo mese incluso), poi €29/mese.
 */

export const MONTHLY_FEE_CENTS = 2900;
export const ACTIVATION_FEE_CENTS = 9900;
export const FOUNDING_FREE_MONTHS = { prenotabile: 3, vetrina: 1 } as const;

export interface BillingState {
  /** 'promo' = periodo gratuito in corso · 'attesa_lancio' = lancio non ancora fissato
   *  'attivazione' = deve pagare la quota €99 · 'attivo' = canone corrente
   *  'da_pagare' = promo finita, canone da attivare */
  phase: "attesa_lancio" | "promo" | "attivazione" | "da_pagare" | "attivo";
  /** Fine del periodo gratuito (solo fondatori, se lancio fissato). */
  freeUntil: Date | null;
  monthlyCents: number;
  /** Quota di attivazione dovuta ora (0 se fondatore o già saldata). */
  activationDueCents: number;
  /** Testo pronto per la UI. */
  label: string;
}

export async function getLaunchDate(): Promise<Date | null> {
  try {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("platform_settings")
      .select("value")
      .eq("key", "launch_date")
      .maybeSingle();
    if (!data?.value) return null;
    const d = new Date(data.value);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

function addMonths(d: Date, months: number): Date {
  const out = new Date(d);
  out.setMonth(out.getMonth() + months);
  return out;
}

export function computeBilling(
  supplier: Pick<
    Supplier,
    "mode" | "is_founding_partner" | "activation_fee_paid_at" | "subscription_status" | "current_period_end"
  >,
  launchDate: Date | null,
): BillingState {
  const now = new Date();

  if (supplier.subscription_status === "attivo" && supplier.current_period_end) {
    const end = new Date(supplier.current_period_end);
    if (end > now) {
      return {
        phase: "attivo",
        freeUntil: null,
        monthlyCents: MONTHLY_FEE_CENTS,
        activationDueCents: 0,
        label: `Canone attivo · rinnovo il ${end.toLocaleDateString("it-IT")}`,
      };
    }
  }

  if (supplier.is_founding_partner) {
    if (!launchDate) {
      return {
        phase: "attesa_lancio",
        freeUntil: null,
        monthlyCents: MONTHLY_FEE_CENTS,
        activationDueCents: 0,
        label:
          supplier.mode === "vetrina"
            ? "Partner fondatore · 1 mese gratis dal lancio della piattaforma"
            : "Partner fondatore · 3 mesi gratis dal lancio della piattaforma",
      };
    }
    const months = FOUNDING_FREE_MONTHS[supplier.mode] ?? FOUNDING_FREE_MONTHS.prenotabile;
    const freeUntil = addMonths(launchDate, months);
    if (now < freeUntil) {
      return {
        phase: "promo",
        freeUntil,
        monthlyCents: MONTHLY_FEE_CENTS,
        activationDueCents: 0,
        label: `Periodo promozionale fondatori · gratuito fino al ${freeUntil.toLocaleDateString("it-IT")}`,
      };
    }
    return {
      phase: "da_pagare",
      freeUntil,
      monthlyCents: MONTHLY_FEE_CENTS,
      activationDueCents: 0,
      label: "Periodo promozionale terminato · attiva il canone €29/mese",
    };
  }

  // Post-lancio: prima la quota di attivazione (€99, primo mese incluso)
  if (!supplier.activation_fee_paid_at) {
    return {
      phase: "attivazione",
      freeUntil: null,
      monthlyCents: MONTHLY_FEE_CENTS,
      activationDueCents: ACTIVATION_FEE_CENTS,
      label: "Attivazione una tantum €99 (primo mese incluso), poi €29/mese",
    };
  }
  const firstMonthEnd = addMonths(new Date(supplier.activation_fee_paid_at), 1);
  if (now < firstMonthEnd) {
    return {
      phase: "promo",
      freeUntil: firstMonthEnd,
      monthlyCents: MONTHLY_FEE_CENTS,
      activationDueCents: 0,
      label: `Primo mese incluso nell'attivazione · fino al ${firstMonthEnd.toLocaleDateString("it-IT")}`,
    };
  }
  return {
    phase: "da_pagare",
    freeUntil: firstMonthEnd,
    monthlyCents: MONTHLY_FEE_CENTS,
    activationDueCents: 0,
    label: "Primo mese terminato · attiva il canone €29/mese",
  };
}
