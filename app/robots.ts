import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

/**
 * Production indexing is ON (index: true in layout + constructMetadata).
 * Vercel *preview* deployments may still send X-Robots-Tag: noindex  -  that is
 * platform-only and does not apply to yakircohen.com production.
 */

/**
 * /admin ו-/thank-you כבר noindex, אבל בלי disallow גוגל עדיין סורק
 * אותם. לאתר יש 1,030 עמודים שנסרקו ולא נכנסו לאינדקס, ולכן כל סריקה
 * מיותרת נגרעת מהתקציב של העמודים שכן צריכים להיכנס.
 * בטוח לחסום כאן כי אין לעמודים האלה שום קישור נכנס.
 */
const DISALLOW = ["/api/", "/admin/", "/thank-you"];

/**
 * סורקי הבינה המלאכותית שמזינים מנועי תשובות. הרשאה מפורשת היא אות חיובי
 * זול, והיא גם ההצהרה שמונעת ספק כשספק חוסם כברירת מחדל.
 *
 * Google-Extended אינו סורק אלא אסימון שליטה: הוא קובע אם גוגל משתמשת
 * בתוכן ל-Gemini ולביסוס תשובות, ולכן הוא שייך לכאן ולא לרשימת הסורקים.
 *
 * מלכודת שחייבים לשמור עליה: לפי RFC 9309 סורק מציית לקבוצה הספציפית
 * ביותר ששמו מופיע בה, ומתעלם לחלוטין מקבוצת ה-*. כלומר ברגע שיש כאן
 * קבוצה בשם GPTBot, ה-disallow של קבוצת ה-* כבר לא חל עליה.
 * לכן רשימת החסימות חוזרת כאן במפורש. מי שיפשט את זה ל-allow בלבד
 * יפתח לסורקי ה-AI את /api, /admin ו-/thank-you.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-Web",
  "Applebot-Extended",
  "Google-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: AI_CRAWLERS,
        allow: "/",
        disallow: DISALLOW,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
