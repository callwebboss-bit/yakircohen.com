import type { HubLinkItem } from "@/components/services/ServiceHubLinks";
import { getExVat } from "@/lib/data/pricing-catalog";
import { MOBILE_STUDIO_BASE_EX_VAT } from "@/lib/data/mobile-studio-booking";
import { PODCAST_STARTER_PRICE } from "@/lib/data/podcast-calculator";

const songFrom = getExVat("cover_song");
const blessingFrom = getExVat("blessing_recording");

/** ארבעה מסלולי המרה ראשיים ב-hub האולפן - עם מחיר עוגן */
export const STUDIO_HUB_PRIMARY_PATHS: readonly HubLinkItem[] = [
  {
    href: "/studio/recording-song-modiin",
    title: "הקלטת שיר באולפן",
    description: `שיר לחופה, בר מצווה או מתנה. ליווי באולפן ומסירה תוך 48 שעות. מ-${songFrom.toLocaleString("he-IL")} ₪ לפני מע״מ.`,
    ctaLabel: `הקלטת שיר מ-${songFrom.toLocaleString("he-IL")} ₪`,
    isFeatured: true,
  },
  {
    href: "/studio/blessings",
    title: "הקלטת ברכה",
    description: `ברכה, דרשה או אמירה. באולפן או מהבית - קובץ מוכן לאירוע. מ-${blessingFrom.toLocaleString("he-IL")} ₪ לפני מע״מ.`,
    ctaLabel: `הקלטת ברכה מ-${blessingFrom.toLocaleString("he-IL")} ₪`,
  },
  {
    href: "/studio/mobile-studio",
    title: "אולפן נייד",
    description: `האולפן מגיע אליכם. מ-${MOBILE_STUDIO_BASE_EX_VAT.toLocaleString("he-IL")} ₪ לפני מע״מ + תוספת אזור.`,
    ctaLabel: `אולפן נייד מ-${MOBILE_STUDIO_BASE_EX_VAT.toLocaleString("he-IL")} ₪`,
  },
  {
    href: "/podcast",
    title: "פודקאסט",
    description: `הקלטה באולפן במודיעין, עריכה וקובץ מוכן. מ-${PODCAST_STARTER_PRICE.toLocaleString("he-IL")} ₪ לפני מע״מ.`,
    ctaLabel: `פודקאסט מ-${PODCAST_STARTER_PRICE.toLocaleString("he-IL")} ₪`,
  },
] as const;

/** קישורים משניים לכל מסלול - בלי להעמיס */
export const STUDIO_HUB_PATH_EXTRAS: Record<
  string,
  readonly { href: string; label: string }[]
> = {
  "/studio/recording-song-modiin": [
    { href: "/studio/recording-song-modiin/gifts", label: "שיר במתנה" },
    { href: "/studio/pricing", label: "מחירון" },
  ],
  "/studio/blessings": [
    { href: "/studio/blessings/bride-groom-blessing", label: "ברכת חתן וכלה" },
    { href: "/studio/blessings/bar-mitzvah", label: "דרשה לבר מצווה" },
  ],
  "/studio/mobile-studio": [
    { href: "/business/on-site-studio", label: "אולפן בחברה" },
    { href: "/studio/studio-rehovot", label: "מרחובות" },
  ],
  "/podcast": [
    { href: "/podcast/podcast-recording", label: "הקלטת פודקאסט" },
    { href: "/podcast/podcast-editing", label: "עריכת פודקאסט" },
  ],
};
