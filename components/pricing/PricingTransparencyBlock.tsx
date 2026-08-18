"use client";

import {
  getPriceById,
  getPriceTransparencyById,
  type PriceItemId,
  type PriceTransparency,
} from "@/lib/data/pricing-catalog";
import { cn } from "@/lib/utils";

type PricingTransparencyBlockProps = {
  catalogId?: PriceItemId;
  transparency?: PriceTransparency;
  className?: string;
  compact?: boolean;
};

function listFromCatalogIds(ids: readonly PriceItemId[]): string[] {
  return ids.map((id) => getPriceById(id).label);
}

function renderLine(prefix: string, values: readonly string[]) {
  if (!values.length) return null;
  return (
    <p className="leading-relaxed">
      <span className="font-semibold text-foreground">{prefix}: </span>
      {values.join(" · ")}
    </p>
  );
}

export default function PricingTransparencyBlock({
  catalogId,
  transparency,
  className,
  compact = false,
}: PricingTransparencyBlockProps) {
  const resolved = transparency ?? (catalogId ? getPriceTransparencyById(catalogId) : null);
  if (!resolved) return null;

  const addons = listFromCatalogIds(resolved.addons);
  const textClass = compact ? "text-[0.7rem]" : "text-xs";
  const boxClass = compact
    ? "mt-2 rounded-lg border border-border/70 bg-background/60 px-2.5 py-2"
    : "mt-3 rounded-xl border border-border bg-background/70 px-3 py-3";

  return (
    <div className={cn(boxClass, textClass, "space-y-1.5 text-muted-foreground", className)}>
      {renderLine("כולל", resolved.included)}
      {renderLine("לא כלול", resolved.excluded)}
      {renderLine("תוספות אפשריות", addons)}
      {resolved.scopeNote ? (
        <p className="leading-relaxed text-foreground/85">{resolved.scopeNote}</p>
      ) : null}
    </div>
  );
}
