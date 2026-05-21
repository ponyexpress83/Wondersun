# Wondersun · Local Escape · Maremma Toscana

Piattaforma esperienziale turistica per la Costa d'Argento e la Maremma Toscana, sviluppata per la Committente Ginevra Emanuele (Porto Ercole, GR).

> Sprint 1+2 completati. Roadmap nei file [`docs/SPRINTS.md`](docs/SPRINTS.md) e [`docs/DEVIATIONS.md`](docs/DEVIATIONS.md).

## Stack

| Layer | Tecnologia |
| --- | --- |
| Framework | Next.js 14 (App Router) · TypeScript |
| Styling | Tailwind CSS · Cormorant Garamond + Nunito Sans |
| Database | Supabase (PostgreSQL) con Row Level Security |
| Auth | Supabase Auth (email/password, ruoli cliente · fornitore · admin) |
| Storage | Supabase Storage (immagini esperienze) |
| Pagamenti | Stripe Standard *(integrazione Sprint 4)* |
| Email | Resend *(Sprint 3)* |
| Mappe | Mapbox *(Sprint 2 — opzionale)* |
| AI Chatbot | Anthropic Claude *(Sprint 5)* |
| Hosting | Netlify (frontend) · Railway (eventuali edge functions) |

## Avvio rapido

```bash
# 1) Installa dipendenze
pnpm install   # oppure npm install

# 2) Copia il template env
cp .env.example .env.local
# … e compila le chiavi Supabase / Stripe / Mapbox

# 3) Avvia in dev
pnpm dev
# → http://localhost:3000
```

> **Modalità mock**: se non hai ancora compilato `.env.local` il sito funziona comunque
> usando dati di esempio (vedi `lib/mock/experiences.ts`). Le aree riservate (dashboard,
> fornitore, admin) richiedono Supabase configurato.

## Setup database Supabase

1. Crea un progetto su https://app.supabase.com.
2. Vai su **SQL Editor** ed esegui `db/schema.sql`.
3. (Facoltativo) esegui `db/seed.sql` dopo aver creato manualmente un utente fornitore — sostituisci l'UUID nello script.
4. Crea due bucket Storage **pubblici**:
   - `experience-covers`
   - `supplier-logos`
5. Copia `Project URL`, `anon key` e `service_role key` in `.env.local`.

### Promuovere un utente ad admin

```sql
update public.profiles set role = 'admin' where email = 'tu@example.com';
```

## Struttura del progetto

```
app/
  page.tsx                  homepage pubblica
  esperienze/               catalogo + dettaglio esperienza
  login/ · registrati/      auth (cliente)
  dashboard/                area cliente (prenotazioni · preferiti · pacchetti)
  fornitore/                area fornitore (onboarding · CRUD · prenotazioni · abbonamento)
  admin/                    pannello amministratore
  api/                      route handlers (auth, suppliers, experiences, bookings, upload)
  privacy/ · termini/ · cookie/
components/                 UI riutilizzabile (Navbar, Footer, sezioni, dashboard layout)
lib/
  supabase/                 client browser/server + middleware auth
  data/                     data layer con fallback ai mock
  mock/                     dati di esempio
  types.ts                  tipi domain + calcolo commissione
db/
  schema.sql                schema + RLS + trigger
  seed.sql                  dati di esempio
```

## Modello operativo

> ⚠️ **Importante.** Il progetto implementa il modello **marketplace** scelto dalla
> Committente il 14/05/2026 (commissioni 25%, canone fornitori €29/mese con 3 mesi
> di prova, pagamento tramite piattaforma). Questo modello **diverge** dall'Art. 2-bis
> del contratto firmato, che prevede un servizio digitale di prenotazione senza
> commissioni dai fornitori. Vedi `docs/DEVIATIONS.md` per i dettagli e il
> percorso suggerito per formalizzare via Art. 8 (Change Management).

## Comandi disponibili

```bash
pnpm dev        # server dev
pnpm build      # build di produzione
pnpm start      # avvia build in prod
pnpm typecheck  # tsc --noEmit
pnpm lint       # eslint (Next.js preset)
```

## Stato sprint

- [x] **Sprint 1** — setup, schema DB, auth a 3 ruoli, design system
- [x] **Sprint 2** — catalogo + filtri + dettaglio, dashboard fornitore, CRUD esperienze, upload immagini
- [ ] **Sprint 3** — carrello/pacchetti, dashboard cliente avanzata, email transazionali
- [ ] **Sprint 4** — Stripe Standard + abbonamento fornitore, webhook, ricevute PDF
- [ ] **Sprint 5** — pannello admin completo, chatbot AI "Sole", cookie banner GDPR
- [ ] **Sprint 6** — testing, SEO, lancio, formazione, switch live
