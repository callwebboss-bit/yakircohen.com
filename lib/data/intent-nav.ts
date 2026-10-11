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
 * הן היו רק תווית מדידה (data-door) על הכפתורים הקיימים. מ-ק7 הן גם הדלתות
 * בראש דף הבית (lib/data/home-doors.ts), באותם מזהים.
 */
export type DoorId = "event" | "song-gift" | "podcast" | "business" | "more";

export const DOOR_BY_INTENT_ID: Readonly<Record<string, DoorId>> = {
  song: "song-gift",
  blessing: "song-gift",
  gifts: "song-gift",
  podcast: "podcast",
  /* D93 (11.10.2026): האולפן הנייד בדלת הפודקאסט. היה song-gift בשלב 0.
     העמוד /studio/mobile-studio מתומחר לפי mobile_podcast_at_home */
  mobile: "podcast",
  wedding: "event",
  barmitzvah: "event",
  business: "business",
  pricing: "more",
};

export function doorForIntent(id: string): DoorId {
  return DOOR_BY_INTENT_ID[id] ?? "more";
}

/**
 * הסדר לפי D93 (11.10.2026): קודם דלת השיר והמתנה (שיר, ברכה, מתנות), אחריה
 * דלת הפודקאסט (פודקאסט, אולפן נייד), ואז אירוע, עסקים ושורת "עוד". הרצועה
 * בכותרת של כ-325 עמודים, ולכן כל href נשאר. /events/bar-mitzvah מקושר מכל
 * האתר רק דרכה.
 */
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
    id: "gifts",
    label: "מתנות",
    href: "/matanot",
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
