import {
  formatNis,
  PODCAST_EDITING_PER_HOUR_NIS,
  PRICES_EXCLUDE_VAT_NOTE,
} from "@/lib/data/pricing";

/** עריכה לפרק — תמחור לפי שעת חומר גולמי */
export const PODCAST_EDITING_PRICE_LABEL = `${formatNis(
  PODCAST_EDITING_PER_HOUR_NIS,
  { withSymbol: false },
)} ₪ לשעת חומר גולמי`;
export const PODCAST_EDITING_PRICE_NOTE = PRICES_EXCLUDE_VAT_NOTE;

export const PODCAST_EDITING_HERO_FEATURES: readonly string[] = [
  "ניקוי רעשי רקע מקצועי  -  בלי לפגוע בקול",
  "שיפור איכות, EQ ואיזון עוצמות",
  "חיתוך, קיצורים וזרימה טבעית",
  "מוזיקת פתיחה, סיום ומעברים",
  "סנכרון מספר מיקרופונים",
  "MP3 מוכן לפרסום + סבב תיקונים",
] as const;

export const PODCAST_EDITING_SERVICES: readonly {
  title: string;
  description: string;
}[] = [
  {
    title: "ניקוי רעשי רקע",
    description:
      "הסרת מזגן, רחוב, הד בחדר, זמזום חשמל ורעשים מעצבנים  -  כלים מקצועיים שמנקים בלי לפגוע באיכות הקול.",
  },
  {
    title: "שיפור איכות הקול",
    description:
      "העשרת הקול, הבלטת דיבור ו-EQ  -  כל מארח ואורח מקבל טיפול אישי כדי שהכול יישמע מלא, חם ונעים.",
  },
  {
    title: "חיתוך וקיצורים",
    description:
      'הסרת שתיקות ארוכות, גמגומים, "אההה", טעויות ודברים מיותרים  -  פרק דינמי וקליט ששומר על זרימה טבעית.',
  },
  {
    title: "איזון עוצמות",
    description:
      "מארח חזק ואורח חלש? מאזנים לרמה דומה + נורמליזציה ל-Spotify, Apple Podcasts וכל פלטפורמה.",
  },
  {
    title: "מוזיקה ואפקטים",
    description:
      "פתיחה, סיום, מעברים ורקע עדין  -  שלחו מוזיקה משלכם או נמצא מתאים לסגנון הפרק.",
  },
  {
    title: "סנכרון מיקרופונים",
    description:
      "כמה מיקרופונים או מקורות? מסנכרנים ומאזנים הכול כך שיישמע כמו הקלטה אחת מאוחדת.",
  },
] as const;

export const PODCAST_EDITING_AUDIENCES: readonly {
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    emoji: "🎙️",
    title: "פודקאסטרים מתחילים",
    description: "עדיין לא יודעים לערוך? תקליטו, תשלחו  -  אנחנו נדאג לכל השאר.",
  },
  {
    emoji: "⏱️",
    title: "פודקאסטרים מנוסים",
    description: "חוסכים שעות עריכה  -  אתם יוצרים תוכן, אנחנו עושים את הטכני.",
  },
  {
    emoji: "🎤",
    title: "מראיינים ויוצרי תוכן",
    description: "ראיונות, פאנלים, שולחנות עגולים  -  כל תוכן דיבור שצריך ליטוש.",
  },
  {
    emoji: "💼",
    title: "יזמים ובעלי עסקים",
    description: "פודקאסט חברה בלי כוח לעריכה  -  אנחנו כאן בשבילכם.",
  },
] as const;

export const PODCAST_EDITING_WORKFLOW: readonly {
  step: string;
  title: string;
  body: string;
}[] = [
  {
    step: "1",
    title: "מקליטים את הפרק",
    body: "במיקרופון, בזום, בטלפון  -  לא משנה איפה.",
  },
  {
    step: "2",
    title: "שולחים את הקובץ הגולמי",
    body: "וואטסאפ, מייל, Google Drive או WeTransfer  -  כל פורמט.",
  },
  {
    step: "3",
    title: "אנחנו עורכים",
    body: "מנקים, משפרים, מקצרים, מאזנים ומוסיפים מוזיקה לפי הצורך.",
  },
  {
    step: "4",
    title: "פרק מוכן לפרסום",
    body: "MP3 מעובד להעלאה לכל פלטפורמה. סבב תיקונים אחד כלול.",
  },
] as const;

export const PODCAST_EDITING_WHY_US: readonly string[] = [
  "אולפן הקלטות עם ניסיון של עשרות שנים בעבודה על אודיו",
  'לא "עורך פודקאסט"  -  אנשי מוזיקה מקצועיים עם אוזן מאומנת',
  "כלים מתקדמים: Pro Tools, iZotope RX, Waves",
  "סודיות מלאה  -  הקבצים מאובטחים ולא משותפים",
  "סבב תיקונים אחד כלול + מענה מהיר",
] as const;

export const PODCAST_EDITING_FAQS: readonly {
  id: string;
  question: string;
  answer: string;
}[] = [
  {
    id: "format",
    question: "איזה פורמט קובץ לשלוח?",
    answer:
      "כל פורמט עובד  -  MP3, WAV, M4A. הקובץ שזום שומר בסדר גמור. עדיף WAV באיכות גבוהה, MP3 גם טוב.",
  },
  {
    id: "multi-mic",
    question: "מה אם הקלטנו עם מיקרופונים שונים?",
    answer:
      "אין בעיה. שלחו את כל הקבצים (מארח, אורח וכו')  -  נסנכרן ונאזן הכול.",
  },
  {
    id: "ads",
    question: "אפשר להוסיף פרסומות בתוך הפרק?",
    answer:
      "כן. יש קובץ פרסומת או הודעה? תגידו איפה  -  נשלב במקום המדויק.",
  },
  {
    id: "ums",
    question: 'מה אם הפרק מלא ב"אההה" וגמגומים?',
    answer:
      "בדיוק בשביל זה אנחנו כאן. מסירים עד כמה שאפשר בלי לפגוע בזרימה הטבעית.",
  },
  {
    id: "output-formats",
    question: "אפשר לקבל את הפרק במספר פורמטים?",
    answer:
      "כן. MP3 כסטנדרט לכל הפלטפורמות. צריכים גם WAV? פשוט תבקשו.",
  },
] as const;
