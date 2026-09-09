/**
 * ייצוא המחירון למערכת הפנימית של הבעלים.
 *
 * הבעלים מנהל מחירון גם בשרת פנימי, וביקש קובץ שסוכן אחר יוכל לקרוא כדי
 * לסנכרן. הקובץ **מיוצר מהקטלוג** ואינו מתוחזק ביד, כי בדיוק אותה תבנית של
 * קובץ נגזר שמתוחזק ביד היא זו שפרסמה 1,800 ש״ח לגוגל ו-1,200 ש״ח למנועי AI.
 *
 * Run: npm run export:pricing          - כותב את הקובץ
 * Run: npm run audit:pricing-export    - מוודא בלבד, נכשל אם הקובץ התיישן
 *
 * הפלט: docs/pricing-export.json
 *   - כל מחיר גם לפני מע״מ וגם כולל, מחושב באותה פונקציה שהאתר משתמש בה,
 *     כדי שלא תהיה סטייה של שקל בין האתר למערכת הפנימית.
 *   - `contentHash` מאפשר למערכת הפנימית לדעת אם משהו השתנה בלי להשוות הכל.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  PRICING_CATALOG,
  CATALOG_VAT_RATE,
  catalogWithVat,
  type PriceItem,
} from "../lib/data/pricing-catalog";

const root = resolve(import.meta.dirname, "..");
const outPath = resolve(root, "docs/pricing-export.json");

type ExportedItem = {
  id: string;
  label: string;
  category: string;
  exVat: number;
  inclVat: number;
  priceFrom: boolean;
  context?: string;
  suitedFor?: string;
  withEditingExVat?: number;
  withEditingInclVat?: number;
};

const items: ExportedItem[] = (PRICING_CATALOG as readonly PriceItem[]).map((p) => {
  const row: ExportedItem = {
    id: p.id,
    label: p.label,
    category: p.category,
    exVat: p.exVat,
    inclVat: catalogWithVat(p.exVat),
    priceFrom: p.priceFrom === true,
  };
  if (p.context) row.context = p.context;
  if (p.suitedFor) row.suitedFor = p.suitedFor;
  if (p.withEditing) {
    row.withEditingExVat = p.withEditing.exVat;
    row.withEditingInclVat = catalogWithVat(p.withEditing.exVat);
  }
  return row;
});

/* ההאש מכסה רק את התוכן, לא את חותמת הזמן, אחרת כל הרצה הייתה נראית כשינוי. */
const payloadForHash = JSON.stringify({ vatRate: CATALOG_VAT_RATE, items });
const contentHash = createHash("sha256").update(payloadForHash).digest("hex").slice(0, 16);

const doc = {
  $comment:
    "מיוצר אוטומטית מ-lib/data/pricing-catalog.ts. אין לערוך ידנית. להרצה: npm run export:pricing",
  source: "lib/data/pricing-catalog.ts",
  currency: "ILS",
  vatRate: CATALOG_VAT_RATE,
  vatNote:
    "inclVat מחושב כ-Math.round(exVat * (1 + vatRate)), בדיוק כמו באתר. אין לחשב מחדש בצורה אחרת.",
  itemCount: items.length,
  contentHash,
  items,
};

const serialized = JSON.stringify(doc, null, 2) + "\n";

if (process.argv.includes("--check")) {
  let existing: string | null = null;
  try {
    existing = readFileSync(outPath, "utf8");
  } catch {
    existing = null;
  }
  if (existing === null) {
    console.error("=== audit:pricing-export ===\n");
    console.error("  ✗ מה: docs/pricing-export.json לא קיים.");
    console.error("    למה זה חשוב: המערכת הפנימית קוראת ממנו את המחירון.");
    console.error("    תיקון: npm run export:pricing\n");
    process.exit(1);
  }
  if (existing.replace(/\r\n/g, "\n") === serialized) {
    console.log(
      `audit:pricing-export OK — הקובץ תואם לקטלוג (${items.length} פריטים, hash ${contentHash}).`,
    );
    process.exit(0);
  }

  let stale: { itemCount?: number; contentHash?: string } = {};
  try {
    stale = JSON.parse(existing);
  } catch {
    /* קובץ פגום, ההודעה למטה עדיין נכונה */
  }
  console.error("=== audit:pricing-export ===\n");
  console.error("  ✗ מה: docs/pricing-export.json התיישן ואינו תואם ל-pricing-catalog.ts.");
  console.error(
    `    בקובץ:  ${stale.itemCount ?? "?"} פריטים, hash ${stale.contentHash ?? "?"}`,
  );
  console.error(`    בקטלוג: ${items.length} פריטים, hash ${contentHash}`);
  console.error(
    "\n    למה זה חשוב: המערכת הפנימית של הבעלים מסתנכרנת מהקובץ הזה. אם הוא",
  );
  console.error("    מיושן, האתר והשרת הפנימי גובים מחירים שונים על אותו מוצר.");
  console.error("    תיקון: npm run export:pricing ואז לשמור את הקובץ ב-git.\n");
  process.exit(1);
}

writeFileSync(outPath, serialized, "utf8");
console.log(
  `export:pricing OK — נכתבו ${items.length} פריטים ל-docs/pricing-export.json (hash ${contentHash}).`,
);
