import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { PREFIX, SITE_TEXTS, type SiteTexts } from "@/lib/site-texts-def";

export * from "@/lib/site-texts-def";

/**
 * Legge i testi personalizzati dal database (solo lato server).
 * Ritorna la mappa completa, già riempita con i valori predefiniti.
 */
export async function getSiteTexts(): Promise<SiteTexts> {
  const defaults: SiteTexts = Object.fromEntries(SITE_TEXTS.map((t) => [t.key, t.fallback]));
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return defaults;
  try {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("platform_settings")
      .select("key, value")
      .like("key", `${PREFIX}%`);
    for (const row of data ?? []) {
      const key = String((row as any).key).slice(PREFIX.length);
      const value = (row as any).value;
      if (key in defaults && typeof value === "string" && value.trim()) {
        defaults[key] = value;
      }
    }
    return defaults;
  } catch {
    return defaults;
  }
}
