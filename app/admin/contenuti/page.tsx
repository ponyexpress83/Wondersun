import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { requireRole } from "@/lib/supabase/auth-helpers";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { STATIC_PAGES, type PageSlug } from "@/lib/static-pages";
import ContentEditor from "@/components/admin/ContentEditor";

export const metadata = { title: "Contenuti · Admin" };
export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const profile = await requireRole("admin");
  const admin = createSupabaseAdminClient();
  const { data: pages = [] } = await admin.from("static_pages").select("*");

  const items = (Object.keys(STATIC_PAGES) as PageSlug[]).map((slug) => {
    const existing = (pages as any[]).find((p) => p.slug === slug);
    return {
      slug,
      title: existing?.title ?? STATIC_PAGES[slug].title,
      body_md: existing?.body_md ?? STATIC_PAGES[slug].default,
      updated_at: existing?.updated_at ?? null,
    };
  });

  return (
    <DashboardLayout
      profile={profile}
      nav={ADMIN_NAV}
      title="Contenuti pagine statiche"
      subtitle="Homepage hero, chi siamo, FAQ, privacy, termini e cookie — editabili in markdown."
    >
      <ContentEditor pages={items} />
    </DashboardLayout>
  );
}
