import Link from "next/link";
import SignupForm from "@/components/auth/SignupForm";
import Logo from "@/components/ui/Logo";

export const metadata = {
  title: "Registrati",
  description: "Crea il tuo account Wondersun per scoprire e prenotare esperienze.",
};

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-ws-ivory flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <Logo className="w-12 h-12" />
          <div className="text-left">
            <p className="font-display text-2xl font-bold text-ws-blue">WONDERSUN</p>
            <p className="text-[0.65rem] tracking-widest uppercase text-ws-text-light">
              Local Escape · Maremma
            </p>
          </div>
        </Link>

        <div className="bg-white rounded-2xl shadow-ws-card border border-gray-100 p-8">
          <h1 className="font-display text-3xl font-bold text-ws-dark mb-2">Crea il tuo account</h1>
          <p className="text-ws-text-light mb-6">
            Gratis. Ti serve solo per inviare richieste di prenotazione.
          </p>

          <SignupForm role="cliente" />

          <p className="text-center text-sm text-ws-text-light mt-6">
            Hai già un account?{" "}
            <Link href="/login" className="font-semibold text-ws-blue hover:underline">
              Accedi
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
