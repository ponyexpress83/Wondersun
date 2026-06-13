import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { requireRole } from "@/lib/supabase/auth-helpers";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { ADMIN_NAV } from "@/lib/admin-nav";
import ExperienceEditor from "@/components/dashboard/ExperienceEditor";

export const metadata = { title: "Nuova esperienza · Admin" };
export const dynamic = "force-dynamic";

export default async function AdminNewExperiencePage({
  params,
}: {
  params: { id: string };
}) {
  const profile = await requireRole("admin");
  const db = createSupabaseAdminClient();
  const { data: supplier } = await db
    .from("suppliers")
    .select("id, business_name, mode")
    .eq("id", params.id)
    .maybeSingle();
  if (!supplier) notFound();

  return (
    <DashboardLayout
      profile={profile}
      nav={ADMIN_NAV}
      title={`Nuova esperienza · ${supplier.business_name}`}
      subtitle="Compila i dati. Verrà pubblicata sotto questo fornitore."
    >
      <Link
        href={`/admin/fornitori/${params.id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-ws-blue hover:underline mb-5"
      >
        <ArrowLeft size={15} /> Torna al fornitore
      </Link>
      <ExperienceEditor
        supplierId={supplier.id}
        supplierMode={supplier.mode}
        redirectTo={`/admin/fornitori/${params.id}`}
      />
    </DashboardLayout>
  );
}
