"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client per uso lato browser (componenti "use client").
 * Le credenziali public-anon sono safe da esporre, le RLS proteggono i dati.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
