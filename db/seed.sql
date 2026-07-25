-- ─────────────────────────────────────────────────────────────────────────
-- Wondersun · Dati di esempio (DEV) · allineati alla produzione
-- Crea il fornitore reale "Tenuta Montauto" + 4 esperienze di degustazione.
-- ATTENZIONE: eseguire SOLO in ambienti di sviluppo. In produzione i dati reali
-- sono già presenti — NON rieseguire questo seed lì (introdurrebbe dati demo).
-- Richiede un utente auth.users già creato (il fornitore demo) a cui legarsi.
-- ─────────────────────────────────────────────────────────────────────────

-- Sostituisci con l'UUID dell'utente fornitore (demo.fornitore@wondersun.it)
\set supplier_user_id '00000000-0000-0000-0000-000000000000'

update public.profiles set role = 'fornitore' where id = :'supplier_user_id';

-- Fornitore: Tenuta Montauto (prenotabile, approvato)
insert into public.suppliers (
  profile_id, business_name, vat_number, registered_office, city, province,
  postal_code, description, contact_email, contact_phone, mode, status,
  subscription_status
) values (
  :'supplier_user_id', 'Tenuta Montauto', '01259100533',
  'Località Montauto, 58011 Capalbio (GR)', 'Capalbio', 'GR', '58011',
  'Tenuta Montauto — azienda vitivinicola biologica a Capalbio, sulla Costa d''Argento. Degustazioni in cantina e barricaia tra i vigneti dell''Argentario.',
  'demo.fornitore@wondersun.it', '+393793785317', 'prenotabile', 'approvato', 'trial'
)
on conflict (profile_id) do nothing;

-- 4 esperienze reali (degustazioni)
with s as (select id from public.suppliers where profile_id = :'supplier_user_id' limit 1)
insert into public.experiences (
  supplier_id, slug, title, short_description, description, category,
  duration_label, duration_hours, min_participants, max_participants,
  price_cents, price_type, location_name, location_area,
  cover_image_url, requires_request, is_bookable, status
) values
  ((select id from s), 'montauto-degustazione-light', 'Degustazione Light',
   'Visita alla cantina e alla barricaia con degustazione di 3 vini.',
   'Un primo assaggio della Tenuta Montauto: visita guidata alla cantina e alla barricaia e degustazione di tre nostri vini.',
   'Enogastronomia', '1 ora', 1, 2, 10, 2500, 'pro_capite', 'Capalbio', 'Manciano',
   'https://ipunxusmsdsuzfqnbpum.supabase.co/storage/v1/object/public/experience-covers/cover-light.jpg',
   true, true, 'pubblicata'),
  ((select id from s), 'montauto-degustazione-classica', 'Degustazione Classica',
   'Tour guidato di cantina e barricaia, 4 vini e olio EVO biologico IGP Toscano.',
   'Tour guidato della cantina e della barricaia con illustrazione dei principi di vinificazione e della filosofia di Montauto. Degustazione di quattro vini e del nostro olio extravergine di oliva biologico IGP Toscano.',
   'Enogastronomia', '1 ora e 30', 1.5, 2, 10, 4000, 'pro_capite', 'Capalbio', 'Manciano',
   'https://ipunxusmsdsuzfqnbpum.supabase.co/storage/v1/object/public/experience-covers/cover-classica.jpg',
   true, true, 'pubblicata'),
  ((select id from s), 'montauto-degustazione-montauto', 'Degustazione Montauto',
   'Tour guidato, 4 vini, olio EVO bio e tagliere di salumi e formaggi locali.',
   'Tour guidato della cantina e della barricaia con illustrazione dei principi di vinificazione e della filosofia di Montauto. Degustazione di quattro vini e di olio extravergine biologico IGP Toscano, con tagliere di salumi e formaggi locali accompagnato da bruschette.',
   'Enogastronomia', '1 ora e 30', 1.5, 2, 10, 5000, 'pro_capite', 'Capalbio', 'Manciano',
   'https://ipunxusmsdsuzfqnbpum.supabase.co/storage/v1/object/public/experience-covers/cover-montauto.jpg',
   true, true, 'pubblicata'),
  ((select id from s), 'montauto-country-tasting', 'Country Tasting',
   'Safari tra i vigneti, tour, 4 vini + 1 cru, olio EVO e tagliere.',
   'L''esperienza più completa: safari in fuoristrada tra i vigneti, tour guidato della cantina e della barricaia con illustrazione dei principi di vinificazione e della filosofia di Montauto. Degustazione di quattro vini più un cru o una vecchia annata, olio extravergine biologico IGP Toscano e tagliere di salumi e formaggi locali con bruschette.',
   'Enogastronomia', '2 ore e 30', 2.5, 2, 10, 7500, 'pro_capite', 'Capalbio', 'Manciano',
   'https://ipunxusmsdsuzfqnbpum.supabase.co/storage/v1/object/public/experience-covers/cover-country.jpg',
   true, true, 'pubblicata')
on conflict (slug) do nothing;
