import { redirect } from "next/navigation";
import { requireRole } from "@/lib/supabase/auth-helpers";

export const metadata = { title: "Le mie esperienze" };

// Governance "controllo totale admin": i fornitori non modificano le schede
// (le gestisce lo staff Wondersun). L'accesso diretto viene reindirizzato
// all'elenco in sola lettura. La modifica resta all'admin.
// NOTA: qui c'era anche la gestione disponibilità (AvailabilityManager): se in
// futuro i fornitori dovranno gestirla, va ri-esposta come vista dedicata.
export default async function EditExperiencePage() {
  await requireRole("fornitore");
  redirect("/fornitore/esperienze");
}
