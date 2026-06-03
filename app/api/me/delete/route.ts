import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

/**
 * Diritto all'oblio (GDPR Art. 17) — Allegato A § 5.3.
 *
 * Richiede conferma esplicita (body: { confirm: true }).
 * Lo schema usa ON DELETE CASCADE su profiles, quindi rimuovere il record auth
 * elimina anche profilo, supplier, prenotazioni come cliente, pacchetti, preferiti.
 * Le prenotazioni con questo profilo come supplier_id restano ma con riferimento
 * spezzato (ON DELETE RESTRICT su supplier_id) — in tal caso bloccano la cancellazione
 * e l'utente deve prima chiudere/migrare le esperienze contattando l'amministratore.
 */
export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autenticato" }, { status: 401 });

  let confirm = false;
  try {
    const body = await request.json();
    confirm = body?.confirm === true;
  } catch {}

  if (!confirm) {
    return NextResponse.json(
      { error: "Conferma esplicita richiesta (confirm: true)" },
      { status: 400 },
    );
  }

  const admin = createSupabaseAdminClient();

  await logAudit({
    actorId: user.id,
    action: "gdpr.delete.requested",
    entityType: "profile",
    entityId: user.id,
  });

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    // Tipicamente fallisce per foreign key restrict (es. fornitore con prenotazioni storiche).
    return NextResponse.json(
      {
        error:
          "Impossibile cancellare l'account: ci sono dati collegati che impediscono la rimozione automatica. Contatta il supporto.",
        details: error.message,
      },
      { status: 409 },
    );
  }

  return NextResponse.json({ ok: true });
}
