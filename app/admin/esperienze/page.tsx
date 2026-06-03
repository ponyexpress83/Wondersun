import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Store,
  Calendar,
  BarChart3,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminExperienceActions from "@/components/dashboard/AdminExperienceActions";
import { requireRole } from "@/lib/supabase/auth-helpers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatEur } from "@/lib/types";
import { ADMIN_NAV } from "@/lib/admin-nav";

export const metadata = { title: "Esperienze · Admin" };

const STATUS_META: Record<string, { label: string; cls: string }> = {
  bozza: { label: "Bozza", cls: "ws-badge-yellow" },
  pubblicata: { label: "Pubblicata", cls: "ws-badge-green" },
  sospesa: { label: "Sospesa", cls: "ws-badge-red" },
};

const TABS = [
  { key: "pubblicata", label: "Pubblicate" },
  { key: "bozza", label: "Bozze" },
  { key: "sospesa", label: "Sospese" },
  { key: "tutti", label: "Tutte" },
];

export default async function AdminExperiencesPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const profile = await requireRole("admin");
  const supabase = createSupabaseServerClient();

  const active = searchParams.status ?? "pubblicata";

  const { data: all = [] } = await supabase
    .from("experiences")
    .select("*, supplier:suppliers(business_name, city)")
    .order("created_at", { ascending: false });

  const experiences = all as any[];
  const counts = experiences.reduce<Record<string, number>>((acc, e) => {
    acc[e.status] = (acc[e.status] ?? 0) + 1;
    return acc;
  }, {});

  const filtered =
    active === "tutti" ? experiences : experiences.filter((e) => e.status === active);

  const nav = ADMIN_NAV;

  return (
    <DashboardLayout
      profile={profile}
      nav={nav}
      title="Catalogo esperienze"
      subtitle="Modera il catalogo: sospendi o ripristina le esperienze pubblicate."
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => {
          const isActive = active === t.key;
          const count = t.key === "tutti" ? experiences.length : (counts[t.key] ?? 0);
          return (
            <Link
              key={t.key}
              href={`/admin/esperienze?status=${t.key}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-ws-blue text-white"
                  : "bg-white border border-gray-200 text-ws-text hover:border-ws-blue hover:text-ws-blue"
              }`}
            >
              {t.label}
              <span className={`ml-2 text-xs ${isActive ? "text-white/80" : "text-ws-text-light"}`}>
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-ws-card">
          <BarChart3 size={48} className="text-ws-text-light mx-auto mb-4" />
          <p className="font-display text-2xl font-bold text-ws-dark mb-2">
            Nessuna esperienza in questa vista
          </p>
          <p className="text-ws-text-light">Cambia filtro per vedere altre esperienze.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-ws-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ws-ivory border-b border-gray-100">
              <tr>
                {["Esperienza", "Fornitore", "Categoria", "Prezzo", "Prenotazioni", "Stato", "Azioni"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 font-bold text-xs uppercase tracking-widest text-ws-text-light"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((e) => {
                const meta = STATUS_META[e.status] ?? { label: e.status, cls: "ws-badge-blue" };
                return (
                  <tr key={e.id} className="hover:bg-ws-ivory/40">
                    <td className="px-4 py-3">
                      <Link
                        href={`/esperienze/${e.id}`}
                        className="font-semibold text-ws-text hover:text-ws-blue hover:underline"
                      >
                        {e.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ws-text">{e.supplier?.business_name ?? "—"}</td>
                    <td className="px-4 py-3 text-ws-text-light">{e.category}</td>
                    <td className="px-4 py-3 font-semibold text-ws-text">{formatEur(e.price_cents)}</td>
                    <td className="px-4 py-3 text-ws-text">{e.bookings_count ?? 0}</td>
                    <td className="px-4 py-3">
                      <span className={`ws-badge ${meta.cls} text-[0.65rem]`}>{meta.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <AdminExperienceActions experienceId={e.id} status={e.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
