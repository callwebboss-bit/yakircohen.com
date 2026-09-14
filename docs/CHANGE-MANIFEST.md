# חותם עבודה

נוצר על ידי `node scripts/change-manifest.mjs --write`.
לאימות אחרי העברה בין מכונות: `node scripts/change-manifest.mjs --verify`.

בסיס: `preview/chrome-polish` @ `e1af60402d31`

סה״כ: **46** קבצים. חדשים 6, שונו 38, נמחקו 2.

> האימות משווה תוכן, לא רק קיום. אם קובץ נמחק, שוחזר לגרסה הישנה,
> או שונה אחרי יצירת החותם, האימות ייכשל ויגיד בדיוק על מה.

## קבצים חדשים

- `lib/seo/entity-ids.ts`
- `lib/seo/entity-refs.test.ts`
- `lib/seo/page-schema.test.ts`
- `scripts/audit-seo-diff.mjs`
- `scripts/baselines/seo-approved-changes.json`
- `scripts/template-pages.mjs`

## קבצים שנמחקו בכוונה

- `app/(blog)/loading.tsx`
- `app/book/loading.tsx`

## קבצים ששונו

- `.github/workflows/ci.yml`
- `app/(blog)/blog/[slug]/page.tsx`
- `app/(services)/academy/hebrew-lessons/page.tsx`
- `app/(services)/events/attractions/beit-shemesh/page.tsx`
- `app/(services)/events/attractions/jerusalem/page.tsx`
- `app/(services)/events/attractions/shoham/page.tsx`
- `app/(services)/podcast/beit-shemesh/page.tsx`
- `app/(services)/podcast/jerusalem/page.tsx`
- `app/(services)/podcast/rehovot/page.tsx`
- `app/(services)/podcast/shoham/page.tsx`
- `app/(services)/studio/page.tsx`
- `app/business/content-studio/page.tsx`
- `app/business/reel-factory/page.tsx`
- `app/business/social-media/page.tsx`
- `app/shop/page.tsx`
- `components/layout/SiteNav.tsx`
- `components/seo/AudioShowcase.tsx`
- `components/seo/BatMitzvahClipPageContent.tsx`
- `components/seo/BookCategorySchema.tsx`
- `components/seo/BookPageSchema.tsx`
- `components/seo/GeoCityDjPageContent.tsx`
- `components/seo/PersonAboutSchema.tsx`
- `components/seo/RecordingSongModiinPageContent.tsx`
- `components/seo/SeoPortfolioGalleryJsonLd.tsx`
- `cypress/e2e/a11y.cy.ts`
- `lib/business-page-shell.tsx`
- `lib/constants.ts`
- `lib/data/industry-2026.ts`
- `lib/data/voiceover-narrator-compare.ts`
- `lib/seo/build-site-schema.ts`
- `lib/seo/gifts-page-schema.ts`
- `lib/seo/page-schema.ts`
- `lib/seo/ulpan-page-schema.ts`
- `lib/site-architecture.ts`
- `lib/video-schema.ts`
- `package.json`
- `scripts/audit-aeo-coverage.mjs`
- `scripts/audit-client-data-weight.mjs`
