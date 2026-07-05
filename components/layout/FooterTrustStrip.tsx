import Link from "next/link";
import {
  GOOGLE_RATING,
  GOOGLE_RATING_LABEL,
  GOOGLE_REVIEW_COUNT,
  SITE_TRUST_STATS,
  STUDIO_GOOGLE_MAPS_URL,
  TRUST_STATS_CLARIFICATION,
} from "@/lib/constants";

import { cn } from "@/lib/utils";

export default function FooterTrustStrip({ className }: { className?: string }) {
  const googleStat = SITE_TRUST_STATS.find((s) => s.label === GOOGLE_RATING_LABEL);
  const otherStats = SITE_TRUST_STATS.filter((s) => s.label !== GOOGLE_RATING_LABEL);

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-xl border border-[var(--footer-border)] bg-white/[0.04] px-4 py-3 text-center text-xs text-[var(--footer-muted)] sm:justify-start",
        )}
        aria-label="נתוני אמון"
      >
      {otherStats.map((stat, index) => (
        <span key={stat.label} className="inline-flex items-center gap-4">
          {index > 0 ? (
            <span className="hidden text-[var(--footer-border)] sm:inline" aria-hidden>
              |
            </span>
          ) : null}
          <span>
            <span className="font-semibold text-[var(--footer-fg)]">{stat.value}</span>{" "}
            {stat.label}
          </span>
        </span>
      ))}
      {googleStat ? (
        <>
          <span className="hidden text-[var(--footer-border)] sm:inline" aria-hidden>
            |
          </span>
          <Link
            href={STUDIO_GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            <span className="font-semibold text-[var(--footer-fg)]">{GOOGLE_RATING} ★</span>{" "}
            {GOOGLE_RATING_LABEL}
            {GOOGLE_REVIEW_COUNT ? ` (${GOOGLE_REVIEW_COUNT}+ ביקורות)` : null}
          </Link>
        </>
      ) : null}
      </div>
      <p className="text-center text-[0.65rem] leading-relaxed text-[var(--footer-muted)] sm:text-start">
        {TRUST_STATS_CLARIFICATION}
      </p>
    </div>
  );
}
