import {
  formatMeNis,
  formatNis,
  STUDIO_HALF_HOUR_NIS,
} from "@/lib/data/pricing";
import { TIME_CLAIMS } from "@/lib/data/conversion-copy";
import { SHOP_VOUCHER_IMAGES } from "@/lib/data/shop-page";
import { appendYcLeadTag } from "@/lib/yc-lead-tag";
import { buildWhatsAppHref } from "@/lib/whatsapp";

export type ShopVoucherTier = {
  id: string;
  title: string;
  range: string;
  priceExVat?: number;
  desc: string;
  utmCampaign: string;
  imageSrc: string;
  imageAlt: string;
  popular?: boolean;
};

export const SHOP_VOUCHER_TIERS: readonly ShopVoucherTier[] = [
  {
    id: "basic",
    title: "שובר בסיסי",
    range: formatMeNis(STUDIO_HALF_HOUR_NIS),
    priceExVat: STUDIO_HALF_HOUR_NIS,
    desc: "מתאים להקלטת שיר, ברכה קצרה או אטרקציה לאירוע.",
    utmCampaign: "shop_voucher_basic",
    imageSrc: SHOP_VOUCHER_IMAGES.basic,
    imageAlt: "הקלטה באולפן במודיעין",
  },
  {
    id: "premium",
    title: "שובר פרימיום",
    range: "₪2,500 - ₪3,200",
    desc: "שילוב אולפן ואפקטים, או חבילת אטרקציות. ליווי אישי.",
    utmCampaign: "shop_voucher_premium",
    imageSrc: SHOP_VOUCHER_IMAGES.premium,
    imageAlt: "חבילת אירוע ואולפן",
    popular: true,
  },
  {
    id: "custom",
    title: "שובר מותאם אישית",
    range: "לפי בחירה",
    desc: "בונים יחד חבילה לפי תקציב וסוג האירוע. תיאום בוואטסאפ.",
    utmCampaign: "shop_voucher_custom",
    imageSrc: SHOP_VOUCHER_IMAGES.custom,
    imageAlt: "מתחם יקיר כהן הפקות במודיעין",
  },
] as const;

export const SHOP_VOUCHER_FAQ_SCHEMA = [
  {
    question: "תוך כמה זמן מקבלים את השובר?",
    answer: `מיד. ${TIME_CLAIMS.voucherInstant} בוואטסאפ או במייל, מוכן להעביר למקבל/ת המתנה.`,
  },
  {
    question: "כמה זמן השובר בתוקף?",
    /* חוק הגנת הצרכן: שובר מתנה בתוקף שנתיים לפחות מיום ההנפקה (החלטת הבעלים
       7.10.2026). אותו תוקף מודפס בשובר שיוצא מ-/admin/sales, GIFT_VALIDITY_YEARS
       ב-lib/sales/voucher.ts, ובדיקה ב-voucher.test.ts שומרת על ההתאמה. */
    answer:
      "שנתיים מיום הרכישה. צריך יותר זמן? כותבים לנו בוואטסאפ ומאריכים.",
  },
  {
    question: "איך מממשים את השובר?",
    answer:
      "שולחים הודעה בוואטסאפ עם מספר השובר או שם המזמין, בוחרים תאריך פנוי ומתאמים פרטים. אפשר גם דרך עמוד ההזמנה.",
  },
  {
    question: "אפשר להעביר את השובר למישהו אחר?",
    answer:
      "כן. השובר ניתן למימוש על ידי המקבל או מי שהעבירו אליו, בכפוף לתיאום מראש.",
  },
] as const;

/* בלי savingLabel: "-10% / -15% / -20% חיסכון" לא נשענו על אף מחיר, ואין
   הנחה מעל 8% (החלטת הבעלים 3.10.2026, סבב שני). */
export const SHOP_BUNDLE_OFFERS = [
  {
    id: "studio-effects",
    title: "אולפן + אפקטים לאירוע",
    desc: "שילוב מנצח של הקלטות אולפן עם חבילת תאורה ועשן לאירוע שלכם.",
    utmCampaign: "shop_bundle_studio_effects",
  },
  {
    id: "dj-sound",
    title: "חבילת DJ + הגברה",
    desc: "פתרון מלא לאירועי בוטיק. עמדת DJ מקצועית עם מערכת סאונד מותאמת.",
    utmCampaign: "shop_bundle_dj_sound",
  },
  {
    id: "single-video",
    title: "הפקת סינגל + וידאו",
    desc: "הקלטה, מיקס, מאסטרינג וצילום קליפ אולפן מקצועי ביום אחד.",
    utmCampaign: "shop_bundle_single_video",
  },
] as const;

export type ShopLeadSection = "vouchers" | "bundles" | "used-gear" | "dj-used-gear";

/** קישור וואטסאפ לחנות. התג [YC:] יורד בקישור ללקוח (D67) */
export function buildShopWhatsAppHref(opts: {
  text: string;
  section: ShopLeadSection;
  tier: string;
  campaign: string;
  priceExVat?: number | null;
}): string {
  const tagged = appendYcLeadTag(opts.text, {
    service: "shop",
    source: `shop_${opts.section}_${opts.tier}`,
    step: 1,
    package: opts.tier,
    price: opts.priceExVat ?? null,
  });
  return buildWhatsAppHref({
    text: tagged,
    utm_source: "website",
    utm_campaign: opts.campaign,
  });
}

export const SHOP_ANSWER_SNIPPET = `שוברי מתנה לאולפן ואירועים במודיעין, החל מ-${formatNis(STUDIO_HALF_HOUR_NIS)} חצי שעה באולפן. גם ציוד הגברה ואולפן יד שנייה מההפקות. תיאום בוואטסאפ.`;
