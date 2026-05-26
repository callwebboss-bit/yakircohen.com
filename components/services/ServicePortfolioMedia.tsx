import MediaGallery from "@/components/marketing/MediaGallery";
import LazyClickEmbed from "@/components/marketing/LazyClickEmbed";
import LazyYouTubeEmbed from "@/components/marketing/LazyYouTubeEmbed";
import type { ServiceMediaType } from "@/lib/data/services";
import { isValidYouTubeEmbedUrl } from "@/lib/data/youtube-embeds";
import { ensureImageAlt } from "@/lib/image-alt";
import { buildPortfolioImageGalleryJsonLd } from "@/lib/portfolio-schema";
import { SERVICE_PORTFOLIO_GALLERY_ID } from "@/lib/service-portfolio-hero";
import { listServicePortfolioImageSet } from "@/lib/service-portfolio-images";
import { SERVICE_GALLERY_MAX_IMAGES } from "@/lib/service-page-ui";
import { cn } from "@/lib/utils";

export type ServicePortfolioMediaProps = {
  assetsFolder: string;
  playlistEmbedUrl?: string | null;
  mediaType: ServiceMediaType;
  label?: string;
  className?: string;
  /** Set false to show only the video/audio embed (no photo grid). */
  showGallery?: boolean;
  /** Max photos before "show more" (Core Web Vitals). */
  galleryInitialVisible?: number;
  galleryLayout?: "masonry" | "grid";
  /** When false, only the photo gallery is shown (video goes in a separate section). */
  showEmbed?: boolean;
  /** Anchor for hero scroll-to-gallery (default shared id). */
  sectionId?: string;
};

const PORTFOLIO_COPY: Partial<Record<ServiceMediaType, string>> = {
  video: "דוגמאות וידאו - איכות הפקה ויזואלית ברמה מקצועית",
  gallery: "גלריית צילום - דוגמאות מתיק העבודות",
  audio: "דוגמאות מהאולפן - איכות סאונד ברמה מקצועית",
};

const DEFAULT_GALLERY_INITIAL = SERVICE_GALLERY_MAX_IMAGES;

export default function ServicePortfolioMedia({
  assetsFolder,
  playlistEmbedUrl,
  mediaType,
  label = "תיק עבודות",
  className,
  showGallery = true,
  galleryInitialVisible = DEFAULT_GALLERY_INITIAL,
  galleryLayout = "masonry",
  showEmbed = true,
  sectionId = SERVICE_PORTFOLIO_GALLERY_ID,
}: ServicePortfolioMediaProps) {
  const { primary, archive } = listServicePortfolioImageSet(assetsFolder);
  const hasImages = primary.length > 0 || archive.length > 0;
  const hasEmbed = isValidYouTubeEmbedUrl(playlistEmbedUrl);

  if (!hasImages && !hasEmbed && mediaType === "none") {
    return null;
  }

  const displayGallery =
    showGallery && hasImages && (mediaType === "gallery" || mediaType === "video");
  const subtitle =
    !showEmbed && displayGallery
      ? "תמונות מהשטח · לחצו על תמונה להגדלה"
      : (PORTFOLIO_COPY[mediaType] ?? "דוגמאות מהפרויקטים שלנו");

  const cappedPrimary = primary.slice(0, SERVICE_GALLERY_MAX_IMAGES);
  const remainingSlots = Math.max(0, SERVICE_GALLERY_MAX_IMAGES - cappedPrimary.length);
  const cappedArchive = archive.slice(0, remainingSlots);

  const galleryItems = cappedPrimary.map((image, index) => ({
    src: image.src,
    alt: ensureImageAlt(image.alt, {
      filename: image.filename,
      fallback: `${label} - תמונה ${index + 1}`,
    }),
  }));

  const archiveGalleryItems = cappedArchive.map((image, index) => ({
    src: image.src,
    alt: ensureImageAlt(image.alt, {
      filename: image.filename,
      fallback: `${label} - ארכיון ${index + 1}`,
    }),
  }));

  const jsonLd =
    hasImages && displayGallery
      ? buildPortfolioImageGalleryJsonLd([...primary, ...archive], {
          name: label,
          description: subtitle,
        })
      : null;

  return (
    <section
      id={displayGallery ? sectionId : undefined}
      className={cn(
        "mx-auto max-w-[72rem] scroll-mt-24 px-4 sm:px-6 lg:px-8",
        className,
      )}
      aria-labelledby="portfolio-media-heading"
    >
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}

      <header className="mb-6">
        <h2
          id="portfolio-media-heading"
          className="text-xl font-semibold text-foreground sm:text-2xl"
        >
          {label}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      </header>

      <div className="space-y-6">
        {displayGallery ? (
          <MediaGallery
            images={galleryItems}
            archiveImages={archiveGalleryItems}
            embedded
            layout={galleryLayout}
            initialVisible={Math.min(galleryInitialVisible, SERVICE_GALLERY_MAX_IMAGES)}
            showFooterHint={false}
          />
        ) : !hasEmbed && mediaType !== "audio" ? (
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-linear-to-br from-neutral-100 via-background to-neutral-200 shadow-sm"
            role="status"
          >
            <div className="absolute inset-0 bg-linear-to-tr from-brand-red/10 via-transparent to-foreground/5" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
              <p className="text-sm font-semibold text-brand-red">גלריה בקרוב</p>
              <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
                אנחנו מעלים דוגמאות נוספות לעמוד זה. בינתיים אפשר לצפות בוידאו או ליצור קשר
                בוואטסאפ לדוגמאות מהאירועים שלנו.
              </p>
            </div>
          </div>
        ) : null}

        {showEmbed && hasEmbed && mediaType === "video" ? (
          <LazyYouTubeEmbed embedUrl={playlistEmbedUrl!} title={label} />
        ) : null}

        {hasEmbed && mediaType === "audio" ? (
          <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <div className="border-b border-border bg-background px-4 py-3">
              <p className="text-sm font-semibold text-foreground">דוגמאות האזנה</p>
              <p className="text-xs text-muted-foreground">פלייליסט מהאולפן</p>
            </div>
            <div className="p-2 sm:p-3">
              <LazyClickEmbed
                src={playlistEmbedUrl!}
                title={label}
                hint="לחצו להאזנה"
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
