export type ConfettiStyle = {
  name: string;
  description: string;
};

export type ConfettiExampleVideo = {
  videoId: string;
  title: string;
};

export const CONFETTI_EXAMPLE_VIDEOS: readonly ConfettiExampleVideo[] = [
  {
    videoId: "yjxF9pKzbr0",
    title: "שני תותחי קונפטי על במה - סיום שנה בבית ספר",
  },
  { videoId: "SkBHvqC-S2Q", title: "הסבר על קונפטי לאירועים" },
  { videoId: "btBx-cw16Js", title: "קונפטי בקליפ  -  חנן בן ארי" },
] as const;

export const CONFETTI_HIGHLIGHTS: readonly { emoji: string; title: string; text: string }[] = [
  {
    emoji: "📸",
    title: "תיעוד מקצועי",
    text: "אידיאלי לצילום סטילס ווידאו  -  רגע שכולם יצלמו וישתפו.",
  },
  {
    emoji: "⏱️",
    title: "תזמון מדויק",
    text: "שליטה אלחוטית שמסונכרנת עם מוזיקה ותאורה.",
  },
  {
    emoji: "🛡️",
    title: "בטיחות ללא פשרות",
    text: "CO₂ בלבד  -  ללא אש, ללא עשן וללא סכנה.",
  },
] as const;

export const CONFETTI_STYLES: readonly ConfettiStyle[] = [
  { name: "לבן", description: "אווירה רומנטית ואלגנטית." },
  { name: "זהב / כסף", description: "נוצץ, יוקרתי." },
  { name: "צבעוני", description: "שמח, חגיגי, מלא אנרגיה." },
  {
    name: "צורות מיוחדות",
    description: "לבבות, כוכבים, שטרות כסף, או קונפטי עם לוגו.",
  },
] as const;

export const CONFETTI_BENEFITS: readonly { title: string; description: string }[] = [
  {
    title: "אפקט WOW אמיתי",
    description: "סנכרון מדויק עם המוזיקה  -  עד 30 מטר באוויר.",
  },
  {
    title: "בטיחותי",
    description: "פועל על CO₂ בלבד, ללא אש וללא ריח.",
  },
  {
    title: "קל לניקוי",
    description: "נייר כותנה איכותי  -  לא מכתים, לא מחליק.",
  },
  {
    title: "גיבוי מלא",
    description: "שני בלוני CO₂ + תותח חלופי לכל הפעלה.",
  },
  {
    title: "צוות מקצועי",
    description: "מגיע בזמן, מתפעל בדיוק ברגע הנכון.",
  },
  {
    title: "התאמה אישית",
    description: "צבעים, צורות ותזמון  -  הכל לפי הטעם שלכם.",
  },
] as const;

export const CONFETTI_CANNON_TYPES: readonly { title: string; description: string }[] = [
  {
    title: "תותח ידני",
    description: "קטן וקל  -  מתאים לאירועים קטנים (לא מה שאנחנו מביאים לאירועים גדולים).",
  },
  {
    title: "תותח חשמלי / מקצועי",
    description: "יורה עד 30 מטר  -  מתאים לחתונות ואירועים גדולים.",
  },
  {
    title: "קונפטי מיוחד",
    description: "לבבות, כוכבים, פרפרים או שטרות כסף  -  500 ₪ באוויר?",
  },
] as const;

export const CONFETTI_SUPPLIER_CHECKLIST: readonly string[] = [
  "בלון CO₂ נוסף לגיבוי?",
  "תותח חלופי במקרה תקלה?",
  "קונפטי בתזמון מדויק עם DJ?",
  "שירות לקוחות ואחריות מלאה?",
  "אפקט מרשים  -  לא מוצר מאכזב?",
] as const;

export const CONFETTI_WHY_US: readonly string[] = [
  "גמישות ושירות אישי  -  צבעים ותזמון מותאמים",
  "תמיכה טכנית  -  הגעה מוקדמת, בדיקות וטכנאי אופציונלי",
  "שקיפות  -  מחיר ברור, הכל כלול, בלי הפתעות",
  "20 שנות ניסיון - 1,800+ אירועים - 280+ המלצות",
] as const;

export const CONFETTI_DIY_VS_PRO: readonly { label: string; bad: string; good: string }[] = [
  { label: "עוצמה", bad: "פיצוץ קטן, עשרות גזרים", good: "עד 30 מטר באוויר" },
  { label: "ניקוי", bad: "ניירות נדבקים, לכלוך", good: "כותנה איכותית, קל לניקוי" },
  { label: "תפעול", bad: "עצמאי, ללא תזמון", good: "מפעיל מקצועי + DJ" },
  { label: "בטיחות", bad: "לא תמיד מתאים לאולם", good: "CO₂, ללא אש, מאושר" },
] as const;
