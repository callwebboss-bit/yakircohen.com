import type { HubLinkItem } from "@/components/services/ServiceHubLinks";
import { TIME_CLAIMS } from "@/lib/data/conversion-copy";
import { formatFromPriceDual, getExVat, PODCAST_EXTRA_EDIT_NOTE } from "@/lib/data/pricing-catalog";

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
    /* החלטת הבעלים D63, 7.10.2026 (D43, D44) */
    description: `הפקה מלאה, ${TIME_CLAIMS.podcastSameSecond}, ועוד ${PODCAST_EXTRA_EDIT_NOTE}.`,
    fromPrice: `החל ${formatFromPriceDual(getExVat("full_podcast_production"))}`,
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
    /* עסקים: לפני מע״מ קודם */
    fromPrice: `החל ${formatFromPriceDual(getExVat("corp_podcast_retainer"), "business")} לחודש`,
  },
  {
    href: "/podcast/bulk-production",
    title: "פס ייצור לעסקים",
    description: "מקליטים, שולחים גולמי, מקבלים פרק מוכן וקליפים כל שבוע.",
    fromPrice: `החל ${formatFromPriceDual(getExVat("bulk_podcast_episode"), "business")} לפרק`,
  },
] as const;

/** קבוצה 2: אולפן וחלל הקלטה */
export const PODCAST_HUB_TRACKS_STUDIO: readonly HubLinkItem[] = [
  {
    href: "/podcast/podcast-studio-modiin",
    title: "השכרת סטודיו / אולפן במודיעין",
    /* WP3: 750 הוא חצי שעה חדר, קובץ גולמי בלי עריכה, ונאמר כך */
    description: "חצי שעה חדר, קובץ גולמי, בלי עריכה. חדר מבודד וליווי טכני.",
    fromPrice: `החל ${formatFromPriceDual(getExVat("studio_half_hour"))}`,
  },
  {
    href: "/podcast/mobile-podcast-at-home",
    title: "פודקאסט נייד עד הבית",
    description: "האולפן מגיע אליכם - בית, משרד או אירוע.",
  },
  /* ארבעת עמודי הערים היו בלי אף קישור פנימי: גוגל הגיע אליהם ממפת האתר
     בלבד. הכותרת היא ה-h1 של כל עמוד, כפי שהוא. */
  {
    href: "/podcast/shoham",
    title: "אולפן פודקאסט 10 דקות משוהם",
    description: "חדרי הקלטה עם ציוד מקצועי וחניה, נסיעה קצרה משוהם.",
  },
  {
    href: "/podcast/beit-shemesh",
    title: "אולפן פודקאסט 20 דקות מבית שמש",
    description: "חדרי הקלטה עם ציוד מקצועי וחניה, נסיעה קצרה מבית שמש.",
  },
  {
    href: "/podcast/rehovot",
    title: "אולפן פודקאסט 25 דקות מרחובות",
    description: "חדרי הקלטה עם ציוד מקצועי וחניה, נסיעה קצרה מרחובות.",
  },
  {
    href: "/podcast/jerusalem",
    title: "אולפן פודקאסט 30 דקות מירושלים",
    description: "חדרי הקלטה עם ציוד מקצועי וחניה, נסיעה קצרה מירושלים.",
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
