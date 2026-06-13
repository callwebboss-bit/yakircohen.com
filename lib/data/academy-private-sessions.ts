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
    price: 990,
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
      "היי יקיר! אני מעוניין/ת בשיעור מלא (60 דקות, 990 ₪). התחום: [הוסיפו]. אשמח לתיאום.",
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
    cta: "אני רוצה את זה!",
    utmCampaign: "academy_session_pro",
    whatsappText:
      "היי יקיר! אני מעוניין/ת ב-Pro Session (90 דקות, 1,280 ₪). התחום: [הוסיפו]. אשמח לתיאום.",
  },
] as const;

export const PRIVATE_SESSION_PRICE_NOTE =
  "כל המחירים לפני מע״מ - מפגש אפיון (450 ₪ + מע״מ) מתקזז מהרכישה הראשונה";
