# חותם עבודה

נוצר על ידי `node scripts/change-manifest.mjs --write`.
לאימות אחרי העברה בין מכונות: `node scripts/change-manifest.mjs --verify`.

בסיס: `preview/chrome-polish` @ `1c969e086edc`

סה״כ: **20** קבצים. חדשים 4, שונו 16, נמחקו 0.

> האימות משווה תוכן, לא רק קיום. אם קובץ נמחק, שוחזר לגרסה הישנה,
> או שונה אחרי יצירת החותם, האימות ייכשל ויגיד בדיוק על מה.

## קבצים חדשים

- `lib/constants.test.ts`
- `lib/data/blog-dates.test.ts`
- `lib/format-hebrew-date.ts`
- `scripts/audit-llms-coverage.ts`

## קבצים שנמחקו בכוונה


## קבצים ששונו

- `app/(blog)/blog/[slug]/page.tsx`
- `components/blog/ArticleFeed.tsx`
- `components/blog/BlogFeaturedStrip.tsx`
- `instrumentation-client.ts`
- `lib/constants.ts`
- `lib/data/blog.ts`
- `lib/seo/build-site-schema.ts`
- `lib/seo/entity-refs.test.ts`
- `lib/seo/entity-same-as.ts`
- `lib/seo/site-schema.json`
- `next.config.ts`
- `package.json`
- `public/llms.txt`
- `scripts/audit-seo-diff.mjs`
- `scripts/audit-visual.mjs`
- `scripts/baselines/seo-pages.json`
