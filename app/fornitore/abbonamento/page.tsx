import { LayoutDashboard, Compass, Calendar, CreditCard, AlertCircle, Sparkles } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SubscriptionPayButton from "@/components/dashboard/SubscriptionPayButton";
import { requireRole } from "@/lib/supabase/auth-helpers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { computeBilling, getLaunchDate, ACTIVATION_FEE_CENTS } from "@/lib/subscription";
import { formatEur } from "@/lib/types";

export const metadata = { title: "Abbonamento" };
export const dynamic = "force-dynamic";

export default async function SupplierSubscriptionPage() {
  const profile = await requireRole("fornitore");
  const supabase = createSupabaseServerClient();
  const { data: supplier } = await supabase
    .from("suppliers")
    .select("*")
    .eq("profile_id", profile.id)
    .maybeSingle();

  const launchDate = await getLaunchDate();
  const billing = supplier ? computeBilling(supplier, launchDate) : null;
  const isVetrina = supplier?.mode === "vetrina";

  const payable = billing?.phase === "da_pagare" || billing?.phase === "attivazione";
  const renewal =
    billing?.phase === "attivo" && supplier?.current_period_end
      ? new Date(supplier.current_period_end)
      : billing?.freeUntil;
  const daysLeft = renewal
    ? Math.max(0, Math.ceil((renewal.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

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
      {billing && (billing.phase === "promo" || billing.phase === "attesa_lancio") && (
        <div className="rounded-2xl p-5 mb-6 flex items-start gap-3 border bg-ws-blue-pale border-ws-blue/15">
          <Sparkles size={20} className="text-ws-blue flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-ws-dark">Partner fondatore Wondersun</p>
            <p className="text-sm text-ws-text">{billing.label}.</p>
          </div>
        </div>
      )}
      {payable && (
        <div className="rounded-2xl p-5 mb-6 flex items-start gap-3 border bg-ws-yellow/15 border-ws-yellow/30">
          <AlertCircle size={20} className="text-ws-yellow-dark flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-ws-dark">
              {billing?.phase === "attivazione"
                ? "Completa l'attivazione per pubblicare le tue schede"
                : "Attiva il canone per continuare a ricevere clienti"}
            </p>
            <p className="text-sm text-ws-text">{billing?.label}.</p>
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
              <p className="font-display text-2xl font-bold text-ws-dark">
                {isVetrina ? "Vetrina Wondersun" : "Fornitore Wondersun"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 mb-8">
            <div>
              <p className="text-xs text-ws-text-light">Stato</p>
              <p className="font-bold text-ws-text">
                {billing?.phase === "attivo"
                  ? "Canone attivo"
                  : billing?.phase === "promo"
                    ? "Periodo gratuito"
                    : billing?.phase === "attesa_lancio"
                      ? "In attesa del lancio"
                      : billing?.phase === "attivazione"
                        ? "Da attivare"
                        : "Canone da attivare"}
              </p>
            </div>
            <div>
              <p className="text-xs text-ws-text-light">Canone</p>
              <p className="font-bold text-ws-text">€29 / mese</p>
            </div>
            <div>
              <p className="text-xs text-ws-text-light">
                {billing?.phase === "attivo" ? "Prossimo rinnovo" : "Periodo gratuito fino al"}
              </p>
              <p className="font-bold text-ws-text">
                {renewal ? renewal.toLocaleDateString("it-IT") : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-ws-text-light">Giorni rimanenti</p>
              <p className="font-bold text-ws-text">{daysLeft ?? "—"}</p>
            </div>
          </div>

          <div className="bg-ws-blue-pale rounded-xl p-4 text-sm text-ws-blue-dark mb-6">
            <strong>Come funziona:</strong>{" "}
            {supplier?.is_founding_partner ? (
              <>
                come partner fondatore hai{" "}
                {isVetrina ? "1 mese gratuito" : "3 mesi gratuiti"} dalla data di lancio della
                piattaforma, poi il canone è di €29/mese.
              </>
            ) : (
              <>
                l&apos;attivazione una tantum è di {formatEur(ACTIVATION_FEE_CENTS)} (primo mese
                incluso), poi il canone è di €29/mese.
              </>
            )}{" "}
            {isVetrina ? (
              <>
                La tua scheda è in modalità vetrina: i clienti ti contattano direttamente e non
                paghi alcuna percentuale sulle prenotazioni.
              </>
            ) : (
              <>
                Su ogni prenotazione il cliente paga online la quota Wondersun (15%); la tua parte
                la incassi direttamente al momento dell&apos;esperienza.
              </>
            )}
          </div>

          {payable ? (
            <SubscriptionPayButton
              label={
                billing?.phase === "attivazione"
                  ? `Attiva ora · ${formatEur(ACTIVATION_FEE_CENTS)} + €29/mese`
                  : "Attiva canone €29/mese"
              }
            />
          ) : (
            <p className="text-center text-sm font-semibold text-ws-text-light border border-dashed border-gray-200 rounded-xl py-3">
              {billing?.phase === "attivo"
                ? "Canone attivo — nessuna azione necessaria"
                : "Niente da pagare in questo momento"}
            </p>
          )}
          <p className="text-xs text-ws-text-light mt-3 text-center">
            Pagamento sicuro con Stripe.
          </p>
        </div>

        <div className="bg-gradient-to-br from-ws-blue-deeper via-ws-blue-dark to-ws-blue text-white rounded-2xl p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-2">
            Cosa è incluso
          </p>
          <ul className="space-y-3 text-sm">
            {(isVetrina
              ? [
                  "Scheda vetrina con foto e descrizione",
                  "Recapiti diretti: telefono, WhatsApp, email, sito",
                  "Visibilità nel catalogo e nel concierge Sole",
                  "Nessuna percentuale sulle prenotazioni",
                  "Modifica della scheda in autonomia",
                  "Supporto prioritario",
                ]
              : [
                  "Dashboard completa",
                  "Esperienze illimitate",
                  "Gestione richieste di prenotazione",
                  "Notifiche email + WhatsApp sulle nuove richieste",
                  "Pagamenti online sicuri",
                  "Statistiche prenotazioni",
                  "Supporto prioritario",
                ]
            ).map((f) => (
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
