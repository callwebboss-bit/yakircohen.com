"use client";

import Link from "next/link";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import CalculatorStickyBar from "@/components/calculators/CalculatorStickyBar";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import { formatCurrency } from "@/components/calculators/formatCurrency";
import {
  ATTRACTIONS,
  ATTRACTION_CATEGORIES,
  EVENT_TYPES,
  GEO_FEES,
  PRICING_TIERS,
  buildAttractionsOrderWhatsApp,
  giftProgressHint,
  getBundlePrice,
  qualifiesForGift,
  type AttractionItem,
  type AttractionsOrderForm,
  type GeoKey,
} from "@/lib/data/attractions-calculator";
import { validateAttractionsOrder } from "@/lib/form-validation";
import { notifyLeadByEmail } from "@/lib/lead-email-notify";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "select", label: "בחירת אטרקציות" },
  { id: "details", label: "פרטי אירוע" },
  { id: "review", label: "סיכום ושליחה" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const EMPTY_FORM: AttractionsOrderForm = {
  name: "",
  phone: "",
  eventType: "",
  eventDate: "",
  eventTime: "",
  venue: "",
  guestCount: "",
  notes: "",
};

function GiftProgressBar({ count }: { count: number }) {
  const max = 4;
  const pct = Math.min((count / max) * 100, 100);
  const atGift = qualifiesForGift(count);

  return (
    <div className="rounded-2xl border border-border bg-surface px-4 py-4 sm:px-5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-foreground">
          {atGift ? "קליפ היילייטס מתנה" : "מד חיסכון"}
        </span>
        <span className="shrink-0 text-xs font-semibold text-brand-red">
          {count}/{max} אטרקציות
        </span>
      </div>
      <div
        className="mb-2 h-2.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500 ease-out",
            atGift ? "bg-brand-red" : "bg-brand-red/80",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {atGift ? (
        <p className="text-sm font-semibold text-brand-red">
          קליפ היילייטס - 60 שניות מוכן לשיתוף, במתנה
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">{giftProgressHint(count)}</p>
      )}
    </div>
  );
}

function StepIndicator({ step }: { step: StepId }) {
  const index = STEPS.findIndex((s) => s.id === step);

  return (
    <nav
      className="overflow-x-auto rounded-2xl border border-border bg-surface p-3"
      aria-label="שלבי ההזמנה"
    >
      <ol className="flex min-w-max items-center gap-2 sm:gap-4">
        {STEPS.map((s, i) => {
          const done = i < index;
          const active = i === index;
          return (
            <li key={s.id} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  active && "bg-brand-red text-white",
                  done && !active && "bg-brand-red/15 text-brand-red",
                  !done && !active && "bg-muted text-muted-foreground",
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? "✓" : i + 1}
              </span>
              <span
                className={cn(
                  "text-xs font-semibold sm:text-sm",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 ? (
                <span className="mx-1 hidden h-px w-6 bg-border sm:block" aria-hidden />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function AttractionCard({
  attraction,
  selected,
  onToggle,
}: {
  attraction: AttractionItem;
  selected: boolean;
  onToggle: () => void;
}) {
  const badge = attraction.badge ?? (attraction.recommended ? "מומלץ" : null);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border transition-[border-color,box-shadow]",
        selected
          ? "border-brand-red shadow-sm"
          : "border-border hover:border-brand-red/30",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full items-start gap-3 p-4 text-right",
          selected ? "bg-brand-red/5" : "bg-surface",
        )}
      >
        {badge ? (
          <span className="absolute -top-px right-4 rounded-b-md bg-brand-red px-2 py-0.5 text-[0.65rem] font-bold text-white">
            {badge}
          </span>
        ) : null}
        <span
          className={cn(
            "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl",
            selected ? "bg-brand-red/15" : "bg-muted",
          )}
          aria-hidden
        >
          {attraction.icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-foreground">
            {attraction.name}
          </span>
          <span className="mt-0.5 block text-[0.7rem] leading-snug text-muted-foreground">
            {attraction.shortDesc}
          </span>
        </span>
        <span
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
            selected
              ? "border-brand-red bg-brand-red"
              : "border-muted-foreground/40",
          )}
          aria-hidden
        >
          {selected ? (
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
              <polyline
                points="1,3 3,5.5 7,0.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </span>
      </button>
      <div className="border-t border-border/80 bg-background px-4 py-2">
        <Link
          href={attraction.href}
          className="text-[0.7rem] font-semibold text-brand-red hover:underline"
        >
          פרטים על השירות
        </Link>
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">
        {label}
        {required ? <span className="text-brand-red"> *</span> : null}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-[0.7rem] text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

function isFormValid(form: AttractionsOrderForm): boolean {
  return validateAttractionsOrder(form).ok;
}

function fieldClass(hasError: boolean) {
  return cn(
    inputClass,
    hasError && "border-brand-red ring-2 ring-brand-red/25",
  );
}

export default function AttractionsCalculator({ className }: { className?: string }) {
  const [step, setStep] = useState<StepId>("select");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [geo, setGeo] = useState<GeoKey>("center");
  const [form, setForm] = useState<AttractionsOrderForm>(EMPTY_FORM);
  const [touched, setTouched] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { honeypot, setHoneypot, globalError, attemptSubmit } = useLeadFormGuard({
    formId: "attractions_calculator",
  });

  const setField = <K extends keyof AttractionsOrderForm>(
    key: K,
    value: AttractionsOrderForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const count = selected.size;
  const bundlePrice = getBundlePrice(count);
  const geoFee = GEO_FEES[geo].fee;
  const total = bundlePrice + geoFee;
  const hasGift = qualifiesForGift(count);
  const selectedIds = useMemo(() => [...selected], [selected]);

  const waText = useMemo(
    () =>
      buildAttractionsOrderWhatsApp({
        selectedIds,
        geo,
        form,
        bundlePrice,
        geoFee,
        total,
        hasGift,
      }),
    [selectedIds, geo, form, bundlePrice, geoFee, total, hasGift],
  );

  const whatsappHref = useMemo(
    () => buildWhatsAppHref({ text: waText, utm_campaign: "attractions_calculator" }),
    [waText],
  );

  const selectedItems = ATTRACTIONS.filter((a) => selected.has(a.id));

  const sendWhatsAppOrder = useCallback(() => {
    const errs = attemptSubmit(
      () => validateAttractionsOrder(form),
      () => {
        openWhatsAppLead(whatsappHref);
        notifyLeadByEmail({
          formId: "attractions_calculator",
          subject: "ליד חדש - אטרקציות לאירוע",
          body: waText,
          name: form.name,
          phone: form.phone,
        });
      },
    );
    setFieldErrors(errs ?? {});
    if (errs) setTouched(true);
  }, [attemptSubmit, form, whatsappHref, waText]);

  const sticky = useMemo(() => {
    if (step === "select") {
      return {
        showCta: count > 0,
        ctaLabel: "המשך לפרטי אירוע",
        onPrimaryClick: () => setStep("details"),
        emptyLabel: "בחרו אטרקציה",
      };
    }
    if (step === "details") {
      const valid = isFormValid(form);
      return {
        showCta: count > 0,
        ctaLabel: "המשך לסיכום",
        onPrimaryClick: () => {
          setTouched(true);
          const errs = validateAttractionsOrder(form);
          if (!errs.ok) {
            setFieldErrors({ ...errs.errors });
            return;
          }
          setFieldErrors({});
          if (valid) setStep("review");
        },
        primaryDisabled: !valid,
        emptyLabel: "מלאו פרטים",
      };
    }
    return {
      showCta: count > 0 && isFormValid(form),
      ctaLabel: "שלחו הזמנה בוואטסאפ",
      onPrimaryClick: undefined,
      emptyLabel: "סיכום",
    };
  }, [step, count, form]);

  return (
    <div className={cn("pb-32 sm:pb-28", className)}>
      <div className="mx-auto max-w-3xl space-y-5 sm:space-y-6">
        <StepIndicator step={step} />

        {step === "select" ? (
          <>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PRICING_TIERS.map((tier) => (
                <div
                  key={tier.count}
                  className={cn(
                    "rounded-xl border p-2.5 text-center sm:p-3",
                    "highlight" in tier && tier.highlight
                      ? "border-brand-red/40 bg-brand-red/5"
                      : "border-border bg-surface",
                  )}
                >
                  <p className="mb-1 text-[0.6rem] font-bold tracking-wider text-muted-foreground uppercase sm:text-[0.65rem]">
                    {tier.count === 4 ? "4+" : tier.count} אטרקציות
                  </p>
                  <p
                    className={cn(
                      "text-base font-bold sm:text-lg",
                      "highlight" in tier && tier.highlight
                        ? "text-brand-red"
                        : "text-foreground",
                    )}
                  >
                    {formatCurrency(tier.price)}
                  </p>
                  {tier.saving ? (
                    <p
                      className={cn(
                        "mt-0.5 text-[0.6rem] font-semibold sm:text-[0.65rem]",
                        "highlight" in tier && tier.highlight
                          ? "text-brand-red"
                          : "text-emerald-700",
                      )}
                    >
                      {tier.saving}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>

            <GiftProgressBar count={count} />

            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="mb-3 text-[0.65rem] font-bold tracking-widest text-muted-foreground uppercase">
                אזור האירוע
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {(Object.entries(GEO_FEES) as [GeoKey, (typeof GEO_FEES)[GeoKey]][]).map(
                  ([key, val]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setGeo(key)}
                      className={cn(
                        "rounded-xl border px-4 py-3 text-right text-sm font-semibold transition-colors",
                        geo === key
                          ? "border-brand-red bg-brand-red text-white"
                          : "border-border text-muted-foreground hover:border-brand-red/40 hover:text-foreground",
                      )}
                    >
                      <span className="block">{val.label}</span>
                      {val.fee > 0 ? (
                        <span
                          className={cn(
                            "mt-0.5 block text-xs font-medium",
                            geo === key ? "text-white/90" : "text-muted-foreground",
                          )}
                        >
                          +{formatCurrency(val.fee)}
                        </span>
                      ) : (
                        <span
                          className={cn(
                            "mt-0.5 block text-xs",
                            geo === key ? "text-white/90" : "text-muted-foreground",
                          )}
                        >
                          ללא תוספת
                        </span>
                      )}
                    </button>
                  ),
                )}
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              פתחו קטגוריה, סמנו אטרקציות, והמשיכו לפרטי האירוע
            </p>

            {ATTRACTION_CATEGORIES.map((cat, catIndex) => {
              const items = ATTRACTIONS.filter((a) => a.category === cat.id);
              const selectedInCat = items.filter((a) => selected.has(a.id)).length;
              return (
                <details
                  key={cat.id}
                  className="group rounded-2xl border border-border bg-surface"
                  open={catIndex === 0 || selectedInCat > 0}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="text-sm font-bold text-foreground">{cat.label}</span>
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      {selectedInCat > 0 ? (
                        <span className="rounded-full bg-brand-red/10 px-2 py-0.5 font-semibold text-brand-red">
                          {selectedInCat} נבחרו
                        </span>
                      ) : null}
                      <span className="text-muted-foreground transition-transform group-open:rotate-180">
                        ▾
                      </span>
                    </span>
                  </summary>
                  <div className="grid grid-cols-1 gap-3 border-t border-border px-3 pb-4 sm:grid-cols-2 sm:px-4">
                    {items.map((attraction) => (
                      <AttractionCard
                        key={attraction.id}
                        attraction={attraction}
                        selected={selected.has(attraction.id)}
                        onToggle={() => toggle(attraction.id)}
                      />
                    ))}
                  </div>
                </details>
              );
            })}
          </>
        ) : null}

        {step === "details" ? (
          <div className="space-y-4 rounded-2xl border border-border bg-surface p-4 sm:p-5">
            <div>
              <h3 className="text-lg font-bold text-foreground">פרטי האירוע והלקוח</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                השדות המסומנים בכוכבית נכנסים להודעת הוואטסאפ כחלק מההזמנה.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="שם מלא" required>
                <input
                  className={fieldClass(Boolean(touched && fieldErrors.name))}
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  autoComplete="name"
                  placeholder="לדוגמה: דני כהן"
                  aria-invalid={Boolean(touched && fieldErrors.name)}
                />
                {touched && fieldErrors.name ? (
                  <p className="mt-1 text-xs text-brand-red">{fieldErrors.name}</p>
                ) : null}
              </FormField>
              <FormField label="טלפון ליצירת קשר" required>
                <input
                  className={fieldClass(Boolean(touched && fieldErrors.phone))}
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  autoComplete="tel"
                  placeholder="050-0000000"
                  aria-invalid={Boolean(touched && fieldErrors.phone)}
                />
                {touched && fieldErrors.phone ? (
                  <p className="mt-1 text-xs text-brand-red">{fieldErrors.phone}</p>
                ) : null}
              </FormField>
              <FormField label="סוג אירוע" required>
                <select
                  className={fieldClass(Boolean(touched && fieldErrors.eventType))}
                  value={form.eventType}
                  onChange={(e) => setField("eventType", e.target.value)}
                  aria-invalid={Boolean(touched && fieldErrors.eventType)}
                >
                  <option value="">בחרו סוג אירוע</option>
                  {EVENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                {touched && fieldErrors.eventType ? (
                  <p className="mt-1 text-xs text-brand-red">{fieldErrors.eventType}</p>
                ) : null}
              </FormField>
              <FormField label="תאריך האירוע" required>
                <input
                  className={fieldClass(Boolean(touched && fieldErrors.eventDate))}
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => setField("eventDate", e.target.value)}
                  aria-invalid={Boolean(touched && fieldErrors.eventDate)}
                />
                {touched && fieldErrors.eventDate ? (
                  <p className="mt-1 text-xs text-brand-red">{fieldErrors.eventDate}</p>
                ) : null}
              </FormField>
              <FormField label="שעת התחלה / הפעלה" required>
                <input
                  className={fieldClass(Boolean(touched && fieldErrors.eventTime))}
                  type="time"
                  value={form.eventTime}
                  onChange={(e) => setField("eventTime", e.target.value)}
                  aria-invalid={Boolean(touched && fieldErrors.eventTime)}
                />
                {touched && fieldErrors.eventTime ? (
                  <p className="mt-1 text-xs text-brand-red">{fieldErrors.eventTime}</p>
                ) : null}
              </FormField>
              <FormField label="מספר אורחים (אופציונלי)">
                <input
                  className={fieldClass(Boolean(touched && fieldErrors.guestCount))}
                  inputMode="numeric"
                  value={form.guestCount}
                  onChange={(e) => setField("guestCount", e.target.value)}
                  placeholder="לדוגמה: 120"
                  aria-invalid={Boolean(touched && fieldErrors.guestCount)}
                />
                {touched && fieldErrors.guestCount ? (
                  <p className="mt-1 text-xs text-brand-red">{fieldErrors.guestCount}</p>
                ) : null}
              </FormField>
            </div>

            <FormField
              label="מיקום האירוע (אולם / כתובת מלאה)"
              required
              hint="כתבו את שם האולם והעיר - כך נוכל לאשר זמינות ונסיעה"
            >
              <input
                className={fieldClass(Boolean(touched && fieldErrors.venue))}
                value={form.venue}
                onChange={(e) => setField("venue", e.target.value)}
                placeholder="לדוגמה: אולם רויאל, מודיעין"
                aria-invalid={Boolean(touched && fieldErrors.venue)}
              />
              {touched && fieldErrors.venue ? (
                <p className="mt-1 text-xs text-brand-red">{fieldErrors.venue}</p>
              ) : null}
            </FormField>

            <div className="rounded-xl border border-border bg-background p-3 text-sm">
              <p className="font-semibold text-foreground">אזור נסיעה שנבחר</p>
              <p className="mt-1 text-muted-foreground">
                {GEO_FEES[geo].label}
                {geoFee > 0 ? ` · תוספת ${formatCurrency(geoFee)}` : " · ללא תוספת"}
              </p>
              <button
                type="button"
                onClick={() => setStep("select")}
                className="mt-2 text-xs font-semibold text-brand-red hover:underline"
              >
                לשנות אזור או אטרקציות
              </button>
            </div>

            <FormField label="הערות, בקשות מיוחדות או שאלות">
              <textarea
                className={cn(inputClass, "min-h-24 resize-y")}
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
                placeholder="לדוגמה: רוצים דגש על ריקודים, צריך הגברה נוספת..."
              />
            </FormField>

            {touched && !isFormValid(form) ? (
              <p className="text-sm font-medium text-brand-red" role="alert">
                נא למלא את כל השדות החובה לפני המשך לסיכום.
              </p>
            ) : null}

            <button
              type="button"
              onClick={() => setStep("select")}
              className="text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              ← חזרה לבחירת אטרקציות
            </button>
          </div>
        ) : null}

        {step === "review" ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-brand-red/30 bg-brand-red/5 p-4 sm:p-5">
              <h3 className="text-lg font-bold text-foreground">סיכום ההזמנה</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                בדקו שהכל נכון. ההודעה בוואטסאפ תישלח בפורמט חוזה עם כל הפרטים.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-4 text-sm sm:p-5">
              <p className="mb-2 font-bold text-foreground">פרטי לקוח ואירוע</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>
                  <span className="text-foreground">שם:</span> {form.name}
                </li>
                <li>
                  <span className="text-foreground">טלפון:</span> {form.phone}
                </li>
                <li>
                  <span className="text-foreground">אירוע:</span>{" "}
                  {EVENT_TYPES.find((t) => t.value === form.eventType)?.label}
                </li>
                <li>
                  <span className="text-foreground">תאריך:</span> {form.eventDate} · שעה{" "}
                  {form.eventTime}
                </li>
                <li>
                  <span className="text-foreground">מיקום:</span> {form.venue}
                </li>
                <li>
                  <span className="text-foreground">אזור:</span> {GEO_FEES[geo].label}
                </li>
                {form.guestCount ? (
                  <li>
                    <span className="text-foreground">אורחים:</span> {form.guestCount}
                  </li>
                ) : null}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
              <p className="mb-3 text-sm font-bold text-foreground">
                אטרקציות ({selectedItems.length})
              </p>
              <ol className="list-decimal space-y-2 pr-5 text-sm text-muted-foreground">
                {selectedItems.map((a) => (
                  <li key={a.id} className="text-foreground">
                    {a.name}
                  </li>
                ))}
              </ol>
              {hasGift ? (
                <p className="mt-3 text-sm font-semibold text-brand-red">
                  + קליפ היילייטס 60 שניות במתנה
                </p>
              ) : null}
              <p className="mt-4 text-xl font-bold text-brand-red">
                {formatCurrency(total)} לפני מע״מ
              </p>
            </div>

            <pre className="max-h-48 overflow-auto rounded-xl border border-border bg-muted/30 p-3 text-[0.65rem] leading-relaxed whitespace-pre-wrap text-muted-foreground sm:max-h-64 sm:text-xs">
              {buildAttractionsOrderWhatsApp({
                selectedIds,
                geo,
                form,
                bundlePrice,
                geoFee,
                total,
                hasGift,
              })}
            </pre>

            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              <button
                type="button"
                onClick={() => setStep("details")}
                className="rounded-xl border border-border px-4 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted/50"
              >
                עריכת פרטים
              </button>
              <button
                type="button"
                onClick={sendWhatsAppOrder}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-red px-6 py-3.5 text-sm font-semibold text-white hover:bg-brand-red-light"
              >
                שלחו הזמנה בוואטסאפ
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {step !== "review" ? (
        <CalculatorStickyBar
          total={total}
          subLabel={hasGift ? "+ קליפ היילייטס מתנה" : undefined}
          whatsappHref={whatsappHref}
          showCta={sticky.showCta}
          ctaLabel={sticky.ctaLabel}
          onPrimaryClick={sticky.onPrimaryClick}
          primaryDisabled={sticky.primaryDisabled}
          emptyLabel={sticky.emptyLabel}
        />
      ) : null}
    </div>
  );
}
