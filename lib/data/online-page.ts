import type { ProcessStep } from "@/components/marketing/ProcessSteps";

export type OnlineFeaturedService = {
  icon: string;
  title: string;
  intro: string;
  includes: string;
  suited: string;
  href: string;
};

export type OnlineServiceItem = {
  icon: string;
  title: string;
  summary: string;
  href?: string;
  tag?: "מבוקש" | "חדש" | "מהיר";
};

export type OnlineServiceCategory = {
  id: string;
  slug: string;
  title: string;
  description: string;
  services: readonly OnlineServiceItem[];
};

export const ONLINE_HOW_IT_WORKS: ProcessStep[] = [
  {
    number: 1,
    title: "שולחים קובץ",
    description: "וואטסאפ, מייל, Drive — בכל פורמט ובכל רמת איכות, כולל הקלטות ישנות.",
  },
  {
    number: 2,
    title: "אבחון ואישור",
    description: "מנתחים את הצורך, מציעים מסלול מתאים ואם צריך — שולחים סקיצה חינם.",
  },
  {
    number: 3,
    title: "עיבוד AI + ידני",
    description: "כלים חכמים ואוזן מקצועית. לא אוטומציה עיוורת — כל קובץ מטופל אישית.",
  },
  {
    number: 4,
    title: "מסירה מוכנה",
    description: "קובץ מוכן לשימוש עם השוואת לפני/אחרי. אחריות מלאה על האיכות.",
  },
];

export const ONLINE_FEATURED_SERVICES: readonly OnlineFeaturedService[] = [
  {
    icon: "🎤",
    title: "תיקון ואיזון שירה (AI)",
    intro:
      "שלחו ערוץ קול גולמי, ותקבלו שירה יציבה, נקיה ומלוטשת ללא זיופים צורמים.",
    includes: "Pitch correction, timing, ניקוי רעשים ואיזון עוצמות.",
    suited: "זמרים, קאברים, שירי ברכה ושירי מתנה.",
    href: "/online/vocal-fix/pitch-correction",
  },
  {
    icon: "🎚️",
    title: "מיקס ומאסטרינג אונליין",
    intro: "הופכים סקיצה ביתית להפקה עוצמתית שמנצחת את הרמקולים.",
    includes: "איזון ערוצים, EQ, קומפרסיה, עומק סטריאו ומאסטרינג מסחרי.",
    suited: "מוזיקאים, יוצרים עצמאיים ואולפנים קטנים.",
    href: "/online/vocal-fix/mixing",
  },
  {
    icon: "🎙️",
    title: "עריכת פודקאסטים וקריינות",
    intro:
      "ניקוי רעשים, חיתוך טעויות, מוזיקת רקע והכנת קבצים מוכנים ל-Spotify ו-Apple Podcasts.",
    includes: "עריכה מלאה, תדרוך סאונד, loudness תקני וגרסאות קצרות לרשתות.",
    suited: "פודקאסטים, פרקים עסקיים, קורסים דיגיטליים ותוכן קריינות.",
    href: "/podcast/podcast-editing",
  },
] as const;

export const ONLINE_SERVICE_CATEGORIES: readonly OnlineServiceCategory[] = [
  {
    id: "audio-music",
    slug: "audio-music",
    title: "אודיו ומוזיקה",
    description: "תיקון, ליטוש והפקת סאונד מקצועית לקול ולמוזיקה.",
    services: [
      {
        icon: "🎙️",
        title: "שיפור קול מהנייד",
        summary: "הסרת רעשים, איזון ווליום והפיכת הקלטה ביתית לאיכות אולפן.",
        href: "/online/vocal-fix",
        tag: "מהיר",
      },
      {
        icon: "🎵",
        title: "תיקון זיופים טבעי",
        summary: "Pitch correction מדויק בלי סאונד רובוטי.",
        href: "/online/vocal-fix/pitch-correction",
        tag: "מבוקש",
      },
      {
        icon: "🎛️",
        title: "מיקס ומאסטרינג לשיר",
        summary: "סאונד מסחרי מוכן לסטרימינג, רדיו ורשתות.",
        href: "/online/vocal-fix/mixing",
      },
      {
        icon: "🆘",
        title: "הצלת הקלטות פגומות",
        summary: "שחזור הקלטות קשות, רסטורציה והפחתת הד/דיסטורשן.",
        href: "/blog/sound-recovery-ai-podcast",
        tag: "חדש",
      },
      {
        icon: "🤖",
        title: "שירותי AI לאודיו",
        summary: "הפרדת ערוצים, עיבודי קול חכמים ותמחור שקוף לפי צורך.",
        href: "/online/online-ai-pricing",
      },
    ],
  },
  {
    id: "podcast-voice",
    slug: "podcast-voice",
    title: "פודקאסט, דיבור וקריינות",
    description: "פתרונות מלאים ליוצרי תוכן עסקי, ראיונות ופרקי פודקאסט.",
    services: [
      {
        icon: "🎧",
        title: "עריכת פודקאסט מלאה",
        summary: "חיתוך, ניקוי, מיקס ומסירה לפרק מוכן לפרסום.",
        href: "/podcast/podcast-editing",
        tag: "מבוקש",
      },
      {
        icon: "📼",
        title: "שדרוג ארכיון ישן",
        summary: "שחזור הרצאות/ראיונות ישנים והנגשה מודרנית.",
        href: "/online/vocal-fix",
      },
      {
        icon: "🔉",
        title: "נורמליזציה לפלטפורמות",
        summary: "התאמת עוצמות תקנית ל-Spotify, YouTube ו-Apple Podcasts.",
      },
      {
        icon: "📝",
        title: "תמלול ותקצירי תוכן",
        summary: "תמלול AI + עריכה אנושית ושדרוג לתוכן שיווקי.",
      },
    ],
  },
  {
    id: "video-content",
    slug: "video-content",
    title: "וידאו ותוכן דיגיטלי",
    description: "עריכה, שיפור איכות, התאמה לפורמטים קצרים ושיווקיים.",
    services: [
      {
        icon: "🎬",
        title: "עריכת וידאו שיווקי",
        summary: "ניקוי אודיו, קצב עריכה ויצירת גרסאות להמרה גבוהה.",
      },
      {
        icon: "📱",
        title: "חיתוך לרילס ושורטס",
        summary: "פירוק תוכן ארוך לקליפים ממירים לרשתות החברתיות.",
        tag: "מהיר",
      },
      {
        icon: "💬",
        title: "כתוביות ותרגום חכם",
        summary: "כתוביות מדויקות, הדגשות מפתח והתאמה ל-RTL.",
      },
    ],
  },
  {
    id: "image-design",
    slug: "image-design",
    title: "תמונה ועיצוב AI",
    description: "שיפור תמונות, שחזור חומרים ויצירת נכסים גרפיים מהירה.",
    services: [
      {
        icon: "🖼️",
        title: "שדרוג תמונות ישנות",
        summary: "הגדלה, חידוד, ניקוי ושיפור AI באיכות גבוהה.",
        href: "/online/vocal-fix/photo-enhance",
      },
      {
        icon: "🎨",
        title: "קריאייטיב לקמפיינים",
        summary: "וריאציות מהירות לבאנרים, מודעות וסושיאל.",
      },
      {
        icon: "🧩",
        title: "עיבוד גרפי לפי בריף",
        summary: "עבודה על בסיס מותג קיים, צבעים וסגנון אחיד.",
      },
    ],
  },
] as const;

export const ONLINE_WHY_US: readonly string[] = [
  "Done-for-You אמיתי: אנחנו מבצעים בפועל את כל העבודה, לא רק ממליצים על כלים",
  "מאגר שירותים רחב: אודיו, פודקאסט, וידאו, תמונה ואוטומציה שיווקית",
  "מהירות ביצוע: מסלולים מהירים לפרויקטים דחופים",
  "בקרת איכות אנושית + AI: שילוב של טכנולוגיה עם אוזן מקצועית",
  "תקשורת ברורה: וואטסאפ זמין, סקיצות ועדכונים לאורך הדרך",
] as const;

export const ONLINE_QUICK_LINKS: readonly {
  label: string;
  href: string;
  desc: string;
}[] = [
  {
    label: "שליחת קבצים (אישור תנאים)",
    href: "/online/vocal-fix/send-file",
    desc: "העלאה מסודרת להתחלת עבודה מהירה",
  },
  {
    label: "שיפור קול מהנייד",
    href: "/online/vocal-fix",
    desc: "שדרוג מיידי להקלטות ביתיות",
  },
  {
    label: "תיקון זיופים",
    href: "/online/vocal-fix/pitch-correction",
    desc: "שירה יציבה וטבעית",
  },
  {
    label: "מיקס ומאסטרינג",
    href: "/online/vocal-fix/mixing",
    desc: "הפקה מלוטשת לשירים",
  },
  {
    label: "עריכת פודקאסט",
    href: "/podcast/podcast-editing",
    desc: "פרק מוכן לפרסום",
  },
  {
    label: "מחירון שירותי AI",
    href: "/online/online-ai-pricing",
    desc: "תמחור שקוף לפי מורכבות ואורך",
  },
] as const;

export function getOnlineCategoryBySlug(slug: string): OnlineServiceCategory | undefined {
  return ONLINE_SERVICE_CATEGORIES.find((category) => category.slug === slug);
}
