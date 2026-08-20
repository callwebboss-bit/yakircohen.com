export const CORPORATE_VIDEO_PROCESS = [
  {
    step: "01",
    title: "אפיון מסר",
    body: "פגישת brief: קהל יעד, מסר מרכזי, פלטפורמות (אתר, LinkedIn, מטא) וקריאה לפעולה.",
  },
  {
    step: "02",
    title: "תסריט והפקה",
    body: "תסריט ו-storyboard, צילום באולפן או בשטח עם תאורה וסאונד מקצועיים.",
  },
  {
    step: "03",
    title: "עריכה ומסירה",
    body: "עריכה, כתוביות וגרסאות פרסום. כולל 2 סבבי עריכה אחרי גרסה ראשונה. אורך טיפוסי לרשתות: 60-90 שניות.",
  },
] as const;

export const CORPORATE_VIDEO_PROOF =
  "סרט תדמית לעסק: אפיון, צילום ועריכה - עם 2 סבבי תיקונים ומסירה בפורמטים לאתר ולרשתות.";

/** What ships — concrete deliverables, not marketing fluff. */
export const CORPORATE_VIDEO_DELIVERABLES = [
  "תסריט ו-storyboard משותפים לפני צילום",
  "יום צילום באולפן במודיעין או בשטח (לפי brief)",
  "עריכה, כתוביות ומוזיקה לגרסה ראשונה",
  "2 סבבי תיקון אחרי אישור הכיוון",
  "קבצים מוכנים לאתר, LinkedIn ומטא",
] as const;

export const CORPORATE_VIDEO_FIT = [
  {
    title: "למי זה מתאים",
    body: "חברות, יזמים וארגונים שצריכים מסר אחד ברור ללקוחות — לא סרטון onboarding לעובדים.",
  },
  {
    title: "מה בדרך כלל לא כלול",
    body: "שחקנים מקצועיים, רישוי מוזיקה צד ג׳, וסבבי עריכה מעבר לשניים אחרי שינוי כיוון גדול.",
  },
  {
    title: "מחיר",
    body: "אין מחיר קטלוג קבוע לדף הזה. אחרי brief קצר מקבלים הצעה לפי אורך, מיקום צילום ומספר גרסאות.",
  },
] as const;

export const CORPORATE_VIDEO_RELATED = [
  { label: "מרכז לעסקים", href: "/business" },
  { label: "אולפן זמני בחברה", href: "/business/on-site-studio" },
  { label: "סרטוני onboarding / HR", href: "/business/employer-branding" },
  { label: "צילום אירועים", href: "/video/event-filming" },
] as const;
