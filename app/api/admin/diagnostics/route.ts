import { NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Diagnostica riservata all'admin: confronta ciò che esiste REALMENTE nel
 * database (service role, senza RLS) con ciò che l'utente collegato riesce a
 * leggere (con RLS). Serve a distinguere in un colpo solo i due casi:
 *   - "non ci sono dati"      → totali a 0
 *   - "i dati non si vedono"  → totali > 0 ma visibili = 0 (problema di permessi)
 */
export async function GET() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autenticato" }, { status: 401 });

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") {
    return NextResponse.json({ error: "Riservato all'amministratore" }, { status: 403 });
  }

  const admin = createSupabaseAdminClient();

  const count = async (client: any, table: string) => {
    const { count: n, error } = await client
      .from(table)
      .select("id", { count: "exact", head: true });
    return error ? `errore: ${error.message}` : (n ?? 0);
  };

  // Prenotazioni per fornitore (vista reale, senza RLS)
  const { data: suppliers } = await admin
    .from("suppliers")
    .select("id, business_name, mode, status, profile_id");
  const { data: allBookings } = await admin
    .from("bookings")
    .select("id, booking_code, status, supplier_id, client_id");

  const perSupplier = (suppliers ?? []).map((s: any) => ({
    fornitore: s.business_name,
    modalita: s.mode,
    stato: s.status,
    prenotazioni: (allBookings ?? []).filter((b: any) => b.supplier_id === s.id).length,
  }));

  return NextResponse.json({
    reale_senza_rls: {
      prenotazioni: (allBookings ?? []).length,
      fornitori: (suppliers ?? []).length,
      esperienze: await count(admin, "experiences"),
    },
    visibile_con_rls_da_questo_admin: {
      prenotazioni: await count(supabase, "bookings"),
      fornitori: await count(supabase, "suppliers"),
      esperienze: await count(supabase, "experiences"),
    },
    prenotazioni_per_fornitore: perSupplier,
    elenco_prenotazioni: (allBookings ?? []).map((b: any) => ({
      codice: b.booking_code,
      stato: b.status,
      supplier_id: b.supplier_id,
    })),
    come_leggere:
      "Se 'reale_senza_rls.prenotazioni' è 0 non ci sono prenotazioni da mostrare (serve crearne una). Se è > 0 ma 'visibile_con_rls' è 0, il problema è di permessi RLS.",
  });
}
