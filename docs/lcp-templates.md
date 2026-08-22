# LCP candidates by page template

Locked targets for `priority` + `fetchPriority="high"` — **one asset per page only**.

| Route template | LCP element | Component / asset |
|----------------|-------------|-------------------|
| `/` (home) | Studio hero WebP | `HomeHero` → `SITE_STUDIO_IMAGE_SRC` |
| Service hub/leaf (`/studio`, `/podcast`, …) | Portfolio hero image | `ServicePageLayout` → `ServiceHeroVisual` |
| `/academy/dj-course` | Inline hero image | `app/(services)/academy/dj-course/page.tsx` |
| `/book` | H1 + Heebo (text) | No image `priority` |
| `/shop` | H1 + intro text | No preload / no voucher `priority` |
| `/blog` | Featured post image (index only) | `ArticleFeed` first card |
| `/blog/[slug]` | Article thumbnail | `blog/[slug]/page.tsx` |
| All other pages | First above-fold hero image if present | Same as service template |

**Never priority:** header logo, gallery thumbs, lightbox, mid-page images, shop vouchers, Elfsight widgets.

Measure after deploy: Lighthouse mobile on `/`, `/studio`, `/book`, `/shop`.
