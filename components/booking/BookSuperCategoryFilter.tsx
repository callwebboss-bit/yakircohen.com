"use client";

import {
  BOOK_SUPER_CATEGORIES,
  type BookSuperCategory,
} from "@/lib/data/book-audience-routes";
import { cn } from "@/lib/utils";

export type SuperCategoryFilter = BookSuperCategory | "all";

type BookSuperCategoryFilterProps = {
  active: SuperCategoryFilter;
  onChange: (id: SuperCategoryFilter) => void;
  routeCounts: Record<BookSuperCategory | "all", number>;
  className?: string;
};

export default function BookSuperCategoryFilter({
  active,
  onChange,
  routeCounts,
  className,
}: BookSuperCategoryFilterProps) {
  const chips: { id: SuperCategoryFilter; label: string; icon?: string; count: number }[] = [
    { id: "all", label: "הכול", count: routeCounts.all },
    ...BOOK_SUPER_CATEGORIES.map((cat) => ({
      id: cat.id,
      label: cat.label,
      icon: cat.icon,
      count: routeCounts[cat.id],
    })),
  ];

  return (
    <div
      className={cn(
        "scroll-area-x flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 md:flex-wrap md:justify-center md:overflow-visible",
        className,
      )}
      role="tablist"
      aria-label="סינון לפי סוג שירות"
    >
      {chips.map((chip) => {
        const isActive = active === chip.id;
        return (
          <button
            key={chip.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(chip.id)}
            className={cn(
              "inline-flex min-h-11 shrink-0 snap-start items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-foreground bg-foreground text-background shadow-sm"
                : "border-border bg-surface text-muted-foreground hover:border-brand-red/40 hover:text-foreground",
            )}
          >
            {chip.icon ? <span aria-hidden="true">{chip.icon}</span> : null}
            <span>{chip.label}</span>
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[0.65rem] font-bold tabular-nums",
                isActive ? "bg-background/20 text-background" : "bg-foreground/5 text-muted-foreground",
              )}
            >
              {chip.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
