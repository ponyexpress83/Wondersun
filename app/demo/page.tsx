import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import Logo from "@/components/ui/Logo";
import DemoLoginButton from "@/components/demo/DemoLoginButton";
import { DEMO_ACCOUNTS, isDemoEnabled } from "@/lib/demo";

export const metadata = {
  title: "Demo Wondersun",
  description: "Account preconfigurati per presentare la piattaforma alla committente.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function DemoPage() {
  if (!isDemoEnabled()) notFound();

  const accounts = Object.values(DEMO_ACCOUNTS);

  return (
    <main className="min-h-screen bg-ws-ivory px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <Logo className="w-12 h-12" />
          <div className="text-left">
            <p className="font-display text-2xl font-bold text-ws-blue">WONDERSUN</p>
            <p className="text-[0.65rem] tracking-widest uppercase text-ws-text-light">
              Local Escape · Maremma
            </p>
          </div>
        </Link>

        <header className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold text-ws-dark mb-3">
            Demo Wondersun
          </h1>
          <p className="text-ws-text-light max-w-2xl mx-auto">
            Tre account preconfigurati per esplorare la piattaforma nei panni di un cliente, un
            fornitore approvato e un amministratore. Tutti gli account condividono la stessa
            password, generata automaticamente al primo accesso.
          </p>
          <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-ws-blue/10 text-ws-blue text-xs font-semibold">
            <ShieldCheck size={14} />
            ambiente dimostrativo — dati di esempio, non utilizzare email reali
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <article
              key={account.role}
              className="bg-white rounded-2xl shadow-ws-card border border-gray-100 p-6 flex flex-col"
            >
              <div className="mb-4">
                <p className="text-[0.65rem] tracking-widest uppercase text-ws-text-light mb-1">
                  Profilo
                </p>
                <h2 className="font-display text-2xl font-bold text-ws-dark">
                  {account.title}
                </h2>
              </div>

              <p className="text-sm text-ws-text-light mb-4">{account.description}</p>

              <ul className="space-y-2 mb-6 flex-1">
                {account.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-ws-dark">
                    <CheckCircle2 size={16} className="text-ws-blue flex-shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="rounded-lg bg-ws-ivory/60 border border-gray-100 p-3 mb-4 text-xs font-mono text-ws-dark space-y-1">
                <div>
                  <span className="text-ws-text-light">email&nbsp;</span>
                  {account.email}
                </div>
                <div>
                  <span className="text-ws-text-light">pass&nbsp;&nbsp;</span>
                  {account.password}
                </div>
              </div>

              <DemoLoginButton role={account.role} label={`Entra come ${account.title}`} />
            </article>
          ))}
        </section>

        <footer className="text-center text-xs text-ws-text-light mt-10 space-y-1">
          <p>
            Per disattivare la pagina demo basta rimuovere la variabile
            <code className="mx-1 px-1 py-0.5 bg-white border border-gray-200 rounded">
              NEXT_PUBLIC_DEMO_MODE
            </code>
            o impostarla a <code>false</code>.
          </p>
          <p>
            <Link href="/" className="text-ws-blue hover:underline">
              ← Torna alla home
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
