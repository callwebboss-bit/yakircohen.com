"use client";

import { BOOK_WIZARD_COPY } from "@/lib/data/book-wizard-copy";
import { getWeeklyStudioSlotsRemaining } from "@/lib/book-wizard-urgency";
import { cn } from "@/lib/utils";

type WizardUrgencyHintProps = {
  className?: string;
  priceHoldLabel?: string | null;
};

export default function WizardUrgencyHint({
  className,
  priceHoldLabel,
}: WizardUrgencyHintProps) {
  const slots = getWeeklyStudioSlotsRemaining();

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-2 text-center text-xs",
        className,
      )}
      role="status"
    >
      <span className="rounded-full border border-amber-300/80 bg-amber-50 px-3 py-1 font-medium text-amber-900">
        {BOOK_WIZARD_COPY.urgencyWeeklySlots(slots)}
      </span>
      {priceHoldLabel ? (
        <span className="rounded-full border border-emerald-300/80 bg-emerald-50 px-3 py-1 font-medium text-emerald-900">
          {priceHoldLabel}
        </span>
      ) : null}
    </div>
  );
}
