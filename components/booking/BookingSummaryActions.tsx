"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import WhatsAppIcon from "@/components/calculators/WhatsAppIcon";
import KoalendarModal from "@/components/booking/KoalendarModal";
import InfoTip from "@/components/ui/InfoTip";
import { BOOKING_INSTALLMENT_LINE } from "@/lib/data/booking-shared";
import { PAYMENT_SECURITY_LINE } from "@/lib/data/legal-trust-copy";
import { PAYMENT_METHODS } from "@/lib/payment-methods";
import { cn } from "@/lib/utils";

const IDLE_PULSE_DELAY_MS = 60_000;

function LockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
      className="shrink-0 text-green-700"
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
      className="shrink-0 text-green-700"
    >
      <path d="M12 3 4 7v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V7l-8-4z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export type BookingSummaryAction = {
  href?: string;
  onClick?: () => void;
  label: string;
};

export type BookingSummaryActionsProps = {
  /** Primary green WhatsApp button - "continue_chat" intent */
  continueWhatsApp: BookingSummaryAction;
  /** Secondary ghost outline button - "start_now" intent */
  startNow?: BookingSummaryAction;
  /** Tertiary text link - pulses after 60s idle */
  consult15Min?: BookingSummaryAction;
  /** Small social-proof line shown above the primary button */
  socialProof?: string;
  /** Disables both action buttons (e.g. until terms accepted) */
  disabled?: boolean;
  /** תשלומים ואמינות מתחת לכפתור הראשי */
  showPaymentTrust?: boolean;
  className?: string;
};

export default function BookingSummaryActions({
  continueWhatsApp,
  startNow,
  consult15Min,
  socialProof,
  disabled = false,
  showPaymentTrust = false,
  className,
}: BookingSummaryActionsProps) {
  const [pulsing, setPulsing] = useState(false);
  const [koalendarOpen, setKoalendarOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interacted = useRef(false);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (!interacted.current) setPulsing(true);
    }, IDLE_PULSE_DELAY_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleInteraction() {
    interacted.current = true;
    setPulsing(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  const primaryBaseClass = cn(
    "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1fba59] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]",
    disabled && "pointer-events-none opacity-50",
  );

  const secondaryBaseClass = cn(
    "inline-flex w-full items-center justify-center rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
    disabled && "pointer-events-none opacity-50",
  );

  return (
    <div className={cn("space-y-3", className)}>
      {/* Risk reversal */}
      <p className="text-center text-xs text-muted-foreground">
        הלחיצה לא מחייבת תשלום - נסגור את הפרטים יחד בוואטסאפ
      </p>

      {/* Social proof */}
      {socialProof && (
        <p className="text-center text-xs font-medium text-muted-foreground">
          ✅ {socialProof}
        </p>
      )}

      {/* PRIMARY - WhatsApp green */}
      {continueWhatsApp.href ? (
        <a
          href={continueWhatsApp.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleInteraction}
          className={primaryBaseClass}
        >
          <WhatsAppIcon />
          {continueWhatsApp.label}
        </a>
      ) : (
        <button
          type="button"
          onClick={() => {
            continueWhatsApp.onClick?.();
            handleInteraction();
          }}
          className={primaryBaseClass}
        >
          <WhatsAppIcon />
          {continueWhatsApp.label}
        </button>
      )}

      {showPaymentTrust ? (
        <div className="space-y-2 rounded-xl border border-border/70 bg-surface/60 px-3 py-2.5 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <LockIcon />
            <span>({BOOKING_INSTALLMENT_LINE})</span>
            <InfoTip text="מקדמה קטנה לשריון התאריך, יתרה לפני האירוע. מחלקים את הסכום בוואטסאפ לפי מה שנוח." />
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[0.65rem] text-muted-foreground">
            <ShieldIcon />
            <span>תשלום מאובטח · חשבונית מס רשמית</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method.id}
                className="rounded-md border border-border bg-background px-2 py-0.5 text-[0.65rem] font-medium text-muted-foreground"
              >
                {method.label}
              </span>
            ))}
          </div>
          <p className="text-[0.65rem] leading-relaxed text-muted-foreground">
            {PAYMENT_SECURITY_LINE}{" "}
            <Link href="/privacy" className="font-semibold text-brand-red hover:underline">
              מדיניות פרטיות
            </Link>
          </p>
        </div>
      ) : null}

      {/* SECONDARY - ghost outline */}
      {startNow ? (
        startNow.href ? (
          <a
            href={startNow.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleInteraction}
            className={secondaryBaseClass}
          >
            {startNow.label}
          </a>
        ) : (
          <button
            type="button"
            onClick={() => {
              startNow.onClick?.();
              handleInteraction();
            }}
            className={secondaryBaseClass}
          >
            {startNow.label}
          </button>
        )
      ) : null}

      {/* CONSULT - self-contained Koalendar modal trigger */}
      <button
        type="button"
        onClick={() => setKoalendarOpen(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
      >
        קבע/י פגישת ייעוץ חינמי </button>

      {/* TERTIARY - subtle link, pulses after 60s idle */}
      {consult15Min ? (
        <p className="text-center">
          {consult15Min.href ? (
            <a
              href={consult15Min.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleInteraction}
              className={cn(
                "text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-brand-red hover:underline",
                pulsing && "animate-pulse text-brand-red",
              )}
            >
              {consult15Min.label}
            </a>
          ) : (
            <button
              type="button"
              onClick={() => {
                consult15Min.onClick?.();
                handleInteraction();
              }}
              className={cn(
                "text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-brand-red hover:underline",
                pulsing && "animate-pulse text-brand-red",
              )}
            >
              {consult15Min.label}
            </button>
          )}
        </p>
      ) : null}

      <KoalendarModal open={koalendarOpen} onClose={() => setKoalendarOpen(false)} />
    </div>
  );
}
