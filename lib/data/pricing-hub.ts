import {
  EVENT_ATTRACTION_FROM_NIS,
  formatNis,
  PODCAST_EDITING_PER_HOUR_NIS,
  PRICES_EXCLUDE_VAT_NOTE,
  STUDIO_HALF_HOUR_NIS,
  STUDIO_ONE_HOUR_NIS,
  withVat,
} from "@/lib/data/pricing";
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
      { label: "2 אטרקציות (חבילה)", exVat: 3200 },
      { label: "3 אטרקציות (חבילה)", exVat: 4450 },
      { label: "4+ אטרקציות + מתנה", exVat: 5500, note: "מצגת תמונות חינם" },
    ],
  },
] as const;

export function formatHubPriceRow(exVat: number): string {
  return `${formatNis(exVat)} · כולל מע״מ ${formatNis(withVat(exVat))}`;
}

export { PRICES_EXCLUDE_VAT_NOTE };
