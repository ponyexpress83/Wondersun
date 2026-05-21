import { LayoutDashboard, Compass, Calendar, CreditCard } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { requireRole } from "@/lib/supabase/auth-helpers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatEur } from "@/lib/types";

export const metadata = { title: "Prenotazioni ricevute" };

export default async function SupplierBookingsPage() {
  const profile = await requireRole("fornitore");
  const supabase = createSupabaseServerClient();
  const { data: supplier } = await supabase
    .from("suppliers")
    .select("id")
    .eq("profile_id", profile.id)
    .maybeSingle();

  const { data: bookings = [] } = supplier
    ? await supabase
        .from("bookings")
        .select(
          "*, experience:experiences(title, slug, cover_image_url), client:profiles!bookings_client_id_fkey(full_name, email, phone)",
        )
        .eq("supplier_id", supplier.id)
        .order("created_at", { ascending: false })
    : { data: [] };

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
      title="Prenotazioni ricevute"
      subtitle="Gestisci le richieste dei clienti: conferma, rifiuta o proponi una data alternativa."
    >
      {(bookings as any[]).length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-ws-card">
          <Calendar size={48} className="text-ws-text-light mx-auto mb-4" />
          <p className="font-display text-2xl font-bold text-ws-dark mb-2">
            Nessuna prenotazione
          </p>
          <p className="text-ws-text-light">
            Le richieste dei clienti compariranno qui.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-ws-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ws-ivory border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-widest text-ws-text-light">
                  Cliente
                </th>
                <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-widest text-ws-text-light">
                  Esperienza
                </th>
                <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-widest text-ws-text-light">
                  Data
                </th>
                <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-widest text-ws-text-light">
                  Pax
                </th>
                <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-widest text-ws-text-light">
                  Netto
                </th>
                <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-widest text-ws-text-light">
                  Stato
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(bookings as any[]).map((b) => (
                <tr key={b.id} className="hover:bg-ws-ivory/40">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-ws-text">{b.client?.full_name}</p>
                    <p className="text-xs text-ws-text-light">{b.client?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-ws-text">{b.experience?.title}</td>
                  <td className="px-4 py-3 text-ws-text">
                    {new Date(b.requested_date).toLocaleDateString("it-IT")}
                  </td>
                  <td className="px-4 py-3 text-ws-text">{b.participants}</td>
                  <td className="px-4 py-3 font-semibold text-ws-text">
                    {formatEur(b.supplier_payout_cents)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="ws-badge ws-badge-blue text-[0.65rem]">{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-ws-text-light mt-6">
        Conferma/rifiuto richieste e webhook Stripe arrivano nello Sprint 4 (vedi roadmap).
      </p>
    </DashboardLayout>
  );
}
