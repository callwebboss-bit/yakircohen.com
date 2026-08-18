/**
 * אוכל, קפה ונקודות ציון ליד האולפן - מקור יחיד ל-UI ול-FAQ בעמוד צור קשר.
 * לא שותפות ולא המלצה ממומנת. שעות לא מקובעות (משתנות).
 */

export type NearbyPlaceGroup = "walk" | "drive" | "landmark";

export type NearbyPlace = {
  id: string;
  name: string;
  kindLabel: string;
  group: NearbyPlaceGroup;
  area: string;
  address: string;
  distance: string;
  note: string;
  mapsQuery: string;
};

export const STUDIO_NEARBY_GROUPS: readonly {
  id: NearbyPlaceGroup;
  title: string;
}[] = [
  { id: "walk", title: "מודיעין סנטר - הליכה מהאולפן" },
  { id: "drive", title: "נסיעה של כמה דקות" },
  { id: "landmark", title: "נקודות ציון במודיעין" },
];

export const STUDIO_NEARBY_PLACES: readonly NearbyPlace[] = [
  {
    id: "cafe-romi",
    name: "קפה רומי",
    kindLabel: "בית קפה וקונדיטוריה",
    group: "walk",
    area: "מודיעין סנטר",
    address: "צאלון 21",
    distance: "הליכה קצרה",
    note: "קפה, מאפים וישיבה במקום. כשר רבנות מודיעין.",
    mapsQuery: "קפה רומי מודיעין סנטר צאלון 21",
  },
  {
    id: "lechem-tomer",
    name: "הלחם של תומר",
    kindLabel: "מאפייה",
    group: "walk",
    area: "מודיעין סנטר",
    address: "צאלון 21",
    distance: "הליכה קצרה",
    note: "לחם ומאפים. כשר רבנות מודיעין.",
    mapsQuery: "הלחם של תומר מודיעין סנטר צאלון 21",
  },
  {
    id: "azrieli",
    name: "קניון עזריאלי מודיעין",
    kindLabel: "קניון",
    group: "drive",
    area: "לב העיר",
    address: "לב העיר 2",
    distance: "כ-5 דק׳ נסיעה",
    note: "מסעדות ובתי קפה במקום אחד. ליד תחנת הרכבת מודיעין מרכז.",
    mapsQuery: "קניון עזריאלי מודיעין לב העיר 2",
  },
  {
    id: "ruben",
    name: "רובן",
    kindLabel: "מסעדה",
    group: "drive",
    area: "מרכז העיר",
    address: "דם המכבים 47",
    distance: "כ-6 דק׳ נסיעה",
    note: "בורגרים וכריכים. כשר רבנות מודיעין.",
    mapsQuery: "רובן מודיעין דם המכבים 47",
  },
  {
    id: "anava-park",
    name: "פארק ענבה",
    kindLabel: "פארק עירוני",
    group: "landmark",
    area: "כיכר התחבורה",
    address: "שדרות החשמונאים / עמק זבולון",
    distance: "כ-5 דק׳ נסיעה",
    note: "הפארק המרכזי של מודיעין. אגם, מתקני משחק ושבילים. ליד הקניון ותחנת הרכבת.",
    mapsQuery: "פארק ענבה מודיעין",
  },
  {
    id: "emek-ayalon-park",
    name: "פארק עמק איילון",
    kindLabel: "פארק",
    group: "landmark",
    area: "עמק איילון",
    address: "בין מודיעין סנטר לבית הספר היובל",
    distance: "הליכה ברחוב האולפן",
    note: "מתקני משחק, ספסלים ושבילים. מתאים אם מגיעים עם ילדים לפני הסשן או אחריו.",
    mapsQuery: "פארק עמק איילון מודיעין",
  },
];

export function nearbyPlaceMapsUrl(place: NearbyPlace): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.mapsQuery)}`;
}

export const STUDIO_NEARBY_HEADING = "מה יש ליד האולפן במודיעין";

export const STUDIO_NEARBY_INTRO =
  "ליד האולפן בעמק איילון 34 יש אוכל בהליכה במודיעין סנטר, ופארק עמק איילון ברחוב. פארק ענבה, קניון עזריאלי ותחנת הרכבת בנסיעה של כמה דקות.";

export const STUDIO_NEARBY_FAQ = {
  question: "יש איפה לאכול ליד האולפן?",
  answer:
    "כן. מודיעין סנטר (צאלון 21) במרחק הליכה - קפה רומי והלחם של תומר. קניון עזריאלי מודיעין ומסעדת רובן במרכז העיר בנסיעה של כמה דקות. שעות פתיחה משתנות - בדקו לפני היציאה.",
} as const;

export const STUDIO_NEARBY_LANDMARK_FAQ = {
  question: "מה יש ליד האולפן חוץ מאוכל?",
  answer:
    "פארק עמק איילון בהליכה ברחוב האולפן. פארק ענבה, קניון עזריאלי ותחנת הרכבת מודיעין מרכז בנסיעה של כמה דקות.",
} as const;

export const STUDIO_NEARBY_FOOTNOTE =
  "שעות פתיחה של בתי אוכל משתנות. בדקו במפות לפני היציאה. המקומות עצמאיים - לא חלק מהאולפן.";
