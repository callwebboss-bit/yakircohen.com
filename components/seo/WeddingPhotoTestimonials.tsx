import type { TestimonialItem } from "@/components/marketing/Testimonials";
import TestimonialCard from "@/components/marketing/TestimonialCard";
import { WEDDING_PHOTO_TESTIMONIALS } from "@/lib/data/wedding-photography-page";

type WeddingPhotoTestimonialsProps = {
  items?: readonly TestimonialItem[];
  className?: string;
};

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
        <p className="text-lg tracking-widest text-brand-red" aria-label="5 כוכבים">
          ★★★★★
        </p>
        <h2
          id="wedding-testimonials-heading"
          className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          מה הזוגות אומרים
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          המלצות מלקוחות צילום חתונות ואירועים, עם קישור להקשר המלא.
        </p>
      </header>
      <ul className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>
            <TestimonialCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
