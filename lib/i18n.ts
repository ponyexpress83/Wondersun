/** Modulo i18n client-safe (nessun import server). */
export type Locale = "it" | "en";
export const LOCALES: Locale[] = ["it", "en"];
export const LOCALE_COOKIE = "ws_locale";

export function normalizeLocale(value: string | undefined | null): Locale {
  return value === "en" ? "en" : "it";
}
