import type { BookCategoryId } from "@/lib/book-url";

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

export type CroDecoyPackage = {
  emoji: string;
  name: string;
  description: string;
  highlights: readonly string[];
  priceExVat: number;
  badge: string;
  footnote: string;
  ariaLabel: string;
  ctaPrimary: string;
  ctaSecondary: string;
  waitlistUtmCampaign: string;
};

export type CroLastMinuteUpsell = {
  label: string;
  upgradeId: string;
  promoPrice: number;
  listPrice: number;
};

export type WizardCroConfig = {
  category: TierACategoryId;
  formId: string;
  serviceLabel: string;
  anxieties: readonly CroOption[];
  perks: readonly CroOption[];
  reassuranceByAnxiety: Partial<Record<string, CroReassurance>>;
  transitionMessages: readonly string[];
  decoy?: CroDecoyPackage;
  escapePlacements: readonly EscapePlacementId[];
  urgency: {
    slotsLabel: (n: number) => string;
    holdPrefix: string;
    holdExpiredSoft: string;
    priceHoldBadge: string;
  };
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
