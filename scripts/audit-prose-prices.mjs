/**
 * audit:prose-prices - תופס מחיר קטלוג שהשתנה ופרוזה שנשארה מאחור.
 *
 * למה זה קיים: בסבב ספטמבר 2026 מחירי האטרקציות עודכנו בקטלוג
 * (1750->1695, 3200->3051, 4450->4322, 5500->5424) ו-14 מחרוזות פרוזה
 * ב-8 קבצים נשארו על הערכים הישנים. ארבע מהן נקראות על ידי מכונות:
 * הפסקה המסומנת data-speakable ב-/data/industry-2026, בלוק sr-only
 * ב-EventsBookingWizard, תשובת FAQ שנכנסת ל-JSON-LD, ושתי טבלאות בלוג.
 *
 * למה השומרים הקיימים לא תפסו: audit:pricing מחפש `price: 1695` או
 * `exVat: 1695`, כלומר מספר בצורת קוד. המחירים השגויים ישבו כטקסט עברי
 * עם פסיק אלפים, "מתחילה ב-1,750 ₪". אותה צורת כשל כמו audit:links
 * שתפס href="..." ולא href: "...".
 *
 * ולמה בדיקת "המחיר קיים בקטלוג" הייתה מאשרת את הבאג: 1750 הוא עד היום
 * מחיר תקף של שלושה פריטים אחרים (led_lighting, external_mix_master,
 * mashup_ready_pack_3). ערך לבדו לא אומר כלום. לכן הבדיקה כאן היא
 * "איזה מזהה שינה ערך", ולא "האם המספר מוכר".
 *
 * מה הוא כן מכסה: כל מזהה שערכו השתנה מול ענף הבסיס. כל מופע פרוזה של
 * הערך הישן חייב להיות מוסבר ומקושר למזהה שמחזיק אותו היום.
 *
 * מה הוא לא מכסה, ואומר את זה במפורש:
 *  1. מזהה שנמחק מהקטלוג (להבדיל משינה ערך). PriceItemId הוא union אמיתי
 *     אחרי ה-satisfies, ולכן מחיקה כבר נתפסת בקומפילציה בכל הפניה בקוד,
 *     אבל לא בפרוזה. single_effect טופל ידנית.
 *  2. מחיר פרוזה חדש שמעולם לא היה בקטלוג.
 *  3. הרצה בלי היסטוריית git (למשל checkout רדוד) מדלגת על הבדיקה
 *     ואומרת זאת בקול, במקום לעבור בשקט.
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const CATALOG = "lib/data/pricing-catalog.ts";
const SCAN_DIRS = "lib components app public";

/* מופעי פרוזה של ערך שפרש, שהם באמת מוצר אחר. כל רשומה עם catalogId
   נבדקת מול הקטלוג החי, כך שאי אפשר "להשתיק" כאן מחיר שגוי: אם המזהה
   הזה יפסיק להחזיק את הערך, הרשומה עצמה תיכשל. */
const EXPLAINED = [
  { value: 1750, file: "lib/data/blog.ts", match: "תאורת LED", catalogId: "led_lighting" },
  { value: 1750, file: "lib/data/blog.ts", match: "מיקס ומאסטרינג חיצוני", catalogId: "external_mix_master" },
  { value: 4450, file: "lib/data/blog.ts", match: "כרטיסיית 5 שיעורים", why: "כרטיסייה לאקדמיה, לא מחיר קטלוג" },
  { value: 5500, file: "lib/data/blog.ts", match: "DJ לבר מצווה בישראל", why: "טווח שוק מצוטט, מסומן בפוסט עצמו כסקירה ולא כמחירון שלנו" },
  { value: 3200, file: "lib/data/academy-ulpan-page.ts", match: "3,200", why: "מסלול חודשי לאולפן עברית, מחירון אקדמיה נפרד" },
  { value: 3200, file: "lib/data/academy-hebrew-lessons-en.ts", match: "3,200", why: "אותו מסלול, גרסה אנגלית" },
  { value: 3200, file: "lib/data/shop-vouchers.ts", match: "2,500 - ₪3,200", why: "טווח שובר מתנה, לא פריט קטלוג" },
  { value: 3200, file: "components/seo/VoucherPageContent.tsx", match: "2,500 - ₪3,200", why: "אותו טווח שובר" },
  { value: 3200, file: "lib/data/faq-aeo.ts", match: "2,500 עד 3,200", why: "אותו טווח שובר" },
];

const PRICE_RE = /(?:₪\s*)(\d{1,3}(?:,\d{3})+)|(\d{1,3}(?:,\d{3})+)\s*(?:₪|ש״ח|ש"ח)/g;
const ID_RE = /\{\s*id:\s*"([^"]+)"[^}]*?exVat:\s*(\d+)/g;

function parseIds(text) {
  const map = {};
  let m;
  ID_RE.lastIndex = 0;
  while ((m = ID_RE.exec(text)) !== null) map[m[1]] = Number(m[2]);
  return map;
}

function baselineRef() {
  for (const ref of ["origin/main", "main"]) {
    try {
      execSync(`git rev-parse --verify --quiet ${ref}`, { stdio: "pipe" });
      return ref;
    } catch {
      /* try the next one */
    }
  }
  return null;
}

const ref = baselineRef();
if (!ref) {
  /* נכשל ולא מדלג. שומר שמדלג בשקט ומחזיר 0 הוא בדיוק הכשל שהוא אמור
     למנוע: ב-CI אף אחד לא קורא לוג ירוק. checkout@v4 הוא depth 1 כברירת
     מחדל, ולכן ה-workflow מגדיר fetch-depth: 0 במפורש. */
  console.error("=== audit:prose-prices ===\n");
  console.error("  ✗ אין ענף בסיס (origin/main או main) בעותק הזה.");
  console.error("    הבדיקה משווה מחירי קטלוג מול ענף הבסיס, ובלעדיו אין מול מה להשוות,");
  console.error("    והיא לא עוברת בשקט כי אז היא חסרת ערך.");
  console.error("    תיקון מקומי: git fetch origin main");
  console.error("    תיקון ב-CI:  fetch-depth: 0 בשלב ה-checkout\n");
  process.exit(1);
}

const current = parseIds(readFileSync(CATALOG, "utf8"));
const base = parseIds(execSync(`git show ${ref}:${CATALOG}`, { maxBuffer: 1e8 }).toString());

const changed = Object.keys(base)
  .filter((id) => id in current && base[id] !== current[id])
  .map((id) => ({ id, from: base[id], to: current[id] }));

if (changed.length === 0) {
  console.log("=== audit:prose-prices ===\n");
  console.log(`  תקין. אף מחיר בקטלוג לא השתנה מול ${ref}, ולכן אין ערך שפרש לחפש בפרוזה.\n`);
  process.exit(0);
}

const atRisk = new Map();
for (const c of changed) {
  if (!atRisk.has(c.from)) atRisk.set(c.from, []);
  atRisk.get(c.from).push(c);
}

/* סורק רק שורות שהמשתמש או המנוע רואה. הערות קוד מדברות על המחירים
   האלה בכוונה, כדי להסביר למה הם פרשו. */
function isComment(line, inBlock) {
  const t = line.trim();
  if (inBlock) return { comment: true, inBlock: !t.includes("*/") };
  if (t.startsWith("//")) return { comment: true, inBlock: false };
  if (t.startsWith("/*")) return { comment: true, inBlock: !t.includes("*/") };
  if (t.startsWith("*")) return { comment: true, inBlock: false };
  return { comment: false, inBlock: false };
}

const files = execSync(`git ls-files ${SCAN_DIRS}`, { maxBuffer: 1e8 })
  .toString()
  .trim()
  .split("\n")
  .filter((f) => /\.(ts|tsx|txt)$/.test(f) && f !== CATALOG);

const unexplained = [];
const usedEntries = new Set();

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
      if (!atRisk.has(value)) continue;
      const entry = EXPLAINED.find(
        (e) => e.value === value && e.file === file && line.includes(e.match),
      );
      if (entry) {
        usedEntries.add(entry);
        continue;
      }
      unexplained.push({ file, line: idx + 1, value, text: line.trim().replace(/\s+/g, " ") });
    }
  });
}

/* רשומה שכבר לא מוצאת כלום היא רשומה מתה שמשתיקה בדיקה עתידית. */
const stale = EXPLAINED.filter((e) => atRisk.has(e.value) && !usedEntries.has(e));

/* רשומה שמצהירה על מזהה חייבת להסכים עם הקטלוג החי. */
const brokenBindings = EXPLAINED.filter(
  (e) => e.catalogId && usedEntries.has(e) && current[e.catalogId] !== e.value,
);

console.log("=== audit:prose-prices ===\n");
console.log(`  ענף בסיס: ${ref}`);
console.log(`  מחירי קטלוג שהשתנו (${changed.length}):`);
for (const c of changed) console.log(`    ${c.id}: ${c.from} -> ${c.to}`);
console.log("");

let failed = false;

if (unexplained.length > 0) {
  failed = true;
  console.error(`  ✗ ${unexplained.length} מופעי פרוזה עדיין מצטטים מחיר שפרש:\n`);
  for (const u of unexplained) {
    const owners = atRisk.get(u.value).map((c) => c.id).join(", ");
    const holders = Object.keys(current).filter((id) => current[id] === u.value);
    console.error(`    ${u.file}:${u.line}`);
    console.error(`      ${u.text.slice(0, 120)}`);
    console.error(`      ${u.value} היה המחיר של ${owners}, והוא עכשיו ${atRisk.get(u.value)[0].to}.`);
    if (holders.length > 0) {
      console.error(`      שים לב: ${u.value} עדיין מחיר תקף של ${holders.join(", ")}.`);
      console.error(`      אם זו הכוונה, הוסיפו רשומה ל-EXPLAINED עם catalogId.`);
    }
    console.error("");
  }
}

if (stale.length > 0) {
  failed = true;
  console.error(`  ✗ ${stale.length} רשומות ב-EXPLAINED לא תואמות שום שורה. רשומה מתה משתיקה בדיקה:\n`);
  for (const s of stale) console.error(`    ${s.value} · ${s.file} · "${s.match}"`);
  console.error("");
}

if (brokenBindings.length > 0) {
  failed = true;
  console.error(`  ✗ ${brokenBindings.length} רשומות מצהירות על מזהה שכבר לא מחזיק את הערך:\n`);
  for (const b of brokenBindings) {
    console.error(`    ${b.file}: הוצהר ${b.catalogId}=${b.value}, בקטלוג ${current[b.catalogId]}`);
  }
  console.error("");
}

if (failed) {
  console.error("  תיקון: לגזור את המחיר מהקטלוג עם getExVat, במקום לכתוב מספר.");
  console.error("  התבנית שכבר בשימוש בריפו: ${getExVat(\"id\").toLocaleString(\"he-IL\")} ₪\n");
  process.exit(1);
}

console.log(`  תקין. כל מופעי הפרוזה של ${atRisk.size} הערכים שפרשו מוסברים ומקושרים לקטלוג.\n`);
