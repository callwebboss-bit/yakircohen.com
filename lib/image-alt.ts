import { deriveHebrewAlt } from "@/lib/hebrew-image-alt";

/**
 * Guarantees a non-empty accessible alt string for images.
 */
export function ensureImageAlt(
  alt: string | undefined | null,
  options?: {
    filename?: string;
    fallback?: string;
  },
): string {
  const trimmed = alt?.trim();
  if (trimmed) return trimmed;

  if (options?.filename) {
    const fromFile = deriveHebrewAlt(options.filename).trim();
    if (fromFile) return fromFile;
  }

  return options?.fallback?.trim() || "תמונה מתיק העבודות";
}
