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
              Più di una vetrina. <span className="text-ws-yellow italic">Un partner</span> per la tua attività.
            </h2>
            <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
              Non ci limitiamo a pubblicare una scheda: ti aiutiamo concretamente a valorizzare il tuo
              lavoro e a crescere — con supporto umano rapido, contenuti curati e promozione. Gestisci
              esperienze e richieste da un&apos;unica dashboard.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {[
                { Icon: Gift, label: "3 mesi gratis", note: "Poi €29/mese, disdici quando vuoi" },
                { Icon: TrendingUp, label: "Crescita, non solo visibilità", note: "Contenuti, promozione, ottimizzazione" },
                { Icon: ShieldCheck, label: "Gli incassi restano tuoi", note: "Il cliente paga te, direttamente" },
                { Icon: Store, label: "Supporto umano", note: "Rapido, diretto e continuo" },
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
              <Link href="/fornitore/registrati" className="ws-btn-accent">
                Diventa partner
              </Link>
              <Link
                href="/fornitore/dashboard"
                className="ws-btn-outline border-white/40 hover:border-white"
              >
                Area fornitori
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
                  <p className="text-sm text-white/60">Commissione sui tuoi incassi</p>
                  <p className="font-display text-3xl font-bold text-ws-yellow">0%</p>
                </div>
                <span className="text-xs text-white/50 text-right max-w-[9rem]">
                  Il cliente paga te, direttamente
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm text-white/60">Attivazione e setup</p>
                  <p className="font-display text-lg font-bold">Nessun costo</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-white/50 mt-6 leading-relaxed">
              Wondersun incassa esclusivamente il proprio corrispettivo per il servizio digitale.
              Il prezzo dell&apos;esperienza resta tuo e lo ricevi direttamente dal cliente.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
