import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ShieldCheck, User, Store, Crown } from "lucide-react";
import Logo from "@/components/ui/Logo";
import DemoLoginButton from "@/components/demo/DemoLoginButton";
import { DEMO_ACCOUNTS, isDemoEnabled } from "@/lib/demo";

export const metadata = {
  title: "Demo Wondersun",
  description: "Account preconfigurati per presentare la piattaforma alla committente.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const ROLE_STYLE = {
  cliente: {
    icon: User,
    gradient: "from-ws-blue-light to-ws-blue-dark",
    glow: "shadow-[0_18px_44px_rgba(46,155,232,0.35)]",
    chip: "bg-white/20",
  },
  fornitore: {
    icon: Store,
    gradient: "from-ws-yellow to-ws-yellow-dark",
    glow: "shadow-[0_18px_44px_rgba(255,200,51,0.4)]",
    chip: "bg-black/10",
  },
  admin: {
    icon: Crown,
    gradient: "from-ws-red-light to-ws-red-dark",
    glow: "shadow-[0_18px_44px_rgba(230,57,70,0.35)]",
    chip: "bg-white/20",
  },
} as const;

export default function DemoPage() {
  if (!isDemoEnabled()) notFound();

  const accounts = Object.values(DEMO_ACCOUNTS);

  return (
    <main className="min-h-screen bg-ws-ivory px-4 py-12 relative overflow-hidden">
      <div className="ws-blob ws-blob-sky w-[30rem] h-[30rem] -top-40 -left-40" />
      <div className="ws-blob ws-blob-sun w-96 h-96 top-1/3 -right-32" style={{ animationDelay: "3s" }} />
      <div className="ws-blob ws-blob-coral w-80 h-80 -bottom-24 left-1/4" style={{ animationDelay: "6s" }} />

      <div className="max-w-6xl mx-auto relative">
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <Logo className="w-12 h-12" />
          <div className="text-left">
            <p className="font-display text-2xl font-bold text-ws-blue">WONDERSUN</p>
            <p className="text-[0.65rem] tracking-widest uppercase text-ws-text-light">
              Local Escape · Maremma
            </p>
          </div>
        </Link>

        <header className="text-center mb-12">
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-ws-dark mb-4">
            Esplora <span className="ws-gradient-text italic">Wondersun</span>
          </h1>
          <p className="text-lg text-ws-text-light max-w-2xl mx-auto">
            Scegli un punto di vista ed entra con un click: niente registrazione, niente
            password. Tre profili, tre modi di vivere la piattaforma.
          </p>
          <div className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full bg-white shadow-ws-card text-ws-blue text-xs font-bold uppercase tracking-wider">
            <ShieldCheck size={14} />
            Ambiente dimostrativo · dati di esempio
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {accounts.map((account) => {
            const style = ROLE_STYLE[account.role];
            const Icon = style.icon;
            return (
              <article
                key={account.role}
                className={`group bg-white rounded-3xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 ${style.glow}`}
              >
                <div
                  className={`bg-gradient-to-br ${style.gradient} px-6 pt-7 pb-6 text-white relative overflow-hidden`}
                >
                  <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
                  <div className="absolute top-10 -right-2 w-14 h-14 rounded-full bg-white/10" />
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${style.chip} backdrop-blur-sm mb-4`}
                  >
                    <Icon size={26} className="drop-shadow" />
                  </div>
                  <p className="text-[0.65rem] font-bold tracking-widest uppercase opacity-80">
                    Profilo
                  </p>
                  <h2 className="font-display text-3xl font-bold drop-shadow-sm">
                    {account.title}
                  </h2>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <p className="text-sm text-ws-text-light mb-5">{account.description}</p>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {account.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-sm text-ws-dark">
                        <CheckCircle2 size={16} className="text-ws-blue flex-shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <DemoLoginButton role={account.role} label={`Entra come ${account.title}`} />

                  <details className="mt-4 text-center">
                    <summary className="text-[0.7rem] text-ws-text-light cursor-pointer hover:text-ws-blue transition-colors select-none">
                      Accesso manuale
                    </summary>
                    <div className="mt-2 rounded-lg bg-ws-ivory border border-gray-100 p-2.5 text-[0.7rem] font-mono text-ws-text-light text-left space-y-0.5">
                      <div>{account.email}</div>
                      <div>{account.password}</div>
                    </div>
                  </details>
                </div>
              </article>
            );
          })}
        </section>

        <footer className="text-center text-xs text-ws-text-light mt-12">
          <Link href="/" className="text-ws-blue font-semibold hover:underline">
            ← Torna alla home
          </Link>
        </footer>
      </div>
    </main>
  );
}
