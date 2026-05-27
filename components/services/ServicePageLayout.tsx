import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import PageBottomCta from "@/components/layout/PageBottomCta";
import Button from "@/components/ui/Button";
import { BLUR_DATA_URL } from "@/lib/blur";
import { SITE_KICKER } from "@/lib/constants";
import {
  SERVICE_PORTFOLIO_GALLERY_ID,
  SERVICE_SHOWCASE_VIDEO_ID,
  type HeroScrollTarget,
} from "@/lib/service-portfolio-hero";
import { sliceHeroFeatures } from "@/lib/service-page-ui";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import LazyYouTubeEmbed from "@/components/marketing/LazyYouTubeEmbed";

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
  /** הצג כפתור הזמנה מקוונת ב-Hero (ברירת מחדל: כן). */
  showBookCtaInHero?: boolean;
  /** הסתר קישור גלילה לוידאו/גלריה מתחת ל-CTA */
  showHeroScrollLink?: boolean;
  /** מגביל נקודות ✓ מתחת ל-Hero (ברירת מחדל: 3) */
  maxHeroFeatures?: number;
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
          className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-2 p-6 text-center transition-colors hover:bg-black/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          aria-label="גלילה לסרטון הדגמה"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/80 ring-2 ring-brand-red/70 shadow-[0_0_40px_rgba(212,43,43,0.55)] sm:h-[4.5rem] sm:w-[4.5rem]">
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden>
              <path
                d="M12 8L26 16L12 24V8Z"
                fill="#D42B2B"
                stroke="#D42B2B"
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
      className="group block w-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
      aria-label="גלילה לגלריית תמונות"
    >
      <div className="relative transition-transform duration-normal ease-luxury group-hover:scale-[1.01]">
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
  showBookCtaInHero = false,
  showHeroScrollLink,
  maxHeroFeatures,
}: ServicePageLayoutProps) {
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
    <article className={cn("bg-background", className)}>
      <header
        className="relative overflow-hidden border-b border-border"
        aria-labelledby="service-page-heading"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_-15%,rgba(212,43,43,0.14),transparent_62%)]"
          aria-hidden="true"
        />
        {!hasHeroGrid ? (
          <div
            className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(135deg,transparent_0%,rgba(212,43,43,0.04)_50%,transparent_100%)]"
            aria-hidden
          />
        ) : null}

        <div
          className={cn(
            "relative mx-auto max-w-[88rem] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20",
            hasHeroGrid &&
              "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14 xl:gap-20",
          )}
        >
          <div className={cn(hasHeroGrid && "lg:max-w-2xl")}>
            <p className="text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
              {SITE_KICKER}
            </p>
            {scarcityLabel ? (
              <p className="mt-4 w-fit rounded-full border border-brand-red/40 bg-brand-red/10 px-3 py-1 text-xs font-semibold text-brand-red">
                {scarcityLabel}
              </p>
            ) : null}
            <h1
              id="service-page-heading"
              className="mt-4 max-w-3xl font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.8rem] lg:leading-[1.12]"
            >
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {subtitle}
            </p>

            {showHeroCtas ? (
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-white transition-colors duration-normal ease-luxury",
                    "bg-brand-red hover:bg-brand-red-light",
                    "shadow-[0_0_20px_rgba(212,43,43,0.22)] hover:shadow-[0_0_28px_rgba(212,43,43,0.35)]",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                  )}
                  aria-label={`${ctaLabel} - ${title}`}
                >
                  <WhatsAppIcon />
                  {ctaLabel}
                </a>
                {showBookCtaInHero ? (
                  <Button as="link" href="/book" variant="outline">
                    הזמנה מקוונת
                  </Button>
                ) : null}
              </div>
            ) : null}

            {resolvedShowHeroScrollLink && scrollHref && scrollLinkLabel ? (
              <Link
                href={scrollHref}
                className="mt-5 inline-flex text-sm font-semibold text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
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
        </div>
      </header>

      {heroFeatures.length > 0 ? (
        <section
          className="border-b border-border bg-surface py-12 sm:py-16"
          aria-labelledby="service-features-heading"
        >
          <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
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
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand-red/40 text-xs font-bold text-brand-red"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
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
        showBookContact
      />
    </article>
  );
}
