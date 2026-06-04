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
  /**
   * Esperienza "premium" a richiesta: la prenotazione non è immediata, il
   * fornitore deve confermare o proporre una data alternativa (es. snorkeling,
   * immersioni, charter). Se false la prenotazione è diretta.
   */
  requires_request: boolean;
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

/** Ore minime di preavviso per l'annullamento gratuito (call 23/05/2026). */
export const CANCELLATION_HOURS = 48;

export interface PriceBreakdown {
  total_cents: number;
  /** true se l'esperienza supera la soglia di alto valore (quota fissa). */
  is_high_value: boolean;
  model: "percentuale" | "fissa";
  /** Percentuale effettiva trattenuta (per trasparenza in UI). */
  commission_pct: number;
  /** Quota Wondersun = importo che il cliente paga ONLINE al momento (acconto). */
  commission_cents: number;
  /** Alias esplicito di commission_cents: "paghi ora" online. */
  pay_now_cents: number;
  /** Saldo pagato DIRETTAMENTE al fornitore al momento dell'esperienza. */
  pay_onsite_cents: number;
  /** Quota fornitore = saldo in loco (alias per compatibilità DB). */
  supplier_payout_cents: number;
  /** = commission_cents quando è premium a quota fissa, altrimenti 0. */
  high_value_fee_cents: number;
}

/**
 * Calcola la quota Wondersun "servizio digitale" sul totale della prenotazione.
 *
 * Modello concordato con la committente nelle call 14/05 + 23/05 + 04/06/2026:
 * - **15% del totale** (call 04/06), abbassato dal 25% iniziale per puntare al
 *   volume di conversioni invece che al margine per prenotazione.
 * - **Niente quota fissa premium**: le esperienze sopra €1.000 e le strutture
 *   ricettive (hotel, camping, glamping) NON usano percentuale; per loro è
 *   previsto un canone mensile separato e nessuna prenotazione diretta in
 *   piattaforma — pagina solo "vetrina" con link esterno al fornitore.
 *
 * Il prezzo mostrato in vetrina è già comprensivo della quota. In fase di
 * pagamento l'importo viene scorporato: il cliente paga ONLINE solo la quota
 * Wondersun ("paghi solo quello che vivi" — il concierge digitale) e salda la
 * parte restante DIRETTAMENTE al fornitore al momento dell'esperienza.
 *
 * ⚠ Avvertenza fiscale: una percentuale sul totale assomiglia strutturalmente
 * a una commissione da intermediario. Va validato col commercialista del
 * Committente che il modello "servizio digitale di prenotazione" Art. 2-bis
 * regga ugualmente con questa parametrizzazione. Vedi docs/SEPARAZIONE-DOCUMENTALE.md.
 *
 * Valore configurabile via env: WONDERSUN_COMMISSION_PCT (default 15).
 */
export function computeCommission(totalCents: number): PriceBreakdown {
  const pct = Number(process.env.WONDERSUN_COMMISSION_PCT ?? 15);
  const commissionCents = Math.round((totalCents * pct) / 100);
  const payOnsiteCents = Math.max(0, totalCents - commissionCents);

  return {
    total_cents: totalCents,
    is_high_value: false,
    model: "percentuale",
    commission_pct: pct,
    commission_cents: commissionCents,
    pay_now_cents: commissionCents,
    pay_onsite_cents: payOnsiteCents,
    supplier_payout_cents: payOnsiteCents,
    high_value_fee_cents: 0,
  };
}

export function formatEur(cents: number): string {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);
}
