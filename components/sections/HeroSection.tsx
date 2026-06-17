import Link from "next/link";
import { Search, MapPin, Star, ShieldCheck, CalendarCheck } from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1533514114760-4389f572ad05?w=1920&q=80&auto=format&fit=crop";

/**
 * Hero homepage · stile luminoso "Local Escape".
 * Card immagine arrotondata su sfondo panna, overlay leggero, titolo,
 * barra di ricerca (porta al catalogo) e riga di rassicurazioni.
 */
export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-ws-blue-pale via-ws-ivory to-ws-ivory pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-center overflow-hidden rounded-[2rem] shadow-ws-card-hover min-h-[540px] lg:min-h-[620px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_IMAGE}
            alt="Costa d'Argento — Maremma Toscana"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          {/* Overlay luminoso (no dark luxury) */}
          <div className="absolute inset-0 bg-gradient-to-b from-ws-blue-deeper/25 via-ws-blue-dark/20 to-ws-blue-deeper/60" />

          <div className="relative z-10 w-full max-w-3xl px-5 py-16 text-center">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-md">
              <MapPin size={13} className="text-ws-yellow" />
              Maremma · Costa d&apos;Argento
            </span>

            <h1 className="mb-5 font-display text-5xl font-bold leading-[1.05] text-white drop-shadow-sm sm:text-6xl lg:text-7xl">
              Scopri la <span className="italic text-ws-yellow">Maremma</span>
              <br className="hidden sm:block" /> che non conosci
            </h1>

            <p className="mx-auto mb-9 max-w-xl text-lg text-white/90 sm:text-xl">
              Il tuo concierge digitale per vivere esperienze autentiche, selezionate
              tra i migliori operatori locali. Tu sogni, noi ti facciamo vivere la Maremma.
            </p>

            {/* Barra di ricerca → catalogo */}
            <form
              action="/esperienze"
              className="mx-auto flex max-w-xl items-center gap-2 rounded-full bg-white p-2 shadow-2xl"
            >
              <div className="flex flex-1 items-center gap-2 pl-4">
                <Search size={18} className="shrink-0 text-ws-blue" />
                <input
                  type="text"
                  name="q"
                  placeholder="Cerca: barca al tramonto, degustazione, trekking…"
                  aria-label="Cerca esperienze"
                  className="w-full bg-transparent py-2.5 text-ws-text outline-none placeholder:text-ws-text-light"
                />
              </div>
              <button type="submit" className="ws-btn-primary px-7 py-3">
                Cerca
              </button>
            </form>

            {/* Trust row */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm text-white/90">
              <span className="flex items-center gap-1.5">
                <Star size={15} className="fill-ws-yellow text-ws-yellow" />
                Esperienze selezionate
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-ws-yellow" />
                Paghi solo la quota concierge
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarCheck size={15} className="text-ws-yellow" />
                Annulli gratis fino a 48h
              </span>
            </div>
          </div>
        </div>

        {/* Quick links sotto l'hero */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {[
            { label: "Mare & Costa", href: "/esperienze?category=Mare+%26+Costa" },
            { label: "Enogastronomia", href: "/esperienze?category=Enogastronomia" },
            { label: "Natura & Avventura", href: "/esperienze?category=Natura+%26+Avventura" },
            { label: "Cultura & Arte", href: "/esperienze?category=Cultura+%26+Arte" },
          ].map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="rounded-full border border-ws-blue/20 bg-white px-4 py-2 text-sm font-semibold text-ws-blue-dark shadow-ws-card transition-colors hover:border-ws-blue hover:bg-ws-blue-pale"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
