# התראות מייל על לידים (Resend)

גיבוי אוטומטי בנוסף לוואטסאפ. בלי מפתחות — האתר ממשיך לעבוד רק עם וואטסאפ.

## מה צריך ממך (5–10 דקות)

### 1. חשבון Resend

1. היכנס ל-[https://resend.com](https://resend.com) והירשם (חינם עד ~100 מיילים ביום).
2. **API Keys** → Create API Key → העתק את המפתח (`re_...`).

### 2. כתובת מייל לקבלת לידים

- המייל שאליו תגיע ההתראה, למשל `callwebboss@gmail.com` או תיבה עסקית.

### 3. משתני סביבה ב-Vercel

בפרויקט **yakircohen-site** (לא yakircohen-com) → **Settings** → **Environment Variables**:

| שם | ערך | סביבות |
|----|-----|--------|
| `RESEND_API_KEY` | `re_xxxx` | Production (+ Preview אם רוצים לבדוק) |
| `LEAD_NOTIFY_EMAIL` | המייל שלך לקבלת לידים | Production |
| `RESEND_FROM_EMAIL` | אופציונלי — ראה למטה | Production |

אחרי שמירה: **Redeploy** ל-Production.

### 4. (מומלץ לפרודקשן) אימות דומיין ב-Resend

1. Resend → **Domains** → Add Domain → `yakircohen.com`.
2. הוסף את רשומות ה-DNS ש-Resend נותן (ב-Cloudflare, **לפני** או **אחרי** מעבר ה-DNS של האתר).
3. כשהדומיין Verified, הגדר:

```text
RESEND_FROM_EMAIL=יקיר כהן הפקות <leads@yakircohen.com>
```

**בלי אימות דומיין:** אפשר לבדוק עם ברירת המחדל `onboarding@resend.dev` (רק לבדיקות; מגבלות שליחה).

## בדיקה

1. פרוס את האתר עם המשתנים.
2. מלא טופס ב-`/book` ושלח לוואטסאפ.
3. בדוק תיבת `LEAD_NOTIFY_EMAIL` (וגם Spam).

## פרטיות

- לא שומרים לידים בבסיס נתונים — רק שליחה ל-Resend.
- גוף ההודעה הוא אותו טקסט שנשלח לוואטסאפ.
