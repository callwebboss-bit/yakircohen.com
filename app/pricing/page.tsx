import type { Metadata } from "next";
import Link from "next/link";
import HubPageSchema from "@/components/seo/HubPageSchema";
import HubServiceIndexStatic from "@/components/seo/HubServiceIndexStatic";
import PricingHubQuickNav from "@/components/marketing/PricingHubQuickNav";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { buildItemListSchema } from "@/lib/seo/page-schema";
import {
  hubSchemaPropsFromSeo,
  metadataForHubSeo,
  PRICING_HUB_SEO,
} from "@/lib/seo/hub-pages";
import { SITE_NAME } from "@/lib/constants";
import { PRICING_FRAMING_LINE } from "@/lib/data/conversion-copy";
import {
  formatHubPriceRow,
  PRICES_EXCLUDE_VAT_NOTE,
  PRICING_HUB_SECTIONS,
} from "@/lib/data/pricing-hub";
import { absoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = metadataForHubSeo(PRICING_HUB_SEO);

const linkClass =
  "inline-flex min-h-11 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

const pricingItemListSchema = buildItemListSchema(
  "מחירון מרכזי",
  PRICING_HUB_SECTIONS.map((section) => ({
    name: section.title,
    url: absoluteUrl(section.href.replace(/^\/+/, "")),
    description: section.description,
  })),
);

export default function PricingHubPage() {
  const hubSchema = hubSchemaPropsFromSeo(PRICING_HUB_SEO);

  return (
    <>
      <HubPageSchema {...hubSchema} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingItemListSchema) }}
      />
      <article className="bg-background">
        <Section padding="sm" className="border-b border-border bg-background text-center">
          <Container className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              {SITE_NAME}
            </p>
            <h1 className="text-hero mt-3 font-serif font-semibold text-foreground">
              מחירון מרכזי
            </h1>
            <p className="text-lead mx-auto mt-4 max-w-xl text-muted-foreground">
              {PRICING_FRAMING_LINE} המחירים <strong>החל מ-</strong> ({PRICES_EXCLUDE_VAT_NOTE}). ליד כל שורה מופיע גם המחיר כולל מע״מ.
            </p>
            <p className="mt-4">
              <Link href="/book" className={`${linkClass} text-sm font-semibold text-brand-red hover:underline`}>
                הזמנה מקוונת עם מחיר שקוף
              </Link>
            </p>
          </Container>
        </Section>

        <PricingHubQuickNav />

        <Section padding="sm">
          <Container className="max-w-3xl space-y-12">
            {PRICING_HUB_SECTIONS.map((section) => (
              <section key={section.id} aria-labelledby={`pricing-${section.id}`}>
                <h2
                  id={`pricing-${section.id}`}
                  className="font-serif text-section-title font-semibold text-foreground"
                >
                  <Link
                    href={section.href}
                    className={`${linkClass} hover:text-brand-red`}
                  >
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
                    className={`${linkClass} font-semibold text-brand-red hover:underline`}
                  >
                    פרטים נוספים
                  </Link>
                  {section.bookHref ? (
                    <Link
                      href={section.bookHref}
                      className={`${linkClass} text-muted-foreground hover:text-brand-red`}
                    >
                      הזמנה מקוונת
                    </Link>
                  ) : null}
                </div>
              </section>
            ))}
          </Container>
        </Section>

        <HubServiceIndexStatic
          heading="מקטעי מחירון"
          links={PRICING_HUB_SECTIONS.map((section) => ({
            href: section.href,
            title: section.title,
            description: section.description,
          }))}
        />
      </article>
    </>
  );
}
