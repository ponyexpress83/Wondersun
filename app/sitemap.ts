import type { MetadataRoute } from "next";
import { listExperiences } from "@/lib/data/experiences";

export const dynamic = "force-dynamic";

/** Sitemap dinamica (Allegato A § 6 · SEO on-page). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wondersun.it";

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/esperienze`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/fornitore/registrati`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/termini`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/cookie`, changeFrequency: "yearly", priority: 0.2 },
  ];

  try {
    const experiences = await listExperiences({});
    const expPages: MetadataRoute.Sitemap = experiences.map((e) => ({
      url: `${base}/esperienze/${e.slug}`,
      lastModified: e.updated_at ? new Date(e.updated_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
    return [...staticPages, ...expPages];
  } catch {
    return staticPages;
  }
}
