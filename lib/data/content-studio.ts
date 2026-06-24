/** Content Studio -- Social Dump: batch reels from studio session */

import type { FAQItem } from "@/components/ui/FAQAccordion";
import { getExVat } from "@/lib/data/pricing-catalog";

export const CONTENT_STUDIO_BRAND = "סושיאל דאמפ";
export const CONTENT_STUDIO_TAGLINE = "Content Studio";

export const CONTENT_STUDIO_TERMS = {
  items: [
    "הסשן מתקיים באולפן במודיעין, לא בצילום בשטח (לצילום בעסק: ניהול סושיאל)",
    "ריטיינר חודשי: התקשרות קבועה, הפסקה בהודעה חודש מראש בכתב",
    "תשלום ריטיינר עד ה-1 לכל חודש, בהעברה בנקאית",
    "מסירת סרטונים: 5 ימי עסקים לאחר הסשן (פיילוט: 3 ימים)",
    "כתוביות צבעוניות בסגנון שמתאים לרילז וטיקטוק",
  ],
  vatNote: "המחירים אינם כוללים מע״מ",
} as const;

export const PAGE_FEATURES = [
  "2 שעות באולפן, עשרות סרטונים קצרים מוכנים לפרסום",
  "טיפים, סיפורים ושאלות ותשובות במקום פרק ארוך אחד",
  "כתוביות צבעוניות בפורמט 9:16 לרילז, טיקטוק ושורטס",
  "ריטיינר חודשי: תוכן שוטף בלי לרדוף צלמים",
] as const;

export type ContentStudioTierId = "pilot" | "session" | "retainer";

export type ContentStudioTier = {
  id: ContentStudioTierId;
  name: string;
  priceNis: number;
  priceLabel: string;
  priceNote?: string;
  badge?: string;
  description: string;
  deliverables: readonly string[];
  utmCampaign: string;
};

export const CONTENT_STUDIO_TIERS: readonly ContentStudioTier[] = [
  {
    id: "retainer",
    name: "ריטיינר חודשי",
    priceNis: getExVat("content_studio_retainer"),
    priceLabel: `${getExVat("content_studio_retainer").toLocaleString("he-IL")} ₪`,
    priceNote: "לחודש · לפני מע״מ",
    badge: "הכי משתלם",
    description: "סשן חודשי באולפן ותוכן שוטף. לעסקים שרוצים נוכחות קבועה.",
    deliverables: [
      "סשן צילום חודשי באולפן (עד 2 שעות)",
      "8–12 רילז או שורטס ערוכים",
      "2 סבבי תיקון",
      "תבניות כתוביות קבועות למותג",
    ],
    utmCampaign: "content_studio_retainer",
  },
  {
    id: "session",
    name: "סשן סושיאל דאמפ",
    priceNis: getExVat("content_studio_session"),
    priceLabel: `${getExVat("content_studio_session").toLocaleString("he-IL")} ₪`,
    priceNote: "חד פעמי · לפני מע״מ",
    badge: "הנבחרת",
    description: "יום צילום מרוכז: 2 שעות באולפן, חודש של תוכן לרשתות.",
    deliverables: [
      "2 שעות הקלטה/צילום באולפן",
      "12 רילז או שורטס ערוכים",
      "כתוביות צבעוניות",
      "מסירה תוך 5 ימי עסקים",
    ],
    utmCampaign: "content_studio_session",
  },
  {
    id: "pilot",
    name: "פיילוט",
    priceNis: getExVat("content_studio_pilot"),
    priceLabel: `${getExVat("content_studio_pilot").toLocaleString("he-IL")} ₪`,
    priceNote: "חד פעמי · לפני מע״מ",
    description: "שעה באולפן ו-5 סרטונים. לבדיקת סגנון לפני ריטיינר.",
    deliverables: [
      "שעת צילום באולפן",
      "5 רילז או שורטס ערוכים",
      "כתוביות בסיסיות",
      "מסירה תוך 3 ימי עסקים",
    ],
    utmCampaign: "content_studio_pilot",
  },
] as const;

export const PROCESS_STEPS = [
  {
    step: 1,
    title: "תכנון תוכן",
    body: "רבע שעה לפני הסשן בונים רשימת נושאים, hooks ושאלות.",
  },
  {
    step: 2,
    title: "צילום מרוכז",
    body: "2 שעות באולפן: 10–15 קטעים קצרים ברצף. טיפים, סיפורים, Q&A.",
  },
  {
    step: 3,
    title: "עריכה וכתוביות",
    body: "חיתוך, כתוביות צבעוניות, פורמט 9:16. מוכן לטיקטוק ורילז.",
  },
  {
    step: 4,
    title: "מסירה",
    body: "קבצים מוכנים לפרסום. Drive או וואטסאפ.",
  },
] as const;

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "vs-social-media",
    question: "מה ההבדל מניהול סושיאל?",
    answer:
      "ניהול סושיאל: ריטיינר עם צילום בעסק וניהול עמודים. סושיאל דאמפ: צילום באולפן ורילז ערוכים. אפשר לשלב.",
  },
  {
    id: "vs-reel-factory",
    question: "מה ההבדל ממפעל הרילס?",
    answer:
      "מפעל הרילס לספקי אירועים (DJ, צלמים) שמביאים חומר מאירוע. כאן אתם מגיעים לאולפן ומצלמים תוכן עסקי.",
  },
  {
    id: "vs-podcast",
    question: "זה כמו פודקאסט?",
    answer:
      "לא. פודקאסט זה פרק ארוך. כאן 10–15 סרטונים קצרים (15–60 שניות) לרילז וטיקטוק.",
  },
  {
    id: "who",
    question: "למי זה מתאים?",
    answer:
      "בעלי עסקים, יועצים, מנכ״לים, מטפלים, עורכי דין. כל מי שצריך נוכחות ברשת בלי לצלם כל יום.",
  },
  {
    id: "vat",
    question: "האם המחירים כוללים מע״מ?",
    answer: "לא. כל המחירים לפני מע״מ. יש חשבונית מס לעסקים.",
  },
];

export const HUB_WHATSAPP_TEXT =
  "שלום, מעוניין/ת בסושיאל דאמפ. יום צילום באולפן לרילז ושורטס.";

export const ABOUT_PARAGRAPHS = [
  "עסקים לא צריכים עוד פודקאסט של שעה. הם צריכים תוכן קצר שעובד ברילז, טיקטוק ושורטס.",
  "בסשן אחד באולפן מצלמים 10–15 קטעים קצרים: טיפים, סיפורים, שאלות ותשובות. יוצא חומר לחודש שלם.",
  "העריכה כוללת כתוביות צבעוניות בסגנון שמושך תשומת לב ברשתות.",
  "ריטיינר חודשי = תוכן שוטף, בלי לרדוף צלמים כל שבוע.",
] as const;
