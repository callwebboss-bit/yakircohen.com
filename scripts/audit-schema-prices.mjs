/**
 * כל מחיר ב-JSON-LD הפומבי חייב להתקיים בקטלוג המחירים.
 *
 * הרקע: lib/seo/site-schema.json מיוצר על ידי scripts/generate-site-schema.ts,
 * אבל רק vercel-build הריץ אותו. הקובץ השמור התיישן ופרסם לגוגל הצעה של
 * 1,800 ש״ח להקלטת שיר, בזמן שהמחיר בקטלוג הוא 990 והמספר 1,800 לא קיים שם
 * כלל. סדר הריצה תוקן, אבל CI עדיין לא מייצר מחדש, ולכן צריך שומר שקורא את
 * הקובץ כמו שהוא ומשווה למקור האמת.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SCHEMA = path.join(ROOT, "lib", "seo", "site-schema.json");
const CATALOG = path.join(ROOT, "lib", "data", "pricing-catalog.ts");

const catalogText = fs.readFileSync(CATALOG, "utf8");
const catalogPrices = new Set(
  [...catalogText.matchAll(/exVat:\s*(\d+)/g)].map((m) => m[1]),
);

/**
 * מחיר כולל מע״מ (שלב 2 חלק ג, 2.10.2026): הקלטת השיר מוצגת לצרכן כולל מע״מ,
 * ולכן ההצעה בסכמה היא 590 ולא 500. ההיתר צר במכוון, "withVat של אותו פריט":
 *
 * 1. Offer עם priceSpecification של valueAddedTaxIncluded: false. המחיר שם חייב
 *    להיות exVat מהקטלוג, וה-price של ההצעה חייב להיות בדיוק withVat שלו.
 * 2. Offer בלי priceSpecification ששמו הוא label של פריט בקטלוג, והמחיר הוא
 *    withVat של אותו פריט.
 *
 * בשני המסלולים, כשהשם תואם label בקטלוג, המחיר לפני מע״מ חייב להיות של אותו
 * פריט. כך 590 כולל מע״מ שמוצמד לשם של פריט אחר נכשל.
 *
 * הצעה לפני מע״מ בלי priceSpecification נשארת בבדיקת הקיום הישנה, בלי התאמת
 * שם: "תיקון זיופים" ב-250 של vocal-fix הוא שירות אונליין אחר מ-studio_pitch_correction
 * שנקרא באותו שם, ובדיקת שם שם הייתה נכשלת על דבר שאינו מחיר שיר.
 */
const vatRateMatch = catalogText.match(/VAT_RATE_LOCAL\s*=\s*([\d.]+)/);
if (!vatRateMatch) {
  console.error("=== audit:schema-prices ===\n");
  console.error("  ✗ לא נמצא VAT_RATE_LOCAL ב-pricing-catalog.ts. הפורמט השתנה.");
  process.exit(1);
}
const VAT_RATE = Number(vatRateMatch[1]);
/* אותה נוסחה כמו withVatLocal בקטלוג */
const withVat = (exVat) => Math.round(exVat * (1 + VAT_RATE));

/** label -> exVat, משני הפורמטים בקטלוג (שורה אחת או אובייקט מרובה שורות) */
const catalogByLabel = new Map();
for (const m of catalogText.matchAll(
  /id:\s*"([^"]+)",\s*label:\s*"([^"]+)",\s*exVat:\s*(\d+)/g,
)) {
  catalogByLabel.set(m[2], { id: m[1], exVat: Number(m[3]) });
}
/**
 * מחירים שחיים בקובץ נתונים של עמוד ולא בקטלוג המרכזי.
 *
 * ההיתר מכוון ומצומצם, ולא "המספר קיים איפשהו ב-lib/data": 1,800 מופיע שם
 * במקרה כדמי נסיעה לאילת, ולכן בדיקה רחבה הייתה מאשרת את ההצעה המיושנת
 * שגרמה לכל זה. כל היתר חייב לנקוב בקובץ המקור, והשומר מוודא שהמחיר באמת
 * נמצא שם. היתר שמתיישן נכשל מעצמו.
 */
const OUTSIDE_CATALOG = {
  "50": "lib/data/online-photo-enhance-page.ts",
};

const schema = JSON.parse(fs.readFileSync(SCHEMA, "utf8"));
const offers = [];
(function walk(node) {
  if (Array.isArray(node)) return node.forEach(walk);
  if (!node || typeof node !== "object") return;
  if (node["@type"] === "Offer" && node.price != null) {
    const spec = node.priceSpecification;
    offers.push({
      name: node.name ?? "(ללא שם)",
      price: String(node.price),
      exVatSpec:
        spec && spec.valueAddedTaxIncluded === false && spec.price != null
          ? String(spec.price)
          : null,
    });
  }
  Object.values(node).forEach(walk);
})(schema);

const errors = [];

for (const offer of offers) {
  if (!/^\d+$/.test(offer.price)) {
    errors.push(
      `"${offer.name}": price "${offer.price}" אינו מספר נקי. schema.org פוסל מפריד אלפים.`,
    );
    continue;
  }
  const named = catalogByLabel.get(offer.name);

  if (offer.exVatSpec != null) {
    if (!catalogPrices.has(offer.exVatSpec)) {
      errors.push(
        `"${offer.name}": priceSpecification לפני מע״מ ${offer.exVatSpec} אינו קיים ב-pricing-catalog.ts.`,
      );
      continue;
    }
    if (named && offer.exVatSpec !== String(named.exVat)) {
      errors.push(
        `"${offer.name}": priceSpecification ${offer.exVatSpec} אינו המחיר של ${named.id} (${named.exVat}).`,
      );
      continue;
    }
    if (offer.price !== String(withVat(Number(offer.exVatSpec)))) {
      errors.push(
        `"${offer.name}": price ${offer.price} אינו withVat(${offer.exVatSpec}) = ` +
          `${withVat(Number(offer.exVatSpec))}. מחיר כולל מע״מ חייב להיגזר מאותו פריט.`,
      );
    }
    continue;
  }

  if (catalogPrices.has(offer.price)) continue;
  if (named && offer.price === String(withVat(named.exVat))) continue;

  const source = OUTSIDE_CATALOG[offer.price];
  if (!source) {
    errors.push(
      `"${offer.name}": המחיר ${offer.price} אינו קיים ב-pricing-catalog.ts. ` +
        `או שהסכמה התיישנה (הריצו npm run generate:schema), או שהמחיר הומצא.`,
    );
    continue;
  }

  const sourcePath = path.join(ROOT, source);
  if (!fs.existsSync(sourcePath)) {
    errors.push(`ההיתר ל-${offer.price} מפנה ל-${source}, שלא קיים.`);
    continue;
  }
  if (!new RegExp(`["']${offer.price}["']|:\\s*${offer.price}\\b`).test(fs.readFileSync(sourcePath, "utf8"))) {
    errors.push(
      `ההיתר ל-${offer.price} מפנה ל-${source}, אבל המחיר כבר לא שם. ` +
        `או לעדכן את הסכמה או להסיר את ההיתר.`,
    );
  }
}

if (offers.length === 0) {
  errors.push("לא נמצאה אף Offer ב-site-schema.json. הקובץ כנראה ריק או פגום.");
}

console.log("=== audit:schema-prices ===\n");

if (errors.length) {
  console.error(`נמצאו ${errors.length} בעיות:\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}

console.log(`תקין. כל ${offers.length} ההצעות ב-JSON-LD תואמות לקטלוג המחירים.`);
