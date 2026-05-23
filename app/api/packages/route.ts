import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const AddInput = z.object({
  experienceId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const { experienceId } = AddInput.parse(await request.json());

    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Devi essere loggato" }, { status: 401 });

    const { data: experience } = await supabase
      .from("experiences")
      .select("id, status, min_participants")
      .eq("id", experienceId)
      .maybeSingle();
    if (!experience) {
      return NextResponse.json({ error: "Esperienza non trovata" }, { status: 404 });
    }
    if (experience.status !== "pubblicata") {
      return NextResponse.json({ error: "Esperienza non disponibile" }, { status: 400 });
    }

    // Un solo carrello aperto per cliente: riusa la bozza o creane una.
    let { data: cart } = await supabase
      .from("packages")
      .select("id")
      .eq("client_id", user.id)
      .eq("status", "bozza")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!cart) {
      const { data: created, error: cErr } = await supabase
        .from("packages")
        .insert({ client_id: user.id, name: "Il mio pacchetto", status: "bozza" })
        .select("id")
        .single();
      if (cErr) return NextResponse.json({ error: cErr.message }, { status: 400 });
      cart = created;
    }

    // Evita duplicati della stessa esperienza nello stesso carrello.
    const { data: existing } = await supabase
      .from("package_items")
      .select("id")
      .eq("package_id", cart.id)
      .eq("experience_id", experienceId)
      .maybeSingle();

    if (!existing) {
      const { error: iErr } = await supabase.from("package_items").insert({
        package_id: cart.id,
        experience_id: experienceId,
        participants: experience.min_participants,
      });
      if (iErr) return NextResponse.json({ error: iErr.message }, { status: 400 });
    }

    const { count } = await supabase
      .from("package_items")
      .select("*", { count: "exact", head: true })
      .eq("package_id", cart.id);

    return NextResponse.json({
      packageId: cart.id,
      itemCount: count ?? 0,
      alreadyInCart: Boolean(existing),
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0]?.message ?? "Validazione" }, { status: 400 });
    }
    return NextResponse.json({ error: e instanceof Error ? e.message : "Errore" }, { status: 500 });
  }
}
