import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

/**
 * Creazione fornitore da parte dell'admin (Ginevra carica i partner fondatori
 * in autonomia). Crea l'account auth del fornitore + profilo + record supplier
 * già approvato. Il fornitore potrà poi accedere con la propria email
 * (password impostata da admin o reset al primo accesso).
 */
const Input = z.object({
  business_name: z.string().min(2),
  login_email: z.string().email(),
  password: z.string().min(8).optional(),
  vat_number: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  province: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  contact_email: z.string().email().optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  website: z.string().url().optional().or(z.literal("")).nullable(),
  mode: z.enum(["prenotabile", "vetrina"]).default("prenotabile"),
  is_founding_partner: z.boolean().default(true),
});

async function requireAdmin() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return data?.role === "admin" ? user : null;
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Riservato admin" }, { status: 403 });

  try {
    const input = Input.parse(await request.json());
    const db = createSupabaseAdminClient();

    // 1) Crea (o recupera) l'utente auth del fornitore
    const password = input.password ?? `Wonder${Math.random().toString(36).slice(2, 10)}!`;
    let userId: string;
    const created = await db.auth.admin.createUser({
      email: input.login_email,
      password,
      email_confirm: true,
      user_metadata: { full_name: input.business_name, role: "fornitore" },
    });
    if (created.data?.user) {
      userId = created.data.user.id;
    } else {
      const msg = created.error?.message?.toLowerCase() ?? "";
      if (!msg.includes("already") && !msg.includes("registered") && !msg.includes("exists")) {
        return NextResponse.json(
          { error: `Creazione account fallita: ${created.error?.message}` },
          { status: 400 },
        );
      }
      // utente già esistente: recuperalo
      const list = await db.auth.admin.listUsers({ page: 1, perPage: 200 });
      const found = list.data.users.find(
        (u: { id: string; email?: string | null }) =>
          u.email?.toLowerCase() === input.login_email.toLowerCase(),
      );
      if (!found) {
        return NextResponse.json({ error: "Email già usata ma utente non trovato" }, { status: 409 });
      }
      userId = found.id;
    }

    // 2) Profilo fornitore
    await db.from("profiles").upsert(
      { id: userId, email: input.login_email, full_name: input.business_name, role: "fornitore" },
      { onConflict: "id" },
    );

    // 3) Record supplier (già approvato perché caricato dall'admin)
    const { data: existing } = await db
      .from("suppliers")
      .select("id")
      .eq("profile_id", userId)
      .maybeSingle();

    const supplierData = {
      profile_id: userId,
      business_name: input.business_name,
      vat_number: input.vat_number || null,
      city: input.city || null,
      province: input.province?.toUpperCase() || null,
      description: input.description || null,
      contact_email: input.contact_email || input.login_email,
      contact_phone: input.contact_phone || null,
      website: input.website || null,
      mode: input.mode,
      is_founding_partner: input.is_founding_partner,
      status: "approvato" as const,
      approved_at: new Date().toISOString(),
      approved_by: admin.id,
    };

    let supplierId: string;
    if (existing) {
      await db.from("suppliers").update(supplierData).eq("id", existing.id);
      supplierId = existing.id;
    } else {
      const ins = await db.from("suppliers").insert(supplierData).select("id").single();
      if (ins.error || !ins.data) {
        return NextResponse.json({ error: ins.error?.message }, { status: 400 });
      }
      supplierId = ins.data.id;
    }

    await logAudit({
      actorId: admin.id,
      action: "admin.supplier.create",
      entityType: "supplier",
      entityId: supplierId,
      metadata: { business_name: input.business_name, mode: input.mode },
    });

    return NextResponse.json({ supplierId, tempPassword: input.password ? undefined : password });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0]?.message ?? "Validazione" }, { status: 400 });
    }
    return NextResponse.json({ error: e instanceof Error ? e.message : "Errore" }, { status: 500 });
  }
}
