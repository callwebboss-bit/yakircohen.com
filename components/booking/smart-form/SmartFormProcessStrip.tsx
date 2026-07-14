"use client";

type SmartFormProcessStripProps = {
  steps: readonly { label: string }[];
  deliveryNote: string;
};

export default function SmartFormProcessStrip({
  steps,
  deliveryNote,
}: SmartFormProcessStripProps) {
  return (
    <div className="rounded-lg border border-border bg-surface/30 p-3">
      <ol className="flex flex-wrap items-center justify-center gap-1 text-[11px] text-foreground sm:gap-2 sm:text-xs">
        {steps.map((step, index) => (
          <li key={step.label} className="flex items-center gap-1 sm:gap-2">
            {index > 0 ? (
              <span className="text-muted-foreground" aria-hidden>
                →
              </span>
            ) : null}
            <span className="rounded-full border border-border bg-white px-2.5 py-1 font-medium">
              {step.label}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-center text-[11px] leading-snug text-muted-foreground">
        {deliveryNote}
      </p>
    </div>
  );
}
