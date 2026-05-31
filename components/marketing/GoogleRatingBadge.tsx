import Link from "next/link";
import {
  GOOGLE_RATING,
  GOOGLE_REVIEW_COUNT,
  GOOGLE_RATING_LABEL,
  STUDIO_GOOGLE_MAPS_URL,
} from "@/lib/constants";
import { StarIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export type GoogleRatingBadgeProps = {
  className?: string;
  variant?: "default" | "compact";
  showReviewCta?: boolean;
};

export default function GoogleRatingBadge({
  className,
  variant = "default",
  showReviewCta = true,
}: GoogleRatingBadgeProps) {
  const reviewCount = GOOGLE_REVIEW_COUNT?.trim();

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border bg-background shadow-sm",
        variant === "default"
          ? "mx-auto mb-8 max-w-md flex-col items-center px-6 py-5 text-center sm:flex-row sm:text-start"
          : "inline-flex max-w-full flex-row items-center gap-3 px-4 py-3 text-start",
        className,
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full border border-border bg-surface",
          variant === "default" ? "h-14 w-14" : "h-10 w-10",
        )}
        aria-hidden
      >
        <GoogleMark className={variant === "default" ? "h-7 w-7" : "h-5 w-5"} />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "font-bold text-foreground",
            variant === "default" ? "text-2xl" : "text-lg",
          )}
        >
          {GOOGLE_RATING}
          <span className="ms-1 text-brand-red" aria-hidden>
            ★
          </span>
          {reviewCount ? (
            <span className="ms-2 text-sm font-semibold text-muted-foreground">
              ({reviewCount}+ ביקורות)
            </span>
          ) : null}
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">{GOOGLE_RATING_LABEL}</p>
        <div
          className={cn(
            "mt-2 flex flex-wrap gap-x-4 gap-y-1",
            variant === "default" ? "justify-center sm:justify-start" : "",
          )}
        >
          <Link
            href={STUDIO_GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-red hover:underline"
          >
            <StarIcon size={14} className="text-brand-red" />
            קראו ביקורות
          </Link>
          {showReviewCta ? (
            <Link
              href={STUDIO_GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-muted-foreground transition-colors hover:text-brand-red"
            >
              השאירו ביקורת ב-Google
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
