import {
  STUDIO_ADDRESS_COORDINATION_NOTE,
  STUDIO_PARKING_NOTE,
} from "@/lib/constants";
import { podcastDualPrice } from "@/lib/data/podcast-calculator";
import { PODCAST_GRANDPA_EXAMPLE_VIDEO } from "@/lib/data/podcast-with-grandpa-page";
import { getExVat } from "@/lib/data/pricing-catalog";

/*
 * ראיון מוקלט עם בן משפחה מבוגר: מקור הנתונים היחיד של /studio/legacy-recording.
 *
 * מה נתן הבעלים: בבקשה מ-7.10.2026, ראיון מוקלט באולפן או בבית עם בן משפחה
 * מבוגר, עריכה לפרקים לפי נושאים, מוזיקת רקע עדינה, ואספקה כקובץ אודיו ערוך
 * ועוד נוסח כתוב. ב-8.10.2026 הוא ענה על רוב השאלות, וכל עובדה למטה נושאת
 * את מספר התשובה שלה ("B#", תשובת הבעלים 8.10.2026). בסבב הסינון מ-8.10.2026
 * הוסר כל פרט שלא נאמר במפורש או שאי אפשר לעמוד בו, והדף נשאר בלי סימוני
 * TODO. עובדה שתתווסף בעתיד, ועוד לא נמסרה, נכנסת כסימון TODO של הבעלים
 * (ראו "מה הוסר" בהמשך), ואסור להמציא אותה.
 *
 * איך ממלאים: חיפוש של סימן ה-TODO של הבעלים בקובץ הזה (הפקודה בתחתית ההערה),
 * והחלפת כל מחרוזת בערך האמיתי. אין צורך לגעת בעמוד או ברכיב. כשלא נשארת
 * שום מחרוזת כזו, LEGACY_RECORDING_READY הופך ל-true: העמוד נפתח לאינדוקס,
 * נכנס למפת האתר (app/sitemap.ts), ומופיעים הקישורים אליו מעמוד /studio
 * ומעמוד פודקאסט עם סבא וסבתא.
 *
 * למה מחרוזת ולא null: שער ה-grep של סימוני הבעלים סורק קוד מקור. ערך null
 * שהסימון נבנה ממנו בזמן ריצה היה מציג TODO בעמוד החי בלי ש-grep יראה אותו.
 * כאן הסימון נמצא בקוד בדיוק כל עוד העובדה חסרה, ונעלם איתה.
 *
 * מחיר: אין מספר כתוב בקובץ. המחיר מוצג דרך אותה פונקציית קטלוג שמציגה את
 * מחיר פודקאסט עם סבא וסבתא (podcastDualPrice על podcast_audio), ולכן הוא
 * נגזר מ-pricing-catalog.ts ולא נכתב כאן (audit:price-literals).
 *
 * בדיקה: grep -rn "\[\[TODO-OWNER" app components lib public
 */

export const LEGACY_RECORDING_SLUG = "studio/legacy-recording";
export const LEGACY_RECORDING_PATH = `/${LEGACY_RECORDING_SLUG}`;

export const LEGACY_RECORDING_TITLE = "ראיון מוקלט עם בן משפחה מבוגר";

/* כותרת הדפדפן: 43 תווים ועוד סיומת המותג, כלומר בטווח 50-60 של הריפו */
export const LEGACY_RECORDING_META_TITLE =
  "ראיון מוקלט עם בן משפחה מבוגר, עם נוסח כתוב";

/* מילותיו של הבעלים, בסדר שלו: אולפן או בית, פרקים לפי נושאים, מוזיקת רקע
   עדינה, אודיו ערוך ונוסח כתוב. "במודיעין": האולפן שם (lib/constants.ts:58). */
export const LEGACY_RECORDING_DESCRIPTION =
  "ראיון מוקלט באולפן במודיעין או בבית עם בן משפחה מבוגר. עריכה לפרקים לפי נושאים, מוזיקת רקע עדינה, וקובץ אודיו ערוך עם נוסח כתוב.";

export const LEGACY_RECORDING_SUBTITLE =
  "שיחה מסודרת באולפן או בבית, שנערכת לפרקים לפי נושאים, עם מוזיקת רקע עדינה. מקבלים קובץ אודיו ערוך ונוסח כתוב.";

export const LEGACY_RECORDING_KEYWORDS = [
  "ראיון עם סבא",
  "ראיון משפחתי מוקלט",
  "תיעוד סיפורי חיים",
  "הקלטת סיפור חיים",
  "ראיון עם הורים מבוגרים",
] as const;

/* ───────────────────────── עובדות מתשובות הבעלים ───────────────────────── */

/*
 * מה הוסר ב-8.10.2026 ואיפה אפשר להחזיר (רק בהחלטת הבעלים, ובנוסח שלו):
 * - נוסח כתוב: סוג (תמלול מלא או ערוך), מי מכין, פורמט, שפה. היה
 *   LEGACY_OWNER_FACTS.writtenText וקופסת "איך הוא נוצר" ב-LEGACY_DELIVERABLES.
 * - שמירת עותק אצל העסק: שמירה בשרתים, משך שמירה ומחיקה (B15). היו
 *   LEGACY_OWNER_FACTS.recordingKeeping ו-retention, שורת "פרטיות והקלטות"
 *   ב-LEGACY_PRACTICAL_DETAILS והמשפטים בתשובת ה-FAQ "מי מקבל את הקבצים".
 * - וידאו: פורמט וידאו ושיטת מסירה שלו (B6). היו ב-LEGACY_OWNER_FACTS.fileFormat.
 * - נגישות: "האולפן נגיש" ו"גישה מלאה", היו ב-LEGACY_OWNER_FACTS.studioAccess.
 * - "וזה משתנה מראיון לראיון" (פירוש שלי ל-B4), היה ב-LEGACY_OWNER_FACTS.chapters.
 */

/**
 * מחיר, כפי שהבעלים קבע (B1): מחיר של פודקאסט רגיל לשעה, והתוספת היא הערך של
 * השאלות המיוחדות לסבא ולהשארת זיכרון. הסכום נגזר מהקטלוג, כמו בעמוד פודקאסט
 * עם סבא וסבתא (lib/data/podcast-with-grandpa-page.ts, שאלת "מה המחיר").
 * "עד שעה": scope של podcast_audio בקטלוג. הקלטה בבית במחירי האולפן הנייד (B8).
 */
const LEGACY_PRICE_TEXT = `המחיר הוא מחיר של פודקאסט אודיו רגיל של עד שעה: ${podcastDualPrice(getExVat("podcast_audio"), "page")}. מה שנוסף הוא הערך של השאלות המיוחדות לסבא ולהשארת זיכרון. הקלטה בבית: במחירי האולפן הנייד.`;

/**
 * כל ערך הוא טקסט כמו שהוא צריך להיקרא בעמוד (הערכים נכנסים למשפטים ולטבלה
 * כמות שהם). עובדה שחסרה נכתבת כשאלה ישירה לבעלים בתוך סימון TODO, וכל עוד
 * היא קיימת בקובץ הדף חסום לאינדוקס.
 */
export const LEGACY_OWNER_FACTS = {
  /* B1 */
  price: LEGACY_PRICE_TEXT,
  /* B2: "שעה, עד שעה, עם אפשרות לעריכה של פרק קצר מעניין" */
  interviewLength: "עד שעה, ואפשר גם לערוך פרק קצר ומעניין",
  /* B3 */
  editedFileLength: "בין 10 ל-40 דקות",
  /* B4: "המשפחה קובעת". "וזה משתנה" הוסר, כי הפירוש שלו לא ודאי */
  chapters: "המשפחה קובעת את חלוקת הנושאים",
  /* B5, "בדרך כלל" בהנחיית הבעלים 8.10.2026: אין התחייבות למועד. 11.10.2026
     (D99): ההקלטה הגולמית מיד בסוף הסשן, כמו בכל הקלטת פודקאסט (S1003-01) */
  deliveryTime: "בדרך כלל עד שלושה ימי עסקים",
  rawDelivery: "ההקלטה הגולמית אצלכם מיד בסוף הסשן",
  /* B6: אודיו בלבד. "דרופ" לא ברור (Dropbox או Drive), ולכן "קישור להורדה" */
  fileFormat: "קובץ אודיו ב-MP3 או ב-WAV, לפי הדרישה, שנשלח בקישור להורדה",
  /* B8 */
  homeVisit: "הקלטה בבית נעשית באולפן הנייד, עד הבית, במחירי האולפן הנייד",
  /* B9: רק "הכול בקומת קרקע". המשפט השני הוא נוסח הבעלים 8.10.2026, בלי הבטחה להתאמה */
  studioAccess:
    "הכול בקומת קרקע. אם יש צורך בהתאמה מיוחדת, אפשר לכתוב לנו מראש",
  /* B10 */
  interviewer: "בן משפחה מראיין",
  /* B11 */
  languages: "אפשר להקליט בעברית, באנגלית, ברוסית, בספרדית ובערבית",
  /* B13 לצד B12: "אפשר גם להוריד פדיחות ושתיקות" (בעריכה) */
  emotionalConduct:
    "אם בן המשפחה מתרגש ורוצה לעשות הפסקה, זה אפשרי בכיף. ובעריכה אפשר להוריד שתיקות ורגעים מביכים",
  /* B14. שום דבר על מה קורה עם העותק אצלנו (הבעלים 8.10.2026) */
  fileRecipients:
    "הקבצים מגיעים למי שיצר קשר עם יקיר, ואפשר להעביר את הקישור לכל המשפחה",
} satisfies Record<string, string>;

export type LegacyOwnerFactKey = keyof typeof LEGACY_OWNER_FACTS;

/*
 * זיהוי "עוד חסר". מכוון לא להכיל את מחרוזת הסימון המלאה, כדי ש-grep על
 * הסימון ימצא רק עובדות חסרות ולא את הקוד הזה.
 */
const OPEN_FACT_PREFIX = /^\[\[TODO/;

export function openLegacyFactKeys(
  facts: Readonly<Record<string, string>> = LEGACY_OWNER_FACTS,
): string[] {
  return Object.entries(facts)
    .filter(([, value]) => OPEN_FACT_PREFIX.test(value))
    .map(([key]) => key);
}

/* ───────────────────────── דוגמה מתיק העבודות ───────────────────────── */

/**
 * B16: "יש פודקאסט עם סבא, אפשר להקיש את זה מתיק עבודות. דרך יוטיוב."
 * הסרטון הוא של עמוד פודקאסט עם סבא וסבתא ושל פלייליסט podcast-hub בתיק
 * העבודות (lib/data/video-catalog.overrides.ts). המזהה לא נכתב כאן שוב:
 * הוא מיובא, כך ש-scripts/check-videos.mjs בודק אותו פעם אחת.
 */
export const LEGACY_SAMPLE = {
  heading: "דוגמה מתיק העבודות",
  caption: "פודקאסט עם סבא או סבתא, מהאולפן.",
  video: PODCAST_GRANDPA_EXAMPLE_VIDEO,
} as const;

/* ───────────────────────── מוכנות לפרסום ───────────────────────── */

export const LEGACY_RECORDING_OPEN_FACT_KEYS = openLegacyFactKeys();

/**
 * true רק כשאין עובדה חסרה. עד אז העמוד חסום לאינדוקס (page.tsx), לא במפת
 * האתר (app/sitemap.ts), ואין אליו קישורים מעמוד /studio ומעמוד פודקאסט עם
 * סבא וסבתא, כדי ששום סימון TODO לא יגיע לגוגל או לגולש. תקדים בריפו:
 * VOICEOVER_YAKIR_WARM_READY ב-public/audio/README.md.
 */
export const LEGACY_RECORDING_READY =
  LEGACY_RECORDING_OPEN_FACT_KEYS.length === 0;

/* ───────────────────────── למה עכשיו ───────────────────────── */

/* ההנחיה לסעיף (הודעת המשימה): הסבר נעים ועובדתי, "שיחה שלא נעשתה נשארת בלי
   תיעוד" ו"זיכרונות מתפוררים עם הזמן" (הבעלים 11.10.2026: "מתפוררים"). בלי דחיפות, בלי הבטחה רגשית. */
export const LEGACY_WHY_NOW = [
  "בכל משפחה יש סיפורים שרק מי שחי אותם יודע לספר: איך הכירו, מאיפה הגיעו, איך נראו הבית והשכונה. סיפור שלא סופר בקול ובסדר נשאר בלי תיעוד.",
  "זיכרונות מתפוררים עם הזמן. שמות, תאריכים וסדר האירועים מיטשטשים. שיחה מוקלטת שומרת את הסיפור כפי שסופר, עם הקול והקצב של מי שסיפר אותו.",
  "אין כאן לחץ. כדאי לבחור זמן שנוח לבן המשפחה, ולא למהר. הסיבה לשוחח עכשיו פשוטה: שיחה שלא התקיימה לא משאירה אחריה כלום, ושיחה שהוקלטה אפשר לשמוע שוב.",
] as const;

/* ───────────────────────── איך מתכוננים ───────────────────────── */

/*
 * B12, בעריכה: "הדבר היחידי שצריך להכין זה את הזמן שלכם שלא תהיו לחוצים ושיהיה
 * לכם כיף. מעבר לזה שאלות אפשר לגזור ולקחת מכאן מהאתר, גם רעיונות גם שאלות
 * ולהגיע עם דף מסודר כדי לדעת בדיוק מה עושים בכל שלב ומה שואלים. אפשר גם
 * להוריד לכם פדיחות ושתיקות." "פדיחות" נכתב "רגעים מביכים".
 * B7: "אפשר לסרטט ביחד את השאלות, בוחרים המשפחה".
 * חמש עצות ההכנה הקודמות (לדבר מראש, שעה ערנית, תמונה או חפץ) הוסרו:
 * הבעלים אמר שהדבר היחיד להכין הוא הזמן.
 */
export const LEGACY_PREP_INTRO =
  "הדבר היחיד שצריך להכין הוא הזמן שלכם: שלא תהיו לחוצים, ושיהיה לכם כיף.";

export const LEGACY_PREP_TIPS = [
  "את השאלות אפשר לקחת מכאן, מהאתר: גם רעיונות וגם שאלות. אפשר גם לסרטט אותן ביחד, והמשפחה בוחרת.",
  "כדאי להגיע עם דף מסודר, כדי לדעת בדיוק מה עושים בכל שלב ומה שואלים.",
  "אם יש רגעים מביכים או שתיקות, בעריכה אפשר להוריד אותם.",
] as const;

/* ───────────────────────── 15 השאלות המוצעות ───────────────────────── */

/*
 * אושר על ידי הבעלים ב-8.10.2026 ("ראיתי אותן, הן נראות טוב"). תוכן עריכה
 * כללי, לא עובדה על העסק. כללי הניסוח: שאלות פתוחות ולא מובילות; לשון
 * שמתאימה לשאלה לאב, לאם, לסבא או לסבתא (צורות עבר וכינויי קניין, בלי פעלי
 * הווה מוטים); בלי בריאות, כסף, פוליטיקה או חרטות; השאלה על תקופות קשות
 * מתנה בנוחות של המרואיין.
 * סדר מחשבתי: ילדות, משפחה, נעורים ועבודה, זוגיות ובית, מקומות וזמנים,
 * תקופות קשות, ערכים ומסר לדורות הבאים.
 */
export type LegacyQuestionTopic = {
  id: string;
  title: string;
  questions: readonly string[];
};

export const LEGACY_QUESTION_TOPICS: readonly LegacyQuestionTopic[] = [
  {
    id: "childhood",
    title: "ילדות",
    questions: [
      "איפה גדלת, ואיך נראה יום רגיל בבית ילדותך?",
      "מה זכור לך מהמשחקים, מהחברים ומהמקומות שאהבת בילדות?",
    ],
  },
  {
    id: "family",
    title: "משפחה",
    questions: [
      "מי היו ההורים שלך, ומה לקחת מהם איתך לחיים?",
      "איזה סיפור משפחתי מספרים אצלכם שוב ושוב, ומה מצחיק או מרגש בו?",
    ],
  },
  {
    id: "youth-work",
    title: "נעורים ועבודה",
    questions: [
      "איך היו שנות הנעורים שלך, ומה חלמת אז לעשות בחיים?",
      "איך נראתה העבודה שעשית בחיים, בבית או מחוצה לו, ומה אהבת בה?",
      "איזה רגע של גאווה היית רוצה לספר עליו?",
    ],
  },
  {
    id: "love-home",
    title: "זוגיות ובית",
    questions: [
      "איך הכרת את בן או בת הזוג שלך, ומה זכור לך מהימים הראשונים?",
      "איך היה להקים בית משלך, ואיזה רגע מהתקופה ההיא נשאר איתך?",
    ],
  },
  {
    id: "places-times",
    title: "מקומות וזמנים",
    questions: [
      "באילו מקומות חיית לאורך השנים, ומה היה מיוחד בכל אחד מהם?",
      "איך נראה העולם בצעירותך, ומה מתוכו חסר לך היום?",
    ],
  },
  {
    id: "hard-times",
    title: "תקופות קשות",
    questions: [
      "היו בחיים גם תקופות קשות. אם נוח לך לספר, מה עזר לך להמשיך?",
    ],
  },
  {
    id: "values-message",
    title: "ערכים ומסר",
    questions: [
      "מה למדת בחיים שהיית רוצה להעביר לדורות הבאים?",
      "איזה ערך או הרגל ליווה אותך כל השנים, ומאיפה הוא הגיע?",
      "איזה משפט היית רוצה שבני המשפחה, גם אלה שעוד לא נולדו, ישמעו ממך?",
    ],
  },
];

export const LEGACY_QUESTIONS_COUNT = LEGACY_QUESTION_TOPICS.reduce(
  (sum, topic) => sum + topic.questions.length,
  0,
);

export const LEGACY_QUESTIONS_NOTE =
  "אלה הצעות בלבד. אפשר לדלג על כל שאלה, לענות בקצרה או להרחיב, לשנות ניסוח ולהוסיף שאלות משלכם. הנוסח מתאים לשאלה לאבא, לאמא, לסבא או לסבתא.";

/**
 * הקובץ להורדה. נוצר מהנתונים שלמעלה ב-scripts/generate-legacy-questions-pdf.ts,
 * ולכן הרשימה בעמוד והרשימה ב-PDF לא יכולות להתפצל.
 * המאפיין נקרא path ולא href בכוונה: scripts/audit-links.mjs קורא כל
 * "href: /..." כקישור פנימי ומחפש לו page.tsx.
 * sizeBytes ו-pages נבדקים מול הקובץ בפועל ב-legacy-recording.test.ts.
 */
export const LEGACY_QUESTIONS_PDF = {
  path: "/downloads/legacy-interview-questions.pdf",
  /** שם הקובץ כפי שיישמר אצל המשתמש (מאפיין download) */
  downloadName: "שאלות-לראיון-משפחתי.pdf",
  sizeBytes: 47237,
  pages: 2,
} as const;

/* ───────────────────────── מה מקבלים ───────────────────────── */

export type LegacyDeliverable = {
  id: string;
  title: string;
  body: string;
  details: readonly { label: string; value: string }[];
};

export const LEGACY_DELIVERABLES: readonly LegacyDeliverable[] = [
  {
    id: "audio",
    title: "קובץ אודיו ערוך",
    /* המילים של הבעלים: עריכה לפרקים לפי נושאים, מוזיקת רקע עדינה */
    body: "הראיון נערך לפרקים לפי נושאים, עם מוזיקת רקע עדינה.",
    details: [
      { label: "חלוקה לפרקים", value: LEGACY_OWNER_FACTS.chapters },
      { label: "פורמט ומסירה", value: LEGACY_OWNER_FACTS.fileFormat },
    ],
  },
  {
    id: "text",
    title: "נוסח כתוב",
    /* המילים של הבעלים: "פלוס נוסח כתוב". בלי פרטים נוספים, בכוונה (8.10.2026) */
    body: "לצד האודיו מתקבל נוסח כתוב של הראיון.",
    details: [],
  },
];

/* ───────────────────────── פרטים מעשיים ───────────────────────── */

export type LegacyPracticalRow = {
  label: string;
  value: string;
  /** קישור שקט בסוף השורה. הנתיבים קיימים, ו-audit:links בודק אותם */
  link?: { href: string; label: string };
};

export const LEGACY_PRACTICAL_DETAILS: readonly LegacyPracticalRow[] = [
  {
    label: "איפה",
    value: `באולפן במודיעין או בבית של המשפחה. ${STUDIO_ADDRESS_COORDINATION_NOTE}.`,
  },
  {
    label: "הקלטה בבית",
    value: LEGACY_OWNER_FACTS.homeVisit,
    link: { href: "/studio/mobile-studio", label: "לעמוד האולפן הנייד" },
  },
  { label: "נגישות האולפן", value: LEGACY_OWNER_FACTS.studioAccess },
  { label: "מי מראיין", value: LEGACY_OWNER_FACTS.interviewer },
  { label: "שפות", value: LEGACY_OWNER_FACTS.languages },
  { label: "ההקלטה הגולמית", value: "מיד בסוף הסשן" },
  { label: "הקובץ הערוך", value: LEGACY_OWNER_FACTS.deliveryTime },
  {
    label: "מחיר",
    value: LEGACY_OWNER_FACTS.price,
    link: {
      href: "/podcast/podcast-with-grandpa",
      label: "לעמוד פודקאסט עם סבא וסבתא",
    },
  },
];

/* ───────────────────────── שאלות ותשובות ───────────────────────── */

export type LegacyFaq = { id: string; question: string; answer: string };

/*
 * כל תשובה בנויה רק מעובדה שנמסרה (תשובות הבעלים 8.10.2026, או קבוע בריפו עם
 * מקור) או מסימון חסר. סימון חסר נכנס גם לסכמת FAQPage כי הסכמה חייבת להתאים
 * לטקסט הגלוי, והשער שחוסם TODO לפני פריסה הוא זה שמונע ממנו להגיע לאתר החי.
 * lib/constants.ts:66-73: נוסח הכתובת והחניה שהבעלים אישר ב-4.10.2026.
 */
export const LEGACY_FAQS: readonly LegacyFaq[] = [
  {
    id: "where",
    question: "איפה מקליטים?",
    answer: `באולפן במודיעין או בבית של המשפחה. ${STUDIO_ADDRESS_COORDINATION_NOTE}. לגבי חניה באולפן: ${STUDIO_PARKING_NOTE}. נגישות האולפן: ${LEGACY_OWNER_FACTS.studioAccess}. ${LEGACY_OWNER_FACTS.homeVisit}.`,
  },
  {
    id: "length",
    question: "כמה זמן זה לוקח?",
    answer: `אורך הראיון: ${LEGACY_OWNER_FACTS.interviewLength}. אורך טיפוסי של הקובץ הערוך: ${LEGACY_OWNER_FACTS.editedFileLength}. ${LEGACY_OWNER_FACTS.rawDelivery}. זמן האספקה לקובץ הערוך ולנוסח הכתוב: ${LEGACY_OWNER_FACTS.deliveryTime}.`,
  },
  {
    id: "price",
    question: "כמה זה עולה?",
    answer: `${LEGACY_OWNER_FACTS.price}`,
  },
  {
    id: "emotion",
    question: "מה אם בן המשפחה מתרגש או שוכח?",
    answer: `זה טבעי להתרגש כשמספרים על החיים, וגם לשכוח שם או תאריך. ${LEGACY_OWNER_FACTS.emotionalConduct}.`,
  },
  {
    id: "files",
    question: "מי מקבל את הקבצים?",
    answer: `מה שמתקבל הוא קובץ אודיו ערוך ונוסח כתוב. ${LEGACY_OWNER_FACTS.fileRecipients}.`,
  },
  {
    id: "questions",
    question: "אפשר לקבל את השאלות מראש?",
    answer: `כן. בדף יש רשימה של ${LEGACY_QUESTIONS_COUNT} שאלות מוצעות, להורדה כקובץ PDF. כדאי לתת אותה לבן המשפחה מראש, ולהגיד לו שאין חובה לענות על כולן ושאפשר להוסיף שאלות משלו.`,
  },
];

/* ───────────────────────── קריאה אחת, שקטה ───────────────────────── */

export const LEGACY_CTA = {
  heading: "אם יש שאלות",
  body: "אפשר לכתוב או להתקשר ולשאול, לפני שמחליטים משהו.",
  whatsappLabel: "לכתוב בוואטסאפ",
  whatsappText: `שלום, אשמח לשמוע על ${LEGACY_RECORDING_TITLE}`,
  utmCampaign: "legacy_recording_cta",
} as const;
