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
      title: "אפס תקלות טכניות",
      body: "ראש שקט: צוות גיבוי מלא וטכנאי צמוד מתחייבים לאפס תקלות טכניות. בודקים כל ציוד לפני כניסת האורחים.",
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
  transitionMessages: [
    "בודק זמינות מלאי ציוד הגברה ותאורה לתאריך המבוקש...",
    "מחשב חבילה משולבת...",
    "מתאים הטבות לאירוע...",
  ],
  decoy: {
    emoji: "🎆",
    name: "Mega Wedding Spectacle",
    description: "חבילת ענק לחתונה: עשן כבד, זיקוקים, DJ, צילום 4K וטכנאי צמוד ליום שלם.",
    highlights: [
      "3 אטרקציות פרימיום + הפעלה מלאה",
      "DJ פרימיום + מערכת הגברה",
      "צילום 4K + סרטון ערוך לרשתות",
      "טכנאי צמוד מההגעה ועד סיום",
    ],
    priceExVat: 18500,
    badge: "להשוואה בלבד",
    footnote: "חבילה מותאמת לפרויקטים גדולים - לא נרכשת בטופס.",
    ariaLabel: "חבילת אטרקציות לאירועים במרכז - להשוואה בלבד",
    ctaPrimary: "דבר עם מפיק ראשי",
    ctaSecondary: CRO_SHARED.decoyWaitlistNote,
    waitlistUtmCampaign: "events_decoy_waitlist",
  },
  escapePlacements: ["after_packages", "empty_results", "step_contact"],
  urgency: {
    slotsLabel: (n: number) => `נשארו ${n} חלונות פנויים השבוע לאירועים`,
    holdPrefix: "המחיר והחבילה שמורים עבורך עוד",
    holdExpiredSoft: CRO_SHARED.step3HoldExpiredSoft,
    priceHoldBadge: "המחיר שמור ל-48 שעות",
  },
  step3Closer: "נשאר רק עוד שלב אחד קצר לנעילת ההזמנה",
  step3SummaryHeading: "סיכום הזמנה",
  step3ContactHeading: "פרטי האירוע",
  priceReframe: "פחות מעלות של אטרקציה בודדת בחתונה - בשביל ראש שקט לכל הערב",
  lastMinuteUpsell: {
    label: "מצגת תמונות מקצועית לפתיחת האירוע - 875 ₪ במקום 1,750 ₪",
    upgradeId: "photo_slideshow",
    promoPrice: 875,
    listPrice: 1750,
  },
  exitIntent: {
    title: "רגע לפני שעוזבים",
    body: "שמרנו את הבחירה שלכם. אפשר לחזור ולסגור בקליק.",
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
