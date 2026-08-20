export type StudioVirtualTourStop = {
  id: string;
  title: string;
  summary: string;
  details: readonly string[];
  /** Existing studio photo - shown in the stop dialog */
  imageSrc: string;
  imageAlt: string;
};

export const STUDIO_VIRTUAL_TOUR_PAGE_PATH = "/studio/virtual-tour";

export const STUDIO_VIRTUAL_TOUR_VIDEO = {
  videoId: "UnBc2a3ve9w",
  title: "סיור באולפן הקלטות",
  embedUrl: "https://www.youtube.com/embed/UnBc2a3ve9w",
} as const;

export const STUDIO_VIRTUAL_TOUR_STOPS: readonly StudioVirtualTourStop[] = [
  {
    id: "room",
    title: "החדר",
    summary: "איפה יושבים, איך נראה החלל ומה קורה מהרגע שנכנסים.",
    details: [
      "החדר מותאם להקלטה מסודרת בלי להעמיס על מי שמגיע בפעם הראשונה.",
      "יש מקום לעבודה רגועה, הכנה קצרה והקלטה בקצב שמתאים לפרויקט.",
      "המטרה היא תהליך ברור - לא לחץ מיותר סביב הציוד.",
    ],
    imageSrc: "/images/services/studio/hub/אולפן פודקאסט - יקיר כהן 1.webp",
    imageAlt: "חלל האולפן במודיעין",
  },
  {
    id: "microphone",
    title: "המיקרופון",
    summary: "מה קולט את הקול ואיך עובדים מולו בלי להסתבך.",
    details: [
      "מסבירים איפה לעמוד ואיך לדבר כדי לקבל קובץ נקי.",
      "אין צורך להגיע עם ידע טכני. ההכוונה נעשית בזמן אמת.",
      "אם צריך כמה ניסיונות, עובדים עד שמרגיש נכון.",
    ],
    imageSrc: "/images/services/studio/blessings/bride-groom-blessing/הקלטה באולפן.webp",
    imageAlt: "הקלטה מול מיקרופון באולפן",
  },
  {
    id: "process",
    title: "תהליך ההקלטה",
    summary: "איך עובדים בפועל - טקסט, חזרות, הקלטה ועריכה.",
    details: [
      "מתחילים מתיאום קצר: מה מקליטים, למי זה מיועד ומתי צריך למסור.",
      "מקליטים לפי הסגנון הנבחר - שיר, ברכה, קריינות או פודקאסט קצר.",
      "אחרי ההקלטה ממשיכים לעריכה בסיסית ולמסירה בפורמט המתאים.",
    ],
    imageSrc: "/images/services/studio/recording-song-modiin/אוהד בוזגלו מקליט.webp",
    imageAlt: "תהליך הקלטה באולפן",
  },
  {
    id: "result",
    title: "תוצאה סופית",
    summary: "מה מקבלים בסוף ואיך זה נמסר.",
    details: [
      "בסיום מקבלים קובץ מוכן לשיתוף, להשמעה באירוע או לשמירה.",
      "במידת הצורך מוסיפים גם מארז פיזי או מסירה דיגיטלית מסודרת.",
      "אם הפרויקט דורש התאמות אחרונות, סוגרים אותן לפני המסירה.",
    ],
    imageSrc: "/images/services/studio/recording-song-modiin/מתחם יקיר כהן הפקות.webp",
    imageAlt: "מתחם יקיר כהן הפקות - אחרי ההקלטה",
  },
] as const;
