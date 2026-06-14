/** Self-service podcast studio page data */

import type { FAQItem } from "@/components/ui/FAQAccordion";
import { getExVat } from "@/lib/data/pricing-catalog";

export const SELF_SERVICE_PRICE = getExVat("studio_self_service_hour");

export const SELF_SERVICE_HERO_FEATURES = [
  "650 ₪ לשעה, בלי עריכה ובלי ליווי",
  "מיקרופונים ומוניטור. אתם לוחצים הקלטה",
  "מביאים לפטופ או כרטיס זיכרון, יוצאים עם קבצים גולמיים",
  "אולפן אקוסטי מקצועי במודיעין",
] as const;

export const SELF_SERVICE_COMPARISON = [
  {
    label: "שירות עצמי (650 ₪/שעה)",
    editing: "לא",
    support: "הדרכה 5 דק׳ בלבד",
    ideal: "פודקאסטרים עם עורך, DIY",
  },
  {
    label: "פרק קצר עם ליווי (750 ₪)",
    editing: "לא (קבצים גולמיים)",
    support: "ליווי טכני מלא",
    ideal: "פיילוט, פרק ראשון",
  },
  {
    label: "פודקאסט אודיו (950 ₪)",
    editing: "כן, מסירה מוכנה",
    support: "ליווי + עריכה",
    ideal: "פרק מוכן לספוטיפיי",
  },
] as const;

export const SELF_SERVICE_CHECKLIST = [
  "לפטופ עם תוכנת הקלטה (Audacity, Reaper, GarageBand) או recorder",
  "כרטיס SD או USB, אם רוצים לקחת קבצים בלי לפטופ",
  "תסריט או outline, כדי לנצל את השעה",
  "אוזניות (יש גם באולפן)",
] as const;

export const SELF_SERVICE_FAQS: FAQItem[] = [
  {
    id: "what-included",
    question: "מה כולל השירות?",
    answer:
      "שעת שימוש באולפן עם מיקרופונים, מוניטור והדרכה של 5 דקות. בלי עריכה, בלי ליווי בזמן ההקלטה. אתם לוחצים Record ולוקחים את הקבצים.",
  },
  {
    id: "vs-750",
    question: "מה ההבדל מ-750 ₪ (חצי שעה)?",
    answer:
      "750 ₪: חצי שעה עם ליווי טכני, אנחנו מנהלים את ההקלטה. 650 ₪: שעה שירות עצמי, אתם מקליטים לבד, מחיר נמוך יותר לשעה.",
  },
  {
    id: "editor",
    question: "יש לי עורך קבוע. זה מתאים?",
    answer:
      "בדיוק. שירות עצמי מיועד לפודקאסטרים ויוצרים עם עורך חיצוני שצריכים רק חדר אקוסטי וציוד.",
  },
  {
    id: "hours",
    question: "מתי אפשר להזמין?",
    answer: "בתיאום. ערבים וסופי שבוע זמינים, מומלץ לפנות מראש.",
  },
  {
    id: "vat",
    question: "האם המחיר כולל מע״מ?",
    answer: "לא. 650 ₪ לפני מע״מ.",
  },
];

export const SELF_SERVICE_RELATED = [
  {
    title: "השכרת סטודיו עם ליווי",
    href: "/podcast/podcast-studio-modiin",
    description: "מ-750 ₪, ליווי טכני מלא",
  },
  {
    title: "עריכת פודקאסט",
    href: "/podcast/podcast-editing",
    description: "750 ₪ לשעת חומר גולמי",
  },
  {
    title: "תוכן לעסקים (רילז)",
    href: "/business/content-studio",
    description: "סושיאל דאמפ, לא DIY",
  },
] as const;
