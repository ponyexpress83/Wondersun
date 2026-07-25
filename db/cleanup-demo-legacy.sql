-- ─────────────────────────────────────────────────────────────────────────
-- Wondersun · Pulizia dati demo legacy
-- Rimuove definitivamente gli elementi demo finti rimasti "parcheggiati"/sospesi
-- dopo che il fornitore demo è diventato reale (Tenuta Montauto).
--
-- Eseguire UNA VOLTA sul DB di produzione (SQL Editor). Idempotente: rieseguibile
-- senza errori. Non tocca Tenuta Montauto né le sue 4 esperienze reali.
-- ─────────────────────────────────────────────────────────────────────────

begin;

-- 1) Esperienze demo legacy, per slug (barca al tramonto + due schede vetrina)
delete from public.experiences
where slug in (
  'tramonto-in-barca-argentario-demo',
  'agriturismo-le-querce-maremma-demo',
  'osteria-del-porto-demo'
);

-- 2) Fornitore vetrina demo non più usato (+ eventuali esperienze residue via cascade)
delete from public.suppliers
where business_name = 'Maremma Ospitalità · Demo';

-- 3) Utente/profilo del fornitore vetrina demo
--    (l'eliminazione dell'utente auth rimuove il profilo in cascata; il delete
--     esplicito sul profilo è un fallback difensivo)
delete from auth.users where email = 'demo.vetrina@wondersun.it';
delete from public.profiles where email = 'demo.vetrina@wondersun.it';

commit;
