/**
 * בדיקת המראה לפני פריסה, מיועדת להרצה על המכונה שממנה מעלים.
 *
 * המטרה: לתפוס את הכשלים שנראים סתומים כשהם קורים בענן, ולהסביר אותם בשפה
 * שאפשר לפעול לפיה. כל ממצא מדפיס גם למה זה קרה וגם מה עושים.
 *
 * הרצה:  node scripts/preflight-deploy.mjs
 * דגלים: --skip-env   לדלג על בדיקת משתני סביבה (למשל בבדיקה מקומית)
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = process.cwd();
const skipEnv = process.argv.includes("--skip-env");
const errors = [];
const warnings = [];

function fail(what, why, fix) {
  errors.push({ what, why, fix });
}
function warn(what, why, fix) {
  warnings.push({ what, why, fix });
}
function git(args) {
  try {
    return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

/* ── 1. esbuild תואם למערכת ההפעלה ──────────────────────────────────────────
   התקלה הכי נפוצה בריפו הזה: node_modules הותקן על מערכת אחרת, ואז tsx,
   npm test ו-next build נופלים בהודעות שלא מזכירות את הסיבה. */
{
  const dir = path.join(ROOT, "node_modules", "@esbuild");
  const installed = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  const platform = os.platform();
  const arch = os.arch();
  const expect =
    platform === "darwin" ? `darwin-${arch === "arm64" ? "arm64" : "x64"}`
    : platform === "linux" ? `linux-${arch === "arm64" ? "arm64" : "x64"}`
    : "win32-x64";
  if (installed.length && !installed.includes(expect)) {
    fail(
      `esbuild מותקן ל-${installed.join(", ")} אבל אתם על ${expect}`,
      "node_modules הועתק ממכונה אחרת (הריפו יושב ב-Dropbox). tsx, npm test, generate:schema ו-next build ייפלו.",
      "rm -rf node_modules && npm ci",
    );
  }
}

/* ── 2. קבצים שהקוד מייבא אבל git לא מכיר ───────────────────────────────────
   build על עותק נקי נופל ב-Module not found, בלי רמז שהקובץ פשוט לא נדחף. */
{
  const untracked = (git(["ls-files", "--others", "--exclude-standard"]) ?? "")
    .split("\n")
    .filter(Boolean);
  const tracked = new Set((git(["ls-files"]) ?? "").split("\n").filter(Boolean));

  const sourceFiles = [];
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (["node_modules", ".next", ".git"].includes(e.name)) continue;
        walk(full);
      } else if (/\.(tsx?|mjs)$/.test(e.name)) sourceFiles.push(full);
    }
  };
  ["app", "lib", "components", "hooks", "scripts"].forEach((d) =>
    walk(path.join(ROOT, d)),
  );

  const corpus = sourceFiles
    .filter((f) => tracked.has(path.relative(ROOT, f).split(path.sep).join("/")))
    .map((f) => fs.readFileSync(f, "utf8"))
    .join("\n");

  for (const file of untracked) {
    if (!/\.(tsx?|mjs|json)$/.test(file)) continue;
    const base = path.basename(file).replace(/\.(tsx?|mjs|json)$/, "");
    const importPath = file.replace(/^(app|lib|components|hooks)\//, "@/$1/").replace(/\.(tsx?)$/, "");
    if (corpus.includes(`@/${file.replace(/\.(tsx?|json)$/, "")}`) || corpus.includes(importPath)) {
      fail(
        `${file} לא ב-git, אבל קוד ש-git כן מכיר מייבא אותו`,
        "בעותק נקי (וגם ב-Vercel) הקובץ פשוט לא קיים, וה-build נופל ב-Module not found בלי לרמוז שהסיבה היא git.",
        `git add ${file}`,
      );
    } else if (base.includes(".generated") || file.includes(".generated.")) {
      fail(
        `${file} הוא קובץ generated שאינו ב-git`,
        "שאר קבצי ה-generated באתר כן נשמרים ב-git, ו-app/sitemap.ts מייבא אותו סטטית.",
        `git add ${file}`,
      );
    }
  }
}

/* ── 2ב. סקריפטים ש-package.json מריץ אבל git לא מכיר ───────────────────────
   בדיקה 2 הולכת לפי גרף הייבוא, ולכן היא לא רואה סקריפט שמופעל רק כפקודה.
   קובץ כזה שנשכח מחוץ ל-commit מפיל את הפריסה ב-"Cannot find module", בשלב
   שנראה כמו תקלת npm ולא כמו קובץ חסר. */
{
  const tracked = new Set((git(["ls-files"]) ?? "").split("\n").filter(Boolean));
  const pkgPath = path.join(ROOT, "package.json");
  if (fs.existsSync(pkgPath) && tracked.size) {
    const scripts = JSON.parse(fs.readFileSync(pkgPath, "utf8")).scripts ?? {};
    const missing = new Map();
    for (const [name, cmd] of Object.entries(scripts)) {
      if (typeof cmd !== "string") continue;
      for (const m of cmd.matchAll(/(?:^|[\s"'])((?:scripts|lib|app|components|hooks)\/[\w./-]+\.(?:mjs|cjs|tsx|ts|jsx|js))/g)) {
        const rel = m[1];
        if (!fs.existsSync(path.join(ROOT, rel))) {
          missing.set(rel, { name, reason: "לא קיים על הדיסק בכלל" });
        } else if (!tracked.has(rel)) {
          missing.set(rel, { name, reason: "קיים מקומית אבל לא ב-git" });
        }
      }
    }
    for (const [rel, info] of missing) {
      fail(
        `${rel} מופעל על ידי npm run ${info.name}, ${info.reason}`,
        "הפקודה תיפול על מכונת הפריסה ב-Cannot find module, וההודעה תיראה כמו תקלת npm ולא כמו קובץ שלא נדחף.",
        `git add ${rel}`,
      );
    }
  }
}

/* ── 2ג. נכסים ב-public שהקוד מפנה אליהם אבל git לא מכיר ────────────────────
   בדיקות 2 ו-2ב מכסות מודולים ופקודות. נכס סטטי נופל בין הכיסאות: הוא קיים
   על המכונה המקומית, ה-build עובר, ובפרודקשן הוא מחזיר 404 בשקט. שני קבצי
   האודיו של השוואת הקריינות היו בדיוק במצב הזה, וגם קובץ מפתח IndexNow החדש
   בזמן שהישן כבר נמחק. */
{
  const tracked = new Set((git(["ls-files"]) ?? "").split("\n").filter(Boolean));
  const untracked = (git(["ls-files", "--others", "--exclude-standard", "public"]) ?? "")
    .split("\n")
    .filter(Boolean);

  if (untracked.length && tracked.size) {
    const sources = [];
    const walk = (dir) => {
      if (!fs.existsSync(dir)) return;
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) {
          if (["node_modules", ".next", ".git"].includes(e.name)) continue;
          walk(full);
        } else if (/\.(tsx?|mjs|json|css)$/.test(e.name)) sources.push(full);
      }
    };
    ["app", "lib", "components", "hooks", "scripts"].forEach((d) => walk(path.join(ROOT, d)));
    const corpus = sources.map((f) => fs.readFileSync(f, "utf8")).join("\n");

    for (const rel of untracked) {
      /* הנתיב כפי שהדפדפן מבקש אותו: public/audio/x.mp3 -> /audio/x.mp3 */
      const publicPath = rel.replace(/^public/, "");
      const base = path.basename(rel);
      /* מחפשים גם את הנתיב המלא וגם את שם הקובץ, כי חלק מהנתיבים מורכבים
         בזמן ריצה ממחרוזות חלקיות. */
      if (!corpus.includes(publicPath) && !corpus.includes(base)) continue;
      fail(
        `${rel} לא ב-git, אבל קוד באתר מפנה אל ${publicPath}`,
        "ה-build יעבור, ובפרודקשן הנכס יחזיר 404 בלי שום שגיאה בלוג. נגן או תמונה שבורים בעמוד חי.\n     הקורפוס כאן כולל גם קוד שעדיין לא ב-git, כי הוא ייכנס לאותו commit.",
        `git add "${rel}"`,
      );
    }
  }
}

/* ── 3. מפתח IndexNow תואם בין הקוד לקובץ הציבורי ──────────────────────────── */
{
  const routeFile = path.join(ROOT, "app/api/indexnow/route.ts");
  if (fs.existsSync(routeFile)) {
    const key = fs.readFileSync(routeFile, "utf8").match(/INDEXNOW_KEY\s*=\s*"([0-9a-f]+)"/)?.[1];
    if (key) {
      const pub = path.join(ROOT, "public", `${key}.txt`);
      const keyRel = `public/${key}.txt`;
      if (fs.existsSync(pub) && !new Set((git(["ls-files"]) ?? "").split("\n")).has(keyRel)) {
        fail(
          `${keyRel} קיים מקומית אבל לא ב-git`,
          "IndexNow מאמת בעלות מול הקובץ הזה. אם הוא לא נדחף, כל הגשה נדחית, והמפתח הישן כבר נמחק.",
          `git add ${keyRel}`,
        );
      }
      if (!fs.existsSync(pub)) {
        fail(
          `public/${key}.txt חסר`,
          "IndexNow מאמת בעלות מול קובץ בשם המפתח. בלעדיו כל הגשה נדחית.",
          `echo -n ${key} > public/${key}.txt`,
        );
      } else if (fs.readFileSync(pub, "utf8").trim() !== key) {
        fail(`public/${key}.txt לא מכיל את המפתח`, "התוכן חייב להיות המפתח עצמו.", `echo -n ${key} > public/${key}.txt`);
      }
      const stale = fs.readdirSync(path.join(ROOT, "public"))
        .filter((f) => /^[0-9a-f]{32}\.txt$/.test(f) && f !== `${key}.txt`);
      if (stale.length) {
        warn(`מפתחות IndexNow ישנים ב-public: ${stale.join(", ")}`, "לא מזיק, אבל מבלבל.", "למחוק אותם");
      }
    }
  }
}

/* ── 4. תאריכי מפת האתר קיימים ולא ריקים ───────────────────────────────────── */
{
  const f = path.join(ROOT, "lib/data/sitemap-dates.generated.json");
  if (!fs.existsSync(f)) {
    fail(
      "lib/data/sitemap-dates.generated.json חסר",
      "app/sitemap.ts מייבא אותו סטטית, ולכן ה-build ייפול.",
      "npm run generate:sitemap-dates",
    );
  } else {
    const n = Object.keys(JSON.parse(fs.readFileSync(f, "utf8"))).length;
    if (n < 100) {
      fail(
        `מפת התאריכים מכילה ${n} ראוטים בלבד`,
        "כנראה נוצרה על שכפול רדוד של git. התוצאה היא מפת אתר כמעט בלי lastmod.",
        "git fetch --unshallow && npm run generate:sitemap-dates",
      );
    }
  }
}

/* ── 5. משתני סביבה נדרשים ──────────────────────────────────────────────────
   נבדק מול .env.local אם קיים, אחרת מול הסביבה. שמות בלבד, אף פעם לא ערכים. */
if (!skipEnv) {
  const REQUIRED = {
    RESEND_API_KEY: "שליחת מיילים ללידים. בלעדיו כל ליד נכשל בשקט.",
    LEAD_NOTIFY_EMAIL: "לאן נשלחת התראת הליד.",
    RESEND_FROM_EMAIL: "כתובת השולח המאומתת.",
    UPSTASH_REDIS_REST_URL: "אחסון לידים ו-rate limit. בלעדיו רץ על זיכרון ונמחק בכל deploy.",
    UPSTASH_REDIS_REST_TOKEN: "כנ״ל.",
    CRON_SECRET: "מאבטח את הקרונים ואת IndexNow.",
    ADMIN_LEADS_TOKEN: "כניסה ל-/admin/leads.",
  };
  const envLocal = path.join(ROOT, ".env.local");
  const fileVars = fs.existsSync(envLocal)
    ? new Set(
        fs.readFileSync(envLocal, "utf8")
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l && !l.startsWith("#"))
          .map((l) => l.split("=")[0].trim()),
      )
    : new Set();

  for (const [name, why] of Object.entries(REQUIRED)) {
    if (!fileVars.has(name) && !process.env[name]) {
      warn(`${name} לא מוגדר`, why, "להגדיר ב-.env.local מקומית, ובמשתני הסביבה של הפלטפורמה לפרודקשן");
    }
  }
}

/* ── 6. גרסת Node ───────────────────────────────────────────────────────────── */
{
  const major = Number(process.versions.node.split(".")[0]);
  if (major < 20) {
    fail(`Node ${process.versions.node}`, "הפרויקט דורש Node 20 ומעלה.", "לעדכן Node");
  }
}

/* ── דוח ────────────────────────────────────────────────────────────────────── */
console.log("=== preflight-deploy ===\n");

if (warnings.length) {
  console.log(`אזהרות (${warnings.length}) - לא חוסמות:\n`);
  for (const w of warnings) {
    console.log(`  ⚠ ${w.what}`);
    console.log(`     למה:  ${w.why}`);
    console.log(`     תיקון: ${w.fix}\n`);
  }
}

if (errors.length) {
  console.error(`חוסמים (${errors.length}):\n`);
  for (const e of errors) {
    console.error(`  ✗ ${e.what}`);
    console.error(`     למה:  ${e.why}`);
    console.error(`     תיקון: ${e.fix}\n`);
  }
  process.exit(1);
}

console.log("תקין. אין חוסמים לפריסה.");
