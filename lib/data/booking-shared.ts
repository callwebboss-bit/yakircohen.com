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

/** וידאו BTS לפאנל הצלחה — לפי קטגוריית הזמנה */
import type { BookCategoryId } from "@/lib/book-url";
import { FEATURED_YOUTUBE_VIDEO_ID } from "@/lib/constants";

export const BOOKING_SUCCESS_BTS: Partial<
  Record<BookCategoryId, { videoId: string; title: string }>
> = {
  studio: { videoId: "k5Z5TIlreAY", title: "מאחורי הקלעים באולפן ההקלטות" },
  podcast: { videoId: "XiiOcx8doz0", title: "מאחורי הקלעים — הקלטת פודקאסט" },
  events: { videoId: "hg5qW6nk0iU", title: "מאחורי הקלעים — אירוע בשטח" },
  dj: { videoId: "5pBisBkfTEg", title: "מאחורי הקלעים — DJ באירוע" },
  singer: { videoId: "k5Z5TIlreAY", title: "מאחורי הקלעים באולפן" },
  academy: { videoId: FEATURED_YOUTUBE_VIDEO_ID, title: "מאחורי הקלעים באקדמיה" },
  online: { videoId: FEATURED_YOUTUBE_VIDEO_ID, title: "מאחורי הקלעים — עיבוד AI" },
  clips: { videoId: FEATURED_YOUTUBE_VIDEO_ID, title: "מאחורי הקלעים — הפקת קליפ" },
};

export function resolveBookingBtsVideo(category?: BookCategoryId) {
  if (category && BOOKING_SUCCESS_BTS[category]) {
    return BOOKING_SUCCESS_BTS[category]!;
  }
  return {
    videoId: FEATURED_YOUTUBE_VIDEO_ID,
    title: "60 שניות מאחורי הקלעים באולפן",
  };
}

/** הודעות אחרי שליחה מוצלחת (מוצגות באתר) לפי כוונת המשתמש */
export const BOOKING_POST_SUBMIT = {
  continue_chat: {
    title: "הפרטים נשלחו בהצלחה!",
    body: "כדי שלא תצטרכו לחכות — קפצו איתנו ישירות לוואטסאפ לתיאום מהיר של הפגישה. בזמן שאנחנו חוזרים אליכם, צפו ב-60 שניות מאחורי הקלעים באולפן שלנו.",
    reopenLabel: "תיאום מהיר בוואטסאפ ←",
    newBookingLabel: "הזמנה חדשה",
  },
  start_now: {
    title: "בקשת ההזמנה נשלחה!",
    body: "אתם מוכנים להתחיל — לחצו לוואטסאפ עכשיו לסגירה מהירה. בינתיים, הצצה קצרה מאחורי הקלעים.",
    reopenLabel: "סגרו עכשיו בוואטסאפ ←",
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
