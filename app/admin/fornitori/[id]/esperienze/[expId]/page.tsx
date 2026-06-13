import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { requireRole } from "@/lib/supabase/auth-helpers";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { ADMIN_NAV } from "@/lib/admin-nav";
import ExperienceEditor from "@/components/dashboard/ExperienceEditor";
import type { Experience } from "@/lib/types";

export const metadata = { title: "Modifica esperienza · Admin" };
export const dynamic = "force-dynamic";

export default async function AdminEditExperiencePage({
  params,
}: {
  params: { id: string; expId: string };
}) {
  const profile = await requireRole("admin");
  const db = createSupabaseAdminClient();

  const { data: supplier } = await db
    .from("suppliers")
    .select("id, business_name, mode")
    .eq("id", params.id)
    .maybeSingle();
  if (!supplier) notFound();

  const { data: experience } = await db
    .from("experiences")
    .select("*")
    .eq("id", params.expId)
    .eq("supplier_id", params.id)
    .maybeSingle();
  if (!experience) notFound();

  return (
    <DashboardLayout
      profile={profile}
      nav={ADMIN_NAV}
      title="Modifica esperienza"
      subtitle={`${supplier.business_name} · ${(experience as Experience).title}`}
    >
      <Link
        href={`/admin/fornitori/${params.id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-ws-blue hover:underline mb-5"
      >
        <ArrowLeft size={15} /> Torna al fornitore
      </Link>
      <ExperienceEditor
        supplierId={supplier.id}
        experience={experience as Experience}
        supplierMode={supplier.mode}
        redirectTo={`/admin/fornitori/${params.id}`}
      />
    </DashboardLayout>
  );
}
