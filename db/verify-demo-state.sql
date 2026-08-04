-- ─────────────────────────────────────────────────────────────────────────
-- Wondersun · Verifica stato demo (read-only)
-- Da eseguire DOPO db/cleanup-demo-legacy.sql. Tutte le query sono di sola
-- lettura: riporta l'output di ognuna.
-- Atteso: legacy=0, vetrina=0, prosecdef=true.
-- NB: montauto_experiences può variare (la committente aggiorna le schede) e lo
-- stato della prenotazione WS-2026-63609 è informativo, non un valore fisso.
-- ─────────────────────────────────────────────────────────────────────────

-- 1) 0 esperienze legacy
select count(*) as legacy_experiences
from public.experiences
where slug in (
  'tramonto-in-barca-argentario-demo',
  'agriturismo-le-querce-maremma-demo',
  'osteria-del-porto-demo'
);

-- 2) 0 supplier vetrina demo
select count(*) as vetrina_supplier
from public.suppliers
where business_name = 'Maremma Ospitalità · Demo';

-- 3) 0 utenti/profili demo.vetrina
select
  (select count(*) from auth.users where email = 'demo.vetrina@wondersun.it') as vetrina_auth_users,
  (select count(*) from public.profiles where email = 'demo.vetrina@wondersun.it') as vetrina_profiles;

-- 4) ESATTAMENTE 1 Tenuta Montauto con gli attributi strutturali giusti.
--    Il recapito telefonico NON è tra i controlli: è un dato che la committente
--    aggiorna dal pannello e non deve far fallire la verifica.
select count(*) as montauto_ok
from public.suppliers
where business_name = 'Tenuta Montauto'
  and mode = 'prenotabile'
  and status = 'approvato'
  and vat_number = '01259100533';

-- 5) ESATTAMENTE 4 esperienze Montauto pubblicate, prezzi giusti, cover sul bucket
select count(*) as montauto_experiences
from public.experiences e
join public.suppliers s on s.id = e.supplier_id
where s.business_name = 'Tenuta Montauto'
  and e.status = 'pubblicata'
  and e.price_cents in (2500, 4000, 5000, 7500)
  and e.cover_image_url like '%experience-covers%';

-- 5b) Dettaglio delle 4 esperienze (controllo visivo)
select e.slug, e.title, e.price_cents, e.status
from public.experiences e
join public.suppliers s on s.id = e.supplier_id
where s.business_name = 'Tenuta Montauto'
order by e.price_cents;

-- 6) current_role() e is_admin() con SECURITY DEFINER (prosecdef = true)
select proname, prosecdef
from pg_proc
where pronamespace = 'public'::regnamespace
  and proname in ('current_role', 'is_admin');

-- 7) Prenotazione demo storica: riga informativa, senza stato atteso.
--    (Al 2026-08-03 risulta 'no_show', passata dal job di scadenza automatica.)
select booking_code, status
from public.bookings
where booking_code = 'WS-2026-63609';
