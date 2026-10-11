/**
 * נתוני העמוד "יום הולדת לילדים באולפן" (/studio/kids-birthday).
 *
 * קובץ אחד ממנו נגזרים העמוד, טופס ההזמנה, הסכמה והשאלות הנפוצות.
 *
 * כלל: בעמוד נכתבת רק עובדה שהבעלים אמר, והיא נושאת את המקור שלה בהערה לידה.
 * - הבקשה לבניית העמוד, 7.10.2026: שעתיים, חמשת השלבים לפי הסדר, טופס
 *   שמעביר לוואטסאפ עם תאריך ומספר ילדים.
 * - תשובות הבעלים, 8.10.2026, מסומנות A1, A2 וכן הלאה. הן נאמרו בדיבור, והניסוח
 *   כאן מסדר אותן בלי להוסיף פרט שלא נאמר.
 * עדיף להשמיט מאשר להשלים בהיגיון. אין בעמוד הבטחה שלא נאמרה.
 *
 * מה הוסר מהעמוד ב-8.10.2026 כדי שלא יבטיח דבר שלא נאמר או שאי אפשר לעמוד בו:
 * גיל, מינימום ילדים, מה הילד לוקח הביתה, מה ההורים מביאים, מחיר, ופרטים על
 * מיקס קצר ועל צילומי חוץ. הנוסח הקודם (עם שדות null וסימוני TODO-OWNER
 * לכל אחד מהם) נשמר בהיסטוריית git של הקובץ, ב-commit 8452eb33. החזרת פריט:
 * מוסיפים לכאן שדה עם ערך שהבעלים אישר ומקור בהערה, ומציגים אותו ב-
 * components/seo/KidsBirthdayPageContent.tsx ובשאלות הנפוצות למטה.
 *
 * מחיר: כשיוחלט, הוא נכנס ל-lib/data/pricing-catalog.ts ומוצג דרך פונקציות
 * הקטלוג. כתיבת סכום חופשי בטקסט נתפסת על ידי audit:price-literals ו-
 * audit:prose-prices. הסכמה נשארת בלי offers עד שיהיה מחיר.
 *
 * השער audit:owner-todos נכשל על כל סימון חסר-מידע שיישאר בקוד, ולכן כל פריט
 * פתוח שיוחזר לעמוד עם סימון חוסם את העלייה ל-main עד שימולא.
 */

export const KIDS_BIRTHDAY_PATH = "/studio/kids-birthday";

/** id של טופס ההזמנה: משמש עוגן בעמוד, מזהה טופס בליד ותג ל-yakir-closer */
export const KIDS_BIRTHDAY_FORM_ID = "studio_kids_birthday_form";
export const KIDS_BIRTHDAY_FORM_ANCHOR = "kids-birthday-form";

export const KIDS_BIRTHDAY_UTM_CAMPAIGN = "studio_kids_birthday";

/** שם השירות כפי שהוא מופיע בהודעת הוואטסאפ ובמייל לבעלים */
export const KIDS_BIRTHDAY_SERVICE_LABEL = "יום הולדת לילדים באולפן";

export const KIDS_BIRTHDAY_HERO = {
  /* "באולפן": הבעלים לא היה בטוח (A14), אבל A12 קובע שהכול מתקיים באולפן
     במודיעין, ולכן זה נשאר. */
  title: "יום הולדת לילדים באולפן",
  /* מקור: הבקשה. "שעתיים" ושמות חמשת השלבים כפי שנמסרו, בלי תוספות. */
  subtitle:
    "שעתיים באולפן: קבלת פנים, בחירת שיר, הקלטה בתאים, מיקס קצר והאזנה משותפת.",
  metaTitle: "יום הולדת לילדים באולפן הקלטות",
  metaDescription:
    "יום הולדת לילדים באולפן הקלטות. שעתיים של קבלת פנים, בחירת שיר, הקלטה בתאים, מיקס קצר והאזנה משותפת.",
  keywords: [
    "יום הולדת לילדים באולפן",
    "יום הולדת באולפן הקלטות",
    "יום הולדת עם הקלטת שיר",
    "מסיבת יום הולדת לילדים",
  ],
  ctaLabel: "להזמנת יום הולדת",
} as const;

export type KidsBirthdayStage = {
  id: string;
  /** שם השלב כפי שהבעלים נתן אותו (הבקשה, 7.10.2026) */
  title: string;
  /** מה קורה בשלב. המקור של כל תיאור בהערה לידו. משך בדקות לא מוצג: הבעלים לא ביקש. */
  description: string;
};

/** חמשת השלבים לפי הסדר שהבעלים נתן. הסדר הוא חלק מהעובדה. */
export const KIDS_BIRTHDAY_STAGES: readonly KidsBirthdayStage[] = [
  {
    id: "welcome",
    title: "קבלת פנים",
    /* תשובת הבעלים 8.10.2026, A1: "מחכים שכולם יגיעו, זה בדרך כלל בשעה
       שאנחנו מסכמים, בדיוק באותה שעה מתאספים ונכנסים לאולפן." */
    description:
      "מחכים שכולם יגיעו. זה בדרך כלל בשעה שסיכמנו, ובאותה שעה מתאספים ונכנסים לאולפן.",
  },
  {
    id: "song-choice",
    title: "בחירת שיר",
    /* תשובת הבעלים 8.10.2026, A2: "נעשית על ידי הצבעה או סקר שעושים ביחד,
       אפשר לעשות זה בוואטסאפ, ובדרך כלל החלטת הרוב מתקבלת." */
    description:
      "בוחרים בהצבעה או בסקר שעושים ביחד. אפשר לעשות את זה בוואטסאפ. בדרך כלל החלטת הרוב מתקבלת.",
  },
  {
    id: "booth-recording",
    title: "הקלטה בתאים",
    /* A3 (8.10.2026) אמר "עד חמישה ילדים בתא", ו-D64 אומר 4 מקליטים בבת אחת.
       הבעלים הכריע 11.10.2026 (D99): בלי מספר, רק ההמלצה */
    description: "ההמלצה שלנו היא להקליט ילד ילד, כל פעם בנפרד.",
  },
  {
    id: "short-mix",
    title: "מיקס קצר",
    /* A4 הכילה פרטים על מה הילדים עושים בזמן המיקס (ישיבה, משחק בחוץ). הם
       הוסרו כי הם מבטיחים השגחה ובידור שהבעלים לא התחייב אליהם. הניסוח כאן
       רק חוזר על שם השלב. */
    description: "עושים מיקס קצר.",
  },
  {
    id: "group-listening",
    title: "האזנה משותפת",
    /* A5 לא נענה. הניסוח רק חוזר על שם השלב, בלי פרט שלא נאמר. */
    description: "מאזינים יחד.",
  },
];

/** האורך הכולל של האירוע. מקור: הבקשה ("בשעתיים"). */
export const KIDS_BIRTHDAY_DURATION_LABEL = "שעתיים";

/**
 * קיבולת המקום. תשובת הבעלים 8.10.2026 (שאלת הקיבולת): "אי אפשר להכניס יותר
 * מ-14 אנשים. ובמידה ויש יותר, אז צריך לחלק את זה לפי קבוצות. המקום מאכלס
 * עד 14 איש." זה מספר אנשים במקום, לא בהכרח ילדים, ולכן הוא לא חוסם את
 * הטופס. הנוסח בעמוד כפי שהבעלים הורה.
 */
export const KIDS_BIRTHDAY_CAPACITY = {
  people: 14,
  note: "המקום מאכלס עד 14 איש. אם יש יותר, מחלקים לקבוצות.",
} as const;

/**
 * הכנה לפני האירוע. תשובת הבעלים 8.10.2026, A9: "כל ילד מקבל פלייבק להתכונן.
 * מילים, ויש אפשרות גם לראות במקום. אבל בדרך כלל חשוב לזכור הכל בעל פה, זה
 * מראה שמתכוננים."
 */
export const KIDS_BIRTHDAY_PREPARATION =
  "כל ילד מקבל פלייבק כדי להתכונן, ומילים. אפשר גם לראות את המילים במקום, אבל בדרך כלל חשוב לזכור הכול בעל פה: זה מראה שהתכוננו.";

/**
 * איפה. תשובת הבעלים 8.10.2026, A12: "הכל מתקיים באולפן במודיעין...". שאר
 * התשובה (צילום בגנים בחוץ, אולפן נייד וצילומי חוץ) הוסרה: היא מתארת שירות
 * שלא תומחר ולא הוגדר, ולכן אין בעמוד התחייבות אליו.
 */
export const KIDS_BIRTHDAY_LOCATION = "הכול מתקיים באולפן במודיעין.";

export type KidsBirthdayGalleryImage = {
  src: string;
  /** מה רואים בפועל בתמונה. לא מה שהיינו רוצים שיראו. */
  alt: string;
  width: number;
  height: number;
};

/**
 * גלריה. תשובת הבעלים 8.10.2026, A13: הבעלים יוסיף תמונות בעצמו, ומה שיש
 * כאן עכשיו הוא ברירת מחדל. אלה תמונות אולפן והקלטה שכבר קיימות באתר
 * (public/images/services/studio), ואף אחת מהן אינה מיום הולדת. ה-alt מתאר
 * מה שנראה בתמונה, ולכן אין בו "יום הולדת". הכותרת בעמוד היא "מהאולפן".
 *
 * להוספת תמונה: מוסיפים אובייקט למערך (נתיב מ-public, alt אמיתי, ומידות
 * הקובץ). התמונות מוצגות לפי הסדר במערך.
 */
export const KIDS_BIRTHDAY_GALLERY: readonly KidsBirthdayGalleryImage[] = [
  {
    src: "/images/services/studio/hub/הקלטת ילד בר מצווה.webp",
    alt: "ילד שר מול מיקרופון בתא הקלטה",
    width: 1280,
    height: 720,
  },
  {
    src: "/images/services/studio/hub/משפחה מקליטה באולפן הקלטות יקיר כהן הפקות.webp",
    alt: "חמישה אנשים עם אוזניות בתא הקלטה",
    width: 2560,
    height: 1440,
  },
  {
    src: "/images/services/studio/recording-song-modiin/תא הקלטה יקיר כהן הפקות.webp",
    alt: "שני גברים בתא ההקלטה, מול מסך עריכה",
    width: 1600,
    height: 1200,
  },
];

/* ---------- נגזרות: מה שמוצג בפועל, מחושב מהשדות למעלה ---------- */

/** חיבור הרשימה למשפט: "א, ב וג". עברית: ו' החיבור צמודה לפריט האחרון. */
export function joinHebrewList(items: readonly string[]): string {
  if (items.length <= 1) return items.join("");
  const head = items.slice(0, -1).join(", ");
  const last = items[items.length - 1];
  return `${head} ו${last}`;
}

export type KidsBirthdayFaq = {
  id: string;
  question: string;
  answer: string;
};

/**
 * שאלות נפוצות. כל תשובה נגזרת מעובדה מוכרת (הבקשה או תשובות הבעלים).
 * שאלה שאין לה תשובה מאושרת לא נכתבת כאן. כל הרשימה נכנסת ל-FAQPage ב-JSON-LD.
 */
export function buildKidsBirthdayFaqs(
  stages: readonly KidsBirthdayStage[] = KIDS_BIRTHDAY_STAGES,
): KidsBirthdayFaq[] {
  const stageTitles = stages.map((s) => s.title);

  return [
    {
      id: "what-happens",
      question: "מה קורה ביום הולדת באולפן?",
      answer: `יום ההולדת נמשך ${KIDS_BIRTHDAY_DURATION_LABEL}, בחמישה שלבים לפי הסדר: ${joinHebrewList(stageTitles)}.`,
    },
    {
      id: "how-long",
      question: "כמה זמן נמשך יום ההולדת?",
      answer: `${KIDS_BIRTHDAY_DURATION_LABEL}.`,
    },
    {
      id: "how-to-order",
      question: "איך מזמינים?",
      answer:
        "ממלאים בעמוד תאריך, מספר ילדים ופרטי קשר. הטופס פותח וואטסאפ עם הודעה מוכנה.",
    },
    {
      id: "preparation",
      question: "איך הילדים מתכוננים לפני יום ההולדת?",
      answer: KIDS_BIRTHDAY_PREPARATION,
    },
    {
      id: "capacity",
      question: "כמה אנשים המקום מאכלס?",
      answer: KIDS_BIRTHDAY_CAPACITY.note,
    },
    {
      id: "where",
      question: "איפה זה מתקיים?",
      answer: KIDS_BIRTHDAY_LOCATION,
    },
  ];
}

/** תשובת ה-AEO הגלויה בראש העמוד: מה קורה, בלשון הבעלים */
export const KIDS_BIRTHDAY_AEO = {
  id: "aeo-answer-kids-birthday",
  question: "מה קורה ביום הולדת לילדים באולפן?",
  text: `יום ההולדת נמשך ${KIDS_BIRTHDAY_DURATION_LABEL} וכולל ${joinHebrewList(
    KIDS_BIRTHDAY_STAGES.map((s) => s.title),
  )}.`,
} as const;
