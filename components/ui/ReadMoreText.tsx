"use client";

import { useState, type ReactNode, useId } from "react";
import { cn } from "@/lib/utils";

type ReadMoreTextProps = {
  summary: string;
  full: ReactNode;
  label?: string;
  collapseLabel?: string;
  className?: string;
};

export default function ReadMoreText({
  summary,
  full,
  label = "קרא עוד",
  collapseLabel = "סגור",
  className,
}: ReadMoreTextProps) {
  const id = useId();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn("text-sm leading-relaxed text-muted-foreground", className)}>
      <span>{summary}</span>

      {/* Full content -- always in DOM for SEO, hidden visually when collapsed */}
      <span
        id={id}
        inert={!expanded}
        className={cn(
          "grid transition-[grid-template-rows] duration-normal ease-luxury motion-reduce:transition-none",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
        aria-hidden={!expanded}
      >
        <span className="overflow-hidden">
          <span
            className={cn(
              "block transition-opacity duration-normal ease-luxury motion-reduce:transition-none",
              expanded ? "opacity-100" : "opacity-0",
            )}
          >
            {" "}
            {full}
          </span>
        </span>
      </span>

      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => setExpanded((v) => !v)}
        className="ms-1.5 inline text-xs font-semibold text-[var(--service-accent-ink,#8a1c1c)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)]"
      >
        {expanded ? collapseLabel : label}
      </button>
    </div>
  );
}
