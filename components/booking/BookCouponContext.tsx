"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  isCouponOfferExpired,
  resolveCouponByCode,
  sanitizeCouponParam,
  type ResolvedCouponOffer,
} from "@/lib/data/coupon-offers";

const LS_INVALID = "yc_coupon_invalid_attempts";
const MAX_INVALID = 5;
const BLOCK_MS = 10 * 60 * 1000;

type BookCouponContextValue = {
  offer: ResolvedCouponOffer | null;
  blocked: boolean;
};

const BookCouponContext = createContext<BookCouponContextValue>({
  offer: null,
  blocked: false,
});

function readInvalidBlock(): boolean {
  try {
    const raw = sessionStorage.getItem(LS_INVALID);
    if (!raw) return false;
    const { count, until } = JSON.parse(raw) as { count: number; until: number };
    if (Date.now() > until) {
      sessionStorage.removeItem(LS_INVALID);
      return false;
    }
    return count >= MAX_INVALID;
  } catch {
    return false;
  }
}

function recordInvalidAttempt(): void {
  try {
    const raw = sessionStorage.getItem(LS_INVALID);
    const prev = raw
      ? (JSON.parse(raw) as { count: number; until: number })
      : { count: 0, until: 0 };
    const count = prev.count + 1;
    const until = count >= MAX_INVALID ? Date.now() + BLOCK_MS : prev.until;
    sessionStorage.setItem(LS_INVALID, JSON.stringify({ count, until }));
  } catch {
    /* storage blocked */
  }
}

export function BookCouponProvider({
  couponParam,
  children,
}: {
  couponParam?: string | null;
  children: ReactNode;
}) {
  const [blocked, setBlocked] = useState(false);
  const [offer, setOffer] = useState<ResolvedCouponOffer | null>(null);

  useEffect(() => {
    setBlocked(readInvalidBlock());
    const code = sanitizeCouponParam(couponParam);
    if (!code) {
      if (couponParam?.trim()) recordInvalidAttempt();
      setOffer(null);
      return;
    }
    const resolved = resolveCouponByCode(code);
    if (!resolved || isCouponOfferExpired(resolved)) {
      recordInvalidAttempt();
      setOffer(null);
      return;
    }
    setOffer(resolved);
  }, [couponParam]);

  const value = useMemo(
    () => ({ offer: blocked ? null : offer, blocked }),
    [offer, blocked],
  );

  return (
    <BookCouponContext.Provider value={value}>{children}</BookCouponContext.Provider>
  );
}

export function useBookCoupon() {
  return useContext(BookCouponContext);
}
