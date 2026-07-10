-- ─────────────────────────────────────────────────────────────────────────
-- Wondersun · Dati di esempio per ambiente di sviluppo
-- ATTENZIONE: eseguire SOLO in dev. Crea un fornitore demo + 6 esperienze.
-- Richiede che ci sia già un utente auth.users a cui legare il fornitore.
-- ─────────────────────────────────────────────────────────────────────────

-- Sostituisci con l'UUID dell'utente fornitore creato via signup
\set supplier_user_id '00000000-0000-0000-0000-000000000000'

-- Promuovi a fornitore
update public.profiles set role = 'fornitore' where id = :'supplier_user_id';

-- Crea il record supplier
insert into public.suppliers (profile_id, business_name, vat_number, city, province, description, status)
values (:'supplier_user_id', 'Maremma Experience Srl', '01234567890', 'Porto Santo Stefano', 'GR',
        'Operatore turistico locale specializzato in esperienze sul mare e nell''entroterra maremmano.',
        'approvato')
on conflict (profile_id) do nothing;

-- 6 esperienze di esempio
with s as (select id from public.suppliers where profile_id = :'supplier_user_id' limit 1)
insert into public.experiences (
  supplier_id, slug, title, short_description, description, category, tag, tag_color,
  duration_label, duration_hours, min_participants, max_participants,
  price_cents, price_type, location_name, location_area, latitude, longitude,
  cover_image_url, requires_request, status
) values
  ((select id from s), 'navigazione-tramonto', 'Navigazione al Tramonto',
   'Vivi la magia del tramonto sull''Argentario.',
   'Vivi la magia del tramonto sull''Argentario a bordo di un''imbarcazione tradizionale. Aperitivo con prodotti locali incluso.',
   'Mare & Costa', 'Più Prenotata', '#B71C1C',
   '3 ore', 3, 2, 8, 8500, 'pro_capite', 'Porto Santo Stefano', 'Argentario', 42.4350, 11.1187,
   'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80', true, 'pubblicata'),
  ((select id from s), 'equitazione-maremma', 'Equitazione nella Maremma',
   'Cavalca tra i paesaggi selvaggi.',
   'Cavalca tra i paesaggi selvaggi della Maremma con guide esperte. Macchia mediterranea e panorami mozzafiato.',
   'Natura & Avventura', 'Autentico', '#2B7DD4',
   'Mezza giornata', 4, 1, 6, 6500, 'pro_capite', 'Manciano', 'Manciano', 42.5876, 11.5117,
   'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&q=80', false, 'pubblicata'),
  ((select id from s), 'cena-chef-locale', 'Cena con Chef Locale',
   'Esperienza culinaria esclusiva.',
   'Un''esperienza culinaria esclusiva con uno chef del territorio. Ingredienti a km zero, ricette tradizionali e vista sul mare.',
   'Enogastronomia', 'Esclusivo', '#FFC533',
   '4 ore', 4, 2, 12, 12000, 'pro_capite', 'Orbetello', 'Argentario', 42.4396, 11.2150,
   'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80', true, 'pubblicata'),
  ((select id from s), 'degustazione-vini-doc', 'Degustazione Vini DOC Maremma',
   'Tour nelle cantine storiche.',
   'Tour nelle cantine storiche della Maremma con degustazione guidata di vini DOC e prodotti tipici locali.',
   'Vino & Degustazioni', 'Novità', '#7b2d8b',
   '3 ore', 3, 2, 10, 5500, 'pro_capite', 'Manciano', 'Manciano', 42.5876, 11.5117,
   'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80', false, 'pubblicata'),
  ((select id from s), 'ebike-borghi-etruschi', 'E-Bike tra i Borghi Etruschi',
   'Pedalata in e-bike tra Sorano, Pitigliano e Sovana.',
   'Pedalata in e-bike tra Sorano, Pitigliano e Sovana, i borghi etruschi della Maremma. Guida esperta inclusa.',
   'Sport & Avventura', 'Avventura', '#e65100',
   'Giornata intera', 8, 2, 8, 9500, 'pro_capite', 'Sorano', 'Sorano', 42.6831, 11.7172,
   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80', false, 'pubblicata'),
  ((select id from s), 'necropoli-sorano', 'Necropoli Etrusche di Sorano',
   'Visita guidata alle necropoli con un archeologo.',
   'Visita guidata alle necropoli etrusche di Sorano con un archeologo locale. Storia millenaria tra tufo e cielo.',
   'Cultura & Arte', 'Culturale', '#1565c0',
   '2 ore', 2, 1, 15, 2500, 'pro_capite', 'Sorano', 'Sorano', 42.6831, 11.7172,
   'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&q=80', false, 'pubblicata'),
  -- ── Esperienze di riferimento (fornitori reali · demo Sole) ──
  ((select id from s), 'immersioni-snorkeling-argentario', 'Immersioni & snorkeling all''Argentario',
   'Esplora i fondali di Argentario, Giannutri e Giglio.',
   'Esplora i fondali di Argentario, Giannutri e Giglio a bordo della Galathea con Full Dive. Anche battesimo del mare per i principianti. Uscita giornaliera con skipper e istruttore.',
   'Mare & Costa', 'Più Prenotata', '#B71C1C',
   'Giornata intera', 8, 1, 12, 7500, 'pro_capite', 'Porto Ercole', 'Argentario', 42.3920, 11.2070,
   'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80', true, 'pubblicata'),
  ((select id from s), 'degustazione-tenuta-montauto', 'Degustazione in tenuta',
   'Cantina, barricaia e degustazione a Capalbio.',
   'Visita a cantina e barricaia della Tenuta Montauto a Capalbio, con degustazione di vini Sauvignon e Pinot Nero e olio EVO bio IGP. Con tagliere o safari tra i vigneti.',
   'Vino & Degustazioni', 'Autentico', '#7b2d8b',
   '45 min – 2 ore', 2, 2, 10, 2500, 'pro_capite', 'Capalbio', 'Manciano', 42.4530, 11.4200,
   'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80', false, 'pubblicata'),
  ((select id from s), 'massaggio-benessere-onsite', 'Massaggio benessere on-site',
   'Relax nel tuo alloggio, senza spostarti.',
   'Massaggio rilassante, olistico o Kobido direttamente nel tuo alloggio, villa o appartamento. Un momento di benessere su appuntamento, senza doverti spostare.',
   'Benessere', 'Benessere', '#FFC533',
   '50 – 75 min', 1, 1, 2, 6000, 'pro_capite', 'Maremma · a domicilio', 'Argentario', 42.4396, 11.2150,
   'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1200&q=80', true, 'pubblicata')
on conflict (slug) do nothing;
