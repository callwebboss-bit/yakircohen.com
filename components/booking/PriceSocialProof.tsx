import type { BookCategoryId } from "@/lib/book-url";
import {
  getPriceProofTestimonial,
  getTestimonialById,
} from "@/lib/data/price-social-proof";
import {
  getTestimonialYear,
  TESTIMONIAL_CATEGORY_LABELS,
} from "@/lib/data/testimonial-categories";
import { cn } from "@/lib/utils";

type PriceSocialProofProps = {
  categoryId?: BookCategoryId;
  /** מזהה ב-SITE_TESTIMONIALS. חייב להיות מאותו שירות (price-social-proof.test.ts) */
  testimonialId?: string;
  className?: string;
};

/**
 * המלצה אחת ליד מחיר, רק מאותו שירות. בלי התאמה לא מוצג כלום, במקום ציטוט
 * של שירות אחר (שלב 5, FIT-04). זו המלצה מהאתר, לא ביקורת Google, ולכן
 * בלי כוכב.
 */
export default function PriceSocialProof({
  categoryId,
  testimonialId,
  className,
}: PriceSocialProofProps) {
  const item = testimonialId
    ? getTestimonialById(testimonialId)
    : getPriceProofTestimonial(categoryId);
  if (!item) return null;

  const quote =
    item.quote.length > 96 ? `${item.quote.slice(0, 96).trim()}...` : item.quote;

  const categoryLabel = item.serviceCategory
    ? TESTIMONIAL_CATEGORY_LABELS[item.serviceCategory]
    : undefined;
  const year = getTestimonialYear(item.datePublished);
  const meta = [categoryLabel, year].filter(Boolean).join(" · ");

  return (
    <p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>
      &quot;{quote}&quot;, {item.name}
      {meta ? ` · ${meta}` : null}
    </p>
  );
}
