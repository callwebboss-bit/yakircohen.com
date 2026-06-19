"use client";

import { useId, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import { HOME_SERVICE_DETAILS, type ServiceDetailBlock } from "@/lib/data/home";

function ServicePanel({
  id,
  labelledBy,
  isOpen,
  item,
}: {
  id: string;
  labelledBy: string;
  isOpen: boolean;
  item: ServiceDetailBlock;
}) {
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
            "px-4 pb-5 pt-1 transition-opacity duration-normal ease-luxury motion-reduce:transition-none sm:px-6",
            isOpen ? "opacity-100" : "opacity-0",
          )}
        >
          <ul className="space-y-2.5 text-sm leading-relaxed text-muted-foreground">
            {item.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red"
                  aria-hidden="true"
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          {item.ctaHref && item.ctaText && (
            <div className="mt-4">
              <Link
                href={item.ctaHref}
                className="text-xs font-semibold text-brand-red hover:underline"
              >
                {item.ctaText} ←
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomeServicesDetailHub() {
  const baseId = useId();
  const [openId, setOpenId] = useState<string>(HOME_SERVICE_DETAILS[0].id);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? "" : id));
  };

  return (
    <Section
      padding="sm"
      className="bg-surface"
      ariaLabelledby={`${baseId}-hub-heading`}
    >
      <Container>
        <header className="mx-auto max-w-2xl text-center">
          <h2
            id={`${baseId}-hub-heading`}
            className="font-serif text-section-title font-semibold text-foreground"
          >
            כל השירותים — מפרט מלא
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            פרטים טכניים, מחירים ופרמטרים תפעוליים לכל מסלול
          </p>
        </header>

        <div className="mx-auto mt-10 max-w-3xl divide-y divide-border rounded-xl border border-border bg-background shadow-sm">
          {HOME_SERVICE_DETAILS.map((item) => {
            const isOpen = openId === item.id;
            const triggerId = `${baseId}-trigger-${item.id}`;
            const panelId = `${baseId}-panel-${item.id}`;

            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-lg px-4 transition-colors duration-normal ease-luxury sm:px-6",
                  isOpen && "bg-brand-red/[0.02]",
                )}
              >
                <h3>
                  <button
                    id={triggerId}
                    type="button"
                    onClick={() => toggle(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className={cn(
                      "touch-target flex w-full items-center justify-between gap-4 py-4 text-start text-sm font-semibold text-foreground transition-all duration-fast ease-luxury active:scale-[0.995] hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red sm:text-base",
                      isOpen && "text-brand-red",
                    )}
                  >
                    <div className="space-y-0.5">
                      <span className="block">{item.title}</span>
                      <span className="block text-xs font-normal text-muted-foreground">
                        {item.summary}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      {item.priceLabel && (
                        <span className="hidden rounded-md bg-brand-red/5 px-2.5 py-1 text-xs font-semibold text-brand-red sm:block">
                          {item.priceLabel}
                        </span>
                      )}
                      <span
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-brand-red transition-transform duration-normal ease-luxury motion-reduce:transition-none motion-reduce:rotate-0",
                          isOpen &&
                            "rotate-180 border-brand-red/40 bg-brand-red/10",
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
                    </div>
                  </button>
                </h3>

                <ServicePanel
                  id={panelId}
                  labelledBy={triggerId}
                  isOpen={isOpen}
                  item={item}
                />
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
