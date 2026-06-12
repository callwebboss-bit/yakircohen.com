import type { ReactNode } from "react";
import LazyYouTubeEmbed from "@/components/marketing/LazyYouTubeEmbed";
import ServicePortfolioMedia from "@/components/services/ServicePortfolioMedia";
import type { ServiceMediaType } from "@/lib/data/services";
import { isValidYouTubeEmbedUrl } from "@/lib/data/youtube-embeds";
import { listServicePortfolioImageSet } from "@/lib/service-portfolio-images";
import { SERVICE_SHOWCASE_VIDEO_ID } from "@/lib/service-portfolio-hero";
import { cn } from "@/lib/utils";

export type ServiceShowcaseSectionsProps = {
  assetsFolder: string;
  playlistEmbedUrl?: string | null;
  mediaType: ServiceMediaType;
  galleryLabel?: string;
  videoTitle?: string;
  videoHeading?: string;
  videoDescription?: string;
  videoSectionId?: string;
  videoHeadingId?: string;
  galleryInitialVisible?: number;
  showGallery?: boolean;
  galleryLayout?: "masonry" | "grid";
  className?: string;
  footer?: ReactNode;
  secondaryEmbedUrl?: string | null;
  secondaryEmbedTitle?: string;
};

import { SERVICE_GALLERY_MAX_IMAGES } from "@/lib/service-page-ui";

const DEFAULT_GALLERY_VISIBLE = SERVICE_GALLERY_MAX_IMAGES;

export default function ServiceShowcaseSections({
  assetsFolder,
  playlistEmbedUrl,
  mediaType,
  galleryLabel,
  videoTitle,
  videoHeading,
  videoDescription,
  videoSectionId = SERVICE_SHOWCASE_VIDEO_ID,
  videoHeadingId,
  galleryInitialVisible = DEFAULT_GALLERY_VISIBLE,
  showGallery = true,
  galleryLayout = "masonry",
  className,
  footer,
  secondaryEmbedUrl,
  secondaryEmbedTitle,
}: ServiceShowcaseSectionsProps) {
  const { primary, archive } = listServicePortfolioImageSet(assetsFolder);
  const hasImages = primary.length > 0 || archive.length > 0;
  const hasEmbed = isValidYouTubeEmbedUrl(playlistEmbedUrl);
  const hasSecondary = isValidYouTubeEmbedUrl(secondaryEmbedUrl);
  const headingId = videoHeadingId ?? `${videoSectionId}-heading`;
  const resolvedVideoTitle = videoTitle ?? galleryLabel ?? "וידאו מהשטח";
  const resolvedGalleryLabel = galleryLabel ?? resolvedVideoTitle;

  if (mediaType === "none" && !hasImages && !hasEmbed) {
    return null;
  }

  if (mediaType === "audio" && hasEmbed) {
    return (
      <div className={cn("space-y-8", className)}>
        {showGallery && hasImages ? (
          <ServicePortfolioMedia
            assetsFolder={assetsFolder}
            mediaType="gallery"
            label={resolvedGalleryLabel}
            showEmbed={false}
            galleryLayout={galleryLayout}
            galleryInitialVisible={galleryInitialVisible}
            className="px-0"
          />
        ) : null}
        <ServicePortfolioMedia
          assetsFolder={assetsFolder}
          playlistEmbedUrl={playlistEmbedUrl}
          mediaType="audio"
          label={resolvedVideoTitle}
          showGallery={false}
          className="px-0"
        />
        {footer}
      </div>
    );
  }

  const showGallerySection =
    showGallery &&
    hasImages &&
    (mediaType === "gallery" || mediaType === "video");

  const showVideoSection =
    (hasEmbed && mediaType === "video") || hasSecondary || footer;

  if (!showGallerySection && !showVideoSection) {
    return null;
  }

  return (
    <div className={cn("space-y-12", className)}>
      {showGallerySection ? (
        <ServicePortfolioMedia
          assetsFolder={assetsFolder}
          mediaType={mediaType === "gallery" ? "gallery" : "video"}
          label={resolvedGalleryLabel}
          showEmbed={false}
          galleryLayout={galleryLayout}
          galleryInitialVisible={galleryInitialVisible}
          className="px-0"
        />
      ) : null}

      {showVideoSection ? (
        <section
          id={videoSectionId}
          className="scroll-mt-24"
          aria-labelledby={videoHeading ? headingId : undefined}
        >
          {videoHeading ? (
            <header className="mx-auto max-w-2xl text-center">
              <h2
                id={headingId}
                className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                {videoHeading}
              </h2>
              <span
                className="mx-auto mt-3 block h-1 w-12 rounded-full bg-[var(--service-accent,#d42b2b)]"
                aria-hidden="true"
              />
              {videoDescription ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  {videoDescription}
                </p>
              ) : null}
            </header>
          ) : null}

          {hasEmbed && mediaType === "video" ? (
            <div className="mx-auto mt-8 max-w-4xl">
              <LazyYouTubeEmbed
                embedUrl={playlistEmbedUrl!}
                title={resolvedVideoTitle}
              />
            </div>
          ) : null}

          {footer ? <div className={hasEmbed ? "mt-8" : undefined}>{footer}</div> : null}

          {hasSecondary ? (
            <div className="mx-auto mt-8 max-w-4xl">
              <LazyYouTubeEmbed
                embedUrl={secondaryEmbedUrl!}
                title={secondaryEmbedTitle ?? "וידאו נוסף"}
              />
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
