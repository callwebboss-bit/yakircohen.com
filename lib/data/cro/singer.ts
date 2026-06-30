import type { WizardCroConfig } from "@/lib/book-wizard-cro/types";
import { CRO_SHARED } from "@/lib/data/cro/shared";

/** stub לגל ז' */
export const SINGER_CRO_CONFIG = {
  category: "singer",
  formId: "singer_amplification_booking",
  serviceLabel: "הגברה לזמרים",
  anxieties: [
    { id: "feedback_fear", label: "חושש/ת מהמערכת תצפצף או תחרחר" },
    { id: "cant_hear_self", label: "לא שומע/ת את עצמי על הבמה" },
    { id: "surprise_costs", label: "שלא יהיו הפתעות במחיר" },
  ],
  perks: [
    { id: "soundcheck", label: "סאונדצ'ק מלא לפני ההופעה" },
    { id: "monitor_mix", label: "מוניטורים אישיים מכווננים" },
    { id: "tech_on_site", label: "טכנאי צמוד לאורך ההופעה" },
  ],
  reassuranceByAnxiety: {
    feedback_fear: {
      title: "מערכת מכווננת מראש",
      body: "טכנאי מכוון את המערכת לפני שאתם עולים. בודקים gain ומוניטורים כדי למנוע צפצופים.",
    },
  },
  transitionMessages: [
    "בודק זמינות טכנאי בשטח...",
    "מחשב עלות מערכת לפי גודל האירוע...",
    "מתאים חבילה...",
  ],
  escapePlacements: ["after_packages", "step_contact"],
  urgency: {
    slotsLabel: (n: number) => `נשארו ${n} חלונות פנויים השבוע להגברה`,
    holdPrefix: "המחיר והחבילה שמורים עבורך עוד",
    holdExpiredSoft: CRO_SHARED.step3HoldExpiredSoft,
    priceHoldBadge: "המחיר שמור ל-48 שעות",
  },
  step3Closer: "נשאר רק עוד שלב אחד קצר לנעילת ההזמנה",
  step3SummaryHeading: "סיכום קצר",
  step3ContactHeading: "פרטי ההופעה",
  exitIntent: {
    title: "רגע לפני שעוזבים",
    body: "שמרנו את המחיר שבחרתם. אפשר לחזור ולסגור בקליק.",
    cta: "המשיכו מהמקום שעצרתם",
    dismiss: "לא עכשיו, תודה",
  },
  idleHelp: {
    message: "צריך עזרה לבחור מערכת? אפשר לשלוח את הבחירות עד כה בוואטסאפ.",
    cta: "דברו איתי בוואטסאפ",
    dismiss: "המשיכו לבד",
  },
  waEscape: "מעדיף לדבר עכשיו? שלחו את הבחירות עד כה בוואטסאפ",
} satisfies WizardCroConfig;
