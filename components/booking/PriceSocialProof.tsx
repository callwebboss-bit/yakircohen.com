import { SITE_TESTIMONIALS } from "@/lib/data/testimonials";
import { cn } from "@/lib/utils";

type PriceSocialProofProps = {
  /** אינדקס ב-SITE_TESTIMONIALS (ברירת מחדל 1 = פודקאסט) */
  testimonialIndex?: number;
  className?: string;
};

export default function PriceSocialProof({
  testimonialIndex = 1,
  className,
}: PriceSocialProofProps) {
  const item = SITE_TESTIMONIALS[testimonialIndex];
  if (!item) return null;

  const quote =
    item.quote.length > 96 ? `${item.quote.slice(0, 96).trim()}…` : item.quote;

  return (
    <p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>
      <span className="text-brand-red" aria-hidden="true">
        ★{" "}
      </span>
      &ldquo;{quote}&rdquo; - {item.name}
    </p>
  );
}
