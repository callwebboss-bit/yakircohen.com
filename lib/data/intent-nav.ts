/**
 * ניווט לפי כוונת משתמש - שפה של צורך, לא שמות עמודים.
 * Overlay על התפריט הקיים; לא מחליף את SiteNav.
 */

export type IntentNavItem = {
  id: string;
  /** תווית קצרה בשפת המשתמש */
  label: string;
  href: string;
};

export const INTENT_NAV_ITEMS: readonly IntentNavItem[] = [
  {
    id: "song",
    label: "שיר",
    href: "/studio/recording-song-modiin",
  },
  {
    id: "blessing",
    label: "ברכה",
    href: "/studio/blessings",
  },
  {
    id: "podcast",
    label: "פודקאסט",
    href: "/podcast",
  },
  {
    id: "mobile",
    label: "אולפן נייד",
    href: "/studio/mobile-studio",
  },
  {
    id: "business",
    label: "עסק",
    href: "/business",
  },
  {
    id: "pricing",
    label: "מחירון",
    href: "/pricing",
  },
] as const;
