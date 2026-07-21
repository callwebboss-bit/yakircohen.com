import type { BusinessPageConfig } from "@/lib/data/business-tier-types";
import type { FAQItem } from "@/components/ui/FAQAccordion";
import { getExVat } from "@/lib/data/pricing-catalog";

const faqs: FAQItem[] = [
  {
    id: "where",
    question: "איפה הסדנה מתקיימת?",
    answer: "באולפן במודיעין, או אצלכם בחברה. ליום שלם בדרך כלל נגיע אליכם.",
  },
  {
    id: "who",
    question: "למי זה מתאים?",
    answer: "צוותי שיווק, HR, מכירות, יזמים. כל מי שצריך לדבר מול מצלמה או לייצר תוכן בעצמו.",
  },
  {
    id: "vs-content-studio",
    question: "זה כמו סושיאל דאמפ?",
    answer: "לא. בסושיאל דאמפ אנחנו מצלמים ועורכים בשבילכם. בסדנה אתם לומדים לעשות את זה.",
  },
  {
    id: "size",
    question: "כמה אנשים?",
    answer: "עד 12 במפגש של שעתיים. ליום שלם אפשר יותר, בתיאום.",
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

export const WORKSHOPS_CONFIG: BusinessPageConfig = {
  brand: "סדנאות לצוותים",
  pageTitle: "סדנאות תוכן, טיקטוק ומול מצלמה",
  subtitle:
    "הצוות שלכם יוצא עם תוכן אמיתי ביד, לא רק מצגת. מעשי, באולפן או אצלכם.",
  pageFeatures: [
    "צילום רילז וטיקטוק מהנייד",
    "דיבור מול מצלמה בלי לגמגם",
    "עד 12 משתתפים במפגש",
    "יקיר מעביר, לא מתרגל",
  ],
  hubWhatsappText: "שלום, מעוניין/ת בסדנה לצוות (תוכן / טיקטוק / מול מצלמה).",
  utmCampaign: "workshops_hub",
  tiers: [
    tier(
      "team-2h",
      "סדנה לצוות, 2 שעות",
      "workshop_team_2h",
      "הכי נפוץ",
      "מפגש מעשי. יוצאים עם 2-3 סרטונים שהצוות צילם בעצמו.",
      ["עד 12 משתתפים", "טיקטוק, רילז, דיבור מול מצלמה", "משוב אישי לכל אחד", "באולפן או בחברה"],
      "workshop_team_2h",
    ),
    tier(
      "full-day",
      "יום שלם",
      "workshop_full_day",
      undefined,
      "יום עבודה מרוכז. מתאים ליום גיבוש או השקת נושא חדש.",
      ["6-7 שעות", "תרגילים + צילום בקבוצות", "סיכום והמלצות לצוות", "בדרך כלל בחברה"],
      "workshop_full_day",
    ),
    tier(
      "series",
      "3 מפגשים",
      "workshop_series_3",
      "הכי משתלם",
      "שלושה מפגשים לאותו צוות. יש זמן לתרגל בין לבין.",
      ["3×2 שעות", "עומק במקום ריצה", "ליווי בין המפגשים בוואטסאפ", "אותו נושא או מסלול מורחב"],
      "workshop_series_3",
    ),
  ],
  audienceIntro: "צוות שלומד לייצר תוכן בעצמו - לא הזמנת צילום חיצוני.",
  audienceItems: [
    {
      title: "שיווק ותוכן",
      body: "צוות שצריך לצלם רילז וטיקטוק מהנייד, בלי לחכות לצלם בכל פוסט.",
    },
    {
      title: "HR ומנהלים",
      body: "מנהלים שצריכים לדבר מול מצלמה בווידאו פנימי או בוובינר.",
    },
    {
      title: "מכירות ויזמים",
      body: "מי שמוכר בוידאו וצריך הגשה יציבה, קצרה וברורה.",
    },
    {
      title: "סוכנויות",
      body: "צוות לקוח שרוצה עצמאות תוכן אחרי שהסוכנות עוזבת את היום-יום.",
    },
  ],
  outcome: {
    title: "מה הצוות יוצא איתו ביד",
    body: "לא מצגת בלבד - סרטונים שהמשתתפים צילמו בעצמם בזמן הסדנה.",
    bullets: [
      "2-3 סרטונים ראשונים מהמפגש (בחבילת שעתיים)",
      "משוב אישי על דיבור מול מצלמה והגשה",
      "המלצות קצרות להמשך עבודה פנימית",
    ],
  },
  midCtaHeading: "רוצים סדנה לצוות?",
  midCtaBody:
    "שולחים גודל צוות ומטרה בוואטסאפ - חוזרים עם הצעה לשעתיים, יום שלם או סדרה.",
  processSteps: [
    { step: 1, title: "שיחה קצרה", body: "מבינים מי בצוות, מה המטרה, ומה רמת הניסיון." },
    { step: 2, title: "תכנון", body: "בונים תוכנית מותאמת. לא סילבוס גנרי מהמדף." },
    { step: 3, title: "סדנה", body: "מצלמים, מקליטים, מתקנים. הכל בזמן אמת." },
    { step: 4, title: "סיכום", body: "מסמכים קצר + קבצים שהצוות יצר." },
  ],
  aboutParagraphs: [
    "הרבה חברות קונות תוכן מוכן ונשארות תלויות בצלם חיצוני. סדנה טובה משנה את זה.",
    "אחרי שעתיים עם יקיר, אנשים שמפחדים מהמצלמה מצלמים רילז ראשון. זה קורה כל שבוע.",
    "מתאים גם ל-HR שרוצה שמנהלים חדשים ידברו טוב בווידאו, וגם לשיווק שרוצה לייצר פנימית.",
  ],
  faqs,
  relatedLinks: [
    { label: "סושיאל דאמפ", href: "/business/content-studio" },
    { label: "ניהול סושיאל", href: "/business/social-media" },
    { label: "האקדמיה", href: "/academy" },
  ],
};
