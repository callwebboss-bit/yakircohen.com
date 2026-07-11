import type { Metadata } from "next";
import BookAudienceCardsStatic from "@/components/booking/BookAudienceCardsStatic";
import BookPageClient from "@/components/booking/BookPageClient";
import BookDynamicHeroSubtitle, {
  BOOK_HERO_SUBTITLE_DEFAULT,
} from "@/components/booking/BookDynamicHeroSubtitle";
import BookHeroTrustChips from "@/components/booking/BookHeroTrustChips";
import CompanyDetailsCard from "@/components/business/CompanyDetailsCard";
import CheckoutTrustMicro from "@/components/legal/CheckoutTrustMicro";
import BookPageSchema from "@/components/seo/BookPageSchema";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
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

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const pkgParam = typeof sp.pkg === "string" ? sp.pkg : null;
  const itemParam = typeof sp.item === "string" ? sp.item : null;
  const catalogParam = typeof sp.catalog === "string" ? sp.catalog : null;
  const couponParam = typeof sp.coupon === "string" ? sp.coupon : null;
  const utmCampaign =
    typeof sp.utm_campaign === "string" ? sp.utm_campaign : null;
  const utmContent = typeof sp.utm_content === "string" ? sp.utm_content : null;
  const routeParam = typeof sp.route === "string" ? sp.route : null;
  const qualParam = typeof sp.qual === "string" ? sp.qual : null;

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

            <BookDynamicHeroSubtitle
              defaultText={BOOK_HERO_SUBTITLE_DEFAULT}
              utmCampaign={utmCampaign}
              utmContent={utmContent}
            />
            <ContextualIntroParagraph pathname="/book" className="mx-auto mt-4 max-w-2xl" />
            <BookHeroTrustChips />
          </Container>
        </Section>

        <noscript>
          <Container className="max-w-3xl py-6 text-sm text-muted-foreground">
            <p>
              הזמנה מקוונת באתר יקיר כהן: הקלטות באולפן במודיעין (מ-990 ₪), פודקאסט,
              אטרקציות לאירועים, הגברה לזמרים, DJ, צילום ושיעורים פרטיים. מחירים
              לפני מע״מ מוצגים בדף; אפשר לשלוח פרטים בוואטסאפ.
            </p>
          </Container>
        </noscript>

        <BookAudienceCardsStatic />

        <BookPageClient
          pkgParam={pkgParam}
          itemParam={itemParam}
          catalogParam={catalogParam}
          couponParam={couponParam}
          routeParam={routeParam}
          qualParam={qualParam}
          utmCampaign={utmCampaign}
          utmContent={utmContent}
        />

        <Container className="max-w-3xl pb-14">
          <CheckoutTrustMicro className="mb-6" />
          <CompanyDetailsCard variant="collapsible" />
        </Container>
      </div>
    </>
  );
}
