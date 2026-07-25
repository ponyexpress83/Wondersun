# DB Changelog — Wondersun

Il progetto non usa una cartella di migrazioni versionata: le modifiche allo
schema stanno in `db/schema.sql` e gli interventi puntuali sono script one-off in
`db/`, tracciati qui e applicati a mano sul DB Supabase di produzione
(`ipunxusmsdsuzfqnbpum`).

| Data | Script | Stato | Note |
|------|--------|-------|------|
| 2026-07 | `db/cleanup-demo-legacy.sql` | ⏳ **DA APPLICARE in produzione** | Rimuove i dati demo legacy (esperienze `tramonto-in-barca…`, `le-querce…`, `osteria-del-porto…`; supplier `Maremma Ospitalità · Demo`; utente `demo.vetrina@wondersun.it`). Transazionale e idempotente. Non tocca Tenuta Montauto né la prenotazione `WS-2026-63609`. |

## Procedura (chi ha accesso al DB)
1. Eseguire `db/cleanup-demo-legacy.sql` (SQL Editor Supabase).
2. Eseguire `db/verify-demo-state.sql` (read-only) e verificare gli attesi:
   `legacy_experiences=0`, `vetrina_supplier=0`, `vetrina_auth_users=0`,
   `vetrina_profiles=0`, `montauto_ok=1`, `montauto_experiences=4`,
   `prosecdef=true` per `current_role`/`is_admin`, e `WS-2026-63609` con
   `status='richiesta'`.
3. Se una verifica non torna: `rollback` (la cleanup è transazionale) e segnalare.
4. Aggiornare qui lo **Stato** a ✅ **Applicato il <data>** con l'esito.
