/** מיקרו-קופי לוויזארד הזמנות אולפן - תאימות לאחור; מקור: lib/data/cro/studio.ts */
import { STUDIO_CRO_CONFIG } from "@/lib/data/cro/studio";
import { CRO_SHARED } from "@/lib/data/cro/shared";

export const BOOK_WIZARD_COPY = {
  nextStep: CRO_SHARED.nextStep,
  step3Closer: STUDIO_CRO_CONFIG.step3Closer,
  step3SummaryHeading: STUDIO_CRO_CONFIG.step3SummaryHeading,
  step3ContactHeading: STUDIO_CRO_CONFIG.step3ContactHeading,
  notesOptional: CRO_SHARED.notesOptional,
  projectModeQuestion: "איזה סוג פרויקט?",
  projectPersonal: "פרטי וחווייתי",
  projectBusiness: "עסקי ושיווקי",
  fitMeterLabel: STUDIO_CRO_CONFIG.fitMeterLabel!,
  fitMeterDetail: STUDIO_CRO_CONFIG.fitMeterDetail!,
  splitCostLabel: "מתחלקים בעלות?",
  splitCostPerPerson: (amount: string) => `רק ${amount} ₪ למשתתף (לפני מע״מ)`,
  waEscape: STUDIO_CRO_CONFIG.waEscape,
  companyNameLabel: "שם החברה / הארגון",
  needsInvoiceLabel: "צריך חשבונית מס",
  sessionPriorityQuestion: "מה הכי חשוב לך בסשן?",
  sessionPriorityVocal: STUDIO_CRO_CONFIG.anxieties[0].label,
  sessionPriorityFast: STUDIO_CRO_CONFIG.anxieties[1].label,
  sessionPriorityPrice: STUDIO_CRO_CONFIG.anxieties[2].label,
  welcomePerkQuestion: "בחרו צ'ופר הגעה ללא עלות",
  welcomePerkCoffee: STUDIO_CRO_CONFIG.perks[0].label,
  welcomePerkPhotos: STUDIO_CRO_CONFIG.perks[1].label,
  welcomePerkWarmup: STUDIO_CRO_CONFIG.perks[2].label,
  travelModeQuestion: "איך מגיעים לאולפן?",
  travelModeCar: "רכב פרטי",
  travelModeTransit: "תחבורה ציבורית / אחר",
  parkingBanner: STUDIO_CRO_CONFIG.parkingCopy!,
  transitionMessages: STUDIO_CRO_CONFIG.transitionMessages,
  urgencyWeeklySlots: STUDIO_CRO_CONFIG.urgency.slotsLabel,
  priceHoldBadge: STUDIO_CRO_CONFIG.urgency.priceHoldBadge,
  exitIntentTitle: STUDIO_CRO_CONFIG.exitIntent.title,
  exitIntentBody: STUDIO_CRO_CONFIG.exitIntent.body,
  exitIntentCta: STUDIO_CRO_CONFIG.exitIntent.cta,
  exitIntentDismiss: STUDIO_CRO_CONFIG.exitIntent.dismiss,
  idleHelp: STUDIO_CRO_CONFIG.idleHelp.message,
  idleHelpCta: STUDIO_CRO_CONFIG.idleHelp.cta,
  idleHelpDismiss: STUDIO_CRO_CONFIG.idleHelp.dismiss,
  pitchSafetyTitle: STUDIO_CRO_CONFIG.reassuranceByAnxiety.vocal_fix!.title,
  pitchSafetyBody: STUDIO_CRO_CONFIG.reassuranceByAnxiety.vocal_fix!.body,
  step3HoldPrefix: STUDIO_CRO_CONFIG.urgency.holdPrefix,
  step3HoldExpiredSoft: STUDIO_CRO_CONFIG.urgency.holdExpiredSoft,
  lastMinuteBtsLabel: STUDIO_CRO_CONFIG.lastMinuteUpsell!.label,
  decoyVipCta: STUDIO_CRO_CONFIG.decoy!.ctaPrimary,
  priceReframe: STUDIO_CRO_CONFIG.priceReframe!,
} as const;

export const SESSION_PRIORITY_LABELS: Record<
  "vocal_fix" | "fast_delivery" | "no_surprises",
  string
> = {
  vocal_fix: BOOK_WIZARD_COPY.sessionPriorityVocal,
  fast_delivery: BOOK_WIZARD_COPY.sessionPriorityFast,
  no_surprises: BOOK_WIZARD_COPY.sessionPriorityPrice,
};

export const WELCOME_PERK_LABELS: Record<"coffee" | "photos" | "vocal_warmup", string> = {
  coffee: BOOK_WIZARD_COPY.welcomePerkCoffee,
  photos: BOOK_WIZARD_COPY.welcomePerkPhotos,
  vocal_warmup: BOOK_WIZARD_COPY.welcomePerkWarmup,
};

export const TRAVEL_MODE_LABELS: Record<"car" | "transit", string> = {
  car: BOOK_WIZARD_COPY.travelModeCar,
  transit: BOOK_WIZARD_COPY.travelModeTransit,
};

/** תגיות קצרות לשורת ה-Cheatsheet בחלק ב' של הודעת WA */
export const CLOSER_ANXIETY_SHORT: Record<
  "vocal_fix" | "fast_delivery" | "no_surprises",
  string
> = {
  vocal_fix: "זיופים",
  fast_delivery: "מהירות",
  no_surprises: "מחיר קבוע",
};

export const CLOSER_PERK_SHORT: Record<"coffee" | "photos" | "vocal_warmup", string> = {
  coffee: "קפה משודרג",
  photos: "תמונות לסטורי",
  vocal_warmup: "חימום קולי",
};

export const CLOSER_TRAVEL_SHORT: Record<"car" | "transit", string> = {
  car: "רכב פרטי + חניה",
  transit: "תחבורה ציבורית",
};

export const STUDIO_QUICK_UPGRADE_IDS = ["bts", "express", "vocal_coaching"] as const;
