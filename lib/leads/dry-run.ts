/**
 * LEAD_DRY_RUN לבדיקה מקומית של כל מסלול הלידים בלי ליצור ליד אמיתי.
 *
 * "1": Redis בזיכרון בלבד, בלי קריאה ל-Resend, והמייל שהיה נשלח נכתב ללוג.
 * "fail": כמו "1", אבל שליחת המייל לבעלים "נכשלת", כדי לראות את מסך הגיבוי.
 *
 * בפרודקשן המשתנה נבלע תמיד: משתנה שנשכח ב-Vercel לא יכול להעלים לידים.
 */
export type LeadDryRunMode = "off" | "ok" | "fail";

export function leadDryRunMode(): LeadDryRunMode {
  if (process.env.NODE_ENV === "production") return "off";
  const v = process.env.LEAD_DRY_RUN?.trim().toLowerCase();
  if (v === "fail") return "fail";
  if (v === "1" || v === "true") return "ok";
  return "off";
}
