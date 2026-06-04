# Separazione documentale dati prenotazioni vs servizio digitale

> Riferimento contrattuale: **Allegato A § 5.1** dell'Accordo Completo Wondersun.
> Punto critico ai fini fiscali — sottoporre al commercialista della Committente
> prima del go-live in produzione.

## Modello fiscale di riferimento (Art. 2-bis del contratto)

Il contratto disciplina **due rapporti distinti** che vivono nella stessa
piattaforma ma fiscalmente non si toccano:

1. **Rapporto Cliente ↔ Committente · servizio digitale**
   - Il cliente paga in piattaforma SOLO la quota Wondersun ("paghi solo quello che vivi")
   - È un servizio di prenotazione digitale personalizzata
   - Genera ricevuta Stripe con causale "Servizio di prenotazione digitale personalizzata"
   - Inquadrato come consulenza/intermediazione digitale (codice ATECO 743000)

2. **Rapporto Cliente ↔ Fornitore · servizio turistico**
   - Il cliente paga al fornitore DIRETTAMENTE sul posto la quota rimanente
   - NON transita per la piattaforma
   - È una compravendita di servizio turistico tra le due parti
   - Eventuale ricevuta/fattura è emessa dal Fornitore al Cliente

Questa separazione è il **cuore della scelta fiscale** del Committente:
evita la qualificazione come marketplace o agenzia di viaggi (con i relativi
obblighi: ROC, IVA art. 74-ter, ecc.).

## Come la piattaforma rispetta la separazione

### Schema dati

La tabella `bookings` contiene snapshot di entrambi i rapporti, ma le colonne
sono semanticamente separate:

| Colonna | Appartiene a | Note |
|---|---|---|
| `client_id`, `supplier_id`, `experience_id`, `requested_date`, `participants`, `notes`, `status`, `supplier_response`, `responded_at` | Rapporto turistico | Metadati della prenotazione |
| `unit_price_cents`, `total_cents`, `supplier_payout_cents`, `high_value_fee_cents` | Rapporto turistico | Importi che il cliente versa al fornitore in loco |
| `commission_pct`, `commission_cents` | Rapporto servizio digitale | Quota Wondersun (il **solo** importo che transita su Stripe del Committente) |
| `stripe_payment_intent_id`, `stripe_checkout_session_id`, `paid_at` | Rapporto servizio digitale | Tracciamento del solo pagamento Wondersun |

In altre parole: l'unica colonna che genera un flusso di cassa **per il
Committente** è `commission_cents`. Tutto il resto è informativo per il
coordinamento della prenotazione tra cliente e fornitore.

### Stripe — configurazione

- Modalità **Standard** (NON Connect): l'account Stripe è del solo Committente.
- L'importo addebitato al cliente è SEMPRE `commission_cents`, mai `total_cents`.
- La causale fissa di tutti i Payment Intent è
  `"Servizio di prenotazione digitale personalizzata"` (configurabile via
  template ricevuta, da confermare col commercialista).

### Export commercialista (`/api/admin/export`)

Il CSV include UNA SOLA voce di "Quota Wondersun incassata" come ricavo del
Committente. La colonna "Quota fornitore" è presente per coerenza informativa
ma è **espressamente segnalata come NON ricavo del Committente** (è solo
l'importo che il cliente avrebbe versato al fornitore).

### Pannello admin · ricevute (`/admin/ricevute`)

Mostra solo le ricevute generate dal flusso Stripe del servizio digitale. Non
contiene mai dati su pagamenti effettuati al fornitore (che restano fuori
piattaforma).

## Cosa NON deve mai accadere

1. ❌ Il flusso `pay` non deve mai addebitare al cliente un importo diverso da
   `commission_cents`.
2. ❌ Non vanno mai create ricevute/fatture per importi diversi dalla quota
   Wondersun sul conto Stripe del Committente.
3. ❌ Non va attivato Stripe Connect senza Ordine di Modifica Art. 8: cambierebbe
   sostanzialmente il modello fiscale (vedi DEVIATIONS.md).
4. ❌ La caparra anti-no-show (se introdotta — vedi proposta Opzione A in
   Trello) NON deve mai transitare per la piattaforma. Va gestita con link di
   pagamento del fornitore (PayPal.me / Satispay / IBAN suo).

## Validazione

Si raccomanda di sottoporre questa nota al commercialista prima del go-live
in produzione, insieme allo `schema.sql` e a un esempio di CSV export.
