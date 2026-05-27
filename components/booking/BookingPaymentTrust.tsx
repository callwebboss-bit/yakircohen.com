import { cn } from "@/lib/utils";

const PAYMENT_METHODS = ["אשראי", "Bit", "PayBox", "Apple Pay"] as const;

function CreditCardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

export default function BookingPaymentTrust({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-2.5 py-3 text-center", className)}>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <CreditCardIcon />
        <span>עד 3 תשלומים ללא ריבית (בתיאום)</span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {PAYMENT_METHODS.map((method) => (
          <span
            key={method}
            className="rounded-md border border-border bg-surface px-2 py-0.5 text-[0.65rem] font-medium text-muted-foreground"
          >
            {method}
          </span>
        ))}
      </div>
    </div>
  );
}
