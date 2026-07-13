# Lead Intelligence

שכבת איכות לידים מעל WhatsApp (ראשי) + Resend.

## Pipeline

`useLeadSubmit` / `mirrorWhatsAppLeadToEmail` → `POST /api/lead-notify` → `ingestLead`:

1. Enrichment (IP hash, geo headers, device, referrer, session)
2. Duplicate detection (24h Redis)
3. Quality score 0–100
4. Persist lead (`lead:{id}` + index)
5. Admin HTML email (context card + service body + soft offers if score &lt; 60)
6. Optional client auto-reply + pre-call guide (requires customer email)

## Key paths

| Path | Role |
|------|------|
| `/api/lead-notify` | Public ingest |
| `/api/leads/ingest` | Alias |
| `/api/leads/recover` | Abandoned draft (phone required, no admin email spam) |
| `/api/webhooks/resend` | `email.opened` tracking |
| `/api/cron/lead-followups` | Daily 07:00 UTC reminder (Hobby: once/day; Bearer `CRON_SECRET`) |
| `/admin/leads?token=…` | RSC table + kanban (`ADMIN_LEADS_TOKEN`) |

## Env

- `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL`, `RESEND_FROM_EMAIL`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `ADMIN_LEADS_TOKEN`
- `RESEND_WEBHOOK_SECRET` (or `whsec_…` Svix)
- `ADMIN_WHATSAPP_ALERT` (optional flag for high-score routing)
- `CRON_SECRET`

## Pricing form

`/pricing` → multi-step inquiry (`?ask=sectionId#pricing-inquiry`): service/price → qualify → contact. Submits WA + Resend with pricingRef.

## formId examples

`pricing_inquiry`, `book_audience_*`, `pro_wizard_*`, `online_restore_feasibility`, existing wizard formIds.
