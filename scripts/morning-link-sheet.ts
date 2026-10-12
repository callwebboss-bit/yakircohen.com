/**
 * morning:sheet - מה להקליד במורנינג כדי ליצור את הלינקים לתשלום, מהקטלוג.
 *
 * כותב את docs/morning-links-sheet.md: לינק המקדמה, לינק הסכום הפתוח עם
 * הסכומים הקבועים לבחירה (נקודות המחיר הנפוצות בדלפק), ולינק קבוע לכל אחד
 * משמונת השירותים הנפוצים. כל מספר מהקטלוג, כולל מע״מ. אחרי כל יצירה שומרים
 * את ה-URL עם npm run morning:link.
 *
 *   npm run morning:sheet
 */
import { writeFileSync } from "node:fs";
import { MORNING_LINKS } from "../lib/sales/morning-links";
import { buildSalesBook, FEATURED_CARD_IDS } from "../lib/sales/sales-book";
import { buildMorningLinkFields, nisText } from "../lib/sales/sales-copy";

const OUT = "docs/morning-links-sheet.md";
const PRESET_COUNT = 5; /* מורנינג מגביל ל-5 סכומים קבועים לבחירה (נבדק 12.10.2026) */

const book = buildSalesBook();
const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Jerusalem" });

/* נקודות המחיר הנפוצות: כמה כרטיסים (בלי "החל מ") חולקים את אותו מחיר כולל מע״מ */
const byPrice = new Map<number, number>();
for (const card of book.cards) {
  if (card.priceFrom) continue;
  byPrice.set(card.inclVat, (byPrice.get(card.inclVat) ?? 0) + 1);
}
/* החלטת הבעלים 12.10.2026: אחרי שהלינק נוצר, הטבלה מראה את הסכומים שבאמת הוגדרו
   במורנינג (open.presets), לא את ההצעה המחושבת */
const saved = MORNING_LINKS.open.presets ?? [];
const presets: [number, number][] = saved.length
  ? [...saved].sort((a, b) => a - b).map((price) => [price, byPrice.get(price) ?? 0])
  : [...byPrice.entries()]
      .sort((a, b) => b[1] - a[1] || a[0] - b[0])
      .slice(0, PRESET_COUNT)
      .sort((a, b) => a[0] - b[0]);

const featured = FEATURED_CARD_IDS.map((id) => book.cards.find((c) => c.id === id)).filter((c) => c != null);
const status = (id: string) => (MORNING_LINKS.cards[id]?.url ? "נשמר" : "ליצור");

const lines: string[] = [
  "# לינקים לתשלום במורנינג: מה להקליד",
  "",
  `נוצר ב-${today} מהקטלוג (npm run morning:sheet). כל סכום כולל מע״מ. במורנינג: תשלומים, לינקים לתשלום, פלוס. אחרי כל יצירה: \`npm run morning:link -- --id <מזהה> --url <הלינק>\`. הנוהל המלא ב-docs/MORNING-LINKS.md.`,
  "",
  "## 1. לינק מקדמה (לינק לעסקה רגילה)",
  "",
  `מצב: ${MORNING_LINKS.deposit.url ? "נשמר" : "ליצור"}`,
  "",
  "```",
  "שם הלינק: מקדמה לשמירת תאריך",
  `מחיר: ${nisText(MORNING_LINKS.deposit.inclVat)} כולל מע״מ`,
  "תיאור: מקדמה לשמירת תאריך באולפן. היתרה לפי ההצעה שסוכמה",
  "קוד פריט: deposit",
  "אחרי היצירה: npm run morning:link -- --id deposit --url <הלינק>",
  "```",
  "",
  "## 2. לינק בסכום פתוח",
  "",
  `מצב: ${MORNING_LINKS.open.url ? "נשמר" : "ליצור"}`,
  "",
  "מכסה כל שירות בלי לינק קבוע: ההודעה מהדלפק אומרת ללקוח את הסכום, והוא בוחר אותו בלינק. להפעיל \"הגדרת סכומים קבועים לבחירה\" עם נקודות המחיר הנפוצות בדלפק:",
  "",
  "| סכום | כמה שירותים במחיר הזה |",
  "|---|---|",
  ...presets.map(([price, count]) => `| ${nisText(price)} | ${count} |`),
  "",
  "```",
  "שם הלינק: תשלום לאולפן יקיר כהן",
  "תיאור: הסכום לפי ההצעה שקיבלתם בוואטסאפ",
  "קוד פריט: open",
  "אחרי היצירה: npm run morning:link -- --id open --url <הלינק>",
  "```",
  "",
  "## 3. לינק קבוע לכל אחד משמונת הנפוצים (לינק לעסקה רגילה)",
  "",
];
for (const card of featured) {
  lines.push(`### ${card.title} (${status(card.id)})`, "", "```", buildMorningLinkFields(card), "```", "");
}
writeFileSync(OUT, `${lines.join("\n")}\n`);

console.log(`morning:sheet - ${featured.length} נפוצים, ${presets.length} סכומים קבועים לבחירה. נכתב: ${OUT}`);
