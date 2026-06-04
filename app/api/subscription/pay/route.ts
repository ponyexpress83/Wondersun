import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Pagamento del canone mensile fornitore (€29/mese, primi 3 mesi gratis).
 * La committente (call 23/05/2026) vuole che il fornitore possa pagare il
 * canone direttamente dalla dashboard.
 *
 * Provider (Stripe/PayPal) ancora in valutazione: questo è il punto d'innesto.
 * Finché non è configurato risponde in modo controllato senza simulare incassi.
 */
export async function POST(_request: NextRequest) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autenticato" }, { status: 401 });

  const { data: supplier } = await supabase
    .from("suppliers")
    .select("id, profile_id")
    .eq("profile_id", user.id)
    .maybeSingle();
  if (!supplier) {
    return NextResponse.json({ error: "Profilo fornitore non trovato" }, { status: 404 });
  }

  const providerConfigured = Boolean(
    process.env.STRIPE_SECRET_KEY || process.env.PAYPAL_CLIENT_ID,
  );
  if (!providerConfigured) {
    return NextResponse.json(
      {
        error:
          "Pagamento canone in attivazione. Il provider (Stripe/PayPal) è in fase di configurazione.",
        pending: true,
      },
      { status: 503 },
    );
  }

  // TODO: avviare l'abbonamento ricorrente €29/mese (Stripe Billing / PayPal
  // subscriptions). Il webhook aggiornerà subscription_status e current_period_end.
  return NextResponse.json(
    { error: "Integrazione provider non ancora implementata.", pending: true },
    { status: 501 },
  );
}
