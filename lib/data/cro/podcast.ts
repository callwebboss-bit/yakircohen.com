import type { WizardCroConfig } from "@/lib/book-wizard-cro/types";
import { CRO_SHARED } from "@/lib/data/cro/shared";

/** stub לגל ו' */
export const PODCAST_CRO_CONFIG = {
  category: "podcast",
  formId: "podcast_booking",
  serviceLabel: "פודקאסט",
  anxieties: [
    { id: "mic_fear", label: "לא בטוח/ה איך לדבר למיקרופון" },
    { id: "edit_time", label: "חושש/ת שעריכה תיקח נצח" },
    { id: "surprise_costs", label: "שלא יהיו הפתעות במחיר" },
  ],
  perks: [
    { id: "prep_call", label: "שיחת הכנה קצרה לפני ההקלטה" },
    { id: "noise_cleanup", label: "ניקוי רעשי רקע כלול בחבילה" },
    { id: "spotify_upload", label: "העלאה לספוטיפיי כלולה" },
  ],
  reassuranceByAnxiety: {
    mic_fear: {
      title: "הדרכה לפני ההקלטה",
      body: "מלווים אותך לפני שהמיקרופון נדלק. אין צורך בניסיון קודם.",
    },
  },
  transitionMessages: [
    "מחשב זמני עריכה וניקוי רעשי רקע...",
    "בודק זמינות אולפן...",
    "מתאים חבילה לפי מספר משתתפים...",
  ],
  escapePlacements: ["after_packages", "step_contact"],
  urgency: {
    slotsLabel: (n: number) => `נשארו ${n} חלונות פנויים השבוע לפודקאסט`,
    holdPrefix: "המחיר והחבילה שמורים עבורך עוד",
    holdExpiredSoft: CRO_SHARED.step3HoldExpiredSoft,
    priceHoldBadge: "המחיר שמור ל-48 שעות",
  },
  step3Closer: "נשאר רק עוד שלב אחד קצר לנעילת ההקלטה",
  step3SummaryHeading: "סיכום קצר",
  step3ContactHeading: "פרטים לתיאום",
  exitIntent: {
    title: "רגע לפני שעוזבים",
    body: "שמרנו את המחיר שבחרתם. אפשר לחזור ולסגור בקליק.",
    cta: "המשיכו מהמקום שעצרתם",
    dismiss: "לא עכשיו, תודה",
  },
  idleHelp: {
    message: "צריך עזרה לבחור חבילה? אפשר לשלוח את הבחירות עד כה בוואטסאפ.",
    cta: "דברו איתי בוואטסאפ",
    dismiss: "המשיכו לבד",
  },
  waEscape: "מעדיף לדבר עכשיו? שלחו את הבחירות עד כה בוואטסאפ",
} satisfies WizardCroConfig;
