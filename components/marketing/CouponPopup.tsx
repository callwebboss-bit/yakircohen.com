'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { buildWhatsAppHref } from '@/lib/whatsapp';
import { CONTACT_PHONE_WHATSAPP } from '@/lib/constants';
import { trackConversion } from '@/lib/analytics/conversion-events';

// Types

type SeasonKey = 'default' | 'summer' | 'wedding' | 'rosh';
type ServiceKey = 'studio' | 'podcast' | 'events' | 'other';

interface SeasonConfig {
  code: string;
  discount: string;
  text: string;
  icon: string;
  color: string;
  gradient: string;
}

// Config

const SEASONS: Record<SeasonKey, SeasonConfig> = {
  default: {
    code: 'YAKIR10', discount: '10%',
    text: '10% הנחה על כל השירותים', icon: '🎁',
    color: '#25d366', gradient: 'linear-gradient(135deg,#25d366,#20b958)',
  },
  summer: {
    code: 'YAKIRSUMMER', discount: '15%',
    text: '15% הנחה לקיץ!', icon: '☀️',
    color: '#e07b00', gradient: 'linear-gradient(135deg,#ff9500,#ff6b35)',
  },
  wedding: {
    code: 'YAKIRHATUNA', discount: '12%',
    text: '12% הנחה לחתונות!', icon: '💍',
    color: '#8e44ad', gradient: 'linear-gradient(135deg,#9b59b6,#8e44ad)',
  },
  rosh: {
    code: 'YAKIRSHANA', discount: '15%',
    text: '15% הנחה לשנה החדשה!', icon: '🍎',
    color: '#c0392b', gradient: 'linear-gradient(135deg,#e74c3c,#c0392b)',
  },
};

const SERVICES: { key: ServiceKey; label: string; icon: string; waText: string }[] = [
  { key: 'studio',  label: 'אולפן',   icon: '🎙️', waText: 'הקלטות באולפן' },
  { key: 'podcast', label: 'פודקאסט', icon: '🎧', waText: 'הפקת פודקאסט' },
  { key: 'events',  label: 'אירועים', icon: '🎉', waText: 'אירועים ו-DJ' },
  { key: 'other',   label: 'אחר',     icon: '✨', waText: 'שירות' },
];

// Constants

const EXCLUDED_PATHS = ['/book', '/contact'];
const LS_SEEN    = 'yc_coupon_seen';
const LS_CLAIMED = 'yc_coupon_claimed';
const LS_VARIANT = 'yc_coupon_variant';
const LS_EXPIRY  = 'yc_coupon_expiry';
const EXPIRY_MS  = 48 * 60 * 60 * 1000;
const TRIGGER_DELAY_MS = 18_000;
const SCROLL_THRESHOLD = 0.6;

// Helpers

function lsGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* storage blocked */ }
}

function getIsraelDate() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }));
}

function getCurrentSeason(): SeasonKey {
  const now = getIsraelDate();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  if ((month === 9 || month === 10) && day >= 15) return 'rosh';
  if (month >= 6 && month <= 8) return 'summer';
  if (month === 5 && day > 10) return 'wedding';
  return 'default';
}

function getOrAssignVariant(): number {
  const stored = lsGet(LS_VARIANT);
  if (stored !== null) return Number(stored);
  const v = Math.floor(Math.random() * 3);
  lsSet(LS_VARIANT, String(v));
  return v;
}

function getOrCreateExpiry(): number {
  const stored = lsGet(LS_EXPIRY);
  if (stored) return Number(stored);
  const exp = Date.now() + EXPIRY_MS;
  lsSet(LS_EXPIRY, String(exp));
  return exp;
}

function msToHMS(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Component

export default function CouponPopup() {
  const pathname = usePathname();

  const [visible, setVisible]   = useState(false);
  const [step, setStep]         = useState<1 | 2>(1);
  const [timeLeft, setTimeLeft] = useState('48:00:00');
  const [season, setSeason]     = useState<SeasonConfig>(SEASONS.default);
  const [variant, setVariant]   = useState(0);

  const triggeredRef = useRef(false);
  const variantRef   = useRef(0);
  const seasonKeyRef = useRef<SeasonKey>('default');
  const ctaBtnRef    = useRef<HTMLButtonElement>(null);

  const isExcluded = EXCLUDED_PATHS.some(p => pathname?.startsWith(p));

  // Countdown - always ticking so the number is correct before popup shows
  useEffect(() => {
    if (isExcluded) return;
    const expiry = getOrCreateExpiry();
    setTimeLeft(msToHMS(expiry - Date.now()));
    const id = setInterval(() => setTimeLeft(msToHMS(expiry - Date.now())), 1000);
    return () => clearInterval(id);
  }, [isExcluded]);

  // Trigger logic - runs once per mount
  useEffect(() => {
    if (isExcluded) return;

    function tryShow(trigger: string) {
      if (triggeredRef.current) return;
      if (lsGet(LS_CLAIMED) === 'true' || lsGet(LS_SEEN) === 'true') return;

      triggeredRef.current = true;
      const sk = getCurrentSeason();
      const v  = getOrAssignVariant();
      seasonKeyRef.current = sk;
      variantRef.current   = v;

      lsSet(LS_SEEN, 'true');
      setSeason(SEASONS[sk]);
      setVariant(v);
      setVisible(true);

      trackConversion('coupon_popup_show', { variant: v, trigger, season: sk });
      setTimeout(() => ctaBtnRef.current?.focus(), 650);
    }

    const timeoutId = setTimeout(() => tryShow('timeout'), TRIGGER_DELAY_MS);

    const onScroll = () => {
      if (window.scrollY > window.innerHeight * SCROLL_THRESHOLD) tryShow('scroll');
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 50) tryShow('exit_intent');
    };
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isExcluded]); // eslint-disable-line react-hooks/exhaustive-deps

  // Escape key - re-registers when visibility or step changes
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        trackConversion('coupon_popup_close', { variant: variantRef.current, step });
        setVisible(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible, step]);

  if (!visible) return null;

  // Handlers

  function handleClose() {
    trackConversion('coupon_popup_close', { variant: variantRef.current, step });
    setVisible(false);
  }

  function handleSelectService(key: ServiceKey) {
    const svc = SERVICES.find(s => s.key === key)!;
    lsSet(LS_CLAIMED, 'true');

    trackConversion('coupon_popup_cta_click', {
      variant: variantRef.current,
      season: seasonKeyRef.current,
      service: key,
      coupon_code: season.code,
    });

    const waText =
      `היי יקיר 👋\n` +
      `יש לי קופון *${season.code}* (${season.discount}) - ${season.text}\n` +
      `מעוניין ב${svc.waText}`;

    const href = buildWhatsAppHref({
      text: waText,
      utm_source: 'website',
      utm_campaign: `coupon_popup_v${variantRef.current}_${seasonKeyRef.current}`,
      phone: CONTACT_PHONE_WHATSAPP,
    });

    setVisible(false);
    setTimeout(() => window.open(href, '_blank'), 400);
  }

  // Render: Variant 1 - Thin bottom banner

  if (variant === 1) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label={season.text}
        dir="rtl"
        className="fixed bottom-0 inset-x-0 z-[99999] anim-slide"
        style={{ background: season.gradient }}
      >
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 text-white">
          <span className="text-2xl" role="img" aria-hidden="true">{season.icon}</span>

          <div className="flex-1 min-w-0 text-sm font-semibold">
            {season.text}
            <span className="mx-2 opacity-60">·</span>
            קוד: <strong className="tracking-wide">{season.code}</strong>
            <span className="mx-2 opacity-60">·</span>
            <span className="tabular-nums opacity-75">⏱ {timeLeft}</span>
          </div>

          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              className="shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-bold text-gray-900 shadow transition hover:-translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              לממש
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
              {SERVICES.map(svc => (
                <button
                  key={svc.key}
                  onClick={() => handleSelectService(svc.key)}
                  className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-gray-900 shadow transition hover:-translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {svc.icon} {svc.label}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handleClose}
            aria-label="סגור"
            className="shrink-0 px-1 text-xl leading-none text-white/70 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
          >
            ✕
          </button>
        </div>
        <style>{ANIM_STYLES}</style>
      </div>
    );
  }

  // Render: Variant 0 (bottom-right card) and Variant 2 (center modal)

  const isCenter = variant === 2;

  return (
    <>
      {/* Backdrop - variant 2 only */}
      {isCenter && (
        <div
          className="fixed inset-0 z-[99998] bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="coupon-popup-title"
        dir="rtl"
        className={[
          'fixed z-[99999] overflow-hidden rounded-[20px] text-white shadow-2xl',
          isCenter
            ? 'top-1/2 -translate-y-1/2 inset-x-0 mx-auto max-w-[420px] w-[calc(100%-2rem)] anim-fade'
            : 'bottom-5 start-5 max-w-[360px] w-[calc(100%-2.5rem)] max-sm:bottom-3 max-sm:start-3 anim-slide',
        ].join(' ')}
        style={{ background: season.gradient }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="סגור פופאפ"
          className="absolute end-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg leading-none transition hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          ✕
        </button>

        {/* Step 1: Offer */}
        {step === 1 && (
          <div className="p-6 text-center">
            <div className="mb-2 text-5xl" role="img" aria-hidden="true">{season.icon}</div>
            <h3 id="coupon-popup-title" className="mb-2 text-xl font-bold leading-snug">
              מתנה מיוחדת בשבילך!
            </h3>
            <p className="mb-4 text-sm leading-relaxed opacity-90">{season.text}</p>

            {/* Coupon box */}
            <div className="mb-4 rounded-xl bg-white/95 p-4 text-gray-900">
              <div className="mb-1 text-xs font-medium text-gray-500">הקוד שלך</div>
              <div
                className="rounded-lg border-2 border-dashed px-4 py-2 text-xl font-bold tracking-widest"
                style={{ borderColor: season.color }}
              >
                {season.code}
              </div>
              <div
                className="mt-2 text-xs font-semibold tabular-nums"
                style={{ color: season.color }}
              >
                תקף עוד: {timeLeft}
              </div>
            </div>

            <button
              ref={ctaBtnRef}
              onClick={() => setStep(2)}
              className="w-full rounded-xl bg-white px-5 py-3.5 text-base font-bold text-gray-900 shadow-lg transition hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              בחר שירות וקבל הנחה
            </button>

            <p className="mt-3 text-xs opacity-70">אישור מיידי · שירות מקצועי · ללא התחייבות</p>
          </div>
        )}

        {/* Step 2: Service selection */}
        {step === 2 && (
          <div className="p-6 text-center">
            <h3 id="coupon-popup-title" className="mb-4 text-lg font-bold">
              איזה שירות מעניין אותך?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {SERVICES.map((svc, i) => (
                <button
                  key={svc.key}
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus={i === 0}
                  onClick={() => handleSelectService(svc.key)}
                  className="flex flex-col items-center gap-1.5 rounded-xl bg-white/95 px-3 py-4 text-sm font-semibold text-gray-900 shadow-sm transition hover:scale-[1.04] active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span className="text-2xl" role="img" aria-hidden="true">{svc.icon}</span>
                  {svc.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(1)}
              className="mt-4 rounded text-xs underline opacity-70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              חזרה
            </button>
          </div>
        )}

        <style>{ANIM_STYLES}</style>
      </div>
    </>
  );
}

const ANIM_STYLES = `
  @keyframes popupSlide {
    from { opacity:0; transform:scale(0.82) translateY(40px); }
    to   { opacity:1; transform:scale(1)    translateY(0);    }
  }
  @keyframes popupFade {
    from { opacity:0; transform:scale(0.9); }
    to   { opacity:1; transform:scale(1);   }
  }
  .anim-slide { animation: popupSlide 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .anim-fade  { animation: popupFade  0.4s ease forwards; }
`;
