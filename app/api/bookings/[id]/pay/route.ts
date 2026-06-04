import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface RouteContext {
  params: { id: string };
}

/**
 * Pagamento della quota Wondersun ("paghi solo quello che vivi"): sbloccato
 * solo DOPO la conferma del fornitore. Il cliente paga online soltanto la quota
 * Wondersun (commission_cents); il saldo lo versa al fornitore in loco.
 *
 * Il provider di pagamento (Stripe vs PayPal) è ancora in valutazione dalla
 * committente (call 23/05/2026): questo endpoint è il punto d'innesto. Finché
 * non è configurato risponde in modo controllato senza simulare incassi.
 */
export async function POST(_request: NextRequest, { params }: RouteContext) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autenticato" }, { status: 401 });

  const { data: booking, error } = await supabase
    .from("bookings")
    .select("id, client_id, status, commission_cents, booking_code")
    .eq("id", params.id)
    .single();
  if (error || !booking) {
    return NextResponse.json({ error: "Prenotazione non trovata" }, { status: 404 });
  }
  if (booking.client_id !== user.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
  }
  if (booking.status !== "confermata") {
    return NextResponse.json(
      { error: "Il pagamento è disponibile solo dopo la conferma del fornitore." },
      { status: 400 },
    );
  }

  const providerConfigured = Boolean(
    process.env.STRIPE_SECRET_KEY || process.env.PAYPAL_CLIENT_ID,
  );
  if (!providerConfigured) {
    return NextResponse.json(
      {
        error:
          "Pagamenti online in attivazione. Il provider (Stripe/PayPal) è in fase di configurazione.",
        pending: true,
      },
      { status: 503 },
    );
  }

  // TODO: creare la sessione di checkout (Stripe/PayPal) per booking.commission_cents
  // e restituire l'URL di redirect. Il webhook imposterà status='pagata' + paid_at.
  return NextResponse.json(
    { error: "Integrazione provider non ancora implementata.", pending: true },
    { status: 501 },
  );
}
