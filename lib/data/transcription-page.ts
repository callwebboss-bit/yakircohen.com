import type { BusinessPageConfig } from "@/lib/data/business-tier-types";
import type { FAQItem } from "@/components/ui/FAQAccordion";
import { getExVat } from "@/lib/data/pricing-catalog";

const faqs: FAQItem[] = [
  {
    id: "formats",
    question: "איזה קבצים שולחים?",
    answer: "MP3, WAV, MP4, לינק ליוטיוב או דרייב. כמעט הכל.",
  },
  {
    id: "hebrew",
    question: "עברית עובדת?",
    answer: "כן. AI מתמלל, ואנחנו עורכים ידנית. שמות, מונחים וסלנג נבדקים.",
  },
  {
    id: "turnaround",
    question: "כמה זמן?",
    answer: "חצי שעה: יום-יומיים. שעה ומעלה: 3–5 ימי עסקים. דחוף? כתבו בוואטסאפ.",
  },
  {
    id: "summary",
    question: "אפשר גם תקציר?",
    answer: "כן. נוסיף נקודות מפתח או פסקה לבלוג. בתוספת קטנה.",
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

export const TRANSCRIPTION_CONFIG: BusinessPageConfig = {
  brand: "תמלול וכתוביות",
  pageTitle: "תמלול פודקאסט, ראיונות ווידאו",
  subtitle:
    "שלחו הקלטה, תקבלו טקסט נקי. AI עושה את העבודה הכבדה, אנחנו תופסים את מה שהוא מפספס.",
  pageFeatures: [
    "עברית, אנגלית וערבוב",
    "פודקאst, ראיונות, וובinars",
    "Word, Google Doc או SRT לכתוביות",
    "אופציה לתקציר לבלוג",
  ],
  hubWhatsappText: "שלום, יש לי הקלטה לתמלול. אשמח להצעת מחיר.",
  utmCampaign: "transcription_hub",
  tiers: [
    tier(
      "hour-srt",
      "שעה + כתוביות",
      "transcribe_hour_srt",
      "לווידאו",
      "תמלול מלא וקובץ SRT מוכן לעריכה.",
      ["שעת אודיו או וידאו", "עריכה אנושית", "SRT עם חותמות זמן", "Word/Google Doc"],
      "transcribe_hour_srt",
    ),
    tier(
      "hour",
      "שעת תמלול",
      "transcribe_hour",
      "הנבחר",
      "טקסט נקי לפודקאst, ראיון או פרוטוקול.",
      ["AI + עריכה", "שמות ומונחים מדויקים", "מסירה ב-Word או Doc"],
      "transcribe_hour",
    ),
    tier(
      "30min",
      "חצי שעה, AI",
      "transcribe_30min",
      undefined,
      "טיוטה מהירה. טוב לבדיקה ראשונית או חומר פשוט.",
      ["תמלול AI", "בדיקה מהירה", "מתאים לחומר נקי"],
      "transcribe_30min",
    ),
  ],
  processSteps: [
    { step: 1, title: "שולחים", body: "קובץ או לינק בוואטסאפ / דרייב." },
    { step: 2, title: "מחיר", body: "מחשבים לפי אורך. אישור לפני שמתחילים." },
    { step: 3, title: "עובדים", body: "AI + עריכה. לא מעבירים אוטומטית." },
    { step: 4, title: "מקבלים", body: "טקסט מוכן. SRT אם ביקשתם." },
  ],
  aboutParagraphs: [
    "יש לכם פרק פודקאst מעולה שאף אחד לא מוצא בגוגל? תמלול פותר את זה.",
    "גם חברות שמקליטות ראיונות עם לקוחות. הטקסט הופך לבלוג, לינקדאין, מייל.",
    "אנחנו לא מוכרים תוכנה. אתם שולחים, אנחנו מחזירים קובץ שאפשר להעתיק ולהדביק.",
  ],
  faqs,
  relatedLinks: [
    { label: "עריכת פודקאst", href: "/podcast/podcast-editing" },
    { label: "פס ייצור", href: "/podcast/bulk-production" },
    { label: "שירותי AI", href: "/online/online-ai-pricing" },
  ],
};
