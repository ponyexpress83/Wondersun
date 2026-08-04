# DB Changelog — Wondersun

Il progetto non usa una cartella di migrazioni versionata: le modifiche allo
schema stanno in `db/schema.sql` e gli interventi puntuali sono script one-off in
`db/`, tracciati qui e applicati a mano sul DB Supabase di produzione
(`ipunxusmsdsuzfqnbpum`).

| Data | Script | Stato | Note |
|------|--------|-------|------|
| 2026-08-03 | `db/migration-payment-deadline.sql` | ✅ **Applicato il 2026-08-03** | Aggiunge `bookings.payment_deadline` (timestamptz) + indice parziale e l'impostazione `platform_settings.payment_window_minutes = '60'`. Additivo/idempotente. Verificato: colonna presente, `payment_window=60`. Sblocca la conferma prenotazione da parte del fornitore (prima andava in errore). |
| 2026-08-03 | `db/migration-invoice-request.sql` | ✅ **Applicato il 2026-08-03** | Aggiunge `bookings.invoice_requested` (bool, default false) e `bookings.invoice_data` (jsonb) + indice parziale. Additivo/idempotente. Verificato: entrambe le colonne presenti. |
| 2026-08-03 | `db/migration-gallery-video.sql` | ✅ **Applicato il 2026-08-03** | Aggiunge `experiences.video_url` (text). Additivo/idempotente. Verificato: colonna presente. |
| 2026-07 → 2026-08-03 | `db/cleanup-demo-legacy.sql` | ✅ **Già effettivo al 2026-08-03** | Rimuove i dati demo legacy (esperienze `tramonto-in-barca…`, `le-querce…`, `osteria-del-porto…`; supplier `Maremma Ospitalità · Demo`; utente `demo.vetrina@wondersun.it`). Le righe target risultano **già assenti** in produzione: `verify-demo-state` ritorna tutti 0. Nessun dato reale toccato. |

## Verifica eseguita il 2026-08-03 (read-only, `db/verify-demo-state.sql`)

- `legacy_experiences = 0` ✅
- `vetrina_supplier = 0`, `vetrina_auth_users = 0`, `vetrina_profiles = 0` ✅
- `current_role` e `is_admin` con `prosecdef = true` ✅
- `montauto_experiences = 4` (pubblicate) ✅
- `montauto_ok = 0` ⚠️ — **non è una regressione**: Tenuta Montauto è integra
  (nome, `mode=prenotabile`, `status=approvato`, P.IVA `01259100533`, 4 esperienze
  pubblicate); è cambiato solo `contact_phone`, ora `3314597165` (era
  `+393793785317`), per una modifica anagrafica della committente. Il match rigido
  dello script usava il vecchio numero → vincolo rimosso dallo script (vedi sotto).
- `WS-2026-63609`: ora `status = 'no_show'` (era `'richiesta'`), passata dal job di
  scadenza automatica il 2026-07-28 — non toccata dalle migration.
- Nuovo fornitore reale in caricamento: **Noleggio Trillocco** (P.IVA
  `00785800533`, approvato) — intatto.

## Procedura (chi ha accesso al DB)
1. Le tre migration additive (`payment-deadline`, `invoice-request`,
   `gallery-video`) sono applicate: rieseguirle è un no-op (sono idempotenti).
2. Eseguire `db/verify-demo-state.sql` (read-only). Attesi aggiornati:
   `legacy_experiences=0`, `vetrina_supplier=0`, `vetrina_auth_users=0`,
   `vetrina_profiles=0`, `prosecdef=true` per `current_role`/`is_admin`.
   NB: `montauto_experiences` può variare (la committente modifica le schede) e
   lo stato di `WS-2026-63609` è informativo, non un valore atteso fisso.
3. Se una verifica non torna per ragioni diverse da quelle documentate qui:
   fermarsi e segnalare.
4. Aggiornare questa tabella con nuovi interventi mantenendo data ed esito.

## Allineamento di `verify-demo-state.sql` (fatto il 2026-08-03)
Lo script è stato reso tollerante ai dati modificati dalla committente:
- controllo n.4 (`montauto_ok`): rimosso il vincolo su `contact_phone`, che è un
  dato editabile dal pannello e non deve far fallire la verifica. Restano
  `business_name`, `mode`, `status` e `vat_number`;
- controllo n.7: la riga su `WS-2026-63609` resta come informazione di contesto,
  senza pretendere lo stato `'richiesta'`.
