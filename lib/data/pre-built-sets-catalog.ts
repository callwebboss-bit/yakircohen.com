export type PreBuiltSet = {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  trackCount: number;
  bpmRange: string;
  priceExVat: number;
  description: string;
  tags: readonly string[];
};

export const PRE_BUILT_SETS_CATALOG: readonly PreBuiltSet[] = [
  {
    id: "reception_2026",
    title: "סט קבלת פנים 2026 - ערוך ומחובר",
    category: "reception_2026",
    durationMinutes: 75,
    trackCount: 28,
    bpmRange: "100-118",
    priceExVat: 450,
    description: "מיינסטרים עדינים לקבלת פנים - חתונות ואירועי חברה. מחובר בביט קבוע.",
    tags: ["קבלת פנים", "2026", "חתונה", "חברה"],
  },
  {
    id: "mainstream_party",
    title: "מיינסטרים - רחבת ריקודים",
    category: "mainstream",
    durationMinutes: 90,
    trackCount: 32,
    bpmRange: "118-128",
    priceExVat: 550,
    description: "להיטים ישראליים ובינלאומיים - אנרגיה גבוהה לכל הגילאים.",
    tags: ["מיינסטרים", "ריקודים", "חתונה"],
  },
  {
    id: "corporate_networking",
    title: "אירוע חברה - מפגש עסקי",
    category: "corporate",
    durationMinutes: 60,
    trackCount: 22,
    bpmRange: "95 עד 110",
    priceExVat: 450,
    description: "רקע מקצועי לכנסים, השקות וקבלות פנים עסקיות.",
    tags: ["חברה", "כנס", "מפגש עסקי"],
  },
  {
    id: "wedding_evening",
    title: "חתונה - ערב מלא",
    category: "wedding",
    durationMinutes: 120,
    trackCount: 40,
    bpmRange: "105-130",
    priceExVat: 750,
    description: "מקבלת פנים, ריקודים וסלואו - מחובר לזרימת ערב טיפוסית.",
    tags: ["חתונה", "ערב", "מלא"],
  },
  {
    id: "gym_hiit_strength",
    title: "חדר כושר - HIIT ואימוני כוח",
    category: "gym",
    durationMinutes: 90,
    trackCount: 30,
    bpmRange: "120-140",
    priceExVat: 550,
    description: "קצב יציב לשיעורי קבוצה - בלוקים מחוברים בלי קפיצות מבלבלות.",
    tags: ["כושר", "HIIT", "אימון"],
  },
] as const;
