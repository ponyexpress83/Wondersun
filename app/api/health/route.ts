import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Health check + keep-alive Supabase.
 *
 * Chiamato dal cron Vercel una volta al giorno (vercel.json): la query
 * tiene il progetto Supabase free tier "attivo" evitando l'auto-pause per
 * inattività (>7 giorni). Utile anche come target per l'uptime monitor.
 */
export async function GET() {
  const checks: Record<string, string> = {};

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const admin = createSupabaseAdminClient();
      const { error } = await admin.from("platform_settings").select("key").limit(1);
      checks.database = error ? `error: ${error.message}` : "ok";
    } else {
      checks.database = "not_configured";
    }
  } catch (e) {
    checks.database = `error: ${e instanceof Error ? e.message : "unknown"}`;
  }

  const healthy = checks.database === "ok" || checks.database === "not_configured";
  return NextResponse.json(
    { status: healthy ? "ok" : "degraded", checks, ts: new Date().toISOString() },
    { status: healthy ? 200 : 503 },
  );
}
