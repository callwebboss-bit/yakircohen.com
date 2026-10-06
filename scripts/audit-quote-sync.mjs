/**
 * audit:quote-sync - מחולל ההצעות המקומי (quote.html במק) מצטט את אותם מחירים
 * כמו האתר.
 *
 * למה (תוכנית עמדת המכירות, 6.10.2026, סעיף 7): quote.html קורא את המחירים
 * מ-prices.js שעל הדיסק במק, מחוץ לריפו. אחרי שינוי מחיר באתר הקובץ נשאר ישן,
 * וההצעה הרשמית יצאה במחיר שסותר את האתר. export-quote-prices.mjs כותב בשורת
 * הכותרת של prices.js את ה-contentHash של הקטלוג, אותו hash כמו ב-
 * docs/pricing-export.json (ש-audit:pricing-export כבר משווה לקטלוג), והשומר
 * הזה משווה בין השניים. אותו דפוס כמו audit:closer-sync.
 *
 * כשהתיקייה לא קיימת (CI, worktree במכונה אחרת, מכונה בלי המערכת המקומית)
 * השומר מזהיר בקול ויוצא 0: אין מה לבדוק, וכישלון שם היה חוסם פריסה בלי סיבה.
 * לכן הוא לא חלק מ-verify:seo.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EXPORT_FILE = path.join(ROOT, "docs", "pricing-export.json");
const QUOTE_DIR = path.join(os.homedir(), "Documents", "yakircohen-ai-local", "ui_interface");
const PRICES_JS = path.join(QUOTE_DIR, "prices.js");
/* אותו ביטוי כמו HASH_LINE_RE ב-scripts/export-quote-prices.mjs. לשנות את שניהם יחד. */
const HASH_LINE_RE = /catalog contentHash: ([0-9a-f]{16})/;

console.log("=== audit:quote-sync ===\n");

const siteHash = JSON.parse(fs.readFileSync(EXPORT_FILE, "utf8")).contentHash;

if (!fs.existsSync(QUOTE_DIR)) {
  console.warn(`  ⚠⚠⚠ לא נמצאה התיקייה ${QUOTE_DIR} - הבדיקה לא רצה.`);
  console.warn("      במק שבו quote.html קיים, ודאו שהוא מסונכרן: npm run export:quote");
  console.warn(`      hash המחירון באתר: ${siteHash}\n`);
  process.exit(0);
}

if (!fs.existsSync(PRICES_JS)) {
  console.error(`  ✗ התיקייה קיימת אבל אין בה prices.js, ולכן quote.html בלי מחירים.`);
  console.error("    תיקון: npm run export:quote\n");
  process.exit(1);
}

let head;
try {
  /* ה-hash בשורות הכותרת. קוראים רק את תחילת הקובץ, בלי להריץ אותו. */
  head = fs.readFileSync(PRICES_JS, "utf8").split("\n").slice(0, 5).join("\n");
} catch (err) {
  console.error(`  ✗ prices.js לא נקרא: ${err.message}`);
  process.exit(1);
}

const quoteHash = head.match(HASH_LINE_RE)?.[1];

if (!quoteHash) {
  console.error("  ✗ בכותרת של prices.js אין catalog contentHash. הוא נוצר לפני הסנכרון עם הקטלוג");
  console.error("    (למשל ב-scripts/prices.py build של המערכת המקומית), והמחירים בו לא מהאתר.");
  console.error("    תיקון: npm run export:quote\n");
  process.exit(1);
}

if (quoteHash !== siteHash) {
  console.error("  ✗ quote.html מצטט מחירון ישן.");
  console.error(`    באתר: ${siteHash}   ב-prices.js: ${quoteHash}`);
  console.error("    תיקון, מעותק שמסונכרן עם main: npm run export:pricing ואז npm run export:quote\n");
  process.exit(1);
}

console.log(`  תקין. quote.html והאתר על אותו מחירון (${siteHash}).\n`);
