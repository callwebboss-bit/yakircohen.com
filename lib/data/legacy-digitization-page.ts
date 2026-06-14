import type { BusinessPageConfig } from "@/lib/data/business-tier-types";
import type { FAQItem } from "@/components/ui/FAQAccordion";
import { getExVat } from "@/lib/data/pricing-catalog";

const faqs: FAQItem[] = [
  {
    id: "formats",
    question: "אילו סוגי קלטות מקבלים?",
    answer: "VHS, MiniDV, קלטות קסטה, CD. גם קבצים דיגיטליים ישנים.",
  },
  {
    id: "ai",
    question: "מה עושה ה-AI?",
    answer: "מנקה רעשי רקע, משפר קול ומחדד תמונה. מעבר להמרה פשוטה לדיגיטל.",
  },
  {
    id: "box",
    question: "יש לי ארגז קלטות. איך מתמחרים?",
    answer: "שלחו רשימה ונחזור עם הצעה. על 10 קלטות ומעלה יש הנחה.",
  },
  {
    id: "vs-vocal-fix",
    question: "מה ההבדל משחזור סאונד?",
    answer: "שחזור סאונד זה לקובץ דיגיטלי שכבר יש לכם. כאן ממירים מקלטת או VHS.",
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

export const LEGACY_DIGITIZATION_CONFIG: BusinessPageConfig = {
  brand: "החייאת זיכרונות",
  pageTitle: "המרת VHS וקלטות לדיגיטל",
  subtitle:
    "VHS, MiniDV וקלטות ישנות הופכים לקבצים דיגיטליים. אפשר גם שיפור סאונד ותמונה ב-AI.",
  pageFeatures: [
    "המרת VHS, MiniDV וקסטה",
    "שחזור AI לסאונד ותמונה",
    "מסירה ב-MP4 או WAV",
    "איסוף במודיעין או שליחה בדואר",
  ],
  hubWhatsappText: "שלום, יש לי קלטות או VHS ישנים להמרה לדיגיטל.",
  utmCampaign: "legacy_digitization_hub",
  tiers: [
    tier(
      "ai",
      "המרה + שחזור AI",
      "legacy_dig_ai",
      "מומלץ",
      "דיגיטל, ניקוי רעשים ושיפור איכות.",
      ["המרה לקובץ דיגיטלי", "שחזור סאונד ב-AI", "שיפור תמונה (וידאו)", "בדיקה לפני מסירה"],
      "legacy_dig_ai",
    ),
    tier(
      "basic",
      "המרה בסיסית",
      "legacy_dig_basic",
      undefined,
      "קלטת או VHS אחת לקובץ דיגיטלי.",
      ["העברה ל-MP4 או WAV", "בלי עיבוד AI", "מתאים לחומר נקי"],
      "legacy_dig_basic",
    ),
  ],
  aboutParagraphs: [
    "ארגז קלטות מהחתונה של ההורים או מהילדות. עדיף להמיר לפני שהן נהרסות.",
    "היום אפשר לא רק להעתיק לדיגיטל, אלא גם לנקות ולשפר את מה שצולם לפני עשרות שנים.",
  ],
  faqs,
  differentiation: [
    { label: "שחזור סאונד AI", href: "/online/vocal-fix", note: "קובץ דיגיטלי קיים" },
  ],
  relatedLinks: [
    { label: "מחירון AI", href: "/online/online-ai-pricing" },
    { label: "שליחת קובץ", href: "/online/vocal-fix/send-file" },
  ],
};
