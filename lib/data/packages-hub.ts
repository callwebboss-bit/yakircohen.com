import { PODCAST_PACKAGES } from "@/lib/data/podcast-calculator";
import { formatFromPriceDual, getExVat } from "@/lib/data/pricing-catalog";
import { STUDIO_PRICING } from "@/lib/data/services";
import { formatNis } from "@/lib/data/pricing";

export type PackageHubCategory = "studio" | "podcast" | "events";

export type PackageHubItem = {
  id: string;
  category: PackageHubCategory;
  categoryLabel: string;
  name: string;
  description: string;
  priceLabel: string;
  priceNote?: string;
  highlights: readonly string[];
  href: string;
  bookHref?: string;
};

const songTier = STUDIO_PRICING.tiers.find((t) => t.id === "song-package");
const podcastAudio = PODCAST_PACKAGES.find((p) => p.id === "audio");
const festivalExVat = getExVat("festival_all_in");

export const PACKAGE_HUB_ITEMS: readonly PackageHubItem[] = [
  {
    id: "studio-song",
    category: "studio",
    categoryLabel: "אולפן",
    name: songTier?.name ?? "חבילת הקלטת שיר",
    description:
      songTier?.description ??
      "החבילה הפופולרית לשיר במתנה או הקלטה אישית.",
    priceLabel: songTier?.price ?? formatFromPriceDual(getExVat("song_package")),
    priceNote: songTier?.priceNote,
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
    priceLabel: podcastAudio
      ? formatNis(podcastAudio.price)
      : formatFromPriceDual(getExVat("podcast_audio")),
    priceNote: podcastAudio?.subtitle,
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
    name: 'חבילת "פסטיבל"  -  הכל כלול',
    description:
      "DJ פרימיום, אולפן נייד באירוע, 3 אפקטים, פסקול כניסה וטכנאי צמוד.",
    priceLabel: formatNis(festivalExVat),
    priceNote: "לפני מע״מ",
    highlights: [
      "DJ פרימיום (5 שעות)",
      "אולפן הקלטות נייד באירוע",
      "3 אטרקציות לבחירה",
      "תיאום מסונכרן - ספק אחד",
    ],
    href: "/events/wedding-attractions-packages",
  },
] as const;

export const PACKAGE_HUB_CATEGORY_LABELS: Record<PackageHubCategory, string> = {
  studio: "אולפן והקלטות",
  podcast: "פודקאסט",
  events: "חתונות ואירועים",
};
