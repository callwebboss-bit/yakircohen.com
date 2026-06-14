import type { BusinessPageConfig } from "@/lib/data/business-tier-types";
import type { FAQItem } from "@/components/ui/FAQAccordion";
import { getExVat } from "@/lib/data/pricing-catalog";

const faqs: FAQItem[] = [
  {
    id: "vs-corporate-video",
    question: "זה כמו סרט תדמית?",
    answer: "סרט תדמית מוכר את החברה ללקוחות. כאן מדובר בווידאו לעובדים: קליטה, הכשרה, תרבות.",
  },
  {
    id: "who-films",
    question: "מי מופיע?",
    answer: "HR, מנהלים, עובדים ותיקים. לפעמים רק קריינות. תלוי בפרויקט.",
  },
  {
    id: "platform",
    question: "לאן זה עולה?",
    answer: "מערכת LMS, אתר גיוס, דרייב פנימי, וואטסאפ. מסירים בפורמט שמתאים לכם.",
  },
  {
    id: "remote",
    question: "עובדים מרחוק?",
    answer: "כן. אפשר לצלם באולפן, בחברה, או לשלב ראיונות מרוחקים.",
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

export const EMPLOYER_BRANDING_CONFIG: BusinessPageConfig = {
  brand: "תוכן HR וקליטה",
  pageTitle: "סרטוני onboarding ותוכן לעובדים",
  subtitle:
    "עובד חדש מגיע ביום ראשון ויודע למה החברה קיימת, איך עובדים כאן, ולמי לפנות.",
  pageFeatures: [
    "סרטון ברוכים הבאים",
    "סיור וירטואלי במשרד",
    "ראיונות עם מנהלים",
    "חשבונית מס ל-HR",
  ],
  hubWhatsappText: "שלום, מעוניין/ת בסרטוני onboarding / תוכן HR.",
  utmCampaign: "employer_branding_hub",
  tiers: [
    tier(
      "onboard-day",
      "יום צילום onboarding",
      "employer_onboard_day",
      "מלא",
      "יום במשרד: ראיונות, סיור, 5–8 סרטונים גולמיים.",
      ["יום צילום בחברה", "ראיונות + B-roll", "קבצים גולמיים", "אפשר להוסיף עריכה"],
      "employer_onboard_day",
    ),
    tier(
      "welcome",
      "סרטון ברוכים הבאים",
      "employer_welcome",
      "התחלה",
      "סרטון עד 3 דקות. מי אנחנו, איך נראה יום טיפוסי.",
      ["תסריט משותף", "צילום באולפן או בחברה", "עריכה + מוזיקה", "מסירה מוכנה"],
      "employer_welcome",
    ),
    tier(
      "monthly",
      "ריטיינר HR חודשי",
      "employer_monthly",
      "שוטף",
      "סרטון קליטה או הכשרה כל חודש. לחברות שגדלות.",
      ["סשן צילום חודשי", "עריכה", "2 סבבי תיקון", "פורמט ל-LMS / דרייב"],
      "employer_monthly",
    ),
  ],
  processSteps: [
    { step: 1, title: "מיפוי", body: "מה עובד חדש חייב לדעת ביום 1?" },
    { step: 2, title: "תסריט", body: "טקסטים קצרים. בלי עשרות שקפים." },
    { step: 3, title: "צילום", body: "במשרד או באולפן. יום אחד מרוכז." },
    { step: 4, title: "עריכה", body: "סרטונים קצרים, כתוביות, מסירה." },
  ],
  aboutParagraphs: [
    "HR מבלה שעות ביום ראשון על אותן הסברים. סרטון טוב מוריד את העומס.",
    "גם חברות בצמיחה: כל גיוס חוזר על אותה שיחה. עדיף להקליט פעם אחת נכון.",
    "לא צריך הפקה של סרט תדמית. צריך משהו חם, ברור, שעובד באמת ירצה לראות.",
  ],
  faqs,
  relatedLinks: [
    { label: "אולפן בחברה", href: "/business/on-site-studio" },
    { label: "סרט תדמית", href: "/video/corporate-video" },
    { label: "מרכז לעסקים", href: "/business" },
  ],
};
