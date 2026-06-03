"use client";

import { useEffect, useRef, useState } from "react";
import WhatsAppIcon from "@/components/calculators/WhatsAppIcon";
import KoalendarModal from "@/components/booking/KoalendarModal";
import { cn } from "@/lib/utils";

const IDLE_PULSE_DELAY_MS = 60_000;

export type BookingSummaryAction = {
  href?: string;
  onClick?: () => void;
  label: string;
};

export type BookingSummaryActionsProps = {
  /** Primary green WhatsApp button — "continue_chat" intent */
  continueWhatsApp: BookingSummaryAction;
  /** Secondary ghost outline button — "start_now" intent */
  startNow?: BookingSummaryAction;
  /** Tertiary text link — pulses after 60s idle */
  consult15Min?: BookingSummaryAction;
  /** Small social-proof line shown above the primary button */
  socialProof?: string;
  /** Disables both action buttons (e.g. until terms accepted) */
  disabled?: boolean;
  className?: string;
};

export default function BookingSummaryActions({
  continueWhatsApp,
  startNow,
  consult15Min,
  socialProof,
  disabled = false,
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

      {/* PRIMARY — WhatsApp green */}
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

      {/* SECONDARY — ghost outline */}
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

      {/* CONSULT — self-contained Koalendar modal trigger */}
      <button
        type="button"
        onClick={() => setKoalendarOpen(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
      >
        קבע/י פגישת ייעוץ חינמי ←
      </button>

      {/* TERTIARY — subtle link, pulses after 60s idle */}
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
