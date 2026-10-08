/**
 * המעטפת המשותפת לשני המיילים האוטומטיים ללקוח (auto-reply ו-pre-call-guide):
 * לוגו בראש, חתימה בסוף, עברית מימין לשמאל ו-Arial.
 *
 * למה: בדיקת הלוגו 7.10.2026 מצאה ששני המיילים יוצאים בלי לוגו, והבעלים אישר
 * להוסיף את הלוגו בכל מקום שחסר. החתימה עברה לכאן מ-auto-reply כדי ששני
 * המיילים ייסגרו באותה שורה ולא יופיעו בהם שתי חתימות.
 *
 * הלוגו הוא קובץ סטטי עם כתובת מלאה ולא next/image: מייל נפתח מחוץ לאתר,
 * וכך הוא גם לא נוגע במכסת אופטימיזציית התמונות של Vercel.
 * הקובץ נוצר ב-node scripts/generate-email-logo.mjs (480x216, מוצג ב-160x72).
 */

export const EMAIL_LOGO_SRC = "https://yakircohen.com/images/logo-email.png";
export const EMAIL_LOGO_WIDTH = 160;
/** 216 * 160 / 480. email-shell.test.ts בודק מול הקובץ עצמו */
export const EMAIL_LOGO_HEIGHT = 72;
export const EMAIL_BRAND_NAME = "יקיר כהן הפקות";

const LOGO_HTML =
  `<img src="${EMAIL_LOGO_SRC}" width="${EMAIL_LOGO_WIDTH}" height="${EMAIL_LOGO_HEIGHT}" ` +
  `alt="${EMAIL_BRAND_NAME}" style="display:block;border:0;margin:0 0 16px">`;

const SIGNATURE_HTML =
  `<p style="margin:24px 0 0;">${EMAIL_BRAND_NAME} · ` +
  `<a href="https://yakircohen.com">yakircohen.com</a></p>`;

/**
 * עוטף גוף מייל ב-HTML. dir="rtl" נוסף ל-direction בסגנון כי Outlook לשולחן
 * העבודה מכבד את התכונה גם כשהוא מתעלם מחלק מה-CSS.
 */
export function wrapCustomerEmail(bodyHtml: string): string {
  return `
<div dir="rtl" style="font-family:Arial,Helvetica,sans-serif;direction:rtl;text-align:right;color:#111;">
  ${LOGO_HTML}
  ${bodyHtml.trim()}
  ${SIGNATURE_HTML}
</div>`.trim();
}
