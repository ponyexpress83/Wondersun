import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { getPlatformPolicy } from "@/lib/settings";

/**
 * Finestra di pagamento della quota Wondersun.
 *
 * Dopo la conferma del fornitore la prenotazione resta "in attesa di pagamento":
 * se la quota non viene versata entro il termine, viene annullata
 * automaticamente e la data torna disponibile.
 *
 * L'annullamento è "pigro": viene applicato ogni volta che qualcuno consulta le
 * prenotazioni (cliente, fornitore o admin) oppure tenta il pagamento. Così non
 * dipende dalla frequenza dei cron di Vercel — un cron di supporto esiste
 * comunque per chiudere le posizioni rimaste ferme.
 */

export const DEFAULT_PAYMENT_WINDOW_MINUTES = 60;

/** Minuti concessi per il pagamento (configurabile dall'admin). */
export async function getPaymentWindowMinutes(): Promise<number> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return DEFAULT_PAYMENT_WINDOW_MINUTES;
  try {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("platform_settings")
      .select("value")
      .eq("key", "payment_window_minutes")
      .maybeSingle();
    const n = Number(data?.value);
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_PAYMENT_WINDOW_MINUTES;
  } catch {
    return DEFAULT_PAYMENT_WINDOW_MINUTES;
  }
}

/** Scadenza da impostare al momento della conferma del fornitore. */
export async function computePaymentDeadline(from: Date = new Date()): Promise<string> {
  const minutes = await getPaymentWindowMinutes();
  return new Date(from.getTime() + minutes * 60_000).toISOString();
}

/**
 * Annulla le prenotazioni la cui finestra di pagamento è scaduta.
 * Sicuro da chiamare spesso: agisce solo su 'confermata' con scadenza superata.
 * Ritorna il numero di prenotazioni annullate.
 */
export async function expireUnpaidBookings(): Promise<number> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return 0;
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("bookings")
      .update({
        status: "annullata",
        supplier_response: "Annullata automaticamente: quota di servizio non versata nei termini.",
      })
      .eq("status", "confermata")
      .not("payment_deadline", "is", null)
      .lt("payment_deadline", new Date().toISOString())
      .select("id");
    if (error) {
      console.warn("[payment-window] impossibile annullare le scadute:", error.message);
      return 0;
    }
    return data?.length ?? 0;
  } catch (e) {
    console.warn("[payment-window] errore", e);
    return 0;
  }
}

/** Minuti mancanti alla scadenza (0 se già scaduta o assente). */
export function minutesLeft(deadline?: string | null): number {
  if (!deadline) return 0;
  const ms = new Date(deadline).getTime() - Date.now();
  return ms > 0 ? Math.ceil(ms / 60_000) : 0;
}

/** True se la prenotazione è confermata ma non ancora pagata. */
export function isAwaitingPayment(status: string): boolean {
  return status === "confermata";
}

export { getPlatformPolicy };
