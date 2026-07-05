import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import PageBottomCta from "@/components/layout/PageBottomCta";
import CorporateShareButton from "@/components/ui/CorporateShareButton";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { BLUR_DATA_URL } from "@/lib/blur";
import { SITE_KICKER } from "@/lib/constants";
import {
  SERVICE_PORTFOLIO_GALLERY_ID,
  SERVICE_SHOWCASE_VIDEO_ID,
  type HeroScrollTarget,
} from "@/lib/service-portfolio-hero";
import { sliceHeroFeatures } from "@/lib/service-page-ui";
import { resolveServiceBookCta } from "@/lib/data/service-book-map";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import LazyYouTubeEmbed from "@/components/marketing/LazyYouTubeEmbed";
import TrustBadges from "@/components/ui/TrustBadges";
import SocialProofStrip from "@/components/marketing/SocialProofStrip";
import HubAccentScope from "@/components/theme/HubAccentScope";
import { buildServicePageEntitySchema } from "@/lib/seo/page-schema";
import { TIME_CLAIMS } from "@/lib/data/conversion-copy";
import AnswerBlock from "@/components/seo/AnswerBlock";
import SpeakableSchema from "@/components/seo/SpeakableSchema";

export type ServicePageLayoutProps = {
  title: string;
  subtitle: string;
  features: readonly string[];
  /** Overrides default message; must name the service or package when set. */
  whatsappText?: string;
  /** Starting price shown in the WhatsApp pre-fill so the client knows what to expect. */
  startingPrice?: string;
  utmCampaign: string;
  children?: ReactNode;
  ctaLabel?: string;
  scarcityLabel?: string;
  className?: string;
  /** Cover image in hero (never a raw video iframe in the header). */
  heroImageSrc?: string;
  heroImageAlt?: string;
  /** @deprecated Do not use - hero must be cover image only; video belongs in showcase below. */
  heroVideoEmbedUrl?: string | null;
  heroVideoTitle?: string;
  /** Play overlay + scroll link only when a video/audio embed section exists. */
  heroScrollTarget?: HeroScrollTarget;
  heroVideoSectionId?: string;
  heroGallerySectionId?: string;
  /** Inline WhatsApp + book CTAs under the subtitle (default on). */
  showHeroCtas?: boolean;
  /** slug לפתרון אוטומטי של CTA ל-/book (למשל studio/recording-song-modiin). */
  bookSlug?: string;
  /** הצג כפתור הזמנה מקוונת ב-Hero (ברירת מחדל: כן כשיש bookSlug או bookHref). */
  showBookCtaInHero?: boolean;
  bookHref?: string;
  bookLabel?: string;
  /** הסתר קישור גלילה לוידאו/גלריה מתחת ל-CTA */
  showHeroScrollLink?: boolean;
  /** מגביל נקודות ✓ מתחת ל-Hero (ברירת מחדל: 3) */
  maxHeroFeatures?: number;
  /** קטגוריית השירות - קובעת את צבע ה-accent הקונטקסטואלי (--service-accent) */
  category?: string;
  /**
   * נתיב העמוד (למשל "/events/host") - כשמסופק, מייצר JSON-LD משולב
   * (Service + FAQPage) ומוזרק ל-<head>. השאר ריק אם הדף כבר מציג
   * ServicePageSchema/FaqPageSchema משלו (דרך מרשם השירותים) כדי
   * למנוע כפילות סכמות.
   */
  pagePath?: string;
  /** תיאור לסכמת ה-Service; ברירת מחדל היא ה-subtitle */
  metaDescription?: string;
  /** שאלות נפוצות לסכמת FAQPage המקוננת */
  faqs?: readonly { question: string; answer: string }[];
  /** כפתור שיתוף מנוסח מראש למנהלים/רכש (למשל "שירות הפקת הפודקאסטים") */
  corporateShareLabel?: string;
  /** שורת תוצאה קצרה מתחת לsubtitle לפני ה-CTA - "מה תקבלו בפועל" */
  valueFrame?: string;
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-4 w-4 shrink-0", className)}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const HERO_FRAME_CLASS =
  "relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-neutral-200 shadow-[0_20px_64px_rgba(0,0,0,0.18)] sm:aspect-[5/4] lg:aspect-[4/3]";

function ServiceHeroVideoVisual({
  heroVideoEmbedUrl,
  heroVideoTitle,
}: {
  heroVideoEmbedUrl: string;
  heroVideoTitle: string;
}) {
  return (
    <LazyYouTubeEmbed
      embedUrl={heroVideoEmbedUrl}
      title={heroVideoTitle}
      className="rounded-2xl border border-border shadow-[0_20px_64px_rgba(0,0,0,0.18)]"
    />
  );
}

function ServiceHeroVisual({
  heroImageSrc,
  heroImageAlt,
  heroScrollTarget,
  scrollHref,
  showVideoPlay,
}: {
  heroImageSrc: string;
  heroImageAlt: string;
  heroScrollTarget?: HeroScrollTarget;
  scrollHref: string;
  showVideoPlay: boolean;
}) {
  const frame = (
    <div className={HERO_FRAME_CLASS}>
      <Image
        src={heroImageSrc}
        alt={heroImageAlt}
        fill
        className="object-cover object-center"
        sizes="(max-width: 1024px) 100vw, 46rem"
        priority
        fetchPriority="high"
        loading="eager"
        decoding="async"
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/65 via-black/10 to-transparent"
        aria-hidden
      />
      {heroScrollTarget === "gallery" ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] p-4">
          <span className="inline-flex rounded-full bg-black/65 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
            דוגמאות מהשטח
          </span>
        </div>
      ) : null}
      {showVideoPlay ? (
        <Link
          href={scrollHref}
          className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-2 p-6 text-center transition-colors hover:bg-black/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)]"
          aria-label="גלילה לסרטון הדגמה"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/80 text-[var(--service-accent,#d42b2b)] ring-2 ring-[var(--service-accent,#d42b2b)]/70 shadow-[0_0_40px_color-mix(in_srgb,var(--service-accent,#d42b2b)_55%,transparent)] sm:h-[4.5rem] sm:w-[4.5rem]">
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden>
              <path
                d="M12 8L26 16L12 24V8Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-sm font-semibold text-white drop-shadow-md">
            לצפייה בדוגמא
          </span>
        </Link>
      ) : null}
    </div>
  );

  if (!heroScrollTarget || showVideoPlay) {
    return frame;
  }

  return (
    <Link
      href={scrollHref}
      className="group block w-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)]"
      aria-label="גלילה לגלריית תמונות"
    >
      <div className="group-hover-scale-sm relative motion-reduce:transform-none">
        {frame}
      </div>
    </Link>
  );
}

export default function ServicePageLayout({
  title,
  subtitle,
  features,
  whatsappText,
  startingPrice,
  utmCampaign,
  children,
  ctaLabel = "דברו איתנו בוואטסאפ",
  scarcityLabel,
  className,
  heroImageSrc,
  heroImageAlt = "",
  heroVideoEmbedUrl,
  heroVideoTitle,
  heroScrollTarget,
  heroVideoSectionId = SERVICE_SHOWCASE_VIDEO_ID,
  heroGallerySectionId = SERVICE_PORTFOLIO_GALLERY_ID,
  showHeroCtas = true,
  bookSlug,
  showBookCtaInHero,
  bookHref,
  bookLabel,
  showHeroScrollLink,
  maxHeroFeatures,
  category,
  pagePath,
  metaDescription,
  faqs,
  corporateShareLabel,
  valueFrame,
}: ServicePageLayoutProps) {
  const pageEntitySchema = pagePath
    ? buildServicePageEntitySchema({
        pagePath,
        title,
        description: metaDescription ?? subtitle,
        faqs,
      })
    : null;
  const autoBookCta = bookSlug ? resolveServiceBookCta(bookSlug) : null;
  const resolvedBookHref = bookHref ?? autoBookCta?.bookHref;
  const resolvedBookLabel = bookLabel ?? autoBookCta?.bookLabel ?? "הזמנה מקוונת";
  const resolvedShowBookInHero =
    showBookCtaInHero ?? Boolean(resolvedBookHref);

  const heroFeatures = sliceHeroFeatures(features, maxHeroFeatures);
  const hasHeroImage = Boolean(heroImageSrc?.trim());
  const hasHeroVideo = Boolean(heroVideoEmbedUrl?.trim());
  const resolvedShowHeroScrollLink =
    showHeroScrollLink !== undefined ? showHeroScrollLink : hasHeroImage;
  const baseText = whatsappText?.trim() || buildServiceWhatsAppText(title);
  const inquiryText = startingPrice ? `${baseText} - מחיר: ${startingPrice}` : baseText;

  const whatsappHref = buildWhatsAppHref({
    text: inquiryText,
    utm_source: "website",
    utm_campaign: utmCampaign,
  });

  const scrollSectionId =
    heroScrollTarget === "video" ? heroVideoSectionId : heroGallerySectionId;
  const scrollHref = heroScrollTarget ? `#${scrollSectionId}` : undefined;
  const scrollLinkLabel =
    heroScrollTarget === "video"
      ? "צפו בוידאו מהשטח ↓"
      : heroScrollTarget === "gallery"
        ? "צפו בגלריית תמונות ↓"
        : null;

  const hasHeroGrid = hasHeroImage || hasHeroVideo;

  return (
    <HubAccentScope category={category}>
    <article className={cn("bg-background", className)}>
      {pageEntitySchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pageEntitySchema) }}
        />
      ) : null}
      <header
        className="relative overflow-hidden border-b border-border"
        aria-labelledby="service-page-heading"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_-15%,color-mix(in_srgb,var(--service-accent,#d42b2b)_14%,transparent),transparent_62%)]"
          aria-hidden="true"
        />
        {/* Ambient accent glows - decorative, GPU-only (opacity/blur), zero INP impact. */}
        <div
          className="pointer-events-none absolute -end-32 -top-32 h-[26rem] w-[26rem] select-none rounded-full bg-[var(--service-accent,#d42b2b)] opacity-[0.025] blur-[120px] will-change-transform"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -start-40 top-1/3 h-[22rem] w-[22rem] select-none rounded-full bg-[var(--service-accent,#d42b2b)] opacity-[0.025] blur-[120px] will-change-transform"
          aria-hidden="true"
        />
        {!hasHeroGrid ? (
          <div
            className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(135deg,transparent_0%,color-mix(in_srgb,var(--service-accent,#d42b2b)_4%,transparent)_50%,transparent_100%)]"
            aria-hidden
          />
        ) : null}

        <Container
          variant="wide"
          className={cn(
            "relative py-12 sm:py-16 lg:py-20",
            hasHeroGrid &&
              "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14 xl:gap-20",
          )}
        >
          <div className={cn(hasHeroGrid && "lg:max-w-2xl")}>
            <p className="text-xs font-semibold tracking-[0.2em] text-[var(--service-accent-ink,#8a1c1c)] uppercase">
              {SITE_KICKER}
            </p>
            {scarcityLabel ? (
              <p className="mt-4 w-fit rounded-full border border-[var(--service-accent,#d42b2b)]/40 bg-[var(--service-accent,#d42b2b)]/10 px-3 py-1 text-xs font-semibold text-[var(--service-accent-ink,#8a1c1c)]">
                {scarcityLabel}
              </p>
            ) : null}
            {/* IMPROVED: fluid hero typography */}
            <h1
              id="service-page-heading"
              className="text-hero mt-4 max-w-3xl font-serif font-semibold text-foreground"
            >
              {title}
            </h1>
            <p className="text-lead mt-5 max-w-2xl text-muted-foreground">
              {subtitle}
            </p>

            <SocialProofStrip className="mt-4" />

            {valueFrame ? (
              <p className="mt-4 text-sm font-semibold text-[var(--service-accent-ink,#8a1c1c)]">
                {valueFrame}
              </p>
            ) : null}

            {showHeroCtas ? (
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Button
                  as="a"
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  liquid
                  className="gap-2 px-6 shadow-[0_0_20px_color-mix(in_srgb,var(--service-accent,#d42b2b)_22%,transparent)] hover:shadow-[0_0_28px_color-mix(in_srgb,var(--service-accent,#d42b2b)_35%,transparent)]"
                  aria-label={`${ctaLabel} - ${title}`}
                >
                  <WhatsAppIcon />
                  {ctaLabel}
                </Button>
                {resolvedShowBookInHero && resolvedBookHref ? (
                  <Button as="link" href={resolvedBookHref} variant="outline">
                    {resolvedBookLabel}
                  </Button>
                ) : null}
              </div>
            ) : null}

            {showHeroCtas ? (
              <p className="mt-3 text-xs text-muted-foreground">
                {TIME_CLAIMS.waResponse1h}{" "}
                <Link
                  href="/start"
                  className="font-semibold text-[var(--service-accent-ink,#8a1c1c)] hover:underline"
                >
                  איך התהליך עובד
                </Link>
              </p>
            ) : null}

            {showHeroCtas ? (
              <TrustBadges className="mt-4" />
            ) : null}

            {resolvedShowHeroScrollLink && scrollHref && scrollLinkLabel ? (
              <Link
                href={scrollHref}
                className="mt-5 inline-flex text-sm font-semibold text-[var(--service-accent-ink,#8a1c1c)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)]"
              >
                {scrollLinkLabel}
              </Link>
            ) : null}
          </div>

          {hasHeroVideo && heroVideoEmbedUrl ? (
            <div className="mt-10 w-full min-w-0 lg:mt-0">
              <ServiceHeroVideoVisual
                heroVideoEmbedUrl={heroVideoEmbedUrl}
                heroVideoTitle={heroVideoTitle ?? title}
              />
            </div>
          ) : null}

          {!hasHeroVideo && hasHeroImage && heroImageSrc ? (
            <div className="mt-10 w-full min-w-0 lg:mt-0">
              <ServiceHeroVisual
                heroImageSrc={heroImageSrc}
                heroImageAlt={heroImageAlt}
                heroScrollTarget={heroScrollTarget}
                scrollHref={scrollHref ?? "#"}
                showVideoPlay={heroScrollTarget === "video"}
              />
            </div>
          ) : null}
        </Container>
      </header>

      {heroFeatures.length > 0 ? (
        <section
          className="border-b border-border bg-surface py-12 sm:py-16"
          aria-labelledby="service-features-heading"
        >
          <Container variant="wide">
            <h2 id="service-features-heading" className="sr-only">
              יתרונות ושירותים
            </h2>
            <ul
              className={cn(
                "grid grid-cols-1 gap-4",
                heroFeatures.length <= 3 ? "md:grid-cols-3" : "md:grid-cols-2",
              )}
            >
              {heroFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex gap-3 rounded-xl border border-border bg-background p-5 text-sm leading-relaxed text-foreground"
                >
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--service-accent,#d42b2b)]/40 text-xs font-bold text-[var(--service-accent-ink,#8a1c1c)]"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {metaDescription && pagePath ? (
        <>
          <SpeakableSchema url={`https://yakircohen.com${pagePath}`} />
          <div className="border-b border-border bg-background px-4 pb-2 pt-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <AnswerBlock>{metaDescription}</AnswerBlock>
            </div>
          </div>
        </>
      ) : null}

      {children ? (
        <section className="bg-background py-12 sm:py-16">{children}</section>
      ) : null}

      <PageBottomCta
        layout="section"
        variant="whatsapp"
        headingId="service-cta-heading"
        whatsappHref={whatsappHref}
        whatsappLabel={ctaLabel}
        whatsappAriaLabel={`${ctaLabel} - ${title}`}
        showBookContact={Boolean(resolvedBookHref)}
        bookHref={resolvedBookHref}
        bookLabel={resolvedBookLabel}
      >
        {corporateShareLabel ? (
          <CorporateShareButton
            serviceLabel={corporateShareLabel}
            title={`${title} | יקיר כהן הפקות`}
          />
        ) : null}
      </PageBottomCta>
    </article>
    </HubAccentScope>
  );
}
