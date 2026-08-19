import { PODCAST_PACKAGES } from "@/lib/data/podcast-calculator";
import {
  getExVat,
  getScopeById,
  type PriceItemId,
  type PriceScope,
} from "@/lib/data/pricing-catalog";
import { STUDIO_PRICING } from "@/lib/data/services";

export type PackageHubCategory = "studio" | "podcast" | "events";

export type PackageHubItem = {
  id: string;
  category: PackageHubCategory;
  categoryLabel: string;
  name: string;
  description: string;
  priceExVat: number;
  catalogId?: PriceItemId;
  scope?: PriceScope;
  highlights: readonly string[];
  href: string;
  bookHref?: string;
};

const songTier = STUDIO_PRICING.tiers.find((t) => t.id === "song-classic");
const podcastAudio = PODCAST_PACKAGES.find((p) => p.id === "audio");
const festivalExVat = getExVat("festival_all_in");

export const PACKAGE_HUB_ITEMS: readonly PackageHubItem[] = [
  {
    id: "studio-song",
    category: "studio",
    categoryLabel: "אולפן",
    name: songTier?.name ?? "שיר מוכן באולפן",
    description:
      songTier?.description ??
      "הקלטה בלי לחץ זמן, מיקס ומאסטר - קובץ מוכן.",
    priceExVat: getExVat("cover_song"),
    catalogId: "cover_song",
    scope: songTier?.scope ?? getScopeById("cover_song"),
    highlights: songTier?.highlights ?? [
      "הקלטה מודרכת עם טיונינג ווקאלי",
      "מיקס בסיסי ועיבוד סופי",
      "קובץ מוכן לשיתוף",
    ],
    href: "/studio/pricing",
    bookHref: "/book",
  },
  {
    id: "podcast-audio",
    category: "podcast",
    categoryLabel: "פודקאסט",
    name: podcastAudio?.name ?? "פודקאסט אודיו",
    description: podcastAudio?.summary ?? "הקלטה ועריכה מקצועית לפרק אחד.",
    priceExVat: podcastAudio?.price ?? getExVat("podcast_audio"),
    catalogId: "podcast_audio",
    scope: getScopeById("podcast_audio"),
    highlights: podcastAudio?.features ?? [
      "הקלטה עד שעה באולפן",
      "עריכה, מיקס ומסירה לספוטיפיי",
    ],
    href: "/podcast",
    bookHref: "/book",
  },
  {
    id: "events-festival",
    category: "events",
    categoryLabel: "אירועים",
    name: 'חבילת "פסטיבל", הכל כלול',
    description:
      "DJ פרימיום, אולפן נייד באירוע, 3 אפקטים, פסקול כניסה וטכנאי צמוד.",
    priceExVat: festivalExVat,
    catalogId: "festival_all_in",
    scope: getScopeById("festival_all_in"),
    highlights: [
      "DJ פרימיום (5 שעות)",
      "אולפן הקלטות נייד באירוע",
      "3 אטרקציות לבחירה",
      "תיאום מסונכרן - ספק אחד",
    ],
    href: "/events/wedding-attractions-packages",
    bookHref: "/book/events",
  },
] as const;

export const PACKAGE_HUB_CATEGORY_LABELS: Record<PackageHubCategory, string> = {
  studio: "אולפן והקלטות",
  podcast: "פודקאסט",
  events: "חתונות ואירועים",
};
