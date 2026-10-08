---
name: price-change-sync
description: סנכרון אחרי כל שינוי במחירון או בתיאורי המוצרים של yakircohen.com. להשתמש כשמשנים מחיר, תיאור "מה כלול", שורת "מתאים ל" או כל טקסט ב-lib/data/pricing-catalog.ts, כשהבעלים מבקש "לעדכן מחיר", "לסנכרן את המחירון", "לעדכן את ה-closer או את quote.html", כש-audit:closer-sync או audit:quote-sync אדומים ("yakir-closer מצטט מחירון ישן"), וכשצריך לדעת מה לעדכן בכרטיס Google Business. הסקיל מסדר את הצעדים בסדר הנכון, כולל מה שרץ רק אחרי הדחיפה, ומונע את הבלבול שקרה ב-8.10.2026.
---

# סנכרון אחרי שינוי מחיר

המחיר חי במקום אחד, `lib/data/pricing-catalog.ts`, ומשם הוא נגזר לעוד ארבעה מקומות: האתר עצמו, כרטיס Google Business, כלי ההצעות המקומיים (yakir-closer ו-`quote.html`) ו-`llms.txt` עם סכמת האתר. שינוי בקטלוג שלא הגיע לכולם משאיר הצעה ללקוח שסותרת את האתר. **גם שינוי בטקסט בלבד** (`context`, `suitedFor`, רשימת "מה כלול") משנה את חתימת המחירון, ולכן דורש את אותם צעדים.

## כללים (ולמה)

- **המחיר רק מהקטלוג.** סכום כתוב כטקסט נכשל ב-`audit:price-literals` וב-`audit:prose-prices`. משתמשים ב-`getExVat("id")`, ב-`formatPrice(...)` או ב-`${getExVat("id").toLocaleString("he-IL")} ₪`. הצרכן רואה קודם את המחיר כולל מע״מ.
- **קובץ שנטען ברכיב לקוח לא מייבא את הקטלוג.** `lib/site-architecture.ts` נטען בתפריט, ויש תקציב על כמה רכיבי לקוח מגיעים לקטלוג (`audit:client-data-weight`). במקום כזה מורידים את הסכום מהטקסט, ולא כותבים אותו ידנית.
- **אסור לערוך את הבסיסים המוקפאים** (`scripts/baselines/price-literals.json`, `seo-pages.json`) כדי להשתיק שער.
- **ה-closer וה-quote הם מצב משותף לכל הסשנים.** `export:closer` כותב ל-`~/Code/local-tools`, ו-`export:quote` כותב ל-`~/Documents/yakircohen-ai-local/ui_interface/prices.js`. הסשן שהריץ אחרון גובר, ולכן סנכרון שנעשה לפני הדחיפה מתיישן (ב-8.10 זה קרה תוך שעה). מסנכרנים **אחרי** הדחיפה.
- **מדווחים לבעלים בעברית**, עם הראיה לכל צעד: פלט הפקודה והחתימה (hash) לפני ואחרי.

## הסדר

### 1. לפני הדחיפה, בענף עבודה (worktree)
1. עורכים את הקטלוג.
2. `npm run export:pricing` כותב את `docs/pricing-export.json` ומדפיס חתימה חדשה. הקובץ נכנס לקומיט.
3. שערים: `npx tsc --noEmit`, `npm run verify:ci`, `npm run verify:seo`. `verify:seo` כולל את `audit:schema-prices`, `audit:llms-prices` ו-`audit:prose-prices`. אם מחיר משתקף ב-`public/llms.txt`, מריצים `npm run sync:llms`.
4. שינוי שמשפיע על עמודים: גם `npm run verify:predeploy` (כולל `build:full` ו-`audit:seo-diff`). פרטים וחסמים ידועים: ראו את הסקיל `ship-and-verify-live`.
5. **דחיפה רק אחרי "תדחוף" מפורש של הבעלים.**

### 2. אחרי הדחיפה, מעץ ש-`lib/data/pricing-catalog.ts` שלו זהה בבייטים ל-`origin/main`
`export:quote` מסרב לכתוב אחרת, וזה מכוון: ענף עם מחיר שעוד לא נפרס לא דורס את מחירי ההצעות.

1. **גיבוי** של הקבצים שייכתבו: `closer-config.json`, `closer-config.js`, `closer-reply-builders.js` מ-`~/Code/local-tools`, ו-`prices.js` מהתיקייה שלמעלה. מגבים לתיקיית הסשן הזמנית.
2. `npm run export:closer`. הפקודה משנה גם חותמת זמן ב-`lib/data/equipment-inventory-bookings.json`: מחזירים אותו עם `git checkout --`.
3. `npm run audit:closer-sync` חייב להדפיס "תקין" עם אותה חתימה.
4. `npm run export:quote`, ואז `npm run audit:quote-sync`, גם הוא עם אותה חתימה.
5. אם בהרצה מופיע "UNMAPPED - ask Yakir": אלה מפתחות ב-`prices.js` שאין להם מקביל בקטלוג, והם נשארים עם הערך הישן. נכון ל-8.10.2026 יש 32 כאלה, ורק חמישה מהם בשימוש ב-`quote.html` (`official.remote`, `official.specterr`, `estimates.multi`, `estimates.heavy`, `estimates.video_upgrade`). מדווחים לבעלים, ולא ממפים בעצמכם.

### 3. כרטיס Google Business
אין לנו גישה לכרטיס. `npm run gbp:prices` מעדכן את `docs/gbp-price-sheet.md` ומדפיס אילו שורות מסומנות "לעדכן בכרטיס". הבעלים מעתיק אותן ידנית. כשהוא מדווח שעדכן, מעדכנים `gbpPriceNow` ב-`lib/data/gbp-products.ts`, וכך `npm run gbp:prices -- --check` יראה "תקין".

### 4. אימות חי
אחרי הפריסה (בדרך כלל 2 עד 3 דקות) בודקים באתר `https://yakircohen.com` (בלי www, עם `curl -sL`) שהמחיר או הטקסט החדש מופיע ב-HTML של העמוד הרלוונטי, ושהישן נעלם. סופרים הופעות עם `grep -oF ... | wc -l`, כי ה-HTML הוא שורה אחת.

## מה מדווחים בסוף
- מה השתנה בקטלוג, והחתימה לפני ואחרי.
- אילו סנכרונים רצו ומה אמרו `audit:closer-sync` ו-`audit:quote-sync`.
- מה הבעלים צריך לעשות ידנית: שורות "לעדכן בכרטיס" ב-Google Business.
- מה לא נבדק (למשל סטטוס CI, אם `gh` לא מחובר).
