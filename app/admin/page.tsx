import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Store,
  Calendar,
  BarChart3,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { requireRole } from "@/lib/supabase/auth-helpers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatEur } from "@/lib/types";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const profile = await requireRole("admin");
  const supabase = createSupabaseServerClient();

  const [{ count: usersCount }, { count: suppliersCount }, { count: experiencesCount }, { count: bookingsCount }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("suppliers").select("*", { count: "exact", head: true }),
      supabase.from("experiences").select("*", { count: "exact", head: true }),
      supabase.from("bookings").select("*", { count: "exact", head: true }),
    ]);

  const { data: pendingSuppliers = [] } = await supabase
    .from("suppliers")
    .select("id, business_name, city, status, created_at")
    .eq("status", "in_attesa")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: latestBookings = [] } = await supabase
    .from("bookings")
    .select(
      "id, booking_code, status, commission_cents, requested_date, experience:experiences(title)",
    )
    .order("created_at", { ascending: false })
    .limit(10);

  const totalCommissions = (latestBookings as any[])
    .filter((b) => ["pagata", "completata"].includes(b.status))
    .reduce((sum, b) => sum + (b.commission_cents ?? 0), 0);

  const nav = [
    { href: "/admin", label: "Panoramica", icon: LayoutDashboard },
    { href: "/admin/fornitori", label: "Fornitori", icon: Store },
    { href: "/admin/esperienze", label: "Esperienze", icon: BarChart3 },
    { href: "/admin/prenotazioni", label: "Prenotazioni", icon: Calendar },
    { href: "/admin/utenti", label: "Utenti", icon: Users },
  ];

  return (
    <DashboardLayout
      profile={profile}
      nav={nav}
      title="Pannello Admin"
      subtitle="Visione d'insieme della piattaforma."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPI label="Utenti" value={usersCount ?? 0} />
        <KPI label="Fornitori" value={suppliersCount ?? 0} />
        <KPI label="Esperienze" value={experiencesCount ?? 0} />
        <KPI label="Prenotazioni" value={bookingsCount ?? 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-gray-100 shadow-ws-card">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-ws-dark">
              Fornitori in attesa di approvazione
            </h2>
            <Link href="/admin/fornitori" className="text-sm font-semibold text-ws-blue hover:underline">
              Vedi tutti
            </Link>
          </div>
          {(pendingSuppliers as any[]).length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-ws-text-light">
              Nessuna candidatura in sospeso.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {(pendingSuppliers as any[]).map((s) => (
                <li key={s.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-ws-text">{s.business_name}</p>
                    <p className="text-xs text-ws-text-light">
                      {s.city} · richiesta del {new Date(s.created_at).toLocaleDateString("it-IT")}
                    </p>
                  </div>
                  <Link
                    href={`/admin/fornitori#${s.id}`}
                    className="text-xs font-semibold text-ws-blue hover:underline"
                  >
                    Esamina →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-ws-card">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="font-display text-xl font-bold text-ws-dark">
              Commissioni incassate (ultime prenotazioni)
            </h2>
          </div>
          <div className="px-6 py-5">
            <p className="font-display text-4xl font-bold text-ws-blue">
              {formatEur(totalCommissions)}
            </p>
            <p className="text-xs text-ws-text-light mt-1">
              Sulle ultime {(latestBookings as any[]).length} prenotazioni pagate/completate.
            </p>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function KPI({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-ws-card">
      <p className="text-xs font-semibold uppercase tracking-widest text-ws-text-light mb-1">
        {label}
      </p>
      <p className="font-display text-4xl font-bold text-ws-blue">{value}</p>
    </div>
  );
}
