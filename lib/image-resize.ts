/**
 * Ridimensiona e comprime un'immagine nel browser prima dell'upload.
 *
 * Le foto scattate da telefono pesano spesso 5-10 MB e verrebbero rifiutate
 * (Vercel limita il corpo della richiesta a ~4,5 MB). Qui la portiamo a una
 * dimensione adatta al web mantenendo le proporzioni.
 */
export async function resizeImage(
  file: File,
  maxSide = 1920,
  quality = 0.82,
): Promise<File> {
  // Formati non ridimensionabili o file già leggeri: si caricano così come sono.
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  if (file.size <= 900 * 1024) return file;

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;

  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );
  if (!blob || blob.size >= file.size) return file;

  const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], name, { type: "image/jpeg" });
}
