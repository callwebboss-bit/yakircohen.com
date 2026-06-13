# Event Index — Market Intelligence

## Overview

- **Closer (local):** tab "דופק שוק" — aggregates leads, arbitrage alerts, publish JSON
- **Site:** `/pro/event-index` — public teaser + token-gated full index
- **Pipeline:** Closer → `event-index-input.json` → `npm run export:event-index` → deploy

## Closer workflow

1. Open `local-tools/yakir-closer.html`
2. Save leads with enriched `market` / `fulfillment` fields
3. Mark unfulfilled leads (status "ללא מענה") with reason for arbitrage signals
4. Tab **דופק שוק** — review KPIs and alerts
5. **פרסם דופק שוק** — downloads `event-index-input.json`
6. Save to `local-tools/exports/event-index-input.json`
7. From `yakircohen-site`: `npm run export:event-index`
8. Commit `lib/data/event-index.generated.ts` + deploy

## Inventory sync

1. In Closer, book equipment on event dates (Dry Hire panel)
2. **ייצא מלאי ל-JSON** → save as `local-tools/equipment-inventory-state.json`
3. `npm run export:closer` — syncs bookings to `equipment-inventory-bookings.json`

## Environment variables (Vercel)

| Variable | Purpose |
|----------|---------|
| `CLOSER_ANALYTICS_TOKEN` | Bearer for `GET /api/analytics/realtime` (Closer insights tab) |
| `GA4_PROPERTY_ID` | GA4 property (default `397966715`) |
| `GA4_SERVICE_ACCOUNT_JSON` | Service account JSON with Analytics Readonly |
| `EVENT_INDEX_TOKEN` | Bearer for `GET /api/event-index/full` |
| `MARKET_ALERT_SUBSCRIBERS` | Comma emails for weekly arbitrage digest |
| `CRON_SECRET` | Bearer for `POST /api/market-alerts` |

## GA4 service account setup

1. Google Cloud → create service account
2. Enable **Google Analytics Data API**
3. GA4 Admin → Property access → add service account as Viewer
4. Paste full JSON into `GA4_SERVICE_ACCOUNT_JSON` (single line in Vercel)

## Cron — market alerts

```bash
curl -X POST https://www.yakircohen.com/api/market-alerts \
  -H "Authorization: Bearer $CRON_SECRET"
```

Schedule weekly (e.g. Friday 08:00) in Vercel Cron after publishing new index data.

## Privacy

- Published index contains **aggregates only** (no names/phones)
- Minimum 5 closed deals before average price is shown
- Prices rounded to ₪100
