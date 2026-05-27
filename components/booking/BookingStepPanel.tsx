import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BookingStepPanelProps = {
  stepKey: string | number;
  children: ReactNode;
  className?: string;
  /** כותרת לקורא מסך - מודיע על מעבר שלב */
  stepLabel?: string;
};

/** עטיפה לאנימציית מעבר בין שלבי אשף */
export default function BookingStepPanel({
  stepKey,
  children,
  className,
  stepLabel,
}: BookingStepPanelProps) {
  return (
    <div
      key={stepKey}
      role="region"
      aria-label={stepLabel}
      aria-live="polite"
      tabIndex={-1}
      className={cn("booking-step-enter space-y-8 outline-none", className)}
    >
      {children}
    </div>
  );
}
