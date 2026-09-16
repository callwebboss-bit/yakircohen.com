<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## שתי מכונות, ריפו אחד על Dropbox. לקרוא לפני כל פעולה

**הפקודה הראשונה בכל סשן שנוגע בבנייה, בבדיקות או בפריסה:**

```
npm run deploy:status
```

היא קוראת בלבד, ואומרת מי המכונה הזו, אם עץ העבודה נקי, אם תיקיות הבנייה
מוחרגות מ-Dropbox, אם node_modules הותקן בפלטפורמה הנכונה, ומה הפעולה הבאה.
יוצאת בקוד 1 כשמשהו חוסם.

**החלוקה, ואינה נתונה לפרשנות:**

| מכונה | תפקיד | מה אסור |
|---|---|---|
| מק | פיתוח, מדידה, קומיטים | אין הרשאות GitHub. לא לנסות `git push` |
| ווינדוס | פיתוח **וגם הפורס הבלעדי** | לא לפרוס לפני `deploy:status` ירוק וקריאת `docs/DEPLOY-RUNBOOK.md` |

**מה שמפתיע סוכנים חדשים:** ה-`.git` עצמו מסונכרן ב-Dropbox. קומיט שנוצר
במק **כבר נמצא** בווינדוס בלי `git pull`, ו-GitHub עדיין לא מכיר אותו.
לכן `git fetch` לא יביא את העבודה של המכונה השנייה, והיעדר הקומיטים
ב-GitHub אינו סימן שמשהו חסר.

**מה שאסור להסתנכרן ב-Dropbox:** `.next`, `node_modules`, `.visual-baseline`.
הדגל `com.dropbox.ignored` הוא לכל מכונה בנפרד ויושב על התיקייה עצמה,
ולכן מחיקת התיקייה מוחקת אותו: קודם למחוק, אז ליצור ריקה, ורק אז לסמן.
בלי זה שתי המכונות דורסות זו את זו (נמדד 14.9.2026: 11 עותקים מתנגשים
בתוך `.next`, ובינארי esbuild של win32 שהפיל את הבנייה במק).

**לפני פריסה:** `npm run verify:predeploy` מריץ את כל השערים ומסתיים
ב-`audit:seo-diff`, שחוסם כל גריעה לא מאושרת באות סורקים ב-329 הכתובות.

## Project rules

Full stack, env, build, and deployment conventions: **`.cursor/rules/yakircohen-project.mdc`** (always applied in Cursor).

## Build load (important on Dropbox / multiple agents)

- **Do not** run `npm run build` from every agent in parallel -- it stacks CPU/RAM and fights over `.next/`.
- **Prefer** `npm run verify:quick` (unit tests + security smoke -- fast on Dropbox).
- **Lint + tests:** `npm run verify:ci` (CI / pre-push; slow locally on Dropbox).
- **One build at a time:** `npm run build` is mutex-locked; if blocked, wait or run `npm run build:stop`.
- **Full production check:** run `npm run verify:predeploy` (or `npm run build` alone) once manually -- not per-agent.
