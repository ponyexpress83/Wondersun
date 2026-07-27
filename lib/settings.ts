import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { CANCELLATION_HOURS } from "@/lib/types";

/**
 * Impostazioni di piattaforma configurabili dall'amministratore
 * (Allegato A § 4.3 — "configurazione delle policy di cancellazione e rimborso").
 * Sono salvate nella tabella key/value `platform_settings`.
 */
export const SETTING_KEYS = {
  cancellationHours: "default_cancellation_hours",
  refundPolicy: "refund_policy_note",
} as const;

export interface PlatformPolicy {
  /** Ore minime di preavviso per l'annullamento gratuito (default piattaforma). */
  cancellationHours: number;
  /** Testo informativo sulla politica di rimborso, mostrato al cliente. */
  refundPolicy: string;
}

export const DEFAULT_REFUND_POLICY =
  "Il servizio digitale Wondersun è rimborsabile se l'annullamento avviene entro i termini di preavviso previsti. Il prezzo dell'esperienza, incassato direttamente dal fornitore, segue le condizioni del fornitore stesso.";

/** Legge la policy corrente. Non solleva: in caso di errore usa i default. */
export async function getPlatformPolicy(): Promise<PlatformPolicy> {
  const fallback: PlatformPolicy = {
    cancellationHours: CANCELLATION_HOURS,
    refundPolicy: DEFAULT_REFUND_POLICY,
  };
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return fallback;
  try {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("platform_settings")
      .select("key, value")
      .in("key", [SETTING_KEYS.cancellationHours, SETTING_KEYS.refundPolicy]);
    const map = new Map((data ?? []).map((r: any) => [r.key, r.value]));
    const hours = Number(map.get(SETTING_KEYS.cancellationHours));
    return {
      cancellationHours: Number.isFinite(hours) && hours >= 0 ? hours : fallback.cancellationHours,
      refundPolicy: (map.get(SETTING_KEYS.refundPolicy) as string) || fallback.refundPolicy,
    };
  } catch {
    return fallback;
  }
}
