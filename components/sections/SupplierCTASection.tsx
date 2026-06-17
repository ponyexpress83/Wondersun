import Link from "next/link";
import { Store, TrendingUp, ShieldCheck, Gift } from "lucide-react";

export default function SupplierCTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-ws-blue-deeper via-ws-blue-dark to-ws-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="ws-badge bg-white/15 text-white border-white/25 mb-4">Per i Fornitori</span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Porta la tua esperienza <span className="text-ws-yellow italic">in Wondersun</span>
            </h2>
            <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
              Sei un operatore turistico della Maremma? Pubblica le tue esperienze, ricevi
              richieste di prenotazione e gestisci tutto da un&apos;unica dashboard.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {[
                { Icon: Gift, label: "3 mesi gratis", note: "Trial sull'abbonamento" },
                { Icon: TrendingUp, label: "Più prenotazioni", note: "Marketing incluso" },
                { Icon: ShieldCheck, label: "Pagamenti sicuri", note: "Stripe integrato" },
                { Icon: Store, label: "Dashboard dedicata", note: "Gestione autonoma" },
              ].map(({ Icon, label, note }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-ws-yellow" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{label}</p>
                    <p className="text-xs text-white/60">{note}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/fornitore/registrati" className="ws-btn-primary">
                Diventa Fornitore
              </Link>
              <Link
                href="/fornitore/dashboard"
                className="ws-btn-outline border-white/40 hover:border-white"
              >
                Accedi Area Fornitori
              </Link>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/15">
            <h3 className="font-display text-2xl font-bold mb-6">Quanto costa?</h3>

            <div className="space-y-5">
              <div className="flex items-baseline justify-between border-b border-white/15 pb-4">
                <div>
                  <p className="text-sm text-white/60">Abbonamento mensile</p>
                  <p className="font-display text-3xl font-bold">
                    €29<span className="text-sm font-normal text-white/60">/mese</span>
                  </p>
                </div>
                <span className="ws-badge bg-ws-yellow/20 text-ws-yellow border-ws-yellow/30">
                  3 mesi gratis
                </span>
              </div>

              <div className="flex items-baseline justify-between border-b border-white/15 pb-4">
                <div>
                  <p className="text-sm text-white/60">Commissione su prenotazione</p>
                  <p className="font-display text-3xl font-bold">25%</p>
                </div>
                <span className="text-xs text-white/50">sul totale incassato</span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm text-white/60">Esperienze premium (oltre €1.000)</p>
                  <p className="font-display text-lg font-bold">+ fee fissa concordata</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-white/50 mt-6">
              Nessun costo di setup. Cancella in qualsiasi momento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
