import { buildStudioPriceFactors } from "@/lib/data/price-factors";

type Props = {
  className?: string;
  headingId?: string;
};

/**
 * "מה מזיז את המחיר". Server Component בכוונה: זה אות סורק ותשובה
 * למנועי תשובות, ולכן הוא חייב להיות ב-HTML ולא מאחורי אינטראקציה.
 *
 * עד 2.10.2026 הידע הזה היה קיים רק בתוך studio-price-builder.ts,
 * שמרונדר בעמוד אחד ורק אחרי לחיצה.
 */
export default function PriceFactorsSection({
  className,
  headingId = "price-factors-heading",
}: Props) {
  const factors = buildStudioPriceFactors();

  return (
    <section aria-labelledby={headingId} className={className}>
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <h2
          id={headingId}
          className="font-serif text-section-title font-semibold text-foreground"
        >
          מה מזיז את המחיר
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          ארבעה דברים, לפי סדר ההשפעה. כך תדעו מראש איפה אתם יכולים לחסוך
          ואיפה לא כדאי.
        </p>

        <dl className="mt-6 space-y-6">
          {factors.map((factor) => (
            <div
              key={factor.id}
              className="border-s-[3px] border-brand-red/30 ps-4"
            >
              <dt className="text-sm font-semibold text-foreground sm:text-base">
                {factor.title}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {factor.what}
              </dd>
              <dd className="mt-2 text-sm leading-relaxed text-foreground/80">
                {factor.why}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
