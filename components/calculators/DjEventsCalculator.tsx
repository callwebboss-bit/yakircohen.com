"use client";

import { useCallback, useMemo, useState } from "react";
import BookingPaymentTrust from "@/components/booking/BookingPaymentTrust";
import CalculatorStickyBar from "@/components/calculators/CalculatorStickyBar";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import { formatCurrency } from "@/components/calculators/formatCurrency";
import {
  BOOKING_CTA,
  BOOKING_CONSULT_15_MIN,
  BOOKING_SUMMARY_INTRO,
} from "@/lib/data/booking-shared";
import {
  buildBookingWhatsAppBody,
  buildConsultWhatsAppHref,
  readUtmSource,
} from "@/lib/booking-messages";
import { STUDIO_ONE_HOUR_NIS } from "@/lib/data/pricing";
import {
  formatPhoneForDisplay,
  sanitizeLeadText,
  validateDjReserve,
} from "@/lib/form-validation";
import { notifyLeadByEmail } from "@/lib/lead-email-notify";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/* ─── Data ──────────────────────────────────────────────────────────────────── */

const FESTIVAL_PACKAGE = {
  id: "festival",
  name: 'חבילת "פסטיבל"  -  הכל כלול',
  sub: "DJ + אולפן נייד + 3 אטרקציות + פסקול כניסה + מצגת  -  אירוע שלם",
  price: 15000,
  includes: [
    "DJ פרימיום מהצוות (5 שעות)",
    "אולפן הקלטות נייד באירוע",
    "3 אטרקציות אפקטים לבחירה",
    "פסקול כניסה + קריינות דרמטית",
    "מצגת תמונות קולנועית",
    "סרטון מעוצב מכל אטרקציה",
    "טכנאי צמוד + ציוד מלא",
  ],
} as const;

const DJ_OPTIONS = [
  {
    id: "dj_team",
    name: "DJ פרימיום מהצוות",
    sub: "DJ מנוסה מצוות יקיר כהן הפקות · 4 שעות",
    price: 5000,
    badge: null as string | null,
    features: ["מערכת הגברה מקצועית", "תאורה בסיסית", "4 שעות ניהול רחבה", "סרטון מהרחבה"],
  },
  {
    id: "dj_yakir",
    name: "DJ יקיר כהן אישית",
    sub: "יקיר כהן על הקונסולה  -  חוויה אחרת · 5 שעות",
    price: 9800,
    badge: "VIP",
    features: ["ציוד הגברה פרימיום", "תאורה מקצועית", "5 שעות ניהול רחבה", "סרטון מהרחבה"],
  },
] as const;

const STAR_OPTIONS = [
  {
    id: "star_team",
    name: '"רגע של כוכב" עם הצוות',
    sub: "ביצוע על הבמה עם פלייבק מקצועי",
    price: 5000,
    badge: null as string | null,
  },
  {
    id: "star_yakir",
    name: '"רגע של כוכב" עם יקיר כהן',
    sub: "יקיר כהן מנחה ומלווה מאחורי הקלעים",
    price: 8000,
    badge: "VIP",
  },
] as const;

const ADDONS = [
  { id: "studio_mobile", name: "אולפן נייד באירוע", sub: "אולפן הקלטות נייד  -  מיקרופונים, עריכה, קובץ לכל אורח", price: 5000, icon: "🎤" },
  { id: "entry", name: "פסקול כניסה + קריינות דרמטית", sub: "כניסה שלא שוכחים  -  הפקה מראש + תיאום עם ה-DJ", price: 980, icon: "🎬" },
  { id: "slideshow", name: "מצגת תמונות קולנועית", sub: "סיפור ויזואלי מרגש  -  רץ שקט על המסך כל הערב", price: 750, icon: "🖼️" },
  { id: "led", name: "עמדת LED לאירועים", sub: "תאורה דקורטיבית / הקרנת לוגו  -  שדרוג ויזואלי", price: 1750, icon: "💡" },
  { id: "drummer", name: "מתופף אלקטרוני מקצועי", sub: "ליווי מוזיקלי חי לרחבה, ללא הגברה", price: 1500, icon: "🥁" },
  { id: "record_song", name: "הקלטת שיר באולפן", sub: "מחיר מיוחד ללקוחות אירועים  -  כולל תיקון קול + קובץ", price: STUDIO_ONE_HOUR_NIS, icon: "🎵" },
] as const;

const EFFECTS = [
  { id: "smoke", name: "עשן כבד", sub: "מכונות בלעדיות, עד 4 דקות", icon: "💨", price: 1500 },
  { id: "bubbles_smoke", name: "בועות סבון עשן", sub: 'הלהיט של העונה  -  מצטלם מדהים', icon: "🫧", price: 1500, badge: "היט" },
  { id: "balloons", name: "בלונים ענקיים", sub: "6 בלוני ענק לרחבה, ברגע שיא", icon: "🎈", price: 1500 },
  { id: "sparklers", name: "זיקוקים קרים", sub: "רגע קסום של אש קרה  -  ניצוצות לבנים", icon: "❄️", price: 1500 },
  { id: "confetti", name: "תותח קונפטי", sub: "פיצוץ צבעוני ברגע השיא", icon: "🎊", price: 1500 },
  { id: "color_smoke", name: "עשן צבעוני", sub: "תותחי צבע ברחבה", icon: "🌈", price: 1500 },
  { id: "foam", name: "תותח קצף", sub: "מושלם לפעילות ילדים וסוף לילה", icon: "🧴", price: 1500 },
] as const;

type EffectId = typeof EFFECTS[number]["id"];
type DjId = typeof DJ_OPTIONS[number]["id"];
type StarId = typeof STAR_OPTIONS[number]["id"];
type AddonId = typeof ADDONS[number]["id"];

const EFFECT_SINGLE = 1500;
const EFFECT_BUNDLE_3 = 3540;

function calcEffectTotal(selected: Set<EffectId>): { total: number; discount: number } {
  const count = selected.size;
  if (count === 0) return { total: 0, discount: 0 };
  const bundlesOf3 = Math.floor(count / 3);
  const remainder = count % 3;
  const bundleDiscount = bundlesOf3 * (3 * EFFECT_SINGLE - EFFECT_BUNDLE_3);
  return {
    total: bundlesOf3 * EFFECT_BUNDLE_3 + remainder * EFFECT_SINGLE,
    discount: bundleDiscount,
  };
}

/* ─── Sub-components ─────────────────────────────────────────────────────────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 flex items-center gap-3 text-base font-bold text-foreground">
      {children}
      <span className="h-px flex-1 bg-border" />
    </h3>
  );
}

function ExclusiveCard({
  name, sub, price, badge, selected, onClick,
}: {
  name: string; sub: string; price: number; badge: string | null; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex w-full flex-col items-start gap-2 rounded-2xl border p-5 text-start shadow-sm",
        "transition-[border-color,box-shadow,background-color] duration-fast ease-luxury",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
        selected
          ? "border-brand-red bg-brand-red/5 shadow-[0_4px_16px_rgba(212,43,43,0.12)]"
          : "border-border bg-background hover:border-brand-red/30",
      )}
      aria-pressed={selected}
    >
      {badge && (
        <span className="absolute -top-3 right-4 rounded-full bg-brand-red px-3 py-0.5 text-xs font-bold text-white">
          {badge}
        </span>
      )}
      <div className="flex w-full items-start justify-between gap-3">
        <span className="text-sm font-bold text-foreground">{name}</span>
        <span
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            selected ? "border-brand-red bg-brand-red" : "border-muted-foreground/40",
          )}
          aria-hidden
        >
          {selected && (
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
              <polyline points="1,3 3,5.5 7,0.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">{sub}</p>
      <p className="text-xl font-bold text-brand-red">{formatCurrency(price)}</p>
    </button>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */

type FormState = { name: string; phone: string; date: string; location: string };

function isDjReserveFormValid(form: FormState): boolean {
  return validateDjReserve(form).ok;
}

export default function DjEventsCalculator({ className }: { className?: string }) {
  const [festivalSelected, setFestivalSelected] = useState(false);
  const [djId, setDjId] = useState<DjId | null>(null);
  const [starId, setStarId] = useState<StarId | null>(null);
  const [addons, setAddons] = useState<Set<AddonId>>(new Set());
  const [effects, setEffects] = useState<Set<EffectId>>(new Set());
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    date: "",
    location: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { honeypot, setHoneypot, globalError, attemptSubmit } = useLeadFormGuard({
    formId: "dj_events_calculator",
  });

  const toggleAddon = (id: AddonId) =>
    setAddons((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const toggleEffect = (id: EffectId) =>
    setEffects((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const toggleFestival = () => {
    setFestivalSelected((v) => {
      if (!v) {
        setDjId(null);
        setStarId(null);
        setAddons(new Set());
        setEffects(new Set());
      }
      return !v;
    });
  };

  const djPrice = djId ? DJ_OPTIONS.find((d) => d.id === djId)!.price : 0;
  const starPrice = starId ? STAR_OPTIONS.find((s) => s.id === starId)!.price : 0;
  const addonTotal = [...addons].reduce((acc, id) => acc + ADDONS.find((a) => a.id === id)!.price, 0);
  const { total: effectTotal, discount: effectDiscount } = calcEffectTotal(effects);

  const grandTotal = festivalSelected
    ? FESTIVAL_PACKAGE.price
    : djPrice + starPrice + addonTotal + effectTotal;

  const today = new Date().toISOString().split("T")[0];

  const buildSummaryLines = () => {
    const lines: { label: string; value: string }[] = [];
    if (form.date) lines.push({ label: "תאריך", value: form.date });
    if (form.location.trim()) {
      lines.push({ label: "מיקום", value: sanitizeLeadText(form.location, 120) });
    }
    if (festivalSelected) {
      lines.push({
        label: "חבילה",
        value: `${FESTIVAL_PACKAGE.name} (${formatCurrency(FESTIVAL_PACKAGE.price)})`,
      });
    } else {
      if (djId) {
        const dj = DJ_OPTIONS.find((d) => d.id === djId)!;
        lines.push({ label: "DJ", value: `${dj.name} (${formatCurrency(dj.price)})` });
      }
      if (starId) {
        const star = STAR_OPTIONS.find((s) => s.id === starId)!;
        lines.push({ label: "רגע של כוכב", value: `${star.name} (${formatCurrency(star.price)})` });
      }
      addons.forEach((id) => {
        const a = ADDONS.find((x) => x.id === id)!;
        lines.push({ label: "תוספת", value: `${a.name} (${formatCurrency(a.price)})` });
      });
      if (effects.size > 0) {
        lines.push({
          label: "אפקטים",
          value: [...effects]
            .map((id) => EFFECTS.find((x) => x.id === id)?.name)
            .filter(Boolean)
            .join(", "),
        });
      }
      if (effectDiscount > 0) {
        lines.push({ label: "חיסכון אפקטים", value: `-${formatCurrency(effectDiscount)}` });
      }
    }
    return lines;
  };

  const consultHref = useMemo(() => {
    const displayPhone = form.phone.trim()
      ? formatPhoneForDisplay(form.phone.trim())
      : "";
    return buildConsultWhatsAppHref(buildSummaryLines(), {
      name: sanitizeLeadText(form.name, 60),
      phone: displayPhone,
    });
  }, [form, festivalSelected, djId, starId, addons, effects, effectDiscount]);

  const hasSelection = grandTotal > 0;
  const formValid = isDjReserveFormValid(form);
  const canReserve = hasSelection && formValid;

  const handleAction = useCallback(
    (intent: "continue_chat" | "start_now") => {
      if (!hasSelection) return;
      const errs = attemptSubmit(
        () => validateDjReserve(form),
        (result) => {
          const displayPhone = result.normalizedPhone
            ? formatPhoneForDisplay(result.normalizedPhone)
            : form.phone.trim();
          const body = buildBookingWhatsAppBody({
            intent,
            serviceLabel: "DJ ואירועים",
            summaryLines: buildSummaryLines(),
            contact: { name: sanitizeLeadText(form.name, 60), phone: displayPhone },
            totalEstimate: grandTotal,
            utmSource: readUtmSource() ?? "dj-events",
          });
          const href = buildWhatsAppHref({
            text: body,
            utm_source: "dj-events",
            utm_campaign: "dj_calculator",
          });
          openWhatsAppLead(href);
          notifyLeadByEmail({
            formId: "dj_events_calculator",
            subject: "ליד חדש - DJ ואירועים",
            body,
            name: sanitizeLeadText(form.name, 60),
            phone: displayPhone,
          });
        },
      );
      setFieldErrors(errs ?? {});
    },
    [
      attemptSubmit,
      form,
      hasSelection,
      festivalSelected,
      djId,
      starId,
      addons,
      effects,
      effectDiscount,
      grandTotal,
    ],
  );

  return (
    <div className={cn("pb-32", className)}>
      <div className="mx-auto max-w-3xl space-y-8">

        {/* ── Festival package ── */}
        <div>
          <SectionTitle>🏆 חבילת הפסטיבל</SectionTitle>
          <button
            type="button"
            onClick={toggleFestival}
            className={cn(
              "relative w-full rounded-2xl border-2 p-6 text-start transition-[border-color,box-shadow,background-color] duration-fast ease-luxury",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
              festivalSelected
                ? "border-brand-red bg-brand-red/5 shadow-[0_4px_20px_rgba(212,43,43,0.15)]"
                : "border-border bg-background hover:border-brand-red/40",
            )}
            aria-pressed={festivalSelected}
          >
            <span className="absolute -top-3 right-5 rounded-full bg-brand-red px-3 py-0.5 text-xs font-bold text-white">
              👑 הכל כלול
            </span>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-bold text-foreground">{FESTIVAL_PACKAGE.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{FESTIVAL_PACKAGE.sub}</p>
              </div>
              <p className="shrink-0 text-2xl font-bold text-brand-red">
                {formatCurrency(FESTIVAL_PACKAGE.price)}
              </p>
            </div>
            <ul className="mt-4 grid grid-cols-1 gap-1 sm:grid-cols-2">
              {FESTIVAL_PACKAGE.includes.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="text-brand-red" aria-hidden>✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </button>
        </div>

        {/* ── Build your own (disabled when festival is on) ── */}
        <div className={cn(festivalSelected && "pointer-events-none opacity-40")}>

          {/* DJ selection */}
          <div>
            <SectionTitle>🎧 בחרו DJ</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              {DJ_OPTIONS.map((dj) => (
                <ExclusiveCard
                  key={dj.id}
                  name={dj.name}
                  sub={dj.sub}
                  price={dj.price}
                  badge={dj.badge}
                  selected={djId === dj.id}
                  onClick={() => setDjId((prev) => (prev === dj.id ? null : dj.id))}
                />
              ))}
            </div>
          </div>

          {/* Star moment */}
          <div className="mt-8">
            <SectionTitle>🌟 &quot;רגע של כוכב&quot;  -  אופציונלי</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              {STAR_OPTIONS.map((star) => (
                <ExclusiveCard
                  key={star.id}
                  name={star.name}
                  sub={star.sub}
                  price={star.price}
                  badge={star.badge}
                  selected={starId === star.id}
                  onClick={() => setStarId((prev) => (prev === star.id ? null : star.id))}
                />
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div className="mt-8">
            <SectionTitle>🎬 שירותים נוספים</SectionTitle>
            <div className="space-y-2">
              {ADDONS.map((addon) => {
                const on = addons.has(addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className={cn(
                      "flex w-full items-center gap-4 rounded-xl border px-4 py-3 text-start",
                      "transition-[border-color,background-color] duration-fast ease-luxury",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                      on ? "border-brand-red bg-brand-red/5" : "border-border bg-background hover:border-brand-red/30",
                    )}
                    aria-pressed={on}
                  >
                    <span className="text-xl shrink-0" aria-hidden>{addon.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{addon.name}</p>
                      <p className="text-xs text-muted-foreground">{addon.sub}</p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-foreground">
                      {formatCurrency(addon.price)}
                    </span>
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                        on ? "border-brand-red bg-brand-red" : "border-muted-foreground/40",
                      )}
                      aria-hidden
                    >
                      {on && (
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <polyline points="1,3 3,5.5 7,0.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Effects */}
          <div className="mt-8">
            <SectionTitle>🎪 אטרקציות אפקטים</SectionTitle>
            {effects.size >= 1 && (
              <div className={cn(
                "mb-4 rounded-xl border px-4 py-3 text-sm font-medium",
                effectDiscount > 0
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-brand-red/30 bg-brand-red/5 text-foreground",
              )}>
                {effectDiscount > 0
                  ? `🎁 חיסכון חבילת אפקטים: -${formatCurrency(effectDiscount)} (3 אטרקציות ב-${formatCurrency(EFFECT_BUNDLE_3)})`
                  : effects.size === 2
                    ? `💡 עוד אטרקציה אחת וחוסכים ${formatCurrency(3 * EFFECT_SINGLE - EFFECT_BUNDLE_3)} ₪`
                    : `💡 בחרו 3 אטרקציות לקבל מחיר חבילה`}
              </div>
            )}
            {effects.size === 0 && (
              <p className="mb-4 text-xs text-muted-foreground">
                אטרקציה בודדת: {formatCurrency(EFFECT_SINGLE)} · חבילת 3: {formatCurrency(EFFECT_BUNDLE_3)} (חיסכון {formatCurrency(3 * EFFECT_SINGLE - EFFECT_BUNDLE_3)})
              </p>
            )}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {EFFECTS.map((ef) => {
                const on = effects.has(ef.id);
                return (
                  <button
                    key={ef.id}
                    type="button"
                    onClick={() => toggleEffect(ef.id)}
                    className={cn(
                      "relative flex flex-col items-center gap-1.5 rounded-2xl border p-4 text-center",
                      "transition-[border-color,box-shadow,background-color] duration-fast ease-luxury",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                      on ? "border-brand-red bg-brand-red/5" : "border-border bg-background hover:border-brand-red/30",
                    )}
                    aria-pressed={on}
                  >
                    {"badge" in ef && ef.badge && (
                      <span className="absolute -top-2 right-2 rounded-full bg-brand-red px-2 py-0.5 text-[0.55rem] font-bold text-white">
                        {ef.badge as string}
                      </span>
                    )}
                    <span className="text-2xl" aria-hidden>{ef.icon}</span>
                    <span className="text-xs font-semibold text-foreground">{ef.name}</span>
                    <span className="text-[0.65rem] text-muted-foreground leading-snug">{ef.sub}</span>
                    <span className="text-sm font-bold text-brand-red">{formatCurrency(ef.price)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Date reservation form ── */}
        {hasSelection && (
          <div className="relative rounded-2xl border border-brand-red/30 bg-brand-red/5 p-6">
            <HoneypotField value={honeypot} onChange={setHoneypot} />
            <LeadFormAlert message={globalError} className="mb-4" />
            <h3 className="mb-4 text-base font-bold text-foreground">
              📅 שריון תאריך  -  כמעט סגרנו
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor="dj-name" className="mb-1.5 block text-xs font-semibold text-foreground">
                  שם מלא *
                </label>
                <input
                  id="dj-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="הכנס שם מלא"
                  aria-invalid={Boolean(fieldErrors.name)}
                  className={cn(
                    "w-full rounded-xl border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20",
                    fieldErrors.name ? "border-brand-red" : "border-border",
                  )}
                />
                {fieldErrors.name ? (
                  <p className="mt-1 text-xs text-brand-red">{fieldErrors.name}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="dj-phone" className="mb-1.5 block text-xs font-semibold text-foreground">
                  טלפון *
                </label>
                <input
                  id="dj-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="050-0000000"
                  aria-invalid={Boolean(fieldErrors.phone)}
                  className={cn(
                    "w-full rounded-xl border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20",
                    fieldErrors.phone ? "border-brand-red" : "border-border",
                  )}
                />
                {fieldErrors.phone ? (
                  <p className="mt-1 text-xs text-brand-red">{fieldErrors.phone}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="dj-date" className="mb-1.5 block text-xs font-semibold text-foreground">
                  תאריך האירוע *
                </label>
                <input
                  id="dj-date"
                  type="date"
                  min={today}
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  aria-invalid={Boolean(fieldErrors.date)}
                  className={cn(
                    "w-full rounded-xl border bg-background px-3 py-2.5 text-sm text-foreground focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20",
                    fieldErrors.date ? "border-brand-red" : "border-border",
                  )}
                />
                {fieldErrors.date ? (
                  <p className="mt-1 text-xs text-brand-red">{fieldErrors.date}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="dj-location" className="mb-1.5 block text-xs font-semibold text-foreground">
                  מיקום / אולם
                </label>
                <input
                  id="dj-location"
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="שם האולם / עיר"
                  aria-invalid={Boolean(fieldErrors.location)}
                  className={cn(
                    "w-full rounded-xl border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20",
                    fieldErrors.location ? "border-brand-red" : "border-border",
                  )}
                />
                {fieldErrors.location ? (
                  <p className="mt-1 text-xs text-brand-red">{fieldErrors.location}</p>
                ) : null}
              </div>
            </div>
            {!canReserve && !Object.keys(fieldErrors).length ? (
              <p className="mt-3 text-xs text-muted-foreground">
                מלאו שם, טלפון ותאריך כדי לשלוח בקשת שריון בוואטסאפ
              </p>
            ) : null}
            <p className="mt-4 text-sm text-muted-foreground">{BOOKING_SUMMARY_INTRO}</p>
            <p className="mt-3 text-center">
              <a
                href={consultHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground underline-offset-4 hover:text-brand-red hover:underline"
              >
                {BOOKING_CONSULT_15_MIN.title}
              </a>
            </p>
          </div>
        )}

        {hasSelection && <BookingPaymentTrust />}

        {/* Timeline */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="mb-5 text-center text-sm font-bold text-foreground">
            ⏰ סדר ערב מומלץ
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              { time: "קבלת פנים", icon: "🖼️", name: "מצגת + אולפן נייד", desc: "ברקע + אורחים מקליטים" },
              { time: "כניסה", icon: "🎬", name: "פסקול + עשן כבד", desc: "כניסה דרמטית" },
              { time: "רחבה", icon: "🎧", name: "DJ + מתופף + בלונים", desc: "שיא האנרגיה" },
              { time: "רגע שיא", icon: "🌟", name: "רגע של כוכב + זיקוקים", desc: "הרגע שכולם מצלמים" },
              { time: "סיום", icon: "🎊", name: "קונפטי + קצף", desc: "סיום מטורף" },
            ].map((step) => (
              <div key={step.time} className="rounded-xl border border-border bg-background p-3 text-center">
                <p className="text-[0.6rem] font-bold text-brand-red">{step.time}</p>
                <span className="mt-1 block text-xl">{step.icon}</span>
                <p className="mt-1 text-xs font-semibold text-foreground leading-snug">{step.name}</p>
                <p className="mt-0.5 text-[0.6rem] text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fine print */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="mb-4 text-sm font-bold text-foreground">📝 הביטחון שלכם</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { icon: "🛡️", text: "ביטוח ציוד וצד ג׳  -  אירוע מבוטח לגמרי" },
              { icon: "📦", text: "ציוד, הובלה, הקמה ופירוק  -  ללא הפתעות" },
              { icon: "⏰", text: "הגעה שעה לפני האירוע להקמה ובדיקות" },
              { icon: "💳", text: "50% מקדמה בהזמנה, 50% ביום האירוע" },
              { icon: "📋", text: "כל המחירים לפני מע״מ (יש להוסיף 18%)" },
              { icon: "📱", text: "סרטון מעוצב מכל אטרקציה  -  תוך 72 שעות" },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="shrink-0">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky bar */}
      <CalculatorStickyBar
        total={grandTotal}
        totalLabel="השקעה משוערת · לפני מע״מ"
        subLabel={effectDiscount > 0 ? `כולל חיסכון ${formatCurrency(effectDiscount)}` : undefined}
        whatsappHref=""
        showCta={hasSelection}
        continueDisabled={!canReserve}
        startNowDisabled={!canReserve}
        onContinueClick={() => handleAction("continue_chat")}
        onStartNowClick={() => handleAction("start_now")}
        continueLabel={BOOKING_CTA.continue_chat}
        startNowLabel={BOOKING_CTA.start_now}
        emptyLabel="בחרו שירות לחישוב"
      />
    </div>
  );
}
