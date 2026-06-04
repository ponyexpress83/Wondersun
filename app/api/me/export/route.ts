import { NextResponse } from "next/server";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

/**
 * Diritto di portabilità (GDPR Art. 20) — Allegato A § 5.3.
 * Esporta tutti i dati personali dell'utente loggato in JSON.
 */
export async function GET() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autenticato" }, { status: 401 });

  const admin = createSupabaseAdminClient();

  const [profile, supplier, bookingsAsClient, packages, favorites] = await Promise.all([
    admin.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    admin.from("suppliers").select("*").eq("profile_id", user.id).maybeSingle(),
    admin
      .from("bookings")
      .select("*, experience:experiences(title,slug)")
      .eq("client_id", user.id),
    admin.from("packages").select("*, items:package_items(*)").eq("client_id", user.id),
    admin.from("favorites").select("*").eq("client_id", user.id),
  ]);

  let bookingsAsSupplier: unknown[] = [];
  if (supplier.data?.id) {
    const { data } = await admin
      .from("bookings")
      .select("*, experience:experiences(title,slug)")
      .eq("supplier_id", supplier.data.id);
    bookingsAsSupplier = data ?? [];
  }

  const payload = {
    exported_at: new Date().toISOString(),
    profile: profile.data ?? null,
    supplier: supplier.data ?? null,
    bookings_as_client: bookingsAsClient.data ?? [],
    bookings_as_supplier: bookingsAsSupplier,
    packages: packages.data ?? [],
    favorites: favorites.data ?? [],
  };

  await logAudit({
    actorId: user.id,
    action: "gdpr.export",
    entityType: "profile",
    entityId: user.id,
  });

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "content-disposition": `attachment; filename="wondersun-dati-${user.id}.json"`,
    },
  });
}
