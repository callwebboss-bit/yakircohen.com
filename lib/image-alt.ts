import {
  deriveHebrewAltOrNull,
  IMAGE_ALT_FALLBACK_LABEL,
} from "@/lib/hebrew-image-alt";

/**
 * Guarantees a non-empty accessible alt string for images.
 *
 * F-20 (7.10.2026): ה-alt שנגזר משם קובץ נבחר רק אם הוא שמיש (עברית, בלי שריד
 * של מצלמה). אחרת נופלים ל-fallback של הקורא, ורק בסוף לתווית הכללית, כדי ש-
 * "leom9008" לא יגיע לקורא מסך רק כי הקובץ נקרא כך.
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
    const fromFile = deriveHebrewAltOrNull(options.filename)?.trim();
    if (fromFile) return fromFile;
  }

  return options?.fallback?.trim() || IMAGE_ALT_FALLBACK_LABEL;
}
