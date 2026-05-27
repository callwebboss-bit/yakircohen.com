"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type TocEntry = {
  id: string;
  label: string;
  level: 2 | 3;
};

export type TableOfContentsProps = {
  entries: readonly TocEntry[];
  className?: string;
};

/**
 * Sticky TOC for long service pages - desktop sidebar, mobile accordion.
 */
export default function TableOfContents({ entries, className }: TableOfContentsProps) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (entries.length === 0) return;
    const observer = new IntersectionObserver(
      (items) => {
        const visible = items
          .filter((i) => i.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );
    for (const entry of entries) {
      const el = document.getElementById(entry.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length < 3) return null;

  const list = (
    <ul className="space-y-1.5 text-sm">
      {entries.map((entry) => (
        <li key={entry.id}>
          <a
            href={`#${entry.id}`}
            className={cn(
              "block rounded-md px-2 py-1.5 transition-colors hover:bg-brand-red/5 hover:text-brand-red",
              entry.level === 3 && "me-3 text-xs",
              activeId === entry.id && "font-semibold text-brand-red",
            )}
          >
            {entry.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <nav aria-label="תוכן העמוד" className={cn(className)}>
      <div className="lg:hidden">
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          תוכן העמוד
          <span aria-hidden>{open ? "−" : "+"}</span>
        </button>
        {open ? <div className="mt-2 rounded-lg border border-border bg-surface p-3">{list}</div> : null}
      </div>
      <div className="hidden lg:block">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          בעמוד זה
        </p>
        {list}
      </div>
    </nav>
  );
}
