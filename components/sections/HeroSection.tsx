import Link from "next/link";
import { Briefcase, ThumbsUp, Star, ShieldCheck, ArrowRight } from "lucide-react";
import { getI18n } from "@/lib/i18n.server";
import SoleHeroCard from "@/components/SoleHeroCard";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1533514114760-4389f572ad05?w=1920&q=85&auto=format&fit=crop";

const STAT_ICONS = [Briefcase, ThumbsUp, Star, ShieldCheck];
const STAT_COLORS = ["bg-ws-blue", "bg-ws-yellow-dark", "bg-ws-red", "bg-ws-blue-light"];

export default function HeroSection() {
  const { dict } = getI18n();
  const t = dict.hero;

  return (
    <section className="relative">
      {/* Hero photo */}
      <div className="relative overflow-hidden pt-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMAGE}
          alt="Argentario — Maremma Toscana"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-28 lg:pb-36">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="font-display text-[2.6rem] sm:text-6xl lg:text-7xl font-extrabold leading-[1.02] text-ws-blue-dark">
                <span className="inline-block relative">
                  {t.titleLead}
                  <span className="absolute -bottom-1 left-0 h-1.5 w-28 rounded-full bg-ws-yellow" />
                </span>
                <br />
                <span className="text-ws-yellow-dark">{t.titleEm}</span>
              </h1>

              <p className="mt-7 max-w-lg text-lg sm:text-xl font-semibold text-ws-blue-dark/80">
                {t.lead}
              </p>

              <div className="mt-9 flex flex-col sm:flex-row gap-4">
                <Link href="/esperienze" className="ws-btn-yellow text-sm uppercase px-8 py-4">
                  {t.ctaExplore}
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/#come-funziona"
                  className="inline-flex items-center justify-center rounded-full border-2 border-ws-blue-dark/20 bg-white px-8 py-4 text-sm font-extrabold uppercase tracking-wide text-ws-blue-dark transition-colors hover:border-ws-blue hover:text-ws-blue"
                >
                  {t.ctaHow}
                </Link>
              </div>
            </div>

            {/* Sole AI preview */}
            <div className="hidden lg:block">
              <SoleHeroCard />
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 rounded-3xl bg-white p-6 sm:p-8 shadow-[0_20px_60px_rgba(30,90,168,0.12)] border border-gray-100">
          {t.stats.map((s, i) => {
            const Icon = STAT_ICONS[i] ?? Star;
            const showValue = Boolean(s.value) && s.value !== "★";
            return (
              <div key={s.label} className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 flex-shrink-0 rounded-full ${STAT_COLORS[i]} flex items-center justify-center text-white shadow-md`}
                >
                  <Icon size={24} />
                </div>
                <div>
                  {showValue && (
                    <p className="font-display text-2xl font-extrabold leading-none text-ws-blue-dark">
                      {s.value}
                    </p>
                  )}
                  <p className="text-sm font-semibold text-ws-text-light leading-snug mt-0.5">
                    {s.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
