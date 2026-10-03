import type { WizardCroConfig } from "@/lib/book-wizard-cro/types";
import { CRO_SHARED } from "@/lib/data/cro/shared";
import { getExVat } from "@/lib/data/pricing-catalog";

/** config מלא לפודקאסט - גל ו' */
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
    edit_time: {
      title: "הפרק אצלכם בסוף ההקלטה",
      body: "ההקלטה עוברת ישר מהמצלמות למחשב, עם חיתוך לפי מי שמדבר. הפרק אצלכם באותה שנייה שמסיימים להקליט.",
    },
    surprise_costs: {
      title: "מחיר סגור מראש",
      body: "המחיר שמופיע בסיכום כולל את מה שבחרתם. תוספות רק אם תבקשו במפורש.",
    },
  },
  transitionMessages: CRO_SHARED.transitionMessages,
  escapePlacements: ["after_packages", "step_contact"],
  step3Closer: "נשאר רק עוד שלב אחד קצר לנעילת ההקלטה",
  step3SummaryHeading: "סיכום קצר",
  step3ContactHeading: "פרטים לתיאום",
  priceReframe:
    "פחות מעלות של יום צילומים בודד - בשביל פרק מקצועי שעובד בשבילכם שנים",
  /* בלי "במקום 300": לרגעי שיא אין פריט קטלוג משלהם (המחיר בתוספות נגזר
     מ-studio_pitch_correction). ההנחה עצמה אמיתית ומחושבת מול המחיר שנגבה
     בפועל, אבל מחיר ייחוס מוצג רק כשהוא קשור לפריט קטלוג של אותו מוצר. */
  lastMinuteUpsell: {
    label: "רגעי שיא לרילס (עד 3 דק')",
    upgradeId: "highlights",
    promoPrice: 199,
    listPrice: getExVat("studio_pitch_correction"),
  },
  exitIntent: {
    title: "רגע לפני שעוזבים",
    body: CRO_SHARED.exitIntentBody,
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
