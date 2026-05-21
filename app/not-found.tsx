import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-ws-ivory flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Logo className="w-20 h-20 mx-auto mb-6" />
        <h1 className="font-display text-7xl font-bold text-ws-blue mb-2">404</h1>
        <p className="font-display text-2xl text-ws-dark mb-3">
          Questa pagina si è persa nella Maremma
        </p>
        <p className="text-ws-text-light mb-8">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <Link href="/" className="ws-btn-blue">
          Torna alla homepage
        </Link>
      </div>
    </main>
  );
}
