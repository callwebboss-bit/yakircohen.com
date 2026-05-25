export const YOUTUBE_DJ_COURSE_FREE_PLAYLIST_ID =
  "PLhuv1Ve6Oc9ksCggtlA3I5xzbLLWcJDiH";

export const YOUTUBE_DJ_COURSE_FREE_PLAYLIST_URL =
  "https://www.youtube.com/watch?v=Yw0oDKP9dkE&list=PLhuv1Ve6Oc9ksCggtlA3I5xzbLLWcJDiH";

export const YOUTUBE_DJ_COURSE_FREE_PLAYLIST_EMBED = `https://www.youtube.com/embed/videoseries?list=${YOUTUBE_DJ_COURSE_FREE_PLAYLIST_ID}`;

export const DJ_COURSE_PROGRAM: readonly {
  title: string;
  body: string;
}[] = [
  {
    title: "הכרת הציוד והתוכנה",
    body: "שליטה ב-Rekordbox, Traktor ובקונטרולרים Pioneer (הסטנדרט העולמי). מה עושה כל כפתור ואיך לא להיתקע בזמן אמת.",
  },
  {
    title: "אומנות המיקס (Beatmatching)",
    body: "חיבור שני שירים בצורה חלקה ומדויקת - בלי ש״יברח הסוס״ ובלי זיופים.",
  },
  {
    title: "מבנה מוזיקלי ומיקס הרמוני",
    body: "מתי להיכנס ומתי לצאת. רצף שמרגיש כמו סיפור, לא אוסף שירים אקראי.",
  },
  {
    title: "אפקטים (FX) ולופים",
    body: "תיבול הסט, מתח (Build-up) ושחרור (Drop) ברגע הנכון - להרים את הרחבה באוויר.",
  },
  {
    title: "ניהול ספרייה ופלייליסטים",
    body: "הסוד של ה-DJs הגדולים: סדר, תיוג ומציאת כל שיר בשניות.",
  },
  {
    title: "מיתוג אישי ושיווק",
    body: "במסלול המורחב: פתיחת עוסק, תמחור, נוכחות ברשתות והגיג הראשון.",
  },
] as const;

export const DJ_COURSE_CURRICULUM_STAGES: readonly {
  stage: string;
  title: string;
  body: string;
  sub?: string;
}[] = [
  {
    stage: "שלב 1",
    title: "שליטה טכנית מוחלטת",
    body: "לא נוגעים במוזיקה לפני שמבינים את המכונה. ציוד Pioneer, Rekordbox / Traktor, חיבורים ופתרון תקלות בזמן אמת.",
  },
  {
    stage: "שלב 2",
    title: "אומנות המיקס",
    body: "Phrasing, EQ Mixing וביטמצ'ינג ידני. מעברים שנשמעים כמו יצירה אחת ארוכה.",
  },
  {
    stage: "שלב 3",
    title: "הופעה, אפקטים ופסיכולוגיה",
    body: "Loops, FX, קריאת קהל - איזה שיר לשים ומתי, ואיך להציל רחבה שמתרוקנת.",
  },
  {
    stage: "שלב 4",
    title: "קריירה ומיתוג",
    sub: "במסלול המלא",
    body: "עוסק, תמחור, אינסטגרם של DJ והגיג ראשון - בונים מותג, לא רק טכניקה.",
  },
] as const;

export const DJ_COURSE_WHY_US: readonly { title: string; body: string }[] = [
  {
    title: "אולפן הקלטות מקצועי",
    body: "לא לומדים בחדר שינה. אולפן אקוסטי, מטופל ומאובזר בציוד קצה במודיעין.",
  },
  {
    title: "יחס אישי אמיתי (1:1)",
    body: "אין קבוצות, אין הפרעות. 100% תשומת הלב - הקצב מותאם אליך.",
  },
  {
    title: "ניסיון מוכח בשטח",
    body: "חי ונושם את התעשייה יום-יום. מה שעובד באירועים אמיתיים, לא תיאוריה יבשה.",
  },
  {
    title: "ליווי גם אחרי הקורס",
    body: "נתקעת בבית? צריך התייעצות לפני רכישת ציוד? כאן גם אחרי שהשיעור נגמר.",
  },
] as const;
