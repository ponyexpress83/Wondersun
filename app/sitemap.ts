import type { MetadataRoute } from "next";
import { listExperiences } from "@/lib/data/experiences";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wondersun.it";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/esperienze", priority: 0.9 },
    { path: "/chi-siamo", priority: 0.7 },
    { path: "/fornitore/registrati", priority: 0.7 },
    { path: "/privacy", priority: 0.3 },
    { path: "/termini", priority: 0.3 },
    { path: "/cookie", priority: 0.3 },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((s) => ({
    url: `${siteUrl}${s.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: s.priority,
  }));

  let experienceEntries: MetadataRoute.Sitemap = [];
  try {
    const list = await listExperiences({});
    experienceEntries = list.map((e) => ({
      url: `${siteUrl}/esperienze/${e.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    // in caso di errore data-layer, resta la sitemap statica
  }

  return [...staticEntries, ...experienceEntries];
}
