import { SITE_TESTIMONIALS } from "@/lib/data/testimonials";
import { cn } from "@/lib/utils";

export type TestimonialItem = {
  id: string;
  quote: string;
  name: string;
  role?: string;
  initials?: string;
  /** ISO 8601 — ל-Review JSON-LD בלבד */
  datePublished?: string;
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
    <section
      className={cn("bg-background py-12 sm:py-16 lg:py-20", className)}
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <h2
            id="testimonials-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            {title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        </header>

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {items.map((item) => (
            <li key={item.id}>
              <blockquote className="flex h-full flex-col rounded-xl border border-border bg-surface p-6">
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

                <footer className="mt-6 flex items-center gap-3 border-t border-border pt-4">
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
                </footer>
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
