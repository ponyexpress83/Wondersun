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
  /** 'prenotabile' = flusso completo · 'vetrina' = solo visibilità con recapiti diretti. */
  mode: SupplierMode;
  /** Aderente al pre-lancio: promo calcolata dalla data di lancio piattaforma. */
  is_founding_partner: boolean;
  /** Quota di attivazione €99 (post-lancio) saldata in questa data. */
  activation_fee_paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export type SupplierMode = "prenotabile" | "vetrina";

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
  /**
   * Esperienza "premium" a richiesta: la prenotazione non è immediata, il
   * fornitore deve confermare o proporre una data alternativa (es. snorkeling,
   * immersioni, charter). Se false la prenotazione è diretta.
   */
  requires_request: boolean;
  /** false = scheda vetrina: niente calendario/checkout, solo recapiti diretti. */
  is_bookable: boolean;
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
  package_id: string | null;
  created_at: string;
  updated_at: string;
}

export type PackageStatus = "bozza" | "inviato" | "completato";

export interface Package {
  id: string;
  client_id: string;
  name: string;
  notes: string | null;
  status: PackageStatus;
  created_at: string;
  updated_at: string;
}

export interface PackageItem {
  id: string;
  package_id: string;
  experience_id: string;
  requested_date: string | null;
  participants: number;
  created_at: string;
}

export interface ExperienceWithSupplier extends Experience {
  supplier?:
    | (Pick<Supplier, "id" | "business_name" | "city" | "logo_url"> &
        Partial<Pick<Supplier, "description" | "contact_email" | "contact_phone" | "website" | "mode">>)
    | null;
}

export const CATEGORIES = [
  "Mare & Costa",
  "Natura & Avventura",
  "Enogastronomia",
  "Vino & Degustazioni",
  "Sport & Avventura",
  "Cultura & Arte",
  "Benessere",
] as const;

/**
 * Gruppi di categorie mostrati nel filtro del catalogo (5 voci, come da mockup
 * cliente). Ogni gruppo mappa una o più categorie interne: es. "Enogastronomia"
 * include anche "Vino & Degustazioni", "Natura e avventura" include "Sport &
 * Avventura", così nessuna esperienza resta non filtrabile.
 */
export const CATEGORY_GROUPS: {
  value: string;
  label: string;
  cats: string[];
}[] = [
  { value: "mare", label: "Esperienze in mare", cats: ["Mare & Costa"] },
  { value: "cultura", label: "Cultura e storia", cats: ["Cultura & Arte"] },
  { value: "enogastronomia", label: "Enogastronomia", cats: ["Enogastronomia", "Vino & Degustazioni"] },
  { value: "natura", label: "Natura e avventura", cats: ["Natura & Avventura", "Sport & Avventura"] },
  { value: "benessere", label: "Benessere e relax", cats: ["Benessere"] },
];

export const AREAS = ["Argentario", "Manciano", "Sorano", "Arcille", "Orbetello", "Pitigliano"] as const;

/** Ore minime di preavviso per l'annullamento gratuito (call 23/05/2026). */
export const CANCELLATION_HOURS = 48;

export interface PriceBreakdown {
  /** Prezzo dell'esperienza (Servizio Principale), dovuto interamente al Fornitore. */
  total_cents: number;
  is_high_value: boolean;
  model: "percentuale" | "fissa";
  /** Percentuale del Corrispettivo digitale (default 15%). */
  commission_pct: number;
  /** Corrispettivo digitale Wondersun = 15% del prezzo, a carico del cliente. */
  commission_cents: number;
  /** Importo pagato ONLINE dal cliente a Wondersun (= Corrispettivo digitale). */
  pay_now_cents: number;
  /** Prezzo pieno dell'esperienza, pagato DIRETTAMENTE al Fornitore. */
  pay_onsite_cents: number;
  /** Quota fornitore = prezzo pieno (il Fornitore incassa il 100%). */
  supplier_payout_cents: number;
  high_value_fee_cents: number;
}

/**
 * Modello concierge (contratti avvocato + conferma committente 10/07/2026):
 *
 * - Il prezzo dell'esperienza è dovuto INTERAMENTE e DIRETTAMENTE al Fornitore.
 * - Il "Corrispettivo digitale" Wondersun è il 15% del prezzo, a carico del
 *   CLIENTE finale e pagato ONLINE, IN AGGIUNTA (non una trattenuta sul prezzo
 *   del Fornitore, non una commissione).
 *
 * Totale a carico del cliente = prezzo esperienza + 15%.
 * Percentuale configurabile via env WONDERSUN_COMMISSION_PCT (default 15).
 */
export function computeCommission(priceCents: number): PriceBreakdown {
  const pct = Number(process.env.WONDERSUN_COMMISSION_PCT ?? 15);
  const feeCents = Math.round((priceCents * pct) / 100);

  return {
    total_cents: priceCents,
    is_high_value: false,
    model: "percentuale",
    commission_pct: pct,
    commission_cents: feeCents,
    pay_now_cents: feeCents,
    pay_onsite_cents: priceCents,
    supplier_payout_cents: priceCents,
    high_value_fee_cents: 0,
  };
}

export function formatEur(cents: number): string {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);
}
