"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "yc_event_index_supplier_prices";

export type SupplierPriceMap = Record<string, number | null>;

function readPrices(): SupplierPriceMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const out: SupplierPriceMap = {};
    for (const [key, val] of Object.entries(parsed)) {
      if (typeof val === "number" && Number.isFinite(val)) out[key] = val;
      else if (val === null) out[key] = null;
    }
    return out;
  } catch {
    return {};
  }
}

function writePrices(prices: SupplierPriceMap): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prices));
  } catch {
    /* quota / private mode */
  }
}

/**
 * Persists per-attraction supplier prices the producer enters for comparison.
 */
export function useSupplierPriceDraft() {
  const hydrated = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [prices, setPrices] = useState<SupplierPriceMap>({});

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    queueMicrotask(() => setPrices(readPrices()));
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => writePrices(prices), 300);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [prices]);

  const setPrice = useCallback((attractionId: string, value: number | null) => {
    setPrices((prev) => ({ ...prev, [attractionId]: value }));
  }, []);

  const clearPrices = useCallback(() => {
    setPrices({});
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return { prices, setPrice, clearPrices };
}
