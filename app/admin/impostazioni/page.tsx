import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PolicySettingsForm from "@/components/admin/PolicySettingsForm";
import { requireRole } from "@/lib/supabase/auth-helpers";
import { getPlatformPolicy } from "@/lib/settings";
import { ADMIN_NAV } from "@/lib/admin-nav";

export const metadata = { title: "Impostazioni" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const profile = await requireRole("admin");
  const policy = await getPlatformPolicy();

  return (
    <DashboardLayout
      profile={profile}
      nav={ADMIN_NAV}
      title="Impostazioni"
      subtitle="Configura le regole operative della piattaforma."
    >
      <PolicySettingsForm
        initialHours={policy.cancellationHours}
        initialRefundPolicy={policy.refundPolicy}
      />
    </DashboardLayout>
  );
}
