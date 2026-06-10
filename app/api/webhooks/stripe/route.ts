import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { verifyWebhookSignature } from "@/lib/stripe";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

/**
 * Webhook Stripe (Allegato A § Sprint 4).
 *
 * Eventi gestiti:
 * - checkout.session.completed (payment)      → prenotazione 'pagata' + paid_at
 * - checkout.session.completed (subscription) → canone fornitore 'attivo'
 * - invoice.paid                              → rinnovo periodo canone
 * - invoice.payment_failed                    → canone 'sospeso'
 *
 * Endpoint da registrare in Stripe Dashboard → Webhooks:
 *   https://<dominio>/api/webhooks/stripe
 * con STRIPE_WEBHOOK_SECRET nelle env.
 */
export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!verifyWebhookSignature(payload, signature)) {
    return NextResponse.json({ error: "Firma webhook non valida" }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(payload);
  } catch {
    return NextResponse.json({ error: "Payload non valido" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data?.object ?? {};
        const kind = session.metadata?.kind;

        if (kind === "booking_fee" && session.metadata?.booking_id) {
          await admin
            .from("bookings")
            .update({
              status: "pagata",
              paid_at: new Date().toISOString(),
              stripe_payment_intent_id: session.payment_intent ?? null,
            })
            .eq("id", session.metadata.booking_id)
            .eq("status", "confermata");
          await logAudit({
            action: "webhook.booking.paid",
            entityType: "booking",
            entityId: session.metadata.booking_id,
            metadata: { session_id: session.id },
          });
        }

        if (kind === "supplier_subscription" && session.metadata?.supplier_id) {
          const update: Record<string, unknown> = {
            subscription_status: "attivo",
            stripe_customer_id: session.customer ?? null,
            stripe_subscription_id: session.subscription ?? null,
          };
          // Se nel checkout era inclusa la quota di attivazione €99 la marchiamo saldata.
          const { data: supplier } = await admin
            .from("suppliers")
            .select("is_founding_partner, activation_fee_paid_at")
            .eq("id", session.metadata.supplier_id)
            .maybeSingle();
          if (supplier && !supplier.is_founding_partner && !supplier.activation_fee_paid_at) {
            update.activation_fee_paid_at = new Date().toISOString();
          }
          await admin.from("suppliers").update(update).eq("id", session.metadata.supplier_id);
          await logAudit({
            action: "webhook.subscription.activated",
            entityType: "supplier",
            entityId: session.metadata.supplier_id,
            metadata: { session_id: session.id },
          });
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data?.object ?? {};
        const subId = invoice.subscription;
        const periodEnd = invoice.lines?.data?.[0]?.period?.end;
        if (subId) {
          await admin
            .from("suppliers")
            .update({
              subscription_status: "attivo",
              current_period_end: periodEnd
                ? new Date(periodEnd * 1000).toISOString()
                : null,
            })
            .eq("stripe_subscription_id", subId);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data?.object ?? {};
        if (invoice.subscription) {
          await admin
            .from("suppliers")
            .update({ subscription_status: "sospeso" })
            .eq("stripe_subscription_id", invoice.subscription);
          await logAudit({
            action: "webhook.subscription.payment_failed",
            entityType: "supplier",
            metadata: { stripe_subscription_id: invoice.subscription },
          });
        }
        break;
      }

      default:
        // Eventi non gestiti: 200 per evitare retry inutili di Stripe.
        break;
    }
  } catch (e) {
    // 500 → Stripe ritenta automaticamente.
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Errore webhook" },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
