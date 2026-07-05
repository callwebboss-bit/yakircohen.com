import type { HubLinkItem } from "@/components/services/ServiceHubLinks";
import { TIME_CLAIMS } from "@/lib/data/conversion-copy";

/** קבוצה 1: הפקת תוכן מוכן - פרקים ותכנים */
export const PODCAST_HUB_TRACKS_CONTENT: readonly HubLinkItem[] = [
  {
    href: "/podcast/podcast-with-grandpa",
    title: "פודקאסט עם סבא וסבתא",
    description: "חוויה משפחתית - פודקאסט + הקלטת שיר, קובץ דיגיטלי שנשמר.",
  },
  {
    href: "/podcast/podcast-recording",
    title: "צילום והקלטת פודקאסט",
    description: `הפקה מלאה, פרק ${TIME_CLAIMS.podcastDelivery24h}, החל מ-2,500 ₪.`,
    fromPrice: "החל מ-2,500 ₪ + מע״מ",
  },
  {
    href: "/podcast/podcast-production",
    title: "הפקת פודקאסט מא׳ עד ת׳",
    description: "ליווי ארוך טווח - תכנון, מיתוג והפצה.",
  },
  {
    href: "/podcast/corporate-podcast",
    title: "פודקאסט ארגוני לחברות",
    description: "מיתוג מעסיק ושיווק תוכן - הפקה מלאה, ספוטיפיי, חשבונית מס.",
    fromPrice: "החל מ-4,800 ₪/חודש + מע״מ",
  },
  {
    href: "/podcast/bulk-production",
    title: "פס ייצור לעסקים",
    description: "מקליטים, שולחים גולמי, מקבלים פרק מוכן וקליפים כל שבוע.",
    fromPrice: "החל מ-950 ₪/פרק + מע״מ",
  },
] as const;

/** קבוצה 2: אולפן וחלל הקלטה */
export const PODCAST_HUB_TRACKS_STUDIO: readonly HubLinkItem[] = [
  {
    href: "/podcast/podcast-studio-modiin",
    title: "השכרת סטודיו / אולפן במודיעין",
    description: "הקלטה שקטה, חדר מבודד וליווי טכני - מ-750 ₪.",
    fromPrice: "החל מ-750 ₪ + מע״מ",
  },
  {
    href: "/podcast/mobile-podcast-at-home",
    title: "פודקאסט נייד עד הבית",
    description: "האולפן מגיע אליכם - בית, משרד או אירוע.",
  },
] as const;

/** קבוצה 3: עריכה ותמיכה */
export const PODCAST_HUB_TRACKS_SUPPORT: readonly HubLinkItem[] = [
  {
    href: "/podcast/podcast-editing",
    title: "עריכת פודקאסט מלאה",
    description: "ניקוי, שיפור קול וחיתוך - פרק מוכן לפרסום.",
  },
  {
    href: "/podcast/faq",
    title: "שאלות ותשובות",
    description: "מחירים, הכנה להקלטה וזמני סטודיו.",
  },
] as const;

export const PODCAST_HUB_TRACKS: readonly HubLinkItem[] = [
  ...PODCAST_HUB_TRACKS_CONTENT,
  ...PODCAST_HUB_TRACKS_STUDIO,
  ...PODCAST_HUB_TRACKS_SUPPORT,
] as const;
