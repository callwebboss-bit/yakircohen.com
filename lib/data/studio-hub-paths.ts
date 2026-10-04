import type { HubLinkItem } from "@/components/services/ServiceHubLinks";
import { getExVat } from "@/lib/data/pricing-catalog";
import { withVat } from "@/lib/data/pricing";
import { MOBILE_STUDIO_BASE_EX_VAT } from "@/lib/data/mobile-studio-booking";
import { PODCAST_STARTER_PRICE } from "@/lib/data/podcast-calculator";

/* מחירים לצרכן כולל מע״מ (החלטת הבעלים 2.10.2026). העמוד מציג גם את טופס
   השיר, שמוביל בכולל מע״מ, ושני סגנונות באותו עמוד נקראים כ"אותו מחיר". */
const nis = (exVat: number) => `${withVat(exVat).toLocaleString("he-IL")} ₪`;
const song = nis(getExVat("song_recording"));
const blessing = nis(getExVat("blessing_recording"));
const mobile = nis(MOBILE_STUDIO_BASE_EX_VAT);
const podcast = nis(PODCAST_STARTER_PRICE);

/** ארבעה מסלולי המרה ראשיים ב-hub האולפן - עם מחיר עוגן */
export const STUDIO_HUB_PRIMARY_PATHS: readonly HubLinkItem[] = [
  {
    href: "/studio/recording-song-modiin",
    title: "הקלטת שיר באולפן",
    description: `שיר לחופה, בר מצווה או מתנה. הקלטה, מיקס ומאסטר בסשן של שעה. ${song} כולל מע״מ.`,
    ctaLabel: `הקלטת שיר ב-${song}`,
    isFeatured: true,
  },
  {
    href: "/studio/blessings",
    title: "הקלטת ברכה",
    description: `ברכה, דרשה או אמירה. באולפן או מהבית - קובץ מוכן לאירוע. מ-${blessing} כולל מע״מ.`,
    ctaLabel: `הקלטת ברכה מ-${blessing}`,
  },
  {
    href: "/studio/mobile-studio",
    title: "אולפן נייד",
    description: `האולפן מגיע אליכם. מ-${mobile} כולל מע״מ, ותוספת אזור.`,
    ctaLabel: `אולפן נייד מ-${mobile}`,
  },
  {
    href: "/podcast",
    title: "פודקאסט",
    description: `הקלטה באולפן במודיעין, עריכה וקובץ מוכן. מ-${podcast} כולל מע״מ.`,
    ctaLabel: `פודקאסט מ-${podcast}`,
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
    { href: "/podcast/mobile-podcast-at-home", label: "פודקאסט נייד" },
    { href: "/business/on-site-studio", label: "אולפן בחברה" },
  ],
  "/podcast": [
    { href: "/podcast/podcast-recording", label: "הקלטת פודקאסט" },
    { href: "/podcast/podcast-editing", label: "עריכת פודקאסט" },
  ],
};
