import {
  attractionBundleDiscountPercent,
  DJ_ATTRACTIONS_DISCOUNT_NOTE,
  DJ_TEAM_NOTE,
  getExVat,
} from "@/lib/data/pricing-catalog";
import { formatPrice } from "@/lib/data/pricing-display";

export const WEDDING_PACKAGES_WHY: readonly {
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    emoji: "🤝",
    title: "כל השירותים עובדים ביחד",
    description:
      "DJ שמכיר את האטרקציות ויודע מתי להפעיל, הכול מסונכרן וזורם.",
  },
  {
    emoji: "⏰",
    title: "חוסכים זמן",
    description: "ספק אחד, תיאום אחד, תשלום אחד, ראש שקט.",
  },
  {
    emoji: "💰",
    title: "הנחת חבילה על האטרקציות",
    /* החלטת הבעלים 3.10.2026 (סבב שני): אין הנחה מעל 8%. היה "20-30% פחות" */
    description:
      `מ-2 אטרקציות ומעלה, ${attractionBundleDiscountPercent()}% פחות ממחיר אטרקציה בודדת. מחושב מהמחירון.`,
  },
  {
    emoji: "🎭",
    title: "אירועים בבית / גינה",
    description:
      "אירוע פשוט שמקבל עומק ומראה שלם, שילוב אטרקציות עושה את ההבדל.",
  },
] as const;

export const PACKAGE_DJ_THREE_ATTRACTIONS = {
  name: "חבילה 1: DJ + 3 אטרקציות",
  badge: "💎",
  /* WP2: היה "עד 7 שעות". החלטות 5.10.2026 (DJ): מחיר לאירוע, לא לפי שעות */
  djNote: DJ_TEAM_NOTE,
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
  name: 'חבילת "פסטיבל", הכל כלול',
  price: formatPrice(getExVat("festival_all_in")).inline,
  includes: [
    "DJ פרימיום מהצוות, עד שהאירוע נגמר",
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
      "כן, המחשבון באתר או וואטסאפ. בוחרים DJ, אטרקציות והגברה, מקבלים מחיר מיידי.",
  },
  {
    id: "savings",
    question: "כמה באמת חוסכים?",
    answer:
      /* החלטות 5.10.2026 (DJ), סעיף 4: DJ עם אטרקציות בהנחה, בהצעה אישית */
      `על האטרקציות: ${attractionBundleDiscountPercent()}% פחות ממחיר אטרקציה בודדת, מ-2 אטרקציות ומעלה. ${DJ_ATTRACTIONS_DISCOUNT_NOTE}`,
  },
  {
    id: "booking",
    question: "כמה זמן מראש?",
    answer: "מומלץ 2-3 חודשים, בעונת החתונות מוקדם יותר.",
  },
] as const;
