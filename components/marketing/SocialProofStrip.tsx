import { SITE_TRUST_STATS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type SocialProofStripProps = {
  maxItems?: number;
  className?: string;
};

export default function SocialProofStrip({
  maxItems = 4,
  className,
}: SocialProofStripProps) {
  const items = SITE_TRUST_STATS.slice(0, maxItems);

  return (
    <p
      aria-label="נתוני אמון בקצרה"
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-muted-foreground",
        className,
      )}
    >
      {items.map((stat, i) => (
        <span key={stat.label} className="inline-flex items-center gap-1.5">
          {i > 0 && (
            <span className="text-border" aria-hidden="true">
              ·
            </span>
          )}
          <span className="font-semibold text-foreground">{stat.value}</span>
          <span>{stat.label}</span>
        </span>
      ))}
    </p>
  );
}
