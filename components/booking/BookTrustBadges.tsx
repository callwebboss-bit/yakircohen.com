import { cn } from "@/lib/utils";

const DEFAULT_BADGES = [
  { icon: "☁️", label: "גיבוי ענן לכל החיים" },
  { icon: "🅿️", label: "חנייה חופשית בשפע" },
  { icon: "🌙", label: "תיאום גמיש בשעות הערב" },
  { icon: "🔄", label: "סבב תיקונים אחד כלול" },
] as const;

type BookTrustBadgesProps = {
  badges?: readonly { icon: string; label: string }[];
  className?: string;
};

export default function BookTrustBadges({
  badges = DEFAULT_BADGES,
  className,
}: BookTrustBadgesProps) {
  return (
    <ul
      className={cn(
        "flex flex-wrap gap-2",
        className,
      )}
    >
      {badges.map((badge) => (
        <li
          key={badge.label}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground"
        >
          <span aria-hidden="true">{badge.icon}</span>
          {badge.label}
        </li>
      ))}
    </ul>
  );
}
