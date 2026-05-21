import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import Logo from "@/components/ui/Logo";

export const metadata = {
  title: "Accedi",
  description: "Accedi alla tua area personale Wondersun.",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string; error?: string };
}) {
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
          <h1 className="font-display text-3xl font-bold text-ws-dark mb-2">Bentornato</h1>
          <p className="text-ws-text-light mb-6">
            Accedi per gestire le tue prenotazioni e i tuoi preferiti.
          </p>

          <LoginForm redirectTo={searchParams.redirect} errorMessage={searchParams.error} />

          <p className="text-center text-sm text-ws-text-light mt-6">
            Non hai un account?{" "}
            <Link href="/registrati" className="font-semibold text-ws-blue hover:underline">
              Registrati
            </Link>
          </p>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-ws-text-light mb-2">Sei un operatore turistico?</p>
            <Link
              href="/fornitore/registrati"
              className="text-sm font-semibold text-ws-red hover:underline"
            >
              Registrati come fornitore →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
