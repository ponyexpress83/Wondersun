"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "ws-cookie-consent-v1";

type Consent = {
  necessari: true;
  preferenze: boolean;
  statistiche: boolean;
  marketing: boolean;
  ts: string;
};

/**
 * Cookie banner GDPR — Allegato A § 5.3 contratto.
 *
 * Categorie: necessari (sempre on), preferenze, statistiche, marketing.
 * Le scelte sono persistite in localStorage e disponibili via getStoredConsent().
 * Per gli script di terze parti, integrare leggendo `ws-cookie-consent-v1`.
 */
export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [pref, setPref] = useState(false);
  const [stats, setStats] = useState(false);
  const [mkt, setMkt] = useState(false);

  useEffect(() => {
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const save = (consent: Omit<Consent, "necessari" | "ts">) => {
    const value: Consent = {
      necessari: true,
      preferenze: consent.preferenze,
      statistiche: consent.statistiche,
      marketing: consent.marketing,
      ts: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // localStorage non disponibile (cookies bloccati) — il banner si chiude solo per la sessione
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Preferenze cookie"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto max-w-3xl rounded-2xl bg-white shadow-2xl border border-gray-200 p-5 sm:p-6">
        <div className="flex items-start gap-3 mb-3">
          <Cookie size={20} className="text-ws-blue flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h2 className="font-display text-lg font-bold text-ws-dark">
              La tua privacy
            </h2>
            <p className="text-sm text-ws-text-light mt-1">
              Usiamo cookie tecnici per il funzionamento del sito. Con il tuo consenso usiamo anche
              cookie di analisi e marketing per migliorare l&apos;esperienza. Puoi cambiare idea
              in qualsiasi momento dal piè di pagina.
              <Link href="/privacy" className="ml-1 text-ws-blue underline">
                Leggi l&apos;informativa
              </Link>
              .
            </p>
          </div>
        </div>

        {expanded && (
          <div className="space-y-2 mb-4 pl-7 text-sm">
            <CheckboxRow
              label="Necessari"
              desc="Cookie indispensabili per autenticazione, sicurezza e funzionalità base. Sempre attivi."
              checked
              disabled
            />
            <CheckboxRow
              label="Preferenze"
              desc="Ricordano impostazioni come zona o filtri preferiti."
              checked={pref}
              onChange={setPref}
            />
            <CheckboxRow
              label="Statistiche"
              desc="Aiutano a capire come viene usato il sito (es. Google Analytics)."
              checked={stats}
              onChange={setStats}
            />
            <CheckboxRow
              label="Marketing"
              desc="Misurano l'efficacia di eventuali campagne pubblicitarie."
              checked={mkt}
              onChange={setMkt}
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => save({ preferenze: false, statistiche: false, marketing: false })}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-ws-text hover:bg-gray-50"
          >
            Solo necessari
          </button>
          {expanded && (
            <button
              onClick={() => save({ preferenze: pref, statistiche: stats, marketing: mkt })}
              className="flex-1 px-4 py-2 rounded-lg border border-ws-blue text-sm font-semibold text-ws-blue hover:bg-ws-blue/5"
            >
              Salva preferenze
            </button>
          )}
          {!expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-ws-text hover:bg-gray-50"
            >
              Personalizza
            </button>
          )}
          <button
            onClick={() => save({ preferenze: true, statistiche: true, marketing: true })}
            className="flex-1 ws-btn-blue text-sm"
          >
            Accetta tutti
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckboxRow({
  label,
  desc,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-ws-blue focus:ring-ws-blue disabled:opacity-50"
      />
      <span>
        <span className="font-semibold text-ws-dark">{label}</span>
        <span className="block text-xs text-ws-text-light">{desc}</span>
      </span>
    </label>
  );
}

export function getStoredConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}
