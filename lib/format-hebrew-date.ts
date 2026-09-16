/**
 * תאריך עברי קריא מתוך ISO.
 *
 * היה משוכפל פעמיים, ב-BlogFeaturedStrip.tsx וב-ArticleFeed.tsx, ושורת
 * העדכון בעמוד הפוסט הייתה הופכת אותו לעותק שלישי. שלושה עותקים של אותה
 * פונקציה הם שלושה מקומות שבהם פורמט התאריך יכול להתפצל בשקט.
 */
export function formatHebrewDate(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat("he-IL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}
