# Sentry: מה להגדיר ב-Vercel, ומה זה נותן

**למי זה:** הבעלים. זה ממשק של Vercel, אי אפשר מהקוד.
**כמה זמן:** כ-5 דקות, ועוד פריסה אחת.

---

## למה זה פתוח

שלושה קבצים באתר מחכים למשתנה אחד:

| קובץ | מה הוא מנטר |
|---|---|
| `sentry.server.config.ts` | שגיאות בצד השרת |
| `sentry.edge.config.ts` | שגיאות ב-Edge |
| `next.config.ts` | יעד דיווח הפרות CSP |

כולם קוראים את `NEXT_PUBLIC_SENTRY_DSN`. כל עוד הוא ריק, `dsn` הוא
`undefined`, הספרייה עולה בלי יעד, ו**שום שגיאה לא נשלחת לשום מקום**.

חמישה קבצים כבר קוראים ל-`captureException`, ושלושה מהם הם בדיוק
מסלולי הלידים: `app/api/lead-notify/route.ts`,
`app/api/lead-intake/route.ts` ו-`app/api/service-advisor/route.ts`.

**המשמעות המעשית:** אם שליחת ליד נכשלת אצל לקוח, היא נכשלת בשקט. אתה
לא תדע. זה אותו כשל שב-GA4 נרשם כ-`lead_submit_failed`, רק שכאן תקבל
את השגיאה עצמה ולא רק ספירה.

---

## מה זה לא עולה

**אפס בתים בדפדפן.** נמדד בבנייה של 4.10.2026: אף צ׳אנק לקוח לא מכיל
את Sentry. הקובץ `instrumentation-client.ts` נמחק ב-1.10.2026, ולכן
הגדרת ה-DSN **לא** מחזירה את הצ׳אנק הכבד שהיה שם קודם. הניטור שנדלק
הוא בצד השרת בלבד.

אם בעתיד תרצה גם ניטור בדפדפן, זו החלטה נפרדת שדורשת ליצור מחדש את
`instrumentation-client.ts`. ההסבר המלא ב-`next.config.ts`.

---

## פרטיות

`sentry.server.config.ts` מגדיר `sendDefaultPii: false`, ויש בו
`beforeSend` שמסנן. `tracesSampleRate` הוא 0.05, כלומר חמישה אחוזים
מהבקשות לפרופיל ביצועים.

---

## הצעדים

1. להיכנס ל-sentry.io, לפרויקט של האתר. אם אין פרויקט: **Create Project**
   → פלטפורמה **Next.js**
2. **Settings** → **Client Keys (DSN)**. להעתיק את ה-DSN. הוא נראה כך:
   `https://<מפתח>@<מזהה>.ingest.sentry.io/<מספר>`
3. ב-Vercel: הפרויקט **yakircohen-site** (לא `yakircohen-com`, זו כפילות)
4. **Settings** → **Environment Variables** → **Add New**
5. למלא:
   - Key: `NEXT_PUBLIC_SENTRY_DSN`
   - Value: ה-DSN שהעתקת
   - Environments: לסמן **Production** (ואם תרצה, גם Preview)
6. **Save**

> **משתנה סביבה לא חל רטרואקטיבית.** הוא נכנס לתוקף רק בבנייה הבאה.
> צריך פריסה חדשה: **Deployments** → הפריסה האחרונה → תפריט שלוש
> הנקודות → **Redeploy**.

---

## לוודא שזה עובד

1. ב-Sentry: **Issues**. בהתחלה ריק, זה תקין
2. ב-Vercel אחרי הפריסה: **Settings** → **Environment Variables**,
   לוודא שהמשתנה מופיע
3. הבדיקה האמיתית: למלא ליד באתר. אם הוא עובר, לא תראה כלום ב-Sentry,
   וזה בדיוק מה שאנחנו רוצים. אם הוא נכשל, השגיאה תופיע ב-Issues תוך
   שניות

**להתראות במייל:** ב-Sentry, **Settings** → **Alerts** → **Create Alert**
→ **Issues**. התנאי השימושי ביותר: שגיאה חדשה במסלול שמכיל `lead`.
