export type WeddingSmokeUseCase = {
  title: string;
  description: string;
};

export type WeddingSmokeOrderStep = {
  step: string;
  title: string;
  description: string;
};

export type WeddingSmokeCompareRow = {
  label: string;
  bad: string;
  good: string;
};

import { YOUTUBE_SERVICE_EMBED_IDS } from "@/lib/data/youtube-embeds";

export type WeddingSmokeExampleVideo = {
  videoId: string;
  title: string;
};

/** סרטון ראשי — `/events/attractions/wedding-smoking-machine` */
export const WEDDING_SMOKE_FEATURED_VIDEO_ID =
  YOUTUBE_SERVICE_EMBED_IDS["attractions-wedding-smoke"];

/** סרטון עשן כבד גדול — גם בעמוד heavy-smoke-large-events */
export const WEDDING_SMOKE_LARGE_VIDEO_ID =
  YOUTUBE_SERVICE_EMBED_IDS["attractions-wedding-smoke-large"];

export const WEDDING_SMOKE_LARGE_VIDEO: WeddingSmokeExampleVideo = {
  videoId: WEDDING_SMOKE_LARGE_VIDEO_ID,
  title: "עשן כבד גדול  -  אירועים גדולים ורחבות פתוחות",
};

/** דוגמאות נוספות (לא כוללות את הסרטון הראשי בעמוד) */
export const WEDDING_SMOKE_EXAMPLE_VIDEOS: readonly WeddingSmokeExampleVideo[] = [
  { videoId: "tLxvSRgOwGM", title: "הסבר על עשן כבד מקצועי" },
  { videoId: "O4MwVBjL2v8", title: "נפתח מושלם גם בחוץ" },
  { videoId: "WYg81S29A-k", title: "ההבדל  -  עשן איכותי לאירועים" },
] as const;

/** דוגמאות לעמוד עשן גדול — ללא כפילות של הסרטון הראשי שם */
export const HEAVY_SMOKE_EXAMPLE_VIDEOS: readonly WeddingSmokeExampleVideo[] =
  WEDDING_SMOKE_EXAMPLE_VIDEOS;

export const WEDDING_SMOKE_USE_CASES: readonly WeddingSmokeUseCase[] = [
  {
    title: "חתונות ואירועי יוקרה",
    description:
      "אפקט קולנועי לסלואו, כניסה לחופה או ריקוד אב-בת  -  ענן לבן בגובה הברך, מראה מלאכי.",
  },
  {
    title: "בר/בת מצווה",
    description:
      "רגע השיא על הבמה  -  עשן לבן שגולש לצדדים והילדים מרגישים כמו כוכבים.",
  },
  {
    title: "אירועים עסקיים",
    description:
      "פתיחה דרמטית להרצאה, השקת מוצר או מסיבת שכר  -  יוקרה ומקצועיות.",
  },
  {
    title: "תקליטנים (DJs)",
    description:
      "שדרוג המיתוג האישי  -  ה-DJ שמשתמש בעשן כבד זוכה לשבחים מיידיים מהקהל.",
  },
] as const;

export const WEDDING_SMOKE_ORDER_STEPS: readonly WeddingSmokeOrderStep[] = [
  {
    step: "01",
    title: "תאריך + סוג אירוע",
    description: "שולחים פרטים  -  חוזרים עם הצעת מחיר מדויקת תוך דקות.",
  },
  {
    step: "02",
    title: "תיאום רגעים",
    description: "מתאמים עם ה-DJ: חופה, סלואו או כל רגע מיוחד.",
  },
  {
    step: "03",
    title: "יום האירוע",
    description:
      "טכנאי מגיע 2–3 שעות לפני  -  התקנה, הפעלה מדויקת ופירוק נקי בסוף.",
  },
] as const;

export const WEDDING_SMOKE_WHY_US: readonly string[] = [
  "עשן לבן, סמיך ונשאר נמוך לאורך כל הרגע",
  "בטיחותי  -  לא מחליק ולא מרטיב",
  "ללא ריח  -  מתאים לאולמות סגורים",
  "תיאום מלא מול DJ וצלם",
  "לא משאיר לכלוך  -  פשוט נעלם",
  "מתאים לכל שלב באירוע",
] as const;

export const WEDDING_SMOKE_COMPARE: readonly WeddingSmokeCompareRow[] = [
  {
    label: "האפקט",
    bad: "עשן אפור שעולה למעלה ומסתיר פנים",
    good: "ענן לבן בגובה הרצפה  -  נראה כמו סרט",
  },
  {
    label: "ריח",
    bad: "ריח שרוף שנשאר באולם ובבגדים",
    good: "ללא ריח  -  לא משפיע על אוכל או בגדים",
  },
  {
    label: "בטיחות",
    bad: "רצפה שמנונית ומחליקה",
    good: "מתנדף תוך דקות  -  רצפה יבשה ובטוחה",
  },
  {
    label: "צילום",
    bad: "משבש פוקוס  -  תמונה לא חדה",
    good: "מאיר פנים ומעניק עומק דרמטי לתמונות",
  },
] as const;
