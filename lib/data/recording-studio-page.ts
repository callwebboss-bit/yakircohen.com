export type RecordingStudioOffering = {
  title: string;
  subtitle: string;
  description: string;
  href: string;
};

export type RecordingStudioExampleVideo = {
  videoId: string;
  title: string;
};

export const RECORDING_STUDIO_FEATURED_VIDEO_ID = "UnBc2a3ve9w";

export const RECORDING_STUDIO_HIGHLIGHTS: readonly string[] = [
  "20 שנות ניסיון  -  עבודה עם אמנים גדולים והפקות טלוויזיה",
  "ציוד קצה: Neumann, Apollo ואקוסטיקה מחושבת",
  "לב מודיעין  -  חניה בשפע, נגישות מלאה",
  "שיטת הסינון  -  עובדים עם מי שבא לעבוד ברצינות",
] as const;

export const RECORDING_STUDIO_OFFERINGS: readonly RecordingStudioOffering[] = [
  {
    title: "סדנת DJ והפקה",
    subtitle: "האקדמיה להפקה & DJ",
    description:
      "מסלולי Master ו-Partnership. ליווי 1-on-1 ב-Cubase, יצירה עם AI וכלים לקריירה  -  מנטורינג בשטח, לא קורס אונליין.",
    href: "/academy",
  },
  {
    title: "פודקאסטים מצולמים (Vodcast)",
    subtitle: "הפודקאסט שלך, ברמת טלוויזיה",
    description:
      "אולפן פודקאסטים במודיעין  -  3 מצלמות 4K, סאונד ברודקאסט, עריכה מלאה ותוצר מוכן ליוטיוב וטיקטוק.",
    href: "/podcast",
  },
  {
    title: "הקלטת שירים וסינגלים",
    subtitle: "להפוך סקיצה ללהיט",
    description:
      "הפקה מלאה  -  ציוד קצה, Melodyne ידני ומיקס בסטנדרט ספוטיפיי. לא קריוקי  -  אופי אמיתי קדימה.",
    href: "/studio/recording-song-modiin",
  },
  {
    title: "שירותי אונליין & AI",
    subtitle: "הצלת סאונד מרחוק",
    description:
      "מיקס, מאסטרינג ושיפור סאונד עם AI מתקדם  -  בלי לצאת מהבית. גם הקלטה בעייתית יכולה להינצל.",
    href: "/online",
  },
  {
    title: "אולפן נייד ואטרקציות",
    subtitle: "האולפן מגיע לאירוע",
    description:
      "אולפן נייד לחתונה ובר מצווה, חבילות אירוע עם אפקטים, DJ ועשן כבד  -  חוויה שלא שוכחים.",
    href: "/studio/mobile-studio",
  },
  {
    title: "פרוטוקול NeverMind",
    subtitle: "ביטחון מול מיקרופון",
    description:
      "אימון ביצועי למנהלים, מרצים ומי שרוצה לשבור חסמי דיבור וגמגום  -  לא טיפול, אימון לשליטה וקול ברור.",
    href: "/stuttering",
  },
] as const;

export const RECORDING_STUDIO_EXAMPLE_VIDEOS: readonly RecordingStudioExampleVideo[] =
  [
    {
      videoId: "PCmsH0BLcXg",
      title: "תיקון זיופים  -  עם ובלי עריכה",
    },
    {
      videoId: "KeOlkJ7S_Yw",
      title: "הפקת קליפ בחוץ",
    },
    {
      videoId: "XEiWTmLXK50",
      title: "קליפ לילדים + הפקה מלאה",
    },
    {
      videoId: "RLTzgsRk1vk",
      title: "הקלטה באולפן  -  דוגמה נוספת",
    },
  ] as const;
