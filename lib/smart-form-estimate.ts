import {
  formatFromPriceDual,
  getExVat,
  getPriceById,
  type PriceItemId,
} from "@/lib/data/pricing-catalog";
import {
  getSmartFormCategory,
  type SmartFormCategoryId,
} from "@/lib/data/smart-form-matrix";

export type SmartFormEstimateLine = {
  label: string;
  catalogId: PriceItemId;
  exVat: number;
  kind: "base" | "upsell";
};

export type SmartFormEstimate = {
  baseCatalogId: PriceItemId | null;
  baseExVat: number;
  lines: SmartFormEstimateLine[];
  totalExVat: number;
  softFromCopy: string;
  /** הערת עומס / זמינות קרובה (אופציונלי) */
  availabilityNote: string | null;
};

/** חודשי עומס יחסיים - הערה בלי לשנות מחיר */
export function getSmartFormAvailabilityNote(date: Date = new Date()): string | null {
  const month = date.getMonth() + 1;
  if ([3, 4, 5, 8, 9, 10].includes(month)) {
    return "הזמנה ל-48 השעות הקרובות עשויה להיות כפופה לזמינות מיוחדת";
  }
  return null;
}

/**
 * מחשב בסיס + תוספות לפי מחירון בלבד.
 * כל הסכומים הם לפני מע״מ (exVat). מע״מ 18% מתווסף רק בתצוגה
 * via formatFromPriceDual / catalogWithVat - לא בתוך הסכימה.
 * משפחות: תמיד חבילה קבועה - לא studio_hour.
 */
export function calculateSmartFormEstimate(
  categoryId: SmartFormCategoryId | null,
  selectedChipIds: readonly string[],
): SmartFormEstimate {
  const empty: SmartFormEstimate = {
    baseCatalogId: null,
    baseExVat: 0,
    lines: [],
    totalExVat: 0,
    softFromCopy: "",
    availabilityNote: null,
  };

  if (!categoryId) return empty;
  const category = getSmartFormCategory(categoryId);
  if (!category || category.antiLead || !category.catalogId) return empty;

  const selected = new Set(selectedChipIds);
  let baseId: PriceItemId = category.catalogId;

  for (const chip of category.chips) {
    if (!selected.has(chip.id)) continue;
    if (chip.antiLead) return empty;
    if (chip.catalogId) {
      baseId = chip.catalogId;
    }
  }

  if (category.fixedPackageOnly && baseId === "studio_hour") {
    baseId = "blessing_recording";
  }

  const lines: SmartFormEstimateLine[] = [];
  const baseItem = getPriceById(baseId);
  const baseExVat = getExVat(baseId);
  lines.push({
    label: baseItem.label,
    catalogId: baseId,
    exVat: baseExVat,
    kind: "base",
  });

  let upsellTotal = 0;
  for (const chip of category.chips) {
    if (!selected.has(chip.id)) continue;
    if (!chip.upsellCatalogId) continue;
    if (chip.upsellCatalogId === baseId) continue;
    const exVat = getExVat(chip.upsellCatalogId);
    const item = getPriceById(chip.upsellCatalogId);
    lines.push({
      label: chip.label || item.label,
      catalogId: chip.upsellCatalogId,
      exVat,
      kind: "upsell",
    });
    upsellTotal += exVat;
  }

  const totalExVat = baseExVat + upsellTotal;
  return {
    baseCatalogId: baseId,
    baseExVat,
    lines,
    totalExVat,
    softFromCopy: `הערכת תקציב בסיסית לפרויקט מתחילה ב-${formatFromPriceDual(baseExVat)}`,
    availabilityNote: getSmartFormAvailabilityNote(),
  };
}
