export type StudioVirtualTourStop = {
  id: string;
  title: string;
  summary: string;
  details: readonly string[];
  mediaNote: string;
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
    mediaNote: "TODO: אפשר להחליף לתמונה אמיתית של אזור ההקלטה אם תרצה.",
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
    mediaNote: "TODO: אפשר להוסיף צילום תקריב של המיקרופון או סטנד.",
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
    mediaNote: "TODO: אפשר לצרף כאן וידאו קצר נוסף של עמדת העבודה.",
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
    mediaNote: "TODO: אפשר להחליף לתמונה של מארז או מסך עם הקובץ המוגמר.",
  },
] as const;
