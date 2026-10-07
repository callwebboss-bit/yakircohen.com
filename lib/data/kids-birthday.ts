/**
 * נתוני העמוד "יום הולדת לילדים באולפן" (/studio/kids-birthday).
 *
 * קובץ אחד ממנו נגזרים העמוד, טופס ההזמנה, אימות הטופס, הסכמה והשאלות
 * הנפוצות. הבעלים ממלא במקום אחד.
 *
 * מה ידוע (מקור: הבקשה לבניית העמוד, 7.10.2026):
 * - האירוע נמשך שעתיים.
 * - חמישה שלבים לפי הסדר: קבלת פנים, בחירת שיר, הקלטה בתאים, מיקס קצר,
 *   האזנה משותפת.
 * - טופס ההזמנה מעביר לוואטסאפ עם תאריך ומספר ילדים.
 * - המחיר נשאר ריק עד שהבעלים ימלא אותו.
 *
 * כל השאר לא נמסר, ולכן הוא null והעמוד מציג במקומו את סימון ה-TODO שלצידו.
 * אסור להשלים ערך "בהיגיון": עדיף שדה חסר מסומן על ערך משוער.
 *
 * איך ממלאים שדה:
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
  /** שם השלב כפי שהבעלים נתן אותו */
  title: string;
  /** מה קורה בשלב, במילים של הבעלים */
  description: OwnerField<string>;
  /** משך השלב בדקות. אין לחלק את השעתיים בעצמנו. */
  minutes: OwnerField<number>;
};

/** חמשת השלבים לפי הסדר שהבעלים נתן. הסדר הוא חלק מהעובדה. */
export const KIDS_BIRTHDAY_STAGES: readonly KidsBirthdayStage[] = [
  {
    id: "welcome",
    title: "קבלת פנים",
    description: field<string>(
      null,
      "[[TODO-OWNER: מה קורה בשלב 'קבלת פנים', משפט או שניים]]",
    ),
    minutes: field<number>(
      null,
      "[[TODO-OWNER: כמה דקות נמשכת 'קבלת פנים']]",
    ),
  },
  {
    id: "song-choice",
    title: "בחירת שיר",
    description: field<string>(
      null,
      "[[TODO-OWNER: מה קורה בשלב 'בחירת שיר': מי בוחר, מתוך מה, ומה אם הילדים לא מסכימים]]",
    ),
    minutes: field<number>(
      null,
      "[[TODO-OWNER: כמה דקות נמשכת 'בחירת שיר']]",
    ),
  },
  {
    id: "booth-recording",
    title: "הקלטה בתאים",
    description: field<string>(
      null,
      "[[TODO-OWNER: מה קורה בשלב 'הקלטה בתאים': כמה ילדים בתא, איך מתחלפים, מי מנחה]]",
    ),
    minutes: field<number>(
      null,
      "[[TODO-OWNER: כמה דקות נמשכת 'הקלטה בתאים']]",
    ),
  },
  {
    id: "short-mix",
    title: "מיקס קצר",
    description: field<string>(
      null,
      "[[TODO-OWNER: מה קורה בשלב 'מיקס קצר' ובמה הילדים עסוקים בזמן הזה]]",
    ),
    minutes: field<number>(
      null,
      "[[TODO-OWNER: כמה דקות נמשך 'מיקס קצר']]",
    ),
  },
  {
    id: "group-listening",
    title: "האזנה משותפת",
    description: field<string>(
      null,
      "[[TODO-OWNER: מה קורה בשלב 'האזנה משותפת']]",
    ),
    minutes: field<number>(
      null,
      "[[TODO-OWNER: כמה דקות נמשכת 'האזנה משותפת']]",
    ),
  },
];

/** האורך הכולל של האירוע, בשעות. מקור: הבקשה ("בשעתיים"). */
export const KIDS_BIRTHDAY_DURATION_LABEL = "שעתיים";

export const KIDS_BIRTHDAY = {
  /** לאיזה גיל, בניסוח חופשי של הבעלים (למשל "גילאי 6 עד 12") */
  ageRange: field<string>(
    null,
    "[[TODO-OWNER: לאיזה טווח גילאים מתאים יום ההולדת, בניסוח שלך]]",
  ),
  /** מינימום ילדים לאירוע. כשהוא מולא, הטופס חוסם הזמנה מתחתיו. */
  minChildren: field<number>(
    null,
    "[[TODO-OWNER: מינימום ילדים לאירוע, מספר]]",
  ),
  /** מקסימום ילדים לאירוע. כשהוא מולא, הטופס חוסם הזמנה מעליו. */
  maxChildren: field<number>(
    null,
    "[[TODO-OWNER: מקסימום ילדים לאירוע, מספר]]",
  ),
  /** מה כל ילד מקבל הביתה, פריט בכל שורה */
  takeHome: field<readonly string[]>(
    null,
    "[[TODO-OWNER: מה כל ילד מקבל הביתה, רשימה]]",
  ),
  /** מה ההורים צריכים להביא, פריט בכל שורה */
  parentsBring: field<readonly string[]>(
    null,
    "[[TODO-OWNER: מה ההורים צריכים להביא, רשימה]]",
  ),
  /**
   * מחיר. נשאר ריק בכוונה: הבעלים ימלא. ראו את הערת הקובץ על הקטלוג.
   */
  price: field<string>(
    null,
    "[[TODO-OWNER: מחיר יום ההולדת, כולל מה כלול ומה לא, ואם הוא למשפחה או לילד]]",
  ),
  /**
   * איפה האירוע מתקיים. בקוד יש כתובת של האולפן (lib/constants.ts:59,
   * עמק איילון 34, מודיעין מכבים רעות), אבל הבעלים לא אמר שיום ההולדת
   * מתקיים שם, ולכן היא לא מועתקת לכאן.
   */
  location: field<string>(
    null,
    "[[TODO-OWNER: איפה מתקיים יום ההולדת, כתובת או אזור. באולפן במודיעין או במקום אחר]]",
  ),
};

export type KidsBirthdayGalleryImage = {
  src: string;
  /** מה רואים בפועל בתמונה. לא מה שהיינו רוצים שיראו. */
  alt: string;
  width: number;
  height: number;
};

/**
 * גלריה. כאן רק תמונות אולפן והקלטה שכבר קיימות באתר (תיקיית
 * public/images/services/studio), ואף אחת מהן אינה מיום הולדת. ה-alt מתאר
 * מה שנראה בתמונה, ולכן אין בו "יום הולדת". הכותרת בעמוד היא "מהאולפן".
 * תמונות מיום הולדת אמיתי יתווספו כאן כשהבעלים יעלה אותן.
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

/**
 * מה מוצג ליד הגלריה עד שיעלו תמונות מיום הולדת אמיתי. כשהן הועלו ונוספו
 * למערך למעלה, מרוקנים את המחרוזת ("") והעמוד לא מציג את ההערה.
 */
export const KIDS_BIRTHDAY_GALLERY_TODO: string =
  "[[TODO-OWNER: להעלות תמונות מיום הולדת]]";

/* ---------- נגזרות: מה שמוצג בפועל, מחושב מהשדות למעלה ---------- */

export type KidsBirthdayLimits = {
  min: number | null;
  max: number | null;
};

export function getKidsBirthdayLimits(): KidsBirthdayLimits {
  return {
    min: KIDS_BIRTHDAY.minChildren.value,
    max: KIDS_BIRTHDAY.maxChildren.value,
  };
}

/** משפט על טווח הילדים, או null כשחסר מינימום או מקסימום */
export function describeChildrenRange(limits: KidsBirthdayLimits): string | null {
  const { min, max } = limits;
  if (min === null || max === null) return null;
  return `מינימום ${min} ילדים, מקסימום ${max}.`;
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
 * שאלות נפוצות. תשובה נכתבת רק מעובדה מוכרת: מהבקשה או משדה שהבעלים מילא.
 * שאלה בלי תשובה נשארת בעמוד עם סימון TODO ולא נכנסת ל-FAQPage ב-JSON-LD.
 */
export function buildKidsBirthdayFaqs(
  data: typeof KIDS_BIRTHDAY = KIDS_BIRTHDAY,
  stages: readonly KidsBirthdayStage[] = KIDS_BIRTHDAY_STAGES,
): KidsBirthdayFaq[] {
  const stageTitles = stages.map((s) => s.title);
  const range = describeChildrenRange({
    min: data.minChildren.value,
    max: data.maxChildren.value,
  });
  const takeHome = data.takeHome.value;
  const parentsBring = data.parentsBring.value;

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
      id: "age",
      question: "לאיזה גיל זה מתאים?",
      answer: data.ageRange.value,
      todo: data.ageRange.todo,
    },
    {
      id: "children-count",
      question: "כמה ילדים צריך, וכמה אפשר?",
      answer: range,
      todo:
        data.minChildren.value === null
          ? data.minChildren.todo
          : data.maxChildren.todo,
    },
    {
      id: "take-home",
      question: "מה כל ילד מקבל הביתה?",
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
      answer: data.location.value,
      todo: data.location.todo,
    },
  ];
}

/** רק השאלות שיש להן תשובה, בצורה שמתאימה ל-buildFaqSchema ול-faqs של ה-layout */
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
