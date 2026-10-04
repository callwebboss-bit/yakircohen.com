"use client";

import type { TierACategoryId } from "@/lib/book-wizard-cro/types";
import { TIME_CLAIMS } from "@/lib/data/conversion-copy";
import { cn } from "@/lib/utils";

type WizardUrgencyHintProps = {
  className?: string;
  /** נשמר לתאימות API - הטקסט זהה לכל הקטגוריות */
  category?: TierACategoryId;
};

/**
 * שורת סטטוס עובדתית בראש האשף: זמן מענה אמיתי. אין מחזיק מחיר ואין שריון.
 * אין כאן מוני זמינות מדומים - כל טענה על זמינות חייבת להגיע מיומן אמיתי.
 */
export default function WizardUrgencyHint({
  className,
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
        מענה אנושי, {TIME_CLAIMS.quoteHour}
      </span>
    </div>
  );
}
