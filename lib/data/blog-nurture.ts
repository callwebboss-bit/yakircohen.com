/**
 * שכבת Nurture לפוסטי בלוג מרכזיים - בלי לשכתב את תוכן הליבה.
 * נטען רק בעמודי מאמר שמקושרים ל-NURTURE_BLOG_SLUGS.
 */

export type BlogNurtureServiceLink = {
  href: string;
  label: string;
};

export type BlogNurtureConfig = {
  /** למי זה מתאים - תבליטים קצרים */
  audience: readonly string[];
  /** קישורים פנימיים מדויקים לדפי שירות */
  serviceLinks: readonly BlogNurtureServiceLink[];
  /** כותרת CTA סיום (אופציונלי - דורס את callout) */
  ctaHeading?: string;
  /** גוף CTA סיום */
  ctaBody?: string;
  /** תווית כפתור וואטסאפ */
  ctaLabel?: string;
};

/** פוסטים מרכזיים שמקבלים שכבת המרה */
export const NURTURE_BLOG_SLUGS = [
  "mixing-mastering-explained",
  "how-to-choose-wedding-dj-israel",
  "podcast-production-guide-israel",
  "wedding-song-2026",
  "chuppah-song-guide-couples",
  "studio-recording-cost-israel-2026",
  "how-to-book-studio-modiin",
  "studio-guide",
  "pitch-correction-guide",
  "recorded-blessing-gift",
  "bride-groom-blessing-recording-tips",
  "first-podcast-without-wasting-money",
  "prepare-voice-podcast-studio",
  "on-site-podcast-studio-business",
  "business-podcast-roi-2026",
  "corporate-content-studio-guide",
  "bar-mitzvah-song-recording-guide",
  "mobile-recording-studio-guide",
  "home-studio-vs-professional-studio-2026",
  "wedding-dj-selection-guide-2026",
  "record-song-10-minutes-ai",
] as const;

export type NurtureBlogSlug = (typeof NURTURE_BLOG_SLUGS)[number];

export const BLOG_NURTURE_BY_SLUG: Record<NurtureBlogSlug, BlogNurtureConfig> = {
  "mixing-mastering-explained": {
    audience: [
      "מי שיש לו הקלטה גולמית ורוצה קובץ מוכן להפצה",
      "יוצרים שרוצים מיקס מקצועי בלי להקים אולפן בבית",
      "מי שמשווה בין עריכה עצמית למיקס מרחוק",
    ],
    serviceLinks: [
      { href: "/online/vocal-fix/mixing", label: "מיקס ומאסטרינג" },
      { href: "/online/vocal-fix", label: "שחזור סאונד AI" },
      { href: "/studio/recording-song-modiin", label: "הקלטת שיר באולפן" },
    ],
    ctaHeading: "רוצים מיקס מקצועי לקובץ שלכם?",
    ctaBody: "שולחים קובץ - מקבלים הצעה למיקס ומאסטרינג. בלי התחייבות.",
    ctaLabel: "שלחו קובץ בוואטסאפ",
  },
  "how-to-choose-wedding-dj-israel": {
    audience: [
      "זוגות שבוחרים DJ לחתונה ורוצים קריטריונים ברורים",
      "מי שמשווה מחיר מול ניסיון ותיאום עם האולם",
      "מי שרוצה גם אטרקציות או שיר לחופה באותו צוות",
    ],
    serviceLinks: [
      { href: "/events/dj-events", label: "DJ לחתונה" },
      { href: "/events/wedding-attractions-packages", label: "חבילות לחתונה" },
      { href: "/studio/recording-song-modiin", label: "שיר לחופה" },
    ],
    ctaHeading: "בודקים תאריך ל-DJ?",
    ctaBody: "שולחים תאריך ואולם - חוזרים עם זמינות והצעה.",
  },
  "podcast-production-guide-israel": {
    audience: [
      "מי שמתחיל פודקאסט ורוצה תהליך מסודר בישראל",
      "עסקים שרוצים פודקאסט מותג בלי לנהל הכל לבד",
      "מי שמשווה בין הקלטה בבית להפקה באולפן",
    ],
    serviceLinks: [
      { href: "/podcast", label: "מרכז פודקאסט" },
      { href: "/podcast/podcast-recording", label: "הקלטת פודקאסט" },
      { href: "/podcast/podcast-editing", label: "עריכת פודקאסט" },
    ],
    ctaHeading: "מוכנים להפיק פרק ראשון?",
    ctaBody: "תיאום קצר בוואטסאפ - מסלול הקלטה, עריכה או חבילה מלאה.",
  },
  "wedding-song-2026": {
    audience: [
      "זוגות שרוצים שיר מקורי או קאבר לחופה",
      "משפחות שמקליטות שיר במתנה לחתונה",
      "מי שלא שר מקצועית וצריך ליווי באולפן",
    ],
    serviceLinks: [
      { href: "/studio/recording-song-modiin", label: "הקלטת שיר באולפן" },
      { href: "/studio/blessings/bride-groom-blessing", label: "ברכת חתן וכלה" },
      { href: "/studio", label: "אולפן הקלטות במודיעין" },
    ],
    ctaHeading: "רוצים להקליט שיר לחתונה?",
    ctaBody: "תיאום סשן באולפן במודיעין - ליווי גם בלי ניסיון שירה.",
  },
  "chuppah-song-guide-couples": {
    audience: [
      "זוגות שבוחרים שיר כניסה לחופה",
      "מי שרוצה הקלטה אישית במקום פלייליסט בלבד",
      "מי שמתלבט בין קאבר לשיר מקורי",
    ],
    serviceLinks: [
      { href: "/studio/recording-song-modiin", label: "הקלטת שיר באולפן" },
      { href: "/studio/blessings", label: "הקלטת ברכות" },
      { href: "/for-couples", label: "מסלול לזוגות" },
    ],
    ctaHeading: "מתאמים שיר לחופה?",
    ctaBody: "שולחים רעיון או שיר - מתאמים הקלטה באולפן.",
  },
  "studio-recording-cost-israel-2026": {
    audience: [
      "מי שבודק כמה עולה הקלטה באולפן בישראל",
      "משפחות שמשוות חבילות שיר / ברכה",
      "מי שרוצה מחיר שקוף לפני תיאום",
    ],
    serviceLinks: [
      { href: "/studio/pricing", label: "מחירון אולפן" },
      { href: "/studio/recording-song-modiin", label: "הקלטת שיר באולפן" },
      { href: "/studio", label: "אולפן הקלטות במודיעין" },
    ],
    ctaHeading: "רוצים הצעה לפי מה שאתם מקליטים?",
    ctaBody: "שולחים סוג הקלטה (שיר / ברכה / פודקאסט) - מקבלים כיוון מחיר.",
  },
  "how-to-book-studio-modiin": {
    audience: [
      "מי שרוצה לתאם סשן באולפן במודיעין בלי בלבול",
      "לקוחות ראשונים שמגיעים בלי ניסיון",
      "מי שמשווה בין הגעה לאולפן לאולפן נייד",
    ],
    serviceLinks: [
      { href: "/studio", label: "אולפן הקלטות במודיעין" },
      { href: "/book", label: "הזמנה מקוונת" },
      { href: "/studio/mobile-studio", label: "אולפן נייד" },
    ],
    ctaHeading: "מוכנים לקבוע תאריך?",
    ctaBody: "תיאום בוואטסאפ או הזמנה מקוונת - לפי המסלול שבחרתם.",
  },
  "studio-guide": {
    audience: [
      "מי שמשווה אולפן מקצועי להקלטה בבית",
      "יוצרים שרוצים להבין מה מקבלים בסשן",
      "מי שמתכנן שיר, ברכה או פודקאסט",
    ],
    serviceLinks: [
      { href: "/studio/recording-studio", label: "אולפן הקלטות" },
      { href: "/studio/recording-song-modiin", label: "הקלטת שיר באולפן" },
      { href: "/studio/mobile-studio", label: "אולפן נייד" },
    ],
    ctaHeading: "רוצים סשן באולפן?",
    ctaBody: "בחרו מסלול - שיר, ברכה או אולפן נייד - ותאמו תאריך.",
  },
  "pitch-correction-guide": {
    audience: [
      "מי שיש לו שיר עם זיופים ורוצה תיקון טבעי",
      "מי שמפחד מאוטוטון רובוטי",
      "מי שמקליט באולפן או שולח קובץ מרחוק",
    ],
    serviceLinks: [
      { href: "/online/vocal-fix/pitch-correction", label: "תיקון זיופים" },
      { href: "/studio/recording-song-modiin", label: "הקלטת שיר באולפן" },
      { href: "/online/vocal-fix", label: "שחזור סאונד" },
    ],
    ctaHeading: "יש קובץ שצריך תיקון זיופים?",
    ctaBody: "שולחים דגימה קצרה - אומרים מה אפשרי ומה המחיר.",
  },
  "recorded-blessing-gift": {
    audience: [
      "מי שמחפש מתנה מוקלטת להורים או לזוג",
      "משפחות שרוצות ברכה לאירוע בלי במה חיה",
      "מי שרוצה קובץ מוכן להשמעה באולם",
    ],
    serviceLinks: [
      { href: "/studio/blessings", label: "הקלטת ברכות" },
      { href: "/studio/recording-song-modiin", label: "הקלטת שיר באולפן" },
      { href: "/studio/blessings/bride-groom-blessing", label: "ברכת חתן וכלה" },
    ],
    ctaHeading: "רוצים להקליט ברכה במתנה?",
    ctaBody: "תיאום קצר באולפן או מהבית - לפי מה שמתאים.",
  },
  "bride-groom-blessing-recording-tips": {
    audience: [
      "חתן וכלה (או משפחה) שמקליטים ברכה לחופה",
      "מי שרוצה טקסט מוכן לפני הסשן",
      "מי שמקליט בפעם הראשונה",
    ],
    serviceLinks: [
      { href: "/studio/blessings/bride-groom-blessing", label: "ברכת חתן וכלה" },
      { href: "/studio/blessings", label: "הקלטת ברכות" },
      { href: "/studio/recording-song-modiin", label: "שיר לחופה" },
    ],
    ctaHeading: "מתאמים ברכת חתן וכלה?",
    ctaBody: "שולחים טיוטת טקסט או רעיון - מתאמים הקלטה.",
  },
  "first-podcast-without-wasting-money": {
    audience: [
      "מי שמתחיל פודקאסט ורוצה לא לבזבז על ציוד מיותר",
      "עסקים שבודקים פיילוט לפני התחייבות ארוכה",
      "מי שמשווה בין אולפן לבית",
    ],
    serviceLinks: [
      { href: "/podcast", label: "מרכז פודקאסט" },
      { href: "/podcast/podcast-studio-modiin", label: "השכרת אולפן פודקאסט" },
      { href: "/podcast/podcast-editing", label: "עריכת פודקאסט" },
    ],
    ctaHeading: "מתחילים פודקאסט בלי לבזבז?",
    ctaBody: "ספרו מה המטרה - נציע מסלול פיילוט או הפקה מלאה.",
  },
  "prepare-voice-podcast-studio": {
    audience: [
      "מי שמקליט פודקאסט באולפן בפעם הראשונה",
      "אורחים ומרואיינים שרוצים להגיע מוכנים",
      "מנחים שרוצים קול יציב בסשן",
    ],
    serviceLinks: [
      { href: "/podcast/podcast-studio-modiin", label: "השכרת סטודיו לפודקאסט" },
      { href: "/podcast/podcast-recording", label: "הקלטת פודקאסט" },
      { href: "/podcast", label: "מרכז פודקאסט" },
    ],
    ctaHeading: "מתאמים הקלטת פודקאסט?",
    ctaBody: "תיאום אולפן במודיעין - עם ליווי טכני מההגעה.",
  },
  "on-site-podcast-studio-business": {
    audience: [
      "חברות שרוצות פודקאסט או ראיונות בחדר הישיבות",
      "HR ושיווק שמקליטים תוכן בלי לשלוח את כולם לאולפן",
      "מי שצריך חשבונית מס ותיאום לוגיסטי",
    ],
    serviceLinks: [
      { href: "/business/on-site-studio", label: "אולפן זמני בחברה" },
      { href: "/podcast/corporate-podcast", label: "פודקאסט לחברות" },
      { href: "/business/content-studio", label: "אולפן תוכן" },
    ],
    ctaHeading: "רוצים יום הקלטות במשרד?",
    ctaBody: "שולחים תאריך וכתובת - הצעה לחצי יום או יום מלא.",
  },
  "business-podcast-roi-2026": {
    audience: [
      "מנהלי שיווק שבודקים אם פודקאסט משתלם לעסק",
      "חברות שרוצות תוכן ארוך טווח ללינקדאין",
      "מי שמשווה פודקאסט לרילז בלבד",
    ],
    serviceLinks: [
      { href: "/podcast", label: "מרכז פודקאסט" },
      { href: "/podcast/corporate-podcast", label: "פודקאסט לחברות" },
      { href: "/podcast/bulk-production", label: "פס ייצור פודקאסט" },
    ],
    ctaHeading: "רוצים לבדוק פודקאסט לעסק?",
    ctaBody: "שיחת ייעוץ קצרה - מה המטרה ומה מסלול ההתחלה.",
  },
  "corporate-content-studio-guide": {
    audience: [
      "עסקים שרוצים יום צילום לרילז באולפן",
      "מותגים שצריכים תוכן שוטף בלי הפקה פנימית",
      "סוכנויות שמחפשות שותף הפקה",
    ],
    serviceLinks: [
      { href: "/business/content-studio", label: "סושיאל דאמפ / אולפן תוכן" },
      { href: "/business/reel-factory", label: "מפעל רילס" },
      { href: "/business", label: "מרכז לעסקים" },
    ],
    ctaHeading: "מתאמים יום תוכן באולפן?",
    ctaBody: "ספרו כמה רילז צריך בחודש - נתאים חבילה.",
  },
  "bar-mitzvah-song-recording-guide": {
    audience: [
      "משפחות שמקליטות שיר לבר או בת מצווה",
      "מי שרוצה ליווי גם בלי ניסיון שירה",
      "מי שמתלבט בין שיר לברכה מוקלטת",
    ],
    serviceLinks: [
      { href: "/studio/recording-song-modiin", label: "הקלטת שיר באולפן" },
      { href: "/studio/blessings/bar-mitzvah", label: "דרשה לבר מצווה" },
      { href: "/studio/blessings", label: "הקלטת ברכות" },
    ],
    ctaHeading: "מקליטים שיר לבר מצווה?",
    ctaBody: "תיאום סשן באולפן - ליווי מלא עד קובץ מוכן.",
  },
  "mobile-recording-studio-guide": {
    audience: [
      "מי שלא יכול להגיע למודיעין ורוצה הקלטה במקום",
      "משפחות שמקליטות בבית",
      "חברות שמעדיפות אולפן זמני במשרד",
    ],
    serviceLinks: [
      { href: "/studio/mobile-studio", label: "אולפן נייד" },
      { href: "/business/on-site-studio", label: "אולפן זמני בחברה" },
      { href: "/studio", label: "אולפן במודיעין" },
    ],
    ctaHeading: "רוצים שנגיע אליכם?",
    ctaBody: "שולחים מיקום ותאריך - בודקים זמינות והצעה.",
  },
  "home-studio-vs-professional-studio-2026": {
    audience: [
      "מי שמתלבט בין הקלטה בבית לאולפן מקצועי",
      "יוצרים שבודקים עלות מול איכות",
      "מי שרוצה להבין מתי שווה לצאת מהבית",
    ],
    serviceLinks: [
      { href: "/studio/recording-studio", label: "אולפן הקלטות" },
      { href: "/studio/recording-song-modiin", label: "הקלטת שיר באולפן" },
      { href: "/online/vocal-fix", label: "שיפור הקלטה מהבית" },
    ],
    ctaHeading: "לא בטוחים מה מתאים?",
    ctaBody: "ספרו מה מקליטים - נכוון לאולפן, נייד או עריכה מרחוק.",
  },
  "wedding-dj-selection-guide-2026": {
    audience: [
      "זוגות שבוחרים תקליטן לחתונה ב-2026",
      "מי שרוצה רשימת שאלות לפני הזמנה",
      "מי שמשלב DJ עם אטרקציות או שיר לחופה",
    ],
    serviceLinks: [
      { href: "/events/dj-events", label: "DJ לאירועים" },
      { href: "/events/attractions", label: "אטרקציות לאירוע" },
      { href: "/studio/recording-song-modiin", label: "שיר לחופה" },
    ],
    ctaHeading: "בודקים DJ לתאריך שלכם?",
    ctaBody: "שולחים תאריך - בודקים זמינות ומפרט.",
  },
  "record-song-10-minutes-ai": {
    audience: [
      "מי שרוצה שיר מהיר עם ליווי AI באולפן",
      "מתנה מקורית לאירוע או יום הולדת",
      "מי שרוצה ללמוד AI + מוזיקה עם מפיק",
    ],
    serviceLinks: [
      { href: "/academy/ai-music", label: "AI + מוזיקה" },
      { href: "/studio/recording-song-modiin", label: "הקלטת שיר באולפן" },
      { href: "/studio/recording-studio", label: "אולפן הקלטות" },
    ],
    ctaHeading: "רוצים לנסות סשן שיר עם AI?",
    ctaBody: "תיאום באולפן במודיעין - שירות בליווי או קורס 1:1.",
  },
};

import { buildClusterNurture } from "@/lib/data/blog-nurture-clusters";

export function getBlogNurture(
  slug: string,
  relatedServiceSlug?: string,
): BlogNurtureConfig | null {
  if ((NURTURE_BLOG_SLUGS as readonly string[]).includes(slug)) {
    return BLOG_NURTURE_BY_SLUG[slug as NurtureBlogSlug] ?? null;
  }
  if (relatedServiceSlug) {
    return buildClusterNurture(relatedServiceSlug);
  }
  return null;
}
