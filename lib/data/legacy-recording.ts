import {
  STUDIO_ADDRESS_COORDINATION_NOTE,
  STUDIO_PARKING_NOTE,
} from "@/lib/constants";

/*
 * ראיון מוקלט עם בן משפחה מבוגר: מקור הנתונים היחיד של /studio/legacy-recording.
 *
 * מה נתן הבעלים (בקשה מ-7.10.2026): ראיון מוקלט באולפן או בבית עם בן משפחה
 * מבוגר, עריכה לפרקים לפי נושאים, מוזיקת רקע עדינה, ואספקה כקובץ אודיו ערוך
 * ועוד נוסח כתוב. כל השאר הוא עובדה שלא נמסרה, ולכן אסור להמציא אותה.
 *
 * איך ממלאים: חיפוש של סימן ה-TODO של הבעלים בקובץ הזה (הפקודה בתחתית ההערה),
 * והחלפת כל מחרוזת בערך האמיתי. אין צורך לגעת בעמוד או ברכיב. כשלא נשארת
 * שום מחרוזת כזו, וקיימת דוגמת אודיו, LEGACY_RECORDING_READY הופך ל-true:
 * העמוד נפתח לאינדוקס ונכנס למפת האתר (app/sitemap.ts).
 *
 * למה מחרוזת ולא null: שער ה-grep של סימוני הבעלים סורק קוד מקור. ערך null
 * שהסימון נבנה ממנו בזמן ריצה היה מציג TODO בעמוד החי בלי ש-grep יראה אותו.
 * כאן הסימון נמצא בקוד בדיוק כל עוד העובדה חסרה, ונעלם איתה.
 *
 * מחיר: אין ואין מספר. אם הבעלים יחליט על מחיר, הוא נכנס ל-pricing-catalog.ts
 * ולא לכאן (הכלל ב-.cursor/rules/yakircohen-project.mdc, "All new prices").
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

/* ───────────────────────── עובדות שהבעלים עוד לא נתן ───────────────────────── */

/**
 * כל ערך הוא שאלה ישירה לבעלים בתוך סימון. מחליפים אותו בתשובה כמו שהיא
 * צריכה להיקרא בעמוד, כי הערכים נכנסים למשפטים ולטבלה כמות שהם:
 * "הראיון הטיפוסי נמשך כשעה" ולא "אורך הראיון: כשעה".
 */
export const LEGACY_OWNER_FACTS = {
  price:
    "[[TODO-OWNER: מחיר השירות ואיך הוא נקבע. בלי מספר בעמוד עד שהבעלים מחליט, ואם יוחלט: להכניס ל-lib/data/pricing-catalog.ts ולהציג משם]]",
  interviewLength:
    "[[TODO-OWNER: אורך טיפוסי של הראיון עצמו, בדקות או בשעות]]",
  editedFileLength:
    "[[TODO-OWNER: אורך טיפוסי של קובץ האודיו הערוך שמתקבל]]",
  chapters:
    "[[TODO-OWNER: כמה פרקים בדרך כלל, ומי קובע את חלוקת הנושאים]]",
  deliveryTime:
    "[[TODO-OWNER: זמן אספקה מיום הראיון ועד קבלת הקובץ הערוך והנוסח הכתוב]]",
  fileFormat:
    "[[TODO-OWNER: פורמט קובץ האודיו (למשל MP3 או WAV) ואיך הוא נמסר]]",
  writtenText:
    "[[TODO-OWNER: איך נוצר הנוסח הכתוב: תמלול מלא או נוסח ערוך, מי מכין אותו, ובאיזה פורמט הוא נמסר]]",
  homeVisit:
    "[[TODO-OWNER: הקלטה בבית: באילו אזורים מגיעים, מה מביאים, תוספת הגעה, והאם זה האולפן הנייד (/studio/mobile-studio) או שירות נפרד]]",
  studioAccess:
    "[[TODO-OWNER: נגישות האולפן לבן משפחה מבוגר: מדרגות, מעלית, כיסא גלגלים]]",
  interviewer:
    "[[TODO-OWNER: מי מראיין: יקיר, בן משפחה בהנחיה, או שילוב]]",
  languages: "[[TODO-OWNER: באילו שפות מקליטים]]",
  preparation:
    "[[TODO-OWNER: מה צריך להכין בפועל לפני יום הראיון לפי התהליך אצלכם: תיאום, הגעה, מה להביא]]",
  emotionalConduct:
    "[[TODO-OWNER: מה קורה בפועל כשבן המשפחה מתרגש או שוכח: האם עוצרים וחוזרים, מי מנחה את השיחה, מה נחתך בעריכה]]",
  fileRecipients:
    "[[TODO-OWNER: מי מקבל את הקבצים (איש קשר אחד או כל המשפחה) ובאיזו דרך]]",
  recordingKeeping:
    "[[TODO-OWNER: פרטיות: מי שומר עותק של ההקלטה, לכמה זמן, ומה עושים אם מבקשים למחוק]]",
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

/* ───────────────────────── דוגמת אודיו ───────────────────────── */

export type LegacyAudioSample = {
  /** נתיב תחת /audio. קובץ MP3 של 20-60 שניות עד 2MB (public/audio/README.md) */
  src: string;
  title: string;
  durationSeconds: number;
  /** תמלול הדוגמה, לנגישות. חובה כשיש קובץ */
  transcript: string;
};

/**
 * null עד שיש הקלטה אמיתית בהסכמת המרואיינים. אין מייצרים דוגמה, ואין
 * רושמים כאן קובץ שלא קיים (audit:audio-demos נכשל על הפניה שבורה).
 * כשהקובץ מוכן: להציב כאן את האובייקט, ולמחוק את LEGACY_AUDIO_SAMPLE_TODO.
 * הנגן הוא <audio> מקורי ולא MicroAudioAudition: הרכיב ההוא קורא מ-
 * lib/data/audio-demos.ts, ושם audit:audio-demo-coverage אוסר רשומה בלי
 * קבצי אודיו אמיתיים.
 */
export const LEGACY_AUDIO_SAMPLE = null as LegacyAudioSample | null;

export const LEGACY_AUDIO_SAMPLE_TODO =
  "[[TODO-OWNER: קובץ אודיו קצר של ראיון, עד 30-60 שניות, בהסכמת המרואיינים]]";

/* ───────────────────────── מוכנות לפרסום ───────────────────────── */

export const LEGACY_RECORDING_OPEN_FACT_KEYS = openLegacyFactKeys();

/**
 * true רק כשאין עובדה חסרה ויש דוגמת אודיו. עד אז העמוד חסום לאינדוקס
 * (page.tsx) ולא במפת האתר (app/sitemap.ts), כדי ששום סימון TODO לא יגיע
 * לגוגל. תקדים בריפו: VOICEOVER_YAKIR_WARM_READY ב-public/audio/README.md.
 */
export const LEGACY_RECORDING_READY =
  LEGACY_RECORDING_OPEN_FACT_KEYS.length === 0 && LEGACY_AUDIO_SAMPLE !== null;

/* ───────────────────────── למה עכשיו ───────────────────────── */

/* ההנחיה לסעיף (הודעת המשימה): הסבר נעים ועובדתי, "שיחה שלא נעשתה נשארת בלי
   תיעוד" ו"זיכרונות מתפרטים עם הזמן". בלי דחיפות, בלי הבטחה רגשית. */
export const LEGACY_WHY_NOW = [
  "בכל משפחה יש סיפורים שרק מי שחי אותם יודע לספר: איך הכירו, מאיפה הגיעו, איך נראו הבית והשכונה. סיפור שלא סופר בקול ובסדר נשאר בלי תיעוד.",
  "זיכרונות מתפרטים עם הזמן. שמות, תאריכים וסדר האירועים מיטשטשים. שיחה אחת מסודרת, שמקליטים ומקשיבים בה עד הסוף, שומרת את הסיפור כפי שסופר, עם הקול והקצב של מי שסיפר אותו.",
  "אין כאן לחץ. כדאי לבחור זמן שנוח לבן המשפחה, ולא למהר. הסיבה לשוחח עכשיו פשוטה: שיחה שלא התקיימה לא משאירה אחריה כלום, ושיחה שהתקיימה נשארת לכל מי שירצה לשמוע אותה אחר כך.",
] as const;

/* ───────────────────────── איך מתכוננים ───────────────────────── */

/* עצות עריכה כלליות להכנת בן משפחה לשיחה. אינן עובדות על השירות ואינן
   הבטחות. טיוטה לאישור הבעלים. */
export const LEGACY_PREP_INTRO =
  "כמה דברים שעוזרים לבן המשפחה להגיע לשיחה רגוע. אין חובה לעשות אף אחד מהם.";

export const LEGACY_PREP_TIPS = [
  "לדבר איתו מראש ולוודא שהוא רוצה בכך. זה הראיון שלו, וחשוב שיהיה לו ברור מה עומד לקרות ולמה.",
  "להראות לו את רשימת השאלות, ולהגיד שאין חובה לענות על כולן.",
  "לבחור שעה ביום שבה הוא ערני ונינוח, ולא לדחוס את הראיון ללוח זמנים צפוף.",
  "לחשוב מראש על תמונה או חפץ שקשורים לסיפור. לפעמים תמונה אחת פותחת שיחה שלמה.",
  "להזכיר שאין תשובה נכונה ואין מבחן. שתיקה באמצע משפט היא חלק מהשיחה.",
] as const;

/* ───────────────────────── 15 השאלות המוצעות ───────────────────────── */

/*
 * טיוטה לאישור הבעלים. תוכן עריכה כללי, לא עובדה על העסק.
 * כללי הניסוח: שאלות פתוחות ולא מובילות; לשון שמתאימה לשאלה לאב, לאם, לסבא
 * או לסבתא (צורות עבר וכינויי קניין, בלי פעלי הווה מוטים); בלי בריאות, כסף,
 * פוליטיקה או חרטות; השאלה על תקופות קשות מתנה בנוחות של המרואיין.
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

export const LEGACY_DELIVERABLES = [
  {
    id: "audio",
    title: "קובץ אודיו ערוך",
    /* המילים של הבעלים: עריכה לפרקים לפי נושאים, מוזיקת רקע עדינה */
    body: "הראיון נערך לפרקים לפי נושאים, עם מוזיקת רקע עדינה.",
    details: [
      { label: "מספר פרקים", value: LEGACY_OWNER_FACTS.chapters },
      { label: "פורמט ומסירה", value: LEGACY_OWNER_FACTS.fileFormat },
    ],
  },
  {
    id: "text",
    title: "נוסח כתוב",
    /* המילים של הבעלים: "פלוס נוסח כתוב" */
    body: "לצד האודיו מתקבל נוסח כתוב של הראיון.",
    details: [{ label: "איך הוא נוצר", value: LEGACY_OWNER_FACTS.writtenText }],
  },
] as const;

/* ───────────────────────── פרטים מעשיים ───────────────────────── */

export const LEGACY_PRACTICAL_DETAILS = [
  {
    label: "איפה",
    value: `באולפן במודיעין או בבית של המשפחה. ${STUDIO_ADDRESS_COORDINATION_NOTE}.`,
  },
  { label: "הקלטה בבית", value: LEGACY_OWNER_FACTS.homeVisit },
  { label: "נגישות האולפן", value: LEGACY_OWNER_FACTS.studioAccess },
  { label: "מי מראיין", value: LEGACY_OWNER_FACTS.interviewer },
  { label: "שפות", value: LEGACY_OWNER_FACTS.languages },
  { label: "זמן אספקה", value: LEGACY_OWNER_FACTS.deliveryTime },
  { label: "פרטיות והקלטות", value: LEGACY_OWNER_FACTS.recordingKeeping },
  { label: "מחיר", value: LEGACY_OWNER_FACTS.price },
] as const;

/* ───────────────────────── שאלות ותשובות ───────────────────────── */

export type LegacyFaq = { id: string; question: string; answer: string };

/*
 * כל תשובה בנויה רק מעובדה שנמסרה (בקשת הבעלים, או קבוע בריפו עם מקור) או
 * מסימון חסר. סימון חסר נכנס גם לסכמת FAQPage כי הסכמה חייבת להתאים לטקסט
 * הגלוי, והשער שחוסם TODO לפני פריסה הוא זה שמונע ממנו להגיע לאתר החי.
 * lib/constants.ts:66-73: נוסח הכתובת והחניה שהבעלים אישר ב-4.10.2026.
 */
export const LEGACY_FAQS: readonly LegacyFaq[] = [
  {
    id: "where",
    question: "איפה מקליטים?",
    answer: `באולפן במודיעין או בבית של המשפחה. ${STUDIO_ADDRESS_COORDINATION_NOTE}. לגבי חניה באולפן: ${STUDIO_PARKING_NOTE}. הקלטה בבית: ${LEGACY_OWNER_FACTS.homeVisit}. נגישות האולפן: ${LEGACY_OWNER_FACTS.studioAccess}.`,
  },
  {
    id: "length",
    question: "כמה זמן זה לוקח?",
    answer: `הראיון הטיפוסי נמשך ${LEGACY_OWNER_FACTS.interviewLength}. הקובץ הערוך והנוסח הכתוב מגיעים תוך ${LEGACY_OWNER_FACTS.deliveryTime}.`,
  },
  {
    id: "emotion",
    question: "מה אם בן המשפחה מתרגש או שוכח?",
    answer: `זה טבעי להתרגש כשמספרים על החיים, וגם לשכוח שם או תאריך. מה שעוזר: לא למהר, לחזור לשאלה בהמשך, ולדלג על מה שקשה. ${LEGACY_OWNER_FACTS.emotionalConduct}.`,
  },
  {
    id: "files",
    question: "מי מקבל את הקבצים?",
    answer: `מה שמתקבל הוא קובץ אודיו ערוך ונוסח כתוב. ${LEGACY_OWNER_FACTS.fileRecipients}. ${LEGACY_OWNER_FACTS.recordingKeeping}.`,
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
  body: "אפשר לכתוב או להתקשר ולשאול הכול, לפני שמחליטים משהו.",
  whatsappLabel: "לכתוב בוואטסאפ",
  whatsappText: `שלום, אשמח לשמוע על ${LEGACY_RECORDING_TITLE}`,
  utmCampaign: "legacy_recording_cta",
} as const;
