"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BookCategoryAccordionProps = {
  id: string;
  title: string;
  subtitle: string;
  icon?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export default function BookCategoryAccordion({
  id,
  title,
  subtitle,
  icon,
  isOpen,
  onToggle,
  children,
}: BookCategoryAccordionProps) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 rounded-2xl border border-border bg-surface transition-[border-color,box-shadow]",
        isOpen && "border-brand-red/30 shadow-sm",
      )}
    >
      <button
        type="button"
        id={`${id}-trigger`}
        aria-expanded={isOpen}
        aria-controls={`${id}-panel`}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-4 py-5 text-start sm:px-6 sm:py-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {icon ? (
              <span className="text-xl shrink-0" aria-hidden="true">
                {icon}
              </span>
            ) : null}
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {title}
            </h2>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <span
          className={cn(
            "shrink-0 text-muted-foreground transition-transform duration-normal ease-luxury",
            isOpen && "rotate-180",
          )}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {isOpen ? (
        <div
          id={`${id}-panel`}
          role="region"
          aria-labelledby={`${id}-trigger`}
          className="border-t border-border px-4 pb-8 pt-6 sm:px-6 sm:pb-10"
        >
          {children}
        </div>
      ) : null}
    </section>
  );
}
