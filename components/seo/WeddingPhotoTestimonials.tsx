import type { WeddingPhotoTestimonial } from "@/lib/data/wedding-photography-page";
import { WEDDING_PHOTO_TESTIMONIALS } from "@/lib/data/wedding-photography-page";

type WeddingPhotoTestimonialsProps = {
  items?: readonly WeddingPhotoTestimonial[];
  className?: string;
};

function StarRow() {
  return (
    <p className="text-lg tracking-widest text-brand-red" aria-label="5 כוכבים">
      ★★★★★
    </p>
  );
}

export default function WeddingPhotoTestimonials({
  items = WEDDING_PHOTO_TESTIMONIALS,
  className,
}: WeddingPhotoTestimonialsProps) {
  return (
    <section
      className={className}
      aria-labelledby="wedding-testimonials-heading"
    >
      <header className="mx-auto max-w-2xl text-center">
        <StarRow />
        <h2
          id="wedding-testimonials-heading"
          className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          מה הזוגות אומרים
        </h2>
      </header>
      <ul className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.name + item.quote.slice(0, 24)}
            className="flex flex-col rounded-2xl border border-border bg-background p-6 shadow-sm"
          >
            <blockquote className="flex-1 text-sm leading-relaxed text-foreground">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <footer className="mt-5 flex items-center gap-3 border-t border-border pt-4">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-xs font-bold text-brand-red"
                aria-hidden
              >
                {item.initials}
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.role}</p>
              </div>
            </footer>
          </li>
        ))}
      </ul>
    </section>
  );
}
