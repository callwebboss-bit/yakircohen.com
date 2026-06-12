// UI-EXCEPTION: selectable radio card — see docs/ui-exceptions.md
"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BookingSelectableCardProps = {
  active: boolean;
  onClick: () => void;
  title: string;
  /** עד 3 שורות קצרות - מה כלול / למי מתאים */
  highlights?: readonly string[];
  emoji?: string;
  badge?: string;
  featured?: boolean;
  featuredLabel?: string;
  savings?: string;
  footer?: ReactNode;
  className?: string;
  /** כרטיס קומפקטי (אווירה, סוג הקלטה) */
  compact?: boolean;
};

export function BookingSelectionCheck({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[0.65rem] font-bold transition-colors duration-fast ease-luxury",
        active
          ? "border-[var(--service-accent,#d42b2b)] bg-[var(--service-accent,#d42b2b)] text-white"
          : "border-border bg-background text-transparent",
      )}
      aria-hidden="true"
    >
      ✓
    </span>
  );
}

export function BookingSelectionConfirm({
  title,
  detail,
  className,
}: {
  title: string;
  detail?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border border-[var(--service-accent,#d42b2b)]/30 bg-[color-mix(in_srgb,var(--service-accent,#d42b2b)_5%,transparent)] px-4 py-3",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <BookingSelectionCheck active />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {detail ? <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p> : null}
      </div>
    </div>
  );
}

export function BookingStepGuide({ lines }: { lines: readonly string[] }) {
  return (
    <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
      {lines.slice(0, 3).map((line) => (
        <li key={line} className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--service-accent,#d42b2b)]/70" aria-hidden="true" />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}

export default function BookingSelectableCard({
  active,
  onClick,
  title,
  highlights,
  emoji,
  badge,
  featured,
  featuredLabel = "הכי מומלץ",
  savings,
  footer,
  className,
  compact = false,
}: BookingSelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex min-h-11 w-full flex-col items-start gap-2 rounded-2xl border p-5 text-start transition-[border-color,box-shadow,background-color,transform] duration-normal ease-luxury active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)]",
        featured && !active && "ring-1 ring-[var(--service-accent,#d42b2b)]/20",
        active
          ? "border-[var(--service-accent,#d42b2b)] bg-[color-mix(in_srgb,var(--service-accent,#d42b2b)_5%,transparent)] shadow-[0_4px_16px_color-mix(in_srgb,var(--service-accent,#d42b2b)_10%,transparent)]"
          : "border-border bg-background hover:border-[var(--service-accent,#d42b2b)]/30 hover:shadow-sm",
        compact && "items-center p-6 text-center",
        className,
      )}
      aria-pressed={active}
    >
      <span className="absolute end-3 top-3 flex items-center gap-1.5">
        {badge ? (
          <span className="rounded-full bg-[var(--service-accent,#d42b2b)] px-2 py-0.5 text-[0.6rem] font-bold text-white">
            {badge}
          </span>
        ) : null}
        {active ? (
          <span className="rounded-full bg-[color-mix(in_srgb,var(--service-accent,#d42b2b)_10%,transparent)] px-2 py-0.5 text-[0.6rem] font-bold text-[var(--service-accent,#d42b2b)]">
            נבחר
          </span>
        ) : null}
        <BookingSelectionCheck active={active} />
      </span>

      {featured ? (
        <span className="mb-1 w-full text-center text-xs font-bold text-[var(--service-accent,#d42b2b)]">{featuredLabel}</span>
      ) : null}

      {emoji ? (
        <span className={cn("text-2xl", compact && "text-4xl sm:text-5xl")} aria-hidden="true">
          {emoji}
        </span>
      ) : null}

      <span className={cn("text-sm font-semibold text-foreground", compact && "font-semibold")}>
        {title}
      </span>

      {highlights && highlights.length > 0 ? (
        <ul className={cn("w-full space-y-1", compact && "text-center")}>
          {highlights.slice(0, 3).map((line) => (
            <li
              key={line}
              className={cn(
                "flex items-start gap-2 text-xs leading-relaxed text-muted-foreground",
                compact && "justify-center",
              )}
            >
              {!compact ? (
                <span className="mt-1 text-[var(--service-accent,#d42b2b)]/80" aria-hidden="true">
                  ✓
                </span>
              ) : null}
              <span>{line}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {savings ? <span className="text-xs font-medium text-green-700">{savings}</span> : null}

      {footer ? <div className="mt-auto w-full pt-1">{footer}</div> : null}
    </button>
  );
}
