import { SERVICE_IMAGES_BASE } from "@/lib/data/services";

/**
 * Dedicated shop assets under public/images/shop/ (generate: npm run generate:shop-images).
 * Replace files in place with product shots when ready — same filenames.
 */
export const SHOP_VOUCHER_IMAGES = {
  basic: "/images/shop/voucher-basic.webp",
  premium: "/images/shop/voucher-premium.webp",
  custom: "/images/shop/voucher-custom.webp",
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
    id: "rcf745",
    title: "הגברה RCF",
    subtitle: "רמקולים ומערכות סאונד לאירועים.",
    imageSrc: "/images/shop/gear-rcf745.webp",
    imageAlt: "ציוד הגברה מקצועי לאירועים",
  },
  {
    id: "traktor-s4",
    title: "קונטרולר DJ",
    subtitle: "עמדות DJ, פלטות ואביזרים.",
    imageSrc: "/images/shop/gear-traktor-s4.webp",
    imageAlt: "עמדת די ג'יי וציוד נלווה",
  },
  {
    id: "krk",
    title: "ציוד אולפן",
    subtitle: "מיקרופונים, ממשקים ומוניטורים.",
    imageSrc: "/images/shop/gear-krk.webp",
    imageAlt: "ציוד אולפן מקצועי",
  },
  {
    id: "effects",
    title: "אפקטים",
    subtitle: "מכונות עשן, בועות ופירוטכניקה.",
    imageSrc: "/images/shop/gear-effects.webp",
    imageAlt: "אפקטים לאירועים",
  },
  {
    id: "led",
    title: "תאורת LED",
    subtitle: "פנסי במה, אפקטים ותאורה חכמה.",
    imageSrc: `${SERVICE_IMAGES_BASE}/events/attractions/led-booth/יקיר כהן באירוע.webp`,
    imageAlt: "תאורת LED ועמדת לד באירוע",
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
