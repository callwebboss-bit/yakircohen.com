import type { PriceItemId } from "@/lib/data/pricing-catalog";

export type MashupOfferItem = {
  id: string;
  title: string;
  description: string;
  pricingId?: PriceItemId;
  priceNote?: string;
  tags?: readonly string[];
};

export type MashupOfferCategory = {
  id: string;
  title: string;
  intro: string;
  items: readonly MashupOfferItem[];
};

export const MASHUP_MUSIC_OFFER_CATEGORIES: readonly MashupOfferCategory[] = [
  {
    id: "one-on-one",
    title: "מאשאפ מותאם — שיר על שיר",
    intro:
      "יושבים על השילוב לפני העריכה: איזה חלק, באיזה BPM, לאן המעבר. מסירה עד 3 ימי עסקים.",
    items: [
      {
        id: "custom_planned",
        title: "מאשאפ מותאם",
        description:
          "שני שירים לפי בקשה, סבב תיקון אחד. עריכה ידנית — סולם, קצב, מעבר.",
        pricingId: "mashup_custom_planned",
        tags: ["אולפן", "עד 3 ימ״ע"],
      },
      {
        id: "custom_creative",
        title: "יצירתי / דרוג+",
        description:
          "stems, שינוי משקל, מודולציה — לשילובים שלא נסגרים ב-crossfade.",
        pricingId: "mashup_creative_plus",
        tags: ["stems", "הפקה"],
      },
      {
        id: "custom_pack",
        title: "חבילת 3 מותאמים",
        description: "שלושה שילובים לפי בחירה — מחיר חבילה נמוך משלושה בנפרד.",
        pricingId: "mashup_custom_pack_3",
        tags: ["חבילה"],
      },
      {
        id: "consult_only",
        title: "שיחה לפני הזמנה",
        description: "בודקים אם השילוב בכלל עובד — BPM, סולם, ומה עדיף: מוכן או מותאם.",
        priceNote: "ללא עלות לפני הזמנה",
        tags: ["ייעוץ"],
      },
    ],
  },
  {
    id: "ready-mashups",
    title: "מאגר מוכן",
    intro: "גרסאות שכבר ערוכו. בוחרים, משלמים, מנגנים — בלי לחכות לעריכה.",
    items: [
      {
        id: "ready_single",
        title: "מאשאפ בודד מהמאגר",
        description: "שילוב אחד מוכן לנגן — ראו רשימה למעלה.",
        pricingId: "mashup_ready_single",
        tags: ["מיידי"],
      },
      {
        id: "ready_pack_5",
        title: "חבילת 5 — עונת אירועים",
        description: "חמישה שילובים מהמאגר או לפי רשימה שתשלחו.",
        pricingId: "mashup_ready_pack_5",
        tags: ["חבילה", "חיסכון"],
      },
      {
        id: "ready_pack_10",
        title: "חבילת 10 — מאגר אישי",
        description: "לדיג'יי שרוצה ספרייה לשנה שלמה.",
        pricingId: "mashup_ready_pack_10",
        tags: ["מקסימום חיסכון"],
      },
    ],
  },
  {
    id: "gym-sets",
    title: "סטים לחדרי כושר",
    intro: "קצב יציב לשיעורים — בלי קפיצות BPM שמבלבלות את המאמן.",
    items: [
      {
        id: "gym_hiit",
        title: "HIIT ואינטרוולים",
        description: "120–140 BPM, בלוקים של 45 דקות.",
        pricingId: "gym_music_set",
        tags: ["HIIT"],
      },
      {
        id: "gym_strength",
        title: "כוח ופונקציונלי",
        description: "קצב בינוני, בלי דרופים חדים.",
        pricingId: "gym_music_set",
        tags: ["כוח"],
      },
      {
        id: "gym_yoga",
        title: "יוגה ומתיחות",
        description: "70–95 BPM, זרימה רגועה.",
        pricingId: "gym_music_set",
        tags: ["יוגה"],
      },
    ],
  },
  {
    id: "ambience",
    title: "מוזיקה לחלל",
    intro: "לא כל מקום צריך רחבה. פלייליסט לפי סוג עסק ושעות.",
    items: [
      {
        id: "cafe_lounge",
        title: "בית קפה ולובי",
        description: "רקע לשיחה — בלי מילים דומיננטיות.",
        pricingId: "ambience_space_set",
        tags: ["קפה"],
      },
      {
        id: "retail_boutique",
        title: "חנות ובוטיק",
        description: "קצב עדין לקניות.",
        pricingId: "ambience_space_set",
        tags: ["קמעונאות"],
      },
      {
        id: "corporate_lobby",
        title: "משרד וכנס",
        description: "מוזיקה מקצועית לנטוורקינג.",
        pricingId: "ambience_space_set",
        tags: ["חברה"],
      },
      {
        id: "spa_wellness",
        title: "ספא וטיפול",
        description: "טקסטורות רכות, בלי הפתעות.",
        pricingId: "ambience_space_set",
        tags: ["ספא"],
      },
    ],
  },
] as const;
