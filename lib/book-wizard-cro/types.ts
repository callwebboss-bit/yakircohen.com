import type { BookCategoryId } from "@/lib/book-url";
import type { PriceItemId } from "@/lib/data/pricing-catalog";

/** קטגוריות Tier A עם וויזארד 3 שלבים + CRO מלא */
export type TierACategoryId = "studio" | "events" | "podcast" | "singer";

export type EscapePlacementId =
  | "after_packages"
  | "empty_results"
  | "step_contact"
  | "after_high_price";

export type CroOption = {
  id: string;
  label: string;
};

export type CroReassurance = {
  title: string;
  body: string;
};

export type CroLastMinuteUpsell = {
  /** טקסט בלבד, בלי מחירים. המחיר מוצג ליד הטקסט מהפורמט לצרכן (כולל מע״מ). */
  label: string;
  upgradeId: string;
  /**
   * שני אלה אופציונליים בכוונה: שדרוג אינו חייב להיות מבצע. listPrice הוא
   * המחיר שהאשף גובה בפועל על השדרוג, ומשמש רק לחישוב ההנחה.
   */
  promoPrice?: number;
  listPrice?: number;
  /**
   * מחיר "במקום" מוצג רק כשהוא קשור לפריט קטלוג של אותו מוצר, ו-listPrice
   * שווה ל-getExVat שלו (נבדק ב-types.test.ts). מחיר ייחוס שלא נגבה הוא
   * הצגה מטעה לפי חוק הגנת הצרכן (FIT-05).
   */
  referenceCatalogId?: PriceItemId;
};

export type WizardCroConfig = {
  category: TierACategoryId;
  formId: string;
  serviceLabel: string;
  anxieties: readonly CroOption[];
  perks: readonly CroOption[];
  reassuranceByAnxiety: Partial<Record<string, CroReassurance>>;
  transitionMessages: readonly string[];
  escapePlacements: readonly EscapePlacementId[];
  step3Closer: string;
  step3SummaryHeading: string;
  step3ContactHeading: string;
  priceReframe?: string;
  parkingCopy?: string;
  lastMinuteUpsell?: CroLastMinuteUpsell;
  fitMeterLabel?: string;
  fitMeterDetail?: string;
  exitIntent: {
    title: string;
    body: string;
    cta: string;
    dismiss: string;
  };
  idleHelp: {
    message: string;
    cta: string;
    dismiss: string;
  };
  waEscape: string;
};

export function isTierACategory(id: BookCategoryId): id is TierACategoryId {
  return id === "studio" || id === "events" || id === "podcast" || id === "singer";
}
