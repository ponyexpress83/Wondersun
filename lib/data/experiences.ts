import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MOCK_EXPERIENCES } from "@/lib/mock/experiences";
import type { ExperienceWithSupplier } from "@/lib/types";

/**
 * Data layer per le esperienze. Se Supabase è configurato e raggiungibile
 * legge dal database; altrimenti fallback ai dati mock — così la homepage
 * funziona da subito anche senza .env.local compilato.
 */

export type ExperienceSort = "popular" | "price_asc" | "price_desc";

export interface ExperienceFilter {
  category?: string;
  /** Insieme di categorie interne (usato dai gruppi di categoria del catalogo). */
  categories?: string[];
  area?: string;
  minPrice?: number;
  maxPrice?: number;
  minHours?: number;
  maxHours?: number;
  query?: string;
  sort?: ExperienceSort;
  limit?: number;
}

function sortItems(items: ExperienceWithSupplier[], sort?: ExperienceSort) {
  const out = [...items];
  if (sort === "price_asc") out.sort((a, b) => a.price_cents - b.price_cents);
  else if (sort === "price_desc") out.sort((a, b) => b.price_cents - a.price_cents);
  else out.sort((a, b) => (b.bookings_count ?? 0) - (a.bookings_count ?? 0));
  return out;
}

/**
 * Stati abbonamento che tengono il fornitore "in vetrina pubblica".
 * Un fornitore sospeso o scaduto (canone non pagato) sparisce dal catalogo
 * pubblico ma resta visibile a sé stesso e all'admin (gestito dalle RLS +
 * dalle query dashboard). Modello commerciale call 04-10/06.
 */
const VISIBLE_SUBSCRIPTION = new Set(["trial", "attivo"]);

function applyFilters(items: ExperienceWithSupplier[], f: ExperienceFilter) {
  let out = items.filter((e) => e.status === "pubblicata");
  if (f.categories && f.categories.length) out = out.filter((e) => f.categories!.includes(e.category));
  else if (f.category && f.category !== "all") out = out.filter((e) => e.category === f.category);
  if (f.area && f.area !== "all") out = out.filter((e) => e.location_area === f.area);
  if (f.minPrice != null) out = out.filter((e) => e.price_cents >= f.minPrice! * 100);
  if (f.maxPrice != null) out = out.filter((e) => e.price_cents <= f.maxPrice! * 100);
  if (f.minHours != null) out = out.filter((e) => (e.duration_hours ?? 0) >= f.minHours!);
  if (f.maxHours != null) out = out.filter((e) => (e.duration_hours ?? 0) <= f.maxHours!);
  if (f.query) {
    const q = f.query.toLowerCase();
    out = out.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.location_name?.toLowerCase().includes(q),
    );
  }
  out = sortItems(out, f.sort);
  if (f.limit) out = out.slice(0, f.limit);
  return out;
}

export async function listExperiences(
  filter: ExperienceFilter = {},
): Promise<ExperienceWithSupplier[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return applyFilters(MOCK_EXPERIENCES, filter);
  }
  try {
    const supabase = createSupabaseServerClient();
    let q = supabase
      .from("experiences")
      .select(
        "*, supplier:suppliers!inner(id, business_name, city, logo_url, status, subscription_status)",
      )
      .eq("status", "pubblicata")
      .eq("supplier.status", "approvato")
      .in("supplier.subscription_status", ["trial", "attivo"]);
    if (filter.categories && filter.categories.length) q = q.in("category", filter.categories);
    else if (filter.category && filter.category !== "all") q = q.eq("category", filter.category);
    if (filter.area && filter.area !== "all") q = q.eq("location_area", filter.area);
    if (filter.minPrice != null) q = q.gte("price_cents", filter.minPrice * 100);
    if (filter.maxPrice != null) q = q.lte("price_cents", filter.maxPrice * 100);
    if (filter.minHours != null) q = q.gte("duration_hours", filter.minHours);
    if (filter.maxHours != null) q = q.lte("duration_hours", filter.maxHours);
    if (filter.query) {
      q = q.or(
        `title.ilike.%${filter.query}%,description.ilike.%${filter.query}%,location_name.ilike.%${filter.query}%`,
      );
    }
    if (filter.limit) q = q.limit(filter.limit);
    if (filter.sort === "price_asc") q = q.order("price_cents", { ascending: true });
    else if (filter.sort === "price_desc") q = q.order("price_cents", { ascending: false });
    else q = q.order("bookings_count", { ascending: false });
    const { data, error } = await q;
    if (error || !data) {
      console.warn("[experiences] fallback to mock:", error?.message);
      return applyFilters(MOCK_EXPERIENCES, filter);
    }
    // DB raggiungibile ma vuoto (es. seed non ancora caricato): mostriamo i
    // dati demo così il catalogo non appare mai vuoto durante la presentazione.
    if (data.length === 0) {
      console.warn("[experiences] DB vuoto: uso i dati demo");
      return applyFilters(MOCK_EXPERIENCES, filter);
    }
    return data as ExperienceWithSupplier[];
  } catch (e) {
    console.warn("[experiences] db error, fallback to mock", e);
    return applyFilters(MOCK_EXPERIENCES, filter);
  }
}

export async function getExperienceBySlug(slug: string): Promise<ExperienceWithSupplier | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return MOCK_EXPERIENCES.find((e) => e.slug === slug) ?? null;
  }
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("experiences")
      .select(
        "*, supplier:suppliers(id, business_name, city, logo_url, description, contact_email, contact_phone, website, mode)",
      )
      .eq("slug", slug)
      .single();
    if (error || !data) return MOCK_EXPERIENCES.find((e) => e.slug === slug) ?? null;
    return data as ExperienceWithSupplier;
  } catch {
    return MOCK_EXPERIENCES.find((e) => e.slug === slug) ?? null;
  }
}

export async function listExperiencesForSupplier(
  supplierId: string,
): Promise<ExperienceWithSupplier[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from("experiences")
      .select("*")
      .eq("supplier_id", supplierId)
      .order("created_at", { ascending: false });
    return (data as ExperienceWithSupplier[]) ?? [];
  } catch {
    return [];
  }
}
