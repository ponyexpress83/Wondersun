import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

/**
 * Modifica dell'anagrafica di un fornitore da parte dell'amministrazione
 * (Allegato A § 4.1 — gestione fornitori). Con la governance "controllo totale
 * admin" i fornitori non modificano da soli la propria scheda: lo fa l'admin.
 */
const Input = z.object({
  business_name: z.string().min(2),
  vat_number: z.string().optional().nullable(),
  registered_office: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  province: z.string().optional().nullable(),
  postal_code: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  contact_email: z.string().email().optional().or(z.literal("")).nullable(),
  contact_phone: z.string().optional().nullable(),
  website: z.string().url().optional().or(z.literal("")).nullable(),
  mode: z.enum(["prenotabile", "vetrina"]).optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autenticato" }, { status: 401 });

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") {
    return NextResponse.json({ error: "Riservato all'amministratore" }, { status: 403 });
  }

  let input: z.infer<typeof Input>;
  try {
    input = Input.parse(await request.json());
  } catch (e) {
    const msg = e instanceof z.ZodError ? e.issues[0]?.message : "Dati non validi";
    return NextResponse.json({ error: msg ?? "Dati non validi" }, { status: 400 });
  }

  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("suppliers")
    .update({
      ...input,
      contact_email: input.contact_email || null,
      website: input.website || null,
    })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logAudit({
    actorId: user.id,
    action: "supplier.updated",
    entityType: "supplier",
    entityId: params.id,
    metadata: { business_name: input.business_name },
  });

  return NextResponse.json({ supplier: data });
}
