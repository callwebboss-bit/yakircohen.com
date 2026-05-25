"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   SocialShare
   ─────────────────────────────────────────────────────────────────────────────
   Inline sharing panel for article pages.

   Strategy:
   1. Detect `navigator.share` after mount (client-only API - never on server).
   2. If the Web Share API is available → render a single native share trigger.
   3. If not (desktop Chrome, Firefox, etc.) → render three fallback actions:
      WhatsApp deep-link, Facebook sharer, and a copy-to-clipboard button.

   The WhatsApp href uses the generic `wa.me/?text=` share endpoint (NOT the
   business chat number) so recipients can paste into any conversation.

   Encoding: `encodeURIComponent` is used for all share payloads so Hebrew
   characters and punctuation survive the URL round-trip correctly.
   ───────────────────────────────────────────────────────────────────────────── */

/* ─── Types ──────────────────────────────────────────────────────────────────*/

export type SocialShareProps = {
  title: string;
  /** Canonical URL of the article. Defaults to `window.location.href`. */
  url?: string;
  /** Short teaser included in the WhatsApp and native-share text payloads. */
  excerpt?: string;
  className?: string;
};

/* ─── SVG Icons ──────────────────────────────────────────────────────────────*/

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function NativeShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

/* ─── Shared button styles ───────────────────────────────────────────────────*/

const SHARE_BTN =
  "inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground " +
  "transition-[border-color,background-color,color] duration-fast ease-luxury " +
  "hover:border-brand-red/50 hover:bg-brand-red/8 hover:text-foreground " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

/* ─── Component ──────────────────────────────────────────────────────────────*/

export default function SocialShare({
  title,
  url,
  excerpt,
  className,
}: SocialShareProps) {
  const canNativeShare = useSyncExternalStore(
    () => () => {},
    () => typeof navigator !== "undefined" && "share" in navigator,
    () => false,
  );

  const pageUrl = useSyncExternalStore(
    () => () => {},
    () => url ?? window.location.href,
    () => url ?? "",
  );

  const [copied, setCopied] = useState(false);

  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  /* ── Derived share payloads ── */

  const whatsappText = encodeURIComponent(
    `שתפו את המאמר:\n*${title}*${excerpt ? `\n\n${excerpt}` : ""}\n\n${pageUrl}`,
  );
  const whatsappHref = `https://wa.me/?text=${whatsappText}`;

  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;

  /* ── Handlers ── */

  const handleNativeShare = useCallback(async () => {
    try {
      await navigator.share({
        title,
        text: excerpt ?? title,
        url: pageUrl,
      });
    } catch (err) {
      /* AbortError fires when the user dismisses the native sheet - not an error. */
      if ((err as Error)?.name !== "AbortError") {
        console.warn("[SocialShare] navigator.share failed:", err);
      }
    }
  }, [title, excerpt, pageUrl]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
    } catch {
      /* Clipboard API not available - fallback via execCommand. */
      const el = document.createElement("input");
      el.value = pageUrl;
      el.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    copyTimerRef.current = setTimeout(() => setCopied(false), 2200);
  }, [pageUrl]);

  return (
    <aside
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-surface px-4 py-4 sm:flex-row sm:items-center sm:gap-4",
        className,
      )}
      aria-label="שיתוף מאמר זה"
    >
      {/* Label */}
      <p className="shrink-0 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        שתפו:
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="אפשרויות שיתוף">
        {canNativeShare ? (
          /* ── Native share (mobile, Safari desktop 14+) ── */
          <button
            type="button"
            onClick={() => void handleNativeShare()}
            className={SHARE_BTN}
            aria-label={`שתף את המאמר: ${title}`}
          >
            <NativeShareIcon />
            שתפו מאמר זה
          </button>
        ) : (
          /* ── Fallback: platform-specific buttons ── */
          <>
            {/* WhatsApp */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(SHARE_BTN, "text-[#25d366] hover:border-[#25d366]/40 hover:bg-[#25d366]/8 hover:text-[#25d366]")}
              aria-label={`שתף בוואטסאפ: ${title}`}
            >
              <WhatsAppIcon />
              וואטסאפ
            </a>

            {/* Facebook */}
            <a
              href={facebookHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(SHARE_BTN, "text-[#1877f2] hover:border-[#1877f2]/40 hover:bg-[#1877f2]/8 hover:text-[#1877f2]")}
              aria-label={`שתף בפייסבוק: ${title}`}
            >
              <FacebookIcon />
              פייסבוק
            </a>
          </>
        )}

        {/* Copy link - always available as a universal fallback */}
        <button
          type="button"
          onClick={() => void handleCopy()}
          className={cn(
            SHARE_BTN,
            copied && "border-brand-red/50 bg-brand-red/10 text-brand-red",
          )}
          aria-label={copied ? "הקישור הועתק בהצלחה" : "העתק קישור למאמר"}
          aria-live="polite"
        >
          {copied ? (
            <>
              <CheckIcon />
              הועתק!
            </>
          ) : (
            <>
              <LinkIcon />
              העתק קישור
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
