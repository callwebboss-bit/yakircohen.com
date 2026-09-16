/**
 * כתובות הזהות הרשמיות ל-sameAs.
 *
 * למה שתי רשימות ולא אחת: המערך הזה הוצמד כמות שהוא לשלושה צמתים,
 * Organization, LocalBusiness וגם Person של יקיר. כלומר צומת האדם הצהיר
 * שרישום Google Maps של העסק הוא אחת מכתובות הזהות שלו. זה אומר למנוע
 * שהאדם והעסק הם אותה ישות, וערבוב כזה מחליש את שתיהן: המנוע לא יודע
 * למי לייחס ביקורות, למי לייחס מומחיות, ולמי לייחס כתובת פיזית.
 *
 * הפרופילים החברתיים נשארים על שתי הישויות במכוון. אלה חשבונות של מותג
 * אישי, "יקיר כהן" ו-"dj.yakir.cohen", וסביר ונכון שהם מייצגים גם את
 * האדם וגם את העסק. רישום המפה הוא של העסק בלבד.
 *
 * כל חמש הכתובות נבדקו ומחזירות 200. ה-TikTok באמת כתוב offical, זה
 * ההאנדל האמיתי ולא שגיאת הקלדה.
 */
const SOCIAL_PROFILES = [
  "https://www.youtube.com/@Yakircohen",
  "https://www.instagram.com/yakir.cohen.official/",
  "https://www.facebook.com/dj.yakir.cohen/",
  "https://www.tiktok.com/@yakir.cohen.offical",
] as const;

/** רישום העסק במפות. שייך לעסק בלבד, לא לאדם. */
const BUSINESS_LISTING = "https://maps.app.goo.gl/mZXM2wzCtZpFKT5Y8";

/** הזהות של העסק: Organization ו-LocalBusiness. */
export const BRAND_SAME_AS = [...SOCIAL_PROFILES, BUSINESS_LISTING] as const;

/** הזהות של האדם: צומת ה-#founder. בלי רישום העסק במפות. */
export const FOUNDER_SAME_AS = [...SOCIAL_PROFILES] as const;

export const FOUNDER_IMAGE_URL =
  "https://yakircohen.com/images/services/studio/hub/אולפן פודקאסט - יקיר כהן 1.webp";

export const FOUNDER_KNOWS_ABOUT = [
  "הפקת פודקאסט",
  "אולפן הקלטות",
  "DJ לאירועים",
  "עריכת סאונד",
] as const;
