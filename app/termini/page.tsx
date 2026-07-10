import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentProfile } from "@/lib/supabase/auth-helpers";

export const metadata = { title: "Termini di Servizio" };

export default async function TerminiPage() {
  const profile = await getCurrentProfile();
  return (
    <>
      <Navbar profile={profile} variant="solid" />
      <main className="pt-24 pb-20 bg-ws-ivory min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-sm">
          <p className="text-xs font-bold tracking-widest uppercase text-ws-blue mb-2">Termini</p>
          <h1 className="font-display text-4xl font-bold text-ws-dark mb-2">
            Termini e Condizioni di Servizio
          </h1>
          <p className="text-ws-text-light mb-8">Ultimo aggiornamento: maggio 2026</p>

          <h2 className="font-display text-2xl mt-8 mb-3 text-ws-dark">1. Oggetto</h2>
          <p>
            Wondersun è una piattaforma digitale che mette in contatto turisti con operatori
            turistici (Fornitori) della Costa d&apos;Argento e Maremma Toscana. La Piattaforma
            consente la richiesta, la conferma e il pagamento delle esperienze prenotate.
          </p>

          <h2 className="font-display text-2xl mt-8 mb-3 text-ws-dark">2. Flusso di prenotazione</h2>
          <p>
            Le esperienze prevedono un flusso a richiesta: il Cliente invia la richiesta, il
            Fornitore conferma, rifiuta o propone una data alternativa. Il pagamento avviene solo
            dopo la conferma del Fornitore tramite Stripe.
          </p>

          <h2 className="font-display text-2xl mt-8 mb-3 text-ws-dark">3. Corrispettivi</h2>
          <p>
            Wondersun eroga un servizio digitale di concierge e prenotazione. Il Cliente versa
            online esclusivamente la quota per il servizio digitale Wondersun; il corrispettivo
            dell&apos;esperienza è pagato direttamente al Fornitore. I Fornitori accedono alla
            piattaforma tramite un abbonamento (canone mensile con periodo di prova iniziale),
            senza commissioni sui propri incassi.
          </p>

          <h2 className="font-display text-2xl mt-8 mb-3 text-ws-dark">
            4. Cancellazioni e rimborsi
          </h2>
          <p>
            La policy di cancellazione standard prevede rimborso integrale fino a 7 giorni prima
            dell&apos;esperienza, 50% fino a 48 ore prima, nessun rimborso oltre. Singoli Fornitori
            possono prevedere policy diverse, evidenziate sulla pagina dell&apos;esperienza.
          </p>

          <h2 className="font-display text-2xl mt-8 mb-3 text-ws-dark">5. Responsabilità</h2>
          <p>
            Wondersun agisce come intermediario tecnico. Il rapporto di erogazione del servizio
            turistico intercorre direttamente tra Cliente e Fornitore, che ne assume la piena
            responsabilità in termini di sicurezza, qualità e adempimenti normativi.
          </p>

          <h2 className="font-display text-2xl mt-8 mb-3 text-ws-dark">6. Foro competente</h2>
          <p>Per ogni controversia è competente in via esclusiva il Foro di Grosseto.</p>

          <p className="text-xs text-ws-text-light mt-12">
            Documento template — versione finale a cura del Committente / professionista legale
            incaricato (cfr. Art. 4 del contratto).
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
