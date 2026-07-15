import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./server";
import type { Profile, UserRole } from "@/lib/types";

/**
 * Risolve l'utente e il profilo correnti dal cookie di sessione.
 * Ritorna null se non autenticato o se Supabase non è configurato.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    return (data as Profile) ?? null;
  } catch {
    // Supabase non raggiungibile / mal configurato: degrada a "non autenticato"
    // così le pagine pubbliche restano navigabili (nessun 500/503).
    return null;
  }
}

export async function requireProfile(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  return profile;
}

export async function requireRole(role: UserRole): Promise<Profile> {
  const profile = await requireProfile();
  if (profile.role !== role && profile.role !== "admin") {
    redirect("/");
  }
  return profile;
}
