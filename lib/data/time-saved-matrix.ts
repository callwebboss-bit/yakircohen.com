import { TIME_CLAIMS } from "@/lib/data/conversion-copy";

/**
 * השוואת זמנים מול מסלולים טיפוסיים בשוק.
 * אין כאן שמות מתחרים, מחירים או ROI - רק ניסוחים וזמני מסירה שכבר פורסמו באתר.
 */
export type TimeSavedHub =
  | "podcast"
  | "studio"
  | "online"
  | "academy"
  | "business";

export type TimeSavedRow = {
  id: string;
  criterion: string;
  others: string;
  ours: string;
  href: string;
  linkLabel: string;
};

export const TIME_SAVED_MATRIX_INTRO =
  "מה עדיף לפי זמן: מסלול טיפוסי אצל ספקים אחרים, מול הלוחות שכתובים אצלנו. בלי המרה לשקלים.";

export const TIME_SAVED_MATRIX: Record<TimeSavedHub, readonly TimeSavedRow[]> = {
  podcast: [
    {
      id: "podcast-delivery",
      criterion: "מסירת פרק אחרי הפקה מלאה",
      others:
        'הבטחת "תוך שבוע" בלי תאריך ביומן. לפעמים הפרק מגיע רק אחרי חודש.',
      ours: "בהפקה מלאה - לרוב תוך 24 שעות עבודה מסיום ההקלטה.",
      href: "/podcast",
      linkLabel: "הפקת פודקאסט",
    },
    {
      id: "podcast-editing",
      criterion: "עריכת פרק שכבר הוקלט",
      others: "בלי תור עבודה ותאריך מסירה - פרק אחד יכול להימרח חודש.",
      ours: "עריכה בלבד לפי היקף החומר - בדרך כלל 2-5 ימי עסקים.",
      href: "/podcast/podcast-editing",
      linkLabel: "עריכת פודקאסט",
    },
    {
      id: "podcast-quote",
      criterion: "הצעה ראשונה",
      others: "המתנה לתשובה בלי צפי כתוב.",
      ours: TIME_CLAIMS.quote24h,
      href: "/podcast/podcast-recording",
      linkLabel: "הקלטת פודקאסט",
    },
  ],
  studio: [
    {
      id: "studio-song",
      criterion: "מסירה אחרי הקלטת שיר",
      others: "זמן אולפן כולל רק הקלטה. העריכה מגיעה אחר כך, בלי תאריך מסירה ברור.",
      ours: "חבילת שיר כוללת עריכה ותיקון זיופים - בדרך כלל תוך 48 שעות.",
      href: "/studio/recording-song-modiin",
      linkLabel: "הקלטת שיר באולפן",
    },
    {
      id: "studio-blessing",
      criterion: "הקלטת ברכה עד קובץ מוכן",
      others: "סשן ועריכה נפרדים, בלי חלון מסירה כתוב.",
      ours: "סשן של 30-60 דקות, וקובץ מוכן בדרך כלל תוך 24-48 שעות.",
      href: "/studio/blessings",
      linkLabel: "הקלטת ברכות",
    },
    {
      id: "studio-quote",
      criterion: "הצעה ראשונה",
      others: "המתנה לתשובה בלי צפי כתוב.",
      ours: TIME_CLAIMS.quote24h,
      href: "/studio/recording-studio",
      linkLabel: "אולפן הקלטות",
    },
  ],
  online: [
    {
      id: "online-turnaround",
      criterion: "החזרת קובץ אחרי שליחה",
      others: "יש מקרים שבהם קובץ חוזר אחרי שבועיים בלי עדכון בדרך.",
      ours:
        "רוב השירותים באולפן האונליין מוכנים ומסופקים בתוך 24-48 שעות מרגע שליחת הקובץ והסדרת התשלום.",
      href: "/online",
      linkLabel: "שירותים אונליין",
    },
    {
      id: "online-pitch",
      criterion: "תיקון זיופים מרחוק",
      others: "בלי תאריך מסירה כתוב - הקובץ נכנס לתור שקט.",
      ours: "קובץ חדש, ללא זיופים, נשמע טבעי - תוך 3-5 ימי עסקים.",
      href: "/online/vocal-fix",
      linkLabel: "תיקון זיופים",
    },
    {
      id: "online-revision",
      criterion: "סבב תיקון אחרי משוב",
      others: "אין זמן עדכון ברור אחרי שמחזירים הערות.",
      ours: "כותבים בוואטסאפ מה לשנות - מעדכנים תוך 24-48 שעות לפי עומס.",
      href: "/online",
      linkLabel: "שירותים אונליין",
    },
  ],
  academy: [
    {
      id: "academy-private",
      criterion: "זמן על העמדה בשיעור",
      others:
        "בקבוצה גדולה רוב הזמן עובר בהמתנה לתור. כשמגיע התור - יש דקות ספורות.",
      ours: "שיעור פרטי 60 או 90 דקות - כל הזמן שלכם.",
      href: "/academy/private-lessons",
      linkLabel: "שיעורים פרטיים",
    },
    {
      id: "academy-pace",
      criterion: "קצב התקדמות",
      others: "הקבוצה נעה לפי הקצב האטי ביותר בחדר, גם אם כבר הבנתם את החומר.",
      ours: "אחד על אחד - מתעכבים על מה שקשה ומדלגים על מה שכבר ברור.",
      href: "/academy/private-lessons",
      linkLabel: "שיעורים פרטיים",
    },
    {
      id: "academy-quote",
      criterion: "תיאום שיעור ראשון",
      others: "מחכים לפתיחת קבוצה או למחזור הבא.",
      ours: TIME_CLAIMS.quote24h,
      href: "/academy",
      linkLabel: "האקדמיה",
    },
  ],
  business: [
    {
      id: "business-voiceover",
      criterion: "קריינות קצרה לעסק",
      others: "גם קובץ של 30 שניות יכול להיתקע ימים כשהתהליך לא מסודר.",
      ours: "יום-יומיים מרגע האישור הסופי של הטקסט.",
      href: "/business/professional-voiceover",
      linkLabel: "קריינות לעסק",
    },
    {
      id: "business-content-day",
      criterion: "יום תוכן לרילז",
      others: "כל ריל מצולם ונערך בנפרד, ולכן התהליך מתפזר על פני שבועות.",
      ours: "2 שעות באולפן, 10-15 סרטונים קצרים ערוכים עם כתוביות.",
      href: "/business/content-studio",
      linkLabel: "רילז באולפן",
    },
    {
      id: "business-rave",
      criterion: "רילס אחרי אירוע לספקים",
      others: "החומר עולה לעריכה כשמגיעים אליו, בלי חלון מסירה כתוב.",
      ours: "העלאה עד 04:00 בבוקר - רילס מוכן עד 12:00 בצהריים.",
      href: "/business/reel-factory",
      linkLabel: "מפעל רילס",
    },
  ],
} as const;

export function getTimeSavedRows(hub: TimeSavedHub): readonly TimeSavedRow[] {
  return TIME_SAVED_MATRIX[hub];
}
