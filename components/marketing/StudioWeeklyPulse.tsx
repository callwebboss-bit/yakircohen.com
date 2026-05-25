import Link from "next/link";
import { getStudioWeeklyPulse } from "@/lib/data/studio-weekly-pulse";
import { cn } from "@/lib/utils";

export type StudioWeeklyPulseProps = {
  className?: string;
};

/**
 * Curated weekly studio snapshot - editorial copy only, no pseudo-live tickers.
 * Sits above the floating WhatsApp control on the homepage.
 */
export default function StudioWeeklyPulse({ className }: StudioWeeklyPulseProps) {
  const pulse = getStudioWeeklyPulse();

  return (
    <aside
      className={cn(
        "fixed bottom-[5.75rem] right-4 z-40 hidden max-w-[17.5rem] md:block sm:bottom-[6.25rem] sm:right-6 sm:max-w-xs",
        className,
      )}
      aria-label="עדכון שבועי מהאולפן"
    >
      <div className="rounded-2xl border border-brand-red/30 bg-surface p-4 text-foreground shadow-lg">
        <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-brand-red uppercase">
          דופק האולפן
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground">
          <span aria-hidden="true" className="me-1">
            🎙️
          </span>
          <span className="font-medium text-brand-red">{pulse.kicker}:</span>{" "}
          {pulse.body}
          {pulse.footnote ? (
            <>
              {" "}
              <span className="text-muted-foreground">{pulse.footnote}</span>
            </>
          ) : null}
        </p>
        <Link
          href="/studio"
          className="mt-3 inline-flex text-xs font-semibold text-brand-red underline-offset-4 transition-colors hover:text-brand-red-light hover:underline"
        >
          לאולפן והקלטות ←
        </Link>
      </div>
    </aside>
  );
}
