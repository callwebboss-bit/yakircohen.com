import type { PriceItemId } from "@/lib/data/pricing-catalog";

export type HomeQuickPath = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  suitedFor: string;
  /** מזהה בקטלוג. אין מחיר כתוב (WP0): כל כרטיס נקשר למוצר שהוא מתאר */
  priceId: PriceItemId;
  /** מה המחיר קונה, ליד המחיר. בלי זה "אירועים מ-" נקרא כמחיר של כל אירוע */
  priceLabel: string;
  href: string;
  utmCampaign: string;
};

/** 4 מסלולי כניסה מהירים - מחירים מ-pricing-catalog */
export const HOME_QUICK_PATHS: readonly HomeQuickPath[] = [
  {
    id: "studio",
    emoji: "🎙️",
    title: "אולפן והקלטות",
    description:
      "הקלטת שירים, ברכות לאירועים, עריכות דיגיטליות ותיקוני סאונד באולפן מקצועי.",
    suitedFor: "זוגות, מתנות לאירועים ויוצרים",
    priceId: "blessing_recording",
    priceLabel: "ברכה או אמירה",
    href: "/studio",
    utmCampaign: "home_quick_studio",
  },
  {
    id: "events",
    emoji: "🎉",
    title: "אירועים והנחיה",
    description:
      "שירותי DJ מקצועיים, מערכות הגברה מתקדמות, תאורה ואפקטים מיוחדים.",
    suitedFor: "חתונות, בר/בת מצווה ואירועי חברה",
    /* היה event_attraction_1 (אטרקציה בודדת) מתחת לכותרת שמדברת על DJ. WP2 */
    priceId: "dj_premium",
    priceLabel: "תקליטן מהצוות, 4 שעות, עד 300 מוזמנים",
    href: "/events",
    utmCampaign: "home_quick_events",
  },
  {
    id: "podcast",
    emoji: "🎧",
    title: "פודקאסט וקריינות",
    description:
      "הקלטת פודקאסט באולפן אקוסטי, עריכת אודיו דיגיטלית והפקת תוכן לעסקים.",
    suitedFor: "עסקים, מותגים ויוצרי תוכן עצמאיים",
    /* היה studio_half_hour (חצי שעה, קובץ גולמי בלי עריכה). WP3 */
    priceId: "podcast_audio",
    priceLabel: "פרק אודיו ערוך, מוכן להפצה",
    href: "/podcast",
    utmCampaign: "home_quick_podcast",
  },
  {
    id: "academy",
    emoji: "🤖",
    title: "AI וקורסים",
    description:
      "קורסי סאונד מעשיים, שחזור אודיו באמצעות בינה מלאכותית ושיפור איכות.",
    suitedFor: "מתחילים, מוזיקאים ובעלי עסקים",
    priceId: "academy_private_hour",
    priceLabel: "שיעור פרטי 60 דקות",
    href: "/academy/music-production",
    utmCampaign: "home_quick_academy",
  },
] as const;
