import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import { applyDiscountCode } from "@/lib/discount";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

const Input = z.object({
  code: z.string().min(2).max(40).transform((s) => s.trim().toUpperCase()),
  description: z.string().max(200).optional().nullable(),
  kind: z.enum(["percent", "fixed_cents"]),
  value: z.number().int().min(1),
  validFrom: z.string().optional().nullable(),
  validUntil: z.string().optional().nullable(),
  usageLimit: z.number().int().min(1).optional().nullable(),
  active: z.boolean().optional(),
});

async function requireAdmin() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return data?.role === "admin" ? user : null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const validate = searchParams.get("validate");
  const commission = Number(searchParams.get("commission") ?? 0);

  if (validate) {
    const res = await applyDiscountCode(validate, commission);
    return NextResponse.json(res);
  }

  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Riservato admin" }, { status: 403 });

  const adminClient = createSupabaseAdminClient();
  const { data } = await adminClient.from("discount_codes").select("*").order("created_at", { ascending: false });
  return NextResponse.json({ codes: data ?? [] });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Riservato admin" }, { status: 403 });

  try {
    const input = Input.parse(await request.json());
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("discount_codes")
      .insert({
        code: input.code,
        description: input.description ?? null,
        kind: input.kind,
        value: input.value,
        valid_from: input.validFrom ?? null,
        valid_until: input.validUntil ?? null,
        usage_limit: input.usageLimit ?? null,
        active: input.active ?? true,
      })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await logAudit({ actorId: admin.id, action: "discount.create", entityType: "discount_code", entityId: data.id, metadata: { code: input.code } });
    return NextResponse.json({ code: data });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues[0]?.message }, { status: 400 });
    return NextResponse.json({ error: e instanceof Error ? e.message : "Errore" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Riservato admin" }, { status: 403 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id mancante" }, { status: 400 });
  const adminClient = createSupabaseAdminClient();
  await adminClient.from("discount_codes").delete().eq("id", id);
  await logAudit({ actorId: admin.id, action: "discount.delete", entityType: "discount_code", entityId: id });
  return NextResponse.json({ ok: true });
}
