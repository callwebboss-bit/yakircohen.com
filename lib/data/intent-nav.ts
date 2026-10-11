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

/**
 * ארבע הדלתות (D84, 11.10.2026) ושורת "עוד" (D85). בשלב 0 של תוכנית הבהירות
 * הן רק תווית מדידה (data-door), כדי לאסוף נתוני "לפני" על הכפתורים הקיימים
 * לפני שהכותרת ודף הבית עוברים לדלתות.
 */
export type DoorId = "event" | "song-gift" | "podcast" | "business" | "more";

export const DOOR_BY_INTENT_ID: Readonly<Record<string, DoorId>> = {
  song: "song-gift",
  blessing: "song-gift",
  mobile: "song-gift",
  gifts: "song-gift",
  podcast: "podcast",
  wedding: "event",
  barmitzvah: "event",
  business: "business",
  pricing: "more",
};

export function doorForIntent(id: string): DoorId {
  return DOOR_BY_INTENT_ID[id] ?? "more";
}

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
    id: "wedding",
    label: "חתונה",
    href: "/events/wedding-attractions-packages",
  },
  {
    id: "barmitzvah",
    label: "בר מצווה",
    href: "/events/bar-mitzvah",
  },
  {
    id: "gifts",
    label: "מתנות",
    href: "/matanot",
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
