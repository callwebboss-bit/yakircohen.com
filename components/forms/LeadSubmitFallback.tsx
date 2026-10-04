"use client";

import { CONTACT_PHONE_E164 } from "@/lib/constants";
import { LEAD_SUBMIT_FALLBACK } from "@/lib/data/conversion-copy";

type LeadSubmitFallbackProps = {
  /** אותו קישור וואטסאפ עם אותו טקסט שהטופס בנה */
  waHref: string;
  onRetry?: () => void;
  retrying?: boolean;
  className?: string;
};

/**
 * מוצג כשהשרת לא אישר שהליד הגיע לבעלים (LF-02). במקום "נשלח בהצלחה"
 * הגולש מקבל שלוש דרכים להעביר את הפרטים. הקישורים הם לחיצה של הגולש עצמו,
 * ולכן חוסם חלונות לא עוצר אותם.
 */
export default function LeadSubmitFallback({
  waHref,
  onRetry,
  retrying = false,
  className = "",
}: LeadSubmitFallbackProps) {
  return (
    <div
      role="alert"
      className={`rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-right ${className}`.trim()}
    >
      <p className="text-sm font-semibold text-foreground">{LEAD_SUBMIT_FALLBACK.title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{LEAD_SUBMIT_FALLBACK.body}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {waHref ? (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-lg bg-[#25D366] px-4 text-sm font-semibold text-white"
          >
            {LEAD_SUBMIT_FALLBACK.whatsapp}
          </a>
        ) : null}
        <a
          href={`tel:${CONTACT_PHONE_E164}`}
          className="inline-flex min-h-11 items-center rounded-lg border border-border bg-background px-4 text-sm font-semibold text-foreground"
        >
          {LEAD_SUBMIT_FALLBACK.call}
        </a>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            disabled={retrying}
            className="inline-flex min-h-11 items-center rounded-lg border border-border bg-background px-4 text-sm text-foreground disabled:opacity-60"
          >
            {retrying ? LEAD_SUBMIT_FALLBACK.retrying : LEAD_SUBMIT_FALLBACK.retry}
          </button>
        ) : null}
      </div>
    </div>
  );
}
