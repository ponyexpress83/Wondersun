import Link from "next/link";
import { Store, TrendingUp, ShieldCheck, Gift } from "lucide-react";
import { getI18n } from "@/lib/i18n.server";

const BENEFIT_ICONS = [Gift, TrendingUp, ShieldCheck, Store];

export default function SupplierCTASection() {
  const t = getI18n().dict.supplier;

  return (
    <section className="py-24 bg-gradient-to-br from-ws-blue-deeper via-ws-blue-dark to-ws-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="ws-badge bg-white/15 text-white border-white/25 mb-4">{t.badge}</span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t.titleLead} <span className="text-ws-yellow italic">{t.titleEm}</span>
            </h2>
            <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-xl">{t.lead}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {t.benefits.map((b, i) => {
                const Icon = BENEFIT_ICONS[i] ?? Store;
                return (
                  <div key={b.label} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-ws-yellow" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{b.label}</p>
                      <p className="text-xs text-white/60">{b.note}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/fornitore/registrati" className="ws-btn-accent">
                {t.ctaPrimary}
              </Link>
              <Link
                href="/fornitore/dashboard"
                className="ws-btn-outline border-white/40 hover:border-white"
              >
                {t.ctaSecondary}
              </Link>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/15">
            <h3 className="font-display text-2xl font-bold mb-6">{t.priceTitle}</h3>

            <div className="space-y-5">
              <div className="flex items-baseline justify-between border-b border-white/15 pb-4">
                <div>
                  <p className="text-sm text-white/60">{t.subLabel}</p>
                  <p className="font-display text-3xl font-bold">
                    €29<span className="text-sm font-normal text-white/60">{t.perMonth}</span>
                  </p>
                </div>
                <span className="ws-badge bg-ws-yellow/20 text-ws-yellow border-ws-yellow/30">
                  {t.freeBadge}
                </span>
              </div>

              <div className="flex items-baseline justify-between border-b border-white/15 pb-4">
                <div>
                  <p className="text-sm text-white/60">{t.commissionLabel}</p>
                  <p className="font-display text-3xl font-bold">{t.commissionValue}</p>
                </div>
                <span className="text-xs text-white/50 text-right max-w-[9rem]">
                  {t.commissionNote}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm text-white/60">{t.premiumLabel}</p>
                  <p className="font-display text-lg font-bold">{t.premiumValue}</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-white/50 mt-6 leading-relaxed">{t.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
