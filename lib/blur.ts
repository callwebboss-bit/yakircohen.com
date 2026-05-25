/**
 * Low-quality image placeholder (LQIP).
 *
 * A base64-encoded 1×1 neutral-gray PNG used as the `blurDataURL` prop on
 * `next/image` components. Next.js scales the pixel up and applies a CSS
 * blur filter, producing a soft shimmer while the full asset streams in.
 *
 * Static constant - zero runtime cost, safe in RSC, edge runtime, and
 * client components.
 */
export const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
