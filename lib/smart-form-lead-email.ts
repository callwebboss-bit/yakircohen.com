import { getPriceById } from "@/lib/data/pricing-catalog";
import {
  getSmartFormEnrichment,
  returnPotentialLabel,
} from "@/lib/data/smart-form-enrichment";
import { getSmartFormCategory } from "@/lib/data/smart-form-matrix";
import { calculateSmartFormEstimate } from "@/lib/smart-form-estimate";
import {
  buildSmartFormCloserPlainText,
  type SmartFormState,
} from "@/lib/smart-form-url";
import { SITE_URL } from "@/lib/site-url";

/**
 * גוף מייל קריא בטלפון - בלוקים מופרדים ב-\n\n (לא גוש טקסט).
 * כל המחירים לפני מע״מ.
 */
export function buildSmartFormLeadEmailBody(state: SmartFormState): string {
  const category = state.categoryId
    ? getSmartFormCategory(state.categoryId)
    : null;
  const enrichment = getSmartFormEnrichment(state.categoryId);
  const estimate = calculateSmartFormEstimate(
    state.categoryId,
    state.selectedChipIds,
  );

  const clientBlock = [
    "--- פרטי לקוח ---",
    state.name ? `שם: ${state.name}` : "שם: -",
    state.contactMethod ? `יצירת קשר: ${state.contactMethod}` : "יצירת קשר: -",
    category ? `שירות: ${category.title}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const baseLine = estimate.lines.find((l) => l.kind === "base");
  const upsellLines = estimate.lines.filter((l) => l.kind === "upsell");
  const budgetLines = [
    "--- הערכת תקציב (לפני מע״מ) ---",
    baseLine
      ? `בסיס: ${baseLine.label} - ${baseLine.exVat.toLocaleString("he-IL")} ₪`
      : state.baseCatalogId
        ? `בסיס: ${getPriceById(state.baseCatalogId).label} - ${state.estimateExVat.toLocaleString("he-IL")} ₪`
        : "בסיס: -",
  ];
  if (upsellLines.length) {
    budgetLines.push("תוספות:");
    for (const line of upsellLines) {
      budgetLines.push(
        `  + ${line.label} - ${line.exVat.toLocaleString("he-IL")} ₪`,
      );
    }
  } else {
    budgetLines.push("תוספות: אין");
  }
  budgetLines.push(
    `סה״כ משוער: ${(estimate.totalExVat || state.estimateExVat).toLocaleString("he-IL")} ₪`,
  );
  const budgetBlock = budgetLines.join("\n");

  const socialBlock = [
    "--- הקשר אישי / זהות ---",
    state.socialOrId.trim()
      ? `Social / ID: ${state.socialOrId.trim()}`
      : "Social / ID: לא צוין",
  ].join("\n");

  const journeyLines = ["--- הכנה / CLV ---"];
  if (enrichment) {
    journeyLines.push(
      `פוטנציאל חזרה: ${returnPotentialLabel(enrichment.returnPotential)}`,
    );
    journeyLines.push(
      `הכנה לאולפן: ${SITE_URL}${enrichment.prepHref}`,
    );
  } else {
    journeyLines.push("פוטנציאל חזרה: -");
  }
  const journeyBlock = journeyLines.join("\n");

  const closerBlock = [
    "--- CLOSER (הדבקה) ---",
    buildSmartFormCloserPlainText(state),
  ].join("\n");

  return [
    "ליד חדש - Smart Form (/book)",
    "",
    clientBlock,
    "",
    budgetBlock,
    "",
    socialBlock,
    "",
    journeyBlock,
    "",
    closerBlock,
  ].join("\n");
}
