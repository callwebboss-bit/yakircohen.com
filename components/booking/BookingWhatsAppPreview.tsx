"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type SummaryLine = { label: string; value: string };

type BookingWhatsAppPreviewProps = {
  /** Full message body - preferred when using buildClosingMessage */
  messageBody?: string;
  summaryLines?: SummaryLine[];
  serviceLabel?: string;
  totalWithVat?: number;
  className?: string;
};

export default function BookingWhatsAppPreview({
  messageBody,
  summaryLines = [],
  serviceLabel,
  totalWithVat,
  className,
}: BookingWhatsAppPreviewProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const previewText =
    messageBody ??
    (`*${serviceLabel ?? "הזמנה"}*\n\n` +
      summaryLines.map((l) => `• ${l.label}: ${l.value}`).join("\n") +
      (totalWithVat !== undefined
        ? `\n\n*סה"כ משוער (כולל מע"מ):* ${totalWithVat.toLocaleString("he-IL")} ₪`
        : ""));

  function handleCopy() {
    void navigator.clipboard.writeText(previewText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className={cn("rounded-xl border border-border bg-surface", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
        aria-expanded={open}
      >
        <span>👁 כך תיראה ההודעה שתישלח ליקיר</span>
        <span className={cn("text-xs transition-transform duration-150", open && "rotate-180")}>
          ▾
        </span>
      </button>

      {open && (
        <div className="border-t border-border px-4 pb-4 pt-3">
          <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-background p-3 font-sans text-xs leading-relaxed text-foreground">
            {previewText}
          </pre>
          <button
            type="button"
            onClick={handleCopy}
            className="mt-2 text-xs text-muted-foreground underline-offset-4 hover:text-brand-red hover:underline"
          >
            {copied ? "✓ הועתק!" : "העתיקו טקסט"}
          </button>
        </div>
      )}
    </div>
  );
}
