import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ExperienceInput = z.object({
  supplier_id: z.string().uuid(),
  title: z.string().min(3),
  slug: z.string().min(3),
  short_description: z.string().nullable().optional(),
  description: z.string().min(20),
  category: z.string().min(1),
  tag: z.string().nullable().optional(),
  duration_label: z.string().min(1),
  duration_hours: z.number().nullable().optional(),
  min_participants: z.number().int().min(1),
  max_participants: z.number().int().min(1),
  price_cents: z.number().int().min(0),
  price_type: z.enum(["pro_capite", "gruppo"]),
  location_name: z.string().min(1),
  location_area: z.string().min(1),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  cover_image_url: z.string().url().nullable().optional(),
  status: z.enum(["bozza", "pubblicata", "sospesa"]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = ExperienceInput.parse(body);

    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autenticato" }, { status: 401 });

    // Verifica che il supplier appartenga all'utente
    const { data: supplier } = await supabase
      .from("suppliers")
      .select("profile_id")
      .eq("id", data.supplier_id)
      .single();
    if (!supplier || supplier.profile_id !== user.id) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
    }

    // Garantisci slug univoco
    const baseSlug = data.slug;
    let slug = baseSlug;
    for (let i = 2; ; i++) {
      const { data: existing } = await supabase
        .from("experiences")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (!existing) break;
      slug = `${baseSlug}-${i}`;
      if (i > 50) break;
    }

    const { data: created, error } = await supabase
      .from("experiences")
      .insert({ ...data, slug })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ experience: created });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0]?.message ?? "Validazione" }, { status: 400 });
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Errore" },
      { status: 500 },
    );
  }
}
