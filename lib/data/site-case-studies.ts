export type SiteCaseStudyHub = "home" | "studio" | "events" | "podcast" | "shop";

export type SiteCaseStudy = {
  id: string;
  service: string;
  year: number;
  metric: string;
  detail: string;
  /** Hubs where this study appears. home = homepage strip. */
  hubs: readonly SiteCaseStudyHub[];
};

/** עובדות מהשטח. עדכן מספרים לפי פרויקטים אמיתיים. */
export const SITE_CASE_STUDIES: readonly SiteCaseStudy[] = [
  {
    id: "wedding-dj-2024",
    service: "DJ ואפקטים לחתונה",
    year: 2024,
    metric: "כ-180 אורחים, 5 שעות הפעלה",
    detail: "הגברה, עשן כניסה ותיאום עם האולם. בלי תקלה טכנית במהלך האירוע.",
    hubs: ["home", "events"],
  },
  {
    id: "studio-blessing-2024",
    service: "הקלטת ברכה לאולפן",
    year: 2024,
    metric: "קובץ מוכן תוך 48 שעות",
    detail: "שלושה טייקים, עריכה ומיקס. מסירה ב-MP3 ו-WAV לפני האירוע.",
    hubs: ["home", "studio", "shop"],
  },
  {
    id: "podcast-pilot-2025",
    service: "פודקאסט עסקי",
    year: 2025,
    metric: "פרק ראשון מוכן לפרסום",
    detail: "הקלטה באולפן, ניקוי רעשים ועריכה. הלקוח העלה לספוטיפיי בשבוע שלאחרי.",
    hubs: ["home", "podcast"],
  },
  {
    id: "cover-song-2025",
    service: "הקלטת שיר במתנה",
    year: 2025,
    metric: "שיר על פלייבק, מסירה באותו שבוע",
    detail: "שעה באולפן, תיקוני ווקאל ומאסטרינג. נשלח לוואטסאפ לפני האירוע.",
    hubs: ["studio", "shop"],
  },
  {
    id: "attractions-smoke-2024",
    service: "עשן כבד וזיקוקים",
    year: 2024,
    metric: "כניסה לחופה + ריקוד ראשון",
    detail: "שני אפקטים, מפעיל במקום, תיאום עם הצלם. האולם לא נדרש לציוד נוסף.",
    hubs: ["events"],
  },
  {
    id: "podcast-edit-remote-2025",
    service: "עריכת פודקאסט מרחוק",
    year: 2025,
    metric: "פרק זום רועש → קובץ נקי",
    detail: "שעתיים חומר גולמי, ניקוי רעשים ונורמליזציה. חזרה תוך יומיים.",
    hubs: ["podcast"],
  },
] as const;

export function getCaseStudiesForHub(
  hub: SiteCaseStudyHub,
  limit = 3,
): SiteCaseStudy[] {
  return SITE_CASE_STUDIES.filter((s) => s.hubs.includes(hub)).slice(0, limit);
}
