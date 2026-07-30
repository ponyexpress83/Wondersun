-- ─────────────────────────────────────────────────────────────────────────
-- Wondersun · Richiesta di fattura da parte del cliente
--
-- Al momento del pagamento il cliente può chiedere la fattura e lasciare i dati
-- di intestazione. I dati restano nella prenotazione e sono consultabili
-- dall'amministrazione, che emette la fattura dal proprio gestionale.
-- Chi non la richiede riceve la normale ricevuta di pagamento via email.
--
-- Idempotente.
-- ─────────────────────────────────────────────────────────────────────────

alter table public.bookings
  add column if not exists invoice_requested boolean not null default false,
  add column if not exists invoice_data jsonb;

comment on column public.bookings.invoice_requested is
  'true se il cliente ha richiesto la fattura al momento del pagamento.';
comment on column public.bookings.invoice_data is
  'Dati di fatturazione forniti dal cliente: intestazione, indirizzo, CF/P.IVA, codice destinatario o PEC.';

create index if not exists bookings_invoice_requested_idx
  on public.bookings (invoice_requested)
  where invoice_requested = true;
