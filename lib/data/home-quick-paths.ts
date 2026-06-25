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
    description: "שירים, ברכות, תיקונים",
    suitedFor: "זוגות, מתנות, יוצרים",
    priceId: "blessing_recording",
    href: "/studio",
    utmCampaign: "home_quick_studio",
  },
  {
    id: "events",
    emoji: "🎉",
    title: "אירועים והנחיה",
    description: "DJ, הגברה, אפקטים",
    suitedFor: "חתונות, אירועי חברה",
    priceId: "event_attraction_1",
    href: "/events",
    utmCampaign: "home_quick_events",
  },
  {
    id: "podcast",
    emoji: "🎧",
    title: "פודקאסט וקריינות",
    description: "הקלטה, עריכה, תוכן לעסקים",
    suitedFor: "עסקים, יוצרי תוכן",
    priceId: "studio_half_hour",
    href: "/podcast",
    utmCampaign: "home_quick_podcast",
  },
  {
    id: "academy",
    emoji: "🤖",
    title: "קורסים ו-AI",
    description: "שיעורים, שחזור, שיפור תמונות",
    suitedFor: "מתחילים, יוצרים, עסקים",
    fromPriceExVat: 990,
    href: "/academy/music-production",
    utmCampaign: "home_quick_academy",
  },
] as const;
