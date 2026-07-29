import { LayoutDashboard, Compass, Calendar, CreditCard } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SupplierBookingActions from "@/components/dashboard/SupplierBookingActions";
import { requireRole } from "@/lib/supabase/auth-helpers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { expireUnpaidBookings } from "@/lib/payment-window";
import { formatEur } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  richiesta: "Da confermare",
  // Confermata dal fornitore ma quota Wondersun non ancora versata: la
  // prenotazione non è definitiva finché non risulta pagata.
  confermata: "In attesa di pagamento",
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
  // Chiude le prenotazioni la cui finestra di pagamento è scaduta, così l'elenco
  // mostra sempre lo stato reale senza attendere il cron.
  await expireUnpaidBookings();
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
          "*, experience:experiences(title, slug, cover_image_url, requires_request), client:profiles!bookings_client_id_fkey(full_name, email, phone)",
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
      {/* Riepilogo per stato — include le annullate/rifiutate
          (Allegato A § 3.3: nuova, confermata, completata, annullata). */}
      {(bookings as any[]).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Da confermare", match: ["richiesta", "data_alternativa"] },
            { label: "Confermate", match: ["confermata", "pagata"] },
            { label: "Completate", match: ["completata"] },
            { label: "Annullate / rifiutate", match: ["annullata", "rifiutata", "no_show"] },
          ].map((g) => {
            const n = (bookings as any[]).filter((b) => g.match.includes(b.status)).length;
            return (
              <div
                key={g.label}
                className="bg-white rounded-2xl border border-gray-100 shadow-ws-card px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                  {g.label}
                </p>
                <p className="font-display text-2xl font-bold text-ws-blue">{n}</p>
              </div>
            );
          })}
        </div>
      )}

      {(bookings as any[]).length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-ws-card">
          <Calendar size={48} className="text-ws-text-light mx-auto mb-4" />
          <p className="font-display text-2xl font-bold text-ws-dark mb-2">
            Nessuna richiesta ricevuta
          </p>
          <p className="text-gray-600 max-w-lg mx-auto">
            Quando un cliente invia una richiesta per una delle tue esperienze, la trovi qui con i
            suoi dati e i pulsanti per <strong>confermare</strong>, <strong>proporre una data
            alternativa</strong> o <strong>rifiutare</strong>. A esperienza conclusa potrai
            segnarla come completata o come no-show.
          </p>
        </div>
      ) : (
        <>
        {/* MOBILE: una scheda per prenotazione — su telefono la tabella non è
            leggibile e i fornitori usano prevalentemente il mobile. */}
        <div className="md:hidden space-y-4">
          {(bookings as any[]).map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-ws-card p-4"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="font-bold text-ws-text leading-snug">{b.experience?.title}</p>
                <span className="ws-badge ws-badge-blue text-[0.65rem] flex-shrink-0">
                  {STATUS_LABELS[b.status] ?? b.status}
                </span>
              </div>

              <span
                className={`ws-badge text-[0.6rem] ${
                  b.experience?.requires_request ? "ws-badge-yellow" : "ws-badge-green"
                }`}
              >
                {b.experience?.requires_request ? "A richiesta" : "Diretta"}
              </span>

              <div className="mt-3 space-y-1 text-sm">
                <p className="text-ws-text">
                  <span className="text-gray-600">Cliente: </span>
                  <strong>{b.client?.full_name}</strong>
                </p>
                {b.client?.email && (
                  <p className="text-xs text-gray-600 break-all">{b.client.email}</p>
                )}
                {b.client?.phone && <p className="text-xs text-gray-600">{b.client.phone}</p>}
                <p className="text-ws-text">
                  <span className="text-gray-600">Data: </span>
                  {new Date(b.requested_date).toLocaleDateString("it-IT")}
                  {b.status === "data_alternativa" && b.alternative_date && (
                    <span className="block text-xs text-ws-blue">
                      proposta: {new Date(b.alternative_date).toLocaleDateString("it-IT")}
                    </span>
                  )}
                </p>
                <p className="text-ws-text">
                  <span className="text-gray-600">Partecipanti: </span>
                  {b.participants}
                </p>
                <p className="text-ws-text">
                  <span className="text-gray-600">Saldo in loco: </span>
                  <strong>{formatEur(b.supplier_payout_cents)}</strong>
                </p>
              </div>

              <div className="mt-4 border-t border-gray-100 pt-3">
                <SupplierBookingActions bookingId={b.id} status={b.status} />
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP: tabella */}
        <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-ws-card overflow-hidden">
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
                  <td className="px-4 py-3 text-ws-text">
                    {b.experience?.title}
                    {/* Distinzione tra esperienza "a richiesta" (serve la tua
                        conferma) e prenotazione diretta. */}
                    <span
                      className={`ws-badge text-[0.6rem] ml-2 ${
                        b.experience?.requires_request ? "ws-badge-yellow" : "ws-badge-green"
                      }`}
                    >
                      {b.experience?.requires_request ? "A richiesta" : "Diretta"}
                    </span>
                  </td>
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
        </>
      )}

      <p className="text-xs text-ws-text-light mt-6">
        Il saldo indicato è quello che incassi direttamente dal cliente sul posto. Conferma o
        proponi una data alternativa: tutto resta in piattaforma.
      </p>
    </DashboardLayout>
  );
}
