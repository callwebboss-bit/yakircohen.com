/** English filename tokens Hebrew for accessible, SEO-friendly alt text. */
const HEBREW_DICT: Readonly<Record<string, string>> = {
  wedding: "חתונה",
  ceremony: "טקס",
  portrait: "פורטרט",
  family: "משפחה",
  event: "אירוע",
  studio: "אולפן",
  outdoor: "חוץ",
  couple: "זוג",
  bride: "כלה",
  groom: "חתן",
  bar: "בר",
  mitzvah: "מצווה",
  corporate: "אירוע עסקי",
  music: "מוזיקה",
  concert: "קונצרט",
  landscape: "נוף",
  night: "לילה",
  dance: "ריקוד",
  party: "מסיבה",
  stage: "במה",
  live: "הופעה חיה",
  podcast: "פודקאסט",
  recording: "הקלטה",
  performance: "הופעה",
  garden: "גן",
  hall: "אולם",
  beach: "חוף",
  bubble: "בועות",
  smoke: "עשן",
  fireworks: "זיקוקים",
  confetti: "קונפטי",
  balloon: "בלונים",
  balloons: "בלונים",
  led: "LED",
  dj: "תקליטן",
  jerusalem: "ירושלים",
  modiin: "מודיעין",
  blessing: "ברכה",
  blessings: "ברכות",
  song: "שיר",
  vocal: "שירה",
  mixing: "מיקס",
  // studio & audio
  microphone: "מיקרופון",
  mic: "מיקרופון",
  monitor: "מוניטור",
  monitors: "מוניטורים",
  speaker: "רמקול",
  speakers: "רמקולים",
  audio: "אודיו",
  sound: "סאונד",
  equipment: "ציוד",
  gear: "ציוד",
  booth: "תא הקלטה",
  room: "חדר",
  acoustic: "אקוסטי",
  interface: "ממשק",
  console: "קונסולה",
  mixer: "מיקסר",
  headphones: "אוזניות",
  keyboard: "מקלדת",
  setup: "מערכת",
  professional: "מקצועי",
  // events
  singer: "זמר",
  amplification: "הגברה",
  lighting: "תאורה",
  laser: "לייזר",
  fog: "עשן",
  foam: "קצף",
  cold: "קרה",
  effect: "אפקט",
  effects: "אפקטים",
  attraction: "אטרקציה",
  venue: "אולם",
  // people & actions
  man: "גבר",
  woman: "אישה",
  child: "ילד",
  kid: "ילד",
  boy: "ילד",
  girl: "ילדה",
  group: "קבוצה",
  team: "צוות",
  guest: "אורח",
  audience: "קהל",
  // media & tech
  camera: "מצלמה",
  video: "וידאו",
  photo: "צילום",
  clip: "קליפ",
  reel: "ריל",
  edit: "עריכה",
  editing: "עריכה",
  production: "הפקה",
  voiceover: "קריינות",
  // locations
  tel: "תל",
  aviv: "אביב",
  rehovot: "רחובות",
  herzliya: "הרצליה",
  raanana: "רעננה",
};

/** תווית הגיבוי כשאין לתמונה תיאור שמיש: "תמונה מתיק העבודות - תמונה 3". */
export const IMAGE_ALT_FALLBACK_LABEL = "תמונה מתיק העבודות";

const HEBREW_LETTER = /[א-ת]/;

/**
 * אסימון שהוא שריד של שם קובץ ולא מילה: scaled של וורדפרס, copy, BURST של טלפון,
 * קידומות מצלמה (IMG, DSC, LEOM, LMR, LMS, WA) עם ספרות, חמש ספרות ומעלה, מספר
 * העתק "(1)" ומידות כמו 1024x576.
 */
const FILE_ARTIFACT_TOKEN =
  /^(?:scaled|copy|burst\d*|(?:img|dsc|dscn|pxl|leom|lmr|lms|wa)\d*)$|\d{5,}|\(\d+\)|\d{3,}x\d{3,}/i;

/**
 * F-20 (ביקורת נגישות 7.10.2026): האם המחרוזת שנגזרה משם קובץ היא alt שמיש.
 * בלי אות עברית אחת, או עם שריד של שם קובץ, היא נקראת בקול ככלום
 * ("leom9008", "00000img burst20200701191123548 cover scaled").
 */
export function isUsableDerivedAlt(alt: string): boolean {
  if (!HEBREW_LETTER.test(alt)) return false;
  return !alt.split(/\s+/).some((token) => FILE_ARTIFACT_TOKEN.test(token));
}

/**
 * ה-alt שנגזר משם הקובץ, או null כשאין ממנו תיאור שמיש. מילים לא מתורגמות לא
 * מצטרפות לתוצאה: הצירוף הזה מכניס אנגלית לתוך alt עברי ("sparklers on ריקוד floor").
 */
export function deriveHebrewAltOrNull(srcOrFilename: string): string | null {
  const filename =
    srcOrFilename.split("/").pop()?.replace(/\.[^.]+$/, "") ?? srcOrFilename;

  const segments = filename
    .toLowerCase()
    .split(/[-_\s]+/)
    .filter((seg) => seg.length > 0 && !/^\d+$/.test(seg));

  const translated = segments
    .map((seg) => HEBREW_DICT[seg] ?? null)
    .filter((t): t is string => t !== null);

  const candidate =
    translated.length > 0 ? translated.join(", ") : segments.join(" ").trim();

  return candidate && isUsableDerivedAlt(candidate) ? candidate : null;
}

/**
 * Builds descriptive Hebrew alt from asset paths like
 * `/images/services/podcast/guest-interview-studio-02.webp`.
 * שם קובץ שאין ממנו תיאור שמיש מקבל "תמונה מתיק העבודות - תמונה N".
 */
export function deriveHebrewAlt(srcOrFilename: string, ordinal = 0): string {
  return (
    deriveHebrewAltOrNull(srcOrFilename) ??
    `${IMAGE_ALT_FALLBACK_LABEL} - תמונה ${ordinal + 1}`
  );
}
