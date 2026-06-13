import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { requireRole } from "@/lib/supabase/auth-helpers";
import { ADMIN_NAV } from "@/lib/admin-nav";
import SupplierCreateForm from "@/components/admin/SupplierCreateForm";

export const metadata = { title: "Nuovo fornitore · Admin" };

export default async function AdminNewSupplierPage() {
  const profile = await requireRole("admin");

  return (
    <DashboardLayout
      profile={profile}
      nav={ADMIN_NAV}
      title="Nuovo fornitore"
      subtitle="Carica un partner: viene creato già approvato, con il suo account di accesso."
    >
      <Link
        href="/admin/fornitori"
        className="inline-flex items-center gap-2 text-sm font-semibold text-ws-blue hover:underline mb-5"
      >
        <ArrowLeft size={15} /> Torna ai fornitori
      </Link>
      <div className="max-w-2xl">
        <SupplierCreateForm />
      </div>
    </DashboardLayout>
  );
}
