# אסטרטגיית כתובות ו-SEO

## עקרון מרכזי

**כל שירות = עמוד פעיל משלו** בכתובת הקנונית (בסייטמאפ, עם `canonical`, תוכן מלא, גלריה, FAQ).

דוגמאות כתובות פעילות (לא redirect):

- `https://yakircohen.com/events/attractions/bubble-machine`
- `https://yakircohen.com/podcast/podcast-recording`
- `https://yakircohen.com/studio/recording-song-modiin`

## מתי כן משתמשים ב-301 (redirect)

רק בשני מקרים:

1. **כתובת ישנה מהאתר הקודם** (Google Sites, קישורים ישנים) → מעבירים לכתובת הקנונית החדשה  
   לדוגמה: `/attractions/bubble-machine` → `/events/attractions/bubble-machine`  
   זה לא «מחליף» עמוד -- אין תוכן כפול; רק מעבירים מבקרים ומגוגל ל-URL הנכון.

2. **כפילות אמיתית** -- אותו תוכן בשני נתיבים, רוצים רק אחד בגוגל  
   לדוגמה: `/podcast/podcast-studio` → `/podcast/podcast-studio-modiin`

רשימה: `lib/site-architecture.ts` (`CANONICAL_REDIRECTS`) + `lib/legacy-redirects.ts`.

## מה לא לעשות

- לא לעשות redirect בין שני עמודי שירות שונים (למשל DJ → בועות).
- לא להוסיף עמודים לסייטמאפ אם הם רק `redirect()` בקוד.
- לא לסמוך על redirect במקום לבנות עמוד עשיר בכתובת הסופית.

## מבנה נוכחי (אטרקציות)

| ישן (Google Sites) | פעיל וקנוני (Next.js) |
|--------------------|------------------------|
| `/attractions/...` | `/events/attractions/...` |

העמוד **הפעיל** נמצא תחת `/events/attractions/`. הנתיב הישן רק מפנה אליו -- מומלץ לגוגל.

## בדיקה לפני עלייה לאוויר

```bash
npm run build
# ודא שכל URL בסייטמאפ נפתח עם תוכן (לא redirect מיידי), למעט:
# /courses, /podcast/podcast-studio (כוונתיים ממוזגים)
```

## קישורים פנימיים

עריכה ב-`lib/internal-links/intro-segments.ts` -- 2–3 קישורים טבעיים לעמוד, בלי redirect.
