import Link from "next/link";
import { MapPin, Mail, Instagram, Facebook, Linkedin } from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ws-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <Logo className="w-10 h-10" />
              <div>
                <span className="font-display text-xl font-bold text-white tracking-wide">
                  WONDERSUN
                </span>
                <p className="text-[0.6rem] text-white/50 tracking-widest uppercase">
                  Local Escape · Maremma Toscana
                </p>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm mb-6">
              La piattaforma di esperienze autentiche nella Maremma Toscana. Dall&apos;Argentario
              a Sorano — il tuo Local Escape su misura.
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: Instagram, label: "Instagram", href: "https://instagram.com" },
                { Icon: Facebook, label: "Facebook", href: "https://facebook.com" },
                { Icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-ws-blue transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-5">
              Esplora
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Tutte le Esperienze", href: "/esperienze" },
                { label: "Mare & Costa", href: "/esperienze?category=Mare+%26+Costa" },
                { label: "Natura & Avventura", href: "/esperienze?category=Natura+%26+Avventura" },
                { label: "Enogastronomia", href: "/esperienze?category=Enogastronomia" },
                { label: "Cultura & Arte", href: "/esperienze?category=Cultura+%26+Arte" },
                { label: "Come Funziona", href: "/#come-funziona" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 hover:text-ws-yellow transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-5">Info</h4>
            <ul className="space-y-3 mb-6">
              {[
                { label: "Area Personale", href: "/dashboard" },
                { label: "Diventa Fornitore", href: "/fornitore/registrati" },
                { label: "Area Fornitori", href: "/fornitore/dashboard" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Termini di Servizio", href: "/termini" },
                { label: "Cookie Policy", href: "/cookie" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 hover:text-ws-yellow transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/50">
                <MapPin size={13} className="text-ws-yellow" />
                <span className="text-xs">Porto Ercole, Grosseto (GR)</span>
              </div>
              <div className="flex items-center gap-2 text-white/50">
                <Mail size={13} className="text-ws-yellow" />
                <a
                  href="mailto:info@wondersun.it"
                  className="text-xs hover:text-ws-yellow transition-colors"
                >
                  info@wondersun.it
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {currentYear} Wondersun — Tutti i diritti riservati · P.IVA 01775230533
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-white/40">Piattaforma in fase di lancio</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
