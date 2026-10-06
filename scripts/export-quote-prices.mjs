/**
 * export:quote - המחירים ב-quote.html (מחולל ההצעות המקומי במק) מגיעים מהקטלוג באתר.
 *
 * למה (תוכנית עמדת המכירות, 6.10.2026, סעיף 7): quote.html קורא את המחירים
 * מ-prices.js. הקובץ נוצר עד היום מ-docs/מחירון.json במערכת המקומית, ולא עודכן
 * מאז 2.9.2026, בזמן שהקטלוג באתר השתנה עשרות פעמים. כך ההצעה הרשמית ששולחים
 * ללקוח סתרה את המחיר באתר. הסקריפט כותב את prices.js מהקטלוג, באותו מבנה
 * ובאותם מפתחות, כדי ש-quote.html (ו-index.js, vocal-engine.js שקוראים את אותו
 * קובץ) ימשיכו לעבוד בלי שינוי.
 *
 * מקור המספרים: docs/pricing-export.json, שנוצר ב-npm run export:pricing מ-
 * lib/data/pricing-catalog.ts עם catalogWithVat, בדיוק כמו באתר. לפני הקריאה
 * רץ audit:pricing-export, כך שקובץ ייצוא שהתיישן לא נכנס להצעות.
 *
 * מפתח בלי מקביל ברור בקטלוג נשאר עם הערך הקיים ומסומן "UNMAPPED - ask Yakir",
 * גם בפלט וגם בשורת הכותרת של prices.js. לא מנחשים מחיר.
 *
 * שומרים:
 *  - כותב רק כש-lib/data/pricing-catalog.ts זהה בבייטים ל-origin/main. ענף עם
 *    מחיר שעוד לא נפרס, או עותק ישן, לא דורס את המחירים של ההצעות.
 *    origin/main הוא מה שהיה ב-git fetch האחרון, והפלט מציג את הקומיט.
 *  - כותב רק אם תיקיית היעד קיימת, ולא יוצר אותה (CI, מכונה בלי המערכת המקומית).
 *
 * שימוש:
 *   npm run export:quote                               כותב את prices.js
 *   node scripts/export-quote-prices.mjs --dry-run     מציג מה ישתנה, לא כותב כלום
 *
 * אחרי כתיבה: npm run audit:quote-sync משווה את ה-hash בכותרת לקטלוג.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CATALOG_REL = "lib/data/pricing-catalog.ts";
const CATALOG_FILE = path.join(ROOT, CATALOG_REL);
const EXPORT_FILE = path.join(ROOT, "docs", "pricing-export.json");
const TARGET_DIR = path.join(os.homedir(), "Documents", "yakircohen-ai-local", "ui_interface");
const TARGET_FILE = path.join(TARGET_DIR, "prices.js");
const DRY_RUN = process.argv.includes("--dry-run");

/* scripts/audit-quote-sync.mjs קורא את ה-hash מהשורה הזו באותו ביטוי. לשנות את שניהם יחד. */
const HASH_LINE_RE = /catalog contentHash: ([0-9a-f]{16})/;

/*
 * מפתח ב-prices.js ← מזהה בקטלוג. vat: "ex" = לפני מע״מ (quote.html מוסיף מע״מ
 * על הסך), "incl" = כולל מע״מ (רק במפתחות ששמם נגמר ב-_incl_vat).
 * התוויות בהערות הן מ-docs/מחירון.json במערכת המקומית, שממנו נוצר הקובץ הישן.
 * כל מפתח שלא כאן נשאר עם הערך הקיים ומדווח כ-UNMAPPED.
 */
const MAP = {
  official: {
    /* "הקלטה בלבד (חצי שעה)". ב-quote.html: סשן עד כחצי שעה, קובץ גולמי, בלי
       עריכה ומיקס. בקטלוג: "חצי שעה באולפן", חדר בלי עריכה. */
    recording: { id: "studio_half_hour", vat: "ex" },
    /* "הפקת פודקאסט אודיו מלאה (לפרק)". אותו מזהה בקטלוג. */
    podcast_audio: { id: "podcast_audio", vat: "ex" },
    /* "פודקאסט וידאו / פרימיום". אותו מזהה בקטלוג. */
    podcast_video: { id: "podcast_video", vat: "ex" },
    /* "ברכה קצרה". בקטלוג: "ברכה / אמירה". */
    blessing: { id: "blessing_recording", vat: "ex" },
    /* "שיר מוכן". בקטלוג: "הקלטת שיר באולפן". התוכנית (סעיף 7): אחרי הסנכרון
       שיר ב-quote.html מופיע במחיר הקטלוג ולא במחיר הישן. */
    song: { id: "song_recording", vat: "ex" },
    /* "DJ ואירועים (החל מ)" (dj): בכוונה בלי מיפוי, ולכן מסומן UNMAPPED ליקיר.
       המחיר הישן נמחק ואין לו מוצר (scripts/audit-price-literals.mjs:7-8), אבל
       גם dj_premium לא מתאים: באותה חבילה ב-quote.html שורת "לא כלול" מציינת את
       "מסלול צוות" (dj_team_incl_vat, שהוא dj_premium) כמסלול נפרד, וההצעה
       הייתה סותרת את עצמה. מה החבילה הזו מוכרת היום זו שאלה ליקיר, לא ניחוש. */
    /* "אירוע מסלול צוות (כולל מע״מ)". בקטלוג: "תקליטן פרימיום מהצוות". */
    dj_team_incl_vat: { id: "dj_premium", vat: "incl" },
    /* "אירוע מסלול אישי (כולל מע״מ)". בקטלוג: "תקליטן יקיר כהן אישית".
       בקובץ הישן נרשם כ"כולל מע״מ" אותו מספר שבקטלוג הוא המחיר לפני מע״מ. */
    dj_personal_incl_vat: { id: "dj_yakir_personal", vat: "incl" },
  },
  /* הערכות "החל מ" לתוספות. לא מוצרים בקטלוג, ולכן בכוונה בלי מיפוי. */
  estimates: {},
  proposed: {},
};

function fail(lines) {
  for (const line of lines) console.error(line);
  console.error("");
  process.exit(1);
}

/* אותו שומר כמו ב-CI: אם docs/pricing-export.json לא תואם לקטלוג, עוצרים. */
function assertExportFresh() {
  const res = spawnSync(
    process.execPath,
    ["--import", "tsx", path.join("scripts", "export-pricing.ts"), "--check"],
    { cwd: ROOT, encoding: "utf8" },
  );
  if (res.status !== 0) {
    fail([
      "  ✗ docs/pricing-export.json לא תואם לקטלוג, ולכן לא מייצאים ממנו.",
      (res.stderr || res.stdout || String(res.error || "")).trim(),
      "    תיקון: npm run export:pricing, ואז להריץ שוב.",
    ]);
  }
}

function git(args) {
  return execFileSync("git", args, {
    cwd: ROOT,
    maxBuffer: 64 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function catalogGuard() {
  let mainBuf;
  let mainRef = "?";
  try {
    mainBuf = git(["show", `origin/main:${CATALOG_REL}`]);
    mainRef = git(["log", "-1", "--format=%h %cs", "origin/main"]).toString().trim();
  } catch (err) {
    return { ok: false, mainRef, why: `git show origin/main נכשל: ${String(err.message).split("\n")[0]}` };
  }
  const localBuf = fs.readFileSync(CATALOG_FILE);
  if (!localBuf.equals(mainBuf)) {
    return {
      ok: false,
      mainRef,
      why: `${CATALOG_REL} בעותק הזה שונה מ-origin/main. מייצאים רק מעותק שמסונכרן עם main (git pull), ורק אחרי שהשינוי נפרס.`,
    };
  }
  return { ok: true, mainRef };
}

/* prices.js הישן נכתב ב-json.dumps, ולכן האובייקט הוא JSON תקין. קוראים אותו
   כ-JSON ולא מריצים אותו. */
function parsePricesJs(text) {
  const m = text.match(/window\.YAKIR_PRICES\s*=\s*(\{[\s\S]*\})\s*;?\s*$/);
  if (!m) throw new Error("לא נמצא window.YAKIR_PRICES = {...} בקובץ");
  return JSON.parse(m[1]);
}

function readCurrent() {
  if (!fs.existsSync(TARGET_FILE)) return null;
  try {
    return parsePricesJs(fs.readFileSync(TARGET_FILE, "utf8"));
  } catch (err) {
    fail([`  ✗ ${TARGET_FILE} לא נקרא: ${err.message}`]);
  }
  return null;
}

function today() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function buildNext(current, exportDoc) {
  const byId = new Map(exportDoc.items.map((item) => [item.id, item]));
  const rows = [];
  const next = {
    updated: today(),
    vat: exportDoc.vatRate,
    official: {},
    estimates: {},
    proposed: {},
  };

  for (const section of ["official", "estimates", "proposed"]) {
    const currentSection = current?.[section] ?? {};
    const sectionMap = MAP[section] ?? {};
    /* סדר המפתחות נשמר כמו בקובץ הקיים, ומפתח ממופה שחסר בו נוסף בסוף. */
    const keys = [
      ...Object.keys(currentSection),
      ...Object.keys(sectionMap).filter((k) => !(k in currentSection)),
    ];
    for (const key of keys) {
      const oldValue = currentSection[key];
      const entry = sectionMap[key];
      if (!entry) {
        next[section][key] = oldValue;
        rows.push({ key: `${section}.${key}`, status: "unmapped", oldValue, newValue: oldValue });
        continue;
      }
      const item = byId.get(entry.id);
      if (!item) {
        fail([
          `  ✗ במיפוי, ${section}.${key} מצביע על "${entry.id}", שלא קיים בקטלוג.`,
          "    תיקון: לעדכן את MAP ב-scripts/export-quote-prices.mjs למזהה הנכון.",
        ]);
      }
      const newValue = entry.vat === "incl" ? item.inclVat : item.exVat;
      next[section][key] = newValue;
      rows.push({
        key: `${section}.${key}`,
        status: oldValue === newValue ? "same" : "changed",
        oldValue,
        newValue,
        id: entry.id,
        vat: entry.vat,
        priceFrom: item.priceFrom,
      });
    }
  }
  return { next, rows };
}

function render(next, contentHash, rows) {
  const unmapped = rows.filter((r) => r.status === "unmapped").map((r) => r.key);
  const lines = [
    "// נוצר אוטומטית מהקטלוג באתר (lib/data/pricing-catalog.ts) על ידי npm run export:quote בריפו yakircohen-site. לא לערוך ידנית.",
    `// עודכן: ${next.updated} · catalog contentHash: ${contentHash}`,
  ];
  if (unmapped.length) {
    lines.push(
      `// UNMAPPED - ask Yakir (אין מקביל בקטלוג, נשאר הערך מהקובץ הקודם): ${unmapped.join(", ")}`,
    );
  }
  lines.push(`window.YAKIR_PRICES = ${JSON.stringify(next, null, 2)};`);
  return `${lines.join("\n")}\n`;
}

function fmt(value) {
  return value === undefined ? "(אין)" : String(value);
}

function printReport(rows, contentHash, guard) {
  const changed = rows.filter((r) => r.status === "changed");
  const same = rows.filter((r) => r.status === "same");
  const unmapped = rows.filter((r) => r.status === "unmapped");
  const pad = Math.max(...rows.map((r) => r.key.length), 10) + 2;
  const vatLabel = (r) => (r.vat === "incl" ? "כולל מע״מ" : "לפני מע״מ");

  console.log(`יעד: ${TARGET_FILE}`);
  console.log(`קטלוג: hash ${contentHash} (docs/pricing-export.json, תואם לקטלוג)`);
  console.log(
    `origin/main: ${guard.mainRef} · ${CATALOG_REL} זהה: ${guard.ok ? "כן" : `לא. ${guard.why}`}\n`,
  );

  console.log(`ישתנה (${changed.length}):`);
  for (const r of changed) {
    console.log(
      `  ${r.key.padEnd(pad)}${fmt(r.oldValue)} → ${fmt(r.newValue)}   ${r.id} (${vatLabel(r)}${r.priceFrom ? ", מחיר התחלה" : ""})`,
    );
  }
  console.log(`\nללא שינוי (${same.length}):`);
  for (const r of same) {
    console.log(`  ${r.key.padEnd(pad)}${fmt(r.newValue)}   ${r.id} (${vatLabel(r)})`);
  }
  console.log(`\nUNMAPPED - ask Yakir (${unmapped.length}), נשאר הערך הקיים:`);
  for (const r of unmapped) {
    console.log(`  ${r.key.padEnd(pad)}${fmt(r.oldValue)}`);
  }
  console.log("");
}

console.log(`=== export:quote${DRY_RUN ? " (dry-run)" : ""} ===\n`);

if (!fs.existsSync(TARGET_DIR)) {
  const msg = [
    `  ✗ תיקיית היעד לא קיימת: ${TARGET_DIR}`,
    "    הסקריפט רץ רק במק שבו המערכת המקומית (yakircohen-ai-local) קיימת. לא יוצרים אותה.",
  ];
  if (DRY_RUN) {
    for (const line of msg) console.warn(line);
    console.warn("");
    process.exit(0);
  }
  fail(msg);
}

assertExportFresh();
const exportDoc = JSON.parse(fs.readFileSync(EXPORT_FILE, "utf8"));
const guard = catalogGuard();
const current = readCurrent();
if (!current) console.warn(`  ⚠ ${TARGET_FILE} לא קיים. ייכתבו רק המפתחות שבמיפוי.\n`);

const { next, rows } = buildNext(current, exportDoc);
if (current && current.vat !== next.vat) {
  console.log(`vat: ${fmt(current.vat)} → ${next.vat}\n`);
}
const output = render(next, exportDoc.contentHash, rows);

/* בדיקה עצמית: הפלט נקרא בחזרה באותו פרסר, וה-hash בכותרת נמצא. */
const roundTrip = parsePricesJs(output);
if (JSON.stringify(roundTrip) !== JSON.stringify(next) || !HASH_LINE_RE.test(output)) {
  fail(["  ✗ הפלט שנבנה לא נקרא בחזרה כמו שצריך. לא נכתב כלום."]);
}

printReport(rows, exportDoc.contentHash, guard);

if (DRY_RUN) {
  console.log(
    guard.ok
      ? "--dry-run: לא נכתב כלום. בלי --dry-run הקובץ ייכתב."
      : "--dry-run: לא נכתב כלום. בלי --dry-run הכתיבה תיחסם (ראו origin/main למעלה).",
  );
  process.exit(0);
}

if (!guard.ok) {
  fail([`  ✗ לא נכתב. ${guard.why}`]);
}

/* כתיבה לקובץ זמני ואז החלפה, כדי ש-quote.html פתוח לא יקרא חצי קובץ. */
const tmp = `${TARGET_FILE}.tmp-${process.pid}`;
fs.writeFileSync(tmp, output, "utf8");
fs.renameSync(tmp, TARGET_FILE);
console.log(`נכתב ${TARGET_FILE} (hash ${exportDoc.contentHash}).`);
console.log("לבדיקה: npm run audit:quote-sync, ואז לרענן את quote.html בדפדפן.");
