"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Star, BadgeCheck, ShieldCheck, Zap } from "lucide-react";
import HeroSearchBar from "@/components/HeroSearchBar";

/**
 * Hero stile GetYourGuide adattato a Wondersun:
 * - foto reale Maremma a tutta larghezza
 * - claim grande centrale + search bar in primo piano
 * - chips fiducia + rating sotto
 *
 * Le foto sono caricate come <img> per evitare il rate-limit di Next/Image
 * lato server che aveva fatto morire l'hero precedente.
 */

const HERO_IMAGES = [
  // Costa d'Argento — Argentario
  "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=2000&q=80&auto=format&fit=crop",
  // Tramonto in barca
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=2000&q=80&auto=format&fit=crop",
  // Colline toscane
  "https://images.unsplash.com/photo-1543429776-2782fc8e1acd?w=2000&q=80&auto=format&fit=crop",
];

export default function HeroSection() {
  const [imgIdx, setImgIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    const id = setInterval(() => {
      setImgIdx((i) => (i + 1) % HERO_IMAGES.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-[88vh] flex flex-col overflow-hidden bg-ws-blue-deeper">
      {/* ── Background: foto Maremma con crossfade ── */}
      <div className="absolute inset-0">
        {HERO_IMAGES.map((src, i) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={src}
            src={src}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ${i === imgIdx ? "opacity-100" : "opacity-0"}`}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
        {/* fallback gradiente nel caso le foto non carichino */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B3D6B] via-ws-blue-dark to-ws-blue -z-10" />
        {/* Overlay scuro + caldo per leggibilità */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-ws-blue-deeper/40 to-ws-blue-deeper/85" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ws-red/15 via-transparent to-transparent" />
      </div>

      {/* Sole atmosferico */}
      <div
        className="absolute top-16 right-[10%] w-72 h-72 rounded-full pointer-events-none animate-ws-float"
        style={{
          background:
            "radial-gradient(circle, rgba(255,220,100,0.55) 0%, rgba(255,179,71,0.25) 40%, transparent 70%)",
          animationDuration: "6s",
        }}
      />

      {/* ── Contenuto centrato ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 w-full text-center">
        {/* Rating chip */}
        <div
          className={`inline-flex items-center gap-2 self-center bg-white/95 backdrop-blur rounded-full px-4 py-1.5 mb-6 shadow-lg transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={13} className="text-ws-yellow fill-ws-yellow" />
            ))}
          </div>
          <span className="text-xs font-bold text-ws-dark">
            4.9/5 · 320+ viaggiatori soddisfatti
          </span>
        </div>

        <h1
          className={`font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.02] mb-5 transition-all duration-1000 delay-150 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ textShadow: "0 4px 30px rgba(0,0,0,0.45)" }}
        >
          Vivi la{" "}
          <span className="relative inline-block">
            <span className="ws-gradient-text-sun italic drop-shadow-[0_4px_20px_rgba(255,179,71,0.5)]">
              Maremma
            </span>
            <svg
              viewBox="0 0 220 14"
              className="absolute -bottom-1 left-0 w-full h-3"
              preserveAspectRatio="none"
            >
              <path
                d="M4,10 C60,2 160,2 216,8"
                stroke="#FFC833"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </span>
          <br className="hidden sm:block" /> come un locale
        </h1>

        <p
          className={`text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-8 transition-all duration-1000 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.35)" }}
        >
          Tramonti in barca, cantine nel tufo, cooking class nei casali. Esperienze autentiche
          con artigiani locali —{" "}
          <strong className="text-ws-yellow">paghi solo quello che vivi</strong>.
        </p>

        {/* SEARCH BAR */}
        <div
          className={`max-w-4xl mx-auto w-full transition-all duration-1000 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <HeroSearchBar />
        </div>

        {/* Trust chips */}
        <div
          className={`flex flex-wrap justify-center gap-2 mt-8 transition-all duration-1000 delay-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          {[
            { icon: BadgeCheck, label: "Fornitori verificati" },
            { icon: Zap, label: "Conferma in 24h" },
            { icon: ShieldCheck, label: "Annullamento gratuito 48h" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-3 py-1.5"
            >
              <Icon size={13} className="text-ws-yellow" />
              <span className="text-xs font-semibold text-white">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Wave finale verso il body */}
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
