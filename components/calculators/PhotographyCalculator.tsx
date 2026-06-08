"use client";

import { useCallback, useMemo, useState } from "react";
import BookingPaymentTrust from "@/components/booking/BookingPaymentTrust";
import BookTrustBadges from "@/components/booking/BookTrustBadges";
import BookWhatHappensNext from "@/components/booking/BookWhatHappensNext";
import BookingWhatsAppPreview from "@/components/booking/BookingWhatsAppPreview";
import CalculatorStickyBar from "@/components/calculators/CalculatorStickyBar";
import { formatCurrency } from "@/components/calculators/formatCurrency";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
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
import {
  ADDON_SECTION_LABELS,
  AI_BUNDLE_DISCOUNT,
  HOURLY_RATE,
  HOUR_PRESETS,
  PHOTOGRAPHY_ADDONS,
  PHOTOGRAPHY_AI_SERVICES,
  getPackageLabel,
  type PhotographyAddonSection,
} from "@/lib/data/photography-calculator";
import { withVat } from "@/lib/data/pricing";
import {
  formatPhoneForDisplay,
  sanitizeLeadText,
  validateIsraeliMobile,
  validatePersonName,
} from "@/lib/form-validation";
import { notifyLeadByEmail } from "@/lib/lead-email-notify";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

function SelectableRow({
  label,
  sublabel,
  price,
  selected,
  onToggle,
  accent = "brand",
}: {
  label: string;
  sublabel: string;
  price: number;
  selected: boolean;
  onToggle: () => void;
  accent?: "brand" | "ai";
}) {
  const activeBorder =
    accent === "ai" ? "border-amber-600 bg-amber-50" : "border-brand-red bg-brand-red/5";
  const activeCheck = accent === "ai" ? "border-amber-600 bg-amber-600" : "border-brand-red bg-brand-red";
  const priceClass = accent === "ai" ? "text-amber-700" : "text-brand-red";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border p-4 text-right transition-colors",
        selected ? activeBorder : "border-border bg-surface hover:border-brand-red/30",
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          selected ? activeCheck : "border-muted-foreground/40",
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
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground">{label}</span>
        <span className="block text-[0.7rem] text-muted-foreground">{sublabel}</span>
      </span>
      <span className={cn("shrink-0 text-sm font-bold whitespace-nowrap", priceClass)}>
        {formatCurrency(price)}
      </span>
    </button>
  );
}

export default function PhotographyCalculator({ className }: { className?: string }) {
  const [hours, setHours] = useState(8);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [selectedAI, setSelectedAI] = useState<Set<string>>(new Set());
  const [contactForm, setContactForm] = useState({ name: "", phone: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { honeypot, setHoneypot, globalError, attemptSubmit } = useLeadFormGuard({
    formId: "photography_calculator",
  });

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAI = (id: string) => {
    setSelectedAI((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const aiCount = selectedAI.size;
  const bundleActive = aiCount >= 2;
  const activePresetHours = HOUR_PRESETS.find((p) => p.hours === hours)?.hours ?? null;

  const total = useMemo(() => {
    const base = hours * HOURLY_RATE;
    const addonsSum = [...selectedAddons].reduce(
      (acc, id) => acc + (PHOTOGRAPHY_ADDONS.find((a) => a.id === id)?.price ?? 0),
      0,
    );
    const aiSum = [...selectedAI].reduce(
      (acc, id) => acc + (PHOTOGRAPHY_AI_SERVICES.find((a) => a.id === id)?.price ?? 0),
      0,
    );
    return base + addonsSum + aiSum - (bundleActive ? AI_BUNDLE_DISCOUNT : 0);
  }, [hours, selectedAddons, selectedAI, bundleActive]);

  const { name: pkgName, sub: pkgSub } = getPackageLabel(hours);

  const buildSummaryLines = () => [
    { label: "חבילה", value: `${pkgName} · ${hours} שעות · ${formatCurrency(hours * HOURLY_RATE)}` },
    ...[...selectedAddons].map((id) => {
      const a = PHOTOGRAPHY_ADDONS.find((x) => x.id === id);
      return a ? { label: "תוספת", value: `${a.label} · ${formatCurrency(a.price)}` } : null;
    }).filter(Boolean) as { label: string; value: string }[],
    ...[...selectedAI].map((id) => {
      const a = PHOTOGRAPHY_AI_SERVICES.find((x) => x.id === id);
      return a ? { label: "AI", value: `${a.label} · ${formatCurrency(a.price)}` } : null;
    }).filter(Boolean) as { label: string; value: string }[],
    ...(bundleActive
      ? [{ label: "הנחת חבילת AI", value: `-${formatCurrency(AI_BUNDLE_DISCOUNT)}` }]
      : []),
  ];

  const consultHref = useMemo(() => {
    const displayPhone = contactForm.phone.trim()
      ? formatPhoneForDisplay(contactForm.phone.trim())
      : "";
    return buildConsultWhatsAppHref(buildSummaryLines(), {
      name: sanitizeLeadText(contactForm.name, 60),
      phone: displayPhone,
    });
  }, [hours, pkgName, selectedAddons, selectedAI, bundleActive, contactForm]);

  const formValid =
    contactForm.name.trim().length >= 2 && contactForm.phone.trim().length >= 9;

  const previewBody = useMemo(() => {
    if (!formValid) return undefined;
    const displayPhone = contactForm.phone.trim()
      ? formatPhoneForDisplay(contactForm.phone.trim())
      : "[טלפון]";
    return buildBookingWhatsAppBody({
      intent: "continue_chat",
      serviceLabel: "חבילת צילום לאירוע",
      summaryLines: buildSummaryLines(),
      contact: {
        name: sanitizeLeadText(contactForm.name, 60),
        phone: displayPhone,
      },
      priceExVat: total,
      totalEstimate: withVat(total),
      utmSource: readUtmSource() ?? "/book#photography",
      bookCategory: "photography",
      includeTrustFooter: true,
    });
  }, [formValid, contactForm, hours, pkgName, selectedAddons, selectedAI, bundleActive, total]);

  const handleAction = useCallback(
    (intent: "continue_chat" | "start_now") => {
      const errs = attemptSubmit(
        () => {
          const nameR = validatePersonName(contactForm.name);
          const phoneR = validateIsraeliMobile(contactForm.phone);
          const errors = {
            ...(nameR.ok ? {} : (nameR.errors ?? {})),
            ...(phoneR.ok ? {} : (phoneR.errors ?? {})),
          };
          if (Object.keys(errors).length) {
            return { ok: false as const, errors };
          }
          return { ok: true as const, normalizedPhone: phoneR.ok ? phoneR.normalizedPhone : undefined };
        },
        (result) => {
          const displayPhone = result.normalizedPhone
            ? formatPhoneForDisplay(result.normalizedPhone)
            : contactForm.phone.trim();
          const body = buildBookingWhatsAppBody({
            intent,
            serviceLabel: "חבילת צילום לאירוע",
            summaryLines: buildSummaryLines(),
            contact: {
              name: sanitizeLeadText(contactForm.name, 60),
              phone: displayPhone,
            },
            priceExVat: total,
            totalEstimate: withVat(total),
            utmSource: readUtmSource() ?? "/book#photography",
            bookCategory: "photography",
            includeTrustFooter: true,
          });
          const href = buildWhatsAppHref({ text: body, utm_campaign: "photography_calculator" });
          openWhatsAppLead(href, { leadCategory: "photography" });
          notifyLeadByEmail({
            formId: "photography_calculator",
            subject: "ליד חדש - צילום אירועים",
            body,
            name: sanitizeLeadText(contactForm.name, 60),
            phone: displayPhone,
          });
        },
      );
      setFieldErrors(errs ?? {});
    },
    [attemptSubmit, contactForm, hours, pkgName, selectedAddons, selectedAI, bundleActive, total],
  );

  const sections: PhotographyAddonSection[] = ["core", "pre", "during", "post"];

  return (
    <div className={cn("min-w-0 max-w-full pb-28", className)}>
      <div className="mx-auto min-w-0 max-w-3xl space-y-5">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <p className="mb-3 text-[0.65rem] font-bold tracking-widest text-muted-foreground uppercase">
            כמה שעות צילום
          </p>

          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {HOUR_PRESETS.map((preset) => {
              const isActive = activePresetHours === preset.hours;
              return (
                <button
                  key={preset.hours}
                  type="button"
                  onClick={() => setHours(preset.hours)}
                  className={cn(
                    "relative rounded-xl border p-3 text-right transition-colors",
                    isActive
                      ? "border-brand-red bg-brand-red/5 shadow-[0_0_0_3px_rgba(212,43,43,0.08)]"
                      : "border-border hover:border-brand-red/30",
                  )}
                >
                  {preset.badge ? (
                    <span className="absolute -top-px right-1/2 translate-x-1/2 rounded-b-md bg-brand-red px-2 py-0.5 text-[0.65rem] font-bold text-white">
                      {preset.badge}
                    </span>
                  ) : null}
                  {preset.badge ? <span className="block h-3" aria-hidden /> : null}
                  <p className="mb-1 text-[0.65rem] font-bold tracking-wider text-muted-foreground uppercase">
                    {preset.name}
                  </p>
                  <p className="mb-1 text-2xl font-bold leading-none text-foreground">
                    {preset.hours}
                    <span className="text-sm"> שע׳</span>
                  </p>
                  <p className="mb-2 text-[0.65rem] leading-snug text-muted-foreground">
                    {preset.sub}
                  </p>
                  <p className="text-sm font-bold text-brand-red">
                    {formatCurrency(preset.hours * HOURLY_RATE)}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mb-4 rounded-xl border border-border bg-background p-4">
            <p className="mb-0.5 text-xs font-semibold text-brand-red">{pkgName}</p>
            <p className="text-sm text-muted-foreground">{pkgSub}</p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">התאמה אישית</span>
              <span className="text-sm font-bold text-brand-red">
                {hours} שעות · {formatCurrency(hours * HOURLY_RATE)}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={16}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer accent-brand-red"
              aria-label="מספר שעות צילום"
            />
            <div className="mt-1.5 flex justify-between text-[0.65rem] text-muted-foreground">
              <span>1 שעה</span>
              <span>16 שעות</span>
            </div>
            <p className="mt-2 text-center text-[0.65rem] text-muted-foreground">
              {formatCurrency(HOURLY_RATE)} לשעה · כולל עריכה ומסירה דיגיטלית
            </p>
          </div>
        </section>

        {sections.map((section) => {
          const items = PHOTOGRAPHY_ADDONS.filter((a) => a.section === section);
          return (
            <section key={section}>
              <p className="mb-3 text-[0.65rem] font-bold tracking-widest text-muted-foreground uppercase">
                {ADDON_SECTION_LABELS[section]}
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {items.map((addon) => (
                  <SelectableRow
                    key={addon.id}
                    label={addon.label}
                    sublabel={addon.sublabel}
                    price={addon.price}
                    selected={selectedAddons.has(addon.id)}
                    onToggle={() => toggleAddon(addon.id)}
                  />
                ))}
              </div>
            </section>
          );
        })}

        <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">שירותי AI לצילום</h3>
            <span className="rounded border border-amber-300 bg-white px-2 py-0.5 text-[0.65rem] font-bold tracking-widest text-amber-800">
              AI
            </span>
          </div>
          <p className="mb-4 text-[0.7rem] text-muted-foreground">
            הנחה של {formatCurrency(AI_BUNDLE_DISCOUNT)} בבחירת שני שירותים ומעלה.
          </p>

          {bundleActive ? (
            <p className="mb-4 rounded-lg border border-amber-300 bg-amber-100/80 px-3 py-2 text-sm font-semibold text-amber-900">
              הנחת חבילת AI פעילה - חיסכון של {formatCurrency(AI_BUNDLE_DISCOUNT)}
            </p>
          ) : aiCount === 1 ? (
            <p className="mb-4 rounded-lg border border-border bg-surface px-3 py-2 text-[0.7rem] text-muted-foreground">
              הוסיפו עוד שירות AI אחד וקבלו הנחת חבילה של {formatCurrency(AI_BUNDLE_DISCOUNT)}
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-3">
            {PHOTOGRAPHY_AI_SERVICES.map((svc) => (
              <SelectableRow
                key={svc.id}
                label={svc.label}
                sublabel={svc.sublabel}
                price={svc.price}
                selected={selectedAI.has(svc.id)}
                onToggle={() => toggleAI(svc.id)}
                accent="ai"
              />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-brand-red/30 bg-brand-red/5 p-6">
          <HoneypotField value={honeypot} onChange={setHoneypot} />
          <LeadFormAlert message={globalError} className="mb-4" />
          <h3 className="mb-4 text-base font-bold text-foreground">📋 פרטי קשר לשמירת תאריך</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="photo-name" className="mb-1.5 block text-xs font-semibold text-foreground">
                שם מלא *
              </label>
              <input
                id="photo-name"
                type="text"
                value={contactForm.name}
                onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="הכנס שם מלא"
                aria-invalid={Boolean(fieldErrors.name)}
                className={cn(
                  "w-full rounded-xl border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20",
                  fieldErrors.name ? "border-brand-red" : "border-border",
                )}
              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-brand-red" data-field-error="">{fieldErrors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="photo-phone" className="mb-1.5 block text-xs font-semibold text-foreground">
                טלפון *
              </label>
              <input
                id="photo-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={contactForm.phone}
                onChange={(e) => setContactForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="050-0000000"
                aria-invalid={Boolean(fieldErrors.phone)}
                className={cn(
                  "w-full rounded-xl border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20",
                  fieldErrors.phone ? "border-brand-red" : "border-border",
                )}
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-xs text-brand-red" data-field-error="">{fieldErrors.phone}</p>
              )}
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <BookWhatHappensNext
              steps={[
                { number: 1, title: "שולחים הודעה בוואטסאפ", body: "עם שעות הצילום והתוספות" },
                { number: 2, title: "מתאמים תאריך ומיקום", body: "פרטי האירוע והלוקיישן" },
                { number: 3, title: "יום הצילום", body: "צלם מקצועי + עריכה ומסירה" },
              ]}
            />
            <BookTrustBadges badges={[{ icon: "🔄", label: "סבב תיקונים אחד בעריכה" }]} />
            {previewBody ? <BookingWhatsAppPreview messageBody={previewBody} /> : null}
          </div>
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
        </section>
      </div>

      <BookingPaymentTrust className="mx-auto max-w-3xl" />

      <CalculatorStickyBar
        total={total}
        subLabel={bundleActive ? `חיסכון: ${formatCurrency(AI_BUNDLE_DISCOUNT)}` : undefined}
        whatsappHref=""
        showCta
        continueDisabled={!formValid}
        startNowDisabled={!formValid}
        onContinueClick={() => handleAction("continue_chat")}
        onStartNowClick={() => handleAction("start_now")}
        continueLabel={BOOKING_CTA.continue_chat}
        startNowLabel={BOOKING_CTA.start_now}
      />
    </div>
  );
}
