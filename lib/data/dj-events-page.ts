export const YOUTUBE_DJ_EVENTS_PLAYLIST_ID = "PLhuv1Ve6Oc9kqW6qdj9KpuCwnVVNxDbzv";

export const YOUTUBE_DJ_EVENTS_PLAYLIST_URL =
  "https://www.youtube.com/watch?v=oqoLnVTN1b4&list=PLhuv1Ve6Oc9kqW6qdj9KpuCwnVVNxDbzv";

export const YOUTUBE_DJ_EVENTS_PLAYLIST_EMBED = `https://www.youtube.com/embed/videoseries?list=${YOUTUBE_DJ_EVENTS_PLAYLIST_ID}`;

export const DJ_EQUIPMENT: readonly string[] = [
  "Pioneer CDJ 3000",
  "Allen & Heath  -  מיקסר דיגיטלי",
  "רמקולי RCF איכותיים",
  "תאורת LED דינמית",
  "מיקרופונים אלחוטיים",
] as const;

export const DJ_PROCESS_STEPS: readonly {
  step: string;
  title: string;
  description: string;
}[] = [
  {
    step: "01",
    title: "שיחת היכרות",
    description:
      "מבינים את הווייב, הקהל, הסגנון המוזיקלי ורגעים מיוחדים שצריך להדגיש.",
  },
  {
    step: "02",
    title: "פגישת תכנון מוזיקלי",
    description:
      "שירים שאוהבים, שירים אסורים, כניסה, ריקוד ראשון, עוגה  -  וסגנון לכל חלק.",
  },
  {
    step: "03",
    title: "הכנות בשטח",
    description:
      "הגעה מוקדמת (לפחות שעתיים), הקמה, בדיקות סאונד ותאורה, תיאום עם צלם ואולם.",
  },
  {
    step: "04",
    title: "המופע",
    description:
      "ניהול הערב, קריאת קהל בזמן אמת, אנרגיה גבוהה עד הסוף  -  בלי להיתקע מול המחשב.",
  },
] as const;

export type DJEventType = {
  id: string;
  title: string;
  description: string;
  link: string;
};

export const DJ_EVENT_TYPES: DJEventType[] = [
  {
    id: "weddings",
    title: "חתונות בוטיק",
    description:
      "התאמה מוזיקלית מוקפדת לאירועים הדורשים רמת גימור גבוהה וסגנון ייחודי.",
    link: "/events/dj-events",
  },
  {
    id: "mitzvah",
    title: "בר / בת מצווה",
    description:
      "שילוב נכון בין קהל מבוגר לצעיר, כולל ניהול שלבי התוכן והדרשות.",
    link: "/events/dj-events",
  },
];

export const DJ_PRICE_FACTORS: readonly string[] = [
  "מיקום האירוע ומרחק גיאוגרפי",
  "מפרט טכני של מערכות הסאונד והתאורה באולם",
  "היקף שעות הפעילות הנדרש ברחבה",
  "תוספות הפקה משלימות (אולפן, וידאו, AI)",
] as const;

export type DJValueBlock = {
  id: string;
  title: string;
  description: string;
};

export const DJ_VALUE_BLOCKS: DJValueBlock[] = [
  {
    id: "control",
    title: "שליטה מוחלטת בטיימליין",
    description:
      "אנו מנהלים את רחבת הריקודים כחלק ממנגנון תפעולי שלם, תוך סנכרון מלא מול מנהל האירוע והספקים.",
  },
  {
    id: "precision",
    title: "דיוק מוזיקלי",
    description:
      "בניית רשימות השמעה מבוססת נתונים והתאמה עובדתית לקהל היעד בזמן אמת, ללא אלמנטים של ניחוש.",
  },
];

export const DJ_CHEAP_VS_PRO: readonly { label: string; bad: string; good: string }[] = [
  { label: "רחבה", bad: "אורחים יושבים ועוזבים מוקדם", good: "רחבה מלאה עד סוף הלילה" },
  { label: "קריאת קהל", bad: "תקוע מול המחשב", good: "עיניים על הרחבה, התאמה בזמן אמת" },
  { label: "ציוד", bad: "ללא גיבוי", good: "פרימיום + גיבוי לכל רכיב" },
  { label: "תכנון", bad: "פלייליסט אקראי", good: "פגישה + רשימות + רגעי שיא מתוכננים" },
] as const;

export const DJ_WHY_US: readonly string[] = [
  "ניסיון אמיתי  -  אלפי אירועים מאחורינו",
  "ציוד פרימיום  -  לא מתפשרים על איכות",
  "גיבוי מלא  -  תמיד יש פלאן B",
  "גמישות  -  מתאימים לסגנון שלכם",
  "אמינות  -  בזמן, מוכנים, מקצועיים",
] as const;

export const DJ_RELATED_LINKS: readonly {
  href: string;
  title: string;
}[] = [
  { href: "/events/attractions", title: "חבילות אטרקציות" },
  { href: "/events/attractions/wedding-smoking-machine", title: "עשן כבד" },
  { href: "/events/attractions/cold-fireworks", title: "זיקוקים קרים" },
  { href: "/events/attractions/confetti-cannon", title: "תותח קונפטי" },
  { href: "/photography/wedding", title: "צילום חתונות" },
  { href: "/dj-events/cities/jerusalem", title: "DJ לחתונה בירושלים" },
] as const;
