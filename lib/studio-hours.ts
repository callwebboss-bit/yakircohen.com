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

export function getHoursAvailabilityHint(now = new Date()): string {
  if (isShabbatOrAfterFriday(now)) {
    return 'שבת שלום - נחזור במוצ"ש';
  }
  if (isStudioOpen(now)) {
    return "זמין עכשיו";
  }
  return "חוזרים ב-9:00";
}

export function getContactAvailabilityLabel(now = new Date()): string {
  if (isShabbatOrAfterFriday(now)) {
    return 'שבת שלום - נחזור במוצ"ש';
  }
  return isStudioOpen(now)
    ? "זמין עכשיו - ממוצע תגובה 15 דקות"
    : "חוזרים ב-9:00 - ממוצע תגובה 15 דקות";
}
