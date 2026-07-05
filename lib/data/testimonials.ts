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
    serviceCategory: "podcast",
    serviceHref: "/podcast/podcast-editing",
    serviceLabel: "שחזור סאונד ב-AI",
    projectImageSrc:
      "/images/services/academy/music-production/אולפני יקיר כהן הפקות פודקאסט.webp",
    projectImageAlt: "עריכת פודקאסט באולפן",
  },
  {
    id: "2",
    quote:
      "הפקת הפודקאסט שלנו קיבלה ליטוש סאונד ועריכה ברמה בינלאומית. צוות מדויק, זמינים וקשובים.",
    name: "דניאל גרין",
    role: "יזם, יבואן גרין אנד קו ישראל",
    initials: "דג",
    datePublished: "2026-01-08",
    serviceCategory: "podcast",
    serviceHref: "/podcast",
    serviceLabel: "הפקת פודקאסט",
    projectImageSrc:
      "/images/services/studio/hub/אולפן פודקאסט - יקיר כהן 1.webp",
    projectImageAlt: "אולפן פודקאסט במודיעין",
  },
  {
    id: "3",
    quote:
      "שיפור תמונה חכם לחומרי שיווק - פרטים חדים ומראה יוקרתי. חסכנו זמן יקר בלי להתעפשר על אסתטיקה.",
    name: "מיכל אברהם",
    role: "מנהלת שיווק, הסביבה",
    initials: "מא",
    datePublished: "2025-09-20",
    serviceCategory: "online",
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
    datePublished: "2025-10-05",
    serviceCategory: "events",
    serviceHref: "/events",
    serviceLabel: "הפקת אירועים",
    projectImageSrc:
      "/images/services/events/dj-events/אירוע חברה עם מיתוג.webp",
    projectImageAlt: "הפקת אירוע חברה",
  },
  {
    id: "5",
    quote:
      "קריינות לסרטון תדמית - קובץ WAV מסופק בדרך כלל תוך 24 שעות, 3 גרסאות טמפו, מחיר זהה להצעה הראשונית.",
    name: "נועה שפירא",
    role: "מייסדת סטארטאפ",
    initials: "נש",
    datePublished: "2025-12-01",
    serviceCategory: "voiceover",
    serviceHref: "/voiceover",
    serviceLabel: "קריינות",
    projectImageSrc: "/images/services/voiceover/מיקרופון קריינות.webp",
    projectImageAlt: "הקלטת קריינות באולפן",
  },
  {
    id: "6",
    quote:
      "הקלטת ברכה בת 90 שניות - שלושה טייקים, עריכה כלולה במחיר, קובץ MP3 מוכן לשידור.",
    name: "רחל גולן",
    role: "לקוחה פרטית",
    initials: "רג",
    datePublished: "2025-08-14",
    serviceCategory: "studio",
    serviceHref: "/studio/blessings",
    serviceLabel: "ברכות מוקלטות",
    projectImageSrc:
      "/images/services/studio/blessings/bride-groom-blessing/הקלטה באולפן.webp",
    projectImageAlt: "הקלטת ברכה באולפן",
  },
  {
    id: "7",
    quote:
      "שיר לחתונה - הקלטה, מיקס ו-mastering בישיבה אחת. הקובץ הועבר 3 ימים לפני האירוע, פורמט WAV ו-MP3.",
    name: "משה ברק",
    role: "אב מודיעין",
    initials: "מב",
    datePublished: "2026-02-14",
    serviceCategory: "studio",
    serviceHref: "/studio/recording-song-modiin",
    serviceLabel: "הקלטת שיר לחתונה",
    projectImageSrc:
      "/images/services/studio/recording-song-modiin/אוהד בוזגלו מקליט.webp",
    projectImageAlt: "הקלטת שיר באולפן",
  },
  {
    id: "8",
    quote:
      "DJ לחתונה: הגעה שעתיים לפני. בדיקת סאונד עברה תוך 20 דקות. 5 שעות הפעלה רצופה בלי הפסקה טכנית.",
    name: "תמר ויקי",
    role: "כלה, רחובות",
    initials: "תו",
    datePublished: "2025-12-20",
    serviceCategory: "events",
    serviceHref: "/events/dj-events",
    serviceLabel: "DJ לחתונה",
    projectImageSrc:
      "/images/services/events/dj-events/עמדת די גיי ותאורה.webp",
    projectImageAlt: "DJ ותאורה בחתונה",
  },
  {
    id: "9",
    quote:
      "אטרקציות לאירוע חברה: עשן כניסה ותותחי קונפטי. הקמה 45 דקות לפני האורחים. פירוק ופינוי השטח לפני סיום האירוע.",
    name: "איתי לוינסון",
    role: "מנכ\"ל, חברת הייטק תל אביב",
    initials: "אל",
    datePublished: "2026-01-30",
    serviceCategory: "events",
    serviceHref: "/events/attractions",
    serviceLabel: "אטרקציות לאירועים",
    projectImageSrc:
      "/images/services/events/attractions/cold-fireworks/זיקוקים קרים לחופה.webp",
    projectImageAlt: "אטרקציות לאירוע",
  },
  /* ── Academy / learning testimonials (TODO: replace with real student quotes) ── */
  {
    id: "10",
    quote:
      "אחרי 5 שיעורי DJ - עשיתי סט ראשון במסיבה פרטית. יקיר הכין אותי לכל תרחיש שיכול לקרות ברחבה.",
    name: "אלון דוד",
    role: "תלמיד קורס DJ, מודיעין",
    initials: "אד",
    datePublished: "2026-04-10",
    serviceCategory: "academy",
    serviceHref: "/academy/dj-course",
    serviceLabel: "קורס DJ",
  },
  {
    id: "11",
    quote:
      "הבן שלי בן 12 יצר שיר מאפס תוך 4 מפגשים במעבדת הסאונד. חזר הביתה עם קובץ מוכן והרבה גאווה.",
    name: "רונית שלום",
    role: "אמא לתלמיד מעבדת הסאונד",
    initials: "רש",
    datePublished: "2026-03-15",
    serviceCategory: "academy",
    serviceHref: "/academy",
    serviceLabel: "מעבדת הסאונד",
  },
  {
    id: "12",
    quote:
      "אחרי 3 מפגשי NeverMind הדיבור שלי מול הצוות השתנה. פחות היסוסים, יותר ביטחון. המנהלים שמו לב.",
    name: "עמית כץ",
    role: "מנהל פיתוח, הייטק",
    initials: "עכ",
    datePublished: "2026-05-20",
    serviceCategory: "academy",
    serviceHref: "/academy/stuttering-course",
    serviceLabel: "פרוטוקול NeverMind",
  },
] as const;
