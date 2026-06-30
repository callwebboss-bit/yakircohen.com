import type { TierACategoryId } from "@/lib/book-wizard-cro/types";

export const PRICE_HOLD_MS = 48 * 60 * 60 * 1000;
export const STEP3_SOFT_HOLD_MS = 5 * 60 * 1000;
export const BOOK_EXIT_INTENT_SHOWN_KEY = "yc_book_exit_intent_shown";

export type CategoryPriceHold = {
  packageLabel: string;
  totalExVat: number;
  expiresAt: number;
};

function priceHoldKey(category: TierACategoryId): string {
  return `yc_${category}_price_hold`;
}

function step3HoldKey(category: TierACategoryId): string {
  return `yc_${category}_step3_hold_until`;
}

export function getWeeklySlotsRemaining(_category: TierACategoryId, now = new Date()): number {
  const start = new Date(now.getFullYear(), 0, 1);
  const week = Math.floor((now.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return 2 + (week % 4);
}

export function saveCategoryPriceHold(
  category: TierACategoryId,
  data: Pick<CategoryPriceHold, "packageLabel" | "totalExVat">,
): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    const payload: CategoryPriceHold = {
      ...data,
      expiresAt: Date.now() + PRICE_HOLD_MS,
    };
    sessionStorage.setItem(priceHoldKey(category), JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

export function readCategoryPriceHold(
  category: TierACategoryId,
  now = Date.now(),
): CategoryPriceHold | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(priceHoldKey(category));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CategoryPriceHold;
    if (
      !parsed?.packageLabel ||
      typeof parsed.totalExVat !== "number" ||
      typeof parsed.expiresAt !== "number"
    ) {
      return null;
    }
    if (parsed.expiresAt <= now) {
      sessionStorage.removeItem(priceHoldKey(category));
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function markBookExitIntentShown(): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(BOOK_EXIT_INTENT_SHOWN_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function wasBookExitIntentShown(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  try {
    return sessionStorage.getItem(BOOK_EXIT_INTENT_SHOWN_KEY) === "1";
  } catch {
    return false;
  }
}

export function ensureHoldDeadline(category: TierACategoryId, now = Date.now()): number {
  if (typeof sessionStorage === "undefined") return now + STEP3_SOFT_HOLD_MS;
  try {
    const key = step3HoldKey(category);
    const raw = sessionStorage.getItem(key);
    const parsed = raw ? Number(raw) : NaN;
    if (Number.isFinite(parsed) && parsed > now) return parsed;
    const next = now + STEP3_SOFT_HOLD_MS;
    sessionStorage.setItem(key, String(next));
    return next;
  } catch {
    return now + STEP3_SOFT_HOLD_MS;
  }
}

export function extendHoldDeadlineSoft(category: TierACategoryId, now = Date.now()): number {
  const next = now + STEP3_SOFT_HOLD_MS;
  if (typeof sessionStorage !== "undefined") {
    try {
      sessionStorage.setItem(step3HoldKey(category), String(next));
    } catch {
      /* ignore */
    }
  }
  return next;
}

/** @deprecated use category-specific helpers */
export const STUDIO_PRICE_HOLD_MS = PRICE_HOLD_MS;
export function getWeeklyStudioSlotsRemaining(now = new Date()): number {
  return getWeeklySlotsRemaining("studio", now);
}
export type StudioPriceHold = CategoryPriceHold;
export function saveStudioPriceHold(data: Pick<CategoryPriceHold, "packageLabel" | "totalExVat">) {
  saveCategoryPriceHold("studio", data);
}
export function readStudioPriceHold(now = Date.now()) {
  return readCategoryPriceHold("studio", now);
}
export function ensureStep3HoldDeadline(now = Date.now()) {
  return ensureHoldDeadline("studio", now);
}
