import Link from "@/components/ui/IntentLink";
import HubPageSchema from "@/components/seo/HubPageSchema";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import PortfolioCategoryNav from "@/components/seo/PortfolioCategoryNav";
import PortfolioPlaylistCta from "@/components/marketing/PortfolioPlaylistCta";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import {
  PORTFOLIO_HUB_PLAYLIST_ORDER,
  VIDEO_PLAYLISTS,
  type PlaylistId,
} from "@/lib/data/video-playlists";
import { getPortfolioPlaylistCta } from "@/lib/data/portfolio-playlist-cta";
import { getPlaylistVideoCount } from "@/lib/data/video-portfolio";
import { PORTFOLIO_CATALOG_COUNT } from "@/lib/data/video-catalog.generated";
import {
  hubSchemaPropsFromSeo,
  metadataForHubSeo,
  PORTFOLIO_HUB_SEO,
} from "@/lib/seo/hub-pages";
import VoiceoverNarratorCompare from "@/components/seo/VoiceoverNarratorCompare";

export const portfolioMetadata = metadataForHubSeo(PORTFOLIO_HUB_SEO);

const NAV_ITEMS = PORTFOLIO_HUB_PLAYLIST_ORDER.filter((id) => {
  const count = getPlaylistVideoCount(id);
  return count > 0;
}).map((id) => ({
  id,
  label: VIDEO_PLAYLISTS[id].kicker ?? VIDEO_PLAYLISTS[id].heading.slice(0, 24),
}));

export default function PortfolioPageContent() {
  return (
    <>
      <HubPageSchema {...hubSchemaPropsFromSeo(PORTFOLIO_HUB_SEO)} />
      <div className="bg-background">
      <Section padding="sm" className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.12),transparent_55%)]"
          aria-hidden
        />
        <Container className="relative max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            תיק וידאו
          </p>
          <h1 className="text-hero mt-4 font-serif font-semibold text-foreground">
            תיק עבודות וידאו
          </h1>
          <p className="text-lead mt-4 text-muted-foreground">
            {PORTFOLIO_CATALOG_COUNT} סרטונים מהאולפן, האירועים והפודקאסטים - ממוינים לפי
            נושא. לחצו על קטגוריה או גללו לדוגמאות. בכל כרטיס: תצוגה מקדימה, ואז נגן
            בלחיצה (חוסך זמן טעינה). בקריינות יש גם שתי דוגמאות האזנה.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button as="link" href="/studio">
              לאולפן ההקלטות
            </Button>
            <Button as="link" href="/book" variant="secondary">
              הזמנה מקוונת
            </Button>
            <Button as="link" href="/gallery" variant="secondary">
              גלריית תמונות
            </Button>
          </div>
        </Container>
      </Section>

      <PortfolioCategoryNav items={NAV_ITEMS} />

      <Section padding="sm">
        <Container className="space-y-20">
          {PORTFOLIO_HUB_PLAYLIST_ORDER.map((playlistId) => (
            <PortfolioPlaylistBlock key={playlistId} playlistId={playlistId} />
          ))}
        </Container>
      </Section>

    </div>
    </>
  );
}

function PortfolioPlaylistBlock({ playlistId }: { playlistId: PlaylistId }) {
  const config = VIDEO_PLAYLISTS[playlistId];
  const count = getPlaylistVideoCount(playlistId);
  if (count === 0) return null;

  const playlistCta = getPortfolioPlaylistCta(playlistId);

  return (
    <div id={`playlist-${playlistId}`} className="scroll-mt-24">
      {playlistId === "voiceover-hub" ? (
        <VoiceoverNarratorCompare context="portfolio" className="mb-10" />
      ) : null}
      <ShowcaseVideoSection
        playlistId={playlistId}
        heading={config.heading}
        subheading={config.subheading}
        kicker={config.kicker}
        sectionId={`playlist-${playlistId}-videos`}
        schemaVideoLimit={config.initialVisible}
        portfolioCards
      />
      {playlistCta ? (
        <PortfolioPlaylistCta cta={playlistCta} />
      ) : config.serviceLink ? (
        <p className="mt-6 text-center">
          <Link
            href={config.serviceLink.href}
            className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            {config.serviceLink.label}
          </Link>
        </p>
      ) : null}
    </div>
  );
}
