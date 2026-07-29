-- ─────────────────────────────────────────────────────────────────────────
-- Wondersun · Scadenza di pagamento della quota di servizio digitale
--
-- Dopo la conferma del fornitore la prenotazione resta "in attesa di pagamento"
-- e diventa definitiva solo con il pagamento. Se la quota non viene versata
-- entro il termine, la prenotazione è annullata automaticamente e la data torna
-- disponibile.
--
-- Idempotente: eseguibile più volte senza errori.
-- ─────────────────────────────────────────────────────────────────────────

alter table public.bookings
  add column if not exists payment_deadline timestamptz;

comment on column public.bookings.payment_deadline is
  'Scadenza entro cui il cliente deve pagare la quota Wondersun dopo la conferma del fornitore. Superata, la prenotazione viene annullata automaticamente.';

-- Indice per il recupero rapido delle prenotazioni scadute da annullare
create index if not exists bookings_payment_deadline_idx
  on public.bookings (payment_deadline)
  where payment_deadline is not null;

-- Minuti concessi per il pagamento (configurabile dall'admin, default 60)
insert into public.platform_settings (key, value)
values ('payment_window_minutes', '60')
on conflict (key) do nothing;
