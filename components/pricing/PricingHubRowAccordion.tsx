"use client";

import Link from "next/link";
import { useId, useState, type KeyboardEvent } from "react";
import PriceScopeDisplay, { PriceScopeCompact } from "@/components/booking/PriceScopeDisplay";
import InlineServiceLink from "@/components/marketing/InlineServiceLink";
import {
  resolveRowBookHref,
  resolveRowDescription,
  resolveRowHref,
  resolveRowScope,
  resolveRowShowFromPrefix,
  resolveRowSuitedFor,
  type PricingHubRow,
} from "@/lib/data/pricing-hub";
import { pricingRowBookCta } from "@/lib/data/conversion-copy";
import { cn } from "@/lib/utils";

const linkClass =
  "inline-flex min-h-11 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

type RowPanelProps = {
  id: string;
  labelledBy: string;
  isOpen: boolean;
  children: React.ReactNode;
};

function RowPanel({ id, labelledBy, isOpen, children }: RowPanelProps) {
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
            "pb-4 pt-1 text-sm leading-relaxed text-muted-foreground transition-opacity duration-normal ease-luxury motion-reduce:transition-none",
            isOpen ? "opacity-100" : "opacity-0",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export type PricingHubRowAccordionProps = {
  rows: readonly PricingHubRow[];
  sectionHref: string;
  sectionBookHref?: string;
  sectionId: string;
  /** בתוך אקורדיון קטגוריה, בלי מסגרת חיצונית כפולה */
  nested?: boolean;
};

export default function PricingHubRowAccordion({
  rows,
  sectionHref,
  sectionBookHref,
  sectionId,
  nested = false,
}: PricingHubRowAccordionProps) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggle = (rowKey: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(rowKey)) {
        next.delete(rowKey);
        return next;
      }
      next.add(rowKey);
      return next;
    });
  };

  const onTriggerKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    rowKey: string,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle(rowKey);
    }
  };

  return (
    <ul
      className={cn(
        "divide-y divide-border",
        nested
          ? "rounded-xl border border-border bg-background"
          : "mt-4 rounded-2xl border border-border bg-surface",
      )}
    >
      {rows.map((row, index) => {
        const rowKey = `${sectionId}-${row.catalogId ?? "row"}-${index}`;
        const isOpen = openIds.has(rowKey);
        const triggerId = `${baseId}-trigger-${rowKey}`;
        const panelId = `${baseId}-panel-${rowKey}`;
        const rowHref = resolveRowHref(row, sectionHref);
        const rowBookHref = resolveRowBookHref(row, sectionBookHref);
        const description = resolveRowDescription(row);
        const scope = resolveRowScope(row);
        const suitedFor = resolveRowSuitedFor(row);
        const showFromPrefix = resolveRowShowFromPrefix(row);

        return (
          <li key={rowKey}>
            <div
              className={cn(
                "px-4 transition-colors duration-normal ease-luxury sm:px-5",
                isOpen && "bg-brand-red/[0.02]",
              )}
            >
              <div className="flex min-h-12 items-center gap-2">
                <div className="flex min-w-0 flex-1 flex-col py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={rowHref}
                      className={`${linkClass} text-sm font-medium text-foreground hover:text-brand-red`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {row.label}
                    </Link>
                    {row.badge ? (
                      <span className="rounded-full bg-brand-red px-2 py-0.5 text-[0.65rem] font-bold text-white">
                        {row.badge}
                      </span>
                    ) : null}
                  </div>
                  {!isOpen ? (
                    <PriceScopeCompact
                      exVat={row.exVat}
                      scope={scope}
                      showFromPrefix={showFromPrefix}
                      className="mt-1"
                    />
                  ) : null}
                </div>
                <button
                  id={triggerId}
                  type="button"
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-background text-brand-red transition-transform duration-normal ease-luxury hover:border-brand-red/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red motion-reduce:transition-none motion-reduce:rotate-0",
                    isOpen && "rotate-180 border-brand-red/40 bg-brand-red/10",
                  )}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-label={isOpen ? `סגור מחיר עבור ${row.label}` : `הצג מחיר עבור ${row.label}`}
                  onClick={() => toggle(rowKey)}
                  onKeyDown={(event) => onTriggerKeyDown(event, rowKey)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <RowPanel id={panelId} labelledBy={triggerId} isOpen={isOpen}>
                {description ? (
                  <p className="text-sm text-muted-foreground">{description}</p>
                ) : null}
                <div className="mt-2">
                  <PriceScopeDisplay
                    exVat={row.exVat}
                    scope={scope}
                    size="sm"
                    suitedFor={suitedFor}
                    showFromPrefix={showFromPrefix}
                  />
                </div>
                <Link
                  href={rowBookHref}
                  className={`${linkClass} mt-3 inline-flex w-full justify-center rounded-xl bg-brand-red px-4 py-3 text-sm font-semibold text-white hover:bg-brand-red-light`}
                >
                  {pricingRowBookCta(row.exVat, showFromPrefix)}
                </Link>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <InlineServiceLink href={rowHref}>פרטים נוספים</InlineServiceLink>
                </div>
              </RowPanel>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
