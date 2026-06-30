"use client";

import { BOOK_WIZARD_COPY } from "@/lib/data/book-wizard-copy";
import { getCroConfig } from "@/lib/data/cro";
import type { TierACategoryId } from "@/lib/book-wizard-cro/types";
import { getWeeklySlotsRemaining } from "@/lib/book-wizard-urgency";
import { cn } from "@/lib/utils";

type WizardUrgencyHintProps = {
  className?: string;
  priceHoldLabel?: string | null;
  /** default studio */
  category?: TierACategoryId;
};

export default function WizardUrgencyHint({
  className,
  priceHoldLabel,
  category = "studio",
}: WizardUrgencyHintProps) {
  const config = getCroConfig(category);
  const slots = getWeeklySlotsRemaining(category);
  const slotsLabel =
    category === "studio"
      ? BOOK_WIZARD_COPY.urgencyWeeklySlots(slots)
      : config.urgency.slotsLabel(slots);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-2 text-center text-xs",
        className,
      )}
      role="status"
    >
      <span className="rounded-full border border-amber-300/80 bg-amber-50 px-3 py-1 font-medium text-amber-900">
        {slotsLabel}
      </span>
      {priceHoldLabel ? (
        <span className="rounded-full border border-emerald-300/80 bg-emerald-50 px-3 py-1 font-medium text-emerald-900">
          {priceHoldLabel}
        </span>
      ) : null}
    </div>
  );
}
