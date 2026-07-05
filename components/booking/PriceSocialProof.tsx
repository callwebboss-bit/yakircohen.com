import type { BookCategoryId } from "@/lib/book-url";
import { SITE_TESTIMONIALS } from "@/lib/data/testimonials";
import {
  getTestimonialYear,
  TESTIMONIAL_CATEGORY_LABELS,
} from "@/lib/data/testimonial-categories";
import { cn } from "@/lib/utils";

const CATEGORY_TESTIMONIAL_INDEX: Partial<Record<BookCategoryId, number>> = {
  studio: 5,
  podcast: 1,
  events: 3,
  dj: 7,
  singer: 3,
  photography: 6,
  clips: 6,
  academy: 9,
  online: 0,
  pro: 4,
};

type PriceSocialProofProps = {
  categoryId?: BookCategoryId;
  /** אינדקס ב-SITE_TESTIMONIALS (ברירת מחדל לפי categoryId) */
  testimonialIndex?: number;
  className?: string;
};

export default function PriceSocialProof({
  categoryId,
  testimonialIndex,
  className,
}: PriceSocialProofProps) {
  const index =
    testimonialIndex ??
    (categoryId ? CATEGORY_TESTIMONIAL_INDEX[categoryId] : undefined) ??
    1;
  const item = SITE_TESTIMONIALS[index];
  if (!item) return null;

  const quote =
    item.quote.length > 96 ? `${item.quote.slice(0, 96).trim()}…` : item.quote;

  const categoryLabel = item.serviceCategory
    ? TESTIMONIAL_CATEGORY_LABELS[item.serviceCategory]
    : undefined;
  const year = getTestimonialYear(item.datePublished);
  const meta = [categoryLabel, year].filter(Boolean).join(" · ");

  return (
    <p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>
      <span className="text-brand-red" aria-hidden="true">
        ★{" "}
      </span>
      &ldquo;{quote}&rdquo;, {item.name}
      {meta ? ` · ${meta}` : null}
    </p>
  );
}
