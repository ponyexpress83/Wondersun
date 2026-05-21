import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentProfile } from "@/lib/supabase/auth-helpers";

export const metadata = { title: "Privacy Policy" };

export default async function PrivacyPage() {
  const profile = await getCurrentProfile();
  return (
    <>
      <Navbar profile={profile} variant="solid" />
      <main className="pt-24 pb-20 bg-ws-ivory min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-sm">
          <p className="text-xs font-bold tracking-widest uppercase text-ws-blue mb-2">Privacy</p>
          <h1 className="font-display text-4xl font-bold text-ws-dark mb-2">Privacy Policy</h1>
          <p className="text-ws-text-light mb-8">Ultimo aggiornamento: maggio 2026</p>

          <p>
            La presente Privacy Policy descrive le modalità di trattamento dei dati personali degli
            utenti della piattaforma Wondersun (di seguito, &laquo;la Piattaforma&raquo;), ai sensi
            del Regolamento UE 2016/679 (GDPR) e del D.Lgs. 196/2003 e successive modifiche.
          </p>

          <h2 className="font-display text-2xl mt-8 mb-3 text-ws-dark">Titolare del trattamento</h2>
          <p>
            Titolare del trattamento è <strong>Ginevra Emanuele</strong>, P.IVA 01775230533, con
            sede in Via Maestrale 12, 58019 Porto Ercole (GR). Email:{" "}
            <a href="mailto:info@wondersun.it" className="text-ws-blue">
              info@wondersun.it
            </a>
            .
          </p>

          <h2 className="font-display text-2xl mt-8 mb-3 text-ws-dark">Dati raccolti</h2>
          <ul>
            <li>Dati anagrafici (nome, cognome, email, telefono)</li>
            <li>Dati di prenotazione (data, partecipanti, esperienze richieste)</li>
            <li>Dati di pagamento (gestiti direttamente da Stripe, vedi sezione dedicata)</li>
            <li>Dati tecnici (cookie, indirizzo IP, log di accesso)</li>
          </ul>

          <h2 className="font-display text-2xl mt-8 mb-3 text-ws-dark">Finalità del trattamento</h2>
          <p>
            I dati sono trattati per: erogazione dei servizi richiesti (prenotazioni, pacchetti),
            adempimenti fiscali e contabili, comunicazioni di servizio, sicurezza della
            piattaforma. Con consenso esplicito anche per finalità di marketing.
          </p>

          <h2 className="font-display text-2xl mt-8 mb-3 text-ws-dark">Pagamenti</h2>
          <p>
            I pagamenti sono processati da Stripe Payments Europe, Ltd. Wondersun non memorizza
            dati delle carte di credito. Consulta la{" "}
            <a href="https://stripe.com/it/privacy" className="text-ws-blue">
              privacy policy di Stripe
            </a>
            .
          </p>

          <h2 className="font-display text-2xl mt-8 mb-3 text-ws-dark">Diritti dell&apos;utente</h2>
          <p>
            L&apos;utente può in qualsiasi momento esercitare i diritti previsti dagli articoli
            15-22 del GDPR (accesso, rettifica, cancellazione, limitazione, portabilità,
            opposizione) scrivendo a{" "}
            <a href="mailto:privacy@wondersun.it" className="text-ws-blue">
              privacy@wondersun.it
            </a>
            .
          </p>

          <h2 className="font-display text-2xl mt-8 mb-3 text-ws-dark">Conservazione dei dati</h2>
          <p>
            I dati di prenotazione sono conservati per 10 anni ai sensi della normativa fiscale. I
            dati di marketing finché non viene revocato il consenso.
          </p>

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
