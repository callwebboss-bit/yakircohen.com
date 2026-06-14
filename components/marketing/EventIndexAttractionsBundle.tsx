"use client";

import { useCallback, useState } from "react";
import {
  PRO_ATTRACTIONS,
  PRO_BUNDLE_3_EX_VAT,
  PRO_BUNDLE_3_SAVING_EX_VAT,
  PRO_BUNDLE_COUNT,
  PRO_SINGLE_EX_VAT,
  buildProducerBundleWhatsAppText,
  formatProPriceExVat,
  formatProPriceShort,
} from "@/lib/data/event-index-attractions-pro";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export default function EventIndexAttractionsBundle() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= PRO_BUNDLE_COUNT) return prev;
      return [...prev, id];
    });
  }, []);

  const selectedItems = PRO_ATTRACTIONS.filter((a) => selected.includes(a.id));
  const retailTotal = PRO_SINGLE_EX_VAT * PRO_BUNDLE_COUNT;
  const ready = selected.length === PRO_BUNDLE_COUNT;
  const remaining = PRO_BUNDLE_COUNT - selected.length;

  const waHref = buildWhatsAppHref({
    text: buildProducerBundleWhatsAppText(selectedItems.map((a) => a.name)),
    utm_source: "website",
    utm_campaign: "event_index_producer_bundle",
  });

  return (
    <section
      id="bundle-picker"
      className="scroll-mt-24 rounded-2xl border border-border bg-surface p-6 sm:p-8"
      aria-labelledby="bundle-picker-heading"
    >
      <h2 id="bundle-picker-heading" className="font-serif text-xl font-semibold">
        חבילת שלוש אטרקציות למפיקים
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        בחרו שלוש אטרקציות לאירוע. מפעיל אחד, תיאום מראש, והפעלה בזמן.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-background px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground">שלוש בנפרד</p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-muted-foreground line-through decoration-brand-red/40">
            {formatProPriceShort(retailTotal)}
          </p>
        </div>
        <div className="rounded-xl border border-brand-red/30 bg-brand-red/5 px-4 py-3">
          <p className="text-xs font-medium text-brand-red">בחבילה למפיקים</p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
            {formatProPriceExVat(PRO_BUNDLE_3_EX_VAT)}
            <span className="ms-1 text-xs font-normal text-muted-foreground">
              לפני מע״מ
            </span>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            חיסכון {PRO_BUNDLE_3_SAVING_EX_VAT.toLocaleString("he-IL")} שקלים
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-foreground">בחירת אטרקציות</p>
          <p className="text-xs tabular-nums text-muted-foreground">
            {selected.length} מתוך {PRO_BUNDLE_COUNT}
          </p>
        </div>
        <div
          className="mb-4 flex gap-1.5"
          role="progressbar"
          aria-valuenow={selected.length}
          aria-valuemin={0}
          aria-valuemax={PRO_BUNDLE_COUNT}
          aria-label="התקדמות בחירה"
        >
          {Array.from({ length: PRO_BUNDLE_COUNT }, (_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i < selected.length ? "bg-brand-red" : "bg-border",
              )}
            />
          ))}
        </div>

        <ul className="grid gap-2 sm:grid-cols-2">
          {PRO_ATTRACTIONS.map((item) => {
            const checked = selected.includes(item.id);
            const disabled = !checked && selected.length >= PRO_BUNDLE_COUNT;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => toggle(item.id)}
                  aria-pressed={checked}
                  className={cn(
                    "flex w-full min-h-12 items-center gap-3 rounded-xl border px-4 py-3 text-start text-sm transition-colors",
                    checked
                      ? "border-brand-red/50 bg-brand-red/5 font-semibold text-foreground"
                      : "border-border bg-background hover:border-brand-red/30",
                    disabled && "cursor-not-allowed opacity-45",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-md border text-xs",
                      checked
                        ? "border-brand-red bg-brand-red text-white"
                        : "border-border bg-background",
                    )}
                    aria-hidden
                  >
                    {checked ? (
                      <span className="size-2 rounded-full bg-white" />
                    ) : null}
                  </span>
                  <span>
                    <span className="block">{item.name}</span>
                    <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                      {item.pitch}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={!ready}
        className={cn(
          "mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold sm:w-auto",
          ready
            ? "bg-brand-red text-white hover:bg-brand-red-light"
            : "pointer-events-none bg-muted text-muted-foreground",
        )}
      >
        {ready
          ? "שליחת בקשה בוואטסאפ"
          : remaining === PRO_BUNDLE_COUNT
            ? "בחרו שלוש אטרקציות"
            : `עוד ${remaining} לבחירה`}
      </a>
    </section>
  );
}
