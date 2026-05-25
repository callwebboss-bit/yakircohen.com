"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type ShareButtonProps = {
  title: string;
  text?: string;
  className?: string;
};

export default function ShareButton({ title, text, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const shareText = text ?? `בדקו את זה אצל יקיר כהן הפקות: ${title}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url });
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          console.warn("[ShareButton] navigator.share failed:", err);
        }
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement("input");
      el.value = url;
      el.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button
      type="button"
      onClick={() => void handleShare()}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground",
        "transition-[border-color,background-color,color] duration-fast ease-luxury",
        "hover:border-brand-red/40 hover:bg-brand-red/8 hover:text-foreground",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
        copied && "border-brand-red/40 bg-brand-red/8 text-brand-red",
        className,
      )}
      aria-label={copied ? "הקישור הועתק בהצלחה" : "שתף עמוד זה"}
      aria-live="polite"
    >
      {copied ? (
        <>
          {/* Check icon */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 shrink-0 text-brand-red" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <span>הועתק!</span>
        </>
      ) : (
        <>
          {/* Share / Link icon */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span>שתף</span>
        </>
      )}
    </button>
  );
}
