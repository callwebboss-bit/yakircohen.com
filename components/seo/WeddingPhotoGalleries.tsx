import MediaGallery from "@/components/marketing/MediaGallery";
import {
  WEDDING_GALLERY_BEST_MAX,
  WEDDING_GALLERY_EVENTS_MAX,
} from "@/lib/data/wedding-photography-page";
import { listServicePortfolioImageSet } from "@/lib/service-portfolio-images";

const ASSETS_FOLDER = "photography/wedding";

export default function WeddingPhotoGalleries() {
  const { primary, archive } = listServicePortfolioImageSet(ASSETS_FOLDER);
  const bestOf = primary.slice(0, WEDDING_GALLERY_BEST_MAX);
  const events = archive.slice(0, WEDDING_GALLERY_EVENTS_MAX);

  // אין תמונות בתיקייה. עדיף להציג כלום מאשר להבטיח גלריה שתגיע.
  // ההבטחה הקודמת הוסרה ב-2.10.2026 בהחלטת הבעלים.
  if (bestOf.length === 0 && events.length === 0) {
    return null;
  }

  return (
    <div className="space-y-20">
      {bestOf.length > 0 ? (
        <section
          id="wedding-gallery-best"
          className="scroll-mt-24 rounded-2xl border border-border bg-surface px-4 py-10 sm:px-8 sm:py-12"
          aria-labelledby="wedding-best-heading"
        >
          <header className="mx-auto mb-8 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              תיק עבודות
            </p>
            <h2
              id="wedding-best-heading"
              className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              Best of Weddings
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              רגעים נבחרים מחתונות - עד {WEDDING_GALLERY_BEST_MAX} תמונות איכות
            </p>
          </header>
          <MediaGallery
            images={bestOf.map((img) => ({ src: img.src, alt: img.alt }))}
            layout="masonry"
            embedded
            initialVisible={WEDDING_GALLERY_BEST_MAX}
            showFooterHint={false}
          />
        </section>
      ) : null}

      {events.length > 0 ? (
        <section
          className="rounded-2xl border border-border bg-background px-4 py-10 sm:px-8 sm:py-12"
          aria-labelledby="wedding-events-heading"
        >
          <header className="mx-auto mb-8 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              מהשטח
            </p>
            <h2
              id="wedding-events-heading"
              className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              אירועים קטנים - רגעים מהשטח
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              אירועים משפחתיים ואינטימיים - תמונות בתיקיית{" "}
              <span className="font-mono text-xs">archive</span>
            </p>
          </header>
          <MediaGallery
            images={events.map((img) => ({ src: img.src, alt: img.alt }))}
            layout="masonry"
            embedded
            initialVisible={WEDDING_GALLERY_EVENTS_MAX}
            showFooterHint={false}
          />
        </section>
      ) : null}
    </div>
  );
}
