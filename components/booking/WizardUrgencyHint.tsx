"use client";

import type { TierACategoryId } from "@/lib/book-wizard-cro/types";
import { TIME_CLAIMS } from "@/lib/data/conversion-copy";
import { cn } from "@/lib/utils";

type WizardUrgencyHintProps = {
  className?: string;
  priceHoldLabel?: string | null;
  /** נשמר לתאימות API - הטקסט זהה לכל הקטגוריות */
  category?: TierACategoryId;
};

/**
 * שורת סטטוס עובדתית בראש האשף: זמן מענה אמיתי + מחזיק מחיר (אם נשמר).
 * אין כאן מוני זמינות מדומים - כל טענה על זמינות חייבת להגיע מיומן אמיתי.
 */
export default function WizardUrgencyHint({
  className,
  priceHoldLabel,
}: WizardUrgencyHintProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-2 text-center text-xs",
        className,
      )}
      role="status"
    >
      <span className="rounded-full border border-border bg-surface px-3 py-1 font-medium text-muted-foreground">
        מענה אנושי, {TIME_CLAIMS.quote24h}
      </span>
      {priceHoldLabel ? (
        <span className="rounded-full border border-emerald-300/80 bg-emerald-50 px-3 py-1 font-medium text-emerald-900">
          {priceHoldLabel}
        </span>
      ) : null}
    </div>
  );
}
