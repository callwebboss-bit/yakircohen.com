import { BUSINESS_HOURS } from "@/lib/constants";

/**
 * שעות הפעילות נגזרות מ-BUSINESS_HOURS בלבד.
 *
 * עד 16.9.2026 היו כאן שעות קשיחות (סגירה ב-20:00, שבת סגור) בזמן שהפוטר
 * וסכמת LocalBusiness כבר אמרו 22:00 ומוצאי שבת 21:00-22:30. גולש ב-21:00
 * ראה בראש העמוד "סגור להיום" ובתחתיתו "פתוח עד 22:00". ההחלטה של הבעלים:
 * הפוטר והסכמה נכונים, וכל מקום שמציג שעות קורא מאותו מקור.
 *
 * הפירוק כאן הוא של מחרוזות התצוגה עצמן, כדי שלא יהיו שני מקורות. תווית
 * ימים שאינה מוכרת מפילה את הבנייה, ולא נכשלת בשקט בזמן ריצה.
 */
const DAY_INDEXES: Readonly<Record<string, readonly number[]>> = {
  "ראשון - חמישי": [0, 1, 2, 3, 4],
  "ראשון-חמישי": [0, 1, 2, 3, 4],
  שישי: [5],
  שבת: [6],
  "מוצאי שבת": [6],
};

const DAY_NAMES = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"] as const;

type OpeningWindow = { open: number; close: number };

function parseHour(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) + (m ?? 0) / 60;
}

/** "09:00 - 22:00" -> חלון; "סגור" או כל טקסט אחר -> null. */
function parseWindow(hours: string): OpeningWindow | null {
  const match = hours.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
  if (!match) return null;
  return { open: parseHour(match[1]!), close: parseHour(match[2]!) };
}

/** לוח לפי יום בשבוע (0 = ראשון). יום בלי שורה ב-BUSINESS_HOURS סגור. */
const SCHEDULE: readonly (OpeningWindow | null)[] = (() => {
  const byDay: (OpeningWindow | null)[] = [null, null, null, null, null, null, null];
  for (const row of BUSINESS_HOURS) {
    const days = DAY_INDEXES[row.days];
    if (!days) {
      throw new Error(`business-hours: תווית ימים לא מוכרת ב-BUSINESS_HOURS: "${row.days}"`);
    }
    const window = parseWindow(row.hours);
    for (const day of days) byDay[day] = window;
  }
  return byDay;
})();

function formatHour(hour: number): string {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export type BusinessOpenStatus = {
  isOpen: boolean;
  label: string;
};

export type NextOpening = {
  /** יום בשבוע של הפתיחה הבאה, 0 = ראשון. */
  day: number;
  /** כמה ימים קדימה: 0 היום, 1 מחר. */
  daysAhead: number;
  open: number;
};

/** הפתיחה הבאה מרגע נתון, או null אם אין אף חלון בלוח. */
export function getNextOpening(date: Date = new Date()): NextOpening | null {
  const day = date.getDay();
  const now = date.getHours() + date.getMinutes() / 60;
  const today = SCHEDULE[day];
  if (today && now < today.open) return { day, daysAhead: 0, open: today.open };
  for (let ahead = 1; ahead <= 7; ahead += 1) {
    const next = (day + ahead) % 7;
    const window = SCHEDULE[next];
    if (window) return { day: next, daysAhead: ahead, open: window.open };
  }
  return null;
}

export function getBusinessOpenStatus(date: Date = new Date()): BusinessOpenStatus {
  const day = date.getDay();
  const now = date.getHours() + date.getMinutes() / 60;
  const today = SCHEDULE[day];

  if (today && now >= today.open && now < today.close) {
    return { isOpen: true, label: "פתוח עכשיו" };
  }

  const next = getNextOpening(date);
  if (!next) return { isOpen: false, label: "סגור" };
  const at = formatHour(next.open);

  if (next.daysAhead === 0) {
    return {
      isOpen: false,
      label: day === 6 ? `סגור בשבת. חוזרים במוצאי שבת ב-${at}` : `סגור. נפתח היום ב-${at}`,
    };
  }
  if (next.day === 6) {
    return { isOpen: false, label: `סגור לשבת. חוזרים במוצאי שבת ב-${at}` };
  }
  if (next.daysAhead === 1) {
    return { isOpen: false, label: `סגור להיום. חוזרים מחר ב-${at}` };
  }
  return { isOpen: false, label: `סגור להיום. חוזרים ביום ${DAY_NAMES[next.day]} ב-${at}` };
}

export function isLikelyAvailableForWhatsApp(date: Date = new Date()): boolean {
  return getBusinessOpenStatus(date).isOpen;
}

export { BUSINESS_HOURS };
