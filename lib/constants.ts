
export const SITE_NAME = "יקיר כהן הפקות";

/* שם האדם, להבדיל משם העסק. הסכמה הצהירה על #founder כמחבר של 87 פוסטי
   הבלוג בזמן שהשורה הגלויה הדפיסה את שם העסק, כלומר הקוד והעמוד טענו שני
   מחברים שונים. השם היה קשיח בשני קבצי סכמה. */
export const FOUNDER_NAME = "יקיר כהן";

/** Short label for page kickers (no first name) */
export const SITE_KICKER = "הפקות מקצועית במודיעין";

/** Brand logo - header and footer */
export const SITE_LOGO_SRC = "/images/logo.svg";

/** Studio photo for hero and studio marketing blocks */
export const SITE_STUDIO_IMAGE_SRC =
  "/images/services/studio/hub/אולפן פודקאסט - יקיר כהן 1.webp";

export const SOCIAL_LINKS = [
  {
    href: "https://www.instagram.com/yakir.cohen.official/",
    label: "Instagram",
    icon: "📸",
  },
  {
    href: "https://www.tiktok.com/@yakir.cohen.offical",
    label: "TikTok",
    icon: "🎵",
  },
  {
    href: "https://www.facebook.com/dj.yakir.cohen/",
    label: "Facebook",
    icon: "👍",
  },
  {
    href: "https://www.youtube.com/@Yakircohen",
    label: "YouTube",
    icon: "▶️",
  },
] as const;

/** Homepage featured reel - @Yakircohen */
export const FEATURED_YOUTUBE_VIDEO_ID = "XUr2e5S4JSA";
export const FEATURED_YOUTUBE_TITLE =
  "אולפן, אירועים ופודקאסט במודיעין";

export const CONTACT_PHONE_DISPLAY = "058-7555456";
export const CONTACT_PHONE_E164 = "+972587555456";
export const CONTACT_PHONE_WHATSAPP = "972587555456";

/**
 * Internal / legal requests only - never shown on public pages (anti-spam).
 * Contact UX: WhatsApp + phone only.
 */
export const CONTACT_EMAIL_INTERNAL = "callwebboss@gmail.com";

/** Physical studio - footer, contact, schema */
export const STUDIO_ADDRESS_TITLE = "יקיר כהן הפקות - אולפן הקלטות במודיעין";
export const STUDIO_ADDRESS_LINE =
  "עמק איילון 34, מודיעין מכבים רעות";

/** הנוסח שיקיר כתב בתיאור של כרטיס גוגל (4.10.2026). בכרטיס מסומן "יש קבלת קהל במקום",
    כלומר השירות ניתן בכתובת, וההגעה בתיאום מראש. שתי השורות צריכות להיות זהות. */
export const STUDIO_VISIT_NOTE = "הגעה לאולפן בתיאום מראש בלבד";

/* החלטות בעלים 4.10.2026: הכתובת המלאה לא מוצגת בתשובות ובעמודים. היא נמסרת
   בשיחה או בוואטסאפ, אחרי תיאום. הסכמה (PostalAddress) נשארת כמו שהייתה. */
export const STUDIO_ADDRESS_COORDINATION_NOTE =
  "הכתובת והתיאום נקבעים בשיחה או בוואטסאפ, אחרי תיאום";

/* החלטות בעלים 4.10.2026: נוסח אחד לחניה בכל מקום שמתאר אותה. */
export const STUDIO_PARKING_NOTE =
  "חניה פרטית מקורה במקום (בתיאום מראש), וחניה בשפע בחינם באזור";

/* נקודת הסיכה של העסק במפות Google (נבדק 3.10.2026). קודם היו באתר שלוש
   קואורדינטות שונות (31.901, 31.896, 31.9077), אף אחת לא בדיוק על הסיכה. */
export const STUDIO_GEO = { latitude: 31.904389, longitude: 35.013881 } as const;

/** Combined line for metadata / schema */
export const STUDIO_ADDRESS = `${STUDIO_ADDRESS_TITLE}, ${STUDIO_ADDRESS_LINE}`;

export const STUDIO_MAPS_URL = "https://maps.app.goo.gl/mZXM2wzCtZpFKT5Y8";

export const STUDIO_GOOGLE_MAPS_URL = STUDIO_MAPS_URL;

export const STUDIO_WAZE_URL = STUDIO_MAPS_URL;

/** Footer-only links (trust links live in FOOTER_SEMANTIC_TREE column 5) */
export const FOOTER_EXTRA_LINKS: readonly { href: string; label: string }[] = [
  { href: "/podcast", label: "מרכז הפודקאסט" },
];

export const FOOTER_LEGAL_LINKS = [
  { href: "/privacy", label: "מדיניות פרטיות" },
  { href: "/accessibility", label: "הצהרת נגישות" },
  { href: "/terms", label: "תנאי שירות" },
  { href: "/sustainability", label: "הצהרת מדיניות קיימות" },
] as const;

export type LegalPageHref = (typeof FOOTER_LEGAL_LINKS)[number]["href"];

export const BUSINESS_HOURS = [
  { days: "ראשון - חמישי", hours: "09:00 - 22:00" },
  { days: "שישי", hours: "09:00 - 14:00" },
  { days: "מוצאי שבת", hours: "21:00 - 22:30" },
] as const;

/**
 * שעות הקבלה שלמעלה הן מתי עונים, ולא מתי אפשר לפנות. אפשר לשלוח הודעה
 * בכל שעה חוץ משבת וחג. כל מקום באתר שמציג שעות חייב לקרוא מכאן:
 * קודם היו ארבע גרסאות סותרות, ואחת מהן היא מה שגוגל מציג בכרטיס העסק.
 */
export const BUSINESS_HOURS_NOTE =
  "מקבלים פניות מסביב לשעון חוץ משבת וחג. מענה אנושי, הכי מהר שאפשר. פגישות והקלטות בתיאום מראש.";

/** Trust metrics - homepage, book page, badges (edit values here) */
/* 5.0 ו-241 ביקורות לפי כרטיס Google Business, אושר על ידי הבעלים 4.10.2026 */
export const GOOGLE_RATING = "5.0";
export const GOOGLE_RATING_BEST = "5";
export const GOOGLE_RATING_WORST = "1";
/** Optional - shown in badge + schema when set (update from Google Business Profile) */
export const GOOGLE_REVIEW_COUNT = "241";
export const GOOGLE_RATING_LABEL = "דירוג Google";

/** שנת ההקמה של העסק, כפי שהיא מופיעה ב-lib/seo/site-schema.json */
export const BUSINESS_FOUNDING_YEAR = 2010;

/**
 * השנה שבה יקיר התחיל לעבוד בסאונד, להבדיל משנת הקמת העסק.
 *
 * שני המספרים האלה נראו סותרים: העמוד הצהיר "20+ שנות ניסיון" והסכמה
 * הצהירה foundingDate 2010, כלומר 16 שנה. ההסבר קיים ב-TRUST_STATS_CLARIFICATION
 * לגולש, ומכאן הוא מגיע גם לסכמה, כך שגם מכונה תוכל ליישב אותם.
 *
 * הערך נמסר על ידי הבעלים. lib/constants.test.ts מוודא ש-"20+" המוצג
 * עדיין מתיישב איתו, כדי שהמספר לא יתיישן בשקט.
 *
 * 4.10.2026, הבעלים: "שנת תחילת הקריירה 2001. שנת פתיחת העסק 2010" (היה
 * 2004). 1.12.2001 בכרטיס Google Business הוא שנת הקריירה, לא ההקמה.
 */
export const FOUNDER_CAREER_START_YEAR = 2001;

export const SITE_TRUST_STATS = [
  { value: "20+", label: "שנות ניסיון" },
  { value: "5,000+", label: "לקוחות מרוצים" },
  { value: `${GOOGLE_RATING} ★`, label: GOOGLE_RATING_LABEL },
] as const;

/**
 * מקור לכל מספר אמון שמוצג באתר.
 *
 * למה זה קיים: שלושת המספרים בפס האמון נכנסים גם ל-JSON-LD, כלומר גוגל
 * מצטט אותם כעובדה. עד 4.10.2026 רק "20+ שנות ניסיון" היה מוגן בבדיקה,
 * ואפשר היה לשנות את הדירוג או את מספר הביקורות בלי שאף אחד ישים לב.
 *
 * הכלל: כל ערך ב-SITE_TRUST_STATS, וכן הדירוג ומספר הביקורות, חייב
 * רשומה כאן עם מקור ועם מי אישר. lib/constants.test.ts מוודא שהערך
 * ברשומה זהה לערך המוצג, ושאין רשומה שלא מתאימה לכלום. אם מישהו משנה
 * מספר ולא מעדכן את המקור, הבדיקה נופלת.
 */
export type TrustClaimSource = {
  /** הערך בדיוק כפי שהוא מוצג לגולש */
  value: string;
  /** מאיפה המספר הגיע. לא "הערכה" */
  source: string;
  approvedBy: string;
  /** ISO */
  approvedAt: string;
  /** true כשהמקור עדיין לא נמסר על ידי הבעלים */
  needsOwnerConfirmation?: true;
};

export const TRUST_CLAIM_SOURCES: readonly TrustClaimSource[] = [
  {
    value: "20+",
    source:
      `ותק אישי מ-${FOUNDER_CAREER_START_YEAR}, להבדיל מהקמת העסק ב-${BUSINESS_FOUNDING_YEAR}. ` +
      "הבדיקה מוודאת שהמספר לא מתיישן ולא מגזים",
    approvedBy: "owner",
    approvedAt: "2026-09-15",
  },
  {
    value: "5,000+",
    source: "טרם תועד. הבעלים נשאל ב-4.10.2026 מאיפה המספר",
    approvedBy: "owner",
    approvedAt: "2026-10-04",
    needsOwnerConfirmation: true,
  },
  /* הערכים כאן כתובים כמחרוזת קבועה ובכוונה לא נגזרים מהקבועים שמעליהם.
     נוסח ראשון השתמש ב-`${GOOGLE_RATING} ★`, ואז הרשומה זזה יחד עם הקבוע
     והבדיקה לא יכלה ליפול לעולם. מספר שמשתנה חייב לשבור את ההתאמה. */
  {
    value: "4.9 ★",
    source: "כרטיס Google Business Profile של העסק",
    approvedBy: "owner",
    approvedAt: "2026-10-04",
  },
  {
    value: "241",
    source: "מספר הביקורות בכרטיס Google, אושר על ידי הבעלים",
    approvedBy: "owner",
    approvedAt: "2026-10-04",
  },
];

/**
 * "20+ שנות ניסיון" הוא הוותק האישי של יקיר, לא גיל העסק. העסק הוקם ב-2010,
 * וכך גם רשום ב-foundingDate בסכמה. בלי ההבחנה הזו שתי הטענות סותרות זו את זו
 * באותו עמוד, וזה בדיוק סוג הפער שפוגע באמון.
 */
export const TRUST_STATS_CLARIFICATION = `ניסיון אישי של 20+ שנים · האולפן פועל מאז ${BUSINESS_FOUNDING_YEAR} · ${GOOGLE_REVIEW_COUNT}+ ביקורות מאומתות ב-Google`;
