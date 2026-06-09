import type { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/lib/metadata";
import { SITE_NAME } from "@/lib/constants";
import { PRICING_FRAMING_LINE } from "@/lib/data/conversion-copy";
import {
  formatHubPriceRow,
  PRICES_EXCLUDE_VAT_NOTE,
  PRICING_HUB_SECTIONS,
} from "@/lib/data/pricing-hub";

export const metadata: Metadata = constructMetadata({
  title: "מחירון מרכזי",
  description:
    "כל המחירים במקום אחד: אולפן, פודקאסט, עריכה ואטרקציות לאירועים. לפני ואחרי מע״מ, עם קישור להזמנה מקוונת.",
  slug: "pricing",
  keywords: ["מחירון", "מחירי אולפן", "פודקאסט", "אטרקציות לאירועים"],
});

export default function PricingHubPage() {
  return (
    <div className="bg-background">
      <section className="border-b border-border bg-background py-14 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
          {SITE_NAME}
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-foreground sm:text-4xl">
          מחירון מרכזי
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          {PRICING_FRAMING_LINE} המחירים <strong>החל מ-</strong> ({PRICES_EXCLUDE_VAT_NOTE}). ליד כל שורה מופיע גם המחיר כולל מע״מ.
        </p>
      </section>

      <div className="mx-auto max-w-3xl space-y-12 px-4 py-14 sm:px-6 lg:px-8">
        {PRICING_HUB_SECTIONS.map((section) => (
          <section key={section.id} aria-labelledby={`pricing-${section.id}`}>
            <h2
              id={`pricing-${section.id}`}
              className="text-xl font-semibold text-foreground"
            >
              <Link href={section.href} className="hover:text-brand-red">
                {section.title}
              </Link>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
            <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-surface">
              {section.rows.map((row) => (
                <li
                  key={row.label}
                  className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{row.label}</p>
                    {row.note ? (
                      <p className="text-xs text-muted-foreground">{row.note}</p>
                    ) : null}
                  </div>
                  <p className="text-sm font-semibold text-foreground tabular-nums">
                    {formatHubPriceRow(row.exVat)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <Link
                href={section.href}
                className="font-semibold text-brand-red hover:underline"
              >
                פרטים נוספים
              </Link>
              {section.bookHref ? (
                <Link
                  href={section.bookHref}
                  className="text-muted-foreground hover:text-brand-red"
                >
                  הזמנה מקוונת
                </Link>
              ) : null}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
