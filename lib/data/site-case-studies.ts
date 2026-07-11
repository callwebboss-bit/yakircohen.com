export type SiteCaseStudy = {
  id: string;
  service: string;
  year: number;
  metric: string;
  detail: string;
};

/** עובדות מהשטח. עדכן מספרים לפי פרויקטים אמיתיים. */
export const SITE_CASE_STUDIES: readonly SiteCaseStudy[] = [
  {
    id: "wedding-dj-2024",
    service: "DJ ואפקטים לחתונה",
    year: 2024,
    metric: "כ-180 אורחים, 5 שעות הפעלה",
    detail: "הגברה, עשן כניסה ותיאום עם האולם. בלי תקלה טכנית במהלך האירוע.",
  },
  {
    id: "studio-blessing-2024",
    service: "הקלטת ברכה לאולפן",
    year: 2024,
    metric: "קובץ מוכן תוך 48 שעות",
    detail: "שלושה טייקים, עריכה ומיקס. מסירה ב-MP3 ו-WAV לפני האירוע.",
  },
  {
    id: "podcast-pilot-2025",
    service: "פודקאסט עסקי",
    year: 2025,
    metric: "פרק ראשון מוכן לפרסום",
    detail: "הקלטה באולפן, ניקוי רעשים ועריכה. הלקוח העלה לספוטיפיי בשבוע שלאחרי.",
  },
] as const;
