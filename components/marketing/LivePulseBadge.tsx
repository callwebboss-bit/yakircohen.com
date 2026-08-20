import {
  AVAILABILITY_TONE_CLASS,
  getLiveStatusConfig,
  resolveAvailabilityLabel,
} from "@/lib/data/live-status";
import { cn } from "@/lib/utils";

function pulseCopy(
  tone: "available" | "busy" | "consultation" | "closed",
  label: string,
) {
  if (tone === "available") return "אולפן פעיל · זמין להקלטות השבוע";
  return label;
}

export default function LivePulseBadge({ className }: { className?: string }) {
  const availability = resolveAvailabilityLabel(getLiveStatusConfig());
  const copy = pulseCopy(availability.tone, availability.label);

  return (
    <aside
      className={cn(
        "inline-flex min-h-8 max-w-full items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium",
        AVAILABILITY_TONE_CLASS[availability.tone],
        className,
      )}
      aria-label={copy}
    >
      <span
        className="studio-live-dot"
        data-tone={availability.tone}
        aria-hidden="true"
      />
      <span>{copy}</span>
    </aside>
  );
}
