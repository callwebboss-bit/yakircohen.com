import type { BusinessPageConfig } from "@/lib/data/business-tier-types";
import type { FAQItem } from "@/components/ui/FAQAccordion";
import { getExVat } from "@/lib/data/pricing-catalog";

const faqs: FAQItem[] = [
  {
    id: "vs-gift",
    question: "מה ההבדל משיר במתנה לבר מצווה?",
    answer:
      "אותה הפקה באולפן, אבל לחברות: שיר פרישה, הימנון או הרמת כוסית. עם חשבונית מס.",
  },
  {
    id: "timeline",
    question: "כמה זמן לוקח?",
    answer: "בדרך כלל שבועיים עד חודש, מהרגע שמאשרים את התסריט.",
  },
  {
    id: "clip",
    question: "האם כולל קליפ וידאו?",
    answer: "בחבילות פרישה והימנון כן. בהרמת כוסית אפשר להוסיף קליפ בתוספת.",
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

export const CORPORATE_SONGS_CONFIG: BusinessPageConfig = {
  brand: "שירים לחברות",
  pageTitle: "הפקת שירים וקליפים לחברות",
  subtitle:
    "שיר פרישה, הימנון חברה וקליפ לערב חברה. הפקה מלאה מכתיבה עד מסירה - חשבונית מס. תגובה, בדרך כלל תוך 24 שעות.",
  pageFeatures: [
    "שיר מקורי והפקה מלאה באולפן",
    "קליפ לערב חברה, לינקדאין ויוטיוב",
    "חשבונית מס - מוכן לדיווח",
    "תגובה, בדרך כלל תוך 24 שעות - מודיעין ואזור המרכז",
  ],
  hubWhatsappText: "שלום, מעוניין/ת בשיר או קליפ לחברה (פרישה / הימנון / אירוע).",
  utmCampaign: "corporate_songs_hub",
  tiers: [
    tier(
      "anthem",
      "הימנון חברה",
      "corp_song_anthem",
      "פרימיום",
      "שיר וקליפ לטקס או ערב חברה.",
      ["כתיבת מילים ולחן", "הקלטה ועריכה", "קליפ וידאו", "קובץ מוכן לשימוש ארגוני"],
      "corp_song_anthem",
    ),
    tier(
      "retirement",
      "שיר פרישה + קליפ",
      "corp_song_retirement",
      "הנבחרת",
      "מחווה לסמנכ״ל או מנהל בכיר.",
      ["שיר מקורי", "הקלטה באולפן", "קליפ לערב פרישה", "שני סבבי תיקון"],
      "corp_song_retirement",
    ),
    tier(
      "toast",
      "הרמת כוסית / שיר הומור",
      "corp_song_toast",
      undefined,
      "שיר קליל לחג, יום גיבוש או מסיבת חברה.",
      ["שיר מותאם לאירוע", "הקלטה ומיקס", "קובץ מוכן להשמעה"],
      "corp_song_toast",
    ),
  ],
  aboutParagraphs: [
    "חברות מזמינות שיר פרישה או קליפ לערב חברה באותה הפקה שאנחנו עושים לשיר במתנה - רק התקציב והמטרה שונים. מגיעים עם טקסט גס או רעיון, ואנחנו כותבים, מקליטים ומספקים קובץ מוכן להשמעה.",
    "HR מחפש מחווה מקורית לסמנכ\"ל יוצא, שיווק רוצה הימנון לאירוע שנתי, ההנהלה רוצה משהו שיזכרו. תגובה לפנייה, בדרך כלל תוך 24 שעות, חשבונית מס, וכל הזכויות עוברות לחברה.",
  ],
  faqs,
  differentiation: [
    { label: "שיר במתנה (פרטי)", href: "/studio/recording-song-modiin", note: "בר מצווה, יום הולדת" },
  ],
  relatedLinks: [
    { label: "סרט תדמית", href: "/video/corporate-video" },
    { label: "מרכז לעסקים", href: "/business" },
  ],
};
