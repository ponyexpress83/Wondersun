import Link from "next/link";
import { MapPin, Mail, Phone, Instagram, Facebook } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { getI18n } from "@/lib/i18n.server";

const CATEGORY_HREFS = [
  "/esperienze?category=Mare+%26+Costa",
  "/esperienze?category=Enogastronomia",
  "/esperienze?category=Natura+%26+Avventura",
  "/esperienze?category=Cultura+%26+Arte",
];

export default function Footer() {
  const { dict } = getI18n();
  const t = dict.footer;
  const currentYear = new Date().getFullYear();

  const exploreLinks = [
    { label: t.links.allExperiences, href: "/esperienze" },
    ...dict.hero.quickLinks.map((label, i) => ({ label, href: CATEGORY_HREFS[i] ?? "/esperienze" })),
    { label: t.links.howItWorks, href: "/#come-funziona" },
  ];

  const infoLinks = [
    { label: t.links.personalArea, href: "/dashboard" },
    { label: t.links.about, href: "/chi-siamo" },
    { label: t.links.becomeSupplier, href: "/fornitore/registrati" },
    { label: t.links.supplierArea, href: "/fornitore/dashboard" },
    { label: t.links.privacy, href: "/privacy" },
    { label: t.links.terms, href: "/termini" },
    { label: t.links.termsSupplier, href: "/termini-fornitori" },
    { label: t.links.cookie, href: "/cookie" },
  ];

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
            <p className="text-sm text-white/60 leading-relaxed max-w-sm mb-4">{t.tagline}</p>
            <p className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-ws-red/90 rounded-lg px-3 py-1.5 mb-6">
              {t.notAgency}
            </p>
            <div className="flex items-center gap-3">
              {[
                {
                  Icon: Instagram,
                  label: "Instagram",
                  href: "https://www.instagram.com/wondersun_local_escape/",
                },
                {
                  Icon: Facebook,
                  label: "Facebook",
                  href: "https://www.facebook.com/profile.php?id=61589087354209",
                },
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
              {t.exploreTitle}
            </h4>
            <ul className="space-y-3">
              {exploreLinks.map((item) => (
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
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-5">
              {t.infoTitle}
            </h4>
            <ul className="space-y-3 mb-6">
              {infoLinks.map((item) => (
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
                <span className="text-xs">Via Maestrale 12, Porto Ercole (GR)</span>
              </div>
              <div className="flex items-center gap-2 text-white/50">
                <Mail size={13} className="text-ws-yellow" />
                <a
                  href="mailto:wondersun.localescape@gmail.com"
                  className="text-xs hover:text-ws-yellow transition-colors break-all"
                >
                  wondersun.localescape@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-white/50">
                <Phone size={13} className="text-ws-yellow" />
                <a
                  href="tel:+393793785317"
                  className="text-xs hover:text-ws-yellow transition-colors"
                >
                  379 378 5317
                </a>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[0.7rem] text-white/40 leading-relaxed border-t border-white/10 pt-6 mb-4">
          {t.legalNotice}
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {currentYear} Wondersun · Ginevra Emanuele · P.IVA 01775230533
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-white/40">{t.launching}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
