import type { ProcessStep } from "@/components/marketing/ProcessSteps";

export const PHOTO_ENHANCE_PROCESS_STEPS: ProcessStep[] = [
  {
    number: 1,
    title: "שולחים את התמונות",
    description: "דרך וואטסאפ, מייל או Google Drive — סרוקות, מהטלפון או קבצים ישנים.",
  },
  {
    number: 2,
    title: "עיבוד AI",
    description: "הגדלת רזולוציה, חדות, שיפור צבעים וניקוי רעשים — הכל אוטומטי ומהיר.",
  },
  {
    number: 3,
    title: "בדיקה ותיקון ידני",
    description: "בודקים כל תמונה — לא רק מעלים ושוכחים. מתקנים ידנית בפוטושופ אם צריך.",
  },
  {
    number: 4,
    title: "מקבלים תמונות משודרגות",
    description: "קובץ JPG/PNG באיכות גבוהה, מוכן להדפסה או שימוש דיגיטלי. אם לא מרוצים — נתקן.",
  },
];

export const PHOTO_ENHANCE_AI_FEATURES: readonly string[] = [
  "הגדלת רזולוציה (upscaling) - מגדיל את התמונה פי 2-4 מבלי לאבד איכות",
  "תיקון חדות - הופך תמונה מטושטשת לחדה",
  "שיפור צבעים - מחזיר חיים לתמונות דהויות",
  'הסרת רעשים (grain/noise) - מנקה את ה"גרעיניות" של תמונות ישנות',
  "שיחזור פרטים - ה-AI ממציא פרטים שחסרו",
  "תיקון תאורה - מאזן חשיפה ובהירות",
] as const;

export const PHOTO_ENHANCE_STEPS: readonly { step: string; body: string }[] = [
  {
    step: "שלב 1: שולחים את התמונות",
    body: "דרך וואטסאפ, מייל או Google Drive - סרוקות, מהטלפון או קבצים ישנים.",
  },
  {
    step: "שלב 2: מעלים למערכת ה-AI",
    body: "התמונות נכנסות לעיבוד מקצועי.",
  },
  {
    step: "שלב 3: ה-AI מעבד ומשדרג",
    body: "הגדלה, חדות, צבעים וניקוי.",
  },
  {
    step: "שלב 4: בדיקה (ותיקון ידני אם צריך)",
    body: "אנחנו בודקים כל תוצאה - לא רק מעלים ושוכחים.",
  },
  {
    step: "שלב 5: מקבלים תמונות משודרגות",
    body: "איכות גבוהה. אם משהו לא מתאים - נתקן.",
  },
] as const;

export type PhotoEnhancePackage = {
  id: string;
  count: string;
  price: string;
  perImage: string;
  premium?: boolean;
  ctaLabel: string;
  whatsappMessage: string;
  utmCampaign: string;
};

export type PhotoEnhanceAddon = {
  id: string;
  title: string;
  price: string;
  ctaLabel: string;
  whatsappMessage: string;
  utmCampaign: string;
};

export const PHOTO_ENHANCE_PACKAGES: readonly PhotoEnhancePackage[] = [
  {
    id: "single",
    count: "תמונה בודדת",
    price: "50",
    perImage: "50 ₪ לתמונה",
    ctaLabel: "הזמינו תמונה אחת ←",
    whatsappMessage:
      "היי יקיר! רוצה לשדרג תמונה אחת ב-AI (50 ₪). אשמח לשלוח לבדיקה.",
    utmCampaign: "photo_enhance_pkg_single",
  },
  {
    id: "5",
    count: "5 תמונות",
    price: "200",
    perImage: "40 ₪ לתמונה",
    ctaLabel: "הזמינו חבילת 5 ←",
    whatsappMessage:
      "היי יקיר! מעוניין/ת בחבילת שדרוג ל-5 תמונות (200 ₪). אשמח פרטים.",
    utmCampaign: "photo_enhance_pkg_5",
  },
  {
    id: "10",
    count: "10 תמונות",
    price: "350",
    perImage: "35 ₪ לתמונה",
    premium: true,
    ctaLabel: "הזמינו חבילת 10 ←",
    whatsappMessage:
      "היי יקיר! מעוניין/ת בחבילת 10 תמונות לשדרוג AI (350 ₪).",
    utmCampaign: "photo_enhance_pkg_10",
  },
  {
    id: "20",
    count: "20 תמונות",
    price: "600",
    perImage: "30 ₪ לתמונה",
    ctaLabel: "הזמינו חבילת 20 ←",
    whatsappMessage:
      "היי יקיר! רוצה חבילת 20 תמונות לשדרוג AI (600 ₪). אשמח לשלוח את הקבצים.",
    utmCampaign: "photo_enhance_pkg_20",
  },
] as const;

export const PHOTO_ENHANCE_ADDONS: readonly PhotoEnhanceAddon[] = [
  {
    id: "manual-color",
    title: "תיקון צבע ידני (אם ה-AI לא מספיק)",
    price: "50 ₪ נוספים",
    ctaLabel: "בקשו תיקון צבע",
    whatsappMessage:
      "היי יקיר! רוצה תיקון צבע ידני לתמונה (תוספת 50 ₪). יש לי [כמה] תמונות.",
    utmCampaign: "photo_enhance_addon_color",
  },
  {
    id: "scratch-removal",
    title: "הסרת שריטות או כתמים",
    price: "50 ₪ נוספים",
    ctaLabel: "בקשו הסרת פגמים",
    whatsappMessage:
      "היי יקיר! יש תמונה עם שריטות או כתמים - אפשר להסיר? (תוספת 50 ₪)",
    utmCampaign: "photo_enhance_addon_scratch",
  },
  {
    id: "missing-parts",
    title: "שיחזור חלקים חסרים",
    price: "לפי בקשה",
    ctaLabel: "בדקו אם אפשר",
    whatsappMessage:
      "היי יקיר! יש תמונה עם חלקים חסרים - אפשר לשחזר? אשמח לשלוח לבדיקה.",
    utmCampaign: "photo_enhance_addon_restore",
  },
  {
    id: "colorization",
    title: "צביעת שחור-לבן (colorization)",
    price: "100 ₪ לתמונה",
    ctaLabel: "בקשו צביעה",
    whatsappMessage:
      "היי יקיר! רוצה לצבוע תמונת שחור-לבן (colorization, 100 ₪ לתמונה).",
    utmCampaign: "photo_enhance_addon_bw",
  },
] as const;

export const PHOTO_ENHANCE_COMPARE: readonly {
  title: string;
  regular: string;
  ai: string;
}[] = [
  {
    title: "הגדלת תמונה",
    regular: "נהיית מטושטשת",
    ai: "נשארת חדה",
  },
  {
    title: "פרטים",
    regular: "חדות מלאכותית",
    ai: 'ה-AI "ממציא" פרטים בצורה טבעית',
  },
  {
    title: "צבעים",
    regular: "ידני, לוקח זמן",
    ai: "אוטומטי, מדויק, מהיר",
  },
] as const;

export const PHOTO_ENHANCE_WHY_US: readonly string[] = [
  'לא סתם "מעלים לאתר AI" - בודקים כל תמונה ומתקנים ידנית בפוטושופ אם צריך',
  "20 שנות ניסיון בעבודה על תמונות ווידאו",
  "מחירים הוגנים - 50 ₪ לתמונה, הרבה פחות מעיצוב גרפי מלא",
  "מהירים - בדרך כלל יום עבודה אחד",
  "לא מרוצים? נתקן עד שתהיו מרוצים",
] as const;
