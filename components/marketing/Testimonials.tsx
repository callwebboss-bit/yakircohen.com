import Link from "next/link";
import GoogleRatingBadge from "@/components/marketing/GoogleRatingBadge";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { SITE_TESTIMONIALS } from "@/lib/data/testimonials";
import { cn } from "@/lib/utils";

export type TestimonialItem = {
  id: string;
  quote: string;
  name: string;
  role?: string;
  initials?: string;
  /** ISO 8601 - ל-Review JSON-LD בלבד */
  datePublished?: string;
  serviceHref?: string;
  serviceLabel?: string;
};

export type TestimonialsProps = {
  title?: string;
  subtitle?: string;
  items?: TestimonialItem[];
  className?: string;
};

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [...SITE_TESTIMONIALS];

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

export default function Testimonials({
  title = "מה הלקוחות אומרים",
  subtitle = "ביקורות אמיתיות מלקוחות מרוצים במודיעין, ירושלים והסביבה",
  items = DEFAULT_TESTIMONIALS,
  className,
}: TestimonialsProps) {
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
          <div className="mt-6 flex justify-center">
            <GoogleRatingBadge variant="compact" />
          </div>
        </header>

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {items.map((item) => (
            <li key={item.id}>
              <blockquote className="flex h-full flex-col rounded-xl border border-border bg-surface p-6 shadow-sm transition-[box-shadow,border-color] duration-normal ease-luxury hover:border-brand-red/30 hover:shadow-md">
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
                    <AvatarPlaceholder
                      initials={item.initials}
                      name={item.name}
                    />
                    <div>
                      <cite className="not-italic text-sm font-semibold text-foreground">
                        {item.name}
                      </cite>
                      {item.role ? (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.role}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  {item.serviceHref && item.serviceLabel ? (
                    <Link
                      href={item.serviceHref}
                      className="inline-flex min-h-11 items-center text-xs font-semibold text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                    >
                      {item.serviceLabel} ←
                    </Link>
                  ) : null}
                </footer>
              </blockquote>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
