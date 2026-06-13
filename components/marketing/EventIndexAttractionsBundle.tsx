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

  const waHref = buildWhatsAppHref({
    text: buildProducerBundleWhatsAppText(selectedItems.map((a) => a.name)),
    utm_source: "website",
    utm_campaign: "event_index_producer_bundle",
  });

  return (
    <section
      className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
      aria-labelledby="bundle-picker-heading"
    >
      <h2 id="bundle-picker-heading" className="font-serif text-xl font-semibold">
        בחרו {PRO_BUNDLE_COUNT} אטרקציות — מחיר מיוחד למפיקים
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {PRO_BUNDLE_COUNT}×{formatProPriceExVat(PRO_SINGLE_EX_VAT)} ={" "}
        {formatProPriceExVat(retailTotal)} — בחבילה:{" "}
        <span className="font-semibold text-brand-red">
          {formatProPriceExVat(PRO_BUNDLE_3_EX_VAT)}
        </span>{" "}
        (חיסכון {PRO_BUNDLE_3_SAVING_EX_VAT.toLocaleString("he-IL")} ₪ לפני מע״מ)
      </p>

      <ul className="mt-6 grid gap-2 sm:grid-cols-2">
        {PRO_ATTRACTIONS.map((item) => {
          const checked = selected.includes(item.id);
          const disabled = !checked && selected.length >= PRO_BUNDLE_COUNT;

          return (
            <li key={item.id}>
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
                  checked
                    ? "border-brand-red/50 bg-brand-red/5"
                    : "border-border bg-background hover:border-brand-red/30",
                  disabled && "cursor-not-allowed opacity-50",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggle(item.id)}
                  className="size-4 shrink-0 accent-brand-red"
                />
                <span className="text-lg" aria-hidden>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.name}</span>
              </label>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs text-muted-foreground">
        נבחרו {selected.length}/{PRO_BUNDLE_COUNT}
      </p>

      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={!ready}
        className={cn(
          "mt-6 inline-flex min-h-11 items-center rounded-xl px-6 py-3 text-sm font-semibold text-white",
          ready
            ? "bg-brand-red hover:bg-brand-red-light"
            : "pointer-events-none bg-muted-foreground/40",
        )}
      >
        {ready
          ? "שליחת בקשת חבילה בוואטסאפ"
          : `בחרו עוד ${PRO_BUNDLE_COUNT - selected.length} אטרקציות`}
      </a>
    </section>
  );
}
