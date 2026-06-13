export const WEDDING_PACKAGES_WHY: readonly {
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    emoji: "🤝",
    title: "כל השירותים עובדים ביחד",
    description:
      "DJ שמכיר את האטרקציות ויודע מתי להפעיל  -  הכול מסונכרן וזורם.",
  },
  {
    emoji: "⏰",
    title: "חוסכים זמן",
    description: "ספק אחד, תיאום אחד, תשלום אחד, ראש שקט.",
  },
  {
    emoji: "💰",
    title: "חוסכים כסף",
    description:
      "חבילה משולבת  -  20-30% פחות מהזמנה נפרדת. ההפרש יכול להגיע לאלפי שקלים.",
  },
  {
    emoji: "🎭",
    title: "אירועים בבית / גינה",
    description:
      "אירוע פשוט שהופך לבלתי נשכח  -  שילוב אטרקציות עושה את ההבדל.",
  },
] as const;

export const PACKAGE_DJ_THREE_ATTRACTIONS = {
  name: "חבילה 1: DJ + 3 אטרקציות",
  badge: "💎",
  djHours: "עד 7 שעות",
  attractions: [
    { label: "עשן כבד", href: "/events/attractions/wedding-smoking-machine" },
    { label: "זיקוקים קרים", href: "/events/attractions/cold-fireworks" },
    { label: "תותח קונפטי", href: "/events/attractions/confetti-cannon" },
    {
      label: "בועות סבון עשן",
      href: "/events/attractions/bubble-machine/smoke-bubble-machine-events",
    },
    { label: "עמדת LED / תאורה", href: "/events/stage-led-dj" },
  ] as const,
  suitedFor: "חתונות, בר/בת מצווה, ימי הולדת",
} as const;

export const PACKAGE_FESTIVAL = {
  name: 'חבילת "פסטיבל"  -  הכל כלול',
  price: "15,000 ₪",
  includes: [
    "DJ פרימיום מהצוות (5 שעות)",
    "אולפן הקלטות נייד באירוע",
    "3 אטרקציות חובה לבחירה: עשן, קונפטי, זיקוקים",
    "תיאום אמנים אורחים והפתעות",
    "פסקול כניסה + קריינות דרמטית",
    "מצגת תמונות קולנועית",
    "סרטון מעוצב מכל אטרקציה",
    "טכנאי צמוד + ציוד מלא",
  ],
} as const;

export const WEDDING_PACKAGES_FAQ: readonly {
  id: string;
  question: string;
  answer: string;
}[] = [
  {
    id: "custom",
    question: "אפשר לבנות חבילה מותאמת?",
    answer:
      "כן  -  המחשבון באתר או וואטסאפ. בוחרים DJ, אטרקציות והגברה  -  מקבלים מחיר מיידי.",
  },
  {
    id: "savings",
    question: "כמה באמת חוסכים?",
    answer:
      "בדרך כלל 20-30% לעומת הזמנה נפרדת של כל שירות  -  תלוי בחבילה ובתאריך.",
  },
  {
    id: "booking",
    question: "כמה זמן מראש?",
    answer: "מומלץ 2-3 חודשים, בעונת החתונות מוקדם יותר.",
  },
] as const;
