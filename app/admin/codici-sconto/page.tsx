import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { requireRole } from "@/lib/supabase/auth-helpers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ADMIN_NAV } from "@/lib/admin-nav";
import DiscountCodeManager from "@/components/admin/DiscountCodeManager";

export const metadata = { title: "Codici sconto · Admin" };
export const dynamic = "force-dynamic";

export default async function AdminDiscountsPage() {
  const profile = await requireRole("admin");
  const supabase = createSupabaseServerClient();
  const { data: codes = [] } = await supabase
    .from("discount_codes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <DashboardLayout
      profile={profile}
      nav={ADMIN_NAV}
      title="Codici sconto"
      subtitle="Sconti applicabili in checkout sulla quota Wondersun (mai sulla quota fornitore)."
    >
      <DiscountCodeManager initialCodes={codes as any[]} />
    </DashboardLayout>
  );
}
