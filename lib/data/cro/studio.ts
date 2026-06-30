import type { WizardCroConfig } from "@/lib/book-wizard-cro/types";
import { CRO_SHARED } from "@/lib/data/cro/shared";

export const STUDIO_CRO_CONFIG = {
  category: "studio",
  formId: "studio_recording_booking",
  serviceLabel: "הקלטה באולפן",
  anxieties: [
    { id: "vocal_fix", label: "אני קצת מזייף, צריך תיקון קולי חזק" },
    { id: "fast_delivery", label: "חשוב לי שהשירים יצאו מהר" },
    { id: "no_surprises", label: "שלא יהיו הפתעות ותוספות במחיר" },
  ],
  perks: [
    { id: "coffee", label: "עמדת קפה מפנקת ונשנושים" },
    { id: "photos", label: "3 תמונות אווירה מקצועיות לסטורי" },
    { id: "vocal_warmup", label: "15 דקות חימום קולי על חשבון הבית" },
  ],
  reassuranceByAnxiety: {
    vocal_fix: {
      title: "אפס סיכון קולי",
      body: "אנחנו מציגים את המציאות: אם צריך תיקון - Melodyne ו-Auto-Tune מנקים זיופים. זה לא קסם; צריך גם ביצוע סביר. המטרה: תוצאה נקייה שתרגישו בנוח לשתף.",
    },
  },
  transitionMessages: [
    "בודק זמינות טכנאים...",
    "מחשב עלויות חבילה...",
    "מתאים הטבות אישיות...",
  ],
  decoy: {
    emoji: "💎",
    name: "Celebrity VIP Production",
    description:
      "יום הפקה שלם באולפן: ליווי מפיק מנוסה, הדרכה קולית מלאה לפני הקלטה, ובניית ליין-אפ מותאם - לא רק \"שעה במיקרופון\".",
    highlights: [
      "יום הפקה שלם + מפיק/מוזיקאי מלווה לאורך כל הסשן",
      "הדרכה קולית מלאה, חימום מודרך, ותרגול לפני הקלטה",
      "קליפ 4K מרובה מצלמות + עריכת מאסטר עם שותף מיקס במיאמי (תיאום מראש)",
      "ליווי קידום: רילס, BTS, ותוכנית פרסום ל-30 יום",
      "בר קליל ואירוח מלא לאורך היום - לפרויקטים גדולים בלבד",
    ],
    priceExVat: 8900,
    badge: "להשוואה בלבד",
    footnote:
      "חבילה מותאמת אישית לפרויקטים גדולים - לא נרכשת בטופס. נתאם בוואטסאפ לפי היקף, זמן באולפן ודרישות קידום.",
    ariaLabel: "חבילת הפקה באולפן הקלטות במודיעין - להשוואה בלבד",
    ctaPrimary: "דבר עם מפיק ראשי",
    ctaSecondary: CRO_SHARED.decoyWaitlistNote,
    waitlistUtmCampaign: "studio_decoy_waitlist",
  },
  escapePlacements: ["after_packages", "after_high_price", "step_contact"],
  urgency: {
    slotsLabel: (n: number) => `נשארו ${n} חלונות פנויים השבוע באולפן`,
    holdPrefix: "המחיר, הצ'ופר והחניה שמורים עבורך עוד",
    holdExpiredSoft: CRO_SHARED.step3HoldExpiredSoft,
    priceHoldBadge: "המחיר שמור ל-48 שעות",
  },
  step3Closer: "נשאר רק עוד שלב אחד קצר לנעילת הסשן שלך",
  step3SummaryHeading: "סיכום קצר",
  step3ContactHeading: "פרטים לתיאום",
  priceReframe:
    "פחות מעלות של שופינג חולף בקניון - בשביל מזכרת מקצועית שנשארת איתכם לכל החיים",
  parkingCopy:
    "סידרנו לך ראש תל-אביבי שקט. חניה פרטית, מקורה ובחינם מחכה לך ישירות מתחת לאולפן. השלט לפתיחת המחסום יישלח אליך אוטומטית בוואטסאפ.",
  lastMinuteUpsell: {
    label: "להוסיף סרטון מאחורי הקלעים (BTS) לסטורי - 99 ₪ במקום 250 ₪",
    upgradeId: "bts",
    promoPrice: 99,
    listPrice: 250,
  },
  fitMeterLabel: "התאמה לצרכים שלך",
  fitMeterDetail: "החבילה מתאימה - בלי תוספות מיותרות",
  exitIntent: {
    title: "רגע לפני שעוזבים",
    body: "שמרנו את המחיר שבחרתם ל-48 שעות. אפשר לחזור ולסגור בקליק בלי להתחיל מחדש.",
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

/** תאימות לאחור - מיפוי ל-book-wizard-copy.ts */
export const STUDIO_WIZARD_COPY_FROM_CONFIG = {
  sessionPriorityQuestion: "מה הכי חשוב לך בסשן?",
  sessionPriorityVocal: STUDIO_CRO_CONFIG.anxieties[0].label,
  sessionPriorityFast: STUDIO_CRO_CONFIG.anxieties[1].label,
  sessionPriorityPrice: STUDIO_CRO_CONFIG.anxieties[2].label,
  welcomePerkQuestion: "בחרו צ'ופר הגעה ללא עלות",
  welcomePerkCoffee: STUDIO_CRO_CONFIG.perks[0].label,
  welcomePerkPhotos: STUDIO_CRO_CONFIG.perks[1].label,
  welcomePerkWarmup: STUDIO_CRO_CONFIG.perks[2].label,
  parkingBanner: STUDIO_CRO_CONFIG.parkingCopy!,
  pitchSafetyTitle: STUDIO_CRO_CONFIG.reassuranceByAnxiety.vocal_fix!.title,
  pitchSafetyBody: STUDIO_CRO_CONFIG.reassuranceByAnxiety.vocal_fix!.body,
} as const;
