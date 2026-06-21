import type { TestimonialItem } from "@/components/marketing/Testimonials";

/** On-site client quotes - used in UI and Review JSON-LD (no fabricated star ratings). */
export const SITE_TESTIMONIALS: readonly TestimonialItem[] = [
  {
    id: "1",
    quote:
      "שחזור אודיו ב-AI שהזמנו הציל הקלטה ישנה שהייתה כמעט אבודה. איכות נקייה, מקצועית ומעל הציפיות.",
    name: "דנה לוי",
    role: "מפיקה עצמאית, מודיעין",
    initials: "דל",
    datePublished: "2025-11-12",
    serviceHref: "/podcast/podcast-editing",
    serviceLabel: "שחזור סאונד ב-AI",
  },
  {
    id: "2",
    quote:
      "הפקת הפודקאסט שלנו קיבלה ליטוש סאונד ועריכה ברמה בינלאומית. צוות מדויק, זמינים וקשובים.",
    name: "דניאל גרין",
    role: "יזם, יבואן גרין אנד קו ישראל",
    initials: "דג",
    datePublished: "2026-01-08",
    serviceHref: "/podcast",
    serviceLabel: "הפקת פודקאסט",
  },
  {
    id: "3",
    quote:
      "שיפור תמונה חכם לחומרי שיווק - פרטים חדים ומראה יוקרתי. חסכנו זמן יקר בלי להתעפשר על אסתטיקה.",
    name: "מיכל אברהם",
    role: "מנהלת שיווק, הסביבה",
    initials: "מא",
    serviceHref: "/online",
    serviceLabel: "שירותים דיגיטליים",
  },
  {
    id: "4",
    quote:
      "אירוע חברה עם מוזיקה חיה והפקה מלאה - לוח הזמנים עמד, הציוד הוקם לפני הפתיחה, לא נרשמה תקלה אחת.",
    name: "יוסי כהן",
    role: "מנכ״ל, חברת הייטק",
    initials: "יכ",
    serviceHref: "/events",
    serviceLabel: "הפקת אירועים",
  },
  {
    id: "5",
    quote:
      "קריינות לסרטון תדמית - קובץ WAV מסופק תוך 24 שעות, 3 גרסאות טמפו, מחיר זהה להצעה הראשונית.",
    name: "נועה שפירא",
    role: "מייסדת סטארטאפ",
    initials: "נש",
    serviceHref: "/voiceover",
    serviceLabel: "קריינות",
  },
  {
    id: "6",
    quote:
      "הקלטת ברכה בת 90 שניות - שלושה טייקים, עריכה כלולה במחיר, קובץ MP3 מוכן לשידור.",
    name: "רחל גולן",
    role: "לקוחה פרטית",
    initials: "רג",
    serviceHref: "/studio/blessings",
    serviceLabel: "ברכות מוקלטות",
  },
  {
    id: "7",
    quote:
      "שיר לחתונה - הקלטה, מיקס ו-mastering בישיבה אחת. הקובץ הועבר 3 ימים לפני האירוע, פורמט WAV ו-MP3.",
    name: "משה ברק",
    role: "אב מודיעין",
    initials: "מב",
    datePublished: "2026-02-14",
    serviceHref: "/studio/recording-song-modiin",
    serviceLabel: "הקלטת שיר לחתונה",
  },
  {
    id: "8",
    quote:
      "DJ לחתונה: הגעה שעתיים לפני. בדיקת סאונד עברה תוך 20 דקות. 5 שעות הפעלה רצופה בלי הפסקה טכנית.",
    name: "תמר ויקי",
    role: "כלה, רחובות",
    initials: "תו",
    datePublished: "2025-12-20",
    serviceHref: "/events/dj-events",
    serviceLabel: "DJ לחתונה",
  },
  {
    id: "9",
    quote:
      "אטרקציות לאירוע חברה: עשן כניסה ותותחי קונפטי. הקמה 45 דקות לפני האורחים. פירוק ופינוי השטח לפני סיום האירוע.",
    name: "איתי לוינסון",
    role: "מנכ\"ל, חברת הייטק תל אביב",
    initials: "אל",
    datePublished: "2026-01-30",
    serviceHref: "/events/attractions",
    serviceLabel: "אטרקציות לאירועים",
  },
] as const;
