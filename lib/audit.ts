import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Registra un'operazione sensibile nell'audit_log.
 * Best-effort: in caso di errore non blocca il flusso chiamante.
 *
 * Allegato A § 5.3 contratto · "Logging accessi e operazioni sensibili".
 */
export async function logAudit(params: {
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  actorId?: string;
}): Promise<void> {
  try {
    let actorId = params.actorId;
    if (!actorId) {
      const supabase = createSupabaseServerClient();
      const { data } = await supabase.auth.getUser();
      actorId = data.user?.id ?? undefined;
    }

    const admin = createSupabaseAdminClient();
    await admin.from("audit_log").insert({
      actor_id: actorId ?? null,
      action: params.action,
      entity_type: params.entityType ?? null,
      entity_id: params.entityId ?? null,
      metadata: params.metadata ?? null,
      ip_address: params.ipAddress ?? null,
    });
  } catch {
    // Audit log non deve mai bloccare l'operazione applicativa.
  }
}
