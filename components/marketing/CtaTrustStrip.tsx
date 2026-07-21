import Link from "next/link";
import {
  GOOGLE_RATING,
  GOOGLE_REVIEW_COUNT,
  STUDIO_GOOGLE_MAPS_URL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** טקסט קצר נוסף (אופציונלי) */
  note?: string;
};

/**
 * רצועת אמון קומפקטית ליד CTA - דירוג גוגל + ביקורות.
 * לא מחליפה את TrustStatsBar המלא.
 */
export default function CtaTrustStrip({
  className,
  note = "20+ שנות ניסיון · מענה אישי",
}: Props) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-xs text-muted-foreground",
        className,
      )}
    >
      <Link
        href={STUDIO_GOOGLE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-foreground hover:text-brand-red hover:underline"
      >
        {GOOGLE_RATING} ★ בגוגל
      </Link>
      <span aria-hidden>·</span>
      <span>{GOOGLE_REVIEW_COUNT}+ ביקורות מאומתות</span>
      <span aria-hidden>·</span>
      <span>{note}</span>
    </p>
  );
}
