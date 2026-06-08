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
      <h3 className="mb-1 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mb-4 text-xs text-muted-foreground">
        UPSELL — אפשר להוסיף עכשיו או לדבר על זה בוואטסאפ
      </p>
      <div className="space-y-2.5">
        {items.map((item) => {
          const active = selected.has(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggle(item.id)}
              className={cn(
                "flex w-full items-start justify-between gap-4 rounded-xl border px-4 py-3 text-start transition-colors",
                active
                  ? "border-brand-red/40 bg-brand-red/5"
                  : "border-border bg-background hover:border-brand-red/30",
              )}
              aria-pressed={active}
            >
              <div className="flex min-w-0 items-start gap-2.5">
                <span
                  className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-xs",
                    active ? "border-brand-red bg-brand-red text-white" : "border-border",
                  )}
                  aria-hidden="true"
                >
                  {active && "✓"}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {item.name}
                    {item.badge ? (
                      <span className="ms-2 rounded bg-brand-red/10 px-1.5 py-0.5 text-[0.65rem] font-bold text-brand-red">
                        {item.badge}
                      </span>
                    ) : null}
                  </p>
                  {item.description ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
                  ) : null}
                </div>
              </div>
              <span className="shrink-0 text-sm font-bold text-foreground">
                {item.price > 0 ? `+${item.price.toLocaleString("he-IL")} ₪` : "כלול"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
