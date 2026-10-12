import { DATE_HOLD_TERMS_BODY, TIME_CLAIMS } from "@/lib/data/conversion-copy";

export type JourneyVariant = "general" | "studio" | "events" | "online" | "podcast";

export type JourneyStep = {
  number: 1 | 2 | 3 | 4;
  title: string;
  description: string;
};

export type JourneyVariantConfig = {
  id: JourneyVariant;
  label: string;
  anchor: string;
  steps: JourneyStep[];
};

export const CLIENT_JOURNEY_VARIANTS: readonly JourneyVariantConfig[] = [
  {
    id: "general",
    label: "כללי",
    anchor: "general",
    /* תוכנית הבהירות, שלב 7 (בחירת הבעלים 12.10.2026): במקום "ניתוח, ביצוע, מסירה"
       המופשט, שלושה צעדים מוחשיים. רק עובדות מאושרות: זמן התשובה מ-TIME_CLAIMS
       (D62), "ביד בסוף ההקלטה" לשיר (S1002-01) ולפודקאסט, ודוגמה לפני תשלום
       בשירותים מרחוק (/whats-included, החלטת הבעלים 11.10.2026). */
    steps: [
      {
        number: 1,
        title: "פונים",
        description: `שולחים הודעה בוואטסאפ או מזמינים באתר. הצעה ${TIME_CLAIMS.quoteHour}.`,
      },
      {
        number: 2,
        title: "קובעים",
        description:
          "סוגרים מה עושים, איפה ומתי: באולפן במודיעין, מרחוק או באירוע שלכם.",
      },
      {
        number: 3,
        title: "מקבלים",
        description:
          "שיר או פרק פודקאסט מקבלים ביד בסוף ההקלטה. בשירות מרחוק רואים דוגמה לפני שמשלמים.",
      },
    ],
  },
  {
    id: "studio",
    label: "אולפן",
    anchor: "studio",
    /* תוכנית הבהירות, שלב 8 (בחירת הבעלים 12.10.2026): במקום "קליטת דרישות
       טכניות, התאמת ציוד ואקוסטיקה" המקצועי, ארבעה צעדים מוחשיים שמתאימים לכל
       שירות באולפן, כולל קריינות. רק עובדות מאושרות: זמן התשובה (D62), שריון
       במקדמה (DATE_HOLD_TERMS_BODY), הטכנאי מקליט ומנחה (D82), ו"ביד בסוף
       הסשן" רק לשיר ולפודקאסט (S1002-01, D107). */
    steps: [
      {
        number: 1,
        title: "פונים",
        description: `הודעה בוואטסאפ או הזמנה באתר. הצעה ${TIME_CLAIMS.quoteHour}.`,
      },
      {
        number: 2,
        title: "קובעים מועד",
        description: `סוגרים מה מקליטים ומתי, ${DATE_HOLD_TERMS_BODY}.`,
      },
      {
        number: 3,
        title: "באולפן",
        description: "הטכנאי מקליט ומנחה בזמן אמת. לא צריך ניסיון.",
      },
      {
        number: 4,
        title: "מקבלים",
        description: "קובץ מוכן, WAV או MP3. שיר ופודקאסט ביד בסוף הסשן.",
      },
    ],
  },
  {
    id: "events",
    label: "אירועים",
    anchor: "events",
    steps: [
      {
        number: 1,
        title: "קליטת דרישות טכניות",
        description:
          "מיקום, גודל קהל צפוי, ציוד נדרש ומסגרת זמן.",
      },
      {
        number: 2,
        title: "התאמת מפרט החומרה למיקום",
        description:
          "בחירת ציוד וכמויות לפי אופי האולם ומספר האורחים.",
      },
      {
        number: 3,
        title: "הקמת הציוד",
        description:
          "הגעה לאולם, הקמת הגברה/DJ/אפקטים ובדיקת סאונד לפני הפתיחה.",
      },
      {
        number: 4,
        title: "מסירת התוצר הסופי",
        description:
          "הפעלה מלאה בערב האירוע, פירוק ציוד וסגירת חשבון.",
      },
    ],
  },
  {
    id: "online",
    label: "עריכה מרחוק",
    anchor: "online",
    steps: [
      {
        number: 1,
        title: "ניתוח",
        description:
          "שולחים קובץ אודיו או תמונה. בודקים רעשים, עיוותים ומה צריך לתקן.",
      },
      {
        number: 2,
        title: "ביצוע",
        description:
          "ניקוי סאונד, מיקס, תיקון זיופים או שדרוג תמונה - לפי השירות שנבחר.",
      },
      {
        number: 3,
        title: "מסירה",
        description:
          "קובץ מעובד + השוואת לפני/אחרי, מוכן להעלאה או שידור.",
      },
    ],
  },
  {
    id: "podcast",
    label: "פודקאסט",
    anchor: "podcast",
    steps: [
      {
        number: 1,
        title: "ניתוח",
        description:
          "מגדירים פורמט פרק, אורך, מספר משתתפים ופלטפורמת העלאה.",
      },
      {
        number: 2,
        title: "ביצוע",
        description:
          "הקלטה באולפן (או מרחוק), עריכה, מיתוג שמע ומיקס.",
      },
      {
        number: 3,
        title: "מסירה",
        description:
          "קובץ MP3/WAV מוכן + קובץ וידאו אם נדרש, מוכן להעלאה.",
      },
    ],
  },
] as const;

export function getJourneyVariant(id: JourneyVariant): JourneyVariantConfig {
  const found = CLIENT_JOURNEY_VARIANTS.find((v) => v.id === id);
  return found ?? CLIENT_JOURNEY_VARIANTS[0];
}
