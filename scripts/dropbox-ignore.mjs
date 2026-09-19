/**
 * dropbox-ignore.mjs - מסמן את תיקיות הבנייה כמוחרגות מסנכרון Dropbox.
 *
 * למה זה רץ אוטומטית אחרי כל התקנה: הריפו יושב על Dropbox ומסונכרן בין
 * מק לווינדוס. הדגל `com.dropbox.ignored` הוא לכל מכונה בנפרד ויושב על
 * התיקייה עצמה, ולכן `npm ci` מוחק אותו: הוא מוחק את node_modules ויוצר
 * אותה מחדש, והדגל הולך עם התיקייה הישנה.
 *
 * מה שקרה בפועל, 19.9.2026: בווינדוס הדגל מעולם לא הוגדר, ואחרי npm ci
 * שם Dropbox העלה את ההתקנה כולה והוריד אותה למק. במק נמצא esbuild של
 * win32-x64, tsx בלי הרשאת הרצה, ו-node_modules עם 34 ערכים בלבד. המק
 * לא יכול היה לבנות. זו הפעם השנייה שזה קורה, ובפעם הראשונה התיקון היה
 * ידני ולכן נשכח.
 *
 * הסקריפט לא מפיל התקנה בשום מצב: כל כשל נבלע, והיציאה היא תמיד 0.
 * בענן (Vercel, CI) הוא לא עושה כלום.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TARGETS = ["node_modules", ".next", ".visual-baseline"];

/* בענן אין Dropbox, ואין מה לסמן. */
if (process.env.VERCEL || process.env.CI || process.env.DROPBOX_IGNORE_SKIP) {
  process.exit(0);
}

const marked = [];
const skipped = [];

for (const name of TARGETS) {
  const path = join(ROOT, name);
  try {
    /* .visual-baseline נוצרת רק כשמריצים את שער הצילומים. אין טעם ליצור
       אותה כאן, אבל אם היא קיימת היא חייבת להיות מוחרגת: 39 צילומים
       מלאים הם עשרות מגה-בייט שמסתנכרנים בכל הרצה. */
    if (!existsSync(path)) {
      if (name === ".visual-baseline") {
        skipped.push(`${name} (אין תיקייה)`);
        continue;
      }
      mkdirSync(path, { recursive: true });
    }

    if (process.platform === "darwin") {
      execFileSync("xattr", ["-w", "com.dropbox.ignored", "1", path], { stdio: "ignore" });
      marked.push(name);
    } else if (process.platform === "win32") {
      execFileSync(
        "powershell",
        [
          "-NoProfile",
          "-NonInteractive",
          "-Command",
          `Set-Content -Path '${path}' -Stream com.dropbox.ignored -Value 1`,
        ],
        { stdio: "ignore" },
      );
      marked.push(name);
    } else {
      skipped.push(`${name} (${process.platform} אינו נתמך)`);
    }
  } catch {
    /* אין Dropbox, אין הרשאות, אין xattr: כל אלה תקינים ואינם שגיאה. */
    skipped.push(`${name} (לא ניתן לסמן)`);
  }
}

if (marked.length > 0) {
  console.log(`dropbox-ignore: ${marked.join(", ")} מוחרגות מסנכרון.`);
}
if (skipped.length > 0) {
  console.log(`dropbox-ignore: דולג על ${skipped.join(", ")}.`);
}

process.exit(0);
