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

export const metadata = { title: "Utenti · Admin" };

const ROLE_META: Record<string, { label: string; cls: string }> = {
  cliente: { label: "Cliente", cls: "ws-badge-blue" },
  fornitore: { label: "Fornitore", cls: "ws-badge-green" },
  admin: { label: "Admin", cls: "ws-badge-yellow" },
};

const TABS = [
  { key: "tutti", label: "Tutti" },
  { key: "cliente", label: "Clienti" },
  { key: "fornitore", label: "Fornitori" },
  { key: "admin", label: "Admin" },
];

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const profile = await requireRole("admin");
  const supabase = createSupabaseServerClient();

  const active = searchParams.role ?? "tutti";

  const { data: all = [] } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, role, created_at")
    .order("created_at", { ascending: false });

  const users = all as any[];
  const counts = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] ?? 0) + 1;
    return acc;
  }, {});

  const filtered = active === "tutti" ? users : users.filter((u) => u.role === active);

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
      title="Utenti"
      subtitle="Tutti gli account registrati sulla piattaforma."
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => {
          const isActive = active === t.key;
          const count = t.key === "tutti" ? users.length : (counts[t.key] ?? 0);
          return (
            <Link
              key={t.key}
              href={`/admin/utenti?role=${t.key}`}
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
          <Users size={48} className="text-ws-text-light mx-auto mb-4" />
          <p className="font-display text-2xl font-bold text-ws-dark mb-2">Nessun utente</p>
          <p className="text-ws-text-light">Cambia filtro per vedere altri account.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-ws-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ws-ivory border-b border-gray-100">
              <tr>
                {["Nome", "Email", "Telefono", "Ruolo", "Registrato"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-bold text-xs uppercase tracking-widest text-ws-text-light"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u) => {
                const meta = ROLE_META[u.role] ?? { label: u.role, cls: "ws-badge-blue" };
                return (
                  <tr key={u.id} className="hover:bg-ws-ivory/40">
                    <td className="px-4 py-3 font-semibold text-ws-text">{u.full_name ?? "—"}</td>
                    <td className="px-4 py-3 text-ws-text">{u.email}</td>
                    <td className="px-4 py-3 text-ws-text-light">{u.phone ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`ws-badge ${meta.cls} text-[0.65rem]`}>{meta.label}</span>
                    </td>
                    <td className="px-4 py-3 text-ws-text-light">
                      {new Date(u.created_at).toLocaleDateString("it-IT")}
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
