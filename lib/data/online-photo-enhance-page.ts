import type { ProcessStep } from "@/components/marketing/ProcessSteps";
import { withVat } from "@/lib/data/pricing";
import { getExVat, type PriceItemId } from "@/lib/data/pricing-catalog";
import { formatConsumerPrice } from "@/lib/data/pricing-display";

export const PHOTO_ENHANCE_PROCESS_STEPS: ProcessStep[] = [
  {
    number: 1,
    title: "שולחים את התמונות",
    description: "דרך וואטסאפ, מייל או Google Drive - סרוקות, מהטלפון או קבצים ישנים.",
  },
  {
    number: 2,
    title: "עיבוד AI",
    description: "הגדלת רזולוציה, חדות, שיפור צבעים וניקוי רעשים - הכל אוטומטי ומהיר.",
  },
  {
    number: 3,
    title: "בדיקה ותיקון ידני",
    description: "בודקים כל תמונה - לא רק מעלים ושוכחים. מתקנים ידנית בפוטושופ אם צריך.",
  },
  {
    number: 4,
    title: "מקבלים תמונות משודרגות",
    description: "קובץ JPG/PNG באיכות גבוהה, מוכן להדפסה או שימוש דיגיטלי. אם לא מרוצים - נתקן.",
  },
];

export const PHOTO_ENHANCE_AI_FEATURES: readonly string[] = [
  "הגדלת רזולוציה (upscaling) - מגדיל את התמונה פי 2-4 מבלי לאבד איכות",
  "תיקון חדות - הופך תמונה מטושטשת לחדה",
  "שיפור צבעים - מחזיר חיים לתמונות דהויות",
  'הסרת רעשים (grain/noise) - מנקה את ה"גרעיניות" של תמונות ישנות',
  "שיחזור פרטים - ה-AI ממציא פרטים שחסרו",
  "תיקון תאורה - מאזן חשיפה ובהירות",
] as const;

export const PHOTO_ENHANCE_STEPS: readonly { step: string; body: string }[] = [
  {
    step: "שלב 1: שולחים את התמונות",
    body: "דרך וואטסאפ, מייל או Google Drive - סרוקות, מהטלפון או קבצים ישנים.",
  },
  {
    step: "שלב 2: מעלים למערכת ה-AI",
    body: "התמונות נכנסות לעיבוד מקצועי.",
  },
  {
    step: "שלב 3: ה-AI מעבד ומשדרג",
    body: "הגדלה, חדות, צבעים וניקוי.",
  },
  {
    step: "שלב 4: בדיקה (ותיקון ידני אם צריך)",
    body: "אנחנו בודקים כל תוצאה - לא רק מעלים ושוכחים.",
  },
  {
    step: "שלב 5: מקבלים תמונות משודרגות",
    body: "איכות גבוהה. אם משהו לא מתאים - נתקן.",
  },
] as const;

/* החלטת הבעלים D72, 7.10.2026: המחירים בעמוד נכונים והם לפני מע״מ. מאז הם
   נקראים מהקטלוג (photo_enhance_1, photo_enhance_5, ai_photo_upgrade,
   photo_enhance_20 והתוספות), ומוצגים כולל מע״מ קודם כמו בכל עמוד לצרכן. */

/** מחיר לתמונה כולל מע״מ. 236 / 5 = 47.2 מוצג "47.20", כמו amountText ב-pricing-display */
function perImageText(exVat: number, count: number): string {
  const each = withVat(exVat) / count;
  const text = Number.isInteger(each)
    ? each.toLocaleString("he-IL")
    : each.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${text} ₪ לתמונה כולל מע״מ`;
}

export type PhotoEnhancePackage = {
  id: string;
  catalogId: PriceItemId;
  count: string;
  /** "236 ₪", כולל מע״מ */
  price: string;
  /** "כולל מע״מ (200 ₪ + מע״מ)" */
  vatNote: string;
  perImage: string;
  premium?: boolean;
  ctaLabel: string;
  whatsappMessage: string;
  utmCampaign: string;
};

export type PhotoEnhanceAddon = {
  id: string;
  title: string;
  price: string;
  ctaLabel: string;
  whatsappMessage: string;
  utmCampaign: string;
};

function photoPackage(
  pkg: Omit<PhotoEnhancePackage, "price" | "vatNote" | "perImage" | "whatsappMessage"> & {
    images: number;
    whatsappMessage: (totalLabel: string) => string;
  },
): PhotoEnhancePackage {
  const { images, whatsappMessage, ...rest } = pkg;
  const exVat = getExVat(pkg.catalogId);
  const price = formatConsumerPrice(exVat);
  return {
    ...rest,
    price: price.total,
    vatNote: `כולל מע״מ (${price.exVatNote})`,
    perImage: perImageText(exVat, images),
    whatsappMessage: whatsappMessage(price.totalLabel),
  };
}

export const PHOTO_ENHANCE_PACKAGES: readonly PhotoEnhancePackage[] = [
  photoPackage({
    id: "single",
    catalogId: "photo_enhance_1",
    images: 1,
    count: "תמונה בודדת",
    ctaLabel: "הזמינו תמונה אחת ",
    whatsappMessage: (total) =>
      `היי יקיר, רוצה לשדרג תמונה אחת ב-AI (${total}). אשמח לשלוח לבדיקה.`,
    utmCampaign: "photo_enhance_pkg_single",
  }),
  photoPackage({
    id: "5",
    catalogId: "photo_enhance_5",
    images: 5,
    count: "5 תמונות",
    ctaLabel: "הזמינו חבילת 5 ",
    whatsappMessage: (total) =>
      `היי יקיר, מעוניין/ת בחבילת שדרוג ל-5 תמונות (${total}). אשמח פרטים.`,
    utmCampaign: "photo_enhance_pkg_5",
  }),
  photoPackage({
    id: "10",
    catalogId: "ai_photo_upgrade",
    images: 10,
    count: "10 תמונות",
    premium: true,
    ctaLabel: "הזמינו חבילת 10 ",
    whatsappMessage: (total) =>
      `היי יקיר, מעוניין/ת בחבילת 10 תמונות לשדרוג AI (${total}).`,
    utmCampaign: "photo_enhance_pkg_10",
  }),
  photoPackage({
    id: "20",
    catalogId: "photo_enhance_20",
    images: 20,
    count: "20 תמונות",
    ctaLabel: "הזמינו חבילת 20 ",
    whatsappMessage: (total) =>
      `היי יקיר, רוצה חבילת 20 תמונות לשדרוג AI (${total}). אשמח לשלוח את הקבצים.`,
    utmCampaign: "photo_enhance_pkg_20",
  }),
] as const;

const manualColor = formatConsumerPrice(getExVat("photo_manual_color_fix"));
const scratchRemoval = formatConsumerPrice(getExVat("photo_scratch_removal"));
/** צביעה: גם בשאלות הנפוצות בעמוד (OnlinePhotoEnhancePageContent) */
export const PHOTO_COLORIZATION_PRICE = formatConsumerPrice(getExVat("photo_colorization"));

export const PHOTO_ENHANCE_ADDONS: readonly PhotoEnhanceAddon[] = [
  {
    id: "manual-color",
    title: "תיקון צבע ידני (אם ה-AI לא מספיק)",
    price: `תוספת של ${manualColor.totalLabel} (${manualColor.exVatNote})`,
    ctaLabel: "בקשו תיקון צבע",
    whatsappMessage:
      `היי יקיר, רוצה תיקון צבע ידני לתמונה (תוספת ${manualColor.totalLabel}). יש לי [כמה] תמונות.`,
    utmCampaign: "photo_enhance_addon_color",
  },
  {
    id: "scratch-removal",
    title: "הסרת שריטות או כתמים",
    price: `תוספת של ${scratchRemoval.totalLabel} (${scratchRemoval.exVatNote})`,
    ctaLabel: "בקשו הסרת פגמים",
    whatsappMessage:
      `היי יקיר, יש תמונה עם שריטות או כתמים - אפשר להסיר? (תוספת ${scratchRemoval.totalLabel})`,
    utmCampaign: "photo_enhance_addon_scratch",
  },
  {
    id: "missing-parts",
    title: "שיחזור חלקים חסרים",
    price: "לפי בקשה",
    ctaLabel: "בדקו אם אפשר",
    whatsappMessage:
      "היי יקיר, יש תמונה עם חלקים חסרים - אפשר לשחזר? אשמח לשלוח לבדיקה.",
    utmCampaign: "photo_enhance_addon_restore",
  },
  {
    id: "colorization",
    title: "צביעת שחור-לבן (colorization)",
    price: `${PHOTO_COLORIZATION_PRICE.totalLabel} לתמונה (${PHOTO_COLORIZATION_PRICE.exVatNote})`,
    ctaLabel: "בקשו צביעה",
    whatsappMessage:
      `היי יקיר, רוצה לצבוע תמונת שחור-לבן (colorization, ${PHOTO_COLORIZATION_PRICE.totalLabel} לתמונה).`,
    utmCampaign: "photo_enhance_addon_bw",
  },
] as const;

export const PHOTO_ENHANCE_COMPARE: readonly {
  title: string;
  regular: string;
  ai: string;
}[] = [
  {
    title: "הגדלת תמונה",
    regular: "נהיית מטושטשת",
    ai: "נשארת חדה",
  },
  {
    title: "פרטים",
    regular: "חדות מלאכותית",
    ai: 'ה-AI "ממציא" פרטים בצורה טבעית',
  },
  {
    title: "צבעים",
    regular: "ידני, לוקח זמן",
    ai: "אוטומטי, מדויק, מהיר",
  },
] as const;

export const PHOTO_ENHANCE_WHY_US: readonly string[] = [
  'לא סתם "מעלים לאתר AI" - בודקים כל תמונה ומתקנים ידנית בפוטושופ אם צריך',
  "20 שנות ניסיון בעבודה על תמונות ווידאו",
  `מחירים הוגנים - ${formatConsumerPrice(getExVat("photo_enhance_1")).totalLabel} לתמונה, הרבה פחות מעיצוב גרפי מלא`,
  "מהירים - בדרך כלל יום עבודה אחד",
  "לא מרוצים? נתקן עד שתהיו מרוצים",
] as const;
