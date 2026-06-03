import { createSupabaseAdminClient } from "@/lib/supabase/server";

export interface DiscountCode {
  id: string;
  code: string;
  description: string | null;
  kind: "percent" | "fixed_cents";
  value: number;
  valid_from: string | null;
  valid_until: string | null;
  usage_limit: number | null;
  used_count: number;
  active: boolean;
  created_at: string;
}

export interface DiscountResult {
  ok: boolean;
  discountCents: number;
  finalCents: number;
  code?: DiscountCode;
  error?: string;
}

/**
 * Valida un codice sconto e calcola l'importo dopo lo sconto sulla quota
 * Wondersun. Lo sconto si applica SOLO sulla commissione (paghi solo quello
 * che vivi), mai sulla quota fornitore.
 */
export async function applyDiscountCode(code: string, commissionCents: number): Promise<DiscountResult> {
  if (!code) return { ok: false, discountCents: 0, finalCents: commissionCents, error: "Codice mancante" };

  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("discount_codes")
    .select("*")
    .eq("code", code.trim().toUpperCase())
    .eq("active", true)
    .maybeSingle();

  if (!data) return { ok: false, discountCents: 0, finalCents: commissionCents, error: "Codice non valido" };

  const now = new Date();
  if (data.valid_from && new Date(data.valid_from) > now) {
    return { ok: false, discountCents: 0, finalCents: commissionCents, error: "Codice non ancora attivo" };
  }
  if (data.valid_until && new Date(data.valid_until) < now) {
    return { ok: false, discountCents: 0, finalCents: commissionCents, error: "Codice scaduto" };
  }
  if (data.usage_limit && data.used_count >= data.usage_limit) {
    return { ok: false, discountCents: 0, finalCents: commissionCents, error: "Codice esaurito" };
  }

  const discountCents =
    data.kind === "percent"
      ? Math.round((commissionCents * data.value) / 100)
      : Math.min(data.value, commissionCents);

  return {
    ok: true,
    discountCents,
    finalCents: Math.max(0, commissionCents - discountCents),
    code: data as DiscountCode,
  };
}
