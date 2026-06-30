"use client";

import type { FAQItem } from "@/components/ui/FAQAccordion";
import { cn } from "@/lib/utils";

type WizardContextFaqSnapshotProps = {
  items: readonly FAQItem[];
  className?: string;
};

export default function WizardContextFaqSnapshot({
  items,
  className,
}: WizardContextFaqSnapshotProps) {
  if (items.length === 0) return null;

  return (
    <section
      className={cn("rounded-2xl border border-border bg-surface/50 p-4", className)}
      aria-labelledby="wizard-context-faq-heading"
    >
      <h3
        id="wizard-context-faq-heading"
        className="mb-3 text-sm font-semibold text-foreground"
      >
        שאלות נפוצות לפני שממשיכים
      </h3>
      <div className="space-y-2">
        {items.slice(0, 3).map((item) => (
          <details
            key={item.id}
            className="group rounded-xl border border-border bg-background px-3 py-2"
          >
            <summary className="cursor-pointer list-none text-sm font-medium text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex min-h-12 items-center justify-between gap-2">
                {item.question}
                <span
                  className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                  aria-hidden="true"
                >
                  ▾
                </span>
              </span>
            </summary>
            <p className="pb-2 text-xs leading-relaxed text-muted-foreground">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
