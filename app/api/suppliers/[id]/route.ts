import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notifySupplierStatusChange } from "@/lib/notify";
import { logAudit } from "@/lib/audit";

interface RouteContext {
  params: { id: string };
}

const NOTIFY_STATUS: Record<string, "approvato" | "rifiutato" | "sospeso" | "riattivato"> = {
  approva: "approvato",
  rifiuta: "rifiutato",
  sospendi: "sospeso",
  riattiva: "riattivato",
};

const ActionInput = z.object({
  action: z.enum(["approva", "rifiuta", "sospendi", "riattiva"]),
  // Motivazione interna (richiesta per rifiuto/sospensione)
  reason: z.string().max(500).optional().nullable(),
});

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const input = ActionInput.parse(await request.json());

    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autenticato" }, { status: 401 });

    const { data: me } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (me?.role !== "admin") {
      return NextResponse.json({ error: "Riservato agli amministratori" }, { status: 403 });
    }

    if ((input.action === "rifiuta" || input.action === "sospendi") && !input.reason?.trim()) {
      return NextResponse.json(
        { error: "Indica una motivazione per rifiuto/sospensione" },
        { status: 400 },
      );
    }

    const update: Record<string, unknown> = {};
    switch (input.action) {
      case "approva":
        update.status = "approvato";
        update.approved_at = new Date().toISOString();
        update.approved_by = user.id;
        update.status_notes = null;
        break;
      case "riattiva":
        update.status = "approvato";
        update.status_notes = null;
        break;
      case "rifiuta":
        update.status = "rifiutato";
        update.status_notes = input.reason;
        break;
      case "sospendi":
        update.status = "sospeso";
        update.status_notes = input.reason;
        break;
    }

    const { data: supplier, error } = await supabase
      .from("suppliers")
      .update(update)
      .eq("id", params.id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await notifySupplierStatusChange(
      { email: supplier.contact_email, whatsapp: supplier.contact_phone },
      {
        businessName: supplier.business_name,
        status: NOTIFY_STATUS[input.action],
        reason: input.reason,
      },
    );

    await logAudit({
      actorId: user.id,
      action: `supplier.${input.action}`,
      entityType: "supplier",
      entityId: params.id,
      metadata: { new_status: update.status, reason: input.reason ?? null },
    });

    return NextResponse.json({ supplier });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0]?.message ?? "Validazione" }, { status: 400 });
    }
    return NextResponse.json({ error: e instanceof Error ? e.message : "Errore" }, { status: 500 });
  }
}
