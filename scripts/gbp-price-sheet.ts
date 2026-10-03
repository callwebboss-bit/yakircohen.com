/**
 * gbp:prices - מחירון לכרטיס Google Business, מהקטלוג.
 *
 * מדפיס ומעדכן את docs/gbp-price-sheet.md: לכל מוצר בכרטיס, המחיר להזנה (כולל
 * מע״מ), הקישור לעמוד, ומה מופיע היום בכרטיס. כשמחיר בקטלוג משתנה, מריצים את זה
 * ומעתיקים לכרטיס רק את השורות שמסומנות "לעדכן בכרטיס".
 *
 *   npm run gbp:prices            מעדכן את הקובץ ומדפיס סיכום
 *   npm run gbp:prices -- --check נכשל אם יש שורה שמסומנת "לעדכן בכרטיס"
 */
import { writeFileSync } from "node:fs";
import { buildGbpSheet, renderGbpSheetMarkdown } from "../lib/data/gbp-products-sheet";

const rows = buildGbpSheet();
/* תאריך לפי שעון ישראל, לא UTC (אחרי חצות UTC עוד מראה את היום הקודם) */
const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Jerusalem" });
writeFileSync("docs/gbp-price-sheet.md", renderGbpSheetMarkdown(rows, today));

const toUpdate = rows.filter((r) => r.status === "update");
const toDecide = rows.filter((r) => r.status === "decide");

console.log(`gbp:prices - ${rows.length} מוצרים, ${toUpdate.length} לעדכן, ${toDecide.length} להחלטה`);
for (const r of toUpdate) {
  console.log(`  לעדכן: ${r.name}: בכרטיס ${r.gbpPriceNow ?? "-"} -> ${r.priceToEnter} (כולל מע״מ)  ${r.url ?? ""}`);
}
for (const r of toDecide) {
  console.log(`  להחלטה: ${r.name}: ${r.note ?? ""}`);
}
console.log("  נכתב: docs/gbp-price-sheet.md");

if (process.argv.includes("--check") && toUpdate.length > 0) {
  process.exit(1);
}
