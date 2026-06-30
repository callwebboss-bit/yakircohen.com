import { BUSINESS_HOURS } from "@/lib/constants";

function parseHour(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) + (m ?? 0) / 60;
}

function isOpenAt(dayIndex: number, hour: number, minute: number): boolean {
  const now = hour + minute / 60;
  if (dayIndex === 6) return false;
  if (dayIndex === 5) {
    return now >= parseHour("09:00") && now < parseHour("14:00");
  }
  return now >= parseHour("09:00") && now < parseHour("20:00");
}

export type BusinessOpenStatus = {
  isOpen: boolean;
  label: string;
};

export function getBusinessOpenStatus(date: Date = new Date()): BusinessOpenStatus {
  const dayIndex = date.getDay();
  const hour = date.getHours();
  const minute = date.getMinutes();

  if (isOpenAt(dayIndex, hour, minute)) {
    return { isOpen: true, label: "פתוח עכשיו" };
  }

  if (dayIndex === 6) {
    return { isOpen: false, label: "סגור בשבת. חוזרים יום ראשון ב-09:00" };
  }

  if (dayIndex === 5 && hour >= 14) {
    return { isOpen: false, label: "סגור לשבת. חוזרים יום ראשון ב-09:00" };
  }

  if (hour < 9) {
    return { isOpen: false, label: "סגור. נפתח היום ב-09:00" };
  }

  return { isOpen: false, label: "סגור להיום. חוזרים מחר ב-09:00" };
}

export function isLikelyAvailableForWhatsApp(date: Date = new Date()): boolean {
  return getBusinessOpenStatus(date).isOpen;
}

export { BUSINESS_HOURS };
