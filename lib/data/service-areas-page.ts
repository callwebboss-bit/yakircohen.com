export type ServiceAreaCard = {
  id: string;
  title: string;
  availability: string;
  travelNote: string;
  href: string;
  hrefLabel: string;
};

export const SERVICE_AREAS_PAGE_PATH = "/areas";

export const SERVICE_AREAS_INTRO =
  "אולפן ההקלטות נמצא במודיעין. אנו מגיעים גם לאירועים והקלטות בשטח בירושלים, שוהם, פתח תקווה וערים נוספות במרכז.";

export const SERVICE_AREAS: readonly ServiceAreaCard[] = [
  {
    id: "modiin",
    title: "מודיעין והסביבה",
    availability: "ימים א׳-ה׳, לפי תיאום",
    travelNote: "ללא תוספת נסיעה בטווח הקרוב. הגעה לאולפן במודיעין בתיאום מראש.",
    href: "/studio",
    hrefLabel: "לעמוד האולפן",
  },
  {
    id: "jerusalem",
    title: "ירושלים",
    availability: "ימים א׳-ה׳, לפי תיאום",
    travelNote: "הגעה לירושלים או הגעה לאולפן במודיעין - לפי סוג השירות ולוח הזמנים.",
    href: "/studio/studio-jerusalem",
    hrefLabel: "הקלטות לקהל מירושלים",
  },
  {
    id: "shoham",
    title: "שוהם והמודיעין-מכבים-רעות",
    availability: "ימים א׳-ה׳, לפי תיאום",
    travelNote: "באזור הקרוב תיאום הנסיעה פשוט יותר. שירותי אולפן ואירועים לפי סוג הפרויקט.",
    href: "/studio/studio-shoham",
    hrefLabel: "אולפן לקהל משוהם",
  },
  {
    id: "petah-tikva-center",
    title: "פתח תקווה והמרכז",
    availability: "ימים א׳-ה׳, לפי תיאום",
    travelNote: "תוספת נסיעה לפי מרחק וסוג השירות. בחלק מהמקרים עדיף להקליט באולפן במודיעין.",
    href: "/studio/mobile-studio",
    hrefLabel: "אולפן נייד והקלטות בשטח",
  },
] as const;
