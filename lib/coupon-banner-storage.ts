import { COUPON_SNOOZE_MS } from "@/lib/data/coupon-offers";

export { COUPON_SNOOZE_MS };

export const LS_CLAIMED = "yc_coupon_claimed";
export const LS_SNOOZE = "yc_coupon_snooze";
export const SS_DISMISSED = "yc_coupon_dismissed";
export const SS_E2E_FAST = "yc_coupon_e2e";

export const COUPON_ACTIVE_TIME_MS = 40_000;
export const COUPON_E2E_ACTIVE_TIME_MS = 800;
export const COUPON_SCROLL_THRESHOLD = 0.35;

export function getActiveTimeRequiredMs(now = Date.now()): number {
  if (typeof window === "undefined") return COUPON_ACTIVE_TIME_MS;
  try {
    if (sessionStorage.getItem(SS_E2E_FAST) === "1") return COUPON_E2E_ACTIVE_TIME_MS;
  } catch {
    /* storage blocked */
  }
  return COUPON_ACTIVE_TIME_MS;
}

export function parseSnoozeUntil(raw: string | null): number | null {
  if (!raw) return null;
  const until = Number(raw);
  return Number.isNaN(until) ? null : until;
}

export function isSnoozedAt(
  snoozeUntilRaw: string | null,
  now = Date.now(),
): boolean {
  const until = parseSnoozeUntil(snoozeUntilRaw);
  if (until === null) return false;
  return now < until;
}

export function snoozeExpiresAt(now = Date.now()): number {
  return now + COUPON_SNOOZE_MS;
}

export function shouldBlockCouponBanner(state: {
  claimed: boolean;
  snoozeUntilRaw: string | null;
  sessionDismissed: boolean;
  now?: number;
}): boolean {
  if (state.claimed) return true;
  if (state.sessionDismissed) return true;
  return isSnoozedAt(state.snoozeUntilRaw, state.now);
}

export function reconcileCouponStorageState(
  claimed: boolean,
  snoozeUntilRaw: string | null,
): { clearSnooze: boolean } {
  if (claimed && isSnoozedAt(snoozeUntilRaw)) {
    return { clearSnooze: true };
  }
  return { clearSnooze: false };
}
