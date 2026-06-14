import type { BusinessPageConfig } from "@/lib/data/business-tier-types";
import type { FAQItem } from "@/components/ui/FAQAccordion";
import { getExVat } from "@/lib/data/pricing-catalog";

const faqs: FAQItem[] = [
  {
    id: "platforms",
    question: "לאילו פלטפורמות מתאים?",
    answer: "ACX, Spotify, Apple Podcasts, אייקאסט, Storytel. מסיימים לפי דרישות כל פלטפורמה.",
  },
  {
    id: "voice",
    question: "מי מקליט?",
    answer: "הסופר/ת באולפן, או קריינות מקצועית. לפי מה שמתאים לספר.",
  },
  {
    id: "full-book",
    question: "ספר שלם. איך מתמחרים?",
    answer: "לפי כמות שעות החומר. על ימי אולפן מרוכזים יש הנחה.",
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

export const AUDIOBOOKS_CONFIG: BusinessPageConfig = {
  brand: "הפקת ספרי שמע",
  pageTitle: "הפקת ספר קולי מקצה לקצה",
  subtitle:
    "הקלטה, עריכה ומאסטרינג לספר קולי. לסופרים עצמאיים ומוציאים לאור.",
  pageFeatures: [
    "ימי אולפן מרוכזים לפרויקט",
    "מאסטרינג ל-ACX ואייקאסט",
    "אולפן אקוסטי במודיעין",
    "קריינות מקצועית (אופציונלי)",
  ],
  hubWhatsappText: "שלום, מעוניין/ת בהפקת ספר שמע. אשמח לשמוע על החבילות.",
  utmCampaign: "audiobooks_hub",
  tiers: [
    tier(
      "hour",
      "שעת הקלטה + עריכה",
      "audiobook_hour",
      "גמיש",
      "750 ₪ לשעת חומר גולמי, כולל עריכה בסיסית.",
      ["הקלטה באולפן", "ניקוי נשימות ורעשים", "מיקס בסיסי"],
      "audiobook_hour",
    ),
    tier(
      "sample",
      "פרק דוגמה",
      "audiobook_sample",
      "התחלה",
      "15 דקות לבדיקת סגנון לפני ספר שלם.",
      ["הקלטה ועריכה", "מאסטרינג לדוגמה", "משוב לפני פרויקט מלא"],
      "audiobook_sample",
    ),
  ],
  aboutParagraphs: [
    "יותר סופרים מוציאים ספרי שמע. צריך אולפן שייקח את הפרויקט מההקלטה ועד הקובץ המוכן.",
    "פרויקט אחד של ספר = ימי עבודה מובטחים. עדיף על הקלטות של שעה כאן ושעה שם.",
  ],
  faqs,
  relatedLinks: [
    { label: "קריינות מקצועית", href: "/business/professional-voiceover" },
    { label: "קורס קריינות", href: "/academy/voiceover" },
  ],
};
