import Link from "next/link";
import {
  CANCELLATION_SHORT_LINE,
  LEGAL_TRUST_LINKS,
  PAYMENT_SECURITY_LINE,
} from "@/lib/data/legal-trust-copy";
import { cn } from "@/lib/utils";

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 11V8a4 4 0 018 0v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export type CheckoutTrustMicroProps = {
  variant?: "inline" | "card";
  showPayment?: boolean;
  showCancellation?: boolean;
  showLegalLinks?: boolean;
  className?: string;
};

export default function CheckoutTrustMicro({
  variant = "card",
  showPayment = true,
  showCancellation = true,
  showLegalLinks = true,
  className,
}: CheckoutTrustMicroProps) {
  const isCard = variant === "card";

  return (
    <div
      className={cn(
        isCard
          ? "rounded-lg border border-border bg-surface/80 px-3 py-2.5"
          : "space-y-1",
        className,
      )}
      aria-label="אמון בתשלום וביטולים"
    >
      {showPayment ? (
        <p
          className={cn(
            "flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground",
            isCard && "gap-2",
          )}
        >
          <LockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700" />
          <span>{PAYMENT_SECURITY_LINE}</span>
        </p>
      ) : null}

      {showCancellation ? (
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {CANCELLATION_SHORT_LINE}
        </p>
      ) : null}

      {showLegalLinks ? (
        <p className={cn("text-xs", showPayment || showCancellation ? "mt-2" : "")}>
          {LEGAL_TRUST_LINKS.map((link, index) => (
            <span key={link.href}>
              {index > 0 ? " · " : null}
              <Link
                href={link.href}
                className="inline-flex min-h-11 items-center font-semibold text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}
