/**
 * Riconosce l'errore di PostgREST relativo a una colonna assente e ne
 * restituisce il nome.
 *
 * Serve a non bloccare i salvataggi quando una migration facoltativa (es.
 * experiences.video_url) non è ancora stata applicata in produzione: il campo
 * viene rimosso e l'operazione viene ripetuta.
 */
export function missingColumn(message?: string | null): string | null {
  if (!message) return null;
  const m = message.match(/'([a-z_]+)' column|column "?([a-z_]+)"? of/i);
  const name = m?.[1] ?? m?.[2] ?? null;
  return name && /could not find|does not exist|schema cache/i.test(message) ? name : null;
}
