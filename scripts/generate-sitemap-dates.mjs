/**
 * מפיק תאריך שינוי אמיתי לכל ראוט, מהיסטוריית git.
 *
 * למה לא תאריך ה-build: זה היה מסמן את כל 229 העמודים כאילו התעדכנו בכל דיפלוי.
 * גוגל מתייחס ל-lastmod מנופח כאות לא אמין ומפסיק להסתמך עליו, כולל במקומות שבהם
 * הוא כן מדויק (86 עמודי הבלוג). תאריך git שמרני מדי עדיף על תאריך מומצא טרי.
 *
 * מגבלה מודעת: התאריך נלקח מקובץ הראוט. תוכן שיושב ב-lib/data ומשתנה בלי לגעת
 * בראוט לא יזיז אותו, ולכן התאריך הוא רצפה ולא תקרה. זה הכיוון הבטוח.
 *
 * ריצה אחת של git log במקום קריאה לכל קובץ, כי הריפו על Dropbox ואיטי.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, "app");
const OUT = path.join(ROOT, "lib", "data", "sitemap-dates.generated.json");

function routeFromFile(file) {
  const rel = path.relative(APP_DIR, path.dirname(file));
  if (rel.startsWith("..")) return null;
  const segments = rel
    .split(path.sep)
    .filter((s) => s && !(s.startsWith("(") && s.endsWith(")")));
  if (segments.some((s) => s.startsWith("[") || s.startsWith("_"))) return null;
  return "/" + segments.join("/");
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.name === "page.tsx" || e.name === "page.ts") out.push(full);
  }
  return out;
}

/** file path (repo-relative, posix) → ISO date of the last commit touching it */
function gitLastModifiedMap() {
  const raw = execFileSync(
    "git",
    ["log", "--format=__C__%cI", "--name-only", "--no-renames"],
    { cwd: ROOT, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 },
  );
  const map = new Map();
  let current = null;
  for (const line of raw.split("\n")) {
    if (line.startsWith("__C__")) {
      current = line.slice(5).trim();
    } else if (line.trim() && current && !map.has(line.trim())) {
      /* git log יורד מהחדש לישן, ולכן ההופעה הראשונה היא האחרונה בזמן */
      map.set(line.trim(), current);
    }
  }
  return map;
}

const gitDates = gitLastModifiedMap();
const routes = {};
let missing = 0;

for (const file of walk(APP_DIR)) {
  const route = routeFromFile(file);
  if (route === null) continue;
  const rel = path.relative(ROOT, file).split(path.sep).join("/");
  const date = gitDates.get(rel);
  if (!date) {
    missing++;
    continue;
  }
  routes[route] = date;
}

const dated = Object.keys(routes).length;
const total = dated + missing;
const coverage = total ? dated / total : 0;

/**
 * שומר סף. Vercel משכפל את הריפו רדוד (depth 10) כברירת מחדל, ואז git log
 * מחזיר עשרה קומיטים, כמעט כל ראוט נופל ל-missing, והתוצאה היא מפת אתר בלי
 * שום lastmod. זה בדיוק ההפך מהמטרה, והיה קורה בשקט כי הסקריפט רק מדפיס מספר.
 *
 * לכן הקובץ הזה נוצר מקומית עם היסטוריה מלאה ונשמר ב-git, ולא מיוצר מחדש
 * ב-vercel-build. אם בכל זאת מריצים אותו על היסטוריה חלקית, עדיף להיכשל
 * מאשר לדרוס נתונים טובים בריקים.
 */
const MIN_COVERAGE = 0.8;
if (coverage < MIN_COVERAGE) {
  console.error(
    `generate:sitemap-dates FAILED -- only ${dated}/${total} routes (${Math.round(coverage * 100)}%) have a git date.\n` +
      `  Refusing to overwrite ${path.relative(ROOT, OUT)} with sparse data.\n` +
      `  Most likely cause: a shallow clone. Run with full history (git fetch --unshallow).`,
  );
  process.exit(1);
}

fs.writeFileSync(OUT, JSON.stringify(routes, null, 2) + "\n", "utf8");
console.log(
  `generate:sitemap-dates -- ${dated}/${total} routes dated from git (${Math.round(coverage * 100)}%)` +
    (missing ? `, ${missing} not committed yet` : ""),
);
