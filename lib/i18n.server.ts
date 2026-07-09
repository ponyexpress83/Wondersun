import { cookies } from "next/headers";
import { LOCALE_COOKIE, normalizeLocale, type Locale } from "@/lib/i18n";
import { getDictionary, type Dictionary } from "@/lib/dictionaries";

/** Locale corrente letto dal cookie (solo server). Default: italiano. */
export function getLocale(): Locale {
  return normalizeLocale(cookies().get(LOCALE_COOKIE)?.value);
}

/** Scorciatoia: locale + dizionario per i server component. */
export function getI18n(): { locale: Locale; dict: Dictionary } {
  const locale = getLocale();
  return { locale, dict: getDictionary(locale) };
}
