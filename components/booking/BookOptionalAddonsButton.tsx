"use client";

import { cn } from "@/lib/utils";

type BookOptionalAddonsButtonProps = {
  count: number;
  onClick: () => void;
  className?: string;
};

export default function BookOptionalAddonsButton({
  count,
  onClick,
  className,
}: BookOptionalAddonsButtonProps) {
  if (count <= 0) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "mt-4 flex min-h-12 w-full items-center justify-center rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red sm:w-auto",
        className,
      )}
    >
      תוספות אופציונליות ({count})
    </button>
  );
}
