"use client";

import Link from "next/link";
import { Fragment, useEffect, useId, useState, type KeyboardEvent, type ReactNode } from "react";
import PricingHubRowAccordion from "@/components/pricing/PricingHubRowAccordion";
import {
  groupPricingHubSections,
  type PricingHubSection,
} from "@/lib/data/pricing-hub";
import { cn } from "@/lib/utils";

const linkClass =
  "inline-flex min-h-11 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

type SectionPanelProps = {
  id: string;
  labelledBy: string;
  isOpen: boolean;
  children: React.ReactNode;
};

function SectionPanel({ id, labelledBy, isOpen, children }: SectionPanelProps) {
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
            "border-t border-border px-4 pb-4 pt-2 transition-opacity duration-normal ease-luxury motion-reduce:transition-none sm:px-5",
            isOpen ? "opacity-100" : "opacity-0",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

type PricingSectionBlockProps = {
  section: PricingHubSection;
  isOpen: boolean;
  baseId: string;
  onToggle: (sectionId: string) => void;
  onTriggerKeyDown: (
    event: KeyboardEvent<HTMLButtonElement>,
    sectionId: string,
  ) => void;
};

function PricingSectionBlock({
  section,
  isOpen,
  baseId,
  onToggle,
  onTriggerKeyDown,
}: PricingSectionBlockProps) {
  const triggerId = `${baseId}-section-trigger-${section.id}`;
  const panelId = `${baseId}-section-panel-${section.id}`;

  return (
    <section id={section.id} aria-labelledby={`pricing-${section.id}`}>
      <div
        className={cn(
          "px-4 py-4 transition-colors duration-normal ease-luxury sm:px-5",
          isOpen && "bg-brand-red/[0.02]",
        )}
      >
        <div className="flex min-h-12 items-start gap-2">
          <div className="min-w-0 flex-1">
            <h3
              id={`pricing-${section.id}`}
              className="font-serif text-lg font-semibold text-foreground"
            >
              <Link
                href={section.href}
                className={`${linkClass} hover:text-brand-red`}
                onClick={(e) => e.stopPropagation()}
              >
                {section.title}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {section.rows.length} שירותים · לחצו על החץ לראות מחירים
            </p>
          </div>
          <button
            id={triggerId}
            type="button"
            className={cn(
              "mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-background text-brand-red transition-transform duration-normal ease-luxury hover:border-brand-red/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red motion-reduce:transition-none motion-reduce:rotate-0",
              isOpen && "rotate-180 border-brand-red/40 bg-brand-red/10",
            )}
            aria-expanded={isOpen}
            aria-controls={panelId}
            aria-label={
              isOpen
                ? `סגור מחירון ${section.title}`
                : `הצג מחירון ${section.title}`
            }
            onClick={() => onToggle(section.id)}
            onKeyDown={(event) => onTriggerKeyDown(event, section.id)}
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
      </div>

      <SectionPanel id={panelId} labelledBy={triggerId} isOpen={isOpen}>
        <PricingHubRowAccordion
          rows={section.rows}
          sectionHref={section.href}
          sectionBookHref={section.bookHref}
          sectionId={section.id}
          nested
        />
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link
            href={section.href}
            className={`${linkClass} font-semibold text-brand-red hover:underline`}
          >
            פרטים נוספים
          </Link>
          {section.bookHref ? (
            <Link
              href={section.bookHref}
              className={`${linkClass} text-muted-foreground hover:text-brand-red`}
            >
              הזמנה מקוונת
            </Link>
          ) : null}
        </div>
      </SectionPanel>
    </section>
  );
}

export type PricingHubSectionsAccordionProps = {
  sections: readonly PricingHubSection[];
  /** מוצג אחרי קטגוריית הפודקאסט (אמצע הדף) */
  midPageSlot?: ReactNode;
};

export default function PricingHubSectionsAccordion({
  sections,
  midPageSlot,
}: PricingHubSectionsAccordionProps) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const superCategoryGroups = groupPricingHubSections(sections);

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      if (sections.some((section) => section.id === hash)) {
        setOpenIds((prev) => new Set([...prev, hash]));
        requestAnimationFrame(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        return;
      }
      if (hash.startsWith("pricing-super-")) {
        requestAnimationFrame(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [sections]);

  const toggle = (sectionId: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
        return next;
      }
      next.add(sectionId);
      return next;
    });
  };

  const onTriggerKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    sectionId: string,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle(sectionId);
    }
  };

  return (
    <div className="space-y-10">
      {superCategoryGroups.map((group, groupIndex) => (
        <Fragment key={group.id}>
          <div
            id={`pricing-super-${group.id}`}
            className={cn("scroll-mt-24 rounded-2xl p-4 sm:p-5", group.bgClass)}
          >
            <h2 className="font-serif text-section-title font-semibold text-foreground">
              {group.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {group.sections.length} מקטעים · {group.sections.reduce((sum, s) => sum + s.rows.length, 0)} שירותים
            </p>
            <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-surface">
              {group.sections.map((section) => (
                <PricingSectionBlock
                  key={section.id}
                  section={section}
                  isOpen={openIds.has(section.id)}
                  baseId={baseId}
                  onToggle={toggle}
                  onTriggerKeyDown={onTriggerKeyDown}
                />
              ))}
            </div>
          </div>
          {groupIndex === 1 && midPageSlot ? (
            <div className="scroll-mt-24">{midPageSlot}</div>
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}
