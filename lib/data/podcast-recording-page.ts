export const PODCAST_RECORDING_PRICE = "2,500";
export const PODCAST_RECORDING_PRICE_NOTE = "לפרק מלא · כולל צילום, הקלטה ועריכה";

export const PODCAST_RECORDING_HERO_FEATURES: readonly string[] = [
  "צילום 4K ב-2-3 מצלמות",
  "סאונד אולפני נקי  -  Shure, Rode",
  "3 חללי הקלטה מעוצבים",
  "עריכה מקצועית מלאה",
  "קבצים מוכנים תוך 24 שעות",
  "מוכן להעלאה לספוטיפיי ויוטיוב",
] as const;

export const PODCAST_RECORDING_AUDIENCES: readonly {
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    emoji: "💼",
    title: "בעלי עסקים",
    description: "פודקאסט מקצועי בלי להתעסק בטכניקה.",
  },
  {
    emoji: "💡",
    title: "מומחים ויועצים",
    description: "לחלוק ידע בלי להיות טכנאים.",
  },
  {
    emoji: "🎥",
    title: "יוצרי תוכן",
    description: "מתמקדים בתוכן  -  לא בעריכה ובציוד.",
  },
  {
    emoji: "🏢",
    title: "חברות",
    description: "פודקאסט תדמיתי/שיווקי ברמה גבוהה.",
  },
] as const;

export const PODCAST_RECORDING_STUDIO_SPACES: readonly {
  title: string;
  description: string;
}[] = [
  { title: "החלל האורבני", description: "מודרני ונעים  -  קירות חשופים, אווירה אורבנית." },
  { title: "החלל הירוק / סטנדרטי", description: "רענן ומרגיע  -  צמחייה טבעית." },
  { title: "החלל הרשמי", description: "מקצועי ויוקרתי  -  עיצוב אלגנטי, תחושת פרימיום." },
] as const;

export const PODCAST_RECORDING_INCLUDED: readonly {
  title: string;
  items: readonly string[];
}[] = [
  {
    title: "סשן צילום והקלטה (עד שעה)",
    items: [
      "בחירת חלל מתוך 3 אפשרויות",
      "זמן להתארגן לפני הצילום  -  בלי לחץ",
    ],
  },
  {
    title: "צילום וידאו ברמה הגבוהה ביותר",
    items: [
      "2-3 מצלמות 4K  -  זוויות מגוונות, מראה דינמי",
      "תאורת סטודיו מקצועית",
      "Framing מושלם  -  כל פריים נראה מקצועי",
    ],
  },
  {
    title: "הקלטת סאונד אולפנית",
    items: [
      "מיקרופונים דינמיים Shure, Rode, Audio-Technica",
      "הקלטה ישירה למערכת אולפן  -  סאונד נקי",
      "אוזניות לכל משתתף",
      "טלפרומפטר (אם צריך)",
    ],
  },
  {
    title: "עריכה מקצועית מלאה",
    items: [
      "חיתוך וסידור  -  הסרת טעויות והפסקות",
      "סנכרון אודיו ווידאו",
      "מעברים דינמיים בין מצלמות",
      "תיקוני צבע בסיסיים",
      "פתיח/סגיר  -  שלכם או מהמאגר",
      "עריכת סאונד ונורמליזציה",
    ],
  },
  {
    title: "קבצים סופיים מוכנים להפצה",
    items: [
      "וידאו MP4  -  1080p או 4K (לפי בקשה) ליוטיוב",
      "אודיו MP3 מנורמל  -  ספוטיפיי, Apple Podcasts ועוד",
      "הכל מוכן תוך 24 שעות עבודה",
    ],
  },
] as const;

export const PODCAST_RECORDING_WORKFLOW: readonly {
  step: string;
  title: string;
  body: string;
}[] = [
  {
    step: "1",
    title: "תיאום ותכנון",
    body: "יוצרים קשר, מתאמים תאריך, בוחרים חלל ומדברים על התוכן.",
  },
  {
    step: "2",
    title: "הגעה לאולפן במודיעין",
    body: "מגיעים במועד  -  חניה בשפע  -  ומתארגנים בנוחות.",
  },
  {
    step: "3",
    title: "הקלטה וצילום",
    body: "עד שעה  -  אתם מדברים, אנחנו דואגים לכל השאר.",
  },
  {
    step: "4",
    title: "אנחנו עורכים",
    body: "עריכה מקצועית מלאה על כל החומר.",
  },
  {
    step: "5",
    title: "פרק מוכן",
    body: "תוך 24 שעות  -  קבצים מוכנים להעלאה.",
  },
] as const;

export const PODCAST_RECORDING_WHY_US: readonly string[] = [
  "חוסכים זמן ואנרגיה  -  בלי ללמוד, לקנות ציוד או לערוך",
  "תוצאה מקצועית  -  נראה ונשמע כמו הפודקאסטים הגדולים",
  "מהיר  -  הפרק מוכן תוך 24 שעות",
  "נוח  -  מגיעים, מדברים, יוצאים",
  "משתלם  -  פחות מקניית ציוד ועשייה עצמית",
] as const;

export const PODCAST_RECORDING_FAQS: readonly {
  id: string;
  question: string;
  answer: string;
}[] = [
  {
    id: "duration",
    question: "שעה מספיקה?",
    answer:
      "בדרך כלל שעה מייצרת 30-60 דקות תוכן ערוך, תלוי בקצב הדיבור.",
  },
  {
    id: "guests",
    question: "אפשר להביא אורחים?",
    answer: "בהחלט. יש מיקרופונים ואוזניות לכמה משתתפים.",
  },
  {
    id: "revisions",
    question: "מה אם צריכים תיקונים?",
    answer: "סבב תיקונים אחד כלול. תיקונים נוספים בתוספת סמלית.",
  },
  {
    id: "visit",
    question: "אפשר לראות את הסטודיו לפני?",
    answer: "כן  -  ביקור מקדים ללא עלות.",
  },
  {
    id: "camera-shy",
    question: "מה אם לא מרגישים בנוח מול מצלמה?",
    answer: "זה נורמלי. כיוון, תמיכה וטלפרומפטר  -  עוזרים להרגיש בנוח.",
  },
] as const;
