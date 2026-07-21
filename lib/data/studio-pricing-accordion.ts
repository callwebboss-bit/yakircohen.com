import { buildBookHref } from "@/lib/book-url";
import { MOBILE_GEO_FEES, MOBILE_STUDIO_BASE_EX_VAT } from "@/lib/data/mobile-studio-booking";
import { getExVat } from "@/lib/data/pricing-catalog";
import { PODCAST_STARTER_PRICE } from "@/lib/data/podcast-calculator";
import { PRICES_EXCLUDE_VAT_NOTE } from "@/lib/data/pricing";
import { buildYcLeadTag } from "@/lib/yc-lead-tag";

export type StudioPricingAccordionPanel = {
  id: string;
  title: string;
  /** מחיר עוגן לפני מע״מ */
  priceExVat: number;
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

const songPrice = getExVat("cover_song");
const blessingPrice = getExVat("blessing_recording");
const studioHourPrice = getExVat("studio_hour");
const podcastVideoPrice = getExVat("podcast_video");
const podcastEditPrice = getExVat("podcast_editing_hour");

const geoLines = (Object.keys(MOBILE_GEO_FEES) as Array<keyof typeof MOBILE_GEO_FEES>).map(
  (id) => {
    const geo = MOBILE_GEO_FEES[id];
    const total = MOBILE_STUDIO_BASE_EX_VAT + geo.fee;
    return geo.fee === 0
      ? `${geo.label}: ללא תוספת - ${total.toLocaleString("he-IL")} ₪`
      : `${geo.label}: +${geo.fee.toLocaleString("he-IL")} ₪ - סה״כ ${total.toLocaleString("he-IL")} ₪`;
  },
);

/**
 * אקורדיון מחיר סטודיו/פודקאסט - עוגנים מאושרים בלבד.
 * לא כולל mobile_studio=5000 (אירועים) ולא חבילות אירוע.
 */
export const STUDIO_PRICING_ACCORDION_PANELS: readonly StudioPricingAccordionPanel[] = [
  {
    id: "song",
    title: "הקלטת שיר באולפן",
    priceExVat: songPrice,
    priceNote: "לפני מע״מ - לשיר על פלייבק (קאבר)",
    intentNote:
      "מסלול לשיר בלבד (קאבר / שיר לאירוע). לא ברכה ולא קריינות - לברכה ראו פאנל נפרד.",
    suitedFor: "שיר לחופה, בר מצווה, מתנה או קאבר באולפן במודיעין",
    includes: [
      "סשן באולפן במודיעין עם ליווי ווקאלי",
      "תיקון זיופים ועריכת סאונד",
      "קובץ WAV + MP3",
    ],
    extras: ["עיבוד / שיר מקורי - חבילות גבוהות יותר", "קליפ וידאו - בתוספת"],
    delivery: "בדרך כלל תוך 48 שעות",
    serviceHref: "/studio/recording-song-modiin",
    bookHref: buildBookHref("studio", { catalog: "cover_song" }),
    closerService: "recording",
    whatsappBody: `שלום, מעוניין/ת בהקלטת שיר באולפן במודיעין (שיר בלבד) מ-${songPrice.toLocaleString("he-IL")} ₪ לפני מע״מ`,
  },
  {
    id: "blessing",
    title: "הקלטת ברכה",
    priceExVat: blessingPrice,
    priceNote: "לפני מע״מ - ברכה / אמירה קצרה",
    suitedFor: "ברכה, דרשה קצרה או אמירה - באולפן או מהבית",
    includes: [
      "הקלטה באולפן או הנחיות מהבית",
      "עריכת סאונד בסיסית",
      "קובץ מוכן לאירוע",
    ],
    extras: ["מוזיקת רקע", "תיקון זיופים לפי צורך"],
    delivery: "בדרך כלל תוך 24-48 שעות",
    serviceHref: "/studio/blessings",
    bookHref: buildBookHref("studio", { catalog: "blessing_recording" }),
    closerService: "blessing",
    whatsappBody: `שלום, מעוניין/ת בהקלטת ברכה מ-${blessingPrice.toLocaleString("he-IL")} ₪ לפני מע״מ`,
  },
  {
    id: "mobile",
    title: "אולפן נייד",
    priceExVat: MOBILE_STUDIO_BASE_EX_VAT,
    priceNote: "לפני מע״מ - בסיס + תוספת אזור",
    suitedFor: "הקלטה בבית, במשרד או במוסד - בלי נסיעה למודיעין",
    includes: [
      `בסיס ${MOBILE_STUDIO_BASE_EX_VAT.toLocaleString("he-IL")} ₪ לפני מע״מ`,
      "ציוד, אקוסטיקה ניידת וליווי במקום",
      ...geoLines,
    ],
    extras: ["קליפ DSLR - בתוספת", "לא כולל חבילת אירוע בשטח"],
    delivery: "תיאום תאריך ומיקום בוואטסאפ - בדרך כלל מענה תוך שעה בשעות פעילות",
    serviceHref: "/studio/mobile-studio",
    bookHref: buildBookHref("studio"),
    closerService: "mobile_studio_home",
    whatsappBody: `שלום, מעוניין/ת באולפן נייד מ-${MOBILE_STUDIO_BASE_EX_VAT.toLocaleString("he-IL")} ₪ לפני מע״מ + תוספת אזור - תאריך ומיקום`,
  },
  {
    id: "podcast-hub",
    title: "פודקאסט באולפן",
    priceExVat: PODCAST_STARTER_PRICE,
    priceNote: "לפני מע״מ - הקלטה עד חצי שעה (כניסה)",
    suitedFor: "פיילוט, פרק קצר או התחלה באולפן במודיעין",
    includes: [
      "זמן אולפן עד חצי שעה",
      "ציוד מקצועי וליווי טכני",
      "קובץ מההקלטה",
    ],
    extras: [
      `פודקאסט וידאו מ-${podcastVideoPrice.toLocaleString("he-IL")} ₪ - פאנל נפרד`,
      "עריכה מלאה - לפי חבילה",
    ],
    delivery: "בדרך כלל פרק מוכן להעלאה תוך 24 שעות בחבילות מלאות",
    serviceHref: "/podcast",
    bookHref: buildBookHref("podcast", { catalog: "studio_half_hour" }),
    closerService: "podcast",
    whatsappBody: `שלום, מעוניין/ת בפודקאסט באולפן מ-${PODCAST_STARTER_PRICE.toLocaleString("he-IL")} ₪ לפני מע״מ`,
  },
  {
    id: "podcast-video",
    title: "פודקאסט וידאו",
    priceExVat: podcastVideoPrice,
    priceNote: "לפני מע״מ - הקלטה רב-מצלמת",
    suitedFor: "ראיונות ונוכחות ביוטיוב + אודיו לספוטיפיי",
    includes: [
      "הקלטה רב-מצלמת באולפן",
      "עריכה ליוטיוב + אודיו להפצה",
      "תאורה וסאונד מקצועיים",
    ],
    extras: ["רילס / חבילת תוכן - בתוספת"],
    delivery: "בדרך כלל תוך 24 שעות עד מספר ימים לפי היקף",
    serviceHref: "/podcast",
    bookHref: buildBookHref("podcast", { catalog: "podcast_video" }),
    closerService: "podcast_video",
    whatsappBody: `שלום, מעוניין/ת בפודקאסט וידאו מ-${podcastVideoPrice.toLocaleString("he-IL")} ₪ לפני מע״מ`,
  },
  {
    id: "podcast-editing",
    title: "עריכת פודקאסט",
    priceExVat: podcastEditPrice,
    priceNote: "לפני מע״מ - לשעת חומר גולמי",
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
    whatsappBody: `שלום, יש לי קובץ לעריכת פודקאסט מ-${podcastEditPrice.toLocaleString("he-IL")} ₪ לשעת חומר לפני מע״מ`,
  },
  {
    id: "studio-hour",
    title: "שעת אולפן",
    priceExVat: studioHourPrice,
    priceNote: "לפני מע״מ - שעת חדר באולפן במודיעין",
    suitedFor: "מי שצריך זמן אולפן לפי שעה - שירה, דיבור או פרויקט מותאם",
    includes: ["שעת אולפן עם ציוד מקצועי", "ליווי טכני במקום"],
    extras: ["עריכה - בתוספת לפי היקף"],
    delivery: "לפי הפרויקט",
    serviceHref: "/studio/recording-studio",
    bookHref: buildBookHref("studio", { catalog: "studio_hour" }),
    closerService: "studio_hour",
    whatsappBody: `שלום, מעוניין/ת בשעת אולפן מ-${studioHourPrice.toLocaleString("he-IL")} ₪ לפני מע״מ`,
  },
] as const;

export const STUDIO_PRICING_ACCORDION_DISCLAIMER = PRICES_EXCLUDE_VAT_NOTE;

export function buildAccordionWhatsAppText(panel: StudioPricingAccordionPanel): string {
  return `${panel.whatsappBody}\n${buildYcLeadTag({
    service: panel.closerService,
    price: panel.priceExVat,
    source: "studio_pricing_accordion",
    step: 1,
  })}`;
}
