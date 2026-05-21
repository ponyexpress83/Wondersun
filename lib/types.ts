/**
 * Wondersun · Domain types
 * Type sinonimi del database. In produzione generare via `pnpm db:types`.
 */

export type UserRole = "cliente" | "fornitore" | "admin";

export type SupplierStatus = "in_attesa" | "approvato" | "sospeso" | "rifiutato";

export type SubscriptionStatus = "trial" | "attivo" | "sospeso" | "scaduto" | "cancellato";

export type ExperienceStatus = "bozza" | "pubblicata" | "sospesa";

export type BookingStatus =
  | "richiesta"
  | "confermata"
  | "rifiutata"
  | "data_alternativa"
  | "pagata"
  | "completata"
  | "annullata"
  | "no_show";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  profile_id: string;
  business_name: string;
  vat_number: string | null;
  tax_code: string | null;
  registered_office: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  status: SupplierStatus;
  status_notes: string | null;
  approved_at: string | null;
  approved_by: string | null;
  subscription_status: SubscriptionStatus;
  trial_ends_at: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  supplier_id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  category: string;
  tag: string | null;
  tag_color: string;
  duration_label: string | null;
  duration_hours: number | null;
  min_participants: number;
  max_participants: number;
  price_cents: number;
  price_type: "pro_capite" | "gruppo";
  location_name: string | null;
  location_area: string | null;
  latitude: number | null;
  longitude: number | null;
  cover_image_url: string | null;
  gallery_urls: string[];
  status: ExperienceStatus;
  rating: number;
  reviews_count: number;
  bookings_count: number;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  booking_code: string;
  client_id: string;
  experience_id: string;
  supplier_id: string;
  requested_date: string;
  alternative_date: string | null;
  participants: number;
  notes: string | null;
  status: BookingStatus;
  supplier_response: string | null;
  responded_at: string | null;
  unit_price_cents: number;
  total_cents: number;
  commission_pct: number;
  commission_cents: number;
  supplier_payout_cents: number;
  high_value_fee_cents: number;
  stripe_payment_intent_id: string | null;
  stripe_checkout_session_id: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExperienceWithSupplier extends Experience {
  supplier?: Pick<Supplier, "id" | "business_name" | "city" | "logo_url"> | null;
}

export const CATEGORIES = [
  "Mare & Costa",
  "Natura & Avventura",
  "Enogastronomia",
  "Vino & Degustazioni",
  "Sport & Avventura",
  "Cultura & Arte",
] as const;

export const AREAS = ["Argentario", "Manciano", "Sorano", "Arcille", "Orbetello", "Pitigliano"] as const;

/**
 * Calcola la commissione Wondersun secondo il modello marketplace.
 * - 25% standard sul totale
 * - Fee fissa configurabile per esperienze oltre soglia (default €1.000)
 */
export function computeCommission(totalCents: number): {
  commission_pct: number;
  commission_cents: number;
  high_value_fee_cents: number;
  supplier_payout_cents: number;
} {
  const pct = Number(process.env.WONDERSUN_COMMISSION_PCT ?? 25);
  const thresholdEur = Number(process.env.WONDERSUN_HIGH_VALUE_THRESHOLD ?? 1000);
  const highValueFeeEur = Number(process.env.WONDERSUN_HIGH_VALUE_FIXED_FEE ?? 50);

  const commissionCents = Math.round((totalCents * pct) / 100);
  const highValueFeeCents = totalCents > thresholdEur * 100 ? highValueFeeEur * 100 : 0;
  const supplierPayoutCents = totalCents - commissionCents - highValueFeeCents;

  return {
    commission_pct: pct,
    commission_cents: commissionCents,
    high_value_fee_cents: highValueFeeCents,
    supplier_payout_cents: supplierPayoutCents,
  };
}

export function formatEur(cents: number): string {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);
}
