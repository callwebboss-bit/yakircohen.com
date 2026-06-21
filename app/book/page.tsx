import type { Metadata } from "next";
import { Suspense } from "react";
import BookAudienceCardsStatic from "@/components/booking/BookAudienceCardsStatic";
import BookDynamicHeroSubtitle, {
  BOOK_HERO_SUBTITLE_DEFAULT,
} from "@/components/booking/BookDynamicHeroSubtitle";
import BookPageSections from "@/components/booking/BookPageSections";
import BookStudioInfoSection from "@/components/booking/BookStudioInfoSection";
import CompanyDetailsCard from "@/components/business/CompanyDetailsCard";
import BookPageSchema from "@/components/seo/BookPageSchema";
import TrustStatsBar from "@/components/marketing/TrustStatsBar";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { constructMetadata } from "@/lib/metadata";
import { SITE_NAME } from "@/lib/constants";
import {
  BOOK_OG_IMAGE_ALT,
  BOOK_OG_IMAGE_HEIGHT,
  BOOK_OG_IMAGE_PATH,
  BOOK_OG_IMAGE_WIDTH,
  BOOK_PAGE_DESCRIPTION,
  BOOK_PAGE_KEYWORDS,
  BOOK_PAGE_TITLE,
} from "@/lib/seo/book-page";

export const metadata: Metadata = constructMetadata({
  title: BOOK_PAGE_TITLE,
  description: BOOK_PAGE_DESCRIPTION,
  slug: "book",
  ogImage: {
    path: BOOK_OG_IMAGE_PATH,
    alt: BOOK_OG_IMAGE_ALT,
    width: BOOK_OG_IMAGE_WIDTH,
    height: BOOK_OG_IMAGE_HEIGHT,
  },
  keywords: [...BOOK_PAGE_KEYWORDS],
});

export default function BookPage() {
  return (
    <>
      <BookPageSchema />
      <div className="overflow-x-clip bg-background">
        <Section
          padding="none"
          className="relative overflow-hidden border-b border-border bg-background"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.12),transparent_55%)]"
            aria-hidden="true"
          />

          <Container className="relative max-w-3xl py-14 text-center sm:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red" aria-hidden="true">
              {SITE_NAME}
            </p>

            <h1 className="text-hero mt-3 font-serif font-semibold text-foreground">
              בחרו כיוון - מחיר שקוף מיד, ומה מקבלים בפועל
            </h1>

            <Suspense
              fallback={
                <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {BOOK_HERO_SUBTITLE_DEFAULT}
                </p>
              }
            >
              <BookDynamicHeroSubtitle defaultText={BOOK_HERO_SUBTITLE_DEFAULT} />
            </Suspense>
          </Container>
        </Section>

        <TrustStatsBar />

        <BookAudienceCardsStatic />

        <Suspense
          fallback={
            <p className="py-16 text-center text-sm text-muted-foreground">
              טוען טופסי הזמנה...
            </p>
          }
        >
          <BookPageSections />
        </Suspense>

        <BookStudioInfoSection />

        <Container className="max-w-3xl pb-14">
          <CompanyDetailsCard variant="collapsible" />
        </Container>
      </div>
    </>
  );
}
