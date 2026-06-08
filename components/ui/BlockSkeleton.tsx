import { cn } from "@/lib/utils";

export type BlockSkeletonProps = {
  className?: string;
};

/** Placeholder while lazy-loaded widgets hydrate (calculators, heavy embeds). */
export default function BlockSkeleton({ className }: BlockSkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl border border-border bg-[#FAFAF8]",
        className ?? "min-h-[12rem]",
      )}
      role="status"
      aria-label="טוען..."
    />
  );
}
