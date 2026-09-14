/**
 * audit-lighthouse.mjs - מדידת Lighthouse נייד על חמש תבניות, עם בסיס להשוואה.
 *
 * למה סקריפט ולא הרצה ידנית: מדידה שאי אפשר לחזור עליה בדיוק אינה ראיה.
 * שלושה דברים חייבים להיות קבועים בין הרצה להרצה, ולכן הם קשיחים כאן:
 * גרסת Lighthouse, שיטת ה-throttling, ובינארי הדפדפן.
 *
 * למה חציון של שלוש הרצות: Lighthouse רועש. אותו עמוד על אותה מכונה
 * יכול לזוז בכמה נקודות בין הרצה להרצה. הרצה בודדת תייצר "רגרסיה"
 * שאינה קיימת, או תסתיר רגרסיה אמיתית.
 *
 * למה חציון של הרצה שלמה ולא חציון לכל מדד בנפרד: חציון לכל מדד בנפרד
 * מרכיב דוח מארבע הרצות שונות, כלומר מתאר מצב שלא קרה. כאן נבחרת
 * ההרצה שציון הביצועים שלה באמצע, וכל המדדים מדווחים ממנה.
 *
 * מה זה לא: זו מדידת מעבדה על localhost, לא נתוני שדה. היא תקפה
 * להשוואת לפני ואחרי על אותה מכונה, ואינה מנבאת את Core Web Vitals
 * שגוגל רואה ממשתמשים אמיתיים. לאלה יש מקור אחד: Search Console.
 *
 * שימוש:
 *   node scripts/audit-lighthouse.mjs --base    לכידת בסיס
 *   node scripts/audit-lighthouse.mjs           השוואה מול הבסיס
 *   --port=3210                                 יציאת השרת (ברירת מחדל 3210)
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

import { LIGHTHOUSE_PAGES } from "./template-pages.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASELINE = join(ROOT, "scripts", "baselines", "lighthouse.json");

/** נעול בכוונה. שדרוג גרסה משנה ניקוד ופוסל השוואה לבסיס קיים. */
const LH_VERSION = "13.4.1";
const RUNS = 3;

/** סובלנות לרעש. ציון ביצועים זז בין הרצות גם בלי שינוי קוד. */
const TOLERANCE = {
  performance: 3, // נקודות
  seo: 0,
  accessibility: 0,
  "best-practices": 2,
  cls: 0.01,
};

const args = process.argv.slice(2);
const isBase = args.includes("--base");
const portArg = args.find((a) => a.startsWith("--port="));
const PORT = portArg ? portArg.slice("--port=".length) : process.env.LH_PORT || "3210";
const ORIGIN = `http://localhost:${PORT}`;

const chromePath =
  process.env.CHROME_PATH ||
  join(
    process.env.HOME || "",
    "Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64",
    "Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
  );

if (!existsSync(chromePath)) {
  console.error("  ✗ לא נמצא בינארי כרום ב-" + chromePath);
  console.error("  הגדר CHROME_PATH, או התקן את הדפדפן של playwright.");
  process.exit(1);
}

function buildId() {
  try {
    return readFileSync(join(ROOT, ".next", "BUILD_ID"), "utf8").trim();
  } catch {
    return "unknown";
  }
}

function serverUp() {
  try {
    execFileSync("curl", ["-sf", "-o", "/dev/null", "--max-time", "10", ORIGIN + "/"]);
    return true;
  } catch {
    return false;
  }
}

/**
 * הרצה אחת, עם ניסיון שני.
 *
 * למה ניסיון שני: הרצה נכשלה פעם אחת על /book בזמן לכידת הבסיס, ואותו
 * עמוד עבר מיד אחר כך בהרצה ידנית זהה. שיגור כרום נכשל לפעמים מסיבות
 * שאינן קשורות לעמוד. כישלון חוזר על אותו עמוד כן אומר משהו, והוא עוצר.
 *
 * למה stderr נשמר ומודפס: בגרסה הראשונה הוא נבלע, וכשההרצה נכשלה
 * לא נשארה שום אינדיקציה למה. מדידה שנכשלת בלי להסביר אינה מדידה.
 */
function runOnce(url, outFile, attempt = 1) {
  try {
    execFileSync(
      "npx",
      [
        "-y",
        `lighthouse@${LH_VERSION}`,
        url,
        "--only-categories=performance,seo,accessibility,best-practices",
        "--throttling-method=devtools",
        "--form-factor=mobile",
        "--output=json",
        `--output-path=${outFile}`,
        "--chrome-flags=--headless=new --no-sandbox --disable-gpu",
        "--quiet",
      ],
      { env: { ...process.env, CHROME_PATH: chromePath }, stdio: ["ignore", "ignore", "pipe"] },
    );
  } catch (error) {
    const stderr = (error.stderr?.toString() || error.message || "").trim().split("\n").slice(-6);
    if (attempt === 1) {
      process.stdout.write("r");
      return runOnce(url, outFile, 2);
    }
    console.error("\n  ✗ Lighthouse נכשל פעמיים על " + url);
    for (const line of stderr) console.error("    " + line);
    process.exit(1);
  }

  const r = JSON.parse(readFileSync(outFile, "utf8"));
  const cat = (k) => Math.round((r.categories[k]?.score ?? 0) * 100);
  const num = (k) => r.audits[k]?.numericValue ?? null;

  return {
    performance: cat("performance"),
    seo: cat("seo"),
    accessibility: cat("accessibility"),
    "best-practices": cat("best-practices"),
    lcp: Math.round(num("largest-contentful-paint") ?? 0),
    fcp: Math.round(num("first-contentful-paint") ?? 0),
    tbt: Math.round(num("total-blocking-time") ?? 0),
    cls: Number((num("cumulative-layout-shift") ?? 0).toFixed(3)),
    si: Math.round(num("speed-index") ?? 0),
  };
}

/** ההרצה שציון הביצועים שלה באמצע. כל המדדים מגיעים ממנה, לא מתערובת. */
function medianRun(runs) {
  const sorted = [...runs].sort((a, b) => a.performance - b.performance || a.lcp - b.lcp);
  return sorted[Math.floor(sorted.length / 2)];
}

function measure() {
  const tmp = join(tmpdir(), `lh-${process.pid}`);
  mkdirSync(tmp, { recursive: true });
  const pages = {};

  for (const page of LIGHTHOUSE_PAGES) {
    const url = ORIGIN + page.path;
    process.stdout.write(`  ${page.path} `);
    const runs = [];
    for (let i = 0; i < RUNS; i += 1) {
      runs.push(runOnce(url, join(tmp, `run-${i}.json`)));
      process.stdout.write(".");
    }
    const median = medianRun(runs);
    pages[page.path] = { ...median, runs: runs.map((r) => r.performance) };
    process.stdout.write(
      ` perf ${median.performance} · seo ${median.seo} · a11y ${median.accessibility}` +
        ` · LCP ${(median.lcp / 1000).toFixed(1)}s · CLS ${median.cls}\n`,
    );
  }

  rmSync(tmp, { recursive: true, force: true });
  return pages;
}

function report(pages) {
  return {
    _doc:
      "בסיס Lighthouse נייד. נלכד מקומית מול next start, devtools throttling, " +
      "חציון שלוש הרצות. מדידת מעבדה, לא נתוני שדה.",
    lighthouseVersion: LH_VERSION,
    throttling: "devtools",
    formFactor: "mobile",
    runs: RUNS,
    buildId: buildId(),
    capturedAt: new Date().toISOString(),
    pages,
  };
}

console.log("Lighthouse נייד, " + LIGHTHOUSE_PAGES.length + " תבניות, " + RUNS + " הרצות לכל אחת");
console.log("  שרת: " + ORIGIN + " · בנייה: " + buildId());

if (!serverUp()) {
  console.error("  ✗ אין שרת ב-" + ORIGIN + ". הרץ `npx next start -p " + PORT + "` תחילה.");
  process.exit(1);
}

const pages = measure();

if (isBase) {
  mkdirSync(dirname(BASELINE), { recursive: true });
  writeFileSync(BASELINE, JSON.stringify(report(pages), null, 2) + "\n");
  console.log("\n  ✓ בסיס נכתב ל-" + BASELINE.replace(ROOT + "/", ""));
  process.exit(0);
}

if (!existsSync(BASELINE)) {
  console.error("\n  ✗ אין בסיס ב-" + BASELINE);
  console.error("  בלי בסיס אין מול מה להשוות, ולכן זו שגיאה ולא דילוג.");
  process.exit(1);
}

const base = JSON.parse(readFileSync(BASELINE, "utf8"));

if (base.lighthouseVersion !== LH_VERSION) {
  console.error(
    `\n  ✗ הבסיס נלכד ב-Lighthouse ${base.lighthouseVersion} והמדידה ב-${LH_VERSION}.`,
  );
  console.error("  ניקוד בין גרסאות אינו בר-השוואה. לכוד בסיס מחדש.");
  process.exit(1);
}

const problems = [];
for (const [path, now] of Object.entries(pages)) {
  const was = base.pages[path];
  if (!was) {
    problems.push(`${path} · עמוד חדש שאינו בבסיס`);
    continue;
  }
  /* הפיזור של שתי המדידות נכנס להודעה. בלעדיו אי אפשר להבחין בין רגרסיה
     אמיתית לבין מכונה עמוסה: ירידה של שבע נקודות כשהפיזור הוא נקודה אחת
     היא אות, ואותה ירידה כשהפיזור הוא שמונה היא רעש. */
  const spread = (runs) =>
    Array.isArray(runs) && runs.length ? `${Math.min(...runs)}-${Math.max(...runs)}` : "לא ידוע";

  for (const key of ["performance", "seo", "accessibility", "best-practices"]) {
    const drop = was[key] - now[key];
    if (drop > TOLERANCE[key]) {
      problems.push(
        `${path} · ${key}: ${was[key]} -> ${now[key]} (ירידה של ${drop})` +
          (key === "performance"
            ? ` · פיזור בבסיס ${spread(was.runs)}, פיזור עכשיו ${spread(now.runs)}`
            : ""),
      );
    }
  }
  const clsRise = now.cls - was.cls;
  if (clsRise > TOLERANCE.cls) {
    problems.push(`${path} · CLS: ${was.cls} -> ${now.cls}`);
  }
}

console.log("\n  בסיס מבנייה " + base.buildId + ", נלכד " + base.capturedAt.slice(0, 10));

if (problems.length > 0) {
  console.error("\n  ✗ " + problems.length + " ירידות מעבר לסובלנות הרעש:");
  for (const p of problems) console.error("    " + p);
  process.exit(1);
}

console.log("  ✓ אין ירידה מעבר לסובלנות הרעש בחמש התבניות.");
