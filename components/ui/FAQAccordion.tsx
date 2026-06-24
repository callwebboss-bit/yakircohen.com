"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
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
  showExpandAll?: boolean;
  defaultOpenId?: string;
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
      inert={!isOpen}
      className={cn(
        "grid transition-[grid-template-rows] duration-normal ease-luxury motion-reduce:transition-none",
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
    >
      <div className="overflow-hidden">
        <div
          className={cn(
            "faq-answer pb-5 pt-1 text-sm leading-relaxed text-muted-foreground transition-opacity duration-normal ease-luxury motion-reduce:transition-none",
            isOpen ? "opacity-100" : "opacity-0",
          )}
          data-speakable
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// UI-EXCEPTION: disclosure accordion pattern - see docs/ui-exceptions.md
export default function FAQAccordion({
  items,
  title = "שאלות ששואלים אותנו הרבה לפני שמזמינים",
  subtitle = "תשובות קצרות וברורות על השירותים, הטכנולוגיה וההזמנה",
  className,
  allowMultiple = false,
  showExpandAll = false,
  defaultOpenId,
}: FAQAccordionProps) {
  const baseId = useId();
  if (process.env.NODE_ENV === "development" && items.length > 5) {
    console.warn(
      `FAQAccordion: ${items.length} items passed -- max recommended is 5 ("${title}")`,
    );
  }
  const [openIds, setOpenIds] = useState<Set<string>>(
    defaultOpenId ? new Set([defaultOpenId]) : new Set(),
  );
  const effectiveAllowMultiple = allowMultiple || showExpandAll;

  const expandAll = () => setOpenIds(new Set(items.map((i) => i.id)));
  const collapseAll = () => setOpenIds(new Set());
  const allOpen = items.length > 0 && openIds.size === items.length;

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        return next;
      }
      if (!effectiveAllowMultiple) {
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
    <Section
      padding="sm"
      className={cn("bg-background", className)}
      ariaLabelledby={`${baseId}-faq-heading`}
    >
      <Container>
        <header className="mx-auto max-w-2xl text-center">
          <h2
            id={`${baseId}-faq-heading`}
            className="font-serif text-section-title font-semibold text-foreground"
          >
            {title}
          </h2>
          <p className="text-lead mt-3 text-muted-foreground">{subtitle}</p>
        </header>

        {showExpandAll ? (
          <div className="mx-auto mt-6 flex max-w-3xl justify-end gap-4">
            <button
              type="button"
              onClick={allOpen ? collapseAll : expandAll}
              className="text-xs font-semibold text-[var(--service-accent-ink,#8a1c1c)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)]"
            >
              {allOpen ? "סגור הכל" : "פתח הכל"}
            </button>
          </div>
        ) : null}

        <div className={cn("mx-auto max-w-3xl divide-y divide-border rounded-xl border border-border bg-surface shadow-sm", showExpandAll ? "mt-4" : "mt-10")}>
          {items.map((item) => {
            const isOpen = openIds.has(item.id);
            const triggerId = `${baseId}-trigger-${item.id}`;
            const panelId = `${baseId}-panel-${item.id}`;

            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-lg px-4 transition-colors duration-normal ease-luxury sm:px-6",
                  isOpen && "bg-[var(--service-accent,#d42b2b)]/[0.02]",
                )}
              >
                <h3>
                  <button
                    id={triggerId}
                    type="button"
                    className={cn(
                      "touch-target flex w-full items-center justify-between gap-4 py-4 text-start text-sm font-semibold text-foreground transition-all duration-fast ease-luxury active:scale-[0.995] hover:text-[var(--service-accent-ink,#8a1c1c)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)] sm:text-base",
                      isOpen && "text-[var(--service-accent-ink,#8a1c1c)]",
                    )}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(item.id)}
                    onKeyDown={(event) => onTriggerKeyDown(event, item.id)}
                  >
                    <span>{item.question}</span>
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[var(--service-accent-ink,#8a1c1c)] transition-transform duration-normal ease-luxury motion-reduce:transition-none motion-reduce:rotate-0",
                        isOpen && "rotate-180 border-[var(--service-accent,#d42b2b)]/40 bg-[var(--service-accent,#d42b2b)]/10",
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
      </Container>
    </Section>
  );
}
