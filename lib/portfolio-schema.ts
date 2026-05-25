import type { PortfolioImage } from "@/lib/service-portfolio-images";
import { absoluteUrl } from "@/lib/site-url";

/** ImageGallery JSON-LD for service portfolio sections (SEO). */
export function buildPortfolioImageGalleryJsonLd(
  images: readonly PortfolioImage[],
  options: { name: string; description?: string; maxImages?: number },
): Record<string, unknown> {
  const cap = options.maxImages ?? 12;
  const slice = images.slice(0, cap);

  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: options.name,
    ...(options.description ? { description: options.description } : {}),
    image: slice.map((img) => ({
      "@type": "ImageObject",
      contentUrl: absoluteUrl(img.src),
      caption: img.alt,
    })),
  };
}
