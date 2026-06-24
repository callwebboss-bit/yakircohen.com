import { cn } from "@/lib/utils";

type InfoTipProps = {
  text: string;
  className?: string;
};

/**
 * Inline info icon with a native CSS tooltip.
 * Hover/focus reveals the tooltip text. Degrades cleanly on mobile.
 */
export default function InfoTip({ text, className }: InfoTipProps) {
  return (
    <span
      title={text}
      aria-label={text}
      role="img"
      className={cn(
        "relative inline-flex h-4 w-4 cursor-help select-none items-center justify-center rounded-full border border-border bg-surface text-[0.6rem] font-bold text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground",
        className,
      )}
    >
      ?
    </span>
  );
}
