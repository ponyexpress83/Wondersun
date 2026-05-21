import { LayoutDashboard, Compass, Calendar, CreditCard, Sparkles } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
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

  const trialEnds = supplier ? new Date(supplier.trial_ends_at) : null;
  const daysLeft = trialEnds
    ? Math.max(0, Math.ceil((trialEnds.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

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
                {supplier?.subscription_status === "trial" ? "In prova gratuita" : supplier?.subscription_status}
              </p>
            </div>
            <div>
              <p className="text-xs text-ws-text-light">Prezzo</p>
              <p className="font-bold text-ws-text">€29 / mese</p>
            </div>
            <div>
              <p className="text-xs text-ws-text-light">Trial termina il</p>
              <p className="font-bold text-ws-text">
                {trialEnds?.toLocaleDateString("it-IT") ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-ws-text-light">Giorni rimanenti</p>
              <p className="font-bold text-ws-text">{daysLeft}</p>
            </div>
          </div>

          <div className="bg-ws-blue-pale rounded-xl p-4 text-sm text-ws-blue-dark mb-6">
            <strong>Modello marketplace:</strong> oltre al canone, su ogni prenotazione confermata
            Wondersun trattiene il 25% di commissione (oltre €1.000 si applica una fee fissa
            concordata). Il netto viene accreditato sul tuo conto via Stripe.
          </div>

          <button
            disabled
            className="ws-btn-primary w-full opacity-50 cursor-not-allowed"
            title="Attivazione disponibile dallo Sprint 4"
          >
            <Sparkles size={15} />
            Attiva pagamento (in arrivo · Sprint 4)
          </button>
          <p className="text-xs text-ws-text-light mt-3 text-center">
            L&apos;integrazione Stripe sarà attiva con il rilascio Sprint 4.
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
              "Calendario disponibilità",
              "Notifiche email su nuove richieste",
              "Pagamenti Stripe sicuri",
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
