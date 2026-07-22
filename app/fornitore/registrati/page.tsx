import Link from "next/link";
import { Store, ShieldCheck, Sparkles } from "lucide-react";
import SignupForm from "@/components/auth/SignupForm";
import SupplierOnboardingForm from "@/components/auth/SupplierOnboardingForm";
import Logo from "@/components/ui/Logo";
import { getCurrentProfile } from "@/lib/supabase/auth-helpers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Diventa Fornitore",
  description:
    "Pubblica le tue esperienze su Wondersun e raggiungi turisti in Maremma. 3 mesi gratis poi €29/mese.",
};

export default async function SupplierSignupPage() {
  const profile = await getCurrentProfile();

  // Se già loggato come cliente, mostriamo il form di onboarding fornitore
  let hasSupplierRecord = false;
  if (profile) {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from("suppliers")
      .select("id")
      .eq("profile_id", profile.id)
      .maybeSingle();
    hasSupplierRecord = !!data;
  }

  return (
    <main className="min-h-screen bg-ws-ivory">
      <div className="bg-gradient-to-br from-ws-blue-deeper via-ws-blue-dark to-ws-blue text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/" className="flex items-center gap-3 mb-8">
            <Logo className="w-10 h-10" />
            <div>
              <p className="font-display text-xl font-bold">WONDERSUN</p>
              <p className="text-[0.6rem] tracking-widest uppercase text-white/60">
                Per Fornitori
              </p>
            </div>
          </Link>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3 max-w-2xl">
            Porta la tua esperienza in <span className="text-ws-yellow italic">Wondersun</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Pubblica i tuoi tour, raggiungi nuovi clienti in Maremma e gestisci tutto da
            un&apos;unica dashboard. 3 mesi gratis, poi €29 al mese.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10">
          <div>
            <h2 className="font-display text-2xl font-bold text-ws-dark mb-4">
              Cosa ottieni
            </h2>
            <ul className="space-y-4">
              {[
                {
                  Icon: Sparkles,
                  title: "3 mesi gratuiti",
                  text: "Provi tutto senza impegno. L'abbonamento parte solo al 91° giorno.",
                },
                {
                  Icon: Store,
                  title: "Dashboard completa",
                  text: "Crea esperienze, gestisci calendario, accetti/rifiuti richieste.",
                },
                {
                  Icon: ShieldCheck,
                  title: "Pagamenti sicuri Stripe",
                  text: "Le commissioni sono trattenute automaticamente. Tu ricevi il netto.",
                },
              ].map(({ Icon, title, text }) => (
                <li key={title} className="flex gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-ws-card">
                  <div className="w-11 h-11 rounded-xl bg-ws-blue-pale flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-ws-blue" />
                  </div>
                  <div>
                    <p className="font-bold text-ws-text mb-0.5">{title}</p>
                    <p className="text-sm text-ws-text-light">{text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="bg-ws-yellow/15 border border-ws-yellow/30 rounded-2xl p-5 mt-6">
              <p className="text-sm font-bold text-ws-dark mb-1">Come guadagni</p>
              <p className="text-sm text-ws-text">
                Nessuna commissione sui tuoi incassi: il cliente paga te direttamente
                l&apos;esperienza.
                <br />A Wondersun versi solo il canone di abbonamento (primi 3 mesi gratis).
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-ws-card border border-gray-100 p-8">
            {!profile ? (
              <>
                <h2 className="font-display text-2xl font-bold text-ws-dark mb-2">
                  Crea il tuo account fornitore
                </h2>
                <p className="text-sm text-ws-text-light mb-6">
                  Step 1 di 2 — Dati di accesso. Al passo successivo inserisci i dati della tua
                  attività.
                </p>
                <SignupForm role="fornitore" redirectTo="/fornitore/registrati" />
                <p className="text-center text-sm text-ws-text-light mt-6">
                  Hai già un account?{" "}
                  <Link href="/login?redirect=/fornitore/registrati" className="font-semibold text-ws-blue hover:underline">
                    Accedi
                  </Link>
                </p>
              </>
            ) : hasSupplierRecord ? (
              <div className="text-center py-6">
                <ShieldCheck size={48} className="text-green-500 mx-auto mb-4" />
                <p className="font-display text-2xl font-bold text-ws-dark mb-2">
                  Sei già registrato
                </p>
                <p className="text-sm text-ws-text-light mb-6">
                  La tua candidatura è in revisione o già approvata.
                </p>
                <Link href="/fornitore/dashboard" className="ws-btn-blue">
                  Vai alla dashboard fornitore
                </Link>
              </div>
            ) : (
              <>
                <h2 className="font-display text-2xl font-bold text-ws-dark mb-2">
                  Dati della tua attività
                </h2>
                <p className="text-sm text-ws-text-light mb-6">
                  Step 2 di 2 — Inserisci i dati aziendali. La candidatura verrà esaminata entro 48
                  ore.
                </p>
                <SupplierOnboardingForm profileId={profile.id} />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
