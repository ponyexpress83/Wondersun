import { LayoutDashboard, Compass, Calendar, CreditCard } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SupplierBookingActions from "@/components/dashboard/SupplierBookingActions";
import { requireRole } from "@/lib/supabase/auth-helpers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatEur } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  richiesta: "Da confermare",
  confermata: "Confermata",
  data_alternativa: "Alternativa proposta",
  rifiutata: "Rifiutata",
  pagata: "Pagata",
  completata: "Completata",
  annullata: "Annullata",
  no_show: "No show",
};

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
                  Saldo in loco
                </th>
                <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-widest text-ws-text-light">
                  Stato
                </th>
                <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-widest text-ws-text-light">
                  Azioni
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
                    {b.status === "data_alternativa" && b.alternative_date && (
                      <span className="block text-[0.7rem] text-ws-blue">
                        proposta: {new Date(b.alternative_date).toLocaleDateString("it-IT")}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ws-text">{b.participants}</td>
                  <td className="px-4 py-3 font-semibold text-ws-text">
                    {formatEur(b.supplier_payout_cents)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="ws-badge ws-badge-blue text-[0.65rem]">
                      {STATUS_LABELS[b.status] ?? b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <SupplierBookingActions bookingId={b.id} status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-ws-text-light mt-6">
        Il saldo indicato è quello che incassi direttamente dal cliente sul posto. Conferma o
        proponi una data alternativa: tutto resta in piattaforma.
      </p>
    </DashboardLayout>
  );
}
