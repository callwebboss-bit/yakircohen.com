export const SINGER_WHY_BLOCKS: readonly {
  emoji: string;
  title: string;
  description: string;
  bullets?: readonly string[];
}[] = [
  {
    emoji: "🛡️",
    title: "גיבוי לכל מקרה",
    description: "הופעה לא סובלת טעויות  -  ציוד גיבוי וטכנאי שפותר תוך שניות.",
    bullets: [
      "מיקרופון גיבוי מוכן ומחובר",
      "כבלים נוספים",
      "מיקסר חלופי במקרה קיצון",
    ],
  },
  {
    emoji: "⏱️",
    title: "צ'ק סאונד אמיתי",
    description: "30–45 דקות  -  לא \"טסט טסט\". עד שמרגישים מוכנים.",
    bullets: [
      "רמות, EQ, קומפרסור",
      "התאמת מוניטורים",
      "איזון ווקאל מול ליווי",
      "תיקונים עד נוחות מלאה",
    ],
  },
  {
    emoji: "💎",
    title: "ציוד מקצועי",
    description: "Shure SM58 / Beta 58A, EV RE20, מוניטורים, RCF, Allen & Heath.",
  },
  {
    emoji: "🎯",
    title: "שירות מלא",
    description: "לא רק רמקולים  -  טכנאי לאורך כל ההופעה.",
    bullets: [
      "הקמה מלאה",
      "צ'ק סאונד מקצועי",
      "התאמות אישיות",
      "פתרון מיידי לכל בעיה",
    ],
  },
] as const;

export const SINGER_PACKAGES: readonly {
  id: string;
  name: string;
  price: string;
  badge?: string;
  includes: readonly string[];
  suitedFor: string;
}[] = [
  {
    id: "basic",
    name: "חבילה 1: בסיס מקצועי",
    price: "2,800 ₪",
    badge: "פופולרי",
    includes: [
      "2 מיקרופונים Shure SM58",
      "זוג רמקולי RCF פרונט (500W)",
      "סאב RCF 15 אינץ׳",
      "מיקסר Allen & Heath אנלוגי",
      "מוניטור אישי אחד",
      "טכנאי לאורך ההופעה",
      "צ'ק סאונד 30 דקות",
      "הובלה, הקמה ופירוק",
    ],
    suitedFor: "סולו/דואט, עד 150 אורחים",
  },
  {
    id: "premium",
    name: "חבילה 2: פרימיום",
    price: "5,800 ₪",
    includes: [
      "3 מיקרופונים אלחוטיים Shure Beta 58A",
      "4 רמקולי RCF פרונט",
      "2 סאבים RCF",
      "מיקסר דיגיטלי + אפקטים",
      "2–3 מוניטורים אישיים",
      "טכנאי מנוסה",
      "צ'ק סאונד 45 דקות",
      "הובלה, הקמה ופירוק",
    ],
    suitedFor: "להקה 3–4, עד 350 אורחים",
  },
  {
    id: "vip",
    name: "חבילה 3: VIP",
    price: "7,800 ₪",
    includes: [
      "עד 6 מיקרופונים (Shure + EV RE20)",
      "Line Array RCF HDL6-A",
      "4 סאבים",
      "מיקסר 32 ערוצים + עיבוד דינמי",
      "IEM או מוניטורים לכולם",
      "2 טכנאים (FOH + מוניטורים)",
      "צ'ק סאונד שעה+",
      "אופציה להקלטה מהמיקסר",
      "הובלה, הקמה ופירוק",
    ],
    suitedFor: "להקות גדולות, 300+ אורחים, קונצרטים",
  },
] as const;

export const SINGER_ADDONS: readonly { name: string; price: string }[] = [
  { name: "מיקרופון נוסף", price: "150 ₪" },
  { name: "מוניטור אישי נוסף", price: "200 ₪" },
  { name: "שליטה מרחוק על המיקס (אפליקציה)", price: "300 ₪" },
  { name: "הקלטת ההופעה מהמיקסר", price: "500 ₪" },
  { name: "שעות נוספות", price: "300 ₪/שעה" },
] as const;

export const SINGER_PROCESS: readonly {
  step: string;
  title: string;
  description: string;
}[] = [
  {
    step: "01",
    title: "שיחת תיאום",
    description: "מיקום, קהל, סגנון, דרישות  -  הצעת מחיר מדויקת.",
  },
  {
    step: "02",
    title: "הזמנה ואישור",
    description: "מקדמה 30% לשריון תאריך, יתרה ביום ההופעה.",
  },
  {
    step: "03",
    title: "הגעה והקמה",
    description: "לפחות שעתיים לפני  -  הקמה ובדיקות.",
  },
  {
    step: "04",
    title: "צ'ק סאונד",
    description: "30–60 דקות לפני  -  עד שמרגישים מוכנים.",
  },
  {
    step: "05",
    title: "ההופעה + פירוק",
    description: "טכנאי בשטח כל הזמן, פירוק בסוף.",
  },
] as const;

export const SINGER_VALUE_POINTS: readonly string[] = [
  "ראש שקט  -  הכול עובד, מתמקדים בהופעה",
  "מקצועיות  -  טכנאי שיודע, לא חובבן",
  "ציוד אמין  -  Shure, RCF, Allen & Heath",
  "גיבוי  -  פתרון תוך שניות",
  "איכות סאונד  -  נשמעים כמו שצריך",
] as const;

export const SINGER_TRAVEL_NOTE =
  "מרכז  -  ללא תוספת · צפון +300 ₪ · דרום +500 ₪ (מבסיס מודיעין)";
