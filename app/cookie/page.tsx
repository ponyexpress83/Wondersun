import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentProfile } from "@/lib/supabase/auth-helpers";

export const metadata = { title: "Cookie Policy" };

export default async function CookiePage() {
  const profile = await getCurrentProfile();
  return (
    <>
      <Navbar profile={profile} variant="solid" />
      <main className="pt-24 pb-20 bg-ws-ivory min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-sm">
          <p className="text-xs font-bold tracking-widest uppercase text-ws-blue mb-2">Cookie</p>
          <h1 className="font-display text-4xl font-bold text-ws-dark mb-2">Cookie Policy</h1>
          <p className="text-ws-text-light mb-8">Ultimo aggiornamento: maggio 2026</p>

          <p>
            La presente Cookie Policy descrive i cookie utilizzati dalla piattaforma Wondersun.
          </p>

          <h2 className="font-display text-2xl mt-8 mb-3 text-ws-dark">Cookie tecnici</h2>
          <p>
            Necessari al funzionamento della Piattaforma: sessione di autenticazione, preferenze
            utente, sicurezza. Non richiedono consenso preventivo.
          </p>

          <h2 className="font-display text-2xl mt-8 mb-3 text-ws-dark">Cookie analitici</h2>
          <p>
            Google Analytics 4 in modalità anonimizzata, per comprendere come gli utenti utilizzano
            il sito. Puoi opporti in qualsiasi momento dal banner cookie.
          </p>

          <h2 className="font-display text-2xl mt-8 mb-3 text-ws-dark">Cookie di marketing</h2>
          <p>
            Meta Pixel e Google Ads (solo con consenso esplicito) per misurare l&apos;efficacia
            delle campagne pubblicitarie.
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
