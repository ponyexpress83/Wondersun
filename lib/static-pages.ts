import { createSupabaseAdminClient } from "@/lib/supabase/server";

/**
 * Slug delle pagine statiche editabili da admin (Allegato A § 4.1).
 * Il default è il fallback hardcoded; quando l'admin salva, sovrascrive in DB.
 */
export const STATIC_PAGES = {
  homepage_hero: { title: "Hero homepage", default: "Le esperienze più autentiche della Maremma, scelte una a una." },
  chi_siamo: { title: "Chi siamo", default: "Wondersun nasce per raccontare la Maremma vera attraverso esperienze locali." },
  faq: { title: "FAQ", default: "Domande frequenti su prenotazioni, pagamenti, fornitori." },
  privacy: { title: "Privacy Policy", default: "Informativa privacy redatta dal Committente ai sensi del GDPR." },
  termini: { title: "Termini e Condizioni", default: "Termini di servizio della piattaforma Wondersun." },
  cookie: { title: "Cookie policy", default: "Informativa sui cookie utilizzati." },
} as const;

export type PageSlug = keyof typeof STATIC_PAGES;

export async function getStaticPage(slug: PageSlug): Promise<{ title: string; body_md: string }> {
  const fallback = { title: STATIC_PAGES[slug].title, body_md: STATIC_PAGES[slug].default };
  try {
    const admin = createSupabaseAdminClient();
    const { data } = await admin.from("static_pages").select("title,body_md").eq("slug", slug).maybeSingle();
    if (!data) return fallback;
    return { title: data.title ?? fallback.title, body_md: data.body_md ?? fallback.body_md };
  } catch {
    return fallback;
  }
}
