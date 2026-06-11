"use client";

import { memo, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  usePagefindSearch,
  warmPagefindIndex,
  type PagefindSearchStatus,
} from "@/hooks/usePagefindSearch";
import type { PFResult } from "@/lib/pagefind-loader";
import { cn } from "@/lib/utils";

type Props = {
  placeholder?: string;
  className?: string;
  maxResults?: number;
  autoFocus?: boolean;
};

const SearchResultRow = memo(function SearchResultRow({
  result,
  onSelect,
}: {
  result: PFResult;
  onSelect: () => void;
}) {
  return (
    <li role="option" aria-selected={false}>
      <Link
        href={result.url}
        onClick={onSelect}
        className="group flex min-h-11 flex-col justify-center gap-1 border-b border-border px-4 py-3 last:border-b-0 hover:bg-foreground/[0.03]"
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
  if (status === "error") return "שגיאה בחיפוש — נסו שוב";
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
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { status, results, isStale } = usePagefindSearch(query, { maxResults });

  const loading = status === "loading";
  const showDropdown = open && query.trim().length > 0;
  const emptyMessage = statusMessage(status, query, results.length, loading);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

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
          type="search"
          value={query}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            warmPagefindIndex();
          }}
          placeholder={placeholder}
          aria-label={placeholder}
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls="site-search-results"
          className={cn(
            "min-h-11 w-full rounded-xl border border-border bg-background",
            "py-2.5 pe-4 ps-9 text-sm text-foreground placeholder:text-muted-foreground/70",
            "outline-none transition-[border-color,box-shadow] duration-fast ease-luxury",
            "focus:border-brand-red focus:ring-2 focus:ring-brand-red/15",
          )}
        />

        {(loading || isStale) && (
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
            ? results.map((result) => (
                <SearchResultRow
                  key={result.url}
                  result={result}
                  onSelect={() => {
                    setOpen(false);
                    setQuery("");
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
