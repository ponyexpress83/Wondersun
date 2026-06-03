import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

const BUCKET = "supplier-docs";
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

async function getSupplierForUser() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: supplier } = await supabase
    .from("suppliers")
    .select("id, profile_id")
    .eq("profile_id", user.id)
    .maybeSingle();
  return supplier ? { user, supplier } : null;
}

export async function GET() {
  const ctx = await getSupplierForUser();
  if (!ctx) return NextResponse.json({ error: "Solo fornitori" }, { status: 403 });

  const admin = createSupabaseAdminClient();
  const { data = [] } = await admin
    .from("supplier_documents")
    .select("*")
    .eq("supplier_id", ctx.supplier.id)
    .order("uploaded_at", { ascending: false });

  // Genera URL firmati validi 5 minuti
  const items = await Promise.all(
    (data as any[]).map(async (d) => {
      const { data: signed } = await admin.storage.from(BUCKET).createSignedUrl(d.storage_path, 300);
      return { ...d, url: signed?.signedUrl ?? null };
    }),
  );
  return NextResponse.json({ documents: items });
}

export async function POST(request: NextRequest) {
  const ctx = await getSupplierForUser();
  if (!ctx) return NextResponse.json({ error: "Solo fornitori" }, { status: 403 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File mancante" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File troppo grande (max 10 MB)" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const path = `${ctx.supplier.id}/${Date.now()}-${file.name}`;
  const { error: upErr } = await admin.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 });

  const { error: insErr } = await admin.from("supplier_documents").insert({
    supplier_id: ctx.supplier.id,
    filename: file.name,
    storage_path: path,
    size_bytes: file.size,
    mime_type: file.type,
  });
  if (insErr) {
    await admin.storage.from(BUCKET).remove([path]);
    return NextResponse.json({ error: insErr.message }, { status: 400 });
  }

  await logAudit({ actorId: ctx.user.id, action: "supplier.doc.upload", entityType: "supplier_document", entityId: path });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const ctx = await getSupplierForUser();
  if (!ctx) return NextResponse.json({ error: "Solo fornitori" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id mancante" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const { data: doc } = await admin
    .from("supplier_documents")
    .select("storage_path, supplier_id")
    .eq("id", id)
    .single();
  if (!doc || doc.supplier_id !== ctx.supplier.id) {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }
  await admin.storage.from(BUCKET).remove([doc.storage_path]);
  await admin.from("supplier_documents").delete().eq("id", id);
  await logAudit({ actorId: ctx.user.id, action: "supplier.doc.delete", entityType: "supplier_document", entityId: id });
  return NextResponse.json({ ok: true });
}
