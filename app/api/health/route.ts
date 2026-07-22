import { NextResponse } from "next/server";

/**
 * Health check minimale per monitoring/uptime.
 * Risponde 200 SEMPRE, anche senza Supabase o altre env configurate:
 * verifica solo che il processo Next risponda. Nessuna dipendenza esterna.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "wondersun",
    time: new Date().toISOString(),
  });
}
