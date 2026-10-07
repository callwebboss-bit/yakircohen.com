"use client";

import { BOOK_WIZARD_COPY } from "@/lib/data/book-wizard-copy";
import { formatPrice } from "@/lib/data/pricing-display";
import { markBookExitIntentShown } from "@/lib/book-wizard-urgency";
import { useModalA11y } from "@/hooks/useModalA11y";
import { cn } from "@/lib/utils";

type WizardExitIntentModalProps = {
  open: boolean;
  packageLabel: string;
  totalExVat: number;
  onContinue: () => void;
  onClose: () => void;
  title?: string;
  body?: string;
  continueCta?: string;
  dismissCta?: string;
};

export default function WizardExitIntentModal({
  open,
  packageLabel,
  totalExVat,
  onContinue,
  onClose,
  title = BOOK_WIZARD_COPY.exitIntentTitle,
  body = BOOK_WIZARD_COPY.exitIntentBody,
  continueCta = BOOK_WIZARD_COPY.exitIntentCta,
  dismissCta = BOOK_WIZARD_COPY.exitIntentDismiss,
}: WizardExitIntentModalProps) {
  /* F-18, 7.10.2026. Escape ממשיך לקרוא ל-onClose ישירות ולא ל-handleDismiss
     (כמו שהיה): הוא לא מסמן markBookExitIntentShown, רק הכפתור מסמן.
     מיקוד ראשוני על החלון עצמו ולא על "המשך": החלון קופץ כשהעכבר יוצא מראש
     הדף, לפעמים באמצע הקלדה, ו-Space או Enter היו מפעילים את ה-CTA בטעות. */
  const dialogRef = useModalA11y({
    active: open,
    onEscape: onClose,
    initialFocus: "container",
  });

  if (!open) return null;

  function handleDismiss() {
    markBookExitIntentShown();
    onClose();
  }

  function handleContinue() {
    markBookExitIntentShown();
    onContinue();
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wizard-exit-title"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 focus:outline-none"
    >
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={handleDismiss}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl">
        <h2 id="wizard-exit-title" className="text-lg font-semibold text-foreground">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {body}
        </p>
        {totalExVat > 0 ? (
          <p className="mt-3 rounded-xl bg-surface px-4 py-3 text-sm text-foreground">
            <span className="font-semibold">{packageLabel}</span>
            <span className="mx-2 text-muted-foreground">·</span>
            <span className="tabular-nums font-bold text-[var(--service-accent,#d42b2b)]">
              {formatPrice(totalExVat).headline}
            </span>
          </p>
        ) : null}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse">
          <button
            type="button"
            onClick={handleContinue}
            className={cn(
              "min-h-12 flex-1 rounded-xl bg-[var(--service-accent,#d42b2b)] px-4 py-3 text-sm font-semibold text-white hover:opacity-90",
            )}
          >
            {continueCta}
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="min-h-12 flex-1 rounded-xl border border-border px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {dismissCta}
          </button>
        </div>
      </div>
    </div>
  );
}
