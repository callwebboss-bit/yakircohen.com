"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  STUDIO_PRICING_ACCORDION_DISCLAIMER,
  STUDIO_PRICING_ACCORDION_PANELS,
  buildAccordionWhatsAppText,
  type StudioPricingAccordionPanel,
} from "@/lib/data/studio-pricing-accordion";
import { buildWhatsAppHref } from "@/lib/whatsapp";

function PanelActions({ panel }: { panel: StudioPricingAccordionPanel }) {
  const waHref = buildWhatsAppHref({
    text: buildAccordionWhatsAppText(panel),
    utm_source: "website",
    utm_campaign: `studio_pricing_acc_${panel.id}`,
  });

  return (
    <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-red px-5 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
      >
        שליחה בוואטסאפ - {panel.title} מ-{panel.priceExVat.toLocaleString("he-IL")} ₪
      </a>
      <Link
        href={panel.bookHref}
        className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:border-brand-red/40 hover:text-brand-red"
      >
        הזמנה מקוונת
      </Link>
      <Link
        href={panel.serviceHref}
        className="inline-flex min-h-12 items-center justify-center px-2 text-sm font-semibold text-brand-red hover:underline"
      >
        לעמוד השירות
      </Link>
    </div>
  );
}

export default function StudioPricingAccordion() {
  return (
    <section aria-labelledby="studio-pricing-accordion-heading" className="space-y-4">
      <header className="mx-auto max-w-2xl text-center">
        <h2
          id="studio-pricing-accordion-heading"
          className="font-serif text-section-title font-semibold text-foreground"
        >
          מחיר לפי מסלול - מה כלול
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {STUDIO_PRICING_ACCORDION_DISCLAIMER}. פותחים פאנל - רואים פירוק עלות, למי
          מתאים, ושולחים הודעה מותאמת.
        </p>
      </header>

      <Accordion type="single" collapsible defaultValue="song" className="bg-surface">
        {STUDIO_PRICING_ACCORDION_PANELS.map((panel) => (
          <AccordionItem key={panel.id} value={panel.id}>
            <AccordionTrigger className="text-base font-semibold text-foreground sm:text-lg">
              <span className="flex flex-col gap-0.5 pe-2 sm:flex-row sm:items-baseline sm:gap-3">
                <span>{panel.title}</span>
                <span className="text-sm font-medium text-brand-red sm:text-base">
                  מ-{panel.priceExVat.toLocaleString("he-IL")} ₪
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="[&_a]:no-underline">
              <p className="text-xs text-muted-foreground">{panel.priceNote}</p>
              {panel.intentNote ? (
                <p className="mt-2 rounded-lg border border-brand-red/20 bg-brand-red/5 px-3 py-2 text-sm text-foreground">
                  {panel.intentNote}
                </p>
              ) : null}
              <p className="mt-3 text-sm text-foreground">
                <span className="font-semibold">למי זה מתאים: </span>
                {panel.suitedFor}
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    מה כלול בבסיס
                  </p>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {panel.includes.map((line) => (
                      <li key={line} className="flex gap-2">
                        <span className="text-brand-red" aria-hidden>
                          ✓
                        </span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    תוספות / הערות
                  </p>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {panel.extras.map((line) => (
                      <li key={line} className="flex gap-2">
                        <span aria-hidden>•</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm text-foreground">
                    <span className="font-semibold">זמן מסירה: </span>
                    {panel.delivery}
                  </p>
                </div>
              </div>
              <PanelActions panel={panel} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
