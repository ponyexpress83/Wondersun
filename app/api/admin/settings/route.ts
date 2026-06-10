import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

const ALLOWED_KEYS = new Set(["launch_date"]);

const Input = z.object({
  key: z.string().min(1),
  value: z.string().max(200).nullable(),
});

async function requireAdmin() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return data?.role === "admin" ? user : null;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Riservato admin" }, { status: 403 });
  const client = createSupabaseAdminClient();
  const { data } = await client.from("platform_settings").select("*");
  return NextResponse.json({ settings: data ?? [] });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Riservato admin" }, { status: 403 });
  try {
    const input = Input.parse(await request.json());
    if (!ALLOWED_KEYS.has(input.key)) {
      return NextResponse.json({ error: `Chiave non gestita: ${input.key}` }, { status: 400 });
    }
    const client = createSupabaseAdminClient();
    const { error } = await client.from("platform_settings").upsert({
      key: input.key,
      value: input.value,
      updated_at: new Date().toISOString(),
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    await logAudit({
      actorId: admin.id,
      action: "settings.update",
      entityType: "platform_setting",
      entityId: input.key,
      metadata: { value: input.value },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues[0]?.message }, { status: 400 });
    return NextResponse.json({ error: e instanceof Error ? e.message : "Errore" }, { status: 500 });
  }
}
