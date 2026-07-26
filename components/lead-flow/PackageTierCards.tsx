"use client";

import type { PackageTierId } from "@/lib/data/lead-flow/packages";
import { ECONOMY_WARNING, PACKAGE_TIERS } from "@/lib/data/lead-flow/packages";
import type { LeadFlowServiceId } from "@/lib/data/lead-flow/services";
import { formatLeadFlowPrice } from "@/lib/data/lead-flow/resolve-price";

type TierPrice = {
  tierId: PackageTierId;
  exVat: number | null;
};

type PackageTierCardsProps = {
  serviceId: LeadFlowServiceId;
  prices: readonly TierPrice[];
  selectedTier: PackageTierId | null;
  revealed: boolean;
  onReveal: () => void;
  onSelect: (tierId: PackageTierId) => void;
};

export default function PackageTierCards({
  serviceId,
  prices,
  selectedTier,
  revealed,
  onReveal,
  onSelect,
}: PackageTierCardsProps) {
  const tiers = PACKAGE_TIERS[serviceId];

  if (!revealed) {
    return (
      <button
        type="button"
        onClick={onReveal}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-brand-red px-6 text-base font-semibold text-white sm:w-auto"
      >
        הצג מחיר
      </button>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {(["full", "adapted", "economy"] as const).map((tierId) => {
        const def = tiers[tierId];
        const price = prices.find((p) => p.tierId === tierId);
        const display = formatLeadFlowPrice(price?.exVat ?? null);
        const selected = selectedTier === tierId;

        return (
          <li key={tierId}>
            <button
              type="button"
              onClick={() => onSelect(tierId)}
              aria-pressed={selected}
              className={`flex min-h-12 w-full flex-col rounded-xl border p-5 text-start transition-colors ${
                selected
                  ? "border-brand-red bg-brand-red/5 ring-2 ring-brand-red"
                  : "border-border bg-surface hover:border-brand-red/40"
              }`}
            >
              <span className="font-serif text-lg font-semibold text-foreground">
                {def.title}
              </span>
              <span className="mt-2 text-sm text-muted-foreground">{def.summary}</span>
              <span className="mt-4 text-base font-semibold text-foreground">
                {display.exVatLabel}
              </span>
              {!display.isFallback ? (
                <span className="mt-1 text-xs text-muted-foreground">
                  כולל מע״מ: {display.withVatLabel}
                </span>
              ) : null}
              {tierId === "economy" ? (
                <span className="mt-3 inline-flex rounded-md border border-amber-600/40 bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-900 dark:text-amber-100">
                  אזהרה: {ECONOMY_WARNING}
                </span>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
