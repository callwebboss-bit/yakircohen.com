/**
 * audit:prose-price-backing - כל מחיר בפרוזה חייב מקור בקטלוג.
 *
 * למה זה קיים, ולמה בנפרד מ-audit:prose-prices:
 * הכותרת של audit:prose-prices מצהירה במפורש על הפער הזה, "מחיר פרוזה
 * חדש שמעולם לא היה בקטלוג". הוא משווה מול ענף הבסיס ותופס מחיר שפרש,
 * ולכן מחיר שיושב בפרוזה מההתחלה בלי גיבוי עובר מתחתיו לנצח.
 *
 * שתי תקלות אמיתיות שהפער הזה איפשר, שתיהן נמצאו ב-2.10.2026:
 *  1. שני פוסטי מיקס פרסמו מחירים סותרים לאותו שירות, 1,750 ₪ מול
 *     טווח 500 עד 1,400 ₪. גוגל הציג את שניהם.
 *  2. מחירי הקריינות 450 ו-750 הופיעו בפוסטים ובעמודי השירות ולא היו
 *     בקטלוג כלל, ולכן לא ב-JSON-LD ולא ב-llms.txt. מי שחיפש מחיר
 *     קריינות קיבל מחירי אולפן.
 *
 * למה זה מקדם את כל השירותים: כל שירות באתר מתומחר. שער שמוודא שכל
 * מחיר בפרוזה מגובה במקור אמת מגן על אולפן, DJ, פודקאסט, קריינות,
 * צילום ואטרקציות באותה פעולה.
 *
 * מה נחשב מגובה: הערך לפני מע״מ בקטלוג, הערך עם מע״מ, או מחיר
 * withEditing. האתר מציג את שלושתם.
 *
 * מה פטור: מספר שאינו מחיר שירות שלנו. טווחי שוק, עלות ציוד ביתי,
 * השוואות למתחרים וסכומים בתוך סיפור. כל פטור דורש נימוק.
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const CATALOG = "lib/data/pricing-catalog.ts";
const SCAN_DIRS = "lib components app public";
const VAT_RATE = 0.18;

/** מספרים בפרוזה שאינם מחיר שירות שלנו. כל רשומה דורשת נימוק. */
const EXEMPT = [];

const PRICE_RE =
  /(?:₪\s*)(\d{1,3}(?:,\d{3})+|\d{3,6})|(\d{1,3}(?:,\d{3})+|\d{3,6})\s*(?:₪|ש״ח|ש"ח)/g;

function catalogValues() {
  const text = readFileSync(CATALOG, "utf8");
  const values = new Set();
  for (const m of text.matchAll(/exVat:\s*(\d+)/g)) {
    const ex = Number(m[1]);
    values.add(ex);
    values.add(Math.round(ex * (1 + VAT_RATE)));
  }
  return values;
}

function isComment(line, inBlock) {
  const t = line.trim();
  if (inBlock) return { comment: true, inBlock: !t.includes("*/") };
  if (t.startsWith("//")) return { comment: true, inBlock: false };
  if (t.startsWith("/*")) return { comment: true, inBlock: !t.includes("*/") };
  if (t.startsWith("*")) return { comment: true, inBlock: false };
  return { comment: false, inBlock: false };
}

const backed = catalogValues();
const files = execSync(`git ls-files ${SCAN_DIRS}`, { maxBuffer: 1e8 })
  .toString()
  .trim()
  .split("\n")
  .filter((f) => /\.(ts|tsx|txt)$/.test(f) && f !== CATALOG && !/\.generated\./.test(f));

const unbacked = [];
const usedExempt = new Set();

for (const file of files) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  let inBlock = false;
  text.split(/\r?\n/).forEach((line, idx) => {
    const state = isComment(line, inBlock);
    inBlock = state.inBlock;
    if (state.comment) return;

    PRICE_RE.lastIndex = 0;
    const values = new Set();
    let m;
    while ((m = PRICE_RE.exec(line)) !== null) {
      values.add(Number((m[1] || m[2]).replace(/,/g, "")));
    }
    for (const value of values) {
      if (backed.has(value)) continue;
      const entry = EXEMPT.find(
        (e) => e.value === value && e.file === file && line.includes(e.match),
      );
      if (entry) {
        usedExempt.add(entry);
        continue;
      }
      unbacked.push({
        file,
        line: idx + 1,
        value,
        text: line.trim().replace(/\s+/g, " ").slice(0, 120),
      });
    }
  });
}

/* רשומת פטור שלא מוצאת כלום משתיקה בדיקה עתידית. */
const stale = EXEMPT.filter((e) => !usedExempt.has(e));

console.log("=== audit:prose-price-backing ===\n");
console.log(`  ${backed.size} ערכים מגובים בקטלוג (לפני ואחרי מע״מ).`);
console.log(`  ${files.length} קבצים נסרקו.\n`);

let failed = false;

if (unbacked.length > 0) {
  failed = true;
  const byFile = new Map();
  for (const u of unbacked) {
    if (!byFile.has(u.file)) byFile.set(u.file, []);
    byFile.get(u.file).push(u);
  }
  console.error(`  ✗ ${unbacked.length} מחירים בפרוזה בלי גיבוי בקטלוג, ב-${byFile.size} קבצים:\n`);
  for (const [file, rows] of [...byFile].sort((a, b) => b[1].length - a[1].length)) {
    console.error(`    ${file}  (${rows.length})`);
    for (const r of rows.slice(0, 4)) {
      console.error(`      :${r.line}  ${r.value} ₪  ${r.text}`);
    }
    if (rows.length > 4) console.error(`      ... ועוד ${rows.length - 4}`);
    console.error("");
  }
}

if (stale.length > 0) {
  failed = true;
  console.error(`  ✗ ${stale.length} רשומות פטור לא תואמות שום שורה. פטור מת משתיק בדיקה:\n`);
  for (const s of stale) console.error(`    ${s.value} · ${s.file} · "${s.match}"`);
  console.error("");
}

if (failed) {
  console.error("  שתי דרכי תיקון:");
  console.error("    1. לגזור מהקטלוג: ${getExVat(\"id\").toLocaleString(\"he-IL\")} ₪");
  console.error("    2. אם זה לא מחיר שירות שלנו, להוסיף רשומה ל-EXEMPT עם נימוק\n");
  process.exit(1);
}

console.log("  תקין. כל מחיר בפרוזה מגובה בקטלוג או בפטור מנומק.\n");
