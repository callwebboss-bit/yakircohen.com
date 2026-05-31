export const SINGER_PAGE_HERO = {
  title: "מערכת סאונד לזמרים שמבינים שהופעה היא לא מבחן טכני",
  subtitle:
    "מיקרופון יקר לא יגרום לקהל להתרגש. מערכת מדויקת, כיוון נכון וסאונד מאוזן - כן.",
  ctaLabel: "בדיקת התאמה מהירה בוואטסאפ",
  features: [
    "הגברה מקצועית במודיעין והסביבה - תמיכה וגיבוי במרחק נגיעה",
    "צ'ק סאונד אמיתי – לא רק \"טסט טסט\"",
    "סאונד של אולפן על במת ההופעה שלכם",
  ] as const,
} as const;

export const SINGER_MISTAKES: readonly {
  title: string;
  description: string;
}[] = [
  {
    title: "ציוד יקר ומסורבל מדי",
    description:
      "יותר רמקולים לא תמיד אומרים סאונד נקי. לפעמים מערכת קומפקטית וממוקדת נשמעת הרבה יותר טוב – פחות הדים, פחות פידבקים, יותר שליטה.",
  },
  {
    title: "מיקרופון שלא מתאים לתדר הקול",
    description:
      "קונדנסר יקר לא מבטיח ווקאל חם. Shure SM58 סטנדרטי, כשהוא מכוון נכון, יכול להרעים את הקול שלכם יותר ממיקרופון שעולה פי ארבע – אם הוא לא מתאים לטמבר.",
  },
  {
    title: "ווליום גבוה מדי שחונק את הפלייבק",
    description:
      "המלחמה הקלאסית בין ווקאל לליווי: כשהרמקולים רועשים מדי, אתם לא שומעים את עצמכם, הקהל מתעייף, וההופעה נשברת באמצע.",
  },
  {
    title: "מוניטורינג שגוי",
    description:
      "כשהזמר לא שומע את עצמו במוניטור, הוא שר שטוח או גבוה מדי – והקהל מרגיש את זה מיד, גם בלי להבין למה.",
  },
  {
    title: "טכנאי שלא מבין הופעה חיה",
    description:
      "הציוד מקצועי, אבל המיקס חסר נשמה. הופעה חיה דורשת מישהו שמקשיב לזמר, לא רק מפעיל סליידרים.",
  },
] as const;

export type SingerEventGuideId =
  | "acoustic-small"
  | "medium-events"
  | "chuppa-private"
  | "full-live";

export const SINGER_EVENT_GUIDE: readonly {
  id: SingerEventGuideId;
  label: string;
  headline: string;
  description: string;
  gear: readonly string[];
  idealFor: string;
}[] = [
  {
    id: "acoustic-small",
    label: "אקוסטי / עד 50 איש",
    headline: "הגברה לאירועים קטנים – בלי להרגיש \"מערכת כבדה\"",
    description:
      "הופעה אינטימית, חדר סגור או חצר קטנה. המטרה: שהקול יישמע טבעי, לא מגובר.",
    gear: [
      "מיקרופון דינמי מחמיא (SM58 / Beta 58A)",
      "זוג רמקולים קומפקטיים + מיקסר קטן",
      "מוניטור אישי אחד לשמיעה מדויקת",
      "כיוון RTA לפני עלייה לבמה",
    ],
    idealFor: "זמר/ית סולו, דואט, הרכב אקוסטי, אירוע ביתי – מודיעין והסביבה",
  },
  {
    id: "medium-events",
    label: "בינוני / עד 200 איש",
    headline: "מערכת הגברה לזמרים באירועים בינוניים",
    description:
      "חופות, טקסים, אירועי חברה – כשיש קהל אמיתי אבל עדיין חשוב לשמור על איזון ווקאל-ליווי.",
    gear: [
      "2-3 מיקרופונים (כולל אלחוטי לחופה)",
      "4 רמקולי פרונט + סאב",
      "2-3 מוניטורים אישיים",
      "טכנאי FOH לאורך כל האירוע",
    ],
    idealFor: "זמרים, הרכבים קטנים, טקסים ואירועים בחצרות / אולמות בינוניים",
  },
  {
    id: "chuppa-private",
    label: "חינה / בר מצווה / פרטי",
    headline: "השכרת הגברה לזמר – עם דגש על רגעים רגישים",
    description:
      "בחופה ובטקסים, שנייה של שקט או פידבק באמצע משפט מרגש – זה מה שמפחיד. אנחנו בונים מערכת שמונעת את זה מראש.",
    gear: [
      "מיקרופון אלחוטי ייעודי לחופה / נאום",
      "מערכת טורית ממוקדת – פחות פידבקים",
      "גיבוי מיקרופון וכבלים מוכנים",
      "צ'ק סאונד לפני כניסת האורחים",
    ],
    idealFor: "חינות, בר/בת מצווה, אירועים משפחתיים, זמרים מלווים",
  },
  {
    id: "full-live",
    label: "הופעה חיה מלאה",
    headline: "מערכת סאונד להופעה – עם פלייבק או להקה",
    description:
      "כשיש להקה, IEM, ורמות דינמיות – צריך מערכת שלמה, לא רק \"רמקולים על במה\".",
    gear: [
      "Line Array / מערכת פרונט מלאה",
      "עד 6 מיקרופונים + IEM אופציונלי",
      "מיקסר 32 ערוצים + עיבוד דינמי",
      "2 טכנאים (FOH + מוניטורים)",
    ],
    idealFor: "להקות, מופעים עם פלייבק, קונצרטים, אירועים 300+ אורחים",
  },
] as const;

export const SINGER_AUDIO_BEFORE_AFTER = {
  heading:
    "מאחורי הקלעים: איך נשמע סאונד לא מכוון מול מערכת מלוטשת?",
  before: {
    src: "/audio/singer-live-raw.mp3",
    title: "סאונד גולמי (ללא איזון תדרים, סכנת פידבקים)",
    badge: "לפני",
  },
  after: {
    src: "/audio/singer-live-tuned.mp3",
    title: "סאונד אחרי אופטימיזציה וכיוון אקוסטי",
    badge: "אחרי",
  },
} as const;

export const SINGER_FEEDBACK_PREVENTION = {
  heading: "איך אנחנו מונעים 100% מהפידבקים באירוע שלכם?",
  body:
    "לפני שהזמר עולה לבמה, אנחנו מריצים ניתוח RTA (Real-Time Analyzer) – מזהים תדרים בעייתיים בחדר וחותכים אותם במיקסר עוד לפני ההופעה. לא \"נקווה לטוב\" – מודדים, מכוונים, ורק אז מתחילים.",
  bullets: [
    "סריקת חדר לפני הקהל נכנס",
    "כיוון EQ מבוסס מדידה, לא אוזן בלבד",
    "מיקום רמקולים שמצמצם הדים ופידבקים",
    "גיבוי מיקרופון מוכן – בלי הפסקות מביכות",
  ] as const,
} as const;

export const SINGER_LOCAL_SUPPORT = {
  heading: "ביטחון מקומי: היתרון של אולפן במודיעין",
  body:
    "זמרים והרכבים במודיעין, שוהם וישובי הסביבה לא צריכים לחכות לטכנאי שמגיע מתל אביב. אם כבל נקרע או מיקרופון מפסיק לעבוד – יש גיבוי פיזי במרחק נגיעה, ותמיכה טלפונית בזמן אמת.",
  areas: ["מודיעין", "שוהם", "מכבים-רעות", "בית שמש", "ראשון לציון", "המרכז"] as const,
} as const;

export const SINGER_STUDIO_SEAL = {
  heading: "סאונד של אולפן על במת ההופעה שלכם",
  body:
    "אלפי שעות באולפן הקלטות מלמדות איך הקול האנושי צריך להישמע ברמת המיקרון. אותה רמת דיוק – קומפרסיה עדינה, EQ מחמיא, איזון ווקאל-ליווי – מגיעה גם למערכת ההגברה החיה. הקהל לא ישמע \"רמקול חזק\". הוא ישמע אתכם כמו בדיסק.",
} as const;

export const SINGER_TECH_SPECS = {
  heading: "המפרט הטכני שמאחורי השקט שלכם על הבמה",
  note:
    "אתם לא צריכים להבין ברכיבים הללו. התפקיד שלנו הוא לחבר, לכוון ולהבטיח שהכל יעבוד חלק.",
} as const;

export const SINGER_CLOSING_CTA = {
  heading: "בואו נבנה את מערכת ההגברה שתפורה במדויק להופעה הבאה שלכם",
  body:
    "אל תנחשו איזה רמקול אתם צריכים. צרו קשר עכשיו לייעוץ קצר, ונבחר יחד את המערכת שתחמיא לקול שלכם.",
} as const;

export const SINGER_PAGE_FAQ: readonly { id: string; question: string; answer: string }[] = [
  {
    id: "delivery",
    question: "איך מתבצעת ההובלה וההקמה?",
    answer:
      "מגיעים לפחות שעתיים לפני האירוע, מקימים, בודקים, ומריצים צ'ק סאונד מלא. בסוף – פירוק ויציאה נקייה.",
  },
  {
    id: "setup",
    question: "האם צריך לדעת משהו טכני מראש?",
    answer:
      "לא. אתם מספרים לנו סוג אירוע, גודל קהל וסגנון – אנחנו בוחרים ומכוונים את הציוד. אתם מתמקדים בהופעה.",
  },
  {
    id: "modiin",
    question: "יש תמיכה מקומית במודיעין והסביבה?",
    answer:
      "כן – מבסיס במודיעין. מרכז ללא תוספת הובלה, וגיבוי ציוד במרחק קצר לאירועים דחופים.",
  },
  {
    id: "backup",
    question: "מה קורה אם ציוד נפגע באמצע?",
    answer:
      "מיקרופון גיבוי, כבלים נוספים, ומיקסר חלופי במקרה קיצון. טכנאי בשטח מחליף תוך שניות.",
  },
  {
    id: "wireless-chuppa",
    question: "אפשר מיקרופון אלחוטי לחופה?",
    answer:
      "בהחלט – זה חלק מההתאמה לחינות, בר/בת מצווה וטקסים. נבחר מיקרופון שמתאים לרגעים שקטים.",
  },
  {
    id: "band",
    question: "עובדים גם עם הרכבים מוזיקליים?",
    answer:
      "כן – מהרכב אקוסטי ועד להקה מלאה עם IEM. המחשבון באתר עוזר לאפיין את הצורך המדויק.",
  },
] as const;

/* ─── System builder (3-click widget) ─────────────────────────────────── */

export type SingerAudienceId = "small-indoor" | "medium-outdoor" | "large-hall";
export type SingerActId = "solo-playback" | "acoustic-band" | "speeches" | "full-band";
export type SingerExtraId = "wireless-chuppa" | "ambient-light" | "none";

export const SINGER_BUILDER_AUDIENCE: readonly {
  id: SingerAudienceId;
  label: string;
  detail: string;
}[] = [
  { id: "small-indoor", label: "עד 50 איש במקום סגור", detail: "אולם קטן, בית, חדר אירועים" },
  { id: "medium-outdoor", label: "עד 150 איש בחצר / גן", detail: "חופה, אירוע חוץ, חצר" },
  { id: "large-hall", label: "מעל 200 באולם", detail: "אולם גדול, קונצרט, אירוע רחב" },
] as const;

export const SINGER_BUILDER_ACT: readonly {
  id: SingerActId;
  label: string;
}[] = [
  { id: "solo-playback", label: "זמר/ית יחיד/ה עם פלייבק" },
  { id: "acoustic-band", label: "הרכב אקוסטי / קטן" },
  { id: "speeches", label: "נאומים, טקס וחופה" },
  { id: "full-band", label: "להקה מלאה / הופעה חיה" },
] as const;

export const SINGER_BUILDER_EXTRAS: readonly {
  id: SingerExtraId;
  label: string;
}[] = [
  { id: "wireless-chuppa", label: "מיקרופון אלחוטי לחופה / טקס" },
  { id: "ambient-light", label: "תאורת אווירה פשוטה" },
  { id: "none", label: "בלי תוספות – רק הגברה" },
] as const;

export type SingerBuilderRecommendation = {
  title: string;
  summary: string;
  highlights: readonly string[];
  suggestedPackageId: SingerPackageId;
};

export function getSingerBuilderRecommendation(
  audience: SingerAudienceId,
  act: SingerActId,
  extra: SingerExtraId,
): SingerBuilderRecommendation {
  if (act === "full-band" || audience === "large-hall") {
    return {
      title: "מערכת סאונד מלאה להופעה חיה",
      summary: "Line Array, מיקסר רב-ערוצי, IEM אופציונלי – עם 2 טכנאים בשטח.",
      highlights: [
        "עד 6 מיקרופונים + עיבוד דינמי",
        "מוניטורים / IEM לכל הנגנים",
        "צ'ק סאונד מורחב לפני הקהל",
        extra === "wireless-chuppa" ? "מיקרופון אלחוטי ייעודי לטקס" : "כיוון RTA מלא לפני עלייה לבמה",
      ],
      suggestedPackageId: "vip",
    };
  }

  if (act === "acoustic-band" || (audience === "medium-outdoor" && act !== "speeches")) {
    return {
      title: "מערכת פרימיום – ווקאל וליווי מאוזנים",
      summary: "4 רמקולים, 2-3 מוניטורים, מיקרופונים אלחוטיים – לשמירה על איזון הרכב.",
      highlights: [
        "3 מיקרופונים אלחוטיים Shure Beta 58A",
        "2 סאבים + מיקסר דיגיטלי",
        "טכנאי מנוסה לאורך כל האירוע",
        extra === "wireless-chuppa" ? "מיקרופון נוסף לחופה" : "מניעת פידבקים עם RTA",
      ],
      suggestedPackageId: "premium",
    };
  }

  if (act === "speeches" || extra === "wireless-chuppa") {
    return {
      title: "מערכת ממוקדת לטקסים וחופות",
      summary: "הגברה טורית שמונעת פידבקים, מיקרופון אלחוטי לרגעים שקטים, גיבוי מלא.",
      highlights: [
        "מיקרופון אלחוטי לחופה / נאום",
        "מערכת קומפקטית – פחות הדים",
        "צ'ק סאונד לפני כניסת האורחים",
        "גיבוי מיקרופון וכבלים מוכנים",
      ],
      suggestedPackageId: "basic",
    };
  }

  return {
    title: "מערכת בסיס מקצועי – אירוע קטן ומדויק",
    summary: "2 מיקרופונים, רמקולי פרונט + סאב, מוניטור אישי – סאונד נקי בלי עומס.",
    highlights: [
      "Shure SM58 + כיוון EQ מחמיא",
      "מוניטור אישי לשמיעה מדויקת",
      "RTA לפני עלייה לבמה",
      extra === "ambient-light" ? "תאורת אווירה בסיסית (בתיאום)" : "הקמה, צ'ק ופירוק מלאים",
    ],
    suggestedPackageId: "basic",
  };
}

export const SINGER_WHY_BLOCKS: readonly {
  emoji: string;
  title: string;
  description: string;
  bullets?: readonly string[];
}[] = [
  {
    emoji: "🛡️",
    title: "גיבוי לכל מקרה",
    description: "הופעה לא סובלת טעויות – ציוד גיבוי וטכנאי שפותר תוך שניות.",
    bullets: [
      "מיקרופון גיבוי מוכן ומחובר",
      "כבלים נוספים",
      "מיקסר חלופי במקרה קיצון",
    ],
  },
  {
    emoji: "⏱️",
    title: "צ'ק סאונד אמיתי",
    description: "30-45 דקות – לא \"טסט טסט\". עד שמרגישים מוכנים.",
    bullets: [
      "רמות, EQ, קומפרסור",
      "התאמת מוניטורים",
      "איזון ווקאל מול ליווי",
      "תיקונים עד נוחות מלאה",
    ],
  },
  {
    emoji: "💎",
    title: "ציוד מקצועי",
    description: "Shure SM58 / Beta 58A, EV RE20, מוניטורים, RCF, Allen & Heath.",
  },
  {
    emoji: "🎯",
    title: "שירות מלא",
    description: "לא רק רמקולים – טכנאי לאורך כל ההופעה.",
    bullets: [
      "הקמה מלאה",
      "צ'ק סאונד מקצועי",
      "התאמות אישיות",
      "פתרון מיידי לכל בעיה",
    ],
  },
] as const;

export type SingerPackageId = "basic" | "premium" | "vip";

export const SINGER_PACKAGES: readonly {
  id: SingerPackageId;
  name: string;
  price: string;
  badge?: string;
  includes: readonly string[];
  suitedFor: string;
}[] = [
  {
    id: "basic",
    name: "חבילה 1: בסיס מקצועי",
    price: "2,800 ₪",
    badge: "פופולרי",
    includes: [
      "2 מיקרופונים Shure SM58",
      "זוג רמקולי RCF פרונט (500W)",
      "סאב RCF 15 אינץ׳",
      "מיקסר Allen & Heath אנלוגי",
      "מוניטור אישי אחד",
      "טכנאי לאורך ההופעה",
      "צ'ק סאונד 30 דקות",
      "הובלה, הקמה ופירוק",
    ],
    suitedFor: "סולו/דואט, עד 150 אורחים",
  },
  {
    id: "premium",
    name: "חבילה 2: פרימיום",
    price: "5,800 ₪",
    includes: [
      "3 מיקרופונים אלחוטיים Shure Beta 58A",
      "4 רמקולי RCF פרונט",
      "2 סאבים RCF",
      "מיקסר דיגיטלי + אפקטים",
      "2-3 מוניטורים אישיים",
      "טכנאי מנוסה",
      "צ'ק סאונד 45 דקות",
      "הובלה, הקמה ופירוק",
    ],
    suitedFor: "להקה 3-4, עד 350 אורחים",
  },
  {
    id: "vip",
    name: "חבילה 3: VIP",
    price: "7,800 ₪",
    includes: [
      "עד 6 מיקרופונים (Shure + EV RE20)",
      "Line Array RCF HDL6-A",
      "4 סאבים",
      "מיקסר 32 ערוצים + עיבוד דינמי",
      "IEM או מוניטורים לכולם",
      "2 טכנאים (FOH + מוניטורים)",
      "צ'ק סאונד שעה+",
      "אופציה להקלטה מהמיקסר",
      "הובלה, הקמה ופירוק",
    ],
    suitedFor: "להקות גדולות, 300+ אורחים, קונצרטים",
  },
] as const;

export const SINGER_ADDONS: readonly { name: string; price: string }[] = [
  { name: "מיקרופון נוסף", price: "150 ₪" },
  { name: "מוניטור אישי נוסף", price: "200 ₪" },
  { name: "שליטה מרחוק על המיקס (אפליקציה)", price: "300 ₪" },
  { name: "הקלטת ההופעה מהמיקסר", price: "500 ₪" },
  { name: "שעות נוספות", price: "300 ₪/שעה" },
] as const;

export const SINGER_PROCESS: readonly {
  step: string;
  title: string;
  description: string;
}[] = [
  {
    step: "01",
    title: "שיחת תיאום",
    description: "מיקום, קהל, סגנון, דרישות – הצעת מחיר מדויקת.",
  },
  {
    step: "02",
    title: "הזמנה ואישור",
    description: "מקדמה 30% לשריון תאריך, יתרה ביום ההופעה.",
  },
  {
    step: "03",
    title: "הגעה והקמה",
    description: "לפחות שעתיים לפני – הקמה ובדיקות.",
  },
  {
    step: "04",
    title: "צ'ק סאונד",
    description: "30-60 דקות לפני – עד שמרגישים מוכנים.",
  },
  {
    step: "05",
    title: "ההופעה + פירוק",
    description: "טכנאי בשטח כל הזמן, פירוק בסוף.",
  },
] as const;

export const SINGER_VALUE_POINTS: readonly string[] = [
  "ראש שקט – הכול עובד, מתמקדים בהופעה",
  "מקצועיות – טכנאי שיודע, לא חובבן",
  "ציוד אמין – Shure, RCF, Allen & Heath",
  "גיבוי – פתרון תוך שניות",
  "איכות סאונד – נשמעים כמו שצריך",
] as const;

export const SINGER_TRAVEL_NOTE =
  "מרכז – ללא תוספת · צפון +300 ₪ · דרום +500 ₪ (מבסיס מודיעין)";
