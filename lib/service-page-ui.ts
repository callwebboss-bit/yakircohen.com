import type { ServicePageHeroBundle } from "@/lib/service-portfolio-hero";

/** מקסימום נקודות ✓ מתחת ל-Hero */
export const SERVICE_HERO_FEATURES_MAX = 3;

/** מקסימום תמונות בגלריית שירות סטנדרטית */
export const SERVICE_GALLERY_MAX_IMAGES = 12;

export function sliceHeroFeatures<T extends string>(
  features: readonly T[],
  max = SERVICE_HERO_FEATURES_MAX,
): readonly T[] {
  return features.slice(0, max);
}

export type ServicePageHeroLayoutOptions = {
  showBookCtaInHero?: boolean;
  showHeroScrollLink?: boolean;
};

/** ברירות מחדל ל-Hero: CTA אחד, גלילה רק כשיש תמונת cover */
export function withServicePageHeroDefaults(
  pageHero: ServicePageHeroBundle,
  options: ServicePageHeroLayoutOptions = {},
): ServicePageHeroBundle & ServicePageHeroLayoutOptions {
  const hasHeroImage = Boolean(pageHero.heroImageSrc?.trim());
  const scrollsToVideo = pageHero.heroScrollTarget === "video";
  return {
    ...pageHero,
    showBookCtaInHero: options.showBookCtaInHero ?? false,
    showHeroScrollLink:
      options.showHeroScrollLink !== undefined
        ? options.showHeroScrollLink
        : hasHeroImage || scrollsToVideo,
  };
}
