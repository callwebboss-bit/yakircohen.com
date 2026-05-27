/** Social media management  -  Yakir Eizmirlis brand under Yakir Cohen Productions */

export const SOCIAL_MEDIA_BRAND = "יקיר איזמירלי";

export const SOCIAL_MEDIA_TERMS = {
  items: [
    "השירות ניתן כריטיינר חודשי קבוע",
    "הפסקת התקשרות - בהודעה חודש מראש, בכתב",
    "תשלום עד ה-1 לכל חודש (עבור החודש הבא), בהעברה בנקאית בלבד",
    "כל החבילות כוללות קריאייטיב, שעת צילום בעסק ועריכה מקצועית",
  ],
  vatNote: "המחירים אינם כוללים מע״מ",
} as const;

export type RetainerTierId = "tiktok-basic" | "gold" | "premium";

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
    id: "tiktok-basic",
    name: "חבילת טיקטוק בסיסית",
    priceNis: 2500,
    priceLabel: "2,500 ₪",
    summary: "4 סרטונים בחודש",
    deliverables: [
      "כתיבת קריאייטיב",
      "שעת צילום חודשית בעסק",
      "עריכה מקצועית",
    ],
    utmCampaign: "social_media_tiktok_basic",
  },
  {
    id: "gold",
    name: "חבילת גולד",
    priceNis: 5000,
    priceLabel: "5,000 ₪",
    badge: "popular",
    summary: "טיקטוק ואינסטגרם",
    deliverables: [
      "6 סרטונים בחודש",
      "3 סטוריז בשבוע",
      "קידום אורגני לעמוד",
      "עיצוב פיד, ביו והיילייטס",
    ],
    utmCampaign: "social_media_gold",
  },
  {
    id: "premium",
    name: "חבילת פרימיום",
    priceNis: 7800,
    priceLabel: "7,800 ₪",
    summary: "אינסטגרם + טיקטוק + פייסבוק",
    deliverables: [
      "8 סרטונים בחודש",
      "סטוריז בכל יום (א׳-ה׳)",
      "קידום אורגני, עיצוב פיד, ביו והיילייטס",
      "שיחת ייעוץ עסקי ותכנון חודשית",
      "קידום ממומן לפי תקציב הלקוח (כולל קמפיינים מלאים)",
    ],
    utmCampaign: "social_media_premium",
  },
] as const;

export type OneOffServiceId =
  | "edit-only"
  | "single-video"
  | "bank-4"
  | "bank-8"
  | "stories-bank"
  | "consult-30"
  | "consult-60";

export type OneOffService = {
  id: OneOffServiceId;
  name: string;
  priceLabel: string;
  priceNote?: string;
  description: string;
  utmCampaign: string;
};

export const ONE_OFF_SERVICES: readonly OneOffService[] = [
  {
    id: "edit-only",
    name: "עריכת סרטון לסושיאל (עד דקה)",
    priceLabel: "החל מ-200 ₪",
    description: "עריכה בלבד ללא צילום - חיתוכים, סאונד ברקע וכתוביות",
    utmCampaign: "social_media_oneoff_edit",
  },
  {
    id: "single-video",
    name: "צילום ועריכת סרטון אחד",
    priceLabel: "1,000 ₪",
    description: "כולל קריאייטיב",
    utmCampaign: "social_media_oneoff_single",
  },
  {
    id: "bank-4",
    name: "צילום ועריכת 4 סרטונים",
    priceLabel: "3,000 ₪",
    description: "בנק סרטונים לחודש או לקמפיין",
    utmCampaign: "social_media_oneoff_bank4",
  },
  {
    id: "bank-8",
    name: "צילום ועריכת 8 סרטונים",
    priceLabel: "5,000 ₪",
    description: "בנק סרטונים מורחב",
    utmCampaign: "social_media_oneoff_bank8",
  },
  {
    id: "stories-bank",
    name: "עריכת בנק סטוריז (20 סטוריז)",
    priceLabel: "1,000 ₪",
    description: "עריכה בלבד לסטוריז",
    utmCampaign: "social_media_oneoff_stories",
  },
  {
    id: "consult-30",
    name: "שיחת ייעוץ טלפונית עם יקיר",
    priceLabel: "700 ₪",
    priceNote: "עד 30 דקות",
    description: "ייעוץ ממוקד לתוכן ואסטרטגיה",
    utmCampaign: "social_media_consult_30",
  },
  {
    id: "consult-60",
    name: "שיחת ייעוץ טלפונית עם יקיר",
    priceLabel: "1,000 ₪",
    priceNote: "עד שעה",
    description: "ייעוץ מעמיק לתוכן, פלטפורמות ותכנון",
    utmCampaign: "social_media_consult_60",
  },
] as const;

export const GEO_PROMO = {
  discountPercent: 10,
  cities: ["מודיעין", "כפר סבא", "אילת"] as const,
  validUntilIso: "2026-07-01",
  headline: "10% הנחה לעסקים במודיעין, כפר סבא ואילת",
  subline: "בתוקף עד סוף חודש יוני 2026",
  storageKey: "social_media_promo_dismissed",
  utmCampaign: "social_media_promo_june",
} as const;

/** End of June 2026  -  promo hidden from July 1 server-side */
export function isSocialMediaPromoActive(now = new Date()): boolean {
  return now < new Date(GEO_PROMO.validUntilIso);
}

export const HERO_EXPERTISE = [
  {
    icon: "video" as const,
    title: "תוכן וידאו",
    body: "סרטונים ויראליים לטיקטוק, רילס ושורטס",
  },
  {
    icon: "radio" as const,
    title: "רדיו ופרסום",
    body: "ניסיון מעולם השידור והקמפיינים",
  },
  {
    icon: "mic" as const,
    title: "הנחיה וסדנאות",
    body: "טיקטוק, אינסטגרם ותקשורת מול מצלמה",
  },
  {
    icon: "sparkles" as const,
    title: "אסטרטגיה",
    body: "תוכן, קידום ותוצאות בשטח",
  },
] as const;

export const ABOUT_PARAGRAPHS = [
  `${SOCIAL_MEDIA_BRAND}, יוצר תוכן בעל עשרות אלפי עוקבים וקהל רב ברשתות. מתמחה בשיווק ברשתות החברתיות ובניית נוכחות דיגיטלית מנצחת.`,
  "עם ניסיון של שנים בעבודה מול עסקים, חברות, מותגים ואמנים - אנחנו יודעים לקחת כל רעיון ולהפוך אותו לחשיפה ויראלית שמביאה תוצאות אמיתיות.",
  "מעבר לניהול קמפיינים חכמים ומדויקים, יקיר מביא עמו ניסיון עשיר גם מתחום הרדיו, הפרסומות, הפודקאסטים וההנחיה - ומעביר סדנאות מעשיות בנושא טיקטוק, אינסטגרם, תקשורת וביצירת תוכן שמצליח לגעת בקהל.",
  "הצוות המסור שלנו יבנה יחד איתכם אסטרטגיה מותאמת אישית ויקח את העסק שלכם לשלב הבא - תוכן ויראלי, פרסום נכון ומדויק, ותוצאות בשטח.",
  `${SOCIAL_MEDIA_BRAND} והצוות ישמחו ללוות אתכם בדרך לחשיפה גדולה, מותג חזק ולקוחות חדשים.`,
] as const;

export const PAGE_FEATURES = [
  "ריטיינר חודשי עם צילום ועריכה בעסק",
  "טיקטוק, אינסטגרם ופייסבוק - לפי חבילה",
  "שירותים חד פעמיים לעריכה, צילום וייעוץ",
  "סדנאות וליווי תוכן מעשי",
] as const;
