import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const SupplierInput = z.object({
  profile_id: z.string().uuid(),
  business_name: z.string().min(2),
  vat_number: z.string().optional().nullable(),
  city: z.string().min(2),
  province: z.string().optional().nullable(),
  description: z.string().min(20),
  contact_email: z.string().email(),
  contact_phone: z.string().optional().nullable(),
  website: z.string().url().optional().or(z.literal("")),
  // 'prenotabile' = flusso completo · 'vetrina' = solo visibilità con recapiti
  // diretti (modifica Art. 8 · 04-05/06/2026).
  mode: z.enum(["prenotabile", "vetrina"]).default("prenotabile"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = SupplierInput.parse(body);

    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    if (user.id !== data.profile_id) {
      return NextResponse.json({ error: "Profilo non autorizzato" }, { status: 403 });
    }

    // Promuovi il profilo a fornitore + crea il record supplier
    await supabase.from("profiles").update({ role: "fornitore" }).eq("id", user.id);

    const { data: supplier, error } = await supabase
      .from("suppliers")
      .insert({
        profile_id: data.profile_id,
        business_name: data.business_name,
        vat_number: data.vat_number || null,
        city: data.city,
        province: data.province?.toUpperCase() || null,
        description: data.description,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone || null,
        website: data.website || null,
        mode: data.mode,
        status: "in_attesa",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ supplier });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0]?.message ?? "Validazione" }, { status: 400 });
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Errore imprevisto" },
      { status: 500 },
    );
  }
}
