# חותם עבודה

נוצר על ידי `node scripts/change-manifest.mjs --write`.
לאימות אחרי העברה בין מכונות: `node scripts/change-manifest.mjs --verify`.

בסיס: `preview/chrome-polish` @ `419fcb49dc8e`

סה״כ: **13** קבצים. חדשים 5, שונו 8, נמחקו 0.

> האימות משווה תוכן, לא רק קיום. אם קובץ נמחק, שוחזר לגרסה הישנה,
> או שונה אחרי יצירת החותם, האימות ייכשל ויגיד בדיוק על מה.

## קבצים חדשים

- `lib/data/breadcrumb-titles.generated.ts`
- `lib/data/glossary-meta.ts`
- `lib/data/glossary-tooltips.generated.ts`
- `scripts/audit-client-data-weight.mjs`
- `scripts/generate-client-data.ts`

## קבצים שנמחקו בכוונה


## קבצים ששונו

- `components/glossary/GlossaryInlineText.tsx`
- `components/marketing/LiveStatusBar.tsx`
- `components/marketing/LiveStatusProjectTicker.tsx`
- `components/pricing/CatalogOfferPanel.tsx`
- `docs/OWNER-DECISIONS-2026-09-07.md`
- `lib/breadcrumbs/build-trail.ts`
- `lib/data/glossary.ts`
- `package.json`
