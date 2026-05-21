"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronDown, MapPin, Star, Users } from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1533514114760-4389f572ad05?w=1920&q=80&auto=format&fit=crop";

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMAGE}
          alt="Costa d'Argento — Maremma Toscana"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ws-blue/65 via-ws-blue-dark/65 to-ws-blue-deeper/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-ws-blue-deeper/35 via-transparent to-transparent" />
      </div>

      {/* Floating badges */}
      <div
        className={`absolute top-32 right-8 lg:right-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white transition-all duration-1000 delay-700 hidden sm:block ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <div className="flex items-center gap-1 mb-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={14} className="text-ws-yellow fill-ws-yellow" />
          ))}
        </div>
        <p className="text-xs font-semibold text-white/90">Esperienze Verificate</p>
        <p className="text-xs text-white/60">Costa d&apos;Argento</p>
      </div>

      <div
        className={`absolute bottom-40 right-8 lg:right-20 bg-ws-yellow/90 backdrop-blur-sm rounded-xl p-3 text-ws-dark transition-all duration-1000 delay-1000 hidden sm:block ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <div className="flex items-center gap-2">
          <Users size={16} className="text-ws-blue" />
          <div>
            <p className="text-xs font-bold text-ws-dark">Pacchetti Personalizzati</p>
            <p className="text-[0.65rem] text-ws-dark/70">Su misura per te</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 w-full">
        <div className="max-w-3xl">
          <div
            className={`flex items-center gap-3 mb-6 transition-all duration-800 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <MapPin size={13} className="text-ws-yellow" />
              <span className="text-xs font-semibold text-white/90 tracking-widest uppercase">
                Argentario · Sorano · Manciano
              </span>
            </div>
          </div>

          <h1
            className={`font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.05] mb-6 transition-all duration-900 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            Scopri la
            <br />
            <span className="text-ws-yellow italic">Maremma</span>
            <br />
            che non conosci
          </h1>

          <p
            className={`text-lg sm:text-xl text-white/80 max-w-xl leading-relaxed mb-10 transition-all duration-900 delay-400 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            Esperienze autentiche selezionate dai migliori artigiani locali. Dall&apos;Argentario a
            Sorano, da Manciano ad Arcille — vivi la Maremma come un locale.
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-4 transition-all duration-900 delay-600 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <Link href="/esperienze" className="ws-btn-primary text-base py-4 px-8">
              Esplora le Esperienze
            </Link>
            <Link href="/#come-funziona" className="ws-btn-outline text-base py-4 px-8">
              Come Funziona
            </Link>
          </div>

          <div
            className={`flex flex-wrap gap-8 mt-14 pt-8 border-t border-white/20 transition-all duration-900 delay-800 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {[
              { number: "50+", label: "Esperienze Uniche" },
              { number: "100%", label: "Artigiani Locali" },
              { number: "4", label: "Zone della Maremma" },
            ].map((stat) => (
              <div key={stat.label} className="text-white">
                <div className="font-display text-3xl font-bold text-ws-yellow">{stat.number}</div>
                <div className="text-sm text-white/70 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex justify-center pb-8">
        <Link
          href="/esperienze"
          className="flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors group"
        >
          <span className="text-xs tracking-widest uppercase">Scopri</span>
          <ChevronDown
            size={20}
            className="animate-bounce group-hover:text-ws-yellow transition-colors"
          />
        </Link>
      </div>

      <div className="absolute bottom-0 left-0 right-0 leading-none">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full">
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
            fill="#FAFAF7"
          />
        </svg>
      </div>
    </section>
  );
}
