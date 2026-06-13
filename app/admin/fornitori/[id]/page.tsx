import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus, ExternalLink } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { requireRole } from "@/lib/supabase/auth-helpers";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { formatEur } from "@/lib/types";

export const metadata = { title: "Fornitore · Admin" };
export const dynamic = "force-dynamic";

export default async function AdminSupplierDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const profile = await requireRole("admin");
  const db = createSupabaseAdminClient();

  const { data: supplier } = await db
    .from("suppliers")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();
  if (!supplier) notFound();

  const { data: experiences = [] } = await db
    .from("experiences")
    .select("id, title, slug, status, price_cents, category, is_bookable")
    .eq("supplier_id", params.id)
    .order("created_at", { ascending: false });

  const isVetrina = supplier.mode === "vetrina";

  return (
    <DashboardLayout
      profile={profile}
      nav={ADMIN_NAV}
      title={supplier.business_name}
      subtitle={`${isVetrina ? "Vetrina · contatto diretto" : "Prenotabile"} · ${supplier.city ?? ""}`}
    >
      <Link
        href="/admin/fornitori"
        className="inline-flex items-center gap-2 text-sm font-semibold text-ws-blue hover:underline mb-5"
      >
        <ArrowLeft size={15} /> Torna ai fornitori
      </Link>

      {/* Dati fornitore */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-ws-card p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <Info label="Email accesso/contatto" value={supplier.contact_email} />
          <Info label="Telefono" value={supplier.contact_phone} />
          <Info label="P. IVA" value={supplier.vat_number} />
          <Info label="Sito" value={supplier.website} link />
          <Info label="Stato" value={supplier.status} />
          <Info
            label="Abbonamento"
            value={`${supplier.subscription_status}${supplier.is_founding_partner ? " · fondatore" : ""}`}
          />
        </div>
        {supplier.description && (
          <p className="text-sm text-ws-text-light mt-4 border-t border-gray-100 pt-4 leading-relaxed">
            {supplier.description}
          </p>
        )}
      </section>

      {/* Esperienze */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-ws-card">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-ws-dark">
              {isVetrina ? "Schede vetrina" : "Esperienze"}
            </h2>
            <p className="text-xs text-ws-text-light mt-0.5">
              {experiences.length} {experiences.length === 1 ? "voce" : "voci"} pubblicate o in bozza
            </p>
          </div>
          <Link
            href={`/admin/fornitori/${params.id}/esperienze/nuova`}
            className="ws-btn-blue text-sm"
          >
            <Plus size={15} /> Nuova {isVetrina ? "scheda" : "esperienza"}
          </Link>
        </div>

        {experiences.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-ws-text-light">
            Nessuna esperienza ancora. Aggiungi la prima con il pulsante qui sopra.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {experiences.map((e: any) => (
              <li key={e.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-bold text-ws-text truncate">{e.title}</p>
                  <p className="text-xs text-ws-text-light">
                    {e.category} · {e.price_cents > 0 ? formatEur(e.price_cents) : "—"} ·{" "}
                    <span className={e.status === "pubblicata" ? "text-green-600" : ""}>
                      {e.status}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Link
                    href={`/esperienze/${e.slug}`}
                    target="_blank"
                    className="text-xs font-semibold text-ws-text-light hover:text-ws-blue inline-flex items-center gap-1"
                  >
                    Vedi <ExternalLink size={12} />
                  </Link>
                  <Link
                    href={`/admin/fornitori/${params.id}/esperienze/${e.id}`}
                    className="text-xs font-semibold text-ws-blue hover:underline"
                  >
                    Modifica
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </DashboardLayout>
  );
}

function Info({ label, value, link }: { label: string; value?: string | null; link?: boolean }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-ws-text-light">{label}</p>
      {link ? (
        <a href={value} target="_blank" rel="noreferrer" className="font-semibold text-ws-blue hover:underline break-all">
          {value}
        </a>
      ) : (
        <p className="font-semibold text-ws-text break-all">{value}</p>
      )}
    </div>
  );
}
