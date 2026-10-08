/**
 * נתוני העמוד "יום הולדת לילדים באולפן" (/studio/kids-birthday).
 *
 * קובץ אחד ממנו נגזרים העמוד, טופס ההזמנה, אימות הטופס, הסכמה והשאלות
 * הנפוצות. הבעלים ממלא במקום אחד.
 *
 * מקורות (כל עובדה בקובץ נושאת את המקור שלה בהערה לידה):
 * - הבקשה לבניית העמוד, 7.10.2026: שעתיים, חמשת השלבים לפי הסדר, טופס
 *   שמעביר לוואטסאפ עם תאריך ומספר ילדים, מחיר שנשאר ריק.
 * - תשובות הבעלים, 8.10.2026, מסומנות A1, A2 וכן הלאה. הן נאמרו בדיבור, והניסוח
 *   כאן מסדר אותן בלי להוסיף פרט שלא נאמר.
 *
 * מה שלא נמסר הוא null, והעמוד מציג במקומו את סימון ה-TODO שלצידו. אסור
 * להשלים ערך "בהיגיון": עדיף שדה חסר מסומן על ערך משוער.
 *
 * איך ממלאים שדה שנשאר:
 * 1. מחליפים את null בערך (מספר, טקסט או רשימה, לפי סוג השדה).
 * 2. מרוקנים את מחרוזת ה-TODO שלצידו (משאירים "").
 * הסימון חי רק בקובץ הזה. השער audit:owner-todos נכשל כל עוד נשאר סימון
 * כזה בקוד, ולכן הענף לא יכול להגיע ל-main בלי שהכול מולא.
 *
 * מחיר: אין כאן ואין בקטלוג. כשהבעלים יחליט, המחיר נכנס ל-
 * lib/data/pricing-catalog.ts ומוצג דרך פונקציות הקטלוג. כתיבת סכום חופשי
 * בטקסט נתפסת על ידי audit:price-literals ו-audit:prose-prices. עד אז הסכמה
 * של העמוד נשארת בלי offers, כי הצעה בלי מחיר היא צומת שבור בעיני גוגל.
 */

/** שדה שהבעלים ממלא. value הוא null עד שמולא, ו-todo הוא השאלה אליו. */
export type OwnerField<T> = {
  value: T | null;
  todo: string;
};

function field<T>(value: T | null, todo: string): OwnerField<T> {
  return { value, todo };
}

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
    /* תשובת הבעלים 8.10.2026, A3: "אפשר להכניס עד חמישה ילדים בתא, המלצה
       שלנו להקליט ילד ילד כל פעם בנפרד." */
    description:
      "אפשר להכניס עד חמישה ילדים בתא. ההמלצה שלנו היא להקליט ילד ילד, כל פעם בנפרד.",
  },
  {
    id: "short-mix",
    title: "מיקס קצר",
    /* תשובת הבעלים 8.10.2026, A4: "הילדים יושבים בסבלנות או שיכולים לשחק
       בחוץ במתחם הפודקאסטים, יש מספיק עניין במקום." */
    description:
      "הילדים יושבים בסבלנות, או שיכולים לשחק בחוץ במתחם הפודקאסטים. יש מספיק עניין במקום.",
  },
  {
    id: "group-listening",
    title: "האזנה משותפת",
    /* A5 לא נענה. הניסוח רק חוזר על שם השלב, בלי פרט שלא נאמר, ומחכה לאישור
       הבעלים. זה לא סימון TODO במכוון: אין כאן עובדה שצריך למלא. */
    description: "מאזינים יחד.",
  },
];

/** האורך הכולל של האירוע. מקור: הבקשה ("בשעתיים"). */
export const KIDS_BIRTHDAY_DURATION_LABEL = "שעתיים";

/**
 * קיבולת המקום. תשובת הבעלים 8.10.2026 (שאלת הקיבולת): "אי אפשר להכניס יותר
 * מ-14 אנשים. ובמידה ויש יותר, אז צריך לחלק את זה לפי קבוצות. המקום מאכלס
 * עד 14 איש." זה מספר אנשים במקום, לא בהכרח ילדים, ולכן הוא לא חוסם את
 * הטופס וגם לא נקרא "מקסימום ילדים". הנוסח בעמוד כפי שהבעלים הורה.
 */
export const KIDS_BIRTHDAY_CAPACITY = {
  people: 14,
  note: "המקום מאכלס עד 14 איש. אם יש יותר, מחלקים לקבוצות.",
} as const;

export const KIDS_BIRTHDAY = {
  /**
   * לאיזה גיל. תשובת הבעלים 8.10.2026 (שאלת הגילאים) הייתה הקלטה קולית לא
   * ברורה ("לכל גיל היי, שבע"), כנראה "מגיל 7". לכן הערך נשאר ריק, והשאלה
   * לבעלים היא האישור. אסור לכתוב גיל בעמוד לפני שהוא אישר.
   */
  ageRange: field<string>(
    null,
    "[[TODO-OWNER: הבנתי שמגיל 7 ומעלה, בלי גיל מקסימום. נכון?]]",
  ),
  /**
   * מינימום ילדים לאירוע. לא נענה. כשהוא מולא, הטופס חוסם הזמנה מתחתיו.
   * מקסימום ילדים לא נקבע: ראו KIDS_BIRTHDAY_CAPACITY.
   */
  minChildren: field<number>(
    null,
    "[[TODO-OWNER: מה מינימום הילדים לאירוע?]]",
  ),
  /** מה הילד לוקח הביתה בסוף היום, פריט בכל שורה. לא נענה. */
  takeHome: field<readonly string[]>(
    null,
    "[[TODO-OWNER: מה הילד לוקח הביתה בסוף היום? למשל קובץ השיר המוקלט?]]",
  ),
  /** מה ההורים צריכים להביא, פריט בכל שורה. לא נענה. */
  parentsBring: field<readonly string[]>(
    null,
    "[[TODO-OWNER: מה ההורים צריכים להביא?]]",
  ),
  /**
   * מחיר. נשאר ריק בכוונה: הבעלים ימלא. ראו את הערת הקובץ על הקטלוג.
   */
  price: field<string>(
    null,
    "[[TODO-OWNER: מחיר יום ההולדת, כולל מה כלול ומה לא, ואם הוא למשפחה או לילד]]",
  ),
};

/**
 * הכנה לפני האירוע. תשובת הבעלים 8.10.2026, A9: "כל ילד מקבל פלייבק להתכונן.
 * מילים, ויש אפשרות גם לראות במקום. אבל בדרך כלל חשוב לזכור הכל בעל פה, זה
 * מראה שמתכוננים."
 */
export const KIDS_BIRTHDAY_PREPARATION =
  "כל ילד מקבל פלייבק כדי להתכונן, ומילים. אפשר גם לראות את המילים במקום, אבל בדרך כלל חשוב לזכור הכול בעל פה: זה מראה שהתכוננו.";

/**
 * איפה. תשובת הבעלים 8.10.2026, A12: "הכל מתקיים באולפן במודיעין, לפעמים גם
 * אפשרי לעשות צילום בגנים בחוץ, או אם מישהו מזמין אולפן נייד, אז אפשר אחרי
 * זה לחלק גם לצילומי חוץ. הכל תלוי בהתאם למה שהזמינו."
 */
export const KIDS_BIRTHDAY_LOCATION = {
  text: "הכול מתקיים באולפן במודיעין. לפעמים אפשר גם לעשות צילום בגנים בחוץ, ואם מזמינים אולפן נייד, אפשר אחר כך לחלק גם לצילומי חוץ. הכול לפי מה שהוזמן.",
  /** קישור לעמוד האולפן הנייד, שהבעלים הזכיר בתשובה */
  mobileStudio: { href: "/studio/mobile-studio", label: "פרטים על האולפן הנייד" },
} as const;

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

export type KidsBirthdayLimits = {
  /** מינימום ילדים. null = לא נקבע, והאימות מדלג עליו. */
  min: number | null;
};

export function getKidsBirthdayLimits(): KidsBirthdayLimits {
  return { min: KIDS_BIRTHDAY.minChildren.value };
}

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
  /** null = עוד אין תשובה. העמוד מציג את todo, והסכמה מדלגת על השאלה. */
  answer: string | null;
  todo: string;
};

/**
 * שאלות נפוצות. תשובה נכתבת רק מעובדה מוכרת: מהבקשה, מתשובות הבעלים או משדה
 * שהבעלים מילא. שאלה בלי תשובה נשארת בעמוד עם סימון TODO ולא נכנסת ל-FAQPage
 * ב-JSON-LD.
 */
export function buildKidsBirthdayFaqs(
  data: typeof KIDS_BIRTHDAY = KIDS_BIRTHDAY,
  stages: readonly KidsBirthdayStage[] = KIDS_BIRTHDAY_STAGES,
): KidsBirthdayFaq[] {
  const stageTitles = stages.map((s) => s.title);
  const takeHome = data.takeHome.value;
  const parentsBring = data.parentsBring.value;
  const min = data.minChildren.value;

  return [
    {
      id: "what-happens",
      question: "מה קורה ביום הולדת באולפן?",
      answer: `יום ההולדת נמשך ${KIDS_BIRTHDAY_DURATION_LABEL}, בחמישה שלבים לפי הסדר: ${joinHebrewList(stageTitles)}.`,
      todo: "",
    },
    {
      id: "how-long",
      question: "כמה זמן נמשך יום ההולדת?",
      answer: `${KIDS_BIRTHDAY_DURATION_LABEL}.`,
      todo: "",
    },
    {
      id: "how-to-order",
      question: "איך מזמינים?",
      answer:
        "ממלאים בעמוד תאריך, מספר ילדים ופרטי קשר. הטופס פותח וואטסאפ עם הודעה מוכנה.",
      todo: "",
    },
    {
      id: "preparation",
      question: "איך הילדים מתכוננים לפני יום ההולדת?",
      answer: KIDS_BIRTHDAY_PREPARATION,
      todo: "",
    },
    {
      id: "capacity",
      question: "כמה אנשים המקום מאכלס?",
      answer: KIDS_BIRTHDAY_CAPACITY.note,
      todo: "",
    },
    {
      id: "age",
      question: "לאיזה גיל זה מתאים?",
      answer: data.ageRange.value,
      todo: data.ageRange.todo,
    },
    {
      id: "min-children",
      question: "כמה ילדים צריך כדי לקיים יום הולדת?",
      answer: min !== null ? `מינימום ${min} ילדים.` : null,
      todo: data.minChildren.todo,
    },
    {
      id: "take-home",
      question: "מה הילד לוקח הביתה בסוף היום?",
      answer: takeHome && takeHome.length > 0 ? `${joinHebrewList(takeHome)}.` : null,
      todo: data.takeHome.todo,
    },
    {
      id: "parents-bring",
      question: "מה ההורים צריכים להביא?",
      answer:
        parentsBring && parentsBring.length > 0
          ? `${joinHebrewList(parentsBring)}.`
          : null,
      todo: data.parentsBring.todo,
    },
    {
      id: "price",
      question: "כמה זה עולה?",
      answer: data.price.value,
      todo: data.price.todo,
    },
    {
      id: "where",
      question: "איפה זה מתקיים?",
      answer: KIDS_BIRTHDAY_LOCATION.text,
      todo: "",
    },
  ];
}

/** רק השאלות שיש להן תשובה, בצורה שמתאימה ל-buildFaqSchema ול-FaqPageSchema */
export function getAnsweredFaqs(
  faqs: readonly KidsBirthdayFaq[],
): { question: string; answer: string }[] {
  return faqs.flatMap((faq) =>
    faq.answer ? [{ question: faq.question, answer: faq.answer }] : [],
  );
}

/** תשובת ה-AEO הגלויה בראש העמוד: מה קורה, בלשון הבעלים */
export const KIDS_BIRTHDAY_AEO = {
  id: "aeo-answer-kids-birthday",
  question: "מה קורה ביום הולדת לילדים באולפן?",
  text: `יום ההולדת נמשך ${KIDS_BIRTHDAY_DURATION_LABEL} וכולל ${joinHebrewList(
    KIDS_BIRTHDAY_STAGES.map((s) => s.title),
  )}.`,
} as const;
