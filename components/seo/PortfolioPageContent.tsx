import Link from "next/link";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import {
  PORTFOLIO_HUB_PLAYLIST_ORDER,
  VIDEO_PLAYLISTS,
  type PlaylistId,
} from "@/lib/data/video-playlists";
import {
  getPlaylistVideoCount,
  getPlaylistVideos,
} from "@/lib/data/video-portfolio";
import { buildItemListSchema } from "@/lib/video-schema";
import { PORTFOLIO_CATALOG_COUNT } from "@/lib/data/video-catalog.generated";
import { constructMetadata } from "@/lib/metadata";

export const portfolioMetadata = constructMetadata({
  title: "תיק עבודות וידאו | יקיר כהן הפקות",
  description:
    "מעל 270 דוגמאות וידאו מהאולפן, פודקאסט, ברכות, DJ וקריינות במודיעין - צפו לפי נושא והזמינו שירות.",
  slug: "portfolio",
  keywords: [
    "תיק עבודות אולפן",
    "דוגמאות הקלטה",
    "יקיר כהן הפקות",
    "אולפן מודיעין",
  ],
});

const NAV_ITEMS = PORTFOLIO_HUB_PLAYLIST_ORDER.filter((id) => {
  const count = getPlaylistVideoCount(id);
  return count > 0;
}).map((id) => ({
  id,
  label: VIDEO_PLAYLISTS[id].kicker ?? VIDEO_PLAYLISTS[id].heading.slice(0, 24),
}));

export default function PortfolioPageContent() {
  const itemListGraphs = PORTFOLIO_HUB_PLAYLIST_ORDER.map((playlistId) => {
    const config = VIDEO_PLAYLISTS[playlistId];
    const videos = getPlaylistVideos(playlistId);
    return buildItemListSchema(
      config.heading,
      videos.map((v) => ({ videoId: v.videoId, name: v.title })),
    );
  }).filter(Boolean);

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.12),transparent_55%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            תיק וידאו
          </p>
          <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            תיק עבודות וידאו
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {PORTFOLIO_CATALOG_COUNT} סרטונים מהאולפן, האירועים והפודקאסטים - ממוינים לפי
            נושא. לחצו על קטגוריה או גללו לדוגמאות. בכל כרטיס: תצוגה מקדימה, ואז נגן
            בלחיצה (חוסך זמן טעינה).
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/studio"
              className="inline-flex rounded-xl bg-brand-red px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-light"
            >
              לאולפן ההקלטות
            </Link>
            <Link
              href="/book"
              className="inline-flex rounded-xl border border-border px-6 py-2.5 text-sm font-semibold text-foreground hover:border-brand-red/40 hover:text-brand-red"
            >
              הזמנה מקוונת
            </Link>
          </div>
        </div>
      </section>

      <nav
        className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
        aria-label="קטגוריות תיק עבודות"
      >
        <div className="mx-auto flex max-w-[72rem] gap-1 overflow-x-auto px-4 py-3 sm:px-6">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#playlist-${item.id}`}
              className="shrink-0 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {itemListGraphs.map((graph, i) =>
        graph ? (
          <script
            key={PORTFOLIO_HUB_PLAYLIST_ORDER[i]}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
          />
        ) : null,
      )}

      <div className="mx-auto max-w-[72rem] space-y-20 px-4 py-14 sm:px-6 lg:px-8">
        {PORTFOLIO_HUB_PLAYLIST_ORDER.map((playlistId) => (
          <PortfolioPlaylistBlock key={playlistId} playlistId={playlistId} />
        ))}
      </div>
    </div>
  );
}

function PortfolioPlaylistBlock({ playlistId }: { playlistId: PlaylistId }) {
  const config = VIDEO_PLAYLISTS[playlistId];
  const count = getPlaylistVideoCount(playlistId);
  if (count === 0) return null;

  return (
    <div>
      <ShowcaseVideoSection
        playlistId={playlistId}
        heading={config.heading}
        subheading={config.subheading}
        kicker={config.kicker}
        sectionId={`playlist-${playlistId}`}
        schemaVideoLimit={24}
      />
      {config.serviceLink ? (
        <p className="mt-6 text-center">
          <Link
            href={config.serviceLink.href}
            className="text-sm font-semibold text-brand-red hover:underline"
          >
            {config.serviceLink.label} ←
          </Link>
        </p>
      ) : null}
    </div>
  );
}
