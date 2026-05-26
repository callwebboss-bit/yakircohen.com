import MediaGallery from "@/components/marketing/MediaGallery";
import { listServicePortfolioImageSet } from "@/lib/service-portfolio-images";

const ASSETS_FOLDER = "photography/wedding";
const MAX_IMAGES = 12;

export default function PhotographyEventsGallery() {
  const { primary, archive } = listServicePortfolioImageSet(ASSETS_FOLDER);
  const images = [...primary, ...archive].slice(0, MAX_IMAGES);

  if (images.length === 0) {
    return null;
  }

  return (
    <section
      id="photography-events-gallery"
      className="scroll-mt-24 rounded-2xl border border-border bg-surface px-4 py-10 sm:px-8"
      aria-labelledby="photography-events-gallery-heading"
    >
      <header className="mx-auto mb-8 max-w-2xl text-center">
        <h2
          id="photography-events-gallery-heading"
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          דוגמאות מהשטח
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          כנסים, אירועי חברה ורגעים מחתונות — עד {MAX_IMAGES} תמונות נבחרות
        </p>
      </header>
      <MediaGallery
        images={images.map((img) => ({ src: img.src, alt: img.alt }))}
        layout="masonry"
        embedded
        initialVisible={MAX_IMAGES}
        showFooterHint={false}
      />
    </section>
  );
}
