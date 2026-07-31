import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SiteTextsForm from "@/components/admin/SiteTextsForm";
import { requireRole } from "@/lib/supabase/auth-helpers";
import { getSiteTexts } from "@/lib/site-texts";
import { ADMIN_NAV } from "@/lib/admin-nav";

export const metadata = { title: "Testi del sito · Admin" };
export const dynamic = "force-dynamic";

export default async function AdminSiteTextsPage() {
  const profile = await requireRole("admin");
  const texts = await getSiteTexts();

  return (
    <DashboardLayout
      profile={profile}
      nav={ADMIN_NAV}
      title="Testi del sito"
      subtitle="Titoli e descrizioni delle sezioni, modificabili in autonomia."
    >
      <SiteTextsForm initial={texts} />
    </DashboardLayout>
  );
}
