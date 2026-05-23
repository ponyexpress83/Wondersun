import { LayoutDashboard, Compass, Calendar, CreditCard, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SubscriptionPayButton from "@/components/dashboard/SubscriptionPayButton";
import { requireRole } from "@/lib/supabase/auth-helpers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = { title: "Abbonamento" };

export default async function SupplierSubscriptionPage() {
  const profile = await requireRole("fornitore");
  const supabase = createSupabaseServerClient();
  const { data: supplier } = await supabase
    .from("suppliers")
    .select("*")
    .eq("profile_id", profile.id)
    .maybeSingle();

  const isTrial = supplier?.subscription_status === "trial";
  // Prossima scadenza: fine periodo a pagamento se presente, altrimenti fine trial.
  const renewal = supplier
    ? new Date(supplier.current_period_end ?? supplier.trial_ends_at)
    : null;
  const daysLeft = renewal
    ? Math.max(0, Math.ceil((renewal.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;
  const expiringSoon = daysLeft <= 7;

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
      title="Il tuo abbonamento"
      subtitle="Gestisci il piano fornitore Wondersun."
    >
      {expiringSoon && (
        <div
          className={`rounded-2xl p-5 mb-6 flex items-start gap-3 border ${isTrial ? "bg-ws-blue-pale border-ws-blue/15" : "bg-ws-yellow/15 border-ws-yellow/30"}`}
        >
          <AlertCircle size={20} className="text-ws-yellow-dark flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-ws-dark">
              {isTrial
                ? `La prova gratuita scade tra ${daysLeft} ${daysLeft === 1 ? "giorno" : "giorni"}`
                : `Il canone si rinnova tra ${daysLeft} ${daysLeft === 1 ? "giorno" : "giorni"}`}
            </p>
            <p className="text-sm text-ws-text">
              {isTrial
                ? "Al termine della prova attiva il canone di €29/mese per continuare a ricevere prenotazioni."
                : "Assicurati che il metodo di pagamento sia attivo per non interrompere il servizio."}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-ws-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-ws-blue-pale flex items-center justify-center">
              <CreditCard size={22} className="text-ws-blue" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-ws-text-light">
                Piano attuale
              </p>
              <p className="font-display text-2xl font-bold text-ws-dark">Fornitore Wondersun</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 mb-8">
            <div>
              <p className="text-xs text-ws-text-light">Stato</p>
              <p className="font-bold text-ws-text">
                {isTrial ? "In prova gratuita" : (supplier?.subscription_status ?? "—")}
              </p>
            </div>
            <div>
              <p className="text-xs text-ws-text-light">Canone</p>
              <p className="font-bold text-ws-text">€29 / mese</p>
            </div>
            <div>
              <p className="text-xs text-ws-text-light">
                {isTrial ? "Prova termina il" : "Prossimo rinnovo"}
              </p>
              <p className="font-bold text-ws-text">
                {renewal?.toLocaleDateString("it-IT") ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-ws-text-light">Giorni rimanenti</p>
              <p className="font-bold text-ws-text">{daysLeft}</p>
            </div>
          </div>

          <div className="bg-ws-blue-pale rounded-xl p-4 text-sm text-ws-blue-dark mb-6">
            <strong>Come funziona:</strong> i primi 3 mesi sono gratuiti. Poi il canone è di €29/mese.
            Su ogni prenotazione Wondersun trattiene il 25% (per le esperienze premium oltre €1.000
            una quota fissa). La tua parte la incassi direttamente dal cliente al momento
            dell&apos;esperienza.
          </div>

          <SubscriptionPayButton
            label={isTrial ? "Attiva canone €29/mese" : "Paga canone €29"}
          />
          <p className="text-xs text-ws-text-light mt-3 text-center">
            Pagamento sicuro. Il metodo (Stripe/PayPal) è in fase di configurazione.
          </p>
        </div>

        <div className="bg-gradient-to-br from-ws-blue-deeper via-ws-blue-dark to-ws-blue text-white rounded-2xl p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-2">
            Cosa è incluso
          </p>
          <ul className="space-y-3 text-sm">
            {[
              "Dashboard completa",
              "Esperienze illimitate",
              "Gestione richieste di prenotazione",
              "Notifiche email + WhatsApp sulle nuove richieste",
              "Pagamenti online sicuri",
              "Statistiche prenotazioni",
              "Supporto prioritario",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-ws-yellow" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
