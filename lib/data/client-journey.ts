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
    steps: [
      {
        number: 1,
        title: "ניתוח",
        description:
          "מגדירים מה צריך: סוג שירות, היקף, פורמט מסירה ותאריך יעד.",
      },
      {
        number: 2,
        title: "ביצוע",
        description:
          "מקליטים, מערכים, ממקסים או מפעילים ציוד - לפי מה שנקבע בשלב הראשון.",
      },
      {
        number: 3,
        title: "מסירה",
        description:
          "מקבלים קובץ או שירות מוכן לשימוש, עם גרסאות נוספות אם נדרש.",
      },
    ],
  },
  {
    id: "studio",
    label: "אולפן",
    anchor: "studio",
    steps: [
      {
        number: 1,
        title: "קליטת דרישות טכניות",
        description:
          "סוג הקלטה, אורך, פורמט מסירה (WAV/MP3) ולוח זמנים.",
      },
      {
        number: 2,
        title: "התאמת ציוד ואקוסטיקה",
        description:
          "בחירת מיקרופון, שרשרת שמע וסביבת ההקלטה לפי צורך הפרויקט.",
      },
      {
        number: 3,
        title: "ביצוע ההקלטה",
        description:
          "הקלטה באולפן, עריכה, מיקס ו-mastering לפי מה שנקבע.",
      },
      {
        number: 4,
        title: "מסירת התוצר הסופי",
        description:
          "קובץ מוכן להורדה בפורמט שנקבע, כולל גרסאות נוספות אם נדרש.",
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
