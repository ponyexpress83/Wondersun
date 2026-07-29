import { NextResponse } from "next/server";
import { expireUnpaidBookings } from "@/lib/payment-window";

export const dynamic = "force-dynamic";

/**
 * Chiusura delle prenotazioni con finestra di pagamento scaduta.
 *
 * L'annullamento avviene già alla consultazione delle pagine (cliente, fornitore
 * e admin), quindi il comportamento è immediato per chi usa la piattaforma.
 * Questo endpoint serve come rete di sicurezza per le posizioni che nessuno
 * apre: è richiamato dal cron di Vercel (vedi vercel.json).
 */
export async function GET() {
  const expired = await expireUnpaidBookings();
  return NextResponse.json({ ok: true, annullate: expired, ts: new Date().toISOString() });
}
