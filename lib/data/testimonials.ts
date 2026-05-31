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
      "אירוע חברה עם מוזיקה חיה והפקה מלאה - חוויה מדויקת, מסודרת ומרשימה מהרגע הראשון ועד הסוף.",
    name: "יוסי כהן",
    role: "מנכ״ל, חברת הייטק",
    initials: "יכ",
    serviceHref: "/events",
    serviceLabel: "הפקת אירועים",
  },
  {
    id: "5",
    quote:
      "קריינות לסרטון תדמית שנשמעה טבעית, חמה ומדויקת למסר. תהליך מהיר ושירותי ברמה גבוהה.",
    name: "נועה שפירא",
    role: "מייסדת סטארטאפ",
    initials: "נש",
    serviceHref: "/voiceover",
    serviceLabel: "קריינות",
  },
  {
    id: "6",
    quote:
      "הקלטות ברכה בסטודיו באיכות מעולה, עם הנחיה סבלנית ותוצאה שמחממת את הלב.",
    name: "רחל גולן",
    role: "לקוחה פרטית",
    initials: "רג",
    serviceHref: "/studio/blessings",
    serviceLabel: "ברכות מוקלטות",
  },
] as const;
