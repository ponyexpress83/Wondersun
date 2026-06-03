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
import { ADMIN_NAV } from "@/lib/admin-nav";

export const metadata = { title: "Prenotazioni · Admin" };

const STATUS_META: Record<string, { label: string; cls: string }> = {
  richiesta: { label: "Da confermare", cls: "ws-badge-yellow" },
  confermata: { label: "Confermata", cls: "ws-badge-blue" },
  data_alternativa: { label: "Alternativa proposta", cls: "ws-badge-yellow" },
  rifiutata: { label: "Rifiutata", cls: "ws-badge-red" },
  pagata: { label: "Pagata", cls: "ws-badge-green" },
  completata: { label: "Completata", cls: "ws-badge-green" },
  annullata: { label: "Annullata", cls: "ws-badge-red" },
  no_show: { label: "No show", cls: "ws-badge-red" },
};

const TABS = [
  { key: "tutti", label: "Tutte" },
  { key: "richiesta", label: "Da confermare" },
  { key: "confermata", label: "Confermate" },
  { key: "pagata", label: "Pagate" },
  { key: "completata", label: "Completate" },
  { key: "annullata", label: "Annullate" },
];

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const profile = await requireRole("admin");
  const supabase = createSupabaseServerClient();

  const active = searchParams.status ?? "tutti";

  const { data: all = [] } = await supabase
    .from("bookings")
    .select(
      "*, experience:experiences(title), supplier:suppliers(business_name), client:profiles!bookings_client_id_fkey(full_name, email)",
    )
    .order("created_at", { ascending: false });

  const bookings = all as any[];
  const counts = bookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] ?? 0) + 1;
    return acc;
  }, {});

  const filtered = active === "tutti" ? bookings : bookings.filter((b) => b.status === active);

  const earnedCommission = bookings
    .filter((b) => ["pagata", "completata"].includes(b.status))
    .reduce((sum, b) => sum + (b.commission_cents ?? 0), 0);

  const nav = ADMIN_NAV;

  return (
    <DashboardLayout
      profile={profile}
      nav={nav}
      title="Prenotazioni"
      subtitle="Monitora tutte le prenotazioni e le commissioni della piattaforma."
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-ws-card">
          <p className="text-xs font-semibold uppercase tracking-widest text-ws-text-light mb-1">
            Prenotazioni totali
          </p>
          <p className="font-display text-4xl font-bold text-ws-blue">{bookings.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-ws-card">
          <p className="text-xs font-semibold uppercase tracking-widest text-ws-text-light mb-1">
            Commissioni incassate
          </p>
          <p className="font-display text-4xl font-bold text-ws-blue">
            {formatEur(earnedCommission)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-ws-card">
          <p className="text-xs font-semibold uppercase tracking-widest text-ws-text-light mb-1">
            Da confermare
          </p>
          <p className="font-display text-4xl font-bold text-ws-blue">{counts.richiesta ?? 0}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => {
          const isActive = active === t.key;
          const count = t.key === "tutti" ? bookings.length : (counts[t.key] ?? 0);
          return (
            <Link
              key={t.key}
              href={`/admin/prenotazioni?status=${t.key}`}
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
          <Calendar size={48} className="text-ws-text-light mx-auto mb-4" />
          <p className="font-display text-2xl font-bold text-ws-dark mb-2">
            Nessuna prenotazione in questa vista
          </p>
          <p className="text-ws-text-light">Cambia filtro per vedere altre prenotazioni.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-ws-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ws-ivory border-b border-gray-100">
              <tr>
                {["Codice", "Cliente", "Esperienza", "Fornitore", "Data", "Totale", "Commissione", "Stato"].map(
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
              {filtered.map((b) => {
                const meta = STATUS_META[b.status] ?? { label: b.status, cls: "ws-badge-blue" };
                return (
                  <tr key={b.id} className="hover:bg-ws-ivory/40">
                    <td className="px-4 py-3 font-mono text-xs text-ws-text-light">
                      {b.booking_code}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ws-text">{b.client?.full_name ?? "—"}</p>
                      <p className="text-xs text-ws-text-light">{b.client?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-ws-text">{b.experience?.title ?? "—"}</td>
                    <td className="px-4 py-3 text-ws-text">{b.supplier?.business_name ?? "—"}</td>
                    <td className="px-4 py-3 text-ws-text">
                      {new Date(b.requested_date).toLocaleDateString("it-IT")}
                    </td>
                    <td className="px-4 py-3 text-ws-text">{formatEur(b.total_cents)}</td>
                    <td className="px-4 py-3 font-semibold text-ws-blue">
                      {formatEur(b.commission_cents)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`ws-badge ${meta.cls} text-[0.65rem]`}>{meta.label}</span>
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
