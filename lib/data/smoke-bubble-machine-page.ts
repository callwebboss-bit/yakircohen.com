export type SmokeBubbleBenefit = {
  title: string;
  description: string;
};

export type SmokeBubbleCompareOption = {
  name: string;
  description: string;
};

export type SmokeBubbleProcessStep = {
  step: string;
  title: string;
  description: string;
};

export const SMOKE_BUBBLE_HIGHLIGHTS: readonly { emoji: string; title: string; text: string }[] = [
  {
    emoji: "📸",
    title: "תיעוד מקצועי",
    text: "אידיאלי לצילום סטילס ווידאו, אפקט ויזואלי נדיר.",
  },
  {
    emoji: "⏱️",
    title: "תזמון מדויק",
    text: "שליטה אלחוטית שמתמזגת עם מוזיקה ותאורה.",
  },
  {
    emoji: "🛡️",
    title: "בטיחות ללא פשרות",
    text: "ללא אש, ללא עשן מסוכן, נוזל Dry-Bubble שלא מחליק.",
  },
] as const;

export const SMOKE_BUBBLE_COMPARE: readonly SmokeBubbleCompareOption[] = [
  {
    name: "עשן כבד",
    description: "צמוד לרצפה, מראה נקי וקלאסי לסלואו.",
  },
  {
    name: "בועות סבון רגילות",
    description: "שקופות, לעיתים פשוטות מדי לערב יוקרתי.",
  },
  {
    name: "בועות עשן (היט)",
    description:
      "אטומות ולבנות, תופסות תאורה, ענן עדין בתוך כל בועה. תנועה בגבהים שונים.",
  },
] as const;

export const SMOKE_BUBBLE_ADVANTAGES: readonly SmokeBubbleBenefit[] = [
  {
    title: "אפקט כפול",
    description: "בועות מרחפות + עשן דרמטי במוצר אחד.",
  },
  {
    title: "מפעיל צמוד",
    description: "טכנאי מפעיל בתזמון מדויק, לא רק השכרה.",
  },
  {
    title: "בטיחותי ומאושר",
    description: "נוזל מונע החלקה, ללא רעלים וללא כתמים על בגדים.",
  },
  {
    title: "מצטלם מדהים",
    description: "עומק (Depth) ובוקה מרשים לתמונות ולוידאו.",
  },
] as const;

export const SMOKE_BUBBLE_PROCESS: readonly SmokeBubbleProcessStep[] = [
  {
    step: "01",
    title: "יצירת קשר",
    description: "וואטסאפ או אתר, בודקים זמינות ומחיר.",
  },
  {
    step: "02",
    title: "תיאום מקדים",
    description: "קשר עם מנהל אירוע, DJ וצלם לתזמון מדויק.",
  },
  {
    step: "03",
    title: "הגעה והתקנה",
    description: "מפעיל מגיע מוקדם, מתקין ובודק את המכונה.",
  },
  {
    step: "04",
    title: "הפעלה ברגע הנכון",
    description: "סלואו, כניסה או רגע שיא, בעוצמה הנכונה.",
  },
  {
    step: "05",
    title: "פירוק וסיום",
    description: "פירוק מהיר ומקצועי בסיום ההפעלה.",
  },
] as const;
