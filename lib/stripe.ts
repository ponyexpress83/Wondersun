import { createHmac, timingSafeEqual } from "crypto";

/**
 * Client Stripe minimale basato su fetch (niente SDK: l'API Stripe è REST
 * form-encoded). Confermato SOLO Stripe dalla committente (call 04/06) —
 * PayPal escluso. Tutto è gated da STRIPE_SECRET_KEY: senza chiave gli
 * endpoint rispondono "pending" senza simulare incassi.
 *
 * Modalità Standard (NON Connect): incassa esclusivamente il conto della
 * Committente, e SOLO la quota del servizio digitale (vedi
 * docs/SEPARAZIONE-DOCUMENTALE.md).
 */

const API = "https://api.stripe.com/v1";

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

function flatten(params: Record<string, unknown>, prefix = ""): [string, string][] {
  const out: [string, string][] = [];
  for (const [k, v] of Object.entries(params)) {
    if (v == null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (typeof item === "object") out.push(...flatten(item as Record<string, unknown>, `${key}[${i}]`));
        else out.push([`${key}[${i}]`, String(item)]);
      });
    } else if (typeof v === "object") {
      out.push(...flatten(v as Record<string, unknown>, key));
    } else {
      out.push([key, String(v)]);
    }
  }
  return out;
}

async function stripeCall<T = any>(path: string, params: Record<string, unknown>): Promise<T> {
  const body = new URLSearchParams(flatten(params)).toString();
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.message ?? `Stripe ${path} HTTP ${res.status}`);
  }
  return json as T;
}

const RECEIPT_CAUSALE = "Servizio di prenotazione digitale personalizzata";

/** Checkout one-shot per la quota Wondersun di una prenotazione confermata. */
export async function createBookingCheckout(opts: {
  bookingId: string;
  bookingCode: string;
  amountCents: number;
  customerEmail?: string | null;
  siteUrl: string;
}): Promise<{ url: string; sessionId: string }> {
  const session = await stripeCall<{ id: string; url: string }>("/checkout/sessions", {
    mode: "payment",
    customer_email: opts.customerEmail ?? undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: opts.amountCents,
          product_data: {
            name: RECEIPT_CAUSALE,
            description: `Prenotazione ${opts.bookingCode}`,
          },
        },
      },
    ],
    payment_intent_data: {
      description: `${RECEIPT_CAUSALE} · ${opts.bookingCode}`,
      metadata: { booking_id: opts.bookingId, kind: "booking_fee" },
    },
    metadata: { booking_id: opts.bookingId, kind: "booking_fee" },
    success_url: `${opts.siteUrl}/dashboard?pagamento=ok`,
    cancel_url: `${opts.siteUrl}/dashboard?pagamento=annullato`,
  });
  return { url: session.url, sessionId: session.id };
}

/** Checkout abbonamento canone €29/mese (con eventuale quota attivazione €99). */
export async function createSubscriptionCheckout(opts: {
  supplierId: string;
  customerEmail?: string | null;
  activationFeeCents: number;
  siteUrl: string;
}): Promise<{ url: string; sessionId: string }> {
  const priceId = process.env.STRIPE_SUPPLIER_SUBSCRIPTION_PRICE_ID;
  if (!priceId) {
    throw new Error(
      "STRIPE_SUPPLIER_SUBSCRIPTION_PRICE_ID mancante: crea il prezzo ricorrente €29/mese in Stripe Dashboard.",
    );
  }
  const lineItems: Record<string, unknown>[] = [{ price: priceId, quantity: 1 }];
  if (opts.activationFeeCents > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: opts.activationFeeCents,
        product_data: {
          name: "Attivazione piattaforma Wondersun",
          description: "Quota una tantum · primo mese incluso",
        },
      },
    });
  }
  const session = await stripeCall<{ id: string; url: string }>("/checkout/sessions", {
    mode: "subscription",
    customer_email: opts.customerEmail ?? undefined,
    line_items: lineItems,
    subscription_data: {
      metadata: { supplier_id: opts.supplierId, kind: "supplier_subscription" },
    },
    metadata: { supplier_id: opts.supplierId, kind: "supplier_subscription" },
    success_url: `${opts.siteUrl}/fornitore/abbonamento?pagamento=ok`,
    cancel_url: `${opts.siteUrl}/fornitore/abbonamento?pagamento=annullato`,
  });
  return { url: session.url, sessionId: session.id };
}

/**
 * Verifica la firma del webhook Stripe (header Stripe-Signature) senza SDK.
 * https://stripe.com/docs/webhooks/signatures
 */
export function verifyWebhookSignature(payload: string, sigHeader: string | null): boolean {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !sigHeader) return false;
  const parts = Object.fromEntries(
    sigHeader.split(",").map((p) => p.split("=") as [string, string]),
  );
  const timestamp = parts["t"];
  const signature = parts["v1"];
  if (!timestamp || !signature) return false;
  // Tolleranza 5 minuti contro replay attack
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}
