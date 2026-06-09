export type BookingUpsellItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  badge?: string;
};

/** טקסט מבוא לסיכום - מוצג מעל כפתורי הפעולה */
export const BOOKING_SUMMARY_INTRO =
  "זה סיכום ראשוני מהאתר - נמשיך בוואטסאפ ונוודא שהכל מתאים.";

/** כפתורי פעולה בטופס סיכום */
export const BOOKING_CTA = {
  continue_chat: "נמשיך את השיחה מכאן בוואטסאפ",
  start_now: "התחל תהליך והזמן עכשיו",
} as const;

/** אישורים קלים לצ'קבוקס בטופס סיכום */
export const BOOKING_APPROVALS_LIGHT = [
  "המחיר באתר הוא הערכה - הסכום הסופי ייקבע בשיחה קצרה",
  "הפרטים שמילאתי נכונים ככל שידוע לי",
  "מאשר/ת שיקיר יחזור אליי בוואטסאפ או בטלפון לתיאום",
] as const;

/** תשלומים - מוצג ליד אמונות בטופס הזמנה */
export const BOOKING_PAYMENT_NOTE =
  "ניתן לחלק עד 3 תשלומים שווים ללא ריבית - בתיאום מראש";

/** הודעות אחרי שליחה מוצלחת (מוצגות באתר) לפי כוונת המשתמש */
export const BOOKING_POST_SUBMIT = {
  continue_chat: {
    title: "הפרטים נשלחו בוואטסאפ",
    body: "יקיר יקבל את ההודעה ויחזור אליכם לתיאום. בדרך כלל תוך מספר שעות בשעות הפעילות. אם דחוף, שלחו הודעת מעקב בוואטסאפ.",
    reopenLabel: "נמשיך בוואטסאפ",
    newBookingLabel: "הזמנה חדשה",
  },
  start_now: {
    title: "בקשת ההזמנה נשלחה!",
    body: "יקיר רואה שאתם מוכנים להתחיל - יחזור אליכם בהקדם לסגירת הפרטים והזמנה.",
    reopenLabel: "פתחו שוב בוואטסאפ",
    newBookingLabel: "הזמנה חדשה",
  },
} as const;

/** @deprecated Use BOOKING_POST_SUBMIT.continue_chat */
export const BOOKING_POST_SUBMIT_MESSAGE = BOOKING_POST_SUBMIT.continue_chat;

/** ייעוץ 15 דקות - קישור בסוף תהליך ההזמנה (טקסט ההודעה נבנה דינמית) */
export const BOOKING_CONSULT_15_MIN = {
  title: "לא בטוחים? שיחת ייעוץ חינם (15 דקות)",
  subtitle:
    "שיחת ייעוץ חינם (15 דקות) עם יקיר - נמצא יחד את המסלול, המחיר ושדרוגים שמשתלמים, ללא התחייבות",
  utmCampaign: "booking_consult_15",
} as const;
