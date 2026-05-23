-- ─────────────────────────────────────────────────────────────────────────
-- Wondersun · Database Schema (Supabase / PostgreSQL)
-- Sprint 1+2 · setup tabelle core + Row Level Security
--
-- Modello operativo: marketplace con commissioni (scelta del Committente,
-- 14/05/2026). Diverge dall'Art. 2-bis del contratto, formalizzare via Art. 8.
-- ─────────────────────────────────────────────────────────────────────────

-- Estensioni
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";

-- ─────────────────────────────────────────────────────────────────────────
-- ENUM
-- ─────────────────────────────────────────────────────────────────────────
do $$ begin
  create type user_role as enum ('cliente', 'fornitore', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type supplier_status as enum ('in_attesa', 'approvato', 'sospeso', 'rifiutato');
exception when duplicate_object then null; end $$;

do $$ begin
  create type subscription_status as enum ('trial', 'attivo', 'sospeso', 'scaduto', 'cancellato');
exception when duplicate_object then null; end $$;

do $$ begin
  create type experience_status as enum ('bozza', 'pubblicata', 'sospesa');
exception when duplicate_object then null; end $$;

do $$ begin
  create type booking_status as enum (
    'richiesta',        -- cliente ha inviato la richiesta
    'confermata',       -- fornitore ha confermato, pagamento sbloccato
    'rifiutata',        -- fornitore ha rifiutato
    'data_alternativa', -- fornitore ha proposto altra data
    'pagata',           -- pagamento Stripe completato
    'completata',       -- esperienza svolta
    'annullata',        -- annullata da cliente/fornitore
    'no_show'           -- cliente non si è presentato
  );
exception when duplicate_object then null; end $$;

-- ─────────────────────────────────────────────────────────────────────────
-- PROFILI (estende auth.users di Supabase)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  role user_role not null default 'cliente',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);

-- ─────────────────────────────────────────────────────────────────────────
-- FORNITORI (operatori turistici convenzionati)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.suppliers (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,

  -- Profilo aziendale
  business_name text not null,
  vat_number text,                       -- P. IVA
  tax_code text,                         -- C.F.
  registered_office text,
  city text,
  province text,
  postal_code text,
  description text,
  logo_url text,
  website text,
  contact_email text,
  contact_phone text,

  -- Stato workflow admin
  status supplier_status not null default 'in_attesa',
  status_notes text,                     -- note motivazione admin
  approved_at timestamptz,
  approved_by uuid references public.profiles(id),

  -- Abbonamento (€29/mese, 3 mesi trial)
  subscription_status subscription_status not null default 'trial',
  trial_ends_at timestamptz not null default (now() + interval '90 days'),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists suppliers_status_idx on public.suppliers(status);
create index if not exists suppliers_subscription_idx on public.suppliers(subscription_status);

-- ─────────────────────────────────────────────────────────────────────────
-- ESPERIENZE
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.experiences (
  id uuid primary key default uuid_generate_v4(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,

  slug text unique not null,
  title text not null,
  short_description text,
  description text,
  category text not null,                -- "Mare & Costa", "Enogastronomia", ...
  tag text,                              -- "Più Prenotata", "Esclusivo", "Novità"
  tag_color text default '#2B7DD4',

  -- Durata e capacità
  duration_label text,                   -- "3 ore", "Mezza giornata"
  duration_hours numeric,                -- per filtri
  min_participants integer not null default 1,
  max_participants integer not null default 10,

  -- Prezzo (in EUR centesimi per evitare float)
  price_cents integer not null,          -- prezzo per partecipante o forfait
  price_type text not null default 'pro_capite', -- 'pro_capite' | 'gruppo'

  -- Geolocalizzazione
  location_name text,                    -- "Porto Santo Stefano"
  location_area text,                    -- "Argentario" | "Manciano" | "Sorano" | "Arcille"
  latitude numeric,
  longitude numeric,

  -- Media
  cover_image_url text,
  gallery_urls text[] default '{}',

  -- Prenotazione: true = esperienza premium "a richiesta" (il fornitore conferma
  -- o propone una data alternativa); false = prenotazione diretta.
  requires_request boolean not null default false,

  -- Stato + metriche
  status experience_status not null default 'bozza',
  rating numeric default 0,
  reviews_count integer default 0,
  bookings_count integer default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists experiences_supplier_idx on public.experiences(supplier_id);
create index if not exists experiences_status_idx on public.experiences(status);
create index if not exists experiences_category_idx on public.experiences(category);
create index if not exists experiences_area_idx on public.experiences(location_area);
create index if not exists experiences_search_idx on public.experiences
  using gin (to_tsvector('italian', coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(location_name,'')));

-- ─────────────────────────────────────────────────────────────────────────
-- DISPONIBILITÀ (calendario fornitore)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.availability_slots (
  id uuid primary key default uuid_generate_v4(),
  experience_id uuid not null references public.experiences(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz,
  capacity integer not null,
  booked_count integer not null default 0,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists availability_experience_idx on public.availability_slots(experience_id, starts_at);

-- ─────────────────────────────────────────────────────────────────────────
-- PRENOTAZIONI (richieste → conferma → pagamento)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.bookings (
  id uuid primary key default uuid_generate_v4(),
  booking_code text unique not null,                -- "WS-2026-00001"
  client_id uuid not null references public.profiles(id) on delete restrict,
  experience_id uuid not null references public.experiences(id) on delete restrict,
  supplier_id uuid not null references public.suppliers(id) on delete restrict,

  -- Richiesta
  requested_date timestamptz not null,
  alternative_date timestamptz,                     -- proposta dal fornitore
  participants integer not null,
  notes text,                                       -- richieste speciali del cliente

  -- Stato workflow
  status booking_status not null default 'richiesta',
  supplier_response text,                           -- messaggio fornitore (conferma/rifiuto/alternativa)
  responded_at timestamptz,

  -- Economics (snapshot al momento della prenotazione)
  unit_price_cents integer not null,
  total_cents integer not null,                     -- partecipanti × prezzo unitario
  commission_pct numeric not null,                  -- es. 25
  commission_cents integer not null,                -- quota Wondersun
  supplier_payout_cents integer not null,           -- quota fornitore (totale - commissione)
  high_value_fee_cents integer not null default 0,  -- fee fissa se total > soglia

  -- Pagamento Stripe (Sprint 4)
  stripe_payment_intent_id text,
  stripe_checkout_session_id text,
  paid_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_client_idx on public.bookings(client_id);
create index if not exists bookings_supplier_idx on public.bookings(supplier_id);
create index if not exists bookings_experience_idx on public.bookings(experience_id);
create index if not exists bookings_status_idx on public.bookings(status);
create index if not exists bookings_date_idx on public.bookings(requested_date);

-- ─────────────────────────────────────────────────────────────────────────
-- PACCHETTI (carrello multi-esperienza · Sprint 3 ma struttura pronta)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.packages (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  notes text,
  status text not null default 'bozza',             -- 'bozza' | 'inviato' | 'completato'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.package_items (
  id uuid primary key default uuid_generate_v4(),
  package_id uuid not null references public.packages(id) on delete cascade,
  experience_id uuid not null references public.experiences(id) on delete restrict,
  requested_date timestamptz,
  participants integer not null default 1,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- PREFERITI
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.favorites (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  experience_id uuid not null references public.experiences(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (client_id, experience_id)
);

-- ─────────────────────────────────────────────────────────────────────────
-- AUDIT LOG (operazioni sensibili)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.audit_log (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text,
  entity_id text,
  metadata jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

create index if not exists audit_actor_idx on public.audit_log(actor_id);
create index if not exists audit_created_idx on public.audit_log(created_at desc);

-- ─────────────────────────────────────────────────────────────────────────
-- TRIGGER: updated_at automatico
-- ─────────────────────────────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists suppliers_touch on public.suppliers;
create trigger suppliers_touch before update on public.suppliers
  for each row execute function public.touch_updated_at();

drop trigger if exists experiences_touch on public.experiences;
create trigger experiences_touch before update on public.experiences
  for each row execute function public.touch_updated_at();

drop trigger if exists bookings_touch on public.bookings;
create trigger bookings_touch before update on public.bookings
  for each row execute function public.touch_updated_at();

drop trigger if exists packages_touch on public.packages;
create trigger packages_touch before update on public.packages
  for each row execute function public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- TRIGGER: crea profilo all'auth.users insert
-- ─────────────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'cliente')
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────
-- HELPER: ruolo dell'utente corrente
-- ─────────────────────────────────────────────────────────────────────────
create or replace function public.current_role()
returns user_role language sql stable as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean language sql stable as $$
  select coalesce(public.current_role() = 'admin', false);
$$;

-- ─────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.suppliers enable row level security;
alter table public.experiences enable row level security;
alter table public.availability_slots enable row level security;
alter table public.bookings enable row level security;
alter table public.packages enable row level security;
alter table public.package_items enable row level security;
alter table public.favorites enable row level security;
alter table public.audit_log enable row level security;

-- PROFILES
drop policy if exists "profiles_read_own" on public.profiles;
create policy "profiles_read_own" on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);

-- SUPPLIERS
drop policy if exists "suppliers_read_public" on public.suppliers;
create policy "suppliers_read_public" on public.suppliers for select
  using (status = 'approvato' or profile_id = auth.uid() or public.is_admin());

drop policy if exists "suppliers_insert_own" on public.suppliers;
create policy "suppliers_insert_own" on public.suppliers for insert
  with check (profile_id = auth.uid());

drop policy if exists "suppliers_update_own" on public.suppliers;
create policy "suppliers_update_own" on public.suppliers for update
  using (profile_id = auth.uid() or public.is_admin())
  with check (profile_id = auth.uid() or public.is_admin());

-- EXPERIENCES
drop policy if exists "experiences_read_public" on public.experiences;
create policy "experiences_read_public" on public.experiences for select
  using (
    status = 'pubblicata'
    or exists (select 1 from public.suppliers s where s.id = supplier_id and s.profile_id = auth.uid())
    or public.is_admin()
  );

drop policy if exists "experiences_write_supplier" on public.experiences;
create policy "experiences_write_supplier" on public.experiences for all
  using (
    exists (select 1 from public.suppliers s where s.id = supplier_id and s.profile_id = auth.uid())
    or public.is_admin()
  )
  with check (
    exists (select 1 from public.suppliers s where s.id = supplier_id and s.profile_id = auth.uid())
    or public.is_admin()
  );

-- BOOKINGS — visibili a cliente, fornitore coinvolto, admin
drop policy if exists "bookings_read_parties" on public.bookings;
create policy "bookings_read_parties" on public.bookings for select
  using (
    client_id = auth.uid()
    or exists (select 1 from public.suppliers s where s.id = supplier_id and s.profile_id = auth.uid())
    or public.is_admin()
  );

drop policy if exists "bookings_insert_client" on public.bookings;
create policy "bookings_insert_client" on public.bookings for insert
  with check (client_id = auth.uid());

drop policy if exists "bookings_update_parties" on public.bookings;
create policy "bookings_update_parties" on public.bookings for update
  using (
    client_id = auth.uid()
    or exists (select 1 from public.suppliers s where s.id = supplier_id and s.profile_id = auth.uid())
    or public.is_admin()
  );

-- FAVORITES + PACKAGES — solo proprietario
drop policy if exists "favorites_own" on public.favorites;
create policy "favorites_own" on public.favorites for all
  using (client_id = auth.uid()) with check (client_id = auth.uid());

drop policy if exists "packages_own" on public.packages;
create policy "packages_own" on public.packages for all
  using (client_id = auth.uid() or public.is_admin())
  with check (client_id = auth.uid());

drop policy if exists "package_items_own" on public.package_items;
create policy "package_items_own" on public.package_items for all
  using (exists (select 1 from public.packages p where p.id = package_id and (p.client_id = auth.uid() or public.is_admin())))
  with check (exists (select 1 from public.packages p where p.id = package_id and p.client_id = auth.uid()));

-- AVAILABILITY — lettura pubblica, scrittura fornitore
drop policy if exists "availability_read_public" on public.availability_slots;
create policy "availability_read_public" on public.availability_slots for select using (true);

drop policy if exists "availability_write_supplier" on public.availability_slots;
create policy "availability_write_supplier" on public.availability_slots for all
  using (exists (
    select 1 from public.experiences e
    join public.suppliers s on s.id = e.supplier_id
    where e.id = experience_id and (s.profile_id = auth.uid() or public.is_admin())
  ))
  with check (exists (
    select 1 from public.experiences e
    join public.suppliers s on s.id = e.supplier_id
    where e.id = experience_id and (s.profile_id = auth.uid() or public.is_admin())
  ));

-- AUDIT — solo admin in lettura, insert da service role
drop policy if exists "audit_admin_read" on public.audit_log;
create policy "audit_admin_read" on public.audit_log for select using (public.is_admin());
