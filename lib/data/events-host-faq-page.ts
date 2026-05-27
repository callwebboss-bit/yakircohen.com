import type { FAQItem } from "@/components/ui/FAQAccordion";
import type { HubLinkItem } from "@/components/services/ServiceHubLinks";

export const EVENTS_HOST_FAQ_TITLE = "שאלות ותשובות - מנחה ומנהל אירועים";

export const EVENTS_HOST_FAQ_HERO_FEATURES: readonly string[] = [
  "מתי צריך מנחה ולא רק DJ",
  "תכנון תסריט ערב לפני האירוע",
  "תיאום מול ספקים בזמן אמת",
  "קישורים להזמנה ולשירותי אירועים",
] as const;

export const EVENTS_HOST_FAQ_LINKS: readonly HubLinkItem[] = [
  {
    href: "/events/host",
    title: "מנחה ומנהל אירועים",
    description: "עמוד השירות המלא - תהליך, דוגמאות ויצירת קשר.",
    badge: "שירות ראשי",
  },
  {
    href: "/events/dj-events",
    title: "DJ לאירועים",
    description: "מוזיקה, רחבה ואפקטים - משלים את ההנחיה.",
  },
  {
    href: "/events",
    title: "מרכז האירועים",
    description: "אטרקציות, DJ, צילום והגברה במקום אחד.",
  },
  {
    href: "/book#events",
    title: "הזמנת אטרקציות",
    description: "בחירת אטרקציות ושליחה בוואטסאפ.",
  },
  {
    href: "/book#dj",
    title: "הזמנת DJ",
    description: "חבילות DJ, רגע של כוכב ואפקטים.",
  },
  {
    href: "/events/equipment/faq",
    title: "שאלות על הגברה וציוד",
    description: "מחירים, צ'ק סאונד והזמנה מקוונת.",
  },
] as const;

export const EVENTS_HOST_FAQ_ITEMS: readonly FAQItem[] = [
  {
    id: "host-vs-dj",
    question: "מה ההבדל בין מנחה ל-DJ?",
    answer:
      "DJ מנהל מוזיקה ורחבה. מנחה מוביל טקסים, כניסות, נאומים ותיאום מול ספקים. באירוע עם כמה חלקים - שניהם יכולים לעבוד יחד, כל אחד בתחום שלו.",
  },
  {
    id: "host-prep",
    question: "כמה זמן לפני האירוע נפגשים?",
    answer:
      "לפחות שיחת תכנון אחת לפני האירוע: סדר חלקים, דוברים, הפתעות ונקודות רגישות. ביום האירוע המנחה מגיע מוקדם לסנכרון עם DJ וצלמים.",
  },
  {
    id: "host-wedding",
    question: "האם מתאים לחתונה?",
    answer:
      "כן. חתונות עם טקס, ארוחה, נאומים וריקודים - המנחה שומר על לוז ומעביר בין חלקים בלי \"חורים\" או עומס.",
  },
  {
    id: "host-book",
    question: "איך מזמינים?",
    answer:
      "בעמוד ההזמנה בוחרים קטגוריה (אטרקציות או DJ), ממלאים פרטים ושולחים בוואטסאפ. לשאלות על הנחיה בלבד - צרו קשר מהעמוד הראשי של השירות.",
  },
] as const;
