"use client";

import { NEEDS_DISCOVERY_SCRIPT } from "@/lib/whatsapp-closing";
import { cn } from "@/lib/utils";

type NeedsDiscoveryStepProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  /** Show the 5-line opener script above the textarea */
  showScript?: boolean;
  id?: string;
};

export default function NeedsDiscoveryStep({
  value,
  onChange,
  className,
  showScript = true,
  id = "customer-need",
}: NeedsDiscoveryStepProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {showScript ? (
        <blockquote className="rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          {NEEDS_DISCOVERY_SCRIPT.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </blockquote>
      ) : null}
      <div>
        <label htmlFor={id} className="block text-sm font-semibold text-foreground">
          מה באמת חסר ביצירה שלך?
        </label>
        <p className="mt-1 text-xs text-muted-foreground">
          אופציונלי - עוזר לנו להתאים חבילה בלי לחץ מכירה.
        </p>
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder="למשל: ברכה לחתונה, פודקאסט ראשון, DJ לאירוע קטן..."
          className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:border-brand-red focus:ring-2 focus:ring-brand-red/30"
        />
      </div>
    </div>
  );
}
