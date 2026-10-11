import { getExVat, getPriceById, type PriceItemId } from "@/lib/data/pricing-catalog";

/**
 * עמודי השירותים החדשים מ-11.10.2026 (פרודיה, שיר מקורי, קבוצות, שיר AI, זמרים,
 * שיר סיום, גיוס, פודקאסט חי, השקת פודקאסט, אימון הנחיה). כל עמוד הוא קובץ נתונים
 * אחד, והתצוגה משותפת: components/seo/ServiceOfferPageContent.tsx.
 *
 * מחיר נכתב רק כמזהה קטלוג. הסכום נשלף מ-getExVat בזמן התצוגה, כדי שאף מספר
 * לא ייכתב בטקסט (audit:price-literals, audit:prose-prices).
 */

export type ServiceOfferPriceRow = {
  id: PriceItemId;
  /** שם השורה בעמוד. בלי שם, השם מהקטלוג. */
  label?: string;
  /** שורה קטנה מתחת למחיר */
  note?: string;
  /** "מ-" לפני המחיר */
  from?: boolean;
  /** תוספת ולא בסיס: לא נכנסת ל-Offer בסכמה */
  addon?: boolean;
};

export type ServiceOfferStep = { title: string; description: string };

export type ServiceOfferFaq = { id: string; question: string; answer: string };

export type ServiceOfferExtraSection = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  items: readonly { title: string; body: string }[];
};

export type ServiceOfferVideo = { videoId: string; title: string; description?: string };

/**
 * "לא בטוחים שזה מה שאתם צריכים?": קישורים לעמודים קרובים, עם משפט שאומר מתי
 * לבחור בהם. זה מה שמונע מהעמוד להתחרות בעמוד קיים על אותה כוונת חיפוש: כל
 * עמוד אומר במפורש למי הוא, ומפנה את השאר לעמוד הנכון.
 */
export type ServiceOfferAlternative = { href: string; label: string; body: string };

export type ServiceOfferPage = {
  /** "/studio/parody" */
  path: string;
  metaTitle: string;
  metaDescription: string;
  keywords: readonly string[];
  eyebrow: string;
  h1: string;
  /** פסקת הפתיחה. מסומנת data-speakable. */
  intro: string;
  /** משפט קצר מתחת לפתיחה, למשל זמן מסירה */
  highlight?: string;
  /** "למי זה מתאים" */
  audience?: { title: string; items: readonly string[] };
  steps: readonly ServiceOfferStep[];
  includesTitle: string;
  includes: readonly string[];
  priceTitle: string;
  prices: readonly ServiceOfferPriceRow[];
  /** הערה מתחת לטבלת המחיר */
  priceNote?: string;
  extraSections?: readonly ServiceOfferExtraSection[];
  /** דוגמאות אמיתיות מהקטלוג (video-catalog.generated.ts), רק כשהכותרת מתאימה לשירות */
  videos?: { title: string; description?: string; items: readonly ServiceOfferVideo[] };
  alternatives?: { title: string; items: readonly ServiceOfferAlternative[] };
  faqs: readonly ServiceOfferFaq[];
  whatsapp: {
    /** "פרודיה לאירוע", נכנס ל"שלום, אשמח לשמוע על ..." */
    packageLabel: string;
    /** מזהה הקטלוג שמסמן את הפנייה (תג YC) והמחיר בהודעה */
    priceId: PriceItemId;
    utmCampaign: string;
  };
  related: readonly { href: string; label: string }[];
  /**
   * טיוטה: noindex, לא במפת האתר ולא בקישורים. נשאר true עד שהבעלים מאשר
   * מחיר וניסוח ואומר "תפרסם".
   */
  draft: boolean;
};

export type ResolvedPriceRow = {
  id: PriceItemId;
  label: string;
  note?: string;
  from: boolean;
  addon: boolean;
  exVat: number;
};

export function resolvePriceRows(rows: readonly ServiceOfferPriceRow[]): ResolvedPriceRow[] {
  return rows.map((row) => ({
    id: row.id,
    label: row.label ?? getPriceById(row.id).label,
    note: row.note,
    from: Boolean(row.from),
    addon: Boolean(row.addon),
    exVat: getExVat(row.id),
  }));
}

/** ההצעות לסכמה: רק שורות בסיס, לא תוספות */
export function schemaOffers(page: ServiceOfferPage) {
  return resolvePriceRows(page.prices)
    .filter((row) => !row.addon)
    .map((row) => ({ id: row.id, name: row.label, priceExVat: row.exVat, priceFrom: row.from }));
}
