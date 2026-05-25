export const EQUIPMENT_PACKAGE_ITEMS: readonly {
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    emoji: "📦",
    title: "הובלה, הקמה ופירוק",
    description:
      "אנחנו מביאים, מקימים, מכוונים ומפרקים  -  אתם רק מדליקים ונהנים.",
  },
  {
    emoji: "🎵",
    title: "סאב RCF 15 אינץ׳",
    description: "באס עמוק ואיכותי  -  מוזיקה שמרגישים, לא בום מעצבן.",
  },
  {
    emoji: "🔊",
    title: "זוג רמקולים RCF 745",
    description:
      "צליל טבעי בכל פינה  -  חזק אבל לא מעצבן, אפשר לשוחח ליד הרמקול.",
  },
  {
    emoji: "🎛️",
    title: "מיקסר Allen & Heath",
    description: "מיקסר דיגיטלי מקצועי  -  שליטה מלאה וצליל יציב כל הערב.",
  },
] as const;

export const EQUIPMENT_SPECS: readonly { label: string; value: string }[] = [
  { label: "קהל", value: "עד 250 אורחים" },
  { label: "זמן השכרה", value: "עד 10 שעות" },
  { label: "כולל", value: "הובלה, הקמה, כיוונון ופירוק" },
  { label: "דרישות חשמל", value: "תלת-פאזי 32A" },
  { label: "מתאים ל", value: "אולמות, גינות, חצרים, מרחבים פתוחים" },
  { label: "גיבוי", value: "ציוד גיבוי זמין במקרה תקלה" },
] as const;

export const EQUIPMENT_PREP_CHECKLIST: readonly string[] = [
  "גישה נוחה למקום האירוע",
  "מקום חניה לפריקה",
  "נקודת חשמל נגישה ליד הציוד",
  "חיבור תלת-פאזי 32A יציב (ברוב האולמות קיים)",
] as const;

export const EQUIPMENT_WHY_QUALITY: readonly { title: string; description: string }[] = [
  {
    title: "גיבוי טכני",
    description: "הצוות נמצא לאורך כל האירוע  -  לא מביאים ונעלמים.",
  },
  {
    title: "עוצמה מדויקת",
    description: "כיוונון לפי גינה, אולם או מרחב פתוח.",
  },
  {
    title: "צליל נקי",
    description: "שיחה רגילה ליד הרמקולים  -  זה סימן לציוד איכותי.",
  },
] as const;

export const EQUIPMENT_USE_CASES: readonly {
  emoji: string;
  title: string;
  description: string;
}[] = [
  { emoji: "💍", title: "חתונות", description: "מקבלת פנים ועד סוף הלילה." },
  {
    emoji: "🕎",
    title: "בר / בת מצווה",
    description: "הגברה לכל הגילאים.",
  },
  {
    emoji: "🎂",
    title: "ימי הולדת",
    description: "סאונד איכותי שלא מפריע לשכנים.",
  },
  {
    emoji: "🏢",
    title: "אירועי חברה",
    description: "נאומים, מצגות והופעות.",
  },
] as const;

export const EQUIPMENT_RCF_VS_REGULAR: readonly {
  label: string;
  bad: string;
  good: string;
}[] = [
  { label: "צליל", bad: "משמיע  -  לא תמיד נקי", good: "נקי, עוצמתי, מדויק" },
  { label: "אמינות", bad: "לא יציב לאורך ערב", good: "עובד שנים ללא בעיות" },
  { label: "נוחות", bad: "מעצבן לעמוד ליד", good: "שיחה רגילה ליד הרמקול" },
  { label: "מקצועיות", bad: "\"בסדר\"", good: "רמת אולמות ואירועים" },
] as const;

export const EQUIPMENT_ADDONS: readonly string[] = [
  "מיקרופונים נוספים",
  "שעות נוספות (מעבר ל-10)",
  "ציוד תאורה",
  "אפקטים: עשן, זיקוקים, קונפטי",
] as const;

export const EQUIPMENT_WHY_US: readonly string[] = [
  "ניסיון  -  מאות אירועים במודיעין והסביבה",
  "ציוד פרימיום  -  RCF ו-Allen & Heath",
  "שירות מלא  -  הובלה, הקמה, כיוונון ופירוק",
  "גיבוי טכני  -  צוות לאורך כל האירוע",
  "מחירים הוגנים  -  ללא עלויות נסתרות",
] as const;
