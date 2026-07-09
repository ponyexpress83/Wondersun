"use client";

import { createContext, useContext } from "react";
import type { Locale } from "@/lib/i18n";

const LocaleContext = createContext<Locale>("it");

export function LocaleProvider({
  initial,
  children,
}: {
  initial: Locale;
  children: React.ReactNode;
}) {
  return <LocaleContext.Provider value={initial}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext);
