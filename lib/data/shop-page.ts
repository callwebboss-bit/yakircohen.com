import { SERVICE_IMAGES_BASE } from "@/lib/data/services";

/** תמונות קיימות באתר — public/images/services/ */
export const SHOP_VOUCHER_IMAGES = {
  basic:
    "/images/services/studio/blessings/bride-groom-blessing/הקלטה באולפן.webp",
  premium:
    "/images/services/events/wedding-packages/חבילת סלואו יקיר כהן הפקות.webp",
  custom:
    "/images/services/studio/recording-song-modiin/מתחם יקיר כהן הפקות.webp",
} as const;

export type ShopGearItem = {
  id: string;
  title: string;
  subtitle: string;
  imageSrc?: string;
  imageAlt: string;
  placeholder?: boolean;
};

export const SHOP_GEAR_ITEMS: readonly ShopGearItem[] = [
  {
    id: "sound",
    title: "הגברה וסאונד",
    subtitle: "רמקולים, מוניטורים וציוד היקפי.",
    imageSrc: `${SERVICE_IMAGES_BASE}/events/equipment/singer-amplification/מיקרופון שור לזמרים.webp`,
    imageAlt: "מיקרופון והגברה מקצועית לאירועים",
  },
  {
    id: "dj",
    title: "פתרונות DJ",
    subtitle: "קונטרולרים, פלטות ואביזרים.",
    imageSrc: `${SERVICE_IMAGES_BASE}/events/dj-events/עמדת די גיי ותאורה.webp`,
    imageAlt: "עמדת די ג'יי ותאורה באירוע",
  },
  {
    id: "led",
    title: "תאורת LED",
    subtitle: "פנסי במה, אפקטים ותאורה חכמה.",
    imageSrc: `${SERVICE_IMAGES_BASE}/events/attractions/led-booth/יקיר כהן באירוע.webp`,
    imageAlt: "תאורת LED ועמדת לד באירוע",
  },
  {
    id: "studio",
    title: "ציוד אולפן",
    subtitle: "מיקרופונים, כרטיסי קול וממשקים.",
    imageSrc: `${SERVICE_IMAGES_BASE}/voiceover/מיקרופון קריינות.webp`,
    imageAlt: "מיקרופון אולפן מקצועי",
  },
  {
    id: "effects",
    title: "אפקטים",
    subtitle: "מכונות עשן, בועות ופירוטכניקה.",
    imageAlt: "אפקטים לאירועים",
    placeholder: true,
  },
  {
    id: "accessories",
    title: "אביזרים",
    subtitle: "כבלים, סטנדים ותיקי נשיאה.",
    imageAlt: "אביזרי הגברה ואולפן",
    placeholder: true,
  },
] as const;

export const SHOP_VOUCHER_FAQ_UI = [
  {
    id: "delivery",
    question: "איך מקבלים את השובר?",
    answer:
      "ניתן לקבל שובר דיגיטלי מיידי לשימוש בטלפון, או שובר מודפס באיסוף מהסטודיו במודיעין.",
  },
  {
    id: "validity",
    question: "מה תוקף השובר?",
    answer:
      "בדרך כלל שנה מיום הרכישה. אם צריך תאריך אחר, כותבים בוואטסאפ ומתאימים.",
  },
] as const;

export const SHOP_GEAR_TRANSPARENCY =
  "שקיפות לגבי מצב הציוד: כל הציוד המוצע למכירה הוא ציוד עבודה שלנו. אנחנו מכירים כל שריטה וכל כפתור. מוזמנים לבוא, לשמוע ולבדוק.";
