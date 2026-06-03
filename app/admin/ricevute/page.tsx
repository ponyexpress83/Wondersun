import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { requireRole } from "@/lib/supabase/auth-helpers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { formatEur } from "@/lib/types";
import { Download, AlertCircle } from "lucide-react";

export const metadata = { title: "Ricevute · Admin" };
export const dynamic = "force-dynamic";

export default async function AdminReceiptsPage() {
  const profile = await requireRole("admin");
  const supabase = createSupabaseServerClient();

  const { data: bookings = [] } = await supabase
    .from("bookings")
    .select(
      "id, booking_code, status, paid_at, total_cents, commission_cents, stripe_payment_intent_id, experience:experiences(title)",
    )
    .in("status", ["pagata", "completata"])
    .order("paid_at", { ascending: false })
    .limit(100);

  const total = (bookings as any[]).reduce((s, b) => s + (b.commission_cents ?? 0), 0);

  return (
    <DashboardLayout
      profile={profile}
      nav={ADMIN_NAV}
      title="Ricevute e flussi finanziari"
      subtitle="Solo gli incassi del servizio digitale (commissione Wondersun). Il flusso del servizio turistico avviene fuori piattaforma."
    >
      {!process.env.STRIPE_SECRET_KEY && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-900">Stripe non ancora configurato</p>
            <p className="text-sm text-amber-800 mt-1">
              Imposta <code className="font-mono">STRIPE_SECRET_KEY</code> e gli altri secret in env
              per popolare automaticamente questa vista al primo pagamento reale (Sprint 4).
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KPI label="Ricevute" value={String((bookings as any[]).length)} />
        <KPI label="Quota Wondersun totale" value={formatEur(total)} highlight />
        <div className="rounded-2xl bg-white border border-gray-100 shadow-ws-card p-5 flex items-center justify-center">
          <a href="/api/admin/export" className="ws-btn-blue">
            <Download size={15} /> Esporta CSV commercialista
          </a>
        </div>
      </div>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-ws-card">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="font-display text-xl font-bold text-ws-dark">Ultime ricevute</h2>
        </div>
        {(bookings as any[]).length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-ws-text-light">
            Nessuna ricevuta ancora. Verranno popolate automaticamente al primo pagamento.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-ws-text-light bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Codice</th>
                <th className="px-6 py-3 text-left">Esperienza</th>
                <th className="px-6 py-3 text-left">Data pagamento</th>
                <th className="px-6 py-3 text-right">Totale lordo</th>
                <th className="px-6 py-3 text-right">Quota Wondersun</th>
                <th className="px-6 py-3 text-left">Stripe ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(bookings as any[]).map((b) => (
                <tr key={b.id}>
                  <td className="px-6 py-3 font-mono font-bold text-ws-blue">{b.booking_code}</td>
                  <td className="px-6 py-3">{b.experience?.title}</td>
                  <td className="px-6 py-3 text-ws-text-light">
                    {b.paid_at ? new Date(b.paid_at).toLocaleDateString("it-IT") : "—"}
                  </td>
                  <td className="px-6 py-3 text-right">{formatEur(b.total_cents)}</td>
                  <td className="px-6 py-3 text-right font-bold">{formatEur(b.commission_cents)}</td>
                  <td className="px-6 py-3 font-mono text-xs text-ws-text-light">
                    {b.stripe_payment_intent_id ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </DashboardLayout>
  );
}

function KPI({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-2xl p-5 border ${highlight ? "bg-ws-blue text-white border-ws-blue" : "bg-white border-gray-100"} shadow-ws-card`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-widest mb-1 ${highlight ? "text-white/70" : "text-ws-text-light"}`}
      >
        {label}
      </p>
      <p className={`font-display text-3xl font-bold ${highlight ? "text-white" : "text-ws-blue"}`}>
        {value}
      </p>
    </div>
  );
}
