/**
 * כל מחיר ב-public/llms.txt חייב להתקיים בקטלוג המחירים.
 *
 * הרקע: הקובץ הזה הוא מה שמנועי AI קוראים כדי לצטט מחיר, ומחיר מיושן בו
 * מתפרסם כעובדה. הבלוק "מחירי פתיחה" מיוצר מהקטלוג ונשמר על ידי
 * `tsx scripts/sync-llms.ts --check`, שמשווה ייצור מלא ולכן לא ניתן לרמות אותו.
 *
 * השומר הזה מטפל בכל השאר: עשרה מחירים כתובים ביד בשורות התוכן, ששום דבר
 * לא מסנכרן אותם ואף אחד לא בדק אותם עד היום. הבדיקה כאן חלשה יותר במכוון,
 * "המחיר קיים בקטלוג", כי אין קשר מפורש בין שורה בפרוזה לבין פריט בקטלוג.
 * היא תופסת מחיר שהומצא או שהוסר מהקטלוג, והיא לא תתפוס החלפה בין שני
 * מחירים שקיימים שניהם. לכן היא מדפיסה במפורש כמה מחירים היא רק אימתה חלשות,
 * במקום להצהיר על ביטחון שאין לה.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const LLMS = path.join(ROOT, "public", "llms.txt");
const CATALOG = path.join(ROOT, "lib", "data", "pricing-catalog.ts");

const BLOCK_START = "## מחירי פתיחה";
const BLOCK_END = "## מרכזי תוכן עיקריים";

/**
 * מחירים לגיטימיים שלא מגיעים מהקטלוג. ההיתר מחייב לנקוב בקובץ המקור,
 * והשומר מוודא שהמחיר באמת נמצא שם, כך שהיתר שמתיישן נכשל מעצמו.
 */
const OUTSIDE_CATALOG = {};

const catalogText = fs.readFileSync(CATALOG, "utf8");
const catalogPrices = new Set(
  [...catalogText.matchAll(/exVat:\s*(\d+)/g)].map((m) => m[1]),
);
if (catalogPrices.size === 0) {
  console.error("=== audit:llms-prices ===\n");
  console.error("  ✗ לא נמצא אף exVat ב-pricing-catalog.ts. הקטלוג פגום או שהפורמט השתנה.");
  process.exit(1);
}

const raw = fs.readFileSync(LLMS, "utf8").replace(/\r\n/g, "\n");
const startIdx = raw.indexOf(BLOCK_START);
const endIdx = raw.indexOf(BLOCK_END);
if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
  console.error("=== audit:llms-prices ===\n");
  console.error(
    "  ✗ לא נמצאו סימני בלוק המחירים ב-llms.txt. גם sync:llms היה נכשל כאן.",
  );
  process.exit(1);
}

/* מוציאים את הבלוק המיוצר מהטווח, כי הוא נבדק בבדיקה חזקה יותר ובנפרד.
   שומרים על מספרי השורות המקוריים כדי שהדיווח יהיה בר-מעקב. */
const lines = raw.split("\n");
const blockFirstLine = raw.slice(0, startIdx).split("\n").length;
const blockLastLine = raw.slice(0, endIdx).split("\n").length;

const errors = [];
const weak = [];

lines.forEach((line, i) => {
  const lineNo = i + 1;
  if (lineNo >= blockFirstLine && lineNo < blockLastLine) return;

  for (const match of line.matchAll(/([0-9][0-9,]*)\s*₪/g)) {
    const price = match[1].replace(/,/g, "");
    if (catalogPrices.has(price)) {
      weak.push(`שורה ${lineNo}: ${match[1]} ₪`);
      continue;
    }

    const source = OUTSIDE_CATALOG[price];
    if (!source) {
      errors.push(
        `שורה ${lineNo}: המחיר ${match[1]} ₪ אינו קיים ב-pricing-catalog.ts.\n` +
          `      השורה: ${line.trim()}\n` +
          `      או שהמחיר התיישן, או שהומצא. לתקן מול הקטלוג, או להוסיף היתר מפורש עם קובץ מקור.`,
      );
      continue;
    }

    const sourcePath = path.join(ROOT, source);
    if (!fs.existsSync(sourcePath)) {
      errors.push(`שורה ${lineNo}: ההיתר ל-${price} מפנה ל-${source}, שלא קיים.`);
      continue;
    }
    if (
      !new RegExp(`["']${price}["']|:\\s*${price}\\b`).test(
        fs.readFileSync(sourcePath, "utf8"),
      )
    ) {
      errors.push(
        `שורה ${lineNo}: ההיתר ל-${price} מפנה ל-${source}, אבל המחיר כבר לא שם.`,
      );
    }
  }
});

console.log("=== audit:llms-prices ===\n");

if (errors.length) {
  console.error(`נמצאו ${errors.length} בעיות:\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}

console.log(
  `תקין. ${weak.length} מחירים כתובים ביד ב-llms.txt, וכולם קיימים בקטלוג המחירים.`,
);
console.log(
  "\nשימו לב: זו בדיקת קיום בלבד. היא לא יכולה לדעת שהמחיר שייך לשירות שבשורה,\n" +
    "ולכן החלפה בין שני מחירים שקיימים שניהם תעבור. הפתרון האמיתי הוא להעביר\n" +
    "גם את השורות האלה לייצור מהקטלוג, כמו בלוק מחירי הפתיחה.",
);
for (const w of weak) console.log(`  · ${w}`);
