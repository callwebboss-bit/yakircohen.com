"use client";

import { BOOK_WIZARD_COPY } from "@/lib/data/book-wizard-copy";
import { cn } from "@/lib/utils";

type WizardIdleHelpBubbleProps = {
  visible: boolean;
  waHref: string;
  onDismiss: () => void;
  className?: string;
  message?: string;
  cta?: string;
  dismiss?: string;
};

export default function WizardIdleHelpBubble({
  visible,
  waHref,
  onDismiss,
  className,
  message = BOOK_WIZARD_COPY.idleHelp,
  cta = BOOK_WIZARD_COPY.idleHelpCta,
  dismiss = BOOK_WIZARD_COPY.idleHelpDismiss,
}: WizardIdleHelpBubbleProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed z-40 max-w-xs rounded-2xl border border-border bg-surface p-4 shadow-lg",
        "bottom-24 start-4 sm:bottom-6",
        className,
      )}
      role="dialog"
      aria-live="polite"
      aria-label="עזרה בהזמנה"
    >
      <p className="text-sm leading-relaxed text-foreground">{message}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-[#25D366] px-3 py-2 text-xs font-semibold text-white hover:bg-[#1fba59]"
        >
          {cta}
        </a>
        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          {dismiss}
        </button>
      </div>
    </div>
  );
}
