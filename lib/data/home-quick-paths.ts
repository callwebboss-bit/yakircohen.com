import type { PriceItemId } from "@/lib/data/pricing-catalog";

export type HomeQuickPath = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  suitedFor: string;
  /** מזהה בקטלוג - או fromPriceExVat כשאין פריט מתאים */
  priceId?: PriceItemId;
  fromPriceExVat?: number;
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
    priceId: "event_attraction_1",
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
    priceId: "studio_half_hour",
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
    fromPriceExVat: 990,
    href: "/academy/music-production",
    utmCampaign: "home_quick_academy",
  },
] as const;
