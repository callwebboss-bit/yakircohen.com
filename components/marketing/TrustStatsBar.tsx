import Link from "next/link";
import Container from "@/components/ui/Container";
import {
  GOOGLE_RATING_LABEL,
  SITE_TRUST_STATS,
  STUDIO_GOOGLE_MAPS_URL,
  TRUST_STATS_CLARIFICATION,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

export type TrustStatsBarProps = {
  className?: string;
  /** Compact single-row layout for embedded use */
  variant?: "default" | "compact";
};

export default function TrustStatsBar({
  className,
  variant = "default",
}: TrustStatsBarProps) {
  return (
    <section
      className={cn(
        "border-b border-border bg-surface",
        variant === "default" ? "py-6 sm:py-8" : "py-4",
        className,
      )}
      aria-label="נתוני אמון"
    >
      <Container
        className={cn(
          variant === "default"
            ? "grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8"
            : "flex flex-wrap items-center justify-center gap-6 sm:gap-10",
        )}
      >
        {SITE_TRUST_STATS.map((stat) => {
          const isGoogle = stat.label === GOOGLE_RATING_LABEL;
          const content = (
            <>
              <span className="block text-xl font-bold text-foreground sm:text-2xl">
                {stat.value}
              </span>
              <span className="mt-1 block text-xs text-muted-foreground sm:text-sm">
                {stat.label}
              </span>
            </>
          );

          if (isGoogle) {
            return (
              <Link
                key={stat.label}
                href={STUDIO_GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "text-center transition-colors hover:text-brand-red",
                  variant === "default" &&
                    "rounded-xl border border-border/60 bg-background px-4 py-4 sm:py-5 hover:border-brand-red/30",
                )}
              >
                {content}
              </Link>
            );
          }

          return (
            <div
              key={stat.label}
              className={cn(
                "text-center",
                variant === "default" &&
                  "rounded-xl border border-border/60 bg-background px-4 py-4 sm:py-5",
              )}
            >
              {content}
            </div>
          );
        })}
      </Container>
      <Container className="mt-4">
        <p className="text-center text-xs text-muted-foreground">
          {TRUST_STATS_CLARIFICATION}
        </p>
      </Container>
    </section>
  );
}
