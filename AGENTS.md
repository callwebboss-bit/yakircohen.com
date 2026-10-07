<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## מצב האתר ומה פתוח

**`docs/HANDOFF-2026-10-04.md`** הוא נקודת הפתיחה: מה בוצע, מה פתוח,
ואיזה ענפים מחזיקים עבודה שלא נכנסה ל-main. לקרוא אותו לפני שמתחילים
משימה חדשה, כדי לא לבנות משהו שסוכן אחר כבר בנה.

## מאיפה עובדים ומי דוחף (מ-4.10.2026)

**הריפו כבר לא ב-Dropbox.** העותק שעובדים בו הוא שיבוט מ-GitHub:

| מכונה | נתיב | תפקיד |
|---|---|---|
| מק | `~/Code/yakircohen-site` | פיתוח, מדידה, **ודחיפה ל-GitHub** (טוקן ב-osxkeychain) |
| ווינדוס | אין | **לא דוחף.** הבעלים הפסיק לדחוף מווינדוס ב-4.10 |

**התיקייה `Dropbox/YakirCohen.com/yakircohen-site` היא ארכיון.** ה-`.git`
שלה פגום: חסרים בו 17 קובצי pack ו-8 אובייקטים בטווח `1d0be2e..e2550b8`,
ויש בו 10 עותקים מתנגשים של `index`. לא להריץ בה git, לא לעבוד בה, ולא
להעתיק ממנה תיקייה שלמה. מה שעוד לא נדחף משם שמור כ-bundle ב-`~/yakir-backups`,
ונמשך לשיבוט עם `git fetch <bundle> <ענף>:<ענף>`.

**הסדר בכל סשן:**
1. `git pull` על `main`.
2. worktree וענף לכל סשן (`git worktree add ../wt-<נושא> -b <ענף>`). שני סשנים
   לא כותבים לאותו עץ.
3. `npm run deploy:status` לפני בנייה, בדיקות או דחיפה.
4. לפני דחיפה: `npm test`, `npx tsc --noEmit`, `npm run verify:seo`, ושינוי
   שמשפיע על עמודים גם `npm run build:full` ו-`npm run audit:seo-diff`.
5. דחיפה ל-`main` רק כשהכול ירוק, ואחריה בדיקת CI ופריסת Vercel על הקומיט.

**`local-tools`** (הכלי yakir-closer) נשאר ב-Dropbox, ומגיעים אליו דרך symlink:
`~/Code/local-tools` מצביע על `Dropbox/YakirCohen.com/local-tools`. ארבעה
סקריפטים מצפים ל-`../local-tools` (למשל `scripts/export-closer-config.mjs:26`).

**קבצים מקומיים שלא בגיט:** `.env.local`, `.vercel/project.json`, `.mcp.json`.

**לפני פריסה:** `npm run verify:predeploy` מריץ את כל השערים ומסתיים
ב-`audit:seo-diff`, שחוסם כל גריעה לא מאושרת באות סורקים.

שינוי מחיר בקטלוג: הפריסה מעדכנת לבד את `/admin/sales`. אחריה, מעותק שמסונכרן עם main: `npm run export:quote` ואז `npm run audit:quote-sync`, כדי ש-`quote.html` במק יקבל את המחירים.

## Project rules

Full stack, env, build, and deployment conventions: **`.cursor/rules/yakircohen-project.mdc`** (always applied in Cursor).

## Build load (multiple agents)

- **Do not** run `npm run build` from every agent in parallel -- it stacks CPU/RAM and fights over `.next/`.
- **Prefer** `npm run verify:quick` (unit tests + security smoke).
- **Lint + tests:** `npm run verify:ci` (CI / pre-push).
- **One build at a time:** `npm run build` is mutex-locked; if blocked, wait or run `npm run build:stop`.
- **Full production check:** run `npm run verify:predeploy` (or `npm run build` alone) once manually -- not per-agent.
