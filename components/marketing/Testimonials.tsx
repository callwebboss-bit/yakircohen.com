import Link from "next/link";
import GoogleRatingBadge from "@/components/marketing/GoogleRatingBadge";
import TestimonialCard from "@/components/marketing/TestimonialCard";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { STUDIO_GOOGLE_MAPS_URL, TRUST_STATS_CLARIFICATION } from "@/lib/constants";
import { SITE_TESTIMONIALS } from "@/lib/data/testimonials";
import { formatCategoryBreakdown } from "@/lib/data/testimonial-categories";
import type { TestimonialCategoryId } from "@/lib/data/testimonial-categories";
import { cn } from "@/lib/utils";

export type TestimonialItem = {
  id: string;
  quote: string;
  name: string;
  role?: string;
  initials?: string;
  /** ISO 8601 - UI + Review JSON-LD */
  datePublished?: string;
  serviceCategory?: TestimonialCategoryId;
  serviceHref?: string;
  serviceLabel?: string;
  /** תמונת פרויקט מהגלריה - לא תמונת לקוח */
  projectImageSrc?: string;
  projectImageAlt?: string;
};

export type TestimonialsProps = {
  title?: string;
  subtitle?: string;
  items?: TestimonialItem[];
  className?: string;
  /** מסנן testimonials לפי serviceHref שמתחיל ב-prefix זה */
  filterByPathPrefix?: string;
};

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [...SITE_TESTIMONIALS];

export default function Testimonials({
  title = "מה הלקוחות אומרים",
  subtitle = "המלצות מלקוחות אולפן, אירועים ופודקאסטים, עם קישור להקשר המלא.",
  items = DEFAULT_TESTIMONIALS,
  className,
  filterByPathPrefix,
}: TestimonialsProps) {
  const displayItems = filterByPathPrefix
    ? items.filter(
        (t) => t.serviceHref && t.serviceHref.startsWith(filterByPathPrefix),
      ).length >= 2
      ? items.filter(
          (t) => t.serviceHref && t.serviceHref.startsWith(filterByPathPrefix),
        )
      : items
    : items;

  const categoryBreakdown = formatCategoryBreakdown(displayItems);

  return (
    <Section
      padding="sm"
      className={cn("bg-background", className)}
      ariaLabelledby="testimonials-heading"
    >
      <Container>
        <header className="mx-auto max-w-2xl text-center">
          <h2
            id="testimonials-heading"
            className="font-serif text-section-title font-semibold text-foreground"
          >
            {title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {subtitle}
          </p>
          {categoryBreakdown ? (
            <p className="mt-2 text-xs text-muted-foreground">{categoryBreakdown}</p>
          ) : null}
          <div className="mt-6 flex justify-center">
            <GoogleRatingBadge variant="compact" />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {TRUST_STATS_CLARIFICATION}
          </p>
          <p className="mt-3 text-sm">
            <Link
              href="/testimonials"
              className="font-semibold text-brand-red hover:underline"
            >
              לכל ההמלצות באתר
            </Link>
            {" · "}
            <Link
              href={STUDIO_GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-red hover:underline"
            >
              ביקורות מאומתות ב-Google Maps
            </Link>
          </p>
        </header>

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {displayItems.map((item) => (
            <li key={item.id} className="reveal">
              <TestimonialCard item={item} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
