import Link from "next/link";
import { cn } from "@/lib/utils";

export type BookingApprovalsCopy = {
  pricingNote: string;
  cancellationNote: string;
  termsLabel: string;
};

type BookingApprovalsProps = {
  copy: BookingApprovalsCopy;
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
  onAcceptAll?: () => void;
  termsError?: string;
  className?: string;
};

export default function BookingApprovals({
  copy,
  termsAccepted,
  onTermsChange,
  onAcceptAll,
  termsError,
  className,
}: BookingApprovalsProps) {
  return (
    <div
      className={cn(
        "space-y-4 rounded-xl border border-border bg-surface p-4",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">אישורים</h3>
        {onAcceptAll ? (
          <button
            type="button"
            onClick={onAcceptAll}
            className="text-xs font-semibold text-brand-red hover:underline"
          >
            סמן הכל ✓
          </button>
        ) : null}
      </div>

      <ul className="space-y-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
        <li>{copy.pricingNote}</li>
        <li>{copy.cancellationNote}</li>
      </ul>

      <p className="text-xs text-muted-foreground">
        <Link href="/terms" className="font-semibold text-brand-red hover:underline">
          תנאי שימוש
        </Link>
        {" · "}
        <Link href="/privacy" className="font-semibold text-brand-red hover:underline">
          מדיניות פרטיות
        </Link>
      </p>

      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background p-3">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => onTermsChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-brand-red"
          aria-required
        />
        <span className="text-sm text-foreground">{copy.termsLabel}</span>
      </label>
      {termsError ? (
        <p className="text-xs text-red-500">{termsError}</p>
      ) : null}
    </div>
  );
}
