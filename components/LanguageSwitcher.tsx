"use client";

import { LOCALE_COOKIE, LOCALES, type Locale } from "@/lib/i18n";
import { useLocale } from "@/components/LocaleProvider";

/**
 * Selettore lingua IT / EN. Salva il locale in un cookie e ricarica,
 * così i server component ri-renderizzano nella lingua scelta.
 */
export default function LanguageSwitcher({ light = false }: { light?: boolean }) {
  const current = useLocale();

  const choose = (loc: Locale) => {
    if (loc === current) return;
    document.cookie = `${LOCALE_COOKIE}=${loc};path=/;max-age=31536000;samesite=lax`;
    window.location.reload();
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border p-0.5 text-xs font-bold ${
        light ? "border-white/30" : "border-gray-200"
      }`}
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((loc) => {
        const active = loc === current;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => choose(loc)}
            aria-pressed={active}
            className={`px-2.5 py-1 rounded-full uppercase transition-colors ${
              active
                ? "bg-ws-blue text-white"
                : light
                  ? "text-white/80 hover:text-white"
                  : "text-ws-text-light hover:text-ws-blue"
            }`}
          >
            {loc}
          </button>
        );
      })}
    </div>
  );
}
