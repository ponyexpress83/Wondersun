import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MOCK_EXPERIENCES } from "@/lib/mock/experiences";
import type { ExperienceWithSupplier } from "@/lib/types";

/**
 * Data layer per le esperienze. Se Supabase è configurato e raggiungibile
 * legge dal database; altrimenti fallback ai dati mock — così la homepage
 * funziona da subito anche senza .env.local compilato.
 */

export interface ExperienceFilter {
  category?: string;
  area?: string;
  minPrice?: number;
  maxPrice?: number;
  query?: string;
  limit?: number;
}

function applyFilters(items: ExperienceWithSupplier[], f: ExperienceFilter) {
  let out = items.filter((e) => e.status === "pubblicata");
  if (f.category && f.category !== "all") out = out.filter((e) => e.category === f.category);
  if (f.area && f.area !== "all") out = out.filter((e) => e.location_area === f.area);
  if (f.minPrice != null) out = out.filter((e) => e.price_cents >= f.minPrice! * 100);
  if (f.maxPrice != null) out = out.filter((e) => e.price_cents <= f.maxPrice! * 100);
  if (f.query) {
    const q = f.query.toLowerCase();
    out = out.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.location_name?.toLowerCase().includes(q),
    );
  }
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
      .select("*, supplier:suppliers(id, business_name, city, logo_url)")
      .eq("status", "pubblicata");
    if (filter.category && filter.category !== "all") q = q.eq("category", filter.category);
    if (filter.area && filter.area !== "all") q = q.eq("location_area", filter.area);
    if (filter.minPrice != null) q = q.gte("price_cents", filter.minPrice * 100);
    if (filter.maxPrice != null) q = q.lte("price_cents", filter.maxPrice * 100);
    if (filter.query) {
      q = q.or(
        `title.ilike.%${filter.query}%,description.ilike.%${filter.query}%,location_name.ilike.%${filter.query}%`,
      );
    }
    if (filter.limit) q = q.limit(filter.limit);
    const { data, error } = await q.order("bookings_count", { ascending: false });
    if (error || !data) {
      console.warn("[experiences] fallback to mock:", error?.message);
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
      .select("*, supplier:suppliers(id, business_name, city, logo_url, description, contact_email, contact_phone)")
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
