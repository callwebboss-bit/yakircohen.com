import MediaGallery from "@/components/marketing/MediaGallery";
import {
  EVENT_FILMING_GALLERY_BEST,
  EVENT_FILMING_GALLERY_BEST_MAX,
  EVENT_FILMING_GALLERY_EVENTS,
  EVENT_FILMING_GALLERY_EVENTS_MAX,
} from "@/lib/data/event-filming-page";
import { listServicePortfolioImageSet } from "@/lib/service-portfolio-images";

const ASSETS_FOLDER = "photography/wedding";

export default function EventFilmingPhotoGalleries() {
  const { primary, archive } = listServicePortfolioImageSet(ASSETS_FOLDER);
  const bestOf = primary.slice(0, EVENT_FILMING_GALLERY_BEST_MAX);
  const events = archive.slice(0, EVENT_FILMING_GALLERY_EVENTS_MAX);

  if (bestOf.length === 0 && events.length === 0) {
    return (
      <section
        className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center"
        aria-labelledby="event-filming-gallery-empty"
      >
        <h2
          id="event-filming-gallery-empty"
          className="text-lg font-semibold text-foreground"
        >
          גלריה בקרוב
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          תמונות מתיק העבודות יתווספו בקרוב. בינתיים — שלחו בוואטסאפ ונשמח להראות דוגמאות.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-20">
      {bestOf.length > 0 ? (
        <section
          id="event-filming-gallery-best"
          className="scroll-mt-24 rounded-2xl border border-border bg-surface px-4 py-10 sm:px-8 sm:py-12"
          aria-labelledby="event-filming-best-heading"
        >
          <header className="mx-auto mb-8 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              {EVENT_FILMING_GALLERY_BEST.kicker}
            </p>
            <h2
              id="event-filming-best-heading"
              className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              {EVENT_FILMING_GALLERY_BEST.title}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {EVENT_FILMING_GALLERY_BEST.subtitle}
            </p>
          </header>
          <MediaGallery
            images={bestOf.map((img) => ({ src: img.src, alt: img.alt }))}
            layout="masonry"
            embedded
            initialVisible={EVENT_FILMING_GALLERY_BEST_MAX}
            showFooterHint={false}
          />
        </section>
      ) : null}

      {events.length > 0 ? (
        <section
          className="rounded-2xl border border-border bg-background px-4 py-10 sm:px-8 sm:py-12"
          aria-labelledby="event-filming-events-heading"
        >
          <header className="mx-auto mb-8 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              {EVENT_FILMING_GALLERY_EVENTS.kicker}
            </p>
            <h2
              id="event-filming-events-heading"
              className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              {EVENT_FILMING_GALLERY_EVENTS.title}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {EVENT_FILMING_GALLERY_EVENTS.subtitle}
            </p>
          </header>
          <MediaGallery
            images={events.map((img) => ({ src: img.src, alt: img.alt }))}
            layout="masonry"
            embedded
            initialVisible={EVENT_FILMING_GALLERY_EVENTS_MAX}
            showFooterHint={false}
          />
        </section>
      ) : null}
    </div>
  );
}
