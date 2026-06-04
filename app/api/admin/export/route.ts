import { NextResponse } from "next/server";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

/**
 * Esportazione CSV per commercialista (Allegato A § 4.2).
 * Solo prenotazioni pagate o completate: rappresentano gli incassi effettivi
 * del servizio digitale del Committente.
 */
export async function GET() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Riservato admin" }, { status: 403 });
  }

  const admin = createSupabaseAdminClient();
  const { data: bookings = [] } = await admin
    .from("bookings")
    .select(
      "booking_code, status, requested_date, paid_at, total_cents, commission_cents, commission_pct, high_value_fee_cents, supplier_payout_cents, experience:experiences(title), supplier:suppliers(business_name, vat_number)",
    )
    .in("status", ["pagata", "completata"])
    .order("paid_at", { ascending: false });

  const headers = [
    "Codice prenotazione",
    "Data esperienza",
    "Data pagamento",
    "Esperienza",
    "Fornitore",
    "P. IVA fornitore",
    "Totale lordo (€)",
    "Quota Wondersun incassata (€)",
    "% commissione",
    "Quota premium fissa (€)",
    "Quota fornitore (€)",
    "Causale",
    "Stato",
  ];

  const rows = (bookings as any[]).map((b) => [
    b.booking_code,
    b.requested_date ? new Date(b.requested_date).toLocaleDateString("it-IT") : "",
    b.paid_at ? new Date(b.paid_at).toLocaleDateString("it-IT") : "",
    b.experience?.title ?? "",
    b.supplier?.business_name ?? "",
    b.supplier?.vat_number ?? "",
    fmtEur(b.total_cents),
    fmtEur(b.commission_cents),
    `${b.commission_pct ?? ""}`,
    fmtEur(b.high_value_fee_cents),
    fmtEur(b.supplier_payout_cents),
    "Servizio di prenotazione digitale personalizzata",
    b.status,
  ]);

  const csv = [headers, ...rows]
    .map((r) => r.map((c) => csvEscape(String(c ?? ""))).join(";"))
    .join("\n");

  await logAudit({ actorId: user.id, action: "admin.export.csv", metadata: { rows: rows.length } });

  return new NextResponse("﻿" + csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="wondersun-incassi-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

function fmtEur(cents: number | null | undefined): string {
  if (cents == null) return "";
  return (cents / 100).toFixed(2).replace(".", ",");
}

function csvEscape(v: string): string {
  if (/[;"\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}
