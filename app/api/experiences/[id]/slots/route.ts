import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface RouteContext {
  params: { id: string };
}

/**
 * Calendario disponibilità per esperienza (Allegato A § 3.2).
 *
 * GET    → pubblico: slot futuri con posti disponibili
 * POST   → fornitore proprietario: aggiunge uno slot (data + capienza)
 * DELETE → fornitore proprietario: rimuove uno slot (?slotId=)
 */
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("availability_slots")
    .select("id, starts_at, ends_at, capacity, booked_count, is_available")
    .eq("experience_id", params.id)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(120);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const slots = (data ?? []).filter((s) => s.is_available && s.booked_count < s.capacity);
  return NextResponse.json({ slots });
}

const SlotInput = z.object({
  startsAt: z.string().min(8),
  endsAt: z.string().optional().nullable(),
  capacity: z.number().int().min(1).max(500),
});

// Inserimento multiplo (calendario ricorrente): il fornitore genera in un colpo
// solo tutte le date di un periodo con uno o più orari (es. "ogni giorno alle
// 10 e alle 15"). Il client espande già le occorrenze e invia gli istanti ISO.
const BulkInput = z.object({
  capacity: z.number().int().min(1).max(500),
  startsAt: z.array(z.string().min(8)).min(1).max(400),
});

async function requireOwnership(experienceId: string) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non autenticato", status: 401 as const };

  const { data: experience } = await supabase
    .from("experiences")
    .select("id, supplier:suppliers(profile_id)")
    .eq("id", experienceId)
    .single();
  if (!experience) return { error: "Esperienza non trovata", status: 404 as const };

  if ((experience as any).supplier?.profile_id !== user.id) {
    // L'amministrazione gestisce le disponibilità di tutti i fornitori
    // (governance "controllo totale admin").
    const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (me?.role !== "admin") {
      return { error: "Non autorizzato", status: 403 as const };
    }
  }
  return { supabase };
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const owned = await requireOwnership(params.id);
    if ("error" in owned) {
      return NextResponse.json({ error: owned.error }, { status: owned.status });
    }
    const payload = await request.json();

    // ── Inserimento multiplo (calendario ricorrente) ────────────────────────
    if (Array.isArray(payload?.startsAt)) {
      const input = BulkInput.parse(payload);
      const now = new Date();
      const rows = input.startsAt
        .map((s) => new Date(s))
        .filter((d) => !isNaN(d.getTime()) && d > now) // scarta date passate/non valide
        .map((d) => ({
          experience_id: params.id,
          starts_at: d.toISOString(),
          ends_at: null,
          capacity: input.capacity,
        }));

      if (rows.length === 0) {
        return NextResponse.json(
          { error: "Nessuna data futura valida da inserire." },
          { status: 400 },
        );
      }

      const { data, error } = await owned.supabase
        .from("availability_slots")
        .insert(rows)
        .select();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ inserted: data?.length ?? 0 });
    }

    // ── Inserimento singolo ─────────────────────────────────────────────────
    const input = SlotInput.parse(payload);
    const startsAt = new Date(input.startsAt);
    if (isNaN(startsAt.getTime()) || startsAt < new Date()) {
      return NextResponse.json({ error: "La data deve essere futura" }, { status: 400 });
    }

    const { data, error } = await owned.supabase
      .from("availability_slots")
      .insert({
        experience_id: params.id,
        starts_at: startsAt.toISOString(),
        ends_at: input.endsAt ? new Date(input.endsAt).toISOString() : null,
        capacity: input.capacity,
      })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ slot: data });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0]?.message ?? "Validazione" }, { status: 400 });
    }
    return NextResponse.json({ error: e instanceof Error ? e.message : "Errore" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const owned = await requireOwnership(params.id);
  if ("error" in owned) {
    return NextResponse.json({ error: owned.error }, { status: owned.status });
  }
  const { searchParams } = new URL(request.url);
  const slotId = searchParams.get("slotId");
  if (!slotId) return NextResponse.json({ error: "slotId mancante" }, { status: 400 });

  const { error } = await owned.supabase
    .from("availability_slots")
    .delete()
    .eq("id", slotId)
    .eq("experience_id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
