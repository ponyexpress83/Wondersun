"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ChevronDown,
  MapPin,
  Star,
  BadgeCheck,
  Wallet,
  Zap,
  ShieldCheck,
  Sailboat,
  Wine,
  ChefHat,
} from "lucide-react";

/**
 * Hero "Mediterranean WOW" — composizione scenica senza dipendenze da foto
 * remote (la precedente immagine Unsplash era morta e lasciava il fondo
 * vuoto). Cielo+sole+mare in CSS/SVG, card esperienza flottanti con glow.
 */
export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const t = (delay: string) =>
    `transition-all duration-1000 ${delay} ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`;

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-b from-[#0B3D6B] via-ws-blue-dark to-ws-blue">
      {/* ── Sole radiante ── */}
      <div
        className="absolute -top-24 right-[8%] w-[480px] h-[480px] rounded-full pointer-events-none animate-ws-float"
        style={{
          background:
            "radial-gradient(circle, rgba(255,220,100,0.95) 0%, rgba(255,179,71,0.55) 35%, rgba(230,57,70,0.18) 60%, transparent 75%)",
          animationDuration: "6s",
        }}
      />
      <div className="absolute top-10 right-[16%] w-40 h-40 rounded-full bg-ws-yellow blur-2xl opacity-60 pointer-events-none" />

      {/* ── Blob atmosferici ── */}
      <div className="ws-blob ws-blob-sky w-[30rem] h-[30rem] top-1/3 -left-40" />
      <div
        className="ws-blob ws-blob-coral w-96 h-96 bottom-10 right-1/4"
        style={{ animationDelay: "4s" }}
      />

      {/* ── Mare: bande d'onda sul fondo ── */}
      <div className="absolute bottom-0 inset-x-0 h-64 pointer-events-none">
        <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
          <path
            d="M0,80 C240,140 480,40 720,90 C960,140 1200,60 1440,100 L1440,220 L0,220 Z"
            fill="rgba(22,99,158,0.55)"
          />
          <path
            d="M0,130 C260,80 520,180 780,130 C1040,80 1240,170 1440,140 L1440,220 L0,220 Z"
            fill="rgba(11,61,107,0.7)"
          />
        </svg>
      </div>

      <div className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] items-center gap-10">
        {/* ── Colonna testo ── */}
        <div>
          <div className={t("delay-100")}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/25 rounded-full px-4 py-2 mb-7 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
              <MapPin size={13} className="text-ws-yellow" />
              <span className="text-xs font-bold text-white tracking-widest uppercase">
                Argentario · Sorano · Manciano · Arcille
              </span>
            </div>
          </div>

          <h1
            className={`font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.02] mb-7 ${t("delay-200")}`}
          >
            Scopri la
            <br />
            <span className="relative inline-block">
              <span className="ws-gradient-text-sun italic drop-shadow-[0_4px_18px_rgba(255,179,71,0.45)]">
                Maremma
              </span>
              <svg
                viewBox="0 0 220 14"
                className="absolute -bottom-2 left-0 w-full h-3"
                preserveAspectRatio="none"
              >
                <path
                  d="M4,10 C60,2 160,2 216,8"
                  stroke="#FFC833"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.9"
                />
              </svg>
            </span>
            <br />
            che non conosci
          </h1>

          <p
            className={`text-lg sm:text-xl text-white/85 max-w-xl leading-relaxed mb-9 ${t("delay-300")}`}
          >
            Tramonti in barca, cantine scavate nel tufo, cooking class nei casali.
            Esperienze vere con artigiani veri — prenoti in un click e{" "}
            <strong className="text-ws-yellow font-bold">paghi solo quello che vivi</strong>.
          </p>

          <div className={`flex flex-col sm:flex-row gap-4 mb-9 ${t("delay-500")}`}>
            <Link href="/esperienze" className="ws-btn-primary text-base py-4 px-9">
              Esplora le esperienze
            </Link>
            <Link href="/#come-funziona" className="ws-btn-outline text-base py-4 px-9 backdrop-blur-sm">
              Come funziona
            </Link>
          </div>

          {/* Trust chips */}
          <div className={`flex flex-wrap gap-2.5 ${t("delay-700")}`}>
            {[
              { icon: BadgeCheck, label: "Fornitori verificati" },
              { icon: Wallet, label: "Paghi solo quello che vivi" },
              { icon: Zap, label: "Conferma entro 24h" },
              { icon: ShieldCheck, label: "Annullo gratuito fino a 48h" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3.5 py-2 hover:bg-white/15 transition-colors"
              >
                <Icon size={14} className="text-ws-yellow flex-shrink-0" />
                <span className="text-xs font-semibold text-white/90">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Colonna scenica: card esperienza flottanti ── */}
        <div className={`relative h-[540px] hidden lg:block ${t("delay-500")}`}>
          {/* Card 1 · tramonto in barca */}
          <div
            className="absolute top-2 left-6 w-64 rounded-3xl overflow-hidden rotate-[-7deg] shadow-[0_30px_70px_rgba(230,57,70,0.4)] animate-ws-float"
            style={{ animationDuration: "5.5s" }}
          >
            <div className="h-44 bg-gradient-to-br from-ws-yellow via-[#FF8A5C] to-ws-red relative flex items-center justify-center">
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-ws-yellow-light shadow-[0_0_40px_rgba(255,217,107,0.9)]" />
              <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-ws-blue-deeper/70 to-transparent" />
              <Sailboat size={56} className="text-white relative drop-shadow-lg mt-10" />
            </div>
            <div className="bg-white p-4">
              <p className="font-display text-lg font-bold text-ws-dark leading-tight">
                Tramonto in barca
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-ws-text-light">Argentario</span>
                <span className="text-xs font-bold text-ws-red">da €90</span>
              </div>
            </div>
          </div>

          {/* Card 2 · cantine nel tufo */}
          <div
            className="absolute top-40 right-0 w-60 rounded-3xl overflow-hidden rotate-[5deg] shadow-[0_30px_70px_rgba(46,155,232,0.45)] animate-ws-float"
            style={{ animationDuration: "6.5s", animationDelay: "1s" }}
          >
            <div className="h-40 bg-gradient-to-br from-ws-blue-light to-ws-blue-deeper relative flex items-center justify-center">
              <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
              <Wine size={52} className="text-white drop-shadow-lg" />
            </div>
            <div className="bg-white p-4">
              <p className="font-display text-lg font-bold text-ws-dark leading-tight">
                Cantine nel tufo
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-ws-text-light">Sorano</span>
                <span className="text-xs font-bold text-ws-red">da €45</span>
              </div>
            </div>
          </div>

          {/* Card 3 · cooking class */}
          <div
            className="absolute bottom-6 left-16 w-60 rounded-3xl overflow-hidden rotate-[3deg] shadow-[0_30px_70px_rgba(255,200,51,0.4)] animate-ws-float"
            style={{ animationDuration: "7s", animationDelay: "2s" }}
          >
            <div className="h-40 bg-gradient-to-br from-ws-red-light to-ws-red-dark relative flex items-center justify-center">
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-white/10" />
              <ChefHat size={52} className="text-white drop-shadow-lg" />
            </div>
            <div className="bg-white p-4">
              <p className="font-display text-lg font-bold text-ws-dark leading-tight">
                Cooking class nel casale
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-ws-text-light">Manciano</span>
                <span className="text-xs font-bold text-ws-red">da €120</span>
              </div>
            </div>
          </div>

          {/* Chip recensioni glass */}
          <div
            className="absolute top-[46%] left-0 bg-white/95 backdrop-blur rounded-2xl px-4 py-3 shadow-[0_18px_44px_rgba(0,0,0,0.25)] animate-ws-float"
            style={{ animationDuration: "5s", animationDelay: "0.5s" }}
          >
            <div className="flex items-center gap-1 mb-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={13} className="text-ws-yellow fill-ws-yellow" />
              ))}
            </div>
            <p className="text-xs font-bold text-ws-dark">Esperienze verificate</p>
            <p className="text-[0.65rem] text-ws-text-light">una a una, sul territorio</p>
          </div>
        </div>
      </div>

      {/* ── Stats + scroll hint ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-2">
        <div className={`flex flex-wrap gap-10 ${t("delay-700")}`}>
          {[
            { number: "50+", label: "Esperienze uniche" },
            { number: "100%", label: "Artigiani locali" },
            { number: "4", label: "Zone della Maremma" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-4xl font-bold ws-gradient-text-sun">
                {stat.number}
              </div>
              <div className="text-sm text-white/70 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex justify-center pb-7 pt-4">
        <Link
          href="/esperienze"
          className="flex flex-col items-center gap-1.5 text-white/60 hover:text-white transition-colors group"
        >
          <span className="text-xs tracking-widest uppercase">Scopri</span>
          <ChevronDown
            size={20}
            className="animate-bounce group-hover:text-ws-yellow transition-colors"
          />
        </Link>
      </div>

      {/* Onda di chiusura verso l'avorio */}
      <div className="absolute bottom-0 left-0 right-0 leading-none z-10">
        <svg viewBox="0 0 1440 70" fill="none" className="w-full">
          <path
            d="M0,35 C240,70 480,0 720,35 C960,70 1200,0 1440,35 L1440,70 L0,70 Z"
            fill="#FDFCF7"
          />
        </svg>
      </div>
    </section>
  );
}
