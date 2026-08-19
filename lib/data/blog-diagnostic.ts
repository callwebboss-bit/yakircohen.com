import { CTA_LABELS, SKEPTICISM_CTA } from "@/lib/data/conversion-copy";

export type DiagnosticOption = {
  id: string;
  label: string;
  /** Short phrase for the end summary */
  direction: string;
  recommendation: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export type DiagnosticQuestion = {
  id: string;
  title: string;
  description: string;
  options: readonly DiagnosticOption[];
};

export type DiagnosticConfig = {
  heading: string;
  intro: string;
  questions: readonly DiagnosticQuestion[];
  expertTipText: string;
  bookHref: string;
  bookCtaLabel: string;
};

export const MIC_NEEDS_DIAGNOSTIC: DiagnosticConfig = {
  heading: "לפני שבוחרים מיקרופון - 3 שאלות עובדתיות",
  intro:
    "עונים על עובדות, לא על רגשות. רוב החרטה מגיעה מחוסר התאמה לשימוש, לא מאיכות הדגם. מיקרופון טוב לא קיים. קיים מיקרופון שמתאים לזרימת העבודה.",
  questions: [
    {
      id: "time",
      title: "זמן הקלטה",
      description: "מה משך ההקלטה בפועל?",
      options: [
        {
          id: "short-takes",
          label: "שלושה טייקים קצרים ודי",
          direction: "קונדנסר רגיש לקטעים קצרים",
          recommendation:
            "קונדנסר רגיש נותן פירוט עדין בקטעים קצרים. הוא פחות מתאים לסשן ארוך ברצף.",
          ctaHref: "/studio",
          ctaLabel: "אולפן הקלטות",
        },
        {
          id: "long-session",
          label: "סשן של שעה רציפה",
          direction: "דינמי או קונדנסר עם פאד לסשן ארוך",
          recommendation:
            "דינמי, או קונדנסר עם פאד, מפחית עייפות שמיעה כי הוא לא מגביר רעשים עדינים לאורך זמן. זו פיזיולוגיה של האוזן, לא העדפה.",
          ctaHref: "/studio",
          ctaLabel: "אולפן הקלטות",
        },
      ],
    },
    {
      id: "sibilants",
      title: "עיצורים",
      description:
        "השפה העברית עמוסה בעיצורים שורקים (צ, ש). כל מיקרופון מגיב אחרת לתדרים הגבוהים.",
      options: [
        {
          id: "dark-mic",
          label: "רוצה לחסוך דה-אסינג בעריכה",
          direction: "מיקרופון כהה לקול מדבר",
          recommendation:
            "מיקרופון כהה או חלק בולם שורקים מכנית. בודקים גרף תגובת תדר, או בוחרים דגם עם מוניטין של קול מדבר חלק.",
          ctaHref: "/studio",
          ctaLabel: "אולפן הקלטות",
        },
        {
          id: "bright-edit",
          label: "מוכן לטפל בגבוהים בעריכה",
          direction: "בהיר עם דה-אסינג בעריכה",
          recommendation:
            "מיקרופון בהיר יגביר שורקים וידרוש דה-אסינג. אפשר לעשות את זה באולפן או בשירות עריכה מרחוק.",
          ctaHref: "/online/vocal-fix",
          ctaLabel: "עריכת סאונד מרחוק",
        },
      ],
    },
    {
      id: "editing",
      title: "עריכה",
      description:
        "מה היחס שלך לתהליך ההפקה? כלי AI כמו iZotope או Adobe Podcast מאיצים ניקוי. הם לא מחליפים מיקרופון שמתאים לשימוש.",
      options: [
        {
          id: "learn-together",
          label: "רוצה להיות מעורב וללמוד",
          direction: "הפקה משותפת עם ליווי",
          recommendation:
            "עובדים יחד על שיפור הקול. אפשר גם שיעור אם רוצים להבין את הכלים, לא רק לקבל קובץ.",
          ctaHref: "/academy",
          ctaLabel: "אקדמיה",
        },
        {
          id: "closed-service",
          label: "רוצה תוצר מוגמר בלי התעסקות",
          direction: "מיקרופון USB ושירות הפקה סגור",
          recommendation:
            "מיקרופון USB פשוט מספיק לקלט גולמי. את העריכה והמסירה סוגרים אצלנו, בלי לנהל את הכלים לבד.",
          ctaHref: "/book#studio",
          ctaLabel: CTA_LABELS.bookOnline,
        },
      ],
    },
  ],
  expertTipText: `הבחירה הפוכה: קודם מחליטים איך עובדים, ואז מתאימים מיקרופון. הנתונים מבוססים על הקלטות שטח ואולפן. ${SKEPTICISM_CTA}`,
  bookHref: "/book#studio",
  bookCtaLabel: CTA_LABELS.bookOnline,
};

const DIAGNOSTIC_BY_SLUG: Readonly<Record<string, DiagnosticConfig>> = {
  "headphones-purpose-guide": MIC_NEEDS_DIAGNOSTIC,
};

export function getDiagnosticForPost(slug: string): DiagnosticConfig | null {
  return DIAGNOSTIC_BY_SLUG[slug] ?? null;
}
