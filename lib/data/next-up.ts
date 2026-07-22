/**
 * הצעה אחת בלבד להמשך בסוף דף שירות.
 * מחזקת ניוד בלי להעמיס - לא מחליפה PageRelatedFooter / PageBottomCta.
 */

export type NextUpSuggestion = {
  href: string;
  /** שאלה קצרה בשפת המשתמש */
  prompt: string;
  /** תווית קישור */
  label: string;
};

/**
 * מיפוי pathname מדויק → הצעה אחת.
 * נתיבים ארוכים יותר נבדקים לפני קידומות כלליות ב-getNextUpSuggestion.
 */
export const NEXT_UP_BY_PATH: Readonly<Record<string, NextUpSuggestion>> = {
  "/studio/recording-song-modiin": {
    href: "/studio/blessings/video-clip",
    prompt: "רוצים גם קליפ לשיר?",
    label: "שיר + קליפ",
  },
  "/studio/recording-song-modiin/gifts": {
    href: "/studio/recording-song-modiin",
    prompt: "רוצים לראות את חבילת השיר המלאה?",
    label: "הקלטת שיר באולפן",
  },
  "/studio/blessings": {
    href: "/studio/recording-song-modiin",
    prompt: "רוצים גם שיר לאירוע?",
    label: "הקלטת שיר",
  },
  "/studio/blessings/video-clip": {
    href: "/studio/recording-song-modiin",
    prompt: "צריכים הקלטת שיר מלאה?",
    label: "הקלטת שיר באולפן",
  },
  "/studio/mobile-studio": {
    href: "/pricing",
    prompt: "רוצים לראות מחירים?",
    label: "מחירון מרכזי",
  },
  "/studio/recording-studio": {
    href: "/studio/pricing",
    prompt: "רוצים לראות מחירון אולפן?",
    label: "מחירון אולפן",
  },
  "/studio/pricing": {
    href: "/book#studio",
    prompt: "מוכנים לתאם אולפן?",
    label: "הזמנה מקוונת",
  },
  "/studio": {
    href: "/studio/recording-song-modiin",
    prompt: "מה רוב האנשים מתחילים איתו?",
    label: "הקלטת שיר",
  },
  "/podcast": {
    href: "/podcast/podcast-editing",
    prompt: "צריכים גם עריכה?",
    label: "עריכת פודקאסט",
  },
  "/podcast/podcast-recording": {
    href: "/podcast/podcast-editing",
    prompt: "צריכים גם עריכה?",
    label: "עריכת פודקאסט",
  },
  "/podcast/podcast-editing": {
    href: "/podcast/podcast-recording",
    prompt: "עדיין בלי הקלטה באולפן?",
    label: "הקלטת פודקאסט",
  },
  "/podcast/podcast-studio-modiin": {
    href: "/podcast/podcast-recording",
    prompt: "רוצים גם הפקה מלאה?",
    label: "הקלטת פודקאסט",
  },
  "/podcast/mobile-podcast-at-home": {
    href: "/pricing",
    prompt: "רוצים לראות מחירים?",
    label: "מחירון מרכזי",
  },
  "/podcast/corporate-podcast": {
    href: "/business",
    prompt: "עוד שירותים לעסק?",
    label: "מסלולי עסקים",
  },
  "/events/dj-events": {
    href: "/events/attractions",
    prompt: "רוצים גם אטרקציות?",
    label: "אטרקציות לאירועים",
  },
  "/events/attractions": {
    href: "/events/wedding-attractions-packages",
    prompt: "רוצים חבילה משולבת?",
    label: "חבילות לחתונה",
  },
  "/events": {
    href: "/events/dj-events",
    prompt: "מתחילים מ-DJ?",
    label: "DJ לאירועים",
  },
  "/academy/dj-course": {
    href: "/academy/music-production",
    prompt: "רוצים גם ללמוד הפקה?",
    label: "קורס הפקה מוזיקלית",
  },
  "/academy/music-production": {
    href: "/studio/recording-song-modiin",
    prompt: "רוצים שנפיק לכם שיר?",
    label: "הקלטת שיר באולפן",
  },
  "/academy/voiceover": {
    href: "/voiceover",
    prompt: "צריכים קריין לפרויקט עכשיו?",
    label: "שירותי קריינות",
  },
  "/academy/private-lessons": {
    href: "/academy",
    prompt: "רוצים מסלול מלא במקום שיעור בודד?",
    label: "כל מסלולי האקדמיה",
  },
  "/academy/workshops": {
    href: "/business/content-studio",
    prompt: "מעדיפים שנצלם בשבילכם?",
    label: "סושיאל דאמפ",
  },
  "/business": {
    href: "/business/on-site-studio",
    prompt: "רוצים אולפן במשרד?",
    label: "אולפן זמני בחברה",
  },
  "/business/on-site-studio": {
    href: "/pricing",
    prompt: "רוצים לראות מחירים?",
    label: "מחירון מרכזי",
  },
  "/online": {
    href: "/online/vocal-fix",
    prompt: "יש קובץ שצריך תיקון?",
    label: "תיקון ווקאלי",
  },
  "/online/vocal-fix": {
    href: "/online/vocal-fix/send-file",
    prompt: "מוכנים לשלוח קובץ?",
    label: "שליחת קובץ",
  },
  "/pricing": {
    href: "/book",
    prompt: "ראיתם מחיר - מוכנים להזמין?",
    label: "הזמנה מקוונת",
  },
  "/voiceover": {
    href: "/academy/voiceover",
    prompt: "רוצים ללמוד קריינות בעצמכם?",
    label: "קורס קריינות",
  },
};

const PREFIX_FALLBACKS: readonly { prefix: string; suggestion: NextUpSuggestion }[] = [
  {
    prefix: "/studio/blessings/",
    suggestion: {
      href: "/studio/blessings",
      prompt: "רוצים לראות את כל סוגי הברכות?",
      label: "הקלטת ברכות",
    },
  },
  {
    prefix: "/studio/",
    suggestion: {
      href: "/studio/pricing",
      prompt: "רוצים לראות מחירון אולפן?",
      label: "מחירון אולפן",
    },
  },
  {
    prefix: "/podcast/",
    suggestion: {
      href: "/podcast/podcast-editing",
      prompt: "צריכים גם עריכה?",
      label: "עריכת פודקאסט",
    },
  },
  {
    prefix: "/events/",
    suggestion: {
      href: "/events/attractions",
      prompt: "רוצים גם אטרקציות?",
      label: "אטרקציות לאירועים",
    },
  },
  {
    prefix: "/academy/",
    suggestion: {
      href: "/academy",
      prompt: "רוצים לראות את כל המסלולים?",
      label: "האקדמיה",
    },
  },
  {
    prefix: "/business/",
    suggestion: {
      href: "/business",
      prompt: "עוד שירותים לעסק?",
      label: "מסלולי עסקים",
    },
  },
  {
    prefix: "/online/",
    suggestion: {
      href: "/online",
      prompt: "עוד שירותים מרחוק?",
      label: "שירותים אונליין",
    },
  },
];

export function getNextUpSuggestion(pathname: string): NextUpSuggestion | null {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (normalized === "/" || normalized === "/book") return null;

  const exact = NEXT_UP_BY_PATH[normalized];
  if (exact) return exact;

  for (const row of PREFIX_FALLBACKS) {
    if (normalized.startsWith(row.prefix)) return row.suggestion;
  }

  return null;
}
