# Core Web Vitals — implementation report

**Date:** 2026-08-22  
**Build:** `npm run build` — OK (350 static routes)  
**SEO gate:** `npm run verify:seo` — OK  
**Headings:** `audit-headings` — OK (215 pages)  
**Schema:** `audit:schema` — OK (no FAQ gaps)

## Changes shipped

| Area | Change |
|------|--------|
| **LCP / fonts** | Heebo + Noto Serif → `subsets: ["hebrew"]` only; preload stays on Heebo |
| **LCP / images** | Single `priority` + `fetchPriority="high"` per template (hero only); logo/gallery/shop/mid-page lazy |
| **Preconnect** | Removed all from root layout (including GTM) |
| **INP** | Elfsight gated by IO + `requestIdleCallback`; header time/WA badges + TimeGreeting lazy (`ssr: false`) |
| **CLS** | `min-height` on home + service hero containers (mobile) |
| **Payload** | Replaced `lucide-react` in footer sitemap + accordion (global footer path) with local SVG icons |
| **A11y** | Darker muted/red/gold tokens; Cypress `color-contrast` enabled; clinic nested `<main>` fixed; CouponPopup focus trap + restore on dismiss |
| **Architecture** | `deviceSizes` trimmed; Speculation Rules prefetch for hub routes |

## LCP targets (locked)

See [lcp-templates.md](./lcp-templates.md).

## Post-deploy measurement (required)

Run Lighthouse **mobile** on:

- `/`, `/studio`, `/book`, `/shop`, `/podcast`, `/photography`, `/contact`

Targets: LCP &lt; 2.5s, CLS &lt; 0.1, INP &lt; 200ms.

## Accepted blockers (business / third-party)

- **Elfsight** (~450KB) on desktop when social-proof section enters viewport — kept for leads; deferred via IO + idle
- **GA4** + Vercel Analytics + Speed Insights on every page
- **Heebo Hebrew subset** still on critical path (required for RTL H1)
- **YouTube / Koalendar** — load only after user interaction
- **CSP** remains Report-Only (enforcement would break widgets)

Do not claim 100/100 Lighthouse until mobile PSI confirms after production deploy.

## Bundle analyzer (webpack)

Run: `ANALYZE=true npx next build --webpack` (Next 16 Turbopack default skips `@next/bundle-analyzer`).

Reports: `.next/analyze/client.html`, `nodejs.html`.

**Layout chunk (`app/layout-*.js`):** no `lucide-react` after footer/accordion SVG swap. Remaining lucide imports are route-scoped (booking wizards, shop sections, dialog/sheet when opened).

**Note:** Update `package.json` `analyze` script to pass `--webpack` if you want `npm run analyze` to emit reports on Next 16.
