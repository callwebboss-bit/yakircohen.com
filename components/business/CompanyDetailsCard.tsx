"use client";

import { useCallback, useId, useState } from "react";
import {
  buildInvoiceClipboardText,
  COMPANY_ID,
  COMPANY_LEGAL_NAME,
  COMPANY_REGISTRY_URL,
} from "@/lib/company-details";
import {
  CONTACT_PHONE_DISPLAY,
  STUDIO_ADDRESS_LINE,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

export type CompanyDetailsVariant = "compact" | "full" | "collapsible";

type CompanyDetailsCardProps = {
  variant?: CompanyDetailsVariant;
  className?: string;
};

function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  const el = document.createElement("textarea");
  el.value = text;
  el.style.cssText = "position:fixed;opacity:0;pointer-events:none";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  return Promise.resolve();
}

function CompanyDetailsContent({ showActions = true }: { showActions?: boolean }) {
  const [copied, setCopied] = useState(false);
  const printId = useId().replace(/:/g, "");

  const handleCopy = useCallback(async () => {
    try {
      await copyToClipboard(buildInvoiceClipboardText());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }, []);

  const handlePrint = useCallback(() => {
    const printRoot = document.getElementById(`company-print-${printId}`);
    if (!printRoot) {
      window.print();
      return;
    }
    const previousTitle = document.title;
    document.title = `${COMPANY_LEGAL_NAME} - פרטי ספק`;
    const cleanup = () => {
      document.title = previousTitle;
      printRoot.classList.add("hidden");
      window.removeEventListener("afterprint", cleanup);
    };
    printRoot.classList.remove("hidden");
    window.addEventListener("afterprint", cleanup);
    window.print();
  }, [printId]);

  return (
    <>
      <dl className="space-y-2 text-sm">
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
          <dt className="text-muted-foreground">שם רשמי</dt>
          <dd className="font-medium text-foreground">{COMPANY_LEGAL_NAME}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
          <dt className="text-muted-foreground">ח.פ</dt>
          <dd className="font-medium text-foreground" dir="ltr">
            {COMPANY_ID}
          </dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
          <dt className="text-muted-foreground">כתובת</dt>
          <dd className="font-medium text-foreground">{STUDIO_ADDRESS_LINE}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
          <dt className="text-muted-foreground">טלפון</dt>
          <dd className="font-medium text-foreground" dir="ltr">
            {CONTACT_PHONE_DISPLAY}
          </dd>
        </div>
      </dl>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        חשבונית מס מסודרת - פרטי בנק נמסרים בחשבונית הראשונה או לפי בקשה
      </p>

      {showActions ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void handleCopy()}
            className={cn(
              "inline-flex min-h-10 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors",
              copied
                ? "border-brand-red/40 bg-brand-red/8 text-brand-red"
                : "border-border bg-background text-foreground hover:border-brand-red/40 hover:bg-brand-red/8",
            )}
            aria-live="polite"
          >
            {copied ? "הועתק!" : "העתק פרטי חשבונית"}
          </button>
          <a
            href={COMPANY_REGISTRY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-brand-red/40 hover:bg-brand-red/8"
          >
            אימות ברשם החברות
          </a>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex min-h-10 items-center rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-brand-red/40 hover:bg-brand-red/8"
          >
            הדפס / שמור PDF
          </button>
        </div>
      ) : null}

      <div
        id={`company-print-${printId}`}
        className="hidden p-8 font-sans text-black"
        aria-hidden="true"
      >
        <h1 className="text-xl font-bold">{COMPANY_LEGAL_NAME}</h1>
        <p className="mt-4 text-sm">פרטי ספק לרכש וחשבוניות</p>
        <pre className="mt-6 whitespace-pre-wrap text-sm leading-relaxed">
          {buildInvoiceClipboardText()}
        </pre>
      </div>
    </>
  );
}

export default function CompanyDetailsCard({
  variant = "full",
  className,
}: CompanyDetailsCardProps) {
  if (variant === "compact") {
    return <CompanyDetailsCompact className={className} />;
  }

  if (variant === "collapsible") {
    return (
      <details
        className={cn(
          "group rounded-xl border border-border bg-surface",
          className,
        )}
      >
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-2">
            צריכים פרטים לרכש וחשבוניות?
            <span
              className="text-muted-foreground transition-transform group-open:rotate-180"
              aria-hidden="true"
            >
              ▼
            </span>
          </span>
        </summary>
        <div className="border-t border-border px-4 py-4">
          <CompanyDetailsContent />
        </div>
      </details>
    );
  }

  return (
    <aside
      className={cn(
        "rounded-xl border border-border bg-surface px-4 py-4 sm:px-5 sm:py-5",
        className,
      )}
      aria-labelledby="company-details-heading"
    >
      <h2 id="company-details-heading" className="text-sm font-semibold text-foreground">
        פרטי עסק לרכש וחשבוניות
      </h2>
      <div className="mt-4">
        <CompanyDetailsContent />
      </div>
    </aside>
  );
}

function CompanyDetailsCompact({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await copyToClipboard(buildInvoiceClipboardText());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }, []);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-muted-foreground md:justify-start",
        className,
      )}
    >
      <span>
        {COMPANY_LEGAL_NAME} - ח.פ {COMPANY_ID}
      </span>
      <button
        type="button"
        onClick={() => void handleCopy()}
        className={cn(
          "inline-flex min-h-9 items-center rounded-md border px-2.5 py-1 font-semibold transition-colors",
          copied
            ? "border-brand-red/40 bg-brand-red/8 text-brand-red"
            : "border-border text-foreground hover:border-brand-red/40 hover:bg-brand-red/8",
        )}
        aria-live="polite"
      >
        {copied ? "הועתק!" : "העתק פרטי חשבונית"}
      </button>
    </div>
  );
}
