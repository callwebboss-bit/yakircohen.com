import type { ReactNode } from "react";
import { PAYMENT_INVOICING, PAYMENT_METHODS } from "@/lib/payment-methods";
import { cn } from "@/lib/utils";

function CreditCardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ApplePayMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.52 12.21c.02 2.14 1.88 2.86 1.9 2.87-.02.06-.3 1.02-.98 2.02-.59.86-1.2 1.72-2.16 1.74-.94.02-1.24-.56-2.32-.56-1.08 0-1.42.54-2.32.58-.93.04-1.64-.94-2.24-1.8-1.22-1.76-2.14-4.98-.9-7.16.62-1.06 1.72-1.74 2.9-1.76.9-.02 1.76.6 2.32.6.56 0 1.62-.74 2.74-.64.47.02 1.7.18 2.5 1.35-.06.04-1.49.87-1.46 2.32zM14.88 4.78c.48-.58 1.22-.96 1.94-.98.09.76-.22 1.52-.68 2.08-.45.58-1.18 1.02-1.9.96-.08-.74.25-1.5.64-2.06z" />
    </svg>
  );
}

function LockSslIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2l7 4v6c0 5-3 9-7 10C8 21 5 17 5 12V6l7-4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PaymentBadge({
  label,
  className,
  children,
}: {
  label: string;
  className: string;
  children?: ReactNode;
}) {
  return (
    <li
      className={cn(
        "inline-flex min-h-[2.25rem] items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-white shadow-sm ring-1 ring-black/10",
        className,
      )}
    >
      {children}
      <span>{label}</span>
    </li>
  );
}

const BADGE_STYLES: Record<string, string> = {
  credit: "bg-gradient-to-br from-slate-700 to-slate-900",
  bit: "bg-gradient-to-br from-[#003DA5] to-[#0052CC]",
  paybox: "bg-gradient-to-br from-[#E85D04] to-[#F48C06]",
  "apple-pay": "bg-gradient-to-br from-neutral-800 to-black",
  paypal: "bg-gradient-to-br from-[#003087] to-[#0070BA]",
};

export type FooterPaymentMethodsProps = {
  compact?: boolean;
};

export default function FooterPaymentMethods({
  compact = false,
}: FooterPaymentMethodsProps) {
  return (
    <section
      className={cn(
        "border-t border-border",
        compact ? "mt-8 pt-6" : "mt-12 pt-10",
      )}
      aria-labelledby="footer-payments-heading"
    >
      <div
        className={cn(
          "flex flex-col gap-4",
          !compact && "md:flex-row md:items-center md:justify-between md:gap-8",
          compact && "sm:flex-row sm:items-center sm:justify-between",
        )}
      >
        <div className="min-w-0">
          <h2
            id="footer-payments-heading"
            className="text-sm font-semibold text-foreground"
          >
            אמצעי תשלום
          </h2>
          {!compact ? (
            <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">
              סליקה מאובטחת · אשראי, אפליקציות תשלום וחשבונית מס מסודרת
            </p>
          ) : null}
        </div>

        <div
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2"
          role="status"
          aria-label="חיבור מאובטח SSL"
        >
          <LockSslIcon
            className={cn("shrink-0 text-emerald-700", compact ? "h-5 w-5" : "h-8 w-8")}
          />
          <p className="text-xs font-semibold text-emerald-900">SSL מאובטח</p>
        </div>
      </div>

      <ul
        className={cn(
          "flex flex-wrap gap-2",
          compact ? "mt-4 justify-start" : "mt-5 justify-center md:justify-start",
        )}
        role="list"
      >
        {PAYMENT_METHODS.map((method) => (
          <PaymentBadge
            key={method.id}
            label={method.label}
            className={BADGE_STYLES[method.id] ?? ""}
          >
            {method.id === "credit" ? (
              <CreditCardIcon className="h-4 w-4 opacity-90" />
            ) : null}
            {method.id === "apple-pay" ? (
              <ApplePayMark className="h-4 w-4 opacity-95" />
            ) : null}
            {method.id === "paypal" ? (
              <span className="text-[0.65rem] font-black tracking-tight opacity-90">P</span>
            ) : null}
          </PaymentBadge>
        ))}
        {PAYMENT_INVOICING.map((item) => (
          <li
            key={item.id}
            className="inline-flex min-h-[2.25rem] items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-xs font-semibold text-emerald-900"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
            {item.label}
          </li>
        ))}
      </ul>

      {!compact ? (
        <p className="mt-4 text-center text-[0.65rem] leading-relaxed text-muted-foreground md:text-start">
          התשלום מתבצע דרך ספק סליקה מאושר. פרטי כרטיס אשראי אינם נשמרים באתר.
          ניתן לשלם גם ב־Bit, PayBox, Apple Pay ו־PayPal לפי תיאום.
        </p>
      ) : null}
    </section>
  );
}
