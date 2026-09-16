import { getBusinessOpenStatus, getNextOpening } from "@/lib/business-hours";

/**
 * מחוון החי, הצ׳אט ותגי הכותרת. השעות עצמן חיות ב-lib/business-hours,
 * שנגזר מ-BUSINESS_HOURS. עד 16.9.2026 היו כאן שעות קשיחות (20:00, שבת
 * סגור) שסתרו את הפוטר ואת הסכמה.
 */
export function isStudioOpen(now = new Date()): boolean {
  return getBusinessOpenStatus(now).isOpen;
}

/** סגור, והפתיחה הבאה היא במוצאי שבת: שישי אחר הצהריים או שבת לפני 21:00. */
export function isShabbatOrAfterFriday(now = new Date()): boolean {
  if (getBusinessOpenStatus(now).isOpen) return false;
  const next = getNextOpening(now);
  return next !== null && next.day === 6;
}

/**
 * תווית הזמינות בעמוד הקשר. אינה תלויה בשעון, בכוונה.
 *
 * הנוסח הקודם החזיר "זמין עכשיו - מענה אנושי" או "שבת שלום" לפי השעה,
 * אבל הוא נקרא בתוך useState בזמן הרינדור בשרת, ולכן השעה נצרבה ל-HTML
 * הסטטי ונשארה שם עד הבנייה הבאה. גולש בצהריים ראה את התווית של הלילה.
 *
 * המחרוזת שנשארה היא זו שכבר הייתה בקוד לשעות הסגירה, והיא נכונה
 * בכל שעה: פניות באמת מתקבלות תמיד, והמענה באמת מתחיל ב-9:00.
 */
export function getContactAvailabilityLabel(): string {
  return "מקבלים פניות מסביב לשעון, עונים מ-9:00";
}
