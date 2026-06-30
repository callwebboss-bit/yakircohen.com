"use client";

import { useState, useSyncExternalStore } from "react";
import type { TierACategoryId } from "@/lib/book-wizard-cro/types";
import { readCategoryPriceHold } from "@/lib/book-wizard-cro/urgency";

function subscribeNoop() {
  return () => {};
}

/** Avoids hydration mismatch — server snapshot is always null. */
export function usePriceHoldBadge(
  category: TierACategoryId,
  badgeLabel: string,
): [string | null, (label: string | null) => void] {
  const [manual, setManual] = useState<string | null | undefined>(undefined);

  const fromStorage = useSyncExternalStore(
    subscribeNoop,
    () => (readCategoryPriceHold(category) ? badgeLabel : null),
    () => null,
  );

  const label = manual !== undefined ? manual : fromStorage;
  return [label, setManual];
}
