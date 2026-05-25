"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FAQItem = {
  id: string;
  question: string;
  answer: ReactNode;
};

export type FAQAccordionProps = {
  items: FAQItem[];
  title?: string;
  subtitle?: string;
  className?: string;
  allowMultiple?: boolean;
};

type PanelProps = {
  id: string;
  labelledBy: string;
  isOpen: boolean;
  children: ReactNode;
};

function AccordionPanel({
  id,
  labelledBy,
  isOpen,
  children,
}: PanelProps) {
  return (
    <div
      id={id}
      role="region"
      aria-labelledby={labelledBy}
      aria-hidden={!isOpen}
      className={cn(
        "grid transition-[grid-template-rows] duration-normal ease-luxury",
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
    >
      <div className="overflow-hidden">
        <div className="pb-5 pt-1 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function FAQAccordion({
  items,
  title = "שאלות נפוצות",
  subtitle = "תשובות קצרות וברורות על השירותים, הטכנולוגיה וההזמנה",
  className,
  allowMultiple = false,
}: FAQAccordionProps) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        return next;
      }
      if (!allowMultiple) {
        return new Set([id]);
      }
      next.add(id);
      return next;
    });
  };

  const onTriggerKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    id: string,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle(id);
    }
  };

  return (
    <section
      className={cn("bg-background py-12 sm:py-16", className)}
      aria-labelledby={`${baseId}-faq-heading`}
    >
      <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <h2
            id={`${baseId}-faq-heading`}
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            {title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        </header>

        <div className="mx-auto mt-10 max-w-3xl divide-y divide-border rounded-xl border border-border bg-surface">
          {items.map((item) => {
            const isOpen = openIds.has(item.id);
            const triggerId = `${baseId}-trigger-${item.id}`;
            const panelId = `${baseId}-panel-${item.id}`;

            return (
              <div key={item.id} className="px-4 sm:px-6">
                <h3>
                  <button
                    id={triggerId}
                    type="button"
                    className="flex w-full items-center justify-between gap-4 py-5 text-start text-sm font-semibold text-foreground transition-colors duration-normal ease-luxury hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red sm:text-base"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(item.id)}
                    onKeyDown={(event) => onTriggerKeyDown(event, item.id)}
                  >
                    <span>{item.question}</span>
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-brand-red transition-transform duration-normal ease-luxury",
                        isOpen && "rotate-180 border-brand-red/40",
                      )}
                      aria-hidden="true"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </button>
                </h3>

                <AccordionPanel
                  id={panelId}
                  labelledBy={triggerId}
                  isOpen={isOpen}
                >
                  {item.answer}
                </AccordionPanel>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
