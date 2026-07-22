import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LegalDoc from "@/components/LegalDoc";
import { TERMS_SUPPLIER_DOC } from "@/lib/legal-content";
import { getCurrentProfile } from "@/lib/supabase/auth-helpers";

export const metadata = { title: "Termini e Condizioni — Fornitori" };

export default async function TerminiFornitoriPage() {
  const profile = await getCurrentProfile();
  return (
    <>
      <Navbar profile={profile} />
      <main className="pt-24 pb-20 bg-gradient-to-b from-ws-blue-pale/40 to-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold tracking-widest uppercase text-ws-blue mb-2">
            Contratto per servizi di promozione, visibilità digitale e generazione di contatti
          </p>
          <p className="text-ws-text-light mb-8 text-sm">
            Definizioni e condizioni per i Fornitori che pubblicano le proprie esperienze su Wonder Sun.
          </p>
          <LegalDoc blocks={TERMS_SUPPLIER_DOC} />
        </div>
      </main>
      <Footer />
    </>
  );
}
