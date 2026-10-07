import { getExVat } from "@/lib/data/pricing-catalog";

export type PrivateSessionPlan = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  duration: string;
  features: readonly string[];
  cta: string;
  badge?: string;
  featured?: boolean;
  utmCampaign: string;
  whatsappText: string;
};

export const PRIVATE_SESSION_PLANS: readonly PrivateSessionPlan[] = [
  {
    id: "full-hour",
    name: "שיעור מלא",
    tagline: "הסטנדרט ללמידה מעמיקה",
    price: getExVat("academy_private_hour"),
    duration: "60 דקות (שעה)",
    features: [
      "לימוד נושא חדש לעומק",
      "תרגול מעשי באולפן במודיעין",
      "תשומת לב מלאה 1:1",
      "סיכום ומשימות להמשך",
    ],
    cta: "קבע עכשיו",
    utmCampaign: "academy_session_full",
    whatsappText:
      "היי יקיר, אני מעוניין/ת בשיעור מלא (60 דקות, 990 ₪). התחום: [הוסיפו]. אשמח לתיאום.",
  },
  {
    id: "pro-session",
    name: "Pro Session",
    tagline: "מקסימום ערך בזמן קצר",
    price: 1280,
    duration: "90 דקות (שעה וחצי)",
    badge: "הכי משתלם",
    featured: true,
    features: [
      "צלילה לעומק + תרגול נרחב",
      "הספק כפול משיעור רגיל",
      "ניתוח סט / מיקס / ביצוע אישי",
      "אידיאלי ל-DJ, הפקה ופיתוח קול",
    ],
    cta: "אני רוצה את זה",
    utmCampaign: "academy_session_pro",
    whatsappText:
      "היי יקיר, אני מעוניין/ת ב-Pro Session (90 דקות, 1,280 ₪). התחום: [הוסיפו]. אשמח לתיאום.",
  },
  /* פיתוח קול, נוסף 7.10.2026. העמוד הזה הבטיח "פיתוח קול" כבר קודם,
     בלי מחיר ובלי דרך להזמין. המחיר נמוך משיעור פרטי רגיל כי השיעור
     מועבר עם מורה לפיתוח קול מהצוות, לבד או יחד עם יקיר. */
  {
    id: "vocal-coaching",
    name: "פיתוח קול",
    tagline: "לזמרים וזמרות בתחילת הדרך",
    price: getExVat("vocal_coaching_hour"),
    duration: "60 דקות",
    features: [
      "שעה עם מורה לפיתוח קול מהצוות",
      "באולפן במודיעין, אצלכם, במקום ניטרלי או בזום",
      "אפשר גם יחד עם יקיר, כשצריך גם אוזן של מקליט",
      "מתאים גם כהכנה לפני סשן הקלטה",
    ],
    cta: "לתיאום שיעור",
    utmCampaign: "academy_vocal_coaching",
    whatsappText:
      "היי יקיר, אני מעוניין/ת בשיעור פיתוח קול (60 דקות, 500 ₪ לפני מע״מ). אשמח לתיאום.",
  },
] as const;

export const PRIVATE_SESSION_PRICE_NOTE =
  "המחיר הגדול כולל מע״מ (18%), ובקטן הסכום לפני מע״מ. שיחת היכרות ראשונה - חינם.";
