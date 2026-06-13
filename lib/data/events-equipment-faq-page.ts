import type { FAQItem } from "@/components/ui/FAQAccordion";
import type { HubLinkItem } from "@/components/services/ServiceHubLinks";

export const EVENTS_EQUIPMENT_FAQ_TITLE = "שאלות ותשובות - השכרת הגברה וציוד לאירועים";

export const EVENTS_EQUIPMENT_FAQ_HERO_FEATURES: readonly string[] = [
  "הגברה לזמרים, DJ ואירועים",
  "מחירים גלויים וחבילות",
  "צ'ק סאונד לפני ההופעה",
  "הזמנה מקוונת לפי קטגוריה",
] as const;

export const EVENTS_EQUIPMENT_FAQ_LINKS: readonly HubLinkItem[] = [
  {
    href: "/events/equipment",
    title: "השכרת הגברה לאירועים",
    description: "סקירת ציוד, מחירון וקישורים לשירותים.",
    badge: "מרכז ציוד",
  },
  {
    href: "/events/equipment/singer-amplification",
    title: "הגברה לזמרים",
    description: "חבילות 2,800-7,800 ₪ - Shure, RCF, צ'ק סאונד.",
  },
  {
    href: "/events/dj-events",
    title: "DJ לאירועים",
    description: "חבילות מוזיקה, תאורה ואפקטים.",
  },
  {
    href: "/book?pkg=basic#singer",
    title: "הזמנת הגברה לזמרים",
    description: "בחירת חבילה, תאריך ומיקום - שליחה בוואטסאפ.",
  },
  {
    href: "/book#dj",
    title: "הזמנת DJ",
    description: "מחשבון חבילות DJ ואפקטים.",
  },
  {
    href: "/book#events",
    title: "הזמנת אטרקציות",
    description: "עשן, קונפטי, בועות ועוד.",
  },
] as const;

export const EVENTS_EQUIPMENT_FAQ_ITEMS: readonly FAQItem[] = [
  {
    id: "eq-singer",
    question: "מה כוללת הגברה לזמרים?",
    answer:
      "מיקרופונים מקצועיים, רמקולים, מוניטורים, מיקסר, טכנאי בשטח וצ'ק סאונד לפני ההופעה. יש שלוש רמות חבילה לפי גודל האירוע.",
  },
  {
    id: "eq-check",
    question: "מה זה צ'ק סאונד?",
    answer:
      "30-60 דקות לפני ההופעה: בדיקת רמות, EQ, מוניטורים ואיזון ווקאל. לא רק \"טסט טסט\" - עד שהזמר מרגיש מוכן.",
  },
  {
    id: "eq-travel",
    question: "איפה אתם מגיעים?",
    answer:
      "מבסיס במודיעין. מרכז ללא תוספת, צפון ודרום לפי מרחק. פרטים מלאים בעמוד ההגברה לזמרים.",
  },
  {
    id: "eq-book",
    question: "איך מזמינים אונליין?",
    answer:
      "בעמוד ההזמנה יש קטגוריה \"הגברה לזמרים\" - בוחרים חבילה, ממלאים תאריך ומיקום ושולחים בוואטסאפ. אפשר גם לבחור חבילה ישירות מעמוד השירות.",
  },
] as const;
