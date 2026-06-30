import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookAudienceCardsStatic from "@/components/booking/BookAudienceCardsStatic";
import BookDynamicHeroSubtitle, {
  BOOK_HERO_SUBTITLE_DEFAULT,
} from "@/components/booking/BookDynamicHeroSubtitle";
import BookPageSections from "@/components/booking/BookPageSections";
import CompanyDetailsCard from "@/components/business/CompanyDetailsCard";
import BookPageSchema from "@/components/seo/BookPageSchema";
import BookCategorySchema from "@/components/seo/BookCategorySchema";
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
import { parseBookCategoryFromPathname, type BookCategoryId } from "@/lib/book-url";

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

const VALID_SLUGS = new Set([
  "studio",
  "podcast",
  "events",
  "dj",
  "photography",
  "clips",
  "singer",
  "academy",
  "online",
  "pro",
]);

export function generateStaticParams() {
  return Array.from(VALID_SLUGS).map((category) => ({ category }));
}

export default async function BookCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { category: slug } = await params;
  if (!VALID_SLUGS.has(slug)) notFound();

  const category = parseBookCategoryFromPathname(`/book/${slug}`) as BookCategoryId;
  const sp = await searchParams;
  const pkgParam = typeof sp.pkg === "string" ? sp.pkg : null;
  const itemParam = typeof sp.item === "string" ? sp.item : null;
  const catalogParam = typeof sp.catalog === "string" ? sp.catalog : null;
  const utmCampaign =
    typeof sp.utm_campaign === "string" ? sp.utm_campaign : null;
  const utmContent = typeof sp.utm_content === "string" ? sp.utm_content : null;

  return (
    <>
      <BookPageSchema />
      <BookCategorySchema category={category} />
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

        <TrustStatsBar />

        <BookAudienceCardsStatic />

        <BookPageSections
          pkgParam={pkgParam}
          itemParam={itemParam}
          catalogParam={catalogParam}
          utmCampaign={utmCampaign}
          utmContent={utmContent}
        />

        <Container className="max-w-3xl pb-14">
          <CompanyDetailsCard variant="collapsible" />
        </Container>
      </div>
    </>
  );
}
