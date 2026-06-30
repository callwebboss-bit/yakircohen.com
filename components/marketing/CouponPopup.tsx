'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  COUPON_SCROLL_THRESHOLD,
  COUPON_E2E_ACTIVE_TIME_MS,
  getActiveTimeRequiredMs,
  LS_CLAIMED,
  LS_SNOOZE,
  reconcileCouponStorageState,
  shouldBlockCouponBanner,
  snoozeExpiresAt,
  SS_DISMISSED,
  SS_E2E_FAST,
} from '@/lib/coupon-banner-storage';
import {
  getCurrentSeason,
  isCouponPathAllowed,
  resolveCouponBookHref,
  resolveOfferForPath,
  type ResolvedCouponOffer,
} from '@/lib/data/coupon-offers';
import { trackConversion } from '@/lib/analytics/conversion-events';
import { cn } from '@/lib/utils';

const SCROLL_THROTTLE_MS = 200;
const SWIPE_DISMISS_PX = 80;

function lsGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

function lsSet(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* blocked */ }
}

function ssGet(key: string): string | null {
  try { return sessionStorage.getItem(key); } catch { return null; }
}

function ssSet(key: string, value: string): void {
  try { sessionStorage.setItem(key, value); } catch { /* blocked */ }
}

function shouldBlockBanner(): boolean {
  const claimed = lsGet(LS_CLAIMED) === 'true';
  const snoozeRaw = lsGet(LS_SNOOZE);
  const { clearSnooze } = reconcileCouponStorageState(claimed, snoozeRaw);
  if (clearSnooze) {
    try { localStorage.removeItem(LS_SNOOZE); } catch { /* */ }
  }
  return shouldBlockCouponBanner({
    claimed,
    snoozeUntilRaw: clearSnooze ? null : snoozeRaw,
    sessionDismissed: ssGet(SS_DISMISSED) === 'true',
  });
}

function scheduleIdle(cb: () => void): () => void {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(cb, { timeout: 1200 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(cb, 0);
  return () => window.clearTimeout(id);
}

function freezeAnalyticsPayload(
  params: Record<string, string | number | boolean>,
): Record<string, string | number | boolean> {
  return Object.freeze({ ...params });
}

export default function CouponPopup() {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [offer, setOffer] = useState<ResolvedCouponOffer | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [dragY, setDragY] = useState(0);
  const [entered, setEntered] = useState(false);

  const triggeredRef = useRef(false);
  const offerRef = useRef<ResolvedCouponOffer | null>(null);
  const activeMsRef = useRef(0);
  const lastTickRef = useRef(0);
  const scrollMetRef = useRef(false);
  const bannerRef = useRef<HTMLElement>(null);
  const touchStartY = useRef<number | null>(null);

  const pathAllowed = isCouponPathAllowed(pathname);

  const dismiss = useCallback((reason: 'close' | 'swipe') => {
    ssSet(SS_DISMISSED, 'true');
    lsSet(LS_SNOOZE, String(snoozeExpiresAt()));
    setVisible(false);
    trackConversion(
      'coupon_popup_close',
      freezeAnalyticsPayload({ reason, season: offerRef.current?.seasonKey ?? 'default' }),
    );
  }, []);

  const tryShow = useCallback((trigger: string) => {
    if (triggeredRef.current || !pathAllowed || shouldBlockBanner()) return;
    if (!scrollMetRef.current || activeMsRef.current < getActiveTimeRequiredMs()) return;

    const seasonKey = getCurrentSeason();
    const resolved = resolveOfferForPath(pathname ?? '/', seasonKey);
    if (!resolved) return;

    triggeredRef.current = true;
    offerRef.current = resolved;
    setOffer(resolved);
    setVisible(true);
    requestAnimationFrame(() => setEntered(true));

    trackConversion(
      'coupon_popup_show',
      freezeAnalyticsPayload({
        trigger,
        season: seasonKey,
        catalog_id: resolved.catalogId,
        amount_off: resolved.amountOffExVat,
      }),
    );
  }, [pathname, pathAllowed]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !pathAllowed || shouldBlockBanner()) return undefined;

    const e2eFast = ssGet(SS_E2E_FAST) === '1';
    let cancelled = false;

    if (e2eFast) {
      const id = window.setInterval(() => {
        if (cancelled) return;
        if (document.visibilityState === 'visible') {
          activeMsRef.current += 100;
        }
        if (
          scrollMetRef.current &&
          activeMsRef.current >= getActiveTimeRequiredMs() &&
          !triggeredRef.current
        ) {
          tryShow('engagement');
        }
      }, 100);
      return () => {
        cancelled = true;
        window.clearInterval(id);
      };
    }

    let rafId = 0;
    lastTickRef.current = performance.now();

    const tick = (now: number) => {
      if (cancelled) return;
      if (document.visibilityState === 'visible') {
        const delta = now - lastTickRef.current;
        if (delta > 0 && delta < 5000) {
          activeMsRef.current += delta;
        }
        const requiredMs = getActiveTimeRequiredMs();
        if (
          scrollMetRef.current &&
          activeMsRef.current >= requiredMs &&
          !triggeredRef.current
        ) {
          tryShow('engagement');
        }
      }
      lastTickRef.current = now;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [mounted, pathAllowed, tryShow]);

  useEffect(() => {
    if (!mounted || !pathAllowed || shouldBlockBanner()) return undefined;

    let cancelIdle: (() => void) | undefined;
    let lastScrollCheck = 0;

    cancelIdle = scheduleIdle(() => {
      const onScroll = () => {
        const now = Date.now();
        if (now - lastScrollCheck < SCROLL_THROTTLE_MS) return;
        lastScrollCheck = now;

        const doc = document.documentElement;
        const maxScroll = doc.scrollHeight - window.innerHeight;
        if (maxScroll <= 0) {
          scrollMetRef.current = true;
          return;
        }
        if (window.scrollY / maxScroll >= COUPON_SCROLL_THRESHOLD) {
          scrollMetRef.current = true;
          if (ssGet(SS_E2E_FAST) === '1') {
            activeMsRef.current = COUPON_E2E_ACTIVE_TIME_MS;
          }
        }
      };

      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      cancelIdle = () => window.removeEventListener('scroll', onScroll);
    });

    return () => cancelIdle?.();
  }, [mounted, pathAllowed]);

  useEffect(() => {
    if (!mounted) return undefined;
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_SNOOZE || e.key === LS_CLAIMED || e.key === null) {
        if (shouldBlockBanner()) setVisible(false);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [mounted]);

  useEffect(() => {
    if (!visible) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss('close');
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible, dismiss]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(id);
  }, [toast]);

  async function handleCtaClick() {
    if (!offer) return;
    lsSet(LS_CLAIMED, 'true');

    trackConversion(
      'coupon_popup_cta_click',
      freezeAnalyticsPayload({
        season: offer.seasonKey,
        coupon_code: offer.code,
        catalog_id: offer.catalogId,
        amount_off: offer.amountOffExVat,
      }),
    );

    try {
      await navigator.clipboard.writeText(offer.code);
      setToast('הקוד הועתק — יחול בקופה');
    } catch {
      setToast('ממשיכים להזמנה');
    }
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0]?.clientY ?? null;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (touchStartY.current === null) return;
    const dy = (e.touches[0]?.clientY ?? 0) - touchStartY.current;
    if (dy > 0) setDragY(dy);
  }

  function onTouchEnd() {
    if (dragY >= SWIPE_DISMISS_PX) {
      dismiss('swipe');
    }
    setDragY(0);
    touchStartY.current = null;
  }

  if (!mounted || !visible || !offer) return null;

  const bookHref = resolveCouponBookHref(offer);

  return (
  <>
    <aside
      ref={bannerRef}
      data-testid="coupon-seasonal-banner"
      aria-label="הטבה עונתית זמנית"
      dir="rtl"
      data-promo-code={offer.code}
      data-promo-value={String(offer.amountOffExVat)}
      data-promo-currency="ILS"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={cn(
        'fixed inset-x-0 z-[99990] text-white shadow-lg transition-transform duration-300 will-change-transform',
        'bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:bottom-0',
        offer.themeClass,
        entered ? 'coupon-banner-enter' : 'coupon-banner-hidden',
      )}
      style={{
        transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
      }}
    >
      <div className="px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
          {offer.icon ? (
            <span className="text-xl leading-none" aria-hidden="true">
              {offer.icon}
            </span>
          ) : null}

          <div className="min-w-0 flex-1 text-sm leading-snug">
            <p className="font-semibold">{offer.headline}</p>
            <p className="mt-0.5 text-xs opacity-90">
              קוד: <strong className="tracking-wide">{offer.code}</strong>
            </p>
            <p className="mt-1 text-[0.7rem] leading-relaxed opacity-85">
              <time dateTime={offer.validUntilIso}>{offer.validUntilHe}</time>
            </p>
            {offer.entityLine ? (
              <p className="mt-1 text-[0.65rem] opacity-75">{offer.entityLine}</p>
            ) : null}
          </div>

          <Link
            href={bookHref}
            rel="nofollow"
            onClick={handleCtaClick}
            className="coupon-cta-shimmer inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-gray-900 shadow transition hover:-translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:text-sm"
          >
            {offer.ctaLabel}
          </Link>

          <button
            type="button"
            onClick={() => dismiss('close')}
            aria-label="סגור הטבה"
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg p-3 text-lg leading-none text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            ✕
          </button>
        </div>

        <p className="mt-2 text-[0.65rem] leading-relaxed text-white/70">
          {offer.microCopy}
        </p>
      </div>
    </aside>

    {toast ? (
      <div
        role="status"
        className="fixed start-4 end-4 z-[99991] mx-auto max-w-sm rounded-xl bg-gray-900 px-4 py-2.5 text-center text-sm text-white shadow-lg bottom-[calc(7.5rem+env(safe-area-inset-bottom,0px))] md:bottom-20"
      >
        {toast}
      </div>
    ) : null}
  </>
  );
}
