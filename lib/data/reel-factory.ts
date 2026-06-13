/** The Reel Factory - B2B promo editing for event vendors */

import type { ProcessStep } from "@/components/marketing/ProcessSteps";
import type { FAQItem } from "@/components/ui/FAQAccordion";
import { getExVat } from "@/lib/data/pricing-catalog";

export const REEL_FACTORY_BRAND = "מפעל הרילס לספקים";
export const REEL_FACTORY_TAGLINE = "The Reel Factory";

export const REEL_FACTORY_TERMS = {
  items: [
    "השירות ניתן כריטיינר חודשי קבוע או כהזמנה חד-פעמית לפי אירוע",
    "הפסקת התקשרות במנוי - בהודעה חודש מראש, בכתב",
    "תשלום עד ה-1 לכל חודש (עבור החודש הבא), בהעברה בנקאית בלבד",
    "חומר גולמי: 5-10 קליפים של 3-15 שניות מהרחבה, דרך וואטסאפ או Drive",
    "מסירת Rave 24h: העלאה עד 04:00 בבוקר = רילס מוכן עד 12:00 בצהריים",
  ],
  vatNote: "המחירים אינם כוללים מע״מ",
} as const;

export const PAGE_FEATURES = [
  "רילס Rave ערוך תוך 24 שעות מאירוע",
  "AI + עורך וידאו - ביט-סינק, אפקטים וצבע",
  "מנוי חודשי: 4-8 פרומואים + פוסטים שיווקיים",
  "מיועד ל-DJ, צלמים, מפיקים ומפעילי אטרקציות",
] as const;

export type OneOffTierId = "single" | "rave-24h";

export type OneOffTier = {
  id: OneOffTierId;
  name: string;
  priceNis: number;
  priceLabel: string;
  priceNote?: string;
  description: string;
  deliverables: readonly string[];
  utmCampaign: string;
};

export const ONE_OFF_TIERS: readonly OneOffTier[] = [
  {
    id: "single",
    name: "פרומו רילס בודד",
    priceNis: getExVat("reel_factory_single"),
    priceLabel: `${getExVat("reel_factory_single").toLocaleString("he-IL")} ₪`,
    priceNote: "לפני מע״מ",
    description: "חיתוך קצבי, כתוביות בסיסיות ומסירה מוכנה לפרסום.",
    deliverables: [
      "עריכה מ-5-10 קליפים גולמיים",
      "כתוביות בעברית",
      "פורמט 9:16 לאינסטגרם וטיקטוק",
      "מסירה תוך 2-3 ימי עסקים",
    ],
    utmCampaign: "reel_factory_single",
  },
  {
    id: "rave-24h",
    name: "Rave ערוך תוך 24 שעות",
    priceNis: getExVat("reel_factory_rave_24h"),
    priceLabel: `${getExVat("reel_factory_rave_24h").toLocaleString("he-IL")} ₪`,
    priceNote: "לפני מע״מ - מסירה עד 12:00",
    description:
      "סרטון קצבי עם סאונד מנורמל, אפקטים על הביט וצבעים שעושים חשק.",
    deliverables: [
      "ביט-סינק ואפקטים ויזואליים מדויקים",
      "נורמליזציית סאונד ותיקון צבע",
      "גרסה מוכנה לרילס וטיקטוק",
      "העלאה עד 04:00 = מסירה 12:00 בצהריים",
    ],
    utmCampaign: "reel_factory_rave_24h",
  },
] as const;

export type RetainerTierId = "starter" | "pro";

export type RetainerTier = {
  id: RetainerTierId;
  name: string;
  priceNis: number;
  priceLabel: string;
  badge?: "popular";
  summary: string;
  deliverables: readonly string[];
  utmCampaign: string;
};

export const RETAINER_TIERS: readonly RetainerTier[] = [
  {
    id: "starter",
    name: "Content Hub בסיס",
    priceNis: getExVat("reel_factory_starter_monthly"),
    priceLabel: `${getExVat("reel_factory_starter_monthly").toLocaleString("he-IL")} ₪`,
    badge: "popular",
    summary: "4 פרומואים בחודש + פוסטים שיווקיים",
    deliverables: [
      "4 סרטוני פרומו ערוכים לאינסטגרם וטיקטוק",
      "כתיבת פוסטים שיווקיים מבוססי דאטה לכל אירוע",
      "עדיפות בפס הייצור 24 שעות",
      "תבנית מותג אחידה לכל הרילסים",
    ],
    utmCampaign: "reel_factory_starter",
  },
  {
    id: "pro",
    name: "Content Hub פרו",
    priceNis: getExVat("reel_factory_pro_monthly"),
    priceLabel: `${getExVat("reel_factory_pro_monthly").toLocaleString("he-IL")} ₪`,
    summary: "8 פרומואים + פוסטים + כיתובים לכל פלטפורמה",
    deliverables: [
      "8 סרטוני פרומו ערוכים בחודש",
      "פוסטים שיווקיים + כיתובים מותאמים לכל פלטפורמה",
      "עדיפות מקסימלית בפס הייצור",
      "ליווי חודשי לתוכן ואסטרטגיית פרסום",
    ],
    utmCampaign: "reel_factory_pro",
  },
] as const;

export const PIPELINE_STEPS: ProcessStep[] = [
  {
    number: 1,
    title: "סיום אירוע - 02:00",
    description:
      "הספק מסיים אירוע ומצלם 5-10 קליפים קצרים מהרחבה - אנרגיה, קהל, ציוד.",
  },
  {
    number: 2,
    title: "העלאה מהטלפון",
    description:
      "שולחים את הקליפים הגולמיים בוואטסאפ, Drive או דרך עמוד שליחת הקבצים - עד 04:00 בבוקר.",
  },
  {
    number: 3,
    title: "AI + עורך וידאו",
    description:
      "המערכת מנתחת ביטים ורגעי שיא. עורך מסנכרן אפקטים, צבע וסאונד לרילס Rave.",
  },
  {
    number: 4,
    title: "מסירה - 12:00",
    description:
      "רילס מוכן לפרסום + טקסט פוסט שיווקי (במנוי). מוכן להביא את הלקוח הבא.",
  },
];

export type TargetAudience = {
  icon: string;
  title: string;
  body: string;
};

export const TARGET_AUDIENCES: readonly TargetAudience[] = [
  {
    icon: "🎧",
    title: "תקליטנים",
    body: "תיעוד מהרחבה שמראה את האנרגיה שלכם - בלי לשבת על עריכה אחרי לילה ארוך.",
  },
  {
    icon: "📸",
    title: "צלמי אירועים",
    body: "הפכו B-Roll גולמי לרילסים שממלאים את הפיד ומביאים פניות חדשות.",
  },
  {
    icon: "🎬",
    title: "מפיקים",
    body: "תוכן שיווקי עקבי לכל אירוע - מנוי חודשי שמחזיק את הנוכחות הדיגיטלית.",
  },
  {
    icon: "✨",
    title: "מפעילי אטרקציות",
    body: "הראו את האפקטים, הבועות והזיקוקים בקצב שגורם ללקוחות הבאים לסגור.",
  },
];

export const ABOUT_PARAGRAPHS = [
  "כל דיג'יי, צלם, מפיק ומפעיל אטרקציות חייב סרטונים מטורפים לטיקטוק ולאינסטגרם מהאירועים האחרונים שלו כדי להביא את הלקוח הבא - אבל אין להם זמן או ידע לערוך.",
  "מפעל הרילס לספקים הוא פס ייצור מקצועי: מעלים חומר גולמי מהטלפון, ומקבלים רילס Rave ערוך, קצבי, עם סאונד מנורמל, אפקטים ויזואליים מדויקים על הביט, וצבעים שעושים חשק לסגור איתו.",
  "שילוב של AI ועורכי וידאו זריזים מאפשר מסירה תוך 24 שעות - או מנוי חודשי עם 4-8 פרומואים ופוסטים שיווקיים מבוססי דאטה לכל האירועים שלכם.",
] as const;

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "what-to-film",
    question: "מה צריך לצלם מהרחבה?",
    answer:
      "5-10 קליפים של 3-15 שניות כל אחד - אנרגיה גבוהה, קהל, ציוד, רגעי שיא. לא צריך צילום מקצועי, מספיק מהטלפון.",
  },
  {
    id: "upload-deadline",
    question: "עד מתי מעלים כדי לקבל ב-12:00?",
    answer:
      "העלאה עד 04:00 בבוקר לאחר האירוע = מסירה עד 12:00 בצהריים. העלאה מאוחרת יותר - מסירה ביום העסקים הבא.",
  },
  {
    id: "subscription-required",
    question: "האם חייבים מנוי?",
    answer:
      "לא. אפשר להזמין פרומו בודד או Rave 24 שעות לפי אירוע. המנוי החודשי משתלם לספקים עם 3+ אירועים בחודש.",
  },
  {
    id: "how-to-upload",
    question: "איך שולחים את החומר?",
    answer:
      "וואטסאפ, Google Drive, Dropbox או דרך עמוד שליחת הקבצים באתר. כל פורמט וידאו מהטלפון מתקבל.",
  },
  {
    id: "posts-included",
    question: "מה כוללים הפוסטים השיווקיים?",
    answer:
      "טקסט מוכן לפרסום עם הוק, תיאור האירוע, קריאה לפעולה והאשטגים רלוונטיים - מותאם לסגנון שלכם ולפלטפורמה.",
  },
  {
    id: "cancel",
    question: "איך מפסיקים מנוי?",
    answer: "בהודעה בכתב, חודש מראש - בלי הפתעות.",
  },
];

export const HUB_WHATSAPP_TEXT =
  "שלום, אני ספק אירועים ומעוניין/ת במפעל הרילס - אשמח לשמוע על חבילות Rave 24h ומנוי Content Hub";
