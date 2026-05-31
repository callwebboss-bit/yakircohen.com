export type RecordingTypeId =
  | "cover"
  | "original"
  | "bride_blessing"
  | "bar_mitzvah_speech"
  | "general_blessing"
  | "voiceover"
  | "song_promotion_consultation"
  | "other";

export type AtmosphereId = "intimate" | "party" | "focused";

export type StudioPackageId =
  | "remote"
  | "classic"
  | "pro"
  | "viral"
  | "all_in";

export type StudioUpgradeId =
  | "bts"
  | "performance_clip"
  | "podcast_interview"
  | "photo_pack"
  | "express"
  | "ai_playback"
  | "vocal_coaching"
  | "family_duet";

export const RECORDING_TYPES: readonly {
  id: RecordingTypeId;
  label: string;
}[] = [
  { id: "cover", label: "שיר קאבר" },
  { id: "original", label: "שיר מקורי (סינגל)" },
  { id: "bride_blessing", label: "ברכת כלה" },
  { id: "bar_mitzvah_speech", label: "דרשה לבר/בת מצווה" },
  { id: "general_blessing", label: "ברכות כלליות" },
  { id: "voiceover", label: "קריינות" },
  { id: "song_promotion_consultation", label: "ייעוץ לקידום שיר ברשת" },
  { id: "other", label: "אחר" },
] as const;

export type ConsultationPackageId = "consultation_phone" | "consultation_inperson";

export const CONSULTATION_PACKAGES: readonly {
  id: ConsultationPackageId;
  emoji: string;
  name: string;
  description: string;
  price: number;
  badge?: string;
}[] = [
  {
    id: "consultation_phone",
    emoji: "📱",
    name: "ייעוץ טלפוני",
    description: "שיחת ייעוץ של 45 דקות — אסטרטגיה לקידום השיר ברשתות החברתיות",
    price: 400,
  },
  {
    id: "consultation_inperson",
    emoji: "🤝",
    name: "ייעוץ פרונטלי",
    description: "פגישה של שעה באולפן — תכנית פרסום מלאה, מדדי הצלחה ועצות מעשיות · בתיאום מראש",
    price: 980,
    badge: "מומלץ",
  },
] as const;

export const RECORDING_STUDIO_FAQS: readonly {
  id: string;
  question: string;
  answer: string;
}[] = [
  {
    id: "hoarse",
    question: "מה אם אני צרוד ביום ההקלטה?",
    answer:
      "שום בעיה! דוחים ללא עלות. הקול שלכם צריך להיות במיטבו - תיאמו איתי תאריך חדש בלי לחץ.",
  },
  {
    id: "shy",
    question: "אני ממש ביישן, זה בסדר?",
    answer:
      "בהחלט! האולפן הוא מרחב בטוח לחלוטין. אנחנו נשיר יחד אם צריך, ניקח את הזמן. 95% מהלקוחות מגיעים מפוחדים ויוצאים מחייכים.",
  },
  {
    id: "friends",
    question: "מותר להביא חברים?",
    answer:
      "בהחלט! האנרגיה שלהם עוזרת. עם זאת - עד מלווה 1 לשיר/ברכה רגילה, ולבר/בת מצווה עד 2 מלווים (אבא ואמא). שימו לב: אין להכניס אוכל לאולפן.",
  },
  {
    id: "duration",
    question: "כמה זמן לוקחת ההקלטה?",
    answer:
      "המיוחד שלנו: ללא לחץ זמן עד לתוצאה מושלמת. לוקחים את הזמן שצריך - שעה, שעתיים, כמה שנדרש לקבל את התוצאה הכי טובה שלכם.",
  },
] as const;

export const RECORDING_ATMOSPHERES: readonly {
  id: AtmosphereId;
  emoji: string;
  title: string;
  subtitle: string;
}[] = [
  {
    id: "intimate",
    emoji: "🕯️",
    title: "מרגיע ואינטימי",
    subtitle: "קול רך, עמוק ומרגש",
  },
  {
    id: "party",
    emoji: "🎉",
    title: "אנרגיית מסיבה",
    subtitle: "חיים, שמחה ואנרגיה",
  },
  {
    id: "focused",
    emoji: "🎯",
    title: "ריכוז מקצועי",
    subtitle: "סשן נטו, תוצאה מקסימלית",
  },
] as const;

export const STUDIO_RECORDING_PACKAGES: readonly {
  id: StudioPackageId;
  emoji: string;
  name: string;
  description: string;
  price: number;
  badge?: string;
  savings?: string;
  featured?: boolean;
}[] = [
  {
    id: "remote",
    emoji: "📱",
    name: "הקלטה מרחוק (Remote)",
    description:
      "הקלטה מהטלפון בבית · ניקוי רעשים · מיקס ותיקון זיופים מלא באולפן",
    price: 590,
  },
  {
    id: "classic",
    emoji: "🎙️",
    name: "הקלטת אולפן קלאסית",
    description:
      "הקלטת שיר/ברכה/דרשה ללא לחץ זמן עד לתוצאה מושלמת · מיקס, מאסטרינג ותיקון זיופים",
    price: 990,
  },
  {
    id: "pro",
    emoji: "🏆",
    name: "הלהיט - Pro Studio",
    description:
      "הקלטה מלאה + Pitch Correction ידני + ייעוץ אמנותי + 3 תמונות סטילס מעובדות",
    price: 1480,
    badge: "POPULAR",
    savings: "חיסכון של 490 ₪ לעומת מחיר עצמאי",
  },
  {
    id: "viral",
    emoji: "🌟",
    name: "הכוכב הויראלי",
    description:
      "חבילת Pro + קליפ אולפן מקצועי (Performance Video) ערוך לרשתות חברתיות",
    price: 1950,
    badge: "TRENDING",
    savings: "חיסכון של 780 ₪ לעומת מחיר עצמאי",
  },
  {
    id: "all_in",
    emoji: "👑",
    name: "All-In: סיפור חיים",
    description:
      "הפקה מלאה + קליפ תמונות גדילה מרגש מתמונות וסרטוני ילדות · הכל כלול, ללא הפתעות",
    price: 2380,
    badge: "BEST VALUE",
    savings: "חיסכון של 1,120 ₪ לעומת מחיר עצמאי",
    featured: true,
  },
] as const;

export const STUDIO_RECORDING_UPGRADES: readonly {
  id: StudioUpgradeId;
  name: string;
  description: string;
  price: number;
  badge?: string;
}[] = [
  {
    id: "bts",
    name: "סרטון מאחורי הקלעים (BTS) לטיקטוק",
    description: "תיעוד הסשן - MP4 מוכן לרילס ולטיקטוק",
    price: 250,
  },
  {
    id: "performance_clip",
    name: "קליפ ביצוע מקצועי מהאולפן",
    description: "Performance Video ערוך - MP4 מוכן לרשתות",
    price: 750,
    badge: "חדש",
  },
  {
    id: "podcast_interview",
    name: "פודקאסט אישי - ראיון מרגש (3 דקות)",
    description: "ראיון 3 דקות - MP3 מוקלט ומעורך",
    price: 350,
  },
  {
    id: "photo_pack",
    name: "בוק צילומים מורחב - 15 תמונות",
    description: "תמונות אולפן מקצועיות מעובדות לרשתות",
    price: 200,
  },
  {
    id: "express",
    name: "שירות אקספרס וקדימות בשיבוץ",
    description: "עדיפות בלו\"ז, הגשה מהירה במיוחד",
    price: 300,
  },
  {
    id: "ai_playback",
    name: "פלייבק AI מותאם אישית",
    description: "לחן מקורי עם AI לפי הסגנון שלכם",
    price: 150,
  },
  {
    id: "vocal_coaching",
    name: "ליווי מורה לפיתוח קול - הכנה לסשן",
    description: "שיעור הכנה אישי - תגיעו לאולפן מוכנים ובטוחים",
    price: 400,
  },
  {
    id: "family_duet",
    name: "דואט משפחתי - הוספת הורה/אח",
    description: "אותו סשן - גם ההורים/האחים מקליטים ברכה קצרה",
    price: 190,
    badge: "+20% ערך",
  },
] as const;

export const STUDIO_SURPRISE_GIFT_NOTE =
  "אם יש ילד/ה שיופתעו - נכין להם הפתעה קטנה ומיוחדת";

export const STUDIO_RECORDING_GUIDE = {
  emoji: "📖",
  title: 'הורידו חינם: "5 הטיפים של יקיר להקלטה מושלמת"',
  subtitle: "גם אם מעולם לא עמדתם מול מיקרופון - המדריך שישנה את זה",
  url: "https://drive.google.com/file/d/1VobdhaF0QuohtfAZ43uHB4iMu4CcXiEg/view",
  driveFileId: "1VobdhaF0QuohtfAZ43uHB4iMu4CcXiEg",
} as const;

export const STUDIO_BOOKING_APPROVALS = {
  pricingNote:
    "הצעה ראשונית: מחיר סופי ייקבע לאחר שיחת ייעוץ קצרה עם יקיר.",
  cancellationNote:
    "ביטולים: עד 48 שעות לפני הסשן - החזר מלא. לאחר מכן - 50%.",
  termsLabel: "קראתי את התנאים ואני מאשר/ת שהפרטים נכונים.",
} as const;
