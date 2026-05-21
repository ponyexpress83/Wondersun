import { notFound, redirect } from "next/navigation";
import { LayoutDashboard, Compass, Calendar, CreditCard } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ExperienceEditor from "@/components/dashboard/ExperienceEditor";
import { requireRole } from "@/lib/supabase/auth-helpers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Experience } from "@/lib/types";

export const metadata = { title: "Modifica esperienza" };

export default async function EditExperiencePage({ params }: { params: { id: string } }) {
  const profile = await requireRole("fornitore");
  const supabase = createSupabaseServerClient();

  const { data: supplier } = await supabase
    .from("suppliers")
    .select("id")
    .eq("profile_id", profile.id)
    .maybeSingle();
  if (!supplier) redirect("/fornitore/registrati");

  const { data: experience } = await supabase
    .from("experiences")
    .select("*")
    .eq("id", params.id)
    .eq("supplier_id", supplier.id)
    .maybeSingle();
  if (!experience) notFound();

  const nav = [
    { href: "/fornitore/dashboard", label: "Panoramica", icon: LayoutDashboard },
    { href: "/fornitore/esperienze", label: "Le mie esperienze", icon: Compass },
    { href: "/fornitore/prenotazioni", label: "Prenotazioni", icon: Calendar },
    { href: "/fornitore/abbonamento", label: "Abbonamento", icon: CreditCard },
  ];

  return (
    <DashboardLayout
      profile={profile}
      nav={nav}
      title="Modifica esperienza"
      subtitle={(experience as Experience).title}
    >
      <ExperienceEditor supplierId={supplier.id} experience={experience as Experience} />
    </DashboardLayout>
  );
}
