import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";

/**
 * Upload di immagini sui bucket Supabase Storage.
 * Bucket usati: experience-covers, supplier-logos.
 *
 * L'utente viene autenticato con la sua sessione, ma la scrittura sullo Storage
 * avviene con il service role: così il caricamento non dipende dalle policy del
 * bucket (che altrimenti fanno fallire l'upload dal pannello con un errore poco
 * comprensibile).
 */
export const dynamic = "force-dynamic";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];
// Vercel limita il corpo della richiesta a ~4,5 MB: teniamo un margine e
// chiediamo al client di ridimensionare le foto più grandi.
const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autenticato" }, { status: 401 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      {
        error:
          "Immagine troppo pesante per il caricamento. Riprova: verrà ridotta automaticamente.",
      },
      { status: 413 },
    );
  }

  const file = form.get("file") as File | null;
  const bucket = (form.get("bucket") as string) || "experience-covers";

  if (!file) return NextResponse.json({ error: "Nessun file selezionato" }, { status: 400 });

  if (file.type && !ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "Formato non supportato: usa JPG, PNG o WEBP." },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      {
        error: `Immagine troppo pesante (${(file.size / 1024 / 1024).toFixed(1)} MB). Il limite è 4 MB: riducila e riprova.`,
      },
      { status: 400 },
    );
  }

  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${user.id}/${Date.now()}.${ext || "jpg"}`;

  // Scrittura con service role: l'utente è già stato autenticato sopra.
  const admin = createSupabaseAdminClient();
  const { error } = await admin.storage
    .from(bucket)
    .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type || undefined });

  if (error) {
    const msg = /not found|bucket/i.test(error.message)
      ? `Archivio immagini non configurato (bucket "${bucket}"). Va creato in Supabase Storage.`
      : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const {
    data: { publicUrl },
  } = admin.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({ url: publicUrl, path });
}
