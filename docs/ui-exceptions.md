# UI Exceptions -- Card / Button Migration

Components exempt from full `Card`/`Button` primitive migration. Must still use design tokens + touch/focus states.

| Component | Path | Reason | Tokens | Review |
|-----------|------|--------|--------|--------|
| BookingSelectableCard | `components/booking/BookingSelectableCard.tsx` | radio-selectable pattern | yes | 2026-06 |
| ServiceCard | `components/marketing/ServiceCard.tsx` | stretched-link overlay + nested CTA | yes | 2026-06 |
| PremiumBundleCallout | `components/marketing/PremiumBundleCallout.tsx` | full-width grid span | yes | 2026-06 |
| GiftIdeaCard | `components/seo/GiftIdeaCard.tsx` | split layout + video | yes | 2026-06 |
| FAQAccordion | `components/ui/FAQAccordion.tsx` | disclosure pattern | yes | 2026-06 |
| SiteNavMenuButton | `components/layout/SiteNav.tsx` | icon morph | yes | 2026-06 |
| BackToTopButton | `components/layout/BackToTopButton.tsx` | FAB icon-only | yes | 2026-06 |
| BookAudienceCard | `components/booking/BookAudienceCard.tsx` | emotional chips + dual CTAs | yes | 2026-06 |
