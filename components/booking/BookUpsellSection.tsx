"use client";

import type { BookingUpsellItem } from "@/lib/data/booking-shared";
import { cn } from "@/lib/utils";

export type BookUpsellItem = BookingUpsellItem;

type BookUpsellSectionProps = {
  title?: string;
  items: readonly BookingUpsellItem[];
  selected: ReadonlySet<string>;
  onToggle: (id: string) => void;
  className?: string;
};

export default function BookUpsellSection({
  title = "תוספות אופציונליות",
  items,
  selected,
  onToggle,
  className,
}: BookUpsellSectionProps) {
  if (items.length === 0) return null;

  return (
    <div className={cn("rounded-2xl border border-border bg-surface p-5", className)}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <span className="text-[0.65rem] text-muted-foreground">
          אפשר לסגור את הפרטים בוואטסאפ
        </span>
      </div>

      <div className="space-y-2.5">
        {items.map((item) => {
          const active = selected.has(item.id);
          const savings =
            item.originalPrice && item.originalPrice > item.price
              ? item.originalPrice - item.price
              : null;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggle(item.id)}
              className={cn(
                "group flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-start transition-[border-color,background-color]",
                active
                  ? "border-brand-red/40 bg-brand-red/5"
                  : "border-border bg-background hover:border-brand-red/30",
              )}
              aria-pressed={active}
            >
              {/* Checkbox */}
              <span
                className={cn(
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[0.6rem] font-bold",
                  active
                    ? "border-brand-red bg-brand-red text-white"
                    : "border-border group-hover:border-brand-red/40",
                )}
                aria-hidden="true"
              >
                {active && "✓"}
              </span>

              {/* Content */}
              <div className="min-w-0 flex-1">
                {/* Name + badge */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-sm font-semibold text-foreground">
                    {item.name}
                  </span>
                  {item.badge ? (
                    <span className="rounded bg-brand-red/10 px-1.5 py-0.5 text-[0.6rem] font-bold text-brand-red">
                      {item.badge}
                    </span>
                  ) : null}
                </div>

                {/* whatYouGet - bold summary line */}
                {item.whatYouGet ? (
                  <p className="mt-0.5 text-xs font-medium text-foreground/80">
                    {item.whatYouGet}
                  </p>
                ) : null}

                {/* description - muted detail */}
                {item.description ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.description}
                  </p>
                ) : null}

                {/* savings line */}
                {savings ? (
                  <p className="mt-1 text-[0.65rem] font-medium text-emerald-700">
                    חיסכון: {savings.toLocaleString("he-IL")} ₪ לעומת מחיר רגיל
                  </p>
                ) : null}
              </div>

              {/* Price column */}
              <div className="shrink-0 text-end">
                {item.originalPrice ? (
                  <span className="block text-xs text-muted-foreground line-through">
                    +{item.originalPrice.toLocaleString("he-IL")} ₪
                  </span>
                ) : null}
                <span
                  className={cn(
                    "text-sm font-bold",
                    active ? "text-brand-red" : "text-foreground",
                  )}
                >
                  {item.price > 0
                    ? `+${item.price.toLocaleString("he-IL")} ₪`
                    : "כלול"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
