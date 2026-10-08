/**
 * מפיק תאריך שינוי אמיתי לכל ראוט, מהיסטוריית git של קבצי התוכן שלו.
 *
 * למה לא תאריך ה-build: זה היה מסמן את כל 229 העמודים כאילו התעדכנו בכל דיפלוי.
 * גוגל מתייחס ל-lastmod מנופח כאות לא אמין ומפסיק להסתמך עליו, כולל במקומות שבהם
 * הוא כן מדויק (86 עמודי הבלוג). תאריך git שמרני מדי עדיף על תאריך מומצא טרי.
 *
 * מה נחשב קובץ מקור: ה-page.tsx, שברוב העמודים הוא עטיפה דקה, וקבצי התוכן הפרטיים
 * שהוא מייבא (components/seo/*PageContent.tsx, lib/data/*-page.ts). מודול שמגיעים
 * אליו ביותר מ-SHARED_FANOUT_LIMIT עמודים (pricing-catalog, services) מוחרג, אחרת
 * כל עדכון מחיר היה מסמן עשרות עמודים כמעודכנים. הלוגיקה ב-sitemap-dates-core.mjs.
 *
 * מגבלה מודעת: תוכן שיושב במודול משותף ומשתנה בלי לגעת בקבצים הפרטיים של העמוד
 * לא יזיז את התאריך שלו, ולכן התאריך הוא רצפה ולא תקרה. זה הכיוון הבטוח.
 *
 * בלוג, קטגוריות בלוג ומילון לא עוברים כאן: כולם יושבים בקובץ אחד, ו-git לא יכול
 * להבדיל ביניהם. התאריכים שלהם נגזרים ב-app/sitemap.ts משדות התאריך של התוכן.
 *
 * כשאין git (לא מותקן, לא ריפו) או שהשכפול רדוד: אזהרה, ושרשרת נפילה לכל ראוט:
 * קבוע תאריך מפורש בקוד, אחרת הערך שכבר שמור ב-JSON, אחרת בלי lastmod. אף פעם לא
 * דורסים נתונים טובים בריקים.
 *
 * ריצה אחת של git log במקום קריאה לכל קובץ, כי הריפו על Dropbox ואיטי.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  SHARED_FANOUT_LIMIT,
  closureOf,
  countFanout,
  createImportGraph,
  latestGitDate,
  parseGitLog,
  readStringConstant,
  resolveRouteDate,
  routeFromFile,
  routeSourceFiles,
} from "./sitemap-dates-core.mjs";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, "app");
const OUT = path.join(ROOT, "lib", "data", "sitemap-dates.generated.json");

/**
 * ראוטים דינמיים שמותר להם מפתח משלהם ב-JSON. app/sitemap.ts מתאים אליו את כל
 * הכתובות של הפרמטר. שאר הדינמיים (בלוג, מילון, קטגוריות) לא נכנסים לכאן בכוונה.
 */
const DYNAMIC_ROUTES = ["/online/[category]"];

/** עמודים עם תאריך עדכון מפורש בקוד, לנפילה כשאין תאריך git */
const CONTENT_DATES = {
  "/data/industry-2026": { file: "lib/data/industry-2026.ts", constant: "INDUSTRY_2026_UPDATED_AT" },
  "/data/recording-studio-costs-2026": { file: "lib/data/studio-cost-model.ts", constant: "STUDIO_COST_UPDATED_AT" },
};

const toRel = (file) => path.relative(ROOT, file).split(path.sep).join("/");

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.name === "page.tsx" || e.name === "page.ts") out.push(full);
  }
  return out;
}

/** { available, dates, reason }. לא זורק: חוסר git הוא מצב מוכר ולא קריסה */
function readGitDates() {
  const run = (args) =>
    execFileSync("git", args, {
      cwd: ROOT,
      encoding: "utf8",
      maxBuffer: 256 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"],
    });
  try {
    if (run(["rev-parse", "--is-shallow-repository"]).trim() === "true") {
      return { available: false, reason: "שכפול רדוד (shallow clone), ההיסטוריה חלקית" };
    }
    return {
      available: true,
      dates: parseGitLog(run(["log", "--format=__C__%cI", "--name-only", "--no-renames"])),
    };
  } catch (err) {
    const why = err && err.code === "ENOENT" ? "git לא מותקן" : "זו לא תיקיית git או שהפקודה נכשלה";
    return { available: false, reason: why };
  }
}

function readPreviousDates() {
  try {
    return JSON.parse(fs.readFileSync(OUT, "utf8"));
  } catch {
    return {};
  }
}

function readContentDate(route) {
  const spec = CONTENT_DATES[route];
  if (!spec) return undefined;
  try {
    return readStringConstant(fs.readFileSync(path.join(ROOT, spec.file), "utf8"), spec.constant);
  } catch {
    return undefined;
  }
}

const git = readGitDates();
const previous = readPreviousDates();
const depsOf = createImportGraph(ROOT);

/* כל ה-page.tsx, גם דינמיים, נספרים ב-fan-out: "משותף" נמדד מול כל האתר */
const allPages = walk(APP_DIR);
const closures = new Map(allPages.map((file) => [file, closureOf(file, depsOf)]));
const fanout = countFanout(closures.values());

const routes = {};
const counts = { git: 0, content: 0, previous: 0, none: 0 };

for (const file of allPages) {
  const route = routeFromFile(file, APP_DIR, DYNAMIC_ROUTES);
  if (route === null) continue;
  const sources = routeSourceFiles(file, closures.get(file), fanout, ROOT, SHARED_FANOUT_LIMIT);
  const { date, source } = resolveRouteDate({
    gitDate: git.available ? latestGitDate(sources, git.dates, toRel) : undefined,
    contentDate: readContentDate(route),
    previousDate: previous[route],
  });
  counts[source]++;
  if (date) routes[route] = date;
}

const dated = Object.keys(routes).length;
const total = dated + counts.none;
const coverage = total ? dated / total : 0;

if (!git.available) {
  console.warn(
    `generate:sitemap-dates WARNING -- git לא זמין (${git.reason}).\n` +
      `  נפילה לכל ראוט: קבוע תאריך בקוד (${counts.content}), ערך קודם מה-JSON (${counts.previous}), בלי תאריך (${counts.none}).\n` +
      `  להפקה מלאה: git fetch --unshallow והרצה מחדש.`,
  );
}

/**
 * שומר סף. Vercel משכפל את הריפו רדוד (depth 10) כברירת מחדל, ואז git log
 * מחזיר עשרה קומיטים, כמעט כל ראוט נופל ל-none, והתוצאה היא מפת אתר בלי
 * שום lastmod. זה בדיוק ההפך מהמטרה, והיה קורה בשקט כי הסקריפט רק מדפיס מספר.
 *
 * לכן הקובץ הזה נוצר מקומית עם היסטוריה מלאה ונשמר ב-git, ולא מיוצר מחדש
 * ב-vercel-build. גם בנפילה מ-git, אם הכיסוי הסופי נמוך מדי עדיף להיכשל
 * מאשר לדרוס נתונים טובים בריקים.
 */
const MIN_COVERAGE = 0.8;
if (coverage < MIN_COVERAGE) {
  console.error(
    `generate:sitemap-dates FAILED -- only ${dated}/${total} routes (${Math.round(coverage * 100)}%) have a date.\n` +
      `  Refusing to overwrite ${path.relative(ROOT, OUT)} with sparse data.\n` +
      `  Most likely cause: a shallow clone with no previous JSON. Run with full history (git fetch --unshallow).`,
  );
  process.exit(1);
}

fs.writeFileSync(OUT, JSON.stringify(routes, null, 2) + "\n", "utf8");
console.log(
  `generate:sitemap-dates -- ${dated}/${total} routes dated (${Math.round(coverage * 100)}%): ` +
    `${counts.git} from git, ${counts.content} from content constants, ${counts.previous} kept from previous run` +
    (counts.none ? `, ${counts.none} without a date (not committed yet)` : ""),
);
