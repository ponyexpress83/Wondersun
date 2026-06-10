import { redirect } from "next/navigation";
import { LayoutDashboard, Compass, Calendar, CreditCard } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ExperienceEditor from "@/components/dashboard/ExperienceEditor";
import { requireRole } from "@/lib/supabase/auth-helpers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = { title: "Nuova esperienza" };

export default async function NewExperiencePage() {
  const profile = await requireRole("fornitore");
  const supabase = createSupabaseServerClient();
  const { data: supplier } = await supabase
    .from("suppliers")
    .select("id, status, mode")
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (!supplier) redirect("/fornitore/registrati");

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
      title="Nuova esperienza"
      subtitle="Compila i dettagli e salva. Puoi pubblicare subito o salvare come bozza."
    >
      <ExperienceEditor supplierId={supplier.id} supplierMode={supplier.mode} />
    </DashboardLayout>
  );
}
