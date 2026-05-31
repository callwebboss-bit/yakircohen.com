"use client";

import { useState, useMemo } from "react";
import BookingPaymentTrust from "@/components/booking/BookingPaymentTrust";
import BookingSummaryActions from "@/components/booking/BookingSummaryActions";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import {
  formatPhoneForDisplay,
  sanitizeLeadText,
  validateBookingLead,
} from "@/lib/form-validation";
import {
  buildBookingWhatsAppBody,
  buildConsultWhatsAppHref,
  readUtmSource,
} from "@/lib/booking-messages";
import {
  BOOKING_CTA,
  BOOKING_SUMMARY_INTRO,
  BOOKING_CONSULT_15_MIN,
} from "@/lib/data/booking-shared";
import { notifyLeadByEmail } from "@/lib/lead-email-notify";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import {
  BADGE_LABELS,
  CATEGORIES,
  EVENT_BUNDLE_TIERS,
  EVENT_BUNDLE_4PLUS,
  EVENT_GIFT_THRESHOLD,
  SERVICES,
  UPSELLS,
  getEventBundlePrice,
  type ServiceCategory,
} from "@/lib/data/booking-calculator-services";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────────────────────────── */

type BookingCalculatorProps = {
  excludeCategories?: ServiceCategory[];
};

/* ─── Module-level constants ─────────────────────────────────────────────────── */

/* ─── Component ─────────────────────────────────────────────────────────────── */

type FormState = {
  name: string;
  phone: string;
  date: string;
  time: string;
  location: string;
  notes: string;
};

export default function BookingCalculator({
  excludeCategories = [],
}: BookingCalculatorProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [selectedUpsells, setSelectedUpsells] = useState<Set<string>>(new Set());
  const [form, setForm] = useState<FormState>({
    name: "", phone: "", date: "", time: "", location: "", notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const { honeypot, setHoneypot, globalError, attemptSubmit } = useLeadFormGuard({
    formId: "booking_calculator",
  });

  const filtered = useMemo(() => {
    if (!activeCategory) return [];
    return Object.entries(SERVICES).filter(([, s]) => {
      if (excludeCategories.includes(s.category)) return false;
      return s.category === activeCategory;
    });
  }, [activeCategory, excludeCategories]);

  const visibleCategories = useMemo(
    () =>
      CATEGORIES.filter(
        (c) => !excludeCategories.includes(c.id as ServiceCategory),
      ),
    [excludeCategories],
  );

  const allSelected = Array.from(selectedServices);
  const eventKeys = allSelected.filter((k) => SERVICES[k]?.category === "events");
  const regularKey = allSelected.find((k) => SERVICES[k]?.category !== "events");
  const hasEvents = eventKeys.length > 0;
  const hasGift = eventKeys.length >= EVENT_GIFT_THRESHOLD;

  const eventBundleTotal = getEventBundlePrice(eventKeys.length);
  const eventSingleTotal = eventKeys.length * 1750;
  const eventDiscount = eventSingleTotal - eventBundleTotal;
  const basePrice = (regularKey ? SERVICES[regularKey].price : 0) + eventBundleTotal;
  const addonPrice = Array.from(selectedUpsells).reduce((acc, k) => acc + (UPSELLS[k]?.price ?? 0), 0);
  const total = basePrice + addonPrice;

  const activeUpsellKeys = regularKey ? SERVICES[regularKey].upsells : [];
  const hasSelection = selectedServices.size > 0;

  const buildSummaryLines = () => [
    ...(form.date ? [{ label: "תאריך", value: form.date }] : []),
    ...(form.time ? [{ label: "שעה", value: form.time }] : []),
    ...(hasEvents && form.location ? [{ label: "מיקום", value: sanitizeLeadText(form.location, 120) }] : []),
    ...Array.from(selectedUpsells)
      .filter((k) => (UPSELLS[k]?.price ?? 0) > 0)
      .map((k) => ({ label: "תוספת", value: `${UPSELLS[k]?.name} (+${UPSELLS[k]?.price.toLocaleString()} ₪)` })),
    ...(eventDiscount > 0 ? [{ label: "הנחת חבילה", value: `-${eventDiscount.toLocaleString()} ₪` }] : []),
    ...(form.notes ? [{ label: "הערות", value: sanitizeLeadText(form.notes, 1500) }] : []),
  ];

  const consultHref = useMemo(() => {
    const displayPhone = form.phone.trim()
      ? formatPhoneForDisplay(form.phone.trim())
      : "";
    return buildConsultWhatsAppHref(buildSummaryLines(), {
      name: sanitizeLeadText(form.name, 60),
      phone: displayPhone,
    });
  }, [form, selectedUpsells, hasEvents, eventDiscount]);

  const toggleService = (key: string) => {
    const svc = SERVICES[key];
    if (!svc) return;

    if (svc.category === "events") {
      setSelectedServices((prev) => {
        const n = new Set(prev);
        n.has(key) ? n.delete(key) : n.add(key);
        return n;
      });
    } else {
      const already = selectedServices.has(key);
      setSelectedServices((prev) => {
        const n = new Set(prev);
        for (const k of n) { if (SERVICES[k]?.category !== "events") n.delete(k); }
        if (!already) n.add(key);
        return n;
      });
      setSelectedUpsells(new Set());
    }
  };

  const toggleUpsell = (key: string) => {
    setSelectedUpsells((prev) => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
  };

  const handleAction = (intent: "continue_chat" | "start_now") => {
    if (!hasSelection) return;

    const fieldErrs = attemptSubmit(
      () =>
        validateBookingLead({
          name: form.name,
          phone: form.phone,
          date: form.date,
          time: form.time,
          location: form.location,
          notes: form.notes,
          requireLocation: hasEvents,
        }),
      (result) => {
        const displayPhone = result.normalizedPhone
          ? formatPhoneForDisplay(result.normalizedPhone)
          : form.phone.trim();

        const serviceLabel = allSelected
          .map((k) => SERVICES[k]?.name)
          .filter(Boolean)
          .join(" + ");

        const body = buildBookingWhatsAppBody({
          intent,
          serviceLabel: serviceLabel || "הזמנה",
          summaryLines: buildSummaryLines(),
          contact: { name: sanitizeLeadText(form.name, 60), phone: displayPhone },
          totalEstimate: total,
          utmSource: readUtmSource(),
        });

        const href = buildWhatsAppHref({
          text: body,
          utm_source: "website",
          utm_campaign: "booking_calculator",
        });
        openWhatsAppLead(href);
        notifyLeadByEmail({
          formId: "booking_calculator",
          subject: "ליד חדש - מחשבון הזמנות",
          body,
          name: sanitizeLeadText(form.name, 60),
          phone: displayPhone,
        });
        setDone(true);
      },
    );

    setErrors(fieldErrs ?? {});
  };

  const setField = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-w-0 max-w-full">
      {/* ── Category tabs ── */}
      <div className="mb-8 flex flex-wrap gap-2">
        {visibleCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-[background-color,color] duration-fast ease-luxury",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
              activeCategory === cat.id
                ? "bg-brand-red text-white"
                : "bg-surface text-muted-foreground hover:bg-brand-red/10 hover:text-brand-red",
            )}
          >
            <span aria-hidden="true">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Main layout ── */}
      <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
        {/* ── Left: services ── */}
        <div>
          {/* Event bundle hint */}
          {hasEvents && (
            <div className="mb-4 rounded-xl border border-brand-red/30 bg-brand-red/8 px-4 py-3 text-sm text-foreground">
              {hasGift
                ? `🎉 4 אטרקציות ומעלה  -  ${EVENT_BUNDLE_4PLUS.toLocaleString()} ₪ + קליפ היילייטס מתנה`
                : eventKeys.length === 3
                  ? `⭐ 3 אטרקציות  -  ${EVENT_BUNDLE_TIERS[3]!.toLocaleString()} ₪ (חיסכון 800 ₪). עוד אחת ותקבלו קליפ מתנה!`
                  : eventKeys.length === 2
                    ? `⭐ 2 אטרקציות  -  ${EVENT_BUNDLE_TIERS[2]!.toLocaleString()} ₪ (חיסכון 300 ₪)`
                    : `💡 בחרו 2+ אטרקציות לחסוך בחבילה`}
            </div>
          )}

          {!activeCategory ? (
            <p className="rounded-2xl border border-dashed border-border bg-surface px-6 py-10 text-center text-sm text-muted-foreground">
              בחרו קטגוריה לצפייה בשירותים
            </p>
          ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filtered.map(([key, svc]) => {
              const isSelected = selectedServices.has(key);
              const isEvent = svc.category === "events";

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleService(key)}
                  className={cn(
                    "relative flex flex-col items-start gap-2 rounded-2xl border p-5 text-start shadow-sm",
                    "transition-[border-color,box-shadow,transform] duration-fast ease-luxury",
                    "hover:-translate-y-0.5 hover:shadow-md",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                    isSelected
                      ? "border-brand-red/50 bg-brand-red/5 shadow-[0_4px_16px_rgba(212,43,43,0.1)]"
                      : "border-border bg-background hover:border-brand-red/30",
                  )}
                  aria-pressed={isSelected}
                >
                  {/* Badge */}
                  {svc.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-brand-red px-2 py-0.5 text-[0.6rem] font-bold text-white">
                      {BADGE_LABELS[svc.badge]}
                    </span>
                  )}

                  {/* Checkmark */}
                  {isSelected && (
                    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand-red text-xs text-white">
                      ✓
                    </span>
                  )}

                  <span className="text-2xl" aria-hidden="true">{svc.icon}</span>
                  <span className="text-sm font-semibold text-foreground">{svc.name}</span>
                  <span className="text-xs leading-relaxed text-muted-foreground">{svc.desc}</span>
                  <span className="mt-auto text-base font-bold text-foreground">
                    {isEvent ? "1,750 ₪" : svc.price.toLocaleString() + " ₪"}
                    {isEvent && eventKeys.length > 1 && (
                      <span className="mr-1.5 text-xs font-normal text-brand-red">
                        {eventKeys.length >= 2 ? "חבילה" : ""}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          )}

          {/* Upsells */}
          {activeCategory && activeUpsellKeys.length > 0 && (
            <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                תוספות זמינות לשירות שנבחר
              </h3>
              <div className="space-y-2.5">
                {activeUpsellKeys.map((uKey) => {
                  const u = UPSELLS[uKey];
                  if (!u) return null;
                  const active = selectedUpsells.has(uKey);
                  return (
                    <button
                      key={uKey}
                      type="button"
                      onClick={() => toggleUpsell(uKey)}
                      className={cn(
                        "flex w-full items-start justify-between gap-4 rounded-xl border px-4 py-3 text-start",
                        "transition-[border-color,background-color] duration-fast ease-luxury",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                        active
                          ? "border-brand-red/40 bg-brand-red/5"
                          : "border-border bg-background hover:border-brand-red/30",
                      )}
                      aria-pressed={active}
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className={cn(
                            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-xs",
                            active ? "border-brand-red bg-brand-red text-white" : "border-border",
                          )}
                          aria-hidden="true"
                        >
                          {active && "✓"}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-foreground">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.desc}</p>
                        </div>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-foreground">
                        {u.price === 0 ? "כלול" : `+${u.price.toLocaleString()} ₪`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: cart + form ── */}
        <div className="lg:sticky lg:top-6">
          {/* Cart summary */}
          {hasSelection && (
            <div className="mb-5 rounded-2xl border border-border bg-surface p-5">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                סיכום הזמנה
              </h3>

              <ul className="mb-3 space-y-1">
                {allSelected.map((k) => (
                  <li key={k} className="text-xs text-muted-foreground">
                    • {SERVICES[k]?.name}
                  </li>
                ))}
                {Array.from(selectedUpsells).map((k) => (
                  <li key={k} className="text-xs text-muted-foreground">
                    • {UPSELLS[k]?.name}
                  </li>
                ))}
              </ul>

              <div className="space-y-1 border-t border-border pt-3">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>מחיר בסיס</span>
                  <span>{basePrice.toLocaleString()} ₪</span>
                </div>
                {addonPrice > 0 && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>תוספות</span>
                    <span>+{addonPrice.toLocaleString()} ₪</span>
                  </div>
                )}
                {eventDiscount > 0 && (
                  <div className="flex justify-between text-xs font-medium text-green-600">
                    <span>הנחת חבילה</span>
                    <span>-{eventDiscount.toLocaleString()} ₪</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-2 text-sm font-bold text-foreground">
                  <span>סה&quot;כ</span>
                  <span>{total.toLocaleString()} ₪</span>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
            <h3 className="mb-5 border-b border-border pb-3 text-base font-semibold text-foreground">
              פרטים להזמנה
            </h3>

            <div className="relative space-y-4">
              <HoneypotField value={honeypot} onChange={setHoneypot} />
              <LeadFormAlert message={globalError} />
              {/* Name */}
              <div>
                <label htmlFor="book-name" className="mb-1.5 block text-xs font-semibold text-foreground">
                  שם מלא *
                </label>
                <input
                  id="book-name"
                  type="text"
                  value={form.name}
                  onChange={setField("name")}
                  placeholder="הכנס שם מלא"
                  className={cn(
                    "w-full rounded-xl border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground",
                    "transition-[border-color,box-shadow] duration-fast ease-luxury",
                    "focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20",
                    errors.name ? "border-red-400 bg-red-50" : "border-border bg-background",
                  )}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="book-phone" className="mb-1.5 block text-xs font-semibold text-foreground">
                  טלפון *
                </label>
                <input
                  id="book-phone"
                  type="tel"
                  value={form.phone}
                  onChange={setField("phone")}
                  placeholder="05xxxxxxxx"
                  className={cn(
                    "w-full rounded-xl border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground",
                    "transition-[border-color,box-shadow] duration-fast ease-luxury",
                    "focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20",
                    errors.phone ? "border-red-400 bg-red-50" : "border-border bg-background",
                  )}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>

              {/* Location (events only) */}
              {hasEvents && (
                <div>
                  <label htmlFor="book-location" className="mb-1.5 block text-xs font-semibold text-foreground">
                    מיקום האירוע *
                  </label>
                  <input
                    id="book-location"
                    type="text"
                    value={form.location}
                    onChange={setField("location")}
                    placeholder="כתובת מלאה של האירוע"
                    className={cn(
                      "w-full rounded-xl border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground",
                      "transition-[border-color,box-shadow] duration-fast ease-luxury",
                      "focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20",
                      errors.location ? "border-red-400 bg-red-50" : "border-border bg-background",
                    )}
                  />
                  {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
                </div>
              )}

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="book-date" className="mb-1.5 block text-xs font-semibold text-foreground">
                    תאריך *
                  </label>
                  <input
                    id="book-date"
                    type="date"
                    min={today}
                    value={form.date}
                    onChange={setField("date")}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2.5 text-sm text-foreground",
                      "transition-[border-color,box-shadow] duration-fast ease-luxury",
                      "focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20",
                      errors.date ? "border-red-400 bg-red-50" : "border-border bg-background",
                    )}
                  />
                  {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
                </div>
                <div>
                  <label htmlFor="book-time" className="mb-1.5 block text-xs font-semibold text-foreground">
                    שעה *
                  </label>
                  <input
                    id="book-time"
                    type="time"
                    value={form.time}
                    onChange={setField("time")}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2.5 text-sm text-foreground",
                      "transition-[border-color,box-shadow] duration-fast ease-luxury",
                      "focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20",
                      errors.time ? "border-red-400 bg-red-50" : "border-border bg-background",
                    )}
                  />
                  {errors.time && <p className="mt-1 text-xs text-red-500">{errors.time}</p>}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="book-notes" className="mb-1.5 block text-xs font-semibold text-foreground">
                  הערות (אופציונלי)
                </label>
                <textarea
                  id="book-notes"
                  value={form.notes}
                  onChange={setField("notes")}
                  rows={3}
                  placeholder="ספרו לנו עוד על מה שאתם צריכים..."
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-fast ease-luxury focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                />
              </div>
            </div>

            {/* Actions */}
            {hasSelection ? (
              <div className="mt-5 space-y-3">
                {done && (
                  <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800">
                    ההזמנה נשלחה בוואטסאפ. ניתן לשלוח שוב אם לא נפתח.
                  </p>
                )}
                <p className="text-sm text-muted-foreground">{BOOKING_SUMMARY_INTRO}</p>
                <BookingSummaryActions
                  continueWhatsApp={{
                    label: BOOKING_CTA.continue_chat,
                    onClick: () => handleAction("continue_chat"),
                  }}
                  startNow={{
                    label: BOOKING_CTA.start_now,
                    onClick: () => handleAction("start_now"),
                  }}
                  consult15Min={{
                    label: BOOKING_CONSULT_15_MIN.title,
                    href: consultHref,
                  }}
                />
                <BookingPaymentTrust />
              </div>
            ) : (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                בחרו שירות מהרשימה משמאל כדי להמשיך
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
