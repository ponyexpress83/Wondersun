# Deploy su Vercel — Wondersun (demo completa con login)

Guida passo-passo per pubblicare Wondersun su Vercel con **demo funzionante**
(home, catalogo, Chi siamo + login cliente/fornitore/admin e pagina `/demo`).

> Il progetto è Next.js 14: Vercel lo rileva da solo, **non serve `vercel.json`**.
> Senza variabili Supabase il sito gira comunque in *modalità mock* (solo pagine
> pubbliche). Per il login servono i passi sotto.

---

## 1. Prerequisiti

- Un account **Vercel** (team/personale) con accesso al repo `ponyexpress83/Wondersun`.
- Un progetto **Supabase** (https://app.supabase.com) — piano free ok.
- (Facoltativo) Credenziali **Google OAuth** se vuoi il login con Google.

---

## 2. Setup Supabase (una tantum)

1. Crea un progetto su Supabase e attendi il provisioning.
2. **SQL Editor** → incolla ed esegui il contenuto di `db/schema.sql`.
3. **Storage** → crea due bucket **pubblici**:
   - `experience-covers`
   - `supplier-logos`
4. **Settings → API**: copia
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ segreta, solo server)

---

## 3. Import del repo su Vercel

1. Vai su https://vercel.com/new → **Import Git Repository** → `ponyexpress83/Wondersun`.
2. **Framework Preset**: Next.js (auto). Build command `next build`, output di default.
3. **Production Branch**: per pubblicare il lavoro in corso imposta
   `claude/wonderful-dirac-nf845z` (oppure mergi prima su `main` e usa `main`).
   - In alternativa lascia `main` come produzione: ogni branch genera comunque un
     **Preview Deploy** con URL dedicato.
4. (Facoltativo) **Region**: imposta `Frankfurt (fra1)` per latenza più bassa in Italia.
5. Aggiungi le **Environment Variables** (sezione 4) → **Deploy**.

---

## 4. Environment Variables (su Vercel → Settings → Environment Variables)

### Obbligatorie per la demo con login
| Nome | Valore |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL progetto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key |
| `NEXT_PUBLIC_SITE_URL` | `https://<tuo-dominio>.vercel.app` |
| `NEXT_PUBLIC_DEMO_MODE` | `true` |

> `NEXT_PUBLIC_SITE_URL` lo conosci solo dopo il primo deploy: imposta il dominio
> Vercel definitivo e fai **Redeploy** una volta. Serve per i link nelle email/notifiche.

### Consigliate / opzionali
| Nome | A cosa serve |
| --- | --- |
| `RESEND_API_KEY` · `RESEND_FROM` | email transazionali reali (altrimenti no-op) |
| `ANTHROPIC_API_KEY` | risposte chatbot "Sole" arricchite (altrimenti matching base) |
| `NEXT_PUBLIC_SUPPORT_WHATSAPP` | numero per escalation chatbot |
| `WONDERSUN_COMMISSION_PCT` · `WONDERSUN_HIGH_VALUE_THRESHOLD` · `WONDERSUN_HIGH_VALUE_FIXED_FEE` | parametri commissione (hanno default) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | mappa (placeholder se assente) |
| `STRIPE_*` / `PAYPAL_*` | pagamenti — **non ancora implementati** (endpoint in "pending") |

---

## 5. Configurazione Auth Supabase (post-deploy)

In **Supabase → Authentication → URL Configuration**:
- **Site URL**: `https://<tuo-dominio>.vercel.app`
- **Redirect URLs**: aggiungi `https://<tuo-dominio>.vercel.app/api/auth/callback`

### (Facoltativo) Login con Google
1. In Supabase → Authentication → Providers → **Google**: incolla Client ID/Secret.
2. In Google Cloud Console → OAuth → Authorized redirect URI:
   `https://<project-ref>.supabase.co/auth/v1/callback`

---

## 6. Account demo e admin

- Con `NEXT_PUBLIC_DEMO_MODE=true` la pagina **`/demo`** mostra 3 account
  (cliente, fornitore approvato, admin). Al primo accesso vengono **creati in automatico**
  via service_role — password unica `WondersunDemo2026!`.
- Per promuovere manualmente un utente ad admin (SQL Editor):
  ```sql
  update public.profiles set role = 'admin' where email = 'tu@example.com';
  ```

---

## 7. Note importanti

- **Pagamenti**: gli endpoint quota/canone rispondono "pending" finché non si
  configura Stripe/PayPal. La demo mostra il flusso fino alla conferma fornitore.
- **Produzione vera**: prima del lancio rimuovere `NEXT_PUBLIC_DEMO_MODE` (o `false`)
  e validare il modello fiscale (vedi `docs/DEVIATIONS.md`).
- Senza variabili Supabase il deploy resta valido ma in *modalità mock*
  (home + catalogo con dati di esempio + Chi siamo).
