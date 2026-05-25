export const NEVERMIND_EXTERNAL_URL = "https://nevermind.co.il";

export const STUTTERING_PROCESS_PILLARS: readonly string[] = [
  "הפחתת לחץ כללי בחיים",
  "טיפול ישיר בפחד מגמגום",
  "בניית ביטחון עצמי בדיבור",
  "יכולת לדבר גם על נושאים קשים ורגשיים",
] as const;

export const STUTTERING_METHOD_STEPS: readonly {
  num: string;
  title: string;
  body: string;
}[] = [
  {
    num: "01",
    title: "הבנת המילה",
    body: "מה אתה באמת אומר? מה המשמעות? מה אתה יודע בוודאות?",
  },
  {
    num: "02",
    title: "חיבור לרגש",
    body: "מה אתה מרגיש כשאתה אומר את המילה? פחד? לחץ? חוסר ודאות?",
  },
  {
    num: "03",
    title: "יציבות בדיבור",
    body: "כשאתה מבין את המילה עד הסוף - היא עומדת. ואתה עומד איתה.",
  },
] as const;

export const STUTTERING_PROCESS_STAGES: readonly {
  icon: string;
  stage: string;
  focus: string;
}[] = [
  { icon: "🔍", stage: "אבחון ראשוני", focus: "הבנת המקור (רגשי / פיזי)" },
  { icon: "🧘", stage: "הפחתת לחץ", focus: "נשימות, הרגלים, שקט נפשי" },
  { icon: "🛡️", stage: "עבודה על הפחד", focus: "חשיפה הדרגתית ונטרול חרדה" },
  { icon: "🎤", stage: "תרגול טכני", focus: "קצב, דיקציה, נשימה נכונה" },
  {
    icon: "🚀",
    stage: "שימור והצלחה",
    focus: "דיבור במציאות (עבודה, זוגיות, חברים)",
  },
] as const;

export const STUTTERING_CHILDREN_POINTS: readonly string[] = [
  "ללא לחץ להצליח לדבר",
  "ללא השלמת משפטים או תיקונים",
  "משחקי דיבור כיפיים שמלמדים נשימה וקצב",
  "חיזוק הביטחון העצמי דרך הצלחות קטנות",
] as const;

export const STUTTERING_ADULTS_TOOLS: readonly string[] = [
  'תרגול "דיבור מוזיקלי" - שימוש בקצב לעקיפת תקיעות',
  "עבודה על חרדת ביצוע מול קהל",
  "קואורדינציה בין נשימה, קול ומחשבה",
  "קבלה עצמית - להפחית את הצורך להרשים, ולהגביר את הרצון לשתף",
] as const;
