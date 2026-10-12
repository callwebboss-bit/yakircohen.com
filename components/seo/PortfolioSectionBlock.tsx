import Link from "@/components/ui/IntentLink";
import RecordingSongExampleVideos from "@/components/seo/RecordingSongExampleVideos";
import VideoObjectSchema from "@/components/seo/VideoObjectSchema";
import VoiceoverNarratorCompare from "@/components/seo/VoiceoverNarratorCompare";
import { getPortfolioPlaylistCta } from "@/lib/data/portfolio-playlist-cta";
import { formatHubPriceDual } from "@/lib/data/pricing-display";
import {
  PORTFOLIO_FEATURED_PER_SECTION,
  getPortfolioSectionElementId,
  getPortfolioSectionVideos,
  type PortfolioSection,
} from "@/lib/data/portfolio-structure";

/**
 * תת-קטגוריה בתיק העבודות: 3 כרטיסים, ואחריהם כל שאר הסרטונים כרשימה מקופלת.
 * ה-CTA הוא שורה אחת ולא תיבה: 14 תיבות זהות הוסיפו גובה ורעש.
 * הרשימה נמצאת ב-HTML מההתחלה, כך שגוגל ומנועי AI קוראים את כל השמות, והדף
 * נשאר קצר. סימון VideoObject רק לכרטיסים הגלויים.
 */
export default function PortfolioSectionBlock({ section }: { section: PortfolioSection }) {
  const videos = getPortfolioSectionVideos(section);
  if (videos.length === 0) return null;

  const featured = videos.slice(0, PORTFOLIO_FEATURED_PER_SECTION);
  const rest = videos.slice(PORTFOLIO_FEATURED_PER_SECTION);
  const elementId = getPortfolioSectionElementId(section);
  const headingId = `${elementId}-heading`;
  const cta = section.ctaPlaylist ? getPortfolioPlaylistCta(section.ctaPlaylist) : null;

  return (
    <section id={elementId} className="scroll-mt-24" aria-labelledby={headingId}>
      <VideoObjectSchema
        videos={featured.map((v) => ({
          videoId: v.videoId,
          name: v.title,
          description: v.description,
        }))}
      />
      <header className="max-w-2xl">
        <h3
          id={headingId}
          className="font-serif text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          {section.heading}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {section.subheading}
        </p>
      </header>

      {section.voiceoverCompare ? (
        <VoiceoverNarratorCompare context="portfolio" className="mt-6" />
      ) : null}

      <div className="mt-6">
        <RecordingSongExampleVideos
          videos={featured}
          initialVisible={featured.length}
          portfolioCards
          cardHeadingLevel={4}
        />
      </div>

      {rest.length > 0 ? (
        <details className="group mt-6 rounded-xl border border-border bg-surface">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-foreground hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red [&::-webkit-details-marker]:hidden">
            <span>
              עוד {rest.length} סרטונים ב{section.label}
            </span>
            <span aria-hidden className="transition-transform group-open:rotate-180">
              ▾
            </span>
          </summary>
          <ul className="grid gap-x-6 gap-y-1 border-t border-border px-4 py-3 sm:grid-cols-2">
            {rest.map((v) => (
              <li key={v.videoId} className="text-sm">
                {v.href ? (
                  <Link
                    href={v.href}
                    className="inline-flex min-h-11 items-center font-semibold text-foreground hover:text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                  >
                    {v.title}
                  </Link>
                ) : (
                  <a
                    href={`https://www.youtube.com/watch?v=${v.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-foreground hover:text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                  >
                    {v.badge ? <span className="me-2 text-xs font-semibold text-brand-red">{v.badge}</span> : null}
                    {v.title}
                    <span className="sr-only"> (נפתח ביוטיוב בלשונית חדשה)</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      {cta ? (
        <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <Link
            href={cta.bookHref}
            data-utm={cta.utmCampaign}
            className="inline-flex min-h-11 items-center font-semibold text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            {cta.bookLabel}
          </Link>
          <span className="text-muted-foreground">
            {formatHubPriceDual(cta.priceExVat, cta.priceFrom)}
          </span>
          <Link
            href={cta.serviceHref}
            className="inline-flex min-h-11 items-center text-foreground hover:text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            {cta.serviceLabel}
          </Link>
        </p>
      ) : section.serviceLink ? (
        <p className="mt-6">
          <Link
            href={section.serviceLink.href}
            className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            {section.serviceLink.label}
          </Link>
        </p>
      ) : null}
    </section>
  );
}
