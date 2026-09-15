/** Studio open hours -- single source for live indicator, contact, and status bar. */

export function isStudioOpen(now = new Date()): boolean {
  const day = now.getDay(); // 0=Sun ... 6=Sat
  const hour = now.getHours();
  if (day === 6) return false;
  if (day === 5) return hour >= 9 && hour < 14;
  return hour >= 9 && hour < 20;
}

export function isShabbatOrAfterFriday(now = new Date()): boolean {
  const day = now.getDay();
  const hour = now.getHours();
  return (day === 5 && hour >= 14) || day === 6;
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
