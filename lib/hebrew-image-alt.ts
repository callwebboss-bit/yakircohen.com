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
};

/**
 * Builds descriptive Hebrew alt from asset paths like
 * `/images/services/podcast/guest-interview-studio-02.webp`.
 */
export function deriveHebrewAlt(srcOrFilename: string, ordinal = 0): string {
  const filename =
    srcOrFilename.split("/").pop()?.replace(/\.[^.]+$/, "") ?? srcOrFilename;

  const segments = filename
    .toLowerCase()
    .split(/[-_\s]+/)
    .filter((seg) => seg.length > 0 && !/^\d+$/.test(seg));

  const translated = segments
    .map((seg) => HEBREW_DICT[seg] ?? null)
    .filter((t): t is string => t !== null);

  if (translated.length > 0) return translated.join(", ");

  const readable = segments.join(" ").trim();
  return readable || `תמונה ${ordinal + 1} מהגלריה`;
}
