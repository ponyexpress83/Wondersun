import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface RouteContext {
  params: { itemId: string };
}

const UpdateInput = z.object({
  requestedDate: z.string().optional().nullable(),
  participants: z.number().int().min(1).optional(),
});

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const input = UpdateInput.parse(await request.json());

    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autenticato" }, { status: 401 });

    const { data: item } = await supabase
      .from("package_items")
      .select("id, experience:experiences(min_participants, max_participants)")
      .eq("id", params.itemId)
      .maybeSingle();
    if (!item) return NextResponse.json({ error: "Voce non trovata" }, { status: 404 });

    const update: Record<string, unknown> = {};
    if (input.requestedDate !== undefined) update.requested_date = input.requestedDate || null;
    if (input.participants !== undefined) {
      const exp = (item as any).experience;
      if (exp && (input.participants < exp.min_participants || input.participants > exp.max_participants)) {
        return NextResponse.json(
          {
            error: `Partecipanti fuori dai limiti (${exp.min_participants}–${exp.max_participants})`,
          },
          { status: 400 },
        );
      }
      update.participants = input.participants;
    }

    const { data, error } = await supabase
      .from("package_items")
      .update(update)
      .eq("id", params.itemId)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ item: data });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0]?.message ?? "Validazione" }, { status: 400 });
    }
    return NextResponse.json({ error: e instanceof Error ? e.message : "Errore" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: RouteContext) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autenticato" }, { status: 401 });

  const { error } = await supabase.from("package_items").delete().eq("id", params.itemId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
