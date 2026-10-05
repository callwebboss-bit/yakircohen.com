import { buildBookHref } from "@/lib/book-url";
import { MOBILE_GEO_FEES, MOBILE_STUDIO_BASE_EX_VAT } from "@/lib/data/mobile-studio-booking";
import { getExVat } from "@/lib/data/pricing-catalog";
import { PODCAST_STARTER_PRICE } from "@/lib/data/podcast-calculator";
import { withVat } from "@/lib/data/pricing";
import { buildYcLeadTag } from "@/lib/yc-lead-tag";

export type StudioPricingAccordionPanel = {
  id: string;
  title: string;
  /** מחיר עוגן לפני מע״מ (לסכמה ולתג). בתצוגה מוצג כולל מע״מ. */
  priceExVat: number;
  /** היקף בלבד, בלי מילת מע״מ. הרכיב מוסיף "כולל מע״מ" */
  priceNote: string;
  intentNote?: string;
  suitedFor: string;
  includes: readonly string[];
  extras: readonly string[];
  delivery: string;
  serviceHref: string;
  bookHref: string;
  closerService: string;
  whatsappBody: string;
};

/* האקורדיון מוצג רק ב-/studio/pricing, ליד טופס השיר שמוביל בכולל מע״מ,
   ולכן כל הסכומים בטקסט כאן כוללים מע״מ (החלטת הבעלים 2.10.2026) */
const nis = (exVat: number) => `${withVat(exVat).toLocaleString("he-IL")} ₪`;

const songPrice = getExVat("song_recording");
const blessingPrice = getExVat("blessing_recording");
const studioHourPrice = getExVat("studio_hour");
const podcastVideoPrice = getExVat("podcast_video");
const podcastEditPrice = getExVat("podcast_editing_hour");

const geoLines = (Object.keys(MOBILE_GEO_FEES) as Array<keyof typeof MOBILE_GEO_FEES>).map(
  (id) => {
    const geo = MOBILE_GEO_FEES[id];
    const total = MOBILE_STUDIO_BASE_EX_VAT + geo.fee;
    return geo.fee === 0
      ? `${geo.label}: ללא תוספת - ${nis(total)}`
      : `${geo.label}: +${nis(geo.fee)} - סה״כ ${nis(total)}`;
  },
);

/**
 * אקורדיון מחיר סטודיו/פודקאסט - עוגנים מאושרים בלבד.
 * לא כולל חבילות אירוע. האולפן הנייד הוא פריט אחד (mobile_podcast_at_home).
 */
export const STUDIO_PRICING_ACCORDION_PANELS: readonly StudioPricingAccordionPanel[] = [
  {
    id: "song",
    title: "הקלטת שיר באולפן",
    priceExVat: songPrice,
    priceNote: "הקלטה, מיקס ומאסטר. תיקון זיופים בתוספת",
    intentNote:
      "מסלול לשיר מוכן (קאבר / שיר לאירוע). לא ברכה ולא שעת חדר - לברכה ראו פאנל נפרד.",
    suitedFor: "שיר לחופה, בר מצווה, מתנה או קאבר באולפן במודיעין",
    includes: [
      "סשן של שעה באולפן במודיעין",
      "הקלטה, מיקס ומאסטר",
    ],
    extras: [
      `תיקון זיופים וטכנאי שמכוון ומנחה - ${nis(getExVat("song_pitch_coaching"))}`,
      `קליפ ערוך מהסשן - ${nis(getExVat("studio_session_clip_edited"))}`,
      "עיבוד / שיר מקורי - הפקת סינגל",
    ],
    delivery: "השיר אצלכם בסוף הסשן",
    serviceHref: "/studio/recording-song-modiin",
    bookHref: buildBookHref("studio", { catalog: "song_recording" }),
    closerService: "recording",
    whatsappBody: `שלום, מעוניין/ת בהקלטת שיר באולפן במודיעין (שיר בלבד) מ-${nis(songPrice)} כולל מע״מ`,
  },
  {
    id: "blessing",
    title: "הקלטת ברכה",
    priceExVat: blessingPrice,
    /* החלטות 5.10.2026 (ברכות) */
    priceNote: "ברכה או דרשה, אותו מחיר, בלי הגבלת זמן",
    suitedFor: "ברכה, דרשה או אמירה - באולפן או מהבית",
    includes: [
      "הקלטה באולפן או מהבית, בלי הגבלת זמן",
      "הנחיה, עריכה, תיקונים וליווי",
      "מוזיקת רקע",
      "קובץ מוכן לאירוע",
    ],
    extras: [
      `כל דובר נוסף - ${nis(getExVat("blessing_extra_participant"))}`,
      `כתיבה מחדש של הטקסט - ${nis(getExVat("blessing_text_rewrite"))}`,
      "תיקון זיופים בתוספת, לא במחיר הבסיס",
    ],
    delivery: "בדרך כלל תוך 24-48 שעות",
    serviceHref: "/studio/blessings",
    bookHref: buildBookHref("studio", { catalog: "blessing_recording" }),
    closerService: "blessing",
    whatsappBody: `שלום, מעוניין/ת בהקלטת ברכה מ-${nis(blessingPrice)} כולל מע״מ`,
  },
  {
    id: "mobile",
    title: "אולפן נייד",
    priceExVat: MOBILE_STUDIO_BASE_EX_VAT,
    priceNote: "בסיס + תוספת אזור",
    suitedFor: "הקלטה בבית, במשרד או במוסד - בלי נסיעה למודיעין",
    includes: [
      `בסיס ${nis(MOBILE_STUDIO_BASE_EX_VAT)} כולל מע״מ`,
      "ציוד, אקוסטיקה ניידת וליווי במקום",
      ...geoLines,
    ],
    extras: ["קליפ DSLR - בתוספת", "לא כולל חבילת אירוע בשטח"],
    delivery: "תיאום תאריך ומיקום בוואטסאפ - מענה אנושי בשעות הפעילות",
    serviceHref: "/studio/mobile-studio",
    bookHref: buildBookHref("studio"),
    closerService: "mobile_studio_home",
    whatsappBody: `שלום, מעוניין/ת באולפן נייד מ-${nis(MOBILE_STUDIO_BASE_EX_VAT)} כולל מע״מ + תוספת אזור - תאריך ומיקום`,
  },
  {
    id: "podcast-hub",
    title: "פודקאסט באולפן",
    priceExVat: PODCAST_STARTER_PRICE,
    priceNote: "הקלטה עד חצי שעה (כניסה)",
    suitedFor: "פיילוט, פרק קצר או התחלה באולפן במודיעין",
    includes: [
      "זמן אולפן עד חצי שעה",
      "ציוד מקצועי וליווי טכני",
      "קובץ מההקלטה",
    ],
    extras: [
      `פודקאסט וידאו מ-${nis(podcastVideoPrice)} - פאנל נפרד`,
      "עריכה מלאה - לפי חבילה",
    ],
    delivery: "הפרק אצלכם באותה שנייה שמסיימים להקליט",
    serviceHref: "/podcast",
    bookHref: buildBookHref("podcast", { catalog: "studio_half_hour" }),
    closerService: "podcast",
    whatsappBody: `שלום, מעוניין/ת בפודקאסט באולפן מ-${nis(PODCAST_STARTER_PRICE)} כולל מע״מ`,
  },
  {
    id: "podcast-video",
    title: "פודקאסט וידאו",
    priceExVat: podcastVideoPrice,
    priceNote: "הקלטה רב-מצלמת",
    suitedFor: "ראיונות ונוכחות ביוטיוב + אודיו לספוטיפיי",
    includes: [
      "הקלטה רב-מצלמת באולפן",
      "עריכה ליוטיוב + אודיו להפצה",
      "תאורה וסאונד מקצועיים",
    ],
    extras: ["רילס / חבילת תוכן - בתוספת"],
    delivery: "הפרק אצלכם באותה שנייה שמסיימים להקליט",
    serviceHref: "/podcast",
    bookHref: buildBookHref("podcast", { catalog: "podcast_video" }),
    closerService: "podcast_video",
    whatsappBody: `שלום, מעוניין/ת בפודקאסט וידאו מ-${nis(podcastVideoPrice)} כולל מע״מ`,
  },
  {
    id: "podcast-editing",
    title: "עריכת פודקאסט",
    priceExVat: podcastEditPrice,
    priceNote: "לשעת חומר גולמי",
    suitedFor: "מי שכבר יש לו הקלטה (זום / בית / ארכיון) ורוצה פרק מוכן",
    includes: [
      "ניקוי רעשים ו-EQ",
      "חיתוך, איזון ונורמליזציה",
      "MP3 מוכן להעלאה + סבב תיקונים אחד",
    ],
    extras: ["מוזיקת פתיחה/סיום", "סנכרון כמה מיקרופונים"],
    delivery: "בדרך כלל תוך 24-48 שעות",
    serviceHref: "/podcast/podcast-editing",
    bookHref: buildBookHref("podcast", { catalog: "podcast_editing_hour" }),
    closerService: "podcast_editing",
    whatsappBody: `שלום, יש לי קובץ לעריכת פודקאסט מ-${nis(podcastEditPrice)} לשעת חומר כולל מע״מ`,
  },
  {
    id: "studio-hour",
    title: "שעת אולפן",
    priceExVat: studioHourPrice,
    priceNote: "שעת חדר באולפן במודיעין",
    suitedFor: "מי שצריך זמן אולפן לפי שעה - שירה, דיבור או פרויקט מותאם",
    includes: ["שעת אולפן עם ציוד מקצועי", "ליווי טכני במקום"],
    extras: ["עריכה - בתוספת לפי היקף"],
    delivery: "לפי הפרויקט",
    serviceHref: "/studio/recording-studio",
    bookHref: buildBookHref("studio", { catalog: "studio_hour" }),
    closerService: "studio_hour",
    whatsappBody: `שלום, מעוניין/ת בשעת אולפן מ-${nis(studioHourPrice)} כולל מע״מ`,
  },
] as const;

export const STUDIO_PRICING_ACCORDION_DISCLAIMER = "המחירים כוללים מע״מ";

export function buildAccordionWhatsAppText(panel: StudioPricingAccordionPanel): string {
  return `${panel.whatsappBody}\n${buildYcLeadTag({
    service: panel.closerService,
    price: panel.priceExVat,
    source: "studio_pricing_accordion",
    step: 1,
  })}`;
}
