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

export const DJ_EVENT_TYPES: readonly {
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    emoji: "💍",
    title: "חתונות",
    description:
      "קבלת פנים, חופה, ריקודים, סלואו ושיא  -  מוזיקה מדויקת לכל שלב.",
  },
  {
    emoji: "🕎",
    title: "בר / בת מצווה",
    description: "מסבא ועד הנכדים  -  אנרגיה גבוהה לכל הגילאים.",
  },
  {
    emoji: "🎂",
    title: "ימי הולדת",
    description: "18, 30, 40, 50...  -  מוזיקה שכולם מכירים ואוהבים.",
  },
  {
    emoji: "🏢",
    title: "אירועי חברה",
    description: "איזון בין מקצועיות לאווירה טובה  -  לפי אופי הארגון.",
  },
  {
    emoji: "🎉",
    title: "מסיבות פרטיות",
    description: "בית, גינה או אולם  -  כל סוג חגיגה.",
  },
] as const;

export const DJ_VALUE_BLOCKS: readonly {
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    emoji: "🎵",
    title: "מוזיקה מותאמת אישית",
    description:
      "פגישת תכנון, רשימת שירים, שירים אסורים וסגנון (מזרחי / אנגלי / מעורב).",
  },
  {
    emoji: "🎧",
    title: "תקליטן מנוסה",
    description: "מעל 1,500 אירועים  -  קוראים קהל ומתאימים בזמן אמת.",
  },
  {
    emoji: "🛡️",
    title: "גיבוי מלא",
    description: "ציוד גיבוי וצוות חירום  -  אף אירוע לא נכשל בגלל תקלה.",
  },
  {
    emoji: "🎨",
    title: "תאורה והשפעות",
    description: "LED דינמי, Moving Heads אופציונלי, סנכרון עם המוזיקה.",
  },
  {
    emoji: "🎤",
    title: "קריאות והנחיה",
    description:
      "לחופה, ריקוד ראשון, ברכה ועוגה  -  ברור, מקצועי ולא מעצבן.",
  },
] as const;

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
