"use client";

import { cn } from "@/lib/utils";

type BookingFieldFeedbackProps = {
  valid?: boolean;
  hint?: string;
  className?: string;
};

export default function BookingFieldFeedback({
  valid,
  hint,
  className,
}: BookingFieldFeedbackProps) {
  if (!valid && !hint) return null;
  return (
    <p
      className={cn(
        "mt-1 flex items-center gap-1 text-xs",
        valid ? "text-green-700" : "text-muted-foreground",
        className,
      )}
      aria-live="polite"
    >
      {valid ? (
        <>
          <span aria-hidden="true">✓</span>
          <span>{hint ?? "נראה מעולה"}</span>
        </>
      ) : (
        hint
      )}
    </p>
  );
}
