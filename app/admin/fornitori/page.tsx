import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Store,
  Calendar,
  BarChart3,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSupplierActions from "@/components/dashboard/AdminSupplierActions";
import SeedMontautoButton from "@/components/admin/SeedMontautoButton";
import { requireRole } from "@/lib/supabase/auth-helpers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Supplier } from "@/lib/types";
import { ADMIN_NAV } from "@/lib/admin-nav";

export const metadata = { title: "Fornitori · Admin" };

const STATUS_META: Record<string, { label: string; cls: string }> = {
  in_attesa: { label: "In attesa", cls: "ws-badge-yellow" },
  approvato: { label: "Approvato", cls: "ws-badge-green" },
  sospeso: { label: "Sospeso", cls: "ws-badge-red" },
  rifiutato: { label: "Rifiutato", cls: "ws-badge-red" },
};

const TABS: { key: string; label: string }[] = [
  { key: "in_attesa", label: "In attesa" },
  { key: "approvato", label: "Approvati" },
  { key: "sospeso", label: "Sospesi" },
  { key: "rifiutato", label: "Rifiutati" },
  { key: "tutti", label: "Tutti" },
];

export default async function AdminSuppliersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const profile = await requireRole("admin");
  const supabase = createSupabaseServerClient();

  const active = searchParams.status ?? "in_attesa";

  const { data: allSuppliers = [] } = await supabase
    .from("suppliers")
    .select("*")
    .order("created_at", { ascending: false });

  const suppliers = allSuppliers as Supplier[];
  const counts = suppliers.reduce<Record<string, number>>((acc, s) => {
    acc[s.status] = (acc[s.status] ?? 0) + 1;
    return acc;
  }, {});

  const filtered =
    active === "tutti" ? suppliers : suppliers.filter((s) => s.status === active);

  const nav = ADMIN_NAV;

  return (
    <DashboardLayout
      profile={profile}
      nav={nav}
      title="Gestione fornitori"
      subtitle="Approva, rifiuta o sospendi gli operatori della piattaforma."
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/fornitori/nuovo" className="ws-btn-blue text-sm">
            <Store size={15} /> Nuovo fornitore
          </Link>
          <SeedMontautoButton />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => {
          const isActive = active === t.key;
          const count = t.key === "tutti" ? suppliers.length : (counts[t.key] ?? 0);
          return (
            <Link
              key={t.key}
              href={`/admin/fornitori?status=${t.key}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-ws-blue text-white"
                  : "bg-white border border-gray-200 text-ws-text hover:border-ws-blue hover:text-ws-blue"
              }`}
            >
              {t.label}
              <span
                className={`ml-2 text-xs ${isActive ? "text-white/80" : "text-ws-text-light"}`}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-ws-card">
          <Store size={48} className="text-ws-text-light mx-auto mb-4" />
          <p className="font-display text-2xl font-bold text-ws-dark mb-2">
            Nessun fornitore in questa vista
          </p>
          <p className="text-ws-text-light">Cambia filtro per vedere altri operatori.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((s) => (
            <SupplierCard key={s.id} supplier={s} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

function SupplierCard({ supplier: s }: { supplier: Supplier }) {
  const meta = STATUS_META[s.status] ?? { label: s.status, cls: "ws-badge-blue" };
  return (
    <section
      id={s.id}
      className="bg-white rounded-2xl border border-gray-100 shadow-ws-card p-6 scroll-mt-24"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <Link
              href={`/admin/fornitori/${s.id}`}
              className="font-display text-2xl font-bold text-ws-dark hover:text-ws-blue transition-colors"
            >
              {s.business_name}
            </Link>
            <span className={`ws-badge ${meta.cls} text-[0.65rem]`}>{meta.label}</span>
            {s.mode === "vetrina" && (
              <span className="ws-badge ws-badge-blue text-[0.65rem]">Vetrina</span>
            )}
          </div>
          <p className="text-xs text-ws-text-light">
            Richiesta del {new Date(s.created_at).toLocaleDateString("it-IT")}
            {s.vat_number ? ` · P.IVA ${s.vat_number}` : ""}
          </p>
        </div>
        <AdminSupplierActions supplierId={s.id} status={s.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-5 text-sm">
        {(s.city || s.province) && (
          <p className="flex items-center gap-2 text-ws-text">
            <MapPin size={14} className="text-ws-blue flex-shrink-0" />
            {s.city}
            {s.province ? ` (${s.province})` : ""}
          </p>
        )}
        {s.contact_email && (
          <p className="flex items-center gap-2 text-ws-text">
            <Mail size={14} className="text-ws-blue flex-shrink-0" />
            <a href={`mailto:${s.contact_email}`} className="hover:underline truncate">
              {s.contact_email}
            </a>
          </p>
        )}
        {s.contact_phone && (
          <p className="flex items-center gap-2 text-ws-text">
            <Phone size={14} className="text-ws-blue flex-shrink-0" />
            {s.contact_phone}
          </p>
        )}
        {s.website && (
          <p className="flex items-center gap-2 text-ws-text">
            <Globe size={14} className="text-ws-blue flex-shrink-0" />
            <a
              href={s.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline truncate"
            >
              {s.website}
            </a>
          </p>
        )}
      </div>

      {s.description && (
        <p className="text-sm text-ws-text-light mt-4 leading-relaxed border-t border-gray-100 pt-4">
          {s.description}
        </p>
      )}

      {s.status_notes && (
        <p className="text-sm mt-3 rounded-lg bg-red-50 border border-red-100 text-ws-red px-3 py-2">
          <strong>Nota:</strong> {s.status_notes}
        </p>
      )}
    </section>
  );
}
