import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSubscriptionCheckout, stripeConfigured } from "@/lib/stripe";
import { computeBilling, getLaunchDate } from "@/lib/subscription";
import { logAudit } from "@/lib/audit";

/**
 * Attivazione del canone fornitore €29/mese via Stripe Subscription
 * (modifica Art. 8 confermata e saldata il 05/06/2026).
 *
 * Modello promo: partner fondatori gratis 3 mesi (prenotabili) / 1 mese
 * (vetrina) dalla data di lancio; nuovi fornitori post-lancio pagano la
 * quota di attivazione €99 (primo mese incluso) insieme al primo checkout.
 */
export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autenticato" }, { status: 401 });

  const { data: supplier } = await supabase
    .from("suppliers")
    .select(
      "id, profile_id, mode, is_founding_partner, activation_fee_paid_at, subscription_status, current_period_end, contact_email",
    )
    .eq("profile_id", user.id)
    .maybeSingle();
  if (!supplier) {
    return NextResponse.json({ error: "Profilo fornitore non trovato" }, { status: 404 });
  }

  const launchDate = await getLaunchDate();
  const billing = computeBilling(supplier, launchDate);

  if (billing.phase === "attivo") {
    return NextResponse.json(
      { error: "Il canone è già attivo.", info: billing.label },
      { status: 400 },
    );
  }
  if (billing.phase === "promo" || billing.phase === "attesa_lancio") {
    return NextResponse.json(
      { error: `Niente da pagare al momento: ${billing.label}.`, info: billing.label },
      { status: 400 },
    );
  }

  if (!stripeConfigured()) {
    return NextResponse.json(
      {
        error: "Pagamento canone in attivazione: l'account Stripe è in fase di configurazione.",
        pending: true,
      },
      { status: 503 },
    );
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
    const { url, sessionId } = await createSubscriptionCheckout({
      supplierId: supplier.id,
      customerEmail: supplier.contact_email ?? user.email,
      activationFeeCents: billing.activationDueCents,
      siteUrl,
    });

    await logAudit({
      actorId: user.id,
      action: "subscription.checkout.created",
      entityType: "supplier",
      entityId: supplier.id,
      metadata: { activation_cents: billing.activationDueCents, session_id: sessionId },
    });

    return NextResponse.json({ url });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Errore Stripe" },
      { status: 502 },
    );
  }
}
