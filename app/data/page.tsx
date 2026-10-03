import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import {
  DATA_HUB_DESCRIPTION,
  DATA_HUB_ITEM_LIST,
  DATA_HUB_LINKS,
  DATA_HUB_SLUG,
  DATA_HUB_TITLE,
} from "@/lib/data/data-hub";
import { constructMetadata } from "@/lib/metadata";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { buildItemListSchema, buildWebPageSchema } from "@/lib/seo/page-schema";

export const metadata: Metadata = constructMetadata({
  title: DATA_HUB_TITLE,
  description: DATA_HUB_DESCRIPTION,
  slug: DATA_HUB_SLUG,
});

const linkClass =
  "flex min-h-14 items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4 text-base font-semibold text-foreground hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

export default function DataHubPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(
            buildWebPageSchema({
              slug: DATA_HUB_SLUG,
              title: DATA_HUB_TITLE,
              description: DATA_HUB_DESCRIPTION,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(buildItemListSchema(DATA_HUB_TITLE, DATA_HUB_ITEM_LIST)),
        }}
      />
      <Section padding="sm" className="bg-background">
        <Container className="max-w-3xl">
          <h1 className="text-hero font-serif font-semibold text-foreground">{DATA_HUB_TITLE}</h1>
          <ul className="mt-8 space-y-3">
            {DATA_HUB_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                  <span aria-hidden>←</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
