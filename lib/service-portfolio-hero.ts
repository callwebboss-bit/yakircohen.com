import type { ServiceEntity, ServiceMediaType } from "@/lib/data/services";
import { isValidYouTubeEmbedUrl } from "@/lib/data/youtube-embeds";
import {
  listServicePortfolioImageSet,
  type PortfolioImage,
} from "@/lib/service-portfolio-images";

/** Shared anchor for hero play button → lazy video section. */
export const SERVICE_SHOWCASE_VIDEO_ID = "service-showcase-video";

/** Gallery block anchor for hero "scroll to photos". */
export const SERVICE_PORTFOLIO_GALLERY_ID = "service-portfolio-gallery";

const HERO_FILENAME_PRIORITY = /(?:^|[-_.])(?:hero|cover|banner|main|ראש|ראשי)(?:[-_.]|$)/i;

/** Shared studio cover when a service folder has no photos yet. */
const HERO_IMAGE_FALLBACK_FOLDER = "podcast";

export type HeroScrollTarget = "video" | "gallery";

export type ServicePageHeroBundle = {
  heroImageSrc?: string;
  heroImageAlt: string;
  heroScrollTarget?: HeroScrollTarget;
  heroVideoSectionId?: string;
};

export function pickPortfolioHeroImage(
  images: readonly PortfolioImage[],
  preferredPattern?: RegExp,
): PortfolioImage | null {
  if (images.length === 0) return null;

  const byPriority = images.find((img) => HERO_FILENAME_PRIORITY.test(img.filename));
  if (byPriority) return byPriority;

  if (preferredPattern) {
    const preferred = images.find((img) => preferredPattern.test(img.filename));
    if (preferred) return preferred;
  }

  const webp = images.find((img) => /\.webp$/i.test(img.filename));
  return webp ?? images[0];
}

export function inferHeroScrollTarget(
  assetsFolder: string,
  mediaType: ServiceMediaType,
  playlistEmbedUrl?: string | null,
): HeroScrollTarget | undefined {
  const hasEmbed = isValidYouTubeEmbedUrl(playlistEmbedUrl);
  const { primary, archive } = listServicePortfolioImageSet(assetsFolder);
  const hasImages = primary.length > 0 || archive.length > 0;

  if (mediaType === "video" && hasEmbed) return "video";
  if (mediaType === "audio" && hasEmbed) return "video";
  if (hasEmbed && !hasImages) return "video";
  if (
    hasImages &&
    (mediaType === "gallery" || mediaType === "video" || mediaType === "audio")
  ) {
    return "gallery";
  }
  return undefined;
}

export type ResolveServicePageHeroOptions = {
  mediaType?: ServiceMediaType;
  playlistEmbedUrl?: string | null;
  videoSectionId?: string;
};

export function resolveServicePageHero(
  assetsFolder: string,
  fallbackAlt: string,
  preferredPattern?: RegExp,
  options?: ResolveServicePageHeroOptions,
): ServicePageHeroBundle & {
  portfolioImages: PortfolioImage[];
  archiveImages: PortfolioImage[];
} {
  const { primary, archive } = listServicePortfolioImageSet(assetsFolder);
  let heroImage = pickPortfolioHeroImage(primary, preferredPattern);
  const mediaType = options?.mediaType ?? "gallery";
  const hasEmbed = isValidYouTubeEmbedUrl(options?.playlistEmbedUrl);

  if (!heroImage && hasEmbed) {
    const embedMatch = options?.playlistEmbedUrl?.match(
      /\/embed\/([A-Za-z0-9_-]{11})(?:[?&]|$)/,
    );
    if (embedMatch?.[1]) {
      heroImage = {
        src: `https://i.ytimg.com/vi/${embedMatch[1]}/maxresdefault.jpg`,
        alt: fallbackAlt,
        filename: `${embedMatch[1]}.jpg`,
      };
    } else {
      const fallback = listServicePortfolioImageSet(HERO_IMAGE_FALLBACK_FOLDER);
      heroImage = pickPortfolioHeroImage(fallback.primary, preferredPattern);
    }
  }

  const heroScrollTarget = options
    ? inferHeroScrollTarget(assetsFolder, mediaType, options.playlistEmbedUrl)
    : inferHeroScrollTarget(assetsFolder, "gallery", null);

  return {
    portfolioImages: primary,
    archiveImages: archive,
    heroImageSrc: heroImage?.src,
    heroImageAlt: heroImage?.alt ?? fallbackAlt,
    heroScrollTarget,
    heroVideoSectionId: options?.videoSectionId ?? SERVICE_SHOWCASE_VIDEO_ID,
  };
}

/** Hero props from a registry / service entity (media + embed aware). */
/** Shared `public/images/services/podcast/` folder across podcast landing pages. */
export function resolvePodcastFolderHero(
  fallbackAlt: string,
  playlistEmbedUrl?: string | null,
  preferredPattern?: RegExp,
): ServicePageHeroBundle {
  const hasVideo = isValidYouTubeEmbedUrl(playlistEmbedUrl);
  const resolved = resolveServicePageHero("podcast", fallbackAlt, preferredPattern, {
    mediaType: hasVideo ? "video" : "gallery",
    playlistEmbedUrl,
  });
  return {
    heroImageSrc: resolved.heroImageSrc,
    heroImageAlt: resolved.heroImageAlt,
    heroScrollTarget: resolved.heroScrollTarget,
    heroVideoSectionId: resolved.heroVideoSectionId,
  };
}

export function resolveServicePageHeroFromEntity(
  service: Pick<ServiceEntity, "assetsFolder" | "title" | "mediaType" | "playlistEmbedUrl">,
  preferredPattern?: RegExp,
  options?: Pick<ResolveServicePageHeroOptions, "videoSectionId">,
): ServicePageHeroBundle {
  const resolved = resolveServicePageHero(
    service.assetsFolder,
    service.title,
    preferredPattern,
    {
      mediaType: service.mediaType,
      playlistEmbedUrl: service.playlistEmbedUrl,
      videoSectionId: options?.videoSectionId,
    },
  );
  return {
    heroImageSrc: resolved.heroImageSrc,
    heroImageAlt: resolved.heroImageAlt,
    heroScrollTarget: resolved.heroScrollTarget,
    heroVideoSectionId: resolved.heroVideoSectionId,
  };
}
