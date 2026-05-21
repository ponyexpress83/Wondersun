import Link from "next/link";
import { LayoutDashboard, Compass, Calendar, CreditCard, PlusCircle, Pencil } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { requireRole } from "@/lib/supabase/auth-helpers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatEur } from "@/lib/types";

export const metadata = { title: "Le mie esperienze" };

export default async function SupplierExperiencesPage() {
  const profile = await requireRole("fornitore");
  const supabase = createSupabaseServerClient();
  const { data: supplier } = await supabase
    .from("suppliers")
    .select("id, business_name")
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (!supplier) {
    return (
      <DashboardLayout profile={profile} nav={[]} title="Completa la registrazione">
        <Link href="/fornitore/registrati" className="ws-btn-primary">
          Completa la registrazione
        </Link>
      </DashboardLayout>
    );
  }

  const { data: experiences = [] } = await supabase
    .from("experiences")
    .select("*")
    .eq("supplier_id", supplier.id)
    .order("created_at", { ascending: false });

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
      title="Le mie esperienze"
      subtitle="Crea, pubblica e gestisci il tuo catalogo."
    >
      <div className="mb-6">
        <Link href="/fornitore/esperienze/nuova" className="ws-btn-primary">
          <PlusCircle size={15} /> Nuova esperienza
        </Link>
      </div>

      {(experiences as any[]).length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-ws-card">
          <Compass size={48} className="text-ws-text-light mx-auto mb-4" />
          <p className="font-display text-2xl font-bold text-ws-dark mb-2">
            Inizia a pubblicare
          </p>
          <p className="text-ws-text-light mb-6 max-w-md mx-auto">
            Crea la tua prima esperienza per essere visibile nel catalogo Wondersun e ricevere
            prenotazioni.
          </p>
          <Link href="/fornitore/esperienze/nuova" className="ws-btn-blue">
            <PlusCircle size={15} /> Crea esperienza
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(experiences as any[]).map((e) => (
            <div
              key={e.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-ws-card"
            >
              {e.cover_image_url && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={e.cover_image_url}
                  alt=""
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="ws-badge ws-badge-blue text-[0.65rem]">{e.category}</span>
                  <span
                    className={`ws-badge text-[0.65rem] ${e.status === "pubblicata" ? "ws-badge-green" : e.status === "bozza" ? "ws-badge-yellow" : "ws-badge-red"}`}
                  >
                    {e.status}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-ws-dark mb-1">{e.title}</h3>
                <p className="text-xs text-ws-text-light line-clamp-2 mb-3">
                  {e.short_description ?? e.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <span className="font-bold text-ws-blue">{formatEur(e.price_cents)}</span>
                  <Link
                    href={`/fornitore/esperienze/${e.id}`}
                    className="text-sm font-semibold text-ws-blue hover:underline flex items-center gap-1"
                  >
                    <Pencil size={13} /> Modifica
                  </Link>
                </div>
                <p className="text-[0.65rem] text-ws-text-light mt-2">
                  {e.bookings_count} prenotazioni totali
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
