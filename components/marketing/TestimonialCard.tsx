import Image from "next/image";
import Link from "next/link";
import type { TestimonialItem } from "@/components/marketing/Testimonials";
import {
  getTestimonialYear,
  TESTIMONIAL_CATEGORY_LABELS,
} from "@/lib/data/testimonial-categories";
import { cn } from "@/lib/utils";

type TestimonialCardProps = {
  item: TestimonialItem;
  className?: string;
  showProjectImage?: boolean;
};

function AvatarPlaceholder({
  initials,
  name,
}: Pick<TestimonialItem, "initials" | "name">) {
  const label = initials ?? name.slice(0, 2);

  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-red/30 bg-background text-xs font-bold text-brand-red"
      aria-hidden="true"
    >
      {label}
    </div>
  );
}

function CategoryBadge({ category }: { category: TestimonialItem["serviceCategory"] }) {
  if (!category) return null;

  return (
    <span className="inline-flex rounded-full border border-brand-red/25 bg-brand-red/8 px-2 py-0.5 text-[0.65rem] font-semibold text-brand-red">
      {TESTIMONIAL_CATEGORY_LABELS[category]}
    </span>
  );
}

export default function TestimonialCard({
  item,
  className,
  showProjectImage = true,
}: TestimonialCardProps) {
  const year = getTestimonialYear(item.datePublished);

  return (
    <blockquote
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-[box-shadow,border-color] duration-normal ease-luxury hover:border-brand-red/30 hover:shadow-md",
        className,
      )}
    >
      {showProjectImage && item.projectImageSrc ? (
        <div className="relative aspect-[16/9] w-full border-b border-border bg-muted">
          <Image
            src={item.projectImageSrc}
            alt={item.projectImageAlt ?? "תמונת פרויקט מהשירות"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm leading-relaxed text-foreground/90">
          <span
            className="me-1 font-serif text-2xl leading-none text-brand-red"
            aria-hidden="true"
          >
            ״
          </span>
          {item.quote}
          <span
            className="ms-1 font-serif text-2xl leading-none text-brand-red"
            aria-hidden="true"
          >
            ״
          </span>
        </p>

        <footer className="mt-6 flex flex-col gap-3 border-t border-border pt-4">
          <div className="flex items-center gap-3">
            <AvatarPlaceholder initials={item.initials} name={item.name} />
            <div className="min-w-0">
              <cite className="not-italic text-sm font-semibold text-foreground">
                {item.name}
              </cite>
              {item.role ? (
                <p className="mt-0.5 text-xs text-muted-foreground">{item.role}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <CategoryBadge category={item.serviceCategory} />
            {year ? <span>{year}</span> : null}
          </div>

          {item.serviceHref && item.serviceLabel ? (
            <Link
              href={item.serviceHref}
              className="inline-flex min-h-11 items-center text-xs font-semibold text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              הקשר מלא: {item.serviceLabel}
            </Link>
          ) : null}
        </footer>
      </div>
    </blockquote>
  );
}
