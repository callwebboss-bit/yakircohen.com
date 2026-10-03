/**
 * audit:closer-sync - כלי ההצעות של הבעלים (yakir-closer, ב-../local-tools)
 * מצטט את אותם מחירים כמו האתר.
 *
 * למה (תוכנית שלב 4 WP8, ממצא ED-02): closer-config.json נוצר ב-npm run
 * export:closer ונשאר על הדיסק. אחרי שינוי מחיר באתר הכלי המשיך להציע ללקוחות
 * את המחיר הישן, ואף שער לא ראה את זה. export-closer-config.mjs כותב עכשיו את
 * pricingContentHash, אותו hash כמו ב-docs/pricing-export.json (ש-audit:pricing-export
 * כבר משווה לקטלוג), והשומר הזה משווה בין השניים.
 *
 * כש-../local-tools לא קיים (CI, worktree, מכונה בלי הכלי) השומר מזהיר בקול
 * ויוצא 0: אין מה לבדוק, וכישלון שם היה חוסם פריסה בלי סיבה.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const EXPORT_FILE = path.join(ROOT, "docs", "pricing-export.json");
const CLOSER_DIR = path.join(ROOT, "..", "local-tools");
const CLOSER_CONFIG = path.join(CLOSER_DIR, "closer-config.json");

console.log("=== audit:closer-sync ===\n");

const siteHash = JSON.parse(fs.readFileSync(EXPORT_FILE, "utf8")).contentHash;

if (!fs.existsSync(CLOSER_CONFIG)) {
  console.warn("  ⚠⚠⚠ לא נמצא ../local-tools/closer-config.json - הבדיקה לא רצה.");
  console.warn("      במכונה שבה yakir-closer קיים, ודאו שהוא מסונכרן: npm run export:closer");
  console.warn(`      hash המחירון באתר: ${siteHash}\n`);
  process.exit(0);
}

let closerHash;
try {
  closerHash = JSON.parse(fs.readFileSync(CLOSER_CONFIG, "utf8")).pricingContentHash;
} catch (err) {
  console.error(`  ✗ closer-config.json לא נקרא: ${err.message}`);
  process.exit(1);
}

if (!closerHash) {
  console.error("  ✗ ב-closer-config.json אין pricingContentHash. הוא נוצר לפני שהשומר נוסף.");
  console.error("    תיקון: npm run export:closer\n");
  process.exit(1);
}

if (closerHash !== siteHash) {
  console.error("  ✗ yakir-closer מצטט מחירון ישן.");
  console.error(`    באתר: ${siteHash}   ב-closer: ${closerHash}`);
  console.error("    תיקון: npm run export:pricing ואז npm run export:closer\n");
  process.exit(1);
}

console.log(`  תקין. yakir-closer והאתר על אותו מחירון (${siteHash}).\n`);
