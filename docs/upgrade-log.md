# UI/UX Upgrade -- Phase Log

## Template (per phase)

```
Phase: N
Date:
Files changed:
Baseline comparison: LCP / CLS / JS
QA matrix: pass/fail
Exceptions added:
Notes:
```

---

## Phase 0 -- Foundation

**Date:** 2026-06-10  
**Status:** complete

**Files:**
- `app/globals.css` -- fluid type, elevation, hover-lift, touch-target, group-hover-scale
- `lib/utils.ts` -- tailwind-merge
- `components/ui/Container.tsx`, `Section.tsx`, `Card.tsx`
- `components/ui/Button.tsx` -- ghost, as="a", min-h-11, active scale
- `docs/ui-primitives.md`, `docs/ui-exceptions.md`

## Phase 1–3 -- Layout, Heroes, Performance

**Date:** 2026-06-10  
**Status:** complete (core paths)

**Highlights:**
- Header/Footer/Breadcrumbs → Container + theme tokens + 44px targets
- HomeHero, ServicePageLayout → fluid type, blur, Button CTAs
- ServiceCard, ServiceHubLinks, StudioPricingGrid, Testimonials → hover-lift
- FadeIn → opacity-only (CLS)
- Blog layout → no duplicate font fetch; Noto preload in root
- RelatedArticles → blur placeholder
- `lib/service-portfolio-images.ts` → PNG/JPEG dimension probe
- `components/marketing/lazy.tsx` → HomeSocialProofSection dynamic import

## Phase 6 continuation -- 2026-06-10

**Status:** in progress (high-impact paths)

- `HomePageSections` → Section/Container/Button, hover-lift on value props
- `PageBottomCta` → Button + Section/Container
- `BookPageSections` → all wizards/calculators via `lazy.tsx` (smaller /book bundle)
- `BookAudienceCard` → 44px touch targets on chips + CTAs

## Phase 6b -- blog, book, forms, FAQ

- `FAQAccordion` → Section/Container, min-h-11 triggers, reduced-motion
- `app/book/page.tsx` → fluid hero (`text-hero`)
- `ArticleFeed` → fluid headings, group-hover-scale on thumbs
- `CallbackLeadForm` → min-h-11 fields + Button submit
- `BookingSelectableCard` → focus/active states
- `BookStudioInfoSection`, `TrustStatsBar` → Container/Section

## Phase 6c -- SEO cards, about, contact

- `GiftIdeaCard` → Button CTAs, CLS fix (aspect-video), tokens
- `PremiumBundleCallout` → Button + fluid typography
- `app/about/page.tsx` → full Section/Container/Button migration
- `ContactPageContent` + `app/contact/page.tsx` → hero, touch targets, map section

## Phase 6d -- marketing journey, legal, start

**Date:** 2026-06-10  
**Status:** complete

- `ClientJourneySteps` → Section/Container, fluid headings, 44px link targets
- `WhatsappLeadRouter` → Section/Container, hover-lift, theme tokens (luxury variant)
- `StudioClientsStrip` → Section/Container, group-hover-scale, Button CTA
- `LegalPageLayout` → Container, text-hero, min-h-11 nav chips
- `LegalTrustBlock`, `LegalRelatedLinks` → touch targets + focus rings
- `app/start/page.tsx` → full primitive migration, hover-lift on step cards
- `app/pricing/page.tsx` → Section/Container, fluid type, 44px link targets

## Phase 6e -- hub & utility pages

**Date:** 2026-06-10  
**Status:** complete

- `app/(blog)/blog/page.tsx` → hero + pagination a11y
- `components/seo/PortfolioPageContent.tsx` → full primitive migration
- `components/seo/UsedGearPageContent.tsx` → shop page content upgrade
- `app/clinic/page.tsx` → theme tokens, Button, Container (removed inline hex)
- `app/thank-you/page.tsx` → Button + Container
- `app/about/faq/page.tsx` → Section/Container, text-hero
- `app/(services)/studio/pricing/page.tsx` → Container, Button
- `components/marketing/HubDualCta.tsx` → Button (all hub pages)
- `components/seo/OnlinePageContent.tsx` → full hub migration
- `components/business/social-media/SocialMediaPageContent.tsx` → Container + touch targets

## Phase 6f -- service hubs & category pages

**Date:** 2026-06-10  
**Status:** complete

- `PodcastHubPageContent` → Container, text-section-title, hover-lift on track cards
- `BlessingsHubPageContent` → Container, Button, hover-lift, 44px chips
- `VoiceoverHubPageContent` → Container
- `VoucherPageContent` → Container, hover-lift tiers, fluid headings
- `StutteringPageContent` → Container, Button CTAs, hover-lift cards
- `OnlineCategoryPageContent` → full Section/Container migration
- `NotFoundContent` → Section/Container/Button, text-hero, hover-lift cubes

## Phase 7 -- shadcn/ui hybrid (preset b27GcrRo)

**Date:** 2026-06-10  
**Status:** foundation complete

- `npx shadcn@latest init --preset b27GcrRo --rtl` → `components.json`, deps, `tw-animate-css`
- `Button.tsx` restored (site primitive); shadcn variant → `shadcn-button.tsx`
- `:root` shadcn tokens mapped to `brand-red` / Yakir palette
- Added: `accordion.tsx`, `dialog.tsx`, `sheet.tsx`
- Docs: `docs/shadcn-integration.md`
