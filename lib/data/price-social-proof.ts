import type { BookCategoryId } from "@/lib/book-url";
import type { TestimonialItem } from "@/components/marketing/Testimonials";
import type { TestimonialCategoryId } from "@/lib/data/testimonial-categories";
import { SITE_TESTIMONIALS } from "@/lib/data/testimonials";

/**
 * המלצה ליד מחיר מגיעה רק מאותו שירות, או שאין המלצה (שלב 5, FIT-04).
 *
 * עד שלב 5 הבחירה הייתה לפי אינדקס במערך: ציטוט של שיר חתונה הופיע ליד מחירי
 * צילום וקליפים, ציטוט של אירוע חברה ליד הגברה לזמרים, וציטוט מקום-שמור של
 * האקדמיה ליד מחיר האקדמיה. מחיקת המלצה הזיזה את כל האינדקסים בשקט. עכשיו
 * הבחירה לפי מזהה, ו-price-social-proof.test.ts מוודא שקטגוריית ההמלצה תואמת
 * לקטגוריית ההזמנה.
 */
export const BOOK_CATEGORY_TESTIMONIAL_CATEGORY: Partial<
  Record<BookCategoryId, TestimonialCategoryId>
> = {
  studio: "studio",
  podcast: "podcast",
  events: "events",
  dj: "events",
  online: "online",
};

/**
 * ההמלצה ליד המחיר בכרטיסי /book. קטגוריה בלי רשומה לא מציגה המלצה.
 *
 * החלטת הבעלים 8.10.2026, בדיקת ההמלצות: ריק. חמשת המזהים שהיו כאן (6, 1, 9,
 * 8, 3) הצביעו על המלצות שהוסרו מ-SITE_TESTIMONIALS כי אין להן מקור ציבורי.
 * בלי המלצה PriceSocialProof לא מציג כלום, ודירוג Google כבר מופיע בראש
 * /book (BookHeroTrustChips) וב-/book/[category] (TrustStatsBar).
 */
export const PRICE_PROOF_TESTIMONIAL_ID: Partial<Record<BookCategoryId, string>> = {};

export function getTestimonialById(id: string | undefined): TestimonialItem | undefined {
  if (!id) return undefined;
  return SITE_TESTIMONIALS.find((t) => t.id === id);
}

export function getPriceProofTestimonial(
  categoryId: BookCategoryId | undefined,
): TestimonialItem | undefined {
  if (!categoryId) return undefined;
  return getTestimonialById(PRICE_PROOF_TESTIMONIAL_ID[categoryId]);
}
