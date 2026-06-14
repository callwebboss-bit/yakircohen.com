import type { BusinessPageConfig } from "@/lib/data/business-tier-types";
import type { FAQItem } from "@/components/ui/FAQAccordion";
import { getExVat } from "@/lib/data/pricing-catalog";

const faqs: FAQItem[] = [
  {
    id: "who",
    question: "למי זה מתאים?",
    answer:
      "לחברות שרוצות להקליט פודקאסט, ראיונות או וידאו בלי לשלוח את כולם לאולפן. אנחנו מגיעים לחדר הישיבות ומקימים שם אולפן זמני.",
  },
  {
    id: "gear",
    question: "מה מביאים איתכם?",
    answer:
      "שני מיקרופונים, שתי מצלמות, תאורה, רקע אקוסטי ומוניטור. אפשר להביא לפטופ או לקבל קבצים גולמיים בסיום.",
  },
  {
    id: "areas",
    question: "לאיזה אזורים מגיעים?",
    answer: "מודיעין, ירושלים, תל אביב, השפלה והמרכז. בתיאום מראש.",
  },
  {
    id: "vs-mobile-home",
    question: "מה ההבדל מאולפן נייד עד הבית?",
    answer:
      "אולפן עד הבית מיועד למשפחות ושירים במתנה. כאן מדובר ביום צילום בחברה, עם תמחור וחשבונית לעסק.",
  },
];

function tier(
  id: string,
  name: string,
  priceId: Parameters<typeof getExVat>[0],
  badge: string | undefined,
  description: string,
  deliverables: string[],
  utm: string,
) {
  const price = getExVat(priceId);
  return {
    id,
    name,
    priceNis: price,
    priceLabel: `${price.toLocaleString("he-IL")} ₪`,
    priceNote: "לפני מע״מ",
    badge,
    description,
    deliverables,
    utmCampaign: utm,
  };
}

export const ON_SITE_STUDIO_CONFIG: BusinessPageConfig = {
  brand: "אולפן זמני בחברה",
  tagline: "On-Site Studio",
  pageTitle: "אולפן פודקאסט ווידאו נייד לחברות",
  subtitle:
    "מגיעים לחדר הישיבות עם ציוד מלא. יום צילום במשרד, בלי שהצוות יצטרך לנסוע.",
  pageFeatures: [
    "אולפן זמני בחדר ישיבות או במשרד פתוח",
    "שני מיקרופונים, שתי מצלמות ותאורה",
    "מודיעין, ירושלים, תל אביב והמרכז",
    "חשבונית מס לעסק",
  ],
  scarcityLabel: "🚐 בתיאום מראש",
  hubWhatsappText:
    "שלום, מעוניין/ת באולפן זמני בחברה (פודקאסט או וידאו בחדר ישיבות).",
  utmCampaign: "on_site_studio_hub",
  termsVatNote: "המחירים לפני מע״מ · הגעה באזור המרכז",
  tiers: [
    tier(
      "full-day",
      "יום מלא בחברה",
      "on_site_full_day",
      "הנבחרת",
      "8 שעות. עד 8 פרקים או סרטונים גולמיים.",
      ["הקמת אולפן זמני", "שני מיקרופונים + שתי מצלמות", "תאורה ורקע אקוסטי", "קבצים גולמיים או העברה ללפטופ"],
      "on_site_full_day",
    ),
    tier(
      "half-day",
      "חצי יום",
      "on_site_half_day",
      undefined,
      "4 שעות. מתאים לסשן הקלטות מרוכז.",
      ["עד 4 מרואים", "חדר ישיבות אחד", "ליווי טכני"],
      "on_site_half_day",
    ),
    tier(
      "retainer",
      "ריטיינר חודשי",
      "on_site_retainer",
      "הכי משתלם",
      "שני ימי צילום בחודש. אפשר להוסיף עריכה.",
      ["שני ימי אולפן בחברה", "תיאום קבוע עם HR או שיווק", "עדיפות בלוח"],
      "on_site_retainer",
    ),
  ],
  processSteps: [
    { step: 1, title: "סיור וירטואלי", body: "בוחרים חדר, בודקים חשמל ואקוסטיקה." },
    { step: 2, title: "הקמה", body: "בערך שעה וחצי והאולפן מוכן." },
    { step: 3, title: "צילום", body: "יום של הקלטות וראיונות." },
    { step: 4, title: "מסירה", body: "קבצים גולמיים, או עריכה לפי חבילה." },
  ],
  aboutParagraphs: [
    "למנהלים עסוקים הזמן יקר. במקום שכולם ינסו למודיעין, האולפן מגיע אליכם.",
    "חדר ישיבות הופך לזמנית לאולפן: מיקרופונים, מצלמות, תאורה ורקע. מגיעים, מקימים, מקליטים.",
    "מתאים לפודקאסט פנימי, ראיונות עם הנהלה, סרטוני onboarding ותוכן ללינקדאין.",
  ],
  faqs,
  differentiation: [
    { label: "אולפן נייד לבית", href: "/studio/mobile-studio", note: "שיר במתנה / הקלטה בבית" },
    { label: "השכרת סטודיו במודיעין", href: "/podcast/podcast-studio-modiin", note: "מגיעים אלינו" },
  ],
  relatedLinks: [
    { label: "סרט תדמית", href: "/video/corporate-video" },
    { label: "פס ייצור פודקאסט", href: "/podcast/bulk-production" },
  ],
};
