/** מחזיק מחיר 48 שעות + מספר חלונות שבועי דטרמיניסטי ל-CRO באשף */

export {
  PRICE_HOLD_MS as STUDIO_PRICE_HOLD_MS,
  STEP3_SOFT_HOLD_MS,
  BOOK_EXIT_INTENT_SHOWN_KEY,
  getWeeklyStudioSlotsRemaining,
  getWeeklySlotsRemaining,
  saveStudioPriceHold,
  readStudioPriceHold,
  readInitialPriceHoldBadge,
  saveCategoryPriceHold,
  readCategoryPriceHold,
  ensureStep3HoldDeadline,
  ensureHoldDeadline,
  markBookExitIntentShown,
  wasBookExitIntentShown,
  type CategoryPriceHold as StudioPriceHold,
} from "@/lib/book-wizard-cro/urgency";
