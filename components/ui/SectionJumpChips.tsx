import { cn } from "@/lib/utils";

export type JumpChip = {
  label: string;
  href: string;
};

export type SectionJumpChipsProps = {
  chips: JumpChip[];
  className?: string;
};

export default function SectionJumpChips({
  chips,
  className,
}: SectionJumpChipsProps) {
  if (chips.length === 0) return null;

  return (
    <nav
      aria-label="קפיצה מהירה לסעיפי הדף"
      className={cn(
        "scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:hidden snap-x snap-mandatory",
        className,
      )}
    >
      {chips.map((chip) => (
        <a
          key={chip.href}
          href={chip.href}
          className={cn(
            "inline-flex shrink-0 snap-start items-center rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-muted-foreground",
            "transition-[transform,opacity,border-color,color] duration-[150ms] ease-[var(--ease-luxury)]",
            "active:scale-[0.96] active:opacity-80",
            "hover:border-[var(--service-accent,#d42b2b)]/40 hover:text-[var(--service-accent,#d42b2b)]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)]",
          )}
        >
          {chip.label}
        </a>
      ))}
    </nav>
  );
}
