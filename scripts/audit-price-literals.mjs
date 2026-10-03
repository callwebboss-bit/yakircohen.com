/**
 * audit:price-literals - שומר מוחלט על מחירים שנכתבו כמספר בקוד או בפרוזה.
 *
 * למה זה קיים (תוכנית שלב 4, WP0, ממצאים PI-29, PB-30, OAC-15): audit:prose-prices
 * תופס רק ערך קטלוג שהשתנה מול main. מחיר חדש שמעולם לא היה בקטלוג, או מחיר
 * שנכתב ביד ליד מחיר קטלוג תקף, עבר בשקט. בסקירת המכירות של 2.10.2026 נמצאו
 * כך "DJ מ-1,695" (מחיר של אטרקציה), "פרק מוכן מ-750" (חצי שעה גלם), ו-1,750
 * מחוק שאין לו מוצר.
 *
 * מה נסרק: git ls-files components lib app public/llms.txt, קבצי ts/tsx/txt/json.
 * לא נסרקים: הקטלוג עצמו, קבצי בדיקה, *.generated.*, ושורות הערה.
 *
 * מה נחשב מחיר:
 *  - פרוזה: סכום של 3 ספרות ומעלה (עם או בלי פסיק אלפים) ליד ₪, ש״ח, ש"ח או שקל.
 *  - קוד: שדה מחיר (price, priceExVat, exVat, originalPrice, listPrice, promoPrice,
 *    addOnPrice, priceAnchorExVat, fromPriceExVat, lowPrice, highPrice) עם מספר
 *    של 3 ספרות ומעלה, קבוע *_FROM או *_PRICE עם מספר, ו-price: "123" בסכמה.
 *
 * מה עובר: כל מופע חייב להיות או רשומה ב-ALLOWED (קובץ + טקסט + catalogId שנבדק
 * מול הקטלוג החי, או סיבה עם הפניה להחלטה), או רשומה ברשימה הקפואה
 * scripts/baselines/price-literals.json.
 *
 * מצב דיווח: מה שכבר ברשימה הקפואה לא מכשיל, רק נספר. הרשימה יכולה רק להתכווץ:
 *  - מחיר כתוב חדש (לא ברשימה ולא ב-ALLOWED) מכשיל.
 *  - רשומה ברשימה שכבר לא תואמת שום שורה מכשילה גם היא, כדי שכל תיקון יוריד
 *    את הרשומה שלו (אותו דפוס כמו EXPLAINED ב-audit:prose-prices).
 *
 * שימוש:
 *   node scripts/audit-price-literals.mjs            בדיקה
 *   node scripts/audit-price-literals.mjs --shrink   מוחק מהרשימה רשומות שתוקנו
 *                                                    (לא מוסיף אף פעם)
 *   node scripts/audit-price-literals.mjs --init     יוצר את הרשימה מאפס, רק אם
 *                                                    היא לא קיימת
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const CATALOG = "lib/data/pricing-catalog.ts";
const BASELINE = "scripts/baselines/price-literals.json";
const SCAN = "components lib app public/llms.txt";

/* מופעים מותרים לצמיתות. כל רשומה עם catalogId נבדקת מול הקטלוג החי:
   אם המזהה מפסיק להחזיק את הערך (לפני מע״מ או כולל), הרשומה נכשלת. */
const ALLOWED = [
  /* { file, match, catalogId, value } או { file, match, why, decision } */
];

const AMOUNT = String.raw`(?<![\d,.])(\d{1,3}(?:,\d{3})+|\d{3,6})(?![\d]|,\d)`;
const PROSE_RE = new RegExp(
  String.raw`(?:₪\s*)${AMOUNT}|${AMOUNT}\s*(?:₪|ש״ח|ש"ח|ש\\"ח|שקל)`,
  "g",
);
const FIELD_RE =
  /\b(price|priceExVat|exVat|originalPrice|listPrice|promoPrice|addOnPrice|priceAnchorExVat|fromPriceExVat|lowPrice|highPrice)\s*:\s*"?(\d{3,})"?/g;
const CONST_RE = /\b([A-Z0-9_]*_(?:FROM|PRICE))\s*=\s*(\d{3,})\b/g;

function isComment(line, inBlock) {
  const t = line.trim();
  if (inBlock) return { comment: true, inBlock: !t.includes("*/") };
  if (t.startsWith("//")) return { comment: true, inBlock: false };
  if (t.startsWith("/*")) return { comment: true, inBlock: !t.includes("*/") };
  if (t.startsWith("*")) return { comment: true, inBlock: false };
  if (t.startsWith("{/*")) return { comment: true, inBlock: !t.includes("*/") };
  return { comment: false, inBlock: false };
}

function norm(line) {
  return line.trim().replace(/\s+/g, " ");
}

function parseCatalog() {
  const text = readFileSync(CATALOG, "utf8");
  const re = /id:\s*"([^"]+)"[\s\S]*?exVat:\s*(\d+)/g;
  const map = {};
  let m;
  while ((m = re.exec(text)) !== null) {
    if (!(m[1] in map)) map[m[1]] = Number(m[2]);
  }
  return map;
}

function scan() {
  const files = execSync(`git ls-files ${SCAN}`, { maxBuffer: 1e8 })
    .toString()
    .trim()
    .split("\n")
    .filter(
      (f) =>
        /\.(ts|tsx|txt|json)$/.test(f) &&
        !/\.test\.tsx?$/.test(f) &&
        !/\.generated\./.test(f) &&
        f !== CATALOG &&
        existsSync(f),
    );
  const hits = [];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    let inBlock = false;
    text.split(/\r?\n/).forEach((line, idx) => {
      const state = isComment(line, inBlock);
      inBlock = state.inBlock;
      if (state.comment) return;
      const found = new Set();
      for (const [re, kind] of [
        [PROSE_RE, "prose"],
        [FIELD_RE, "field"],
        [CONST_RE, "const"],
      ]) {
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(line)) !== null) {
          const raw = kind === "prose" ? m[1] || m[2] : m[2];
          const value = Number(raw.replace(/,/g, ""));
          if (!Number.isFinite(value) || value < 100) continue;
          found.add(`${kind}:${value}`);
        }
      }
      for (const key of found) {
        const [kind, value] = key.split(":");
        hits.push({ file, line: idx + 1, kind, value: Number(value), text: norm(line) });
      }
    });
  }
  return hits;
}

const args = new Set(process.argv.slice(2));
const catalog = parseCatalog();
const hits = scan();

/* public/llms.txt נכתב מחדש מהקטלוג ע״י sync:llms (גם שורות המחיר בגוף,
   BODY_PRICES), ו-audit:llms-prices --check נכשל אם הוא סוטה. ערך שהוא exVat
   של פריט בקטלוג או withVat שלו בקובץ הזה הוא פלט של הייצור, לא מחיר כתוב. */
const GENERATED_FROM_CATALOG = new Set(["public/llms.txt"]);
const catalogValues = new Set(
  Object.values(catalog).flatMap((v) => [v, Math.round(v * 1.18)]),
);

const allowedUsed = new Set();
const remaining = [];
for (const h of hits) {
  if (GENERATED_FROM_CATALOG.has(h.file) && catalogValues.has(h.value)) continue;
  const entry = ALLOWED.find((a) => a.file === h.file && h.text.includes(a.match));
  if (entry) {
    allowedUsed.add(entry);
    continue;
  }
  remaining.push(h);
}

const brokenAllowed = ALLOWED.filter((a) => {
  if (!a.catalogId) return false;
  const ex = catalog[a.catalogId];
  if (ex === undefined) return true;
  return a.value !== undefined && a.value !== ex && a.value !== Math.round(ex * 1.18);
});
const staleAllowed = ALLOWED.filter((a) => !allowedUsed.has(a));

/* מפתח: קובץ + סוג + ערך, עם ספירה. עריכת שורה שמשאירה את אותו מחיר לא
   נחשבת חדשה; מופע נוסף של אותו ערך באותו קובץ כן. "text" ברשימה הוא דוגמה
   לקריאה בלבד. */
function groupKey(h) {
  return `${h.file}\u0000${h.kind}\u0000${h.value}`;
}
const counts = new Map();
const examples = new Map();
for (const h of remaining) {
  const k = groupKey(h);
  counts.set(k, (counts.get(k) ?? 0) + 1);
  if (!examples.has(k)) examples.set(k, h);
}

function toEntries(map) {
  return [...map]
    .map(([k, count]) => {
      const h = examples.get(k);
      return { file: h.file, kind: h.kind, value: h.value, count, example: h.text.slice(0, 160) };
    })
    .sort((a, b) => a.file.localeCompare(b.file) || a.value - b.value || a.kind.localeCompare(b.kind));
}

if (args.has("--init")) {
  if (existsSync(BASELINE)) {
    console.error(`${BASELINE} כבר קיים. הרשימה רק מתכווצת, השתמשו ב---shrink.`);
    process.exit(1);
  }
  const entries = toEntries(counts);
  writeFileSync(BASELINE, `${JSON.stringify(entries, null, 2)}\n`);
  console.log(`נוצרה רשימה קפואה: ${remaining.length} מחירים כתובים ב-${entries.length} קבוצות.`);
  process.exit(0);
}

const baseline = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : [];
const allowedCount = new Map(baseline.map((e) => [groupKey(e), e.count]));
const fresh = [];
const freshSeen = new Map();
for (const h of remaining) {
  const k = groupKey(h);
  const seen = (freshSeen.get(k) ?? 0) + 1;
  freshSeen.set(k, seen);
  if (seen > (allowedCount.get(k) ?? 0)) fresh.push(h);
}
const staleList = baseline
  .map((e) => ({ ...e, now: counts.get(groupKey(e)) ?? 0 }))
  .filter((e) => e.now < e.count);
const staleCount = staleList.reduce((a, e) => a + (e.count - e.now), 0);

if (args.has("--shrink")) {
  const kept = baseline
    .map((e) => {
      const now = counts.get(groupKey(e)) ?? 0;
      return now < e.count ? { ...e, count: now } : e;
    })
    .filter((e) => e.count > 0);
  const before = baseline.reduce((a, e) => a + e.count, 0);
  const after = kept.reduce((a, e) => a + e.count, 0);
  writeFileSync(BASELINE, `${JSON.stringify(kept, null, 2)}\n`);
  console.log(`הרשימה הקפואה: ${before} -> ${after} (הוסרו ${before - after}).`);
}

console.log("=== audit:price-literals ===\n");
console.log(`  מחירים כתובים ברשימה הקפואה: ${remaining.length - fresh.length} (מצב דיווח, צריך לרדת לאפס)`);
const perFile = new Map();
for (const h of remaining) perFile.set(h.file, (perFile.get(h.file) ?? 0) + 1);
const top = [...perFile].sort((a, b) => b[1] - a[1]).slice(0, 8);
for (const [f, n] of top) console.log(`    ${String(n).padStart(4)}  ${f}`);
console.log("");

let failed = false;
if (fresh.length > 0) {
  failed = true;
  console.error(`  ✗ ${fresh.length} מחירים כתובים חדשים (לא ברשימה הקפואה ולא ב-ALLOWED):\n`);
  for (const h of fresh.slice(0, 60)) {
    console.error(`    ${h.file}:${h.line}  [${h.kind} ${h.value}]`);
    console.error(`      ${h.text.slice(0, 140)}`);
  }
  if (fresh.length > 60) console.error(`    ... ועוד ${fresh.length - 60}`);
  console.error("\n  תיקון: לגזור מהקטלוג, ${getExVat(\"id\").toLocaleString(\"he-IL\")} ₪, או formatConsumerPrice.");
  console.error("  מחיר שאינו מחיר שלנו (טווח שוק בבלוג) נכנס ל-ALLOWED עם סיבה.\n");
}
if (staleCount > 0 && !args.has("--shrink")) {
  failed = true;
  console.error(`  ✗ ${staleCount} רשומות ברשימה הקפואה כבר לא תואמות שום שורה. הריצו --shrink:\n`);
  for (const e of staleList.slice(0, 30)) {
    console.error(`    ${e.file}  [${e.kind} ${e.value}]  ${e.count} -> ${e.now}`);
  }
  console.error("");
}
if (brokenAllowed.length > 0) {
  failed = true;
  for (const a of brokenAllowed) {
    console.error(`  ✗ ALLOWED ${a.file} "${a.match}": ${a.catalogId} לא מחזיק את ${a.value}`);
  }
}
if (staleAllowed.length > 0) {
  failed = true;
  for (const a of staleAllowed) console.error(`  ✗ רשומת ALLOWED מתה: ${a.file} "${a.match}"`);
}
if (failed) process.exit(1);
console.log("  תקין. אין מחיר כתוב חדש, והרשימה הקפואה מעודכנת.\n");
