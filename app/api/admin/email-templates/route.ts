import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return data?.role === "admin" ? user : null;
}

const Input = z.object({
  slug: z.string().min(1).max(60),
  subject: z.string().min(1).max(300),
  body_md: z.string().max(20000),
});

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Riservato admin" }, { status: 403 });
  try {
    const input = Input.parse(await request.json());
    const client = createSupabaseAdminClient();
    const { error } = await client.from("email_templates").upsert({
      slug: input.slug,
      subject: input.subject,
      body_md: input.body_md,
      updated_at: new Date().toISOString(),
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    await logAudit({ actorId: admin.id, action: "email.update", entityType: "email_template", entityId: input.slug });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues[0]?.message }, { status: 400 });
    return NextResponse.json({ error: e instanceof Error ? e.message : "Errore" }, { status: 500 });
  }
}
