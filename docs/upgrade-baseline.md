# UI/UX Upgrade — Baseline Metrics

**Date:** 2026-06-10  
**Branch:** pre-upgrade snapshot  
**Note:** Lab metrics to be filled after first `next build` + Lighthouse run. Build must pass before Phase 0 merge.

## Measurement tools

- Lighthouse (Chrome DevTools, mobile + desktop)
- Web Vitals: CLS, LCP, INP
- `next build` — first-load JS per route
- Manual QA at 375px / 768px / 1440px

## Routes (required)

| Route | Type | LCP | CLS | INP | TBT | Perf | A11y | First-load JS | Notes |
|-------|------|-----|-----|-----|-----|------|------|---------------|-------|
| `/` | Home | TBD | TBD | TBD | TBD | TBD | TBD | TBD | Hero + social proof |
| `/book` | Funnel | TBD | TBD | TBD | TBD | TBD | TBD | TBD | Wizard entry |
| `/studio` | Service hub | TBD | TBD | TBD | TBD | TBD | TBD | TBD | ServicePageLayout |
| `/studio/recording-studio` | Service leaf | TBD | TBD | TBD | TBD | TBD | TBD | TBD | Gallery + pricing |
| `/podcast` | Service hub | TBD | TBD | TBD | TBD | TBD | TBD | TBD | Cross-links |
| `/blog` | Content | TBD | TBD | TBD | TBD | TBD | TBD | TBD | Article grid |
| `/contact` | Form | TBD | TBD | TBD | TBD | TBD | TBD | TBD | Map embed |

## Performance budgets (targets post-upgrade)

| Page | LCP | CLS | INP | TBT | First-load JS | A11y |
|------|-----|-----|-----|-----|---------------|------|
| `/` | ≤ 2.5s | ≤ 0.01 | ≤ 200ms | ≤ 300ms | ≤ 180 kB | ≥ 95 |
| `/book` | ≤ 2.8s | ≤ 0.01 | ≤ 200ms | ≤ 400ms | ≤ 220 kB | ≥ 95 |
| `/studio` | ≤ 2.5s | ≤ 0.01 | ≤ 200ms | ≤ 350ms | ≤ 200 kB | ≥ 95 |
| Service leaf | ≤ 2.8s | ≤ 0.01 | ≤ 200ms | ≤ 400ms | ≤ 210 kB | ≥ 95 |
| `/blog` | ≤ 2.5s | ≤ 0.01 | ≤ 200ms | ≤ 250ms | ≤ 160 kB | ≥ 95 |

## Screenshots

Store in `docs/baseline-screenshots/` at 375 / 768 / 1440 for `/`, `/studio`, `/book`.
