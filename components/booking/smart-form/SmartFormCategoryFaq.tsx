"use client";

import { useState } from "react";
import Link from "next/link";
import type { FaqCtaItem } from "@/components/ui/FAQWithCtaLinks";

type SmartFormCategoryFaqProps = {
  faqs: readonly FaqCtaItem[];
  prepHref: string;
  prepLabel: string;
};

export default function SmartFormCategoryFaq({
  faqs,
  prepHref,
  prepLabel,
}: SmartFormCategoryFaqProps) {
  const [open, setOpen] = useState(false);

  if (!faqs.length) return null;

  return (
    <div className="text-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="min-h-[48px] touch-manipulation text-xs text-muted-foreground underline-offset-2 hover:text-brand-red hover:underline"
      >
        {open ? "סגירת שאלות" : "מתלבטים? תשובות לשאלות של לקוחות כמוכם"}
      </button>

      {open ? (
        <div className="mt-3 space-y-3 rounded-lg border border-border bg-white p-3">
          {faqs.map((faq) => (
            <details key={faq.id} className="group border-b border-border pb-2 last:border-0">
              <summary className="min-h-[44px] cursor-pointer list-none py-1 font-medium text-foreground touch-manipulation">
                {faq.question}
              </summary>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
          <Link
            href={prepHref}
            className="inline-flex min-h-[44px] items-center text-xs font-medium text-brand-red underline-offset-2 hover:underline"
          >
            {prepLabel} (מדריך מלא)
          </Link>
        </div>
      ) : null}
    </div>
  );
}
