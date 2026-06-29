import type { BusinessPageConfig } from "@/lib/data/business-tier-types";
import type { FAQItem } from "@/components/ui/FAQAccordion";
import { getExVat } from "@/lib/data/pricing-catalog";

const faqs: FAQItem[] = [
  {
    id: "invoice",
    question: "האם מנפיקים חשבונית מס?",
    answer: "כן. לכל הפקה ארגונית יש חשבונית מס מסודרת. ניתן לקבל הצעת מחיר מראש לאישור הרכש.",
  },
  {
    id: "on-site",
    question: "האם ניתן להקליט בחברה?",
    answer: "כן. האולפן הנייד מגיע לחדר הישיבות שלכם. מביאים מיקרופונים מקצועיים, תאורה ומצלמות - הצוות שלכם לא זז.",
  },
  {
    id: "pilot-vs-retainer",
    question: "מה ההבדל בין פיילוט לריטיינר?",
    answer: "הפיילוט הוא חבילת ייסוד חד-פעמית: 2 פרקים, setup ערוץ ומיתוג שמע. הריטיינר הוא ייצור שוטף: 2 פרקים בחודש עם הפצה ורילס. לרוב מתחילים בפיילוט ועוברים לריטיינר.",
  },
  {
    id: "duration",
    question: "כמה זמן לוקחת הקלטה?",
    answer: "בדרך כלל 1–2 שעות לצוות קטן, כולל הכנה וציוד. ניתן לתאם בשעות הבוקר לפני שהמשרד מתעורר.",
  },
  {
    id: "nda",
    question: "האם יש NDA?",
    answer: "כן. כל חומר גלם נשאר פרטי. חותמים על הסכם סודיות לפי דרישה לפני תחילת ההפקה.",
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

export const CORPORATE_PODCAST_CONFIG: BusinessPageConfig = {
  brand: "פודקאסט ארגוני",
  pageTitle: "פודקאסט ארגוני לחברות  -  הפקה מא׳ עד ת׳",
  subtitle:
    "מיתוג מעסיק, שיווק תוכן ותוכן B2B ברמה שידורית  -  הקלטה, עריכה, הפצה לספוטיפיי וחשבונית מס.",
  pageFeatures: [
    "מיתוג מעסיק  -  פודקאסט שמציג את תרבות החברה",
    "הפקה מלאה: הקלטה, עריכה, הפצה לספוטיפיי ואפל",
    "ריטיינר חודשי  -  פרק חדש כל שבוע, בלי עומס על הצוות",
    "חשבונית מס מסודרת  -  הרכש מאשר, אתם מקליטים",
    "רילס וסרטונים קצרים לסושיאל  -  מאותו ביקור",
  ],
  hubWhatsappText:
    "שלום, מעוניין/ת בפודקאסט ארגוני לחברה. אשמח לשמוע על האפשרויות.",
  utmCampaign: "corporate_podcast_hub",
  tiers: [
    tier(
      "pilot",
      "פיילוט ארגוני",
      "corp_podcast_pilot",
      "נקודת התחלה",
      "2 פרקים ראשונים + setup מלא. מתאים לחברות שרוצות לבדוק לפני התחייבות.",
      [
        "שיחת אסטרטגיה + אפיון פורמט",
        "2 פרקים מלאים (הקלטה + עריכה)",
        "מיתוג שמע (פתיח וסגיר)",
        "setup ערוץ ספוטיפיי + RSS",
        "חשבונית מס",
      ],
      "corp_podcast_pilot",
    ),
    tier(
      "retainer",
      "ריטיינר חודשי",
      "corp_podcast_retainer",
      "הכי נפוץ",
      "2 פרקים בחודש + רילס לסושיאל. לחברות שרוצות נוכחות קבועה.",
      [
        "2 פרקים בחודש (הקלטה + עריכה)",
        "2 רילס קצרים לסושיאל מאותו סשן",
        "הפצה שוטפת לספוטיפיי ואפל פודקאסטס",
        "חשבונית מס חודשית",
        "אפשרות הקלטה במשרד",
      ],
      "corp_podcast_retainer",
    ),
    {
      id: "custom",
      name: "הצעה מותאמת",
      priceNis: 0,
      priceLabel: "על פי פרויקט",
      priceNote: "פנו לייעוץ",
      badge: undefined,
      description:
        "thought leadership, ראיונות עם מנהלים, ניהול ערוץ מלא. מחיר לפי היקף.",
      deliverables: [
        "פודקאסט חיצוני / thought leadership",
        "פרקי וידאו ארוכים",
        "גיוס ועריכת אורחים",
        "ניהול ערוץ מלא",
      ],
      utmCampaign: "corp_podcast_custom",
    },
  ],
  processSteps: [
    {
      step: 1,
      title: "מיפוי",
      body: "קהל יעד, מסר ופורמט. מה החברה רוצה שיאמרו עליה.",
    },
    {
      step: 2,
      title: "הפקה",
      body: "הקלטה באולפן או בחדר הישיבות שלכם. הצוות מדבר, אנחנו מפיקים.",
    },
    {
      step: 3,
      title: "עריכה ומיתוג",
      body: "פתיח, סגיר, עריכת סאונד ווידאו, רילס קצרים לסושיאל.",
    },
    {
      step: 4,
      title: "הפצה",
      body: "ספוטיפיי, אפל פודקאסטס, RSS. חשבונית מס בסיום כל חודש.",
    },
  ],
  aboutParagraphs: [
    "חברה שמקליטה פודקאסט מקצועי מייצרת תוכן שמשרת אותה שוב ושוב: מיתוג מעסיק, thought leadership, גיוס עובדים, קמפיין שיווקי.",
    "מנהל HR לא צריך להפוך למפיק. אנחנו לוקחים את הביקור לאולפן ומחזירים פרק מוכן, ערוץ מוכן, ועלות שהרכש יכול לאשר.",
    "כל ביקור מניב: פרק לספוטיפיי + 2 רילס לסושיאל + ציטוטים לבלוג. ממקסמים את הזמן של המנהלים.",
  ],
  faqs,
  relatedLinks: [
    { label: "פס ייצור שבועי", href: "/podcast/bulk-production" },
    { label: "אולפן זמני בחברה", href: "/business/on-site-studio" },
    { label: "הפקת פודקאסט מלאה", href: "/podcast/podcast-production" },
    { label: "מרכז לעסקים", href: "/business" },
  ],
};
