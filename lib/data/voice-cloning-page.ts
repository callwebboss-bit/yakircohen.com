import type { BusinessPageConfig } from "@/lib/data/business-tier-types";
import type { FAQItem } from "@/components/ui/FAQAccordion";
import { getExVat } from "@/lib/data/pricing-catalog";

const faqs: FAQItem[] = [
  {
    id: "legal",
    question: "זה חוקי?",
    answer: "רק עם אישור מפורש של בעל הקול. לעסקים: מנהל או נציג מוסמך חותם. לא עושים קול של מישהו בלי רשות.",
  },
  {
    id: "quality",
    question: "זה נשמע רובוטי?",
    answer: "תלוי באיכות ההקלטה המקורית. אחרי הקמת מודל, שומעים דוגמה לפני שמשלמים על עדכונים.",
  },
  {
    id: "vs-branding",
    question: "מה ההבדל ממיתוג קולי?",
    answer: "מיתוג קולי זו חבילה שלמה (ג'ינגל, IVR, המתנה). כאן מוקם מודל קול לעדכונים מהירים.",
  },
  {
    id: "updates",
    question: "כמה עולה עדכון חדש?",
    answer: "אחרי שהמודל מוכן: קlip קצר בודד, או חבילת 5 הודעות IVR. רואים מחיר למטה.",
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

export const VOICE_CLONING_CONFIG: BusinessPageConfig = {
  brand: "שיבוט קול",
  pageTitle: "שיבוט קול לעסקים",
  subtitle:
    "הקלטתם פעם אחת את המנכ״ל. עכשיו מעדכנים הודעות IVR בלי לזמן אותו שוב לאולפן.",
  pageFeatures: [
    "הקמת מודל קול חד פעמית",
    "עדכוני IVR ופרסומות מהירים",
    "רק עם אישור בעל הקול",
    "משולב במיתוג קולי מלא",
  ],
  hubWhatsappText: "שלום, מעוניין/ת בשיבוט קול לעסק (IVR / עדכונים).",
  utmCampaign: "voice_cloning_hub",
  tiers: [
    tier(
      "setup",
      "הקמת מודל קול",
      "voice_clone_setup",
      "התחלה",
      "הקלטת דגימות באולפן + אימון מודל + דוגמה לאישור.",
      ["סשן הקלטה באולפן", "אימון מודל", "הקלטת בדיקה", "אישור משפטי"],
      "voice_clone_setup",
    ),
    tier(
      "ivr-pack",
      "5 עדכוני IVR",
      "voice_clone_ivr_pack",
      "הכי משתלם",
      "חמש הודעות חדשות מאותו קול. אחרי שהמודל כבר קיים.",
      ["5 טקסטים עד 30 שניות", "קבצים מוכנים לעלות", "עריכה ונורמליזציה"],
      "voice_clone_ivr_pack",
    ),
    tier(
      "clip",
      "הקלטה קצרה",
      "voice_clone_clip",
      undefined,
      "עד דקה ממודל קיים. לפרסומת או הודעה חד-פעמית.",
      ["טקסט אחד", "עד 60 שניות", "WAV + MP3"],
      "voice_clone_clip",
    ),
  ],
  aboutParagraphs: [
    "כל פעם שמשנים תפריט במרכזייה, מישהו צריך להגיע להקליט. זה עולה זמן וכסף.",
    "אחרי הקמת מודל, שולחים טקסט ומקבלים קובץ. לא מושלם כמו הקלטה חיה, אבל מספיק טוב ל-IVR ועדכונים.",
    "רוצים גם ג'ינגל ומוזיקת המתנה? שילוב עם חבילת מיתוג קולי.",
  ],
  faqs,
  differentiation: [
    { label: "מיתוג קולי מלא", href: "/business/audio-branding", note: "ג'ינגל + IVR + הכל" },
  ],
  relatedLinks: [
    { label: "קריינות מקצועית", href: "/business/professional-voiceover" },
    { label: "מיתוג קולי", href: "/business/audio-branding" },
  ],
};
