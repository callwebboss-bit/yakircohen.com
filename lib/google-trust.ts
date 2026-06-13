import {
  GOOGLE_RATING,
  GOOGLE_RATING_BEST,
  GOOGLE_RATING_LABEL,
  GOOGLE_RATING_WORST,
  GOOGLE_REVIEW_COUNT,
} from "@/lib/constants";

export type GoogleAggregateRatingSchema = {
  "@type": "AggregateRating";
  ratingValue: string;
  bestRating: string;
  worstRating: string;
  reviewCount?: string;
};

/** Schema.org AggregateRating for LocalBusiness - single source of truth */
export function buildGoogleAggregateRatingSchema(): GoogleAggregateRatingSchema {
  const rating: GoogleAggregateRatingSchema = {
    "@type": "AggregateRating",
    ratingValue: GOOGLE_RATING,
    bestRating: GOOGLE_RATING_BEST,
    worstRating: GOOGLE_RATING_WORST,
  };

  const count = GOOGLE_REVIEW_COUNT?.trim();
  if (count) {
    rating.reviewCount = count;
  }

  return rating;
}

/** Human-readable rating line for UI */
export function formatGoogleRatingLine(): string {
  const count = GOOGLE_REVIEW_COUNT?.trim();
  if (count) {
    return `${GOOGLE_RATING} ★ - ${count}+ ביקורות ב-Google`;
  }
  return `${GOOGLE_RATING} ★ - ${GOOGLE_RATING_LABEL}`;
}
