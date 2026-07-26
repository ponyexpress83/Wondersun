import { redirect } from "next/navigation";
import { requireRole } from "@/lib/supabase/auth-helpers";

export const metadata = { title: "Le mie esperienze" };

// Governance "controllo totale admin": i fornitori non creano/pubblicano schede
// (le gestisce lo staff Wondersun). L'accesso diretto a questa pagina viene
// reindirizzato all'elenco in sola lettura. La creazione resta all'admin.
export default async function NewExperiencePage() {
  await requireRole("fornitore");
  redirect("/fornitore/esperienze");
}
