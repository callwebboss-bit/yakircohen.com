"use client";

/**
 * FAQWithCtaLinks - accordion with a per-item WhatsApp CTA link.
 *
 * Extends the existing FAQAccordion pattern with an additional `ctaText` and
 * `whatsappMessage` field per item, so every answer ends with a contextual
 * deep-link that routes the reader directly into a relevant WhatsApp conversation.
 *
 * Interaction: single-open (one answer visible at a time).
 * Animation: grid-template-rows 0fr 1fr (same technique as FAQAccordion.tsx).
 * Accessibility: ARIA disclosure pattern - trigger button has aria-expanded +
 *   aria-controls, panel has role="region" + aria-labelledby.
 */

import { useId, useState } from "react";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   Types
   ───────────────────────────────────────────────────────────────────────────── */

export type FaqCtaItem = {
  id: string;
  question: string;
  answer: string;
  /** Short inline text for the WhatsApp CTA rendered at the bottom of the answer. */
  ctaText: string;
  /** Pre-filled WhatsApp message. Hebrew is safe - buildWhatsAppHref encodes it. */
  whatsappMessage: string;
  utm_campaign: string;
};

export type FAQWithCtaLinksProps = {
  items: FaqCtaItem[];
  className?: string;
};

/* ─────────────────────────────────────────────────────────────────────────────
   Component
   ───────────────────────────────────────────────────────────────────────────── */

export default function FAQWithCtaLinks({
  items,
  className,
}: FAQWithCtaLinksProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) =>
    setOpenId((prev) => (prev === id ? null : id));

  return (
    <div
      className={cn(
        "divide-y divide-border rounded-2xl border border-border bg-surface",
        className,
      )}
    >
      {items.map((item) => {
        const isOpen = openId === item.id;
        const triggerId = `${baseId}-trigger-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        const whatsappHref = buildWhatsAppHref({
          text: item.whatsappMessage,
          utm_source: "faq",
          utm_campaign: item.utm_campaign,
        });

        return (
          <div key={item.id} className="px-5 sm:px-7">
            {/* ── Trigger ── */}
            <h3>
              <button
                id={triggerId}
                type="button"
                className={cn(
                  "flex w-full items-center justify-between gap-4 py-5",
                  "text-start text-sm font-semibold text-foreground sm:text-base",
                  "transition-colors duration-fast ease-luxury hover:text-brand-red",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                )}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle(item.id);
                  }
                }}
              >
                <span>{item.question}</span>

                {/* Chevron indicator */}
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    "border border-border bg-background text-brand-red",
                    "transition-[transform,border-color] duration-normal ease-luxury",
                    isOpen && "rotate-180 border-brand-red/40",
                  )}
                  aria-hidden="true"
                >
                  <svg
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
                </span>
              </button>
            </h3>

            {/* ── Animated panel ── */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows] duration-normal ease-luxury",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="pb-6 pt-1">
                  {/* Answer body */}
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {item.answer}
                  </p>

                  {/* ── Contextual WhatsApp CTA ── */}
                  {/*
                   * Rendered as a pill button rather than a plain text link:
                   * the gold border + subtle fill signals "click to act" more
                   * clearly than a bare anchor, matching the ServiceCard WA link
                   * pattern used elsewhere in the site.
                   */}
                  <div className="mt-4 border-t border-border/60 pt-4">
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "inline-flex items-center gap-2 rounded-lg",
                        "border border-brand-red/40 bg-brand-red/8 px-3 py-2",
                        "text-xs font-semibold text-foreground",
                        "transition-[background-color,border-color] duration-fast ease-luxury",
                        "hover:border-brand-red/60 hover:bg-brand-red/15",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                      )}
                      aria-label={`${item.ctaText} - פתיחת שיחת וואטסאפ בחלון חדש`}
                    >
                      {/* WhatsApp icon */}
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-3.5 w-3.5 shrink-0 text-brand-red"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      {item.ctaText}
                      <span aria-hidden="true" className="text-xs opacity-55"> </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
