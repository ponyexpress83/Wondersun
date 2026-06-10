import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createBookingCheckout, stripeConfigured } from "@/lib/stripe";
import { logAudit } from "@/lib/audit";

interface RouteContext {
  params: { id: string };
}

/**
 * Pagamento della quota Wondersun ("paghi solo quello che vivi"): sbloccato
 * solo DOPO la conferma del fornitore. Il cliente paga online soltanto la
 * quota Wondersun (commission_cents); il saldo lo versa al fornitore in loco.
 *
 * Richiede l'accettazione esplicita della schermata informativa qualificante
 * (Art. 2-bis del contratto): il client invia { informativaAccepted: true }.
 */
export async function POST(request: NextRequest, { params }: RouteContext) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autenticato" }, { status: 401 });

  let informativaAccepted = false;
  try {
    const body = await request.json();
    informativaAccepted = body?.informativaAccepted === true;
  } catch {
    // body assente → informativa non accettata
  }
  if (!informativaAccepted) {
    return NextResponse.json(
      {
        error: "Devi confermare di aver letto cosa stai pagando.",
        requiresInformativa: true,
      },
      { status: 400 },
    );
  }

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

  if (!stripeConfigured()) {
    return NextResponse.json(
      {
        error: "Pagamenti online in attivazione: l'account Stripe è in fase di configurazione.",
        pending: true,
      },
      { status: 503 },
    );
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
    const { url, sessionId } = await createBookingCheckout({
      bookingId: booking.id,
      bookingCode: booking.booking_code,
      amountCents: booking.commission_cents,
      customerEmail: user.email,
      siteUrl,
    });

    await supabase
      .from("bookings")
      .update({ stripe_checkout_session_id: sessionId })
      .eq("id", booking.id);

    await logAudit({
      actorId: user.id,
      action: "booking.checkout.created",
      entityType: "booking",
      entityId: booking.id,
      metadata: { amount_cents: booking.commission_cents, session_id: sessionId },
    });

    return NextResponse.json({ url });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Errore Stripe" },
      { status: 502 },
    );
  }
}
