"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CalculatorDisclosureProps = {
  title: string;
  description: string;
  buttonLabel: string;
  children: ReactNode;
  className?: string;
};

/**
 * Calculator hidden until the visitor opts in - keeps the page calm for browsers,
 * opens the full form flow only after an explicit click.
 */
export default function CalculatorDisclosure({
  title,
  description,
  buttonLabel,
  children,
  className,
}: CalculatorDisclosureProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <section className={cn("py-4", className)} aria-labelledby={`${panelId}-heading`}>
      <header className="mx-auto max-w-2xl text-center">
        <h2
          id={`${panelId}-heading`}
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      </header>

      {!open ? (
        <div className="mx-auto mt-8 max-w-md text-center">
          <p className="text-sm leading-relaxed text-muted-foreground">
            המחשבון מיועד למי שמתכנן הזמנה בפועל. אחרי הפתיחה תוכלו לבחור חבילה,
            תוספות ולשלוח בקשה מסודרת.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-brand-red px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.25)] transition-[background-color,box-shadow] duration-normal ease-luxury hover:bg-brand-red-light hover:shadow-[0_0_28px_rgba(212,43,43,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red sm:w-auto"
            aria-expanded={open}
            aria-controls={panelId}
          >
            {buttonLabel}
          </button>
        </div>
      ) : (
        <div id={panelId} className="mt-8">
          {children}
        </div>
      )}
    </section>
  );
}
