import MediaGallery from "@/components/marketing/MediaGallery";
import Container from "@/components/ui/Container";
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
  /** Pass true when a hero image already occupies the page above this gallery. */
  noPriority?: boolean;
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
  noPriority = false,
}: ServicePortfolioMediaProps) {
  const { primary, archive } = listServicePortfolioImageSet(assetsFolder);
  const hasImages = primary.length > 0 || archive.length > 0;
  const hasEmbed = isValidYouTubeEmbedUrl(playlistEmbedUrl);

  if (!hasImages && !hasEmbed && mediaType === "none") {
    return null;
  }

  const displayGallery =
    showGallery && hasImages && (mediaType === "gallery" || mediaType === "video");

  /**
   * אין גלריה ואין הטמעה. קודם רונדר כאן בלוק "גלריה בקרוב" שהבטיח תמונות
   * שיתווספו. נמדד ב-2.10.2026 על הבנייה: הוא הופיע בשני עמודים,
   * /studio/blessings/video-clip ו-/studio/blessings/bat-mitzvah-clip.
   * בהחלטת הבעלים, עדיף להציג כלום מאשר להבטיח מה שאין.
   */
  if (!displayGallery && !hasEmbed && mediaType !== "audio") {
    return null;
  }
  const subtitle =
    !showEmbed && displayGallery
      ? "תמונות מהשטח - לחצו על תמונה להגדלה"
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
    // IMPROVED: pass intrinsic dimensions when probed at build time (CLS)
    ...(image.width && image.height
      ? { width: image.width, height: image.height }
      : {}),
  }));

  const archiveGalleryItems = cappedArchive.map((image, index) => ({
    src: image.src,
    alt: ensureImageAlt(image.alt, {
      filename: image.filename,
      fallback: `${label} - ארכיון ${index + 1}`,
    }),
    ...(image.width && image.height
      ? { width: image.width, height: image.height }
      : {}),
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
      className={cn("scroll-mt-24", className)}
      aria-labelledby="portfolio-media-heading"
    >
      <Container>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}

      <header className="mb-6">
        <h2
          id="portfolio-media-heading"
          className="font-serif text-section-title font-semibold text-foreground"
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
            noPriority={noPriority}
          />
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
      </Container>
    </section>
  );
}
