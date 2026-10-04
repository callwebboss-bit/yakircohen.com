import type { WizardCroConfig } from "@/lib/book-wizard-cro/types";
import { CRO_SHARED } from "@/lib/data/cro/shared";

/** config מלא לאירועים - גל ה' */
export const EVENTS_CRO_CONFIG = {
  category: "events",
  formId: "events_booking",
  serviceLabel: "אטרקציות לאירועים",
  anxieties: [
    { id: "effect_failure", label: "מפחדים שהציוד יתקע באמצע האירוע?" },
    { id: "timing_stress", label: "האירוע צפוף - חייבים הגעה מוקדמת וסגירה בזמן" },
    { id: "surprise_costs", label: "לא רוצים הפתעות במחיר או תוספות ביום האירוע" },
  ],
  perks: [
    { id: "tech_brief", label: "בריף טכני 10 דק' עם מפיק האירוע" },
    { id: "setup_photos", label: "תמונות setup מקצועיות לסטורי" },
    { id: "coordinator_call", label: "שיחת תיאום עם רכז/ת האירוע לפני ההגעה" },
  ],
  reassuranceByAnxiety: {
    effect_failure: {
      title: "ציוד גיבוי בכל אירוע",
      body: "מגיעים עם ציוד גיבוי וטכנאי צמוד, ובודקים כל ציוד לפני כניסת האורחים.",
    },
    timing_stress: {
      title: "הגעה מוקדמת מובטחת",
      body: "מגיעים לפחות 40 דקות לפני האירוע: בדיקה, חיבור ואבטחת כבלים לפני כניסת האורחים.",
    },
    surprise_costs: {
      title: "מחיר סגור מראש",
      body: "המחיר שמופיע בסיכום כולל את מה שבחרתם. תוספות ביום האירוע רק אם תבקשו במפורש.",
    },
  },
  transitionMessages: CRO_SHARED.transitionMessages,
  escapePlacements: ["after_packages", "empty_results", "step_contact"],
  step3Closer: "נשאר רק עוד שלב אחד קצר לנעילת ההזמנה",
  step3SummaryHeading: "סיכום הזמנה",
  step3ContactHeading: "פרטי האירוע",
  priceReframe: "פחות מעלות של אטרקציה בודדת בחתונה - בשביל ראש שקט לכל הערב",
  /* השדרוג נשאר, מחיר הייחוס הוסר. הקופי הצהיר "875 במקום 1,750" בזמן
     שהמוצר בפועל הוא קליפ סיכום מהיר ב-950 ש״ח, כלומר מחיר ה"לפני" מעולם
     לא נגבה. ההנחה האמיתית הייתה 75 ש״ח והקופי הציג אותה כ-875.
     מחיר ייחוס שלא נגבה בפועל הוא הצגה מטעה לפי חוק הגנת הצרכן. */
  lastMinuteUpsell: {
    label: "מצגת תמונות מקצועית לפתיחת האירוע",
    upgradeId: "photo_slideshow",
  },
  exitIntent: {
    title: "רגע לפני שעוזבים",
    body: CRO_SHARED.exitIntentBody,
    cta: "המשיכו מהמקום שעצרתם",
    dismiss: "לא עכשיו, תודה",
  },
  idleHelp: {
    message: "צריך עזרה לבחור אטרקציות? אפשר לשלוח את הבחירות עד כה בוואטסאפ.",
    cta: "דברו איתי בוואטסאפ",
    dismiss: "המשיכו לבד",
  },
  waEscape: "מעדיף לדבר עכשיו? שלחו את הבחירות עד כה בוואטסאפ",
} satisfies WizardCroConfig;
