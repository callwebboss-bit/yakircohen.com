import { cn } from "@/lib/utils";

const DEFAULT_BADGES = ["זמינות מהירה", "עבודה במודיעין", "280+ ביקורות גוגל"];

type TrustBadgesProps = {
  badges?: string[];
  className?: string;
};

export default function TrustBadges({
  badges = DEFAULT_BADGES,
  className,
}: TrustBadgesProps) {
  return (
    <ul
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1",
        className,
      )}
      aria-label="נקודות אמון"
    >
      {badges.map((badge) => (
        <li
          key={badge}
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <span
            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--service-accent,#d42b2b)]/10 text-[0.6rem] font-bold text-[var(--service-accent-ink,#8a1c1c)]"
            aria-hidden="true"
          >
            ✓
          </span>
          {badge}
        </li>
      ))}
    </ul>
  );
}
