'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
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

const closeButtonClass =
  'absolute top-3 start-3 inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg p-2.5 text-gray-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white';

const ctaLinkClass =
  'coupon-cta-shimmer inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white font-bold text-gray-900 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 hover:scale-105 hover:bg-[var(--coupon-accent)] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white';

const couponBoxClass =
  'coupon-glass-card coupon-dashed rounded-xl px-5 py-3 flex flex-col items-center justify-center min-w-[160px] cursor-pointer transition-all duration-300 group/coupon';

function CouponHeadline({
  offer,
  className,
}: {
  offer: ResolvedCouponOffer;
  className?: string;
}) {
  const parts = offer.headline.match(/^הנחה של ₪(.+?) על (.+)$/);
  if (!parts) {
    return <h2 className={className}>{offer.headline}</h2>;
  }

  const [, amount, subject] = parts;
  return (
    <h2 className={className}>
      הנחה של{' '}
      <span className="text-[var(--coupon-accent)]">₪{amount}</span>
      {' '}על {subject}
    </h2>
  );
}

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

function subscribeNoop() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export default function CouponPopup() {
  const pathname = usePathname();

  const mounted = useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot);
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

  useEffect(() => {
    if (!visible) {
      delete document.documentElement.dataset.couponBanner;
      return undefined;
    }
    document.documentElement.dataset.couponBanner = 'open';
    return () => {
      delete document.documentElement.dataset.couponBanner;
    };
  }, [visible]);

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
      setToast('הקוד הועתק, יחול בקופה');
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

  async function handleCopyCoupon() {
    try {
      await navigator.clipboard.writeText(offer!.code);
      setToast('הקוד הועתק ללוח');
    } catch { /* clipboard blocked */ }
  }

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
        'fixed inset-x-0 bottom-0 z-[99990] text-white shadow-2xl transition-transform duration-300 will-change-transform',
        'max-md:rounded-t-2xl max-md:border-t max-md:border-white/15',
        'coupon-banner-premium',
        offer.themeClass,
        entered ? 'coupon-banner-enter' : 'coupon-banner-hidden',
      )}
      style={{
        transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
      }}
    >
      <button
        type="button"
        onClick={() => dismiss('close')}
        aria-label="סגור הטבה"
        className={closeButtonClass}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </button>

      <div className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 md:px-6 md:pb-[max(0.75rem,env(safe-area-inset-bottom))] md:pt-4">
        <div
          className="mx-auto mb-2 h-1 w-10 rounded-full bg-white/40 md:hidden"
          aria-hidden="true"
        />

        {/* Mobile: stacked bottom-sheet */}
        <div className="md:hidden">
          <div className="mb-2 flex items-center gap-2.5">
            <span
              className="rounded bg-[var(--coupon-accent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
            >
              {offer.seasonLabel}
            </span>
            <div className="h-px flex-1 bg-[var(--coupon-accent)]/30" aria-hidden="true" />
          </div>

          <CouponHeadline
            offer={offer}
            className="text-xl font-black leading-snug tracking-tight"
          />

          <p className="mt-1.5 text-xs leading-relaxed text-gray-400">
            <time dateTime={offer.validUntilIso}>{offer.validUntilHe}</time>
          </p>

          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyCoupon}
              className={cn(couponBoxClass, 'flex-1')}
            >
              <span className="text-[10px] text-gray-400">לחץ להעתקת הקוד</span>
              <span className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-widest text-white transition-colors group-hover/coupon:text-[var(--coupon-accent)]">
                  {offer.code}
                </span>
                <svg className="h-4 w-4 text-gray-400 transition-colors group-hover/coupon:text-[var(--coupon-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </span>
            </button>
          </div>

          <Link
            href={bookHref}
            rel="nofollow"
            onClick={handleCtaClick}
            className={cn(ctaLinkClass, 'mt-3 w-full px-4 py-3 text-sm')}
          >
            <span>{offer.ctaLabel}</span>
            <svg className="h-4 w-4 rtl:rotate-180" fill="currentColor" viewBox="0 0 20 20">
              <path clipRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" fillRule="evenodd" />
            </svg>
          </Link>
        </div>

        {/* Desktop: horizontal strip */}
        <div className="hidden md:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-8">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-3">
                <span
                  className="rounded bg-[var(--coupon-accent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                >
                  {offer.seasonLabel}
                </span>
                <div className="h-px w-12 bg-[var(--coupon-accent)]/50" aria-hidden="true" />
              </div>

              <CouponHeadline
                offer={offer}
                className="text-2xl font-black tracking-tight lg:text-3xl"
              />

              <p className="mt-1 max-w-2xl text-sm font-light text-gray-400">
                <time dateTime={offer.validUntilIso}>{offer.validUntilHe}</time>
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <button
                type="button"
                onClick={handleCopyCoupon}
                className={couponBoxClass}
              >
                <span className="mb-1 text-[10px] text-gray-400">לחץ להעתקת הקוד</span>
                <span className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-widest text-white transition-colors group-hover/coupon:text-[var(--coupon-accent)]">
                    {offer.code}
                  </span>
                  <svg className="h-4 w-4 text-gray-400 transition-colors group-hover/coupon:text-[var(--coupon-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                </span>
              </button>

              <Link
                href={bookHref}
                rel="nofollow"
                onClick={handleCtaClick}
                className={cn(ctaLinkClass, 'px-7 py-3.5 text-base')}
              >
                <span>{offer.ctaLabel}</span>
                <svg className="h-5 w-5 rtl:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                  <path clipRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" fillRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>

          <p className="mx-auto mt-2 max-w-7xl text-[0.65rem] leading-relaxed text-white/60">
            {offer.microCopy}
          </p>
        </div>
      </div>
    </aside>

    {toast ? (
      <div
        role="status"
        className="fixed start-4 end-4 z-[99991] mx-auto max-w-sm rounded-xl bg-gray-900 px-4 py-2.5 text-center text-sm text-white shadow-lg bottom-[calc(10rem+env(safe-area-inset-bottom,0px))] md:bottom-20"
      >
        {toast}
      </div>
    ) : null}
  </>
  );
}
