"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import VoiceSearchMicButton from "@/components/ui/VoiceSearchMicButton";
import {
  usePagefindSearch,
  warmPagefindIndex,
  type PagefindSearchStatus,
} from "@/hooks/usePagefindSearch";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";
import type { PFResult } from "@/lib/pagefind-loader";
import { cn } from "@/lib/utils";

type Props = {
  placeholder?: string;
  className?: string;
  maxResults?: number;
  autoFocus?: boolean;
  inputId?: string;
};

const SearchResultRow = memo(function SearchResultRow({
  result,
  active,
  resultId,
  onSelect,
}: {
  result: PFResult;
  active: boolean;
  resultId: string;
  onSelect: () => void;
}) {
  return (
    <li role="option" id={resultId} aria-selected={active}>
      <Link
        href={result.url}
        onClick={onSelect}
        className={cn(
          "group flex min-h-11 flex-col justify-center gap-1 border-b border-border px-4 py-3 last:border-b-0",
          active ? "bg-brand-red/5" : "hover:bg-foreground/[0.03]",
        )}
      >
        <span className="text-sm font-semibold text-foreground transition-colors group-hover:text-brand-red">
          {result.meta?.title ?? result.url}
        </span>
        {result.excerpt ? (
          <span
            className="line-clamp-2 text-xs leading-relaxed text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: result.excerpt }}
          />
        ) : null}
      </Link>
    </li>
  );
});

function statusMessage(
  status: PagefindSearchStatus,
  query: string,
  resultCount: number,
  loading: boolean,
): string | null {
  if (loading) return null;
  if (status === "unavailable") return "חיפוש אינו זמין כרגע";
  if (status === "error") return "שגיאה בחיפוש - נסו שוב";
  if (status === "success" && resultCount === 0) {
    return `לא נמצאו תוצאות עבור "${query}"`;
  }
  return null;
}

export default function SiteSearch({
  placeholder = "חיפוש שירות...",
  className,
  maxResults = 7,
  autoFocus = false,
  inputId = "site-search-input",
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const voiceAutoNavigateRef = useRef(false);

  const onNavigate = useCallback(
    (href: string, _label: string) => {
      setOpen(false);
      setQuery("");
      setActiveIndex(-1);
      router.push(href);
    },
    [router],
  );

  const onSearchQuery = useCallback((value: string, source: "final" | "interim") => {
    setQuery(value);
    setOpen(true);
    setActiveIndex(-1);
    warmPagefindIndex();
    if (source === "final") voiceAutoNavigateRef.current = true;
  }, []);

  const {
    isSupported: voiceSupported,
    isListening,
    errorMessage: voiceError,
    toggleListening,
    stop: stopListening,
    clearError,
    liveMessage,
  } = useVoiceSearch({ onNavigate, onSearchQuery });

  const { status, results, isStale } = usePagefindSearch(query, { maxResults });

  const loading = status === "loading";
  const showDropdown = open && query.trim().length > 0;
  const emptyMessage = statusMessage(status, query, results.length, loading);
  const showSpinner = (loading || isStale) && !isListening;
  const showMic = voiceSupported && !showSpinner;

  useEffect(() => {
    if (!voiceAutoNavigateRef.current || loading || status !== "success") return;
    voiceAutoNavigateRef.current = false;
    if (results.length === 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveIndex(-1);
      router.push(results[0].url);
    }
  }, [loading, status, results, router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveIndex(-1);
  }, [query, results.length]);

  const selectResult = useCallback(
    (result: PFResult) => {
      setOpen(false);
      setQuery("");
      setActiveIndex(-1);
      router.push(result.url);
    },
    [router],
  );

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isListening) stopListening();
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, isListening, stopListening]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i < results.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : results.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectResult(results[activeIndex]);
    }
  };

  return (
    <div ref={containerRef} dir="rtl" className={cn("relative w-full", className)}>
      <div className="relative">
        <svg
          className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground/70"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          id={inputId}
          type="search"
          role="combobox"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            setOpen(true);
            clearError();
            voiceAutoNavigateRef.current = false;
          }}
          onFocus={() => {
            setOpen(true);
            warmPagefindIndex();
          }}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          aria-label={placeholder}
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls="site-search-results"
          aria-activedescendant={
            activeIndex >= 0 ? `site-search-result-${activeIndex}` : undefined
          }
          className={cn(
            "min-h-11 w-full rounded-xl border border-border bg-background",
            "py-2.5 pe-12 ps-9 text-sm text-foreground placeholder:text-muted-foreground/70",
            "outline-none transition-[border-color,box-shadow] duration-fast ease-luxury",
            "focus:border-brand-red focus:ring-2 focus:ring-brand-red/15",
            isListening && "border-brand-red ring-2 ring-brand-red/15",
          )}
        />

        {showMic && (
          <VoiceSearchMicButton
            isListening={isListening}
            onClick={toggleListening}
            className="absolute end-2 top-1/2 -translate-y-1/2"
          />
        )}

        {showSpinner && (
          <span
            className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2"
            aria-hidden
          >
            <svg
              className="h-4 w-4 animate-spin text-brand-red"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                className="opacity-20"
              />
              <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        {liveMessage}
        {voiceError}
        {activeIndex >= 0 && results[activeIndex]
          ? `תוצאה ${activeIndex + 1} מתוך ${results.length}: ${results[activeIndex].meta?.title ?? results[activeIndex].url}`
          : null}
      </div>

      {voiceError && !isListening && (
        <p className="mt-1 text-xs text-brand-red" role="alert">
          {voiceError}
        </p>
      )}

      {showDropdown && (
        <ul
          id="site-search-results"
          role="listbox"
          aria-label="תוצאות חיפוש"
          className={cn(
            "absolute start-0 top-full z-50 mt-1.5 w-full overflow-hidden",
            "rounded-xl border border-border bg-background shadow-lg",
            isStale && "opacity-90",
          )}
        >
          {results.length > 0
            ? results.map((result, index) => (
                <SearchResultRow
                  key={result.url}
                  resultId={`site-search-result-${index}`}
                  result={result}
                  active={index === activeIndex}
                  onSelect={() => {
                    setOpen(false);
                    setQuery("");
                    setActiveIndex(-1);
                  }}
                />
              ))
            : !loading &&
              emptyMessage && (
                <li className="px-4 py-3 text-sm text-muted-foreground">{emptyMessage}</li>
              )}
        </ul>
      )}
    </div>
  );
}
