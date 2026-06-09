import {
  EVENT_ATTRACTION_FROM_NIS,
  PODCAST_EDITING_PER_HOUR_NIS,
  PRICES_EXCLUDE_VAT_NOTE,
  STUDIO_HALF_HOUR_NIS,
  STUDIO_ONE_HOUR_NIS,
} from "@/lib/data/pricing";
import { formatFromPriceDual, getExVat } from "@/lib/data/pricing-catalog";
import { PODCAST_PACKAGES } from "@/lib/data/podcast-calculator";

export type PricingHubSection = {
  id: string;
  title: string;
  description: string;
  href: string;
  bookHref?: string;
  rows: readonly { label: string; exVat: number; note?: string }[];
};

export const PRICING_HUB_SECTIONS: readonly PricingHubSection[] = [
  {
    id: "studio",
    title: "אולפן והקלטות",
    description: "שעות אולפן, ברכות ושירים לאירועים",
    href: "/studio/pricing",
    bookHref: "/book",
    rows: [
      { label: "חצי שעה באולפן", exVat: STUDIO_HALF_HOUR_NIS },
      { label: "שעת אולפן מלאה", exVat: STUDIO_ONE_HOUR_NIS },
    ],
  },
  {
    id: "podcast",
    title: "פודקאסט",
    description: "חבילות הקלטה ועריכה באולפן במודיעין",
    href: "/podcast",
    bookHref: "/book#podcast",
    rows: PODCAST_PACKAGES.map((p) => ({
      label: p.name,
      exVat: p.price,
      note: p.subtitle,
    })),
  },
  {
    id: "podcast-editing",
    title: "עריכת פודקאסט",
    description: "לפי שעת חומר גולמי",
    href: "/podcast/podcast-editing",
    rows: [
      {
        label: "עריכה לשעת חומר",
        exVat: PODCAST_EDITING_PER_HOUR_NIS,
      },
    ],
  },
  {
    id: "events",
    title: "אטרקציות לאירועים",
    description: "עשן, בועות, זיקוקים וחבילות משולבות",
    href: "/events/attractions",
    bookHref: "/book#events",
    rows: [
      {
        label: "אטרקציה בודדת",
        exVat: EVENT_ATTRACTION_FROM_NIS,
      },
      { label: "2 אטרקציות (חבילה)", exVat: getExVat("event_attraction_2") },
      { label: "3 אטרקציות (חבילה)", exVat: getExVat("event_attraction_3") },
      { label: "4+ אטרקציות + מתנה", exVat: getExVat("event_attraction_4"), note: "מצגת תמונות חינם" },
    ],
  },
  {
    id: "slideshows",
    title: "מצגות תמונות",
    description: "מצגות קולנועיות ומצגת גדילה ב-AI",
    href: "/photo-slideshow",
    bookHref: "/book",
    rows: [
      { label: "מצגת תמונות קולנועית", exVat: getExVat("cinematic_slideshow") },
      { label: "מצגת גדילה AI — 30 תמונות", exVat: getExVat("growth_slideshow_30") },
      { label: "מצגת גדילה AI — 50 תמונות", exVat: getExVat("growth_slideshow_50") },
      { label: "מצגת גדילה AI — 70 תמונות", exVat: getExVat("growth_slideshow_70") },
      { label: "מצגת גדילה AI — 100 תמונות", exVat: getExVat("growth_slideshow_100") },
    ],
  },
  {
    id: "online",
    title: "שירותי AI מקוונים",
    description: "עריכה ושחזור קול מרחוק",
    href: "/online/online-ai-pricing",
    bookHref: "/book#online",
    rows: [
      { label: "ניקוי רעשים בסיסי", exVat: getExVat("ai_noise_basic"), note: "להקלטות קצרות עם רעש קבוע" },
      { label: "שיפור קול חכם", exVat: getExVat("ai_voice_enhance"), note: "הבהרה ועקביות לפודקאסט" },
      { label: "שחזור קול מלא", exVat: getExVat("ai_voice_restore"), note: "פרק או ראיון עד שעה" },
      { label: "הצלת הקלטות פגומות", exVat: getExVat("damaged_recording_rescue"), note: "שחזור לכל 5 דקות" },
    ],
  },
] as const;

export function formatHubPriceRow(exVat: number): string {
  return formatFromPriceDual(exVat).replace("כרגע: ", "החל ");
}

export { PRICES_EXCLUDE_VAT_NOTE };
