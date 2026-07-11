import type { BusinessPageConfig } from "@/lib/data/business-tier-types";
import type { FAQItem } from "@/components/ui/FAQAccordion";
import { getExVat } from "@/lib/data/pricing-catalog";

const faqs: FAQItem[] = [
  {
    id: "ivr",
    question: "מה כולל IVR?",
    answer: "הודעות תפריט, המתנה ותא קולי. קריינות אחידה לכל המרכזייה.",
  },
  {
    id: "jingle",
    question: "מה זה לוגו קולי?",
    answer: "פתיח או סגיר של 5-15 שניות. מזהה קולי לפודקאסט, סרטונים ופרסומות.",
  },
  {
    id: "vs-voiceover",
    question: "מה ההבדל מדף הקריינות?",
    answer: "מיתוג קולי זו חבילה שלמה: ג'ינגל, IVR ואפקטים. בקריינות מדובר בפרויקט בודד.",
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

export const AUDIO_BRANDING_CONFIG: BusinessPageConfig = {
  brand: "מיתוג קולי",
  pageTitle: "חבילת סאונד למותג",
  subtitle:
    "ג'ינגל, הודעות מרכזייה, מוזיקת המתנה ואפקטים. איך שהמותג שלכם נשמע.",
  pageFeatures: [
    "ג'ינגל / לוגו קולי (15 שניות)",
    "הודעות IVR ומרכזייה",
    "מוזיקת המתנה ברישיון",
    "אפקטים קוליים לפרסום",
  ],
  hubWhatsappText: "שלום, מעוניין/ת בחבילת מיתוג קולי לעסק.",
  utmCampaign: "audio_branding_hub",
  tiers: [
    tier(
      "full",
      "חבילה מלאה",
      "audio_brand_full",
      "הנבחרת",
      "לוגו קולי, IVR מלא, מוזיקת המתנה ו-3 אפקטים.",
      ["ג'ינגל 15 שניות", "עד 5 הודעות IVR", "מוזיקת המתנה", "3 אפקטים קוליים"],
      "audio_brand_full",
    ),
    tier(
      "starter",
      "בסיס",
      "audio_brand_starter",
      undefined,
      "ג'ינגל קצר ו-2 הודעות מרכזייה.",
      ["לוגו קולי קצר", "2 הודעות מרכזייה", "מסירה ב-WAV ו-MP3"],
      "audio_brand_starter",
    ),
    tier(
      "premium",
      "פרימיום",
      "audio_brand_premium",
      "VIP",
      "הכל, ובנוסף שיבוט קול לעדכוני IVR מהירים.",
      ["כל החבילה המלאה", "שיבוט קול לעדכונים", "ליווי שנה ראשונה"],
      "audio_brand_premium",
    ),
  ],
  aboutParagraphs: [
    "עסקים משקיעים בלוגו ובצבעים, ושוכחים שהלקוח שומע אתכם לפני שהוא רואה.",
    "סאונד חובבני בסרטון פרסום פוגע באמינות. חבילה אחת סוגרת את הפינה.",
  ],
  faqs,
  relatedLinks: [
    { label: "קריינות מקצועית", href: "/business/professional-voiceover" },
    { label: "שירותי קריינות", href: "/voiceover/services" },
  ],
};
