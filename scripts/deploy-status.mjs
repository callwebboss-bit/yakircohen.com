/**
 * deploy-status.mjs - מי אני, מה מצבי, ומה הפעולה הבאה.
 *
 * למה הקובץ הזה קיים: הריפו עבד על Dropbox ומסונכרן בין שתי מכונות.
 * מ-4.10.2026 הוא יושב ב-~/Code/yakircohen-site על המק, וה-Dropbox הוא
 * ארכיון בלבד. המק מפתח, מודד ודוחף ל-GitHub. הבעלים הפסיק לדחוף
 * ולפרוס מווינדוס (ראו AGENTS.md).
 *
 * הכשלים שהפקודה הזו נועדה למנוע, כולם קרו בפועל בספטמבר 2026, בזמן שהריפו
 * עוד היה ב-Dropbox ושתי המכונות עבדו עליו:
 * בנייה מעורבת בין שתי המכונות (11 עותקים מתנגשים בתוך .next), התקנה של
 * node_modules מפלטפורמה אחרת (esbuild של win32 על מק), פריסה מהאש
 * שכבר אינו ראש הענף, ופריסה בזמן שקבצים לא שמורים יושבים בעץ העבודה.
 *
 * הרצה: npm run deploy:status
 * אינה משנה דבר. קריאה בלבד.
 */

import { execFileSync } from "node:child_process";
import { accessSync, constants as fsConstants, existsSync, readFileSync, readdirSync, realpathSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IS_WINDOWS = process.platform === "win32";
const IS_MAC = process.platform === "darwin";
/* בדיקות Dropbox רלוונטיות רק כשהריפו באמת יושב בתיקיית Dropbox. מ-4.10.2026 העבודה
   ב-~/Code, ושם `.next` לא מסתנכרן. בלי הבדיקה הזו כל worktree עם `.next` יצא אדום
   ועצר את verify:predeploy בשלב הראשון. */
const IN_DROPBOX = (() => {
  try {
    return /dropbox/i.test(realpathSync(ROOT));
  } catch {
    return /dropbox/i.test(ROOT);
  }
})();

const git = (...args) => {
  try {
    return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    return "";
  }
};

const ok = (t) => "  ✓ " + t;
const bad = (t) => "  ✗ " + t;
const info = (t) => "  · " + t;

const problems = [];
const lines = [];

/* ---------- מי אני ---------- */
const role = IS_WINDOWS
  ? "ווינדוס: לא דוחף ולא פורס מאז 4.10.2026"
  : IS_MAC
    ? "מכונת פיתוח ודחיפה ל-GitHub"
    : "מכונה לא מוכרת";
lines.push("");
lines.push(`מכונה: ${process.platform} · תפקיד: ${role}`);
lines.push(`Node ${process.version}`);

/* ---------- מצב git ---------- */
const branch = git("rev-parse", "--abbrev-ref", "HEAD");
const head = git("rev-parse", "--short", "HEAD");
const headFull = git("rev-parse", "HEAD");
const dirty = git("status", "--porcelain").split("\n").filter(Boolean);
const ahead = git("rev-list", "--count", "origin/main..HEAD");
const behindRemote = git("rev-list", "--count", `HEAD..origin/${branch}`);

lines.push("");
lines.push("git");
lines.push(info(`ענף ${branch || "?"} · ראש ${head || "?"}`));
lines.push(info(`${ahead || "?"} קומיטים מעל origin/main`));

if (dirty.length === 0) {
  lines.push(ok("עץ העבודה נקי"));
} else {
  problems.push(
    `עץ העבודה מחזיק ${dirty.length} קבצים לא שמורים. פריסה תבנה אותם. לשמור או להחזיר לפני שממשיכים.`,
  );
  lines.push(bad(`${dirty.length} קבצים לא שמורים:`));
  for (const f of dirty.slice(0, 10)) lines.push("      " + f);
  if (dirty.length > 10) lines.push(`      ועוד ${dirty.length - 10}`);
}

if (behindRemote && Number(behindRemote) > 0) {
  problems.push(
    `GitHub מקדים את המכונה הזו ב-${behindRemote} קומיטים על ${branch}. לבדוק מה נדחף ומאיפה לפני שממשיכים, ולמשוך אם צריך (git pull --ff-only).`,
  );
}

/* ---------- Dropbox ---------- */
lines.push("");
lines.push("Dropbox");
const ignoreState = (dir) => {
  const path = join(ROOT, dir);
  if (!existsSync(path)) return "אין תיקייה";
  try {
    if (IS_MAC) {
      const out = execFileSync("xattr", ["-p", "com.dropbox.ignored", path], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
      return out === "1" ? "מוחרג" : "לא מוחרג";
    }
    if (IS_WINDOWS) {
      const out = execFileSync(
        "powershell",
        ["-NoProfile", "-Command", `Get-Content -Path '${path}' -Stream com.dropbox.ignored -ErrorAction SilentlyContinue`],
        { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
      ).trim();
      return out === "1" ? "מוחרג" : "לא מוחרג";
    }
  } catch {
    return "לא מוחרג";
  }
  return "לא ידוע";
};

for (const dir of IN_DROPBOX ? [".next", "node_modules", ".visual-baseline"] : []) {
  const state = ignoreState(dir);
  if (state === "מוחרג") lines.push(ok(`${dir}: ${state}`));
  else if (state === "אין תיקייה") lines.push(info(`${dir}: ${state}`));
  else {
    lines.push(bad(`${dir}: ${state}`));
    problems.push(
      `${dir} מסתנכרן ב-Dropbox במכונה הזו. שתי המכונות ידרסו זו את זו. ` +
        (IS_WINDOWS
          ? `תיקון: Remove-Item -Recurse -Force ${dir}; New-Item -ItemType Directory ${dir}; Set-Content -Path ${dir} -Stream com.dropbox.ignored -Value 1`
          : `תיקון: xattr -w com.dropbox.ignored 1 ${dir}`),
    );
  }
}

if (!IN_DROPBOX) lines.push(info("הריפו לא בתוך תיקיית Dropbox, ולכן בדיקת ההחרגה לא נדרשת"));

/* ---------- node_modules ---------- */
lines.push("");
lines.push("תלויות");
const nmPath = join(ROOT, "node_modules");
if (!existsSync(nmPath)) {
  lines.push(bad("node_modules חסר"));
  problems.push("node_modules חסר. להריץ npm ci.");
} else {
  /* esbuild ו-swc מתקינים בינארי לפי פלטפורמה. בינארי של המכונה השנייה
     הוא בדיוק מה שמפיל את הבנייה כשהתיקייה סונכרנה ב-Dropbox. */
  const expect = IS_WINDOWS ? "win32" : IS_MAC ? "darwin" : process.platform;
  const found = existsSync(join(nmPath, "@esbuild"))
    ? readdirSync(join(nmPath, "@esbuild"))
    : [];
  const mine = found.filter((d) => d.startsWith(expect));
  const foreign = found.filter((d) => !d.startsWith(expect));
  if (mine.length > 0) lines.push(ok(`בינארי esbuild לפלטפורמה הזו (${mine.join(", ")})`));
  else if (found.length > 0) {
    lines.push(bad(`esbuild מותקן ל-${found.join(", ")} ולא ל-${expect}`));
    problems.push(
      "node_modules הותקן במכונה אחרת. הבנייה תיפול. תיקון: למחוק את node_modules ולהריץ npm ci.",
    );
  }
  if (foreign.length > 0 && mine.length > 0)
    lines.push(info(`יש גם בינארי של ${foreign.join(", ")}, שריד מסנכרון ישן`));

  /* הרשאת הרצה, ולא רק קיום. ב-19.9.2026 ההתקנה של ווינדוס סונכרנה למק,
     ו-node_modules/.bin/tsx הגיע כ--rw-------. הבדיקה למעלה עברה, כי
     התיקייה של esbuild הייתה קיימת, וכל סקריפט tsx נפל על Permission
     denied. בדיקה שעוברת על התקנה שבורה גרועה מבדיקה שלא קיימת. */
  if (!IS_WINDOWS) {
    const tsxBin = join(nmPath, ".bin", "tsx");
    if (existsSync(tsxBin)) {
      try {
        accessSync(tsxBin, fsConstants.X_OK);
        lines.push(ok("node_modules/.bin/tsx ניתן להרצה"));
      } catch {
        lines.push(bad("node_modules/.bin/tsx קיים אבל אינו ניתן להרצה"));
        problems.push(
          "הרשאות ההרצה ב-node_modules/.bin אבדו, סימן מובהק להתקנה שסונכרנה ממכונה אחרת. תיקון: למחוק את node_modules ולהריץ npm ci.",
        );
      }
    }
  }

  /* התקנה קטועה או סנכרון באמצע. התקנה תקינה כאן היא מאות ערכים; ב-19.9
     נמצאו 34 בלבד, והבדיקות למעלה לא ראו בזה בעיה. */
  const topLevel = readdirSync(nmPath).filter((d) => !d.startsWith(".")).length;
  if (topLevel < 100) {
    lines.push(bad(`node_modules מכיל ${topLevel} ערכים בלבד`));
    problems.push(
      `node_modules נראה קטוע (${topLevel} ערכים, ה-lock מצהיר על כ-594). הסיבה הנפוצה: ` +
        `npm ci מוחק את התיקייה ויוצר אותה מחדש, ולכן הדגל אבד לאורך ההתקנה ו-Dropbox ` +
        `סנכרן אותה באמצע. תיקון: להשהות סנכרון ב-Dropbox, npm ci, ורק אז לחדש. ` +
        `ה-postinstall מחזיר את הדגל בסוף ההתקנה.`,
    );
  } else {
    lines.push(ok(`${topLevel} חבילות ברמה העליונה`));
  }
}

/* ---------- עותקים מתנגשים של Dropbox ---------- */
{
  /* עומק 1 בלבד, וזו החלטה מדודה: הגרסה הראשונה סרקה לעומק 2 ולקחה יותר
     מארבע דקות על Dropbox, כי node_modules הוא 628 חבילות ואלפי תיקיות
     על מערכת קבצים מרוחקת. פקודת מצב שלוקחת דקות פשוט לא מורצת.
     העותקים שנמצאו בפועל ב-14.9 וב-19.9 ישבו כולם בעומק 1 תחת .next
     ותחת node_modules, כלומר כשכנים של התיקיות עצמן. */
  const conflicts = [];
  for (const dir of [".next", "node_modules"]) {
    const path = join(ROOT, dir);
    if (!existsSync(path)) continue;
    try {
      for (const name of readdirSync(path)) {
        if (name.includes("conflicted copy")) conflicts.push(`${dir}/${name}`);
      }
    } catch {
      /* תיקייה שנמחקת תוך כדי סריקה אינה שגיאה */
    }
  }
  if (conflicts.length > 0) {
    lines.push("");
    lines.push("עותקים מתנגשים");
    lines.push(bad(`${conflicts.length} עותקים מתנגשים של Dropbox בתיקיות הבנייה`));
    for (const name of conflicts.slice(0, 3)) lines.push("      " + name);
    problems.push(
      "יש עותקים מתנגשים בתיקיות הבנייה, כלומר שתי המכונות כתבו לאותו קובץ. תיקון: למחוק את .next ואת node_modules, ליצור מחדש, ולהריץ npm run dropbox:ignore ואז npm ci.",
    );
  }
}

/* ---------- בנייה ---------- */
lines.push("");
lines.push("בנייה מקומית");
const buildIdPath = join(ROOT, ".next", "BUILD_ID");
if (!existsSync(buildIdPath)) {
  lines.push(info("אין בנייה ב-.next"));
} else {
  const buildId = readFileSync(buildIdPath, "utf8").trim();
  const mtime = execFileSync("git", ["log", "-1", "--format=%ci"], { cwd: ROOT, encoding: "utf8" }).trim();
  lines.push(info(`BUILD_ID ${buildId} · הקומיט האחרון ${mtime}`));
}

/* ---------- בסיסי המדידה ---------- */
lines.push("");
lines.push("בסיסי המדידה");
const baselinePath = join(ROOT, "scripts", "baselines", "seo-pages.json");
if (existsSync(baselinePath)) {
  const b = JSON.parse(readFileSync(baselinePath, "utf8"));
  const sameHead = b.gitHead === headFull;
  lines.push(
    info(
      `אותות סורקים: ${b.urlCount} כתובות, נלכד מ-${(b.gitHead || "?").slice(0, 7)}` +
        (b.uncommittedFiles === 0 ? ", עץ נקי" : `, עם ${b.uncommittedFiles} קבצים פתוחים`),
    ),
  );
  if (b.uncommittedFiles > 0)
    problems.push(
      "הבסיס נלכד מעץ עבודה מלוכלך, ולכן הוא אינו ראיה. ללכוד מחדש מעץ נקי של HEAD.",
    );
  if (!sameHead)
    lines.push(info("הבסיס נלכד מקומיט אחר מהראש הנוכחי. זה תקין: הוא ה'לפני' שמשווים אליו."));
}

/* ---------- מה הלאה ---------- */
lines.push("");
lines.push("הפעולה הבאה");
if (problems.length > 0) {
  for (const p of problems) lines.push(bad(p));
  lines.push("");
  lines.push("  לטפל בכל השורות האדומות לפני כל פעולת פריסה.");
} else if (IS_WINDOWS) {
  lines.push(ok("ווינדוס לא דוחף ולא פורס מאז 4.10.2026 (AGENTS.md). הפיתוח והדחיפה מהמק."));
} else {
  lines.push(ok("המכונה מוכנה. המק מפתח, מודד ודוחף ל-GitHub (AGENTS.md)."));
  lines.push("");
  lines.push("  1. לעבוד ב-worktree נפרד ולא בעץ המשותף");
  lines.push("  2. npm run verify:predeploy   (כולל audit:seo-diff כשער חוסם)");
  lines.push(`  3. דחיפה ל-main רק באישור הבעלים: git push origin HEAD:main (הענף הנוכחי: ${branch})`);
}
lines.push("");

console.log(lines.join("\n"));
process.exit(problems.length > 0 ? 1 : 0);
