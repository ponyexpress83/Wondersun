import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Upload di immagini sui bucket Supabase Storage.
 * Bucket richiesti (da creare in Supabase Studio):
 *   - experience-covers (public read, authenticated insert)
 *   - supplier-logos (public read, authenticated insert)
 */
export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autenticato" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file") as File | null;
  const bucket = (form.get("bucket") as string) || "experience-covers";

  if (!file) return NextResponse.json({ error: "Nessun file" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File troppo grande (max 5 MB)" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${user.id}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({ url: publicUrl, path });
}
