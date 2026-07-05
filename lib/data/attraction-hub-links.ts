import type { HubLinkItem } from "@/components/services/ServiceHubLinks";

/** קישורי אטרקציות משותפים לדפי שירות בודדים */
export const ATTRACTION_HUB_LINKS: readonly HubLinkItem[] = [
  {
    href: "/events/attractions/wedding-smoking-machine",
    title: "עשן כבד לחתונה",
    description: "ענן לבן על רצפת הריקודים, עם מפעיל צמוד.",
  },
  {
    href: "/events/attractions/cold-fireworks",
    title: "זיקוקים קרים",
    description: "ניצוצות בטוחים ללא עשן, מרשימים בצילום.",
  },
  {
    href: "/events/attractions/confetti-cannon",
    title: "תותח קונפטי",
    description: "ניירות צבעוניים ברגע השיא, קל לניקוי.",
  },
  {
    href: "/events/attractions/bubble-machine",
    title: "מכונת בועות",
    description: "בועות לחתונה, בר מצווה ואירועי ילדים.",
  },
  {
    href: "/events/wedding-attractions-packages",
    title: "חבילות אירוע",
    description: "שילוב אטרקציות במחיר מוזל.",
  },
  {
    href: "/events/attractions/jerusalem",
    title: "אטרקציות בירושלים",
    description: "מגיעים לאולמות בירושלים ממודיעין.",
  },
  {
    href: "/events/attractions",
    title: "כל האטרקציות",
    description: "עשן, זיקוקים, בועות וקונפטי עם מפעיל.",
  },
];

export function attractionHubLinksExcluding(
  currentHref: string,
  limit = 4,
): HubLinkItem[] {
  return ATTRACTION_HUB_LINKS.filter((link) => link.href !== currentHref).slice(
    0,
    limit,
  );
}

export const PHOTO_SLIDESHOW_RELATED: readonly HubLinkItem[] = [
  {
    href: "/photography/wedding",
    title: "צילום חתונות",
    description: "צלם חתונות עם ניסיון באירועים באזור המרכז.",
  },
  {
    href: "/events/dj-events",
    title: "תקליטן לאירועים",
    description: "DJ לחתונה ואירועים קטנים, מודיעין והמרכז.",
  },
  {
    href: "/video/presentation",
    title: "מצגות וידאו",
    description: "מצגת וידאו מקצועית לאירוע או לעסק.",
  },
  {
    href: "/book",
    title: "הזמנה מקוונת",
    description: "בדיקת מחיר ותיאום דרך טופס ההזמנה.",
    ctaLabel: "לפרטים והרשמה",
  },
] as const;
