"use client";

import { useMemo, useState } from "react";
import BookingApprovals from "@/components/booking/BookingApprovals";
import BookingConsultCta from "@/components/booking/BookingConsultCta";
import BookingStepPanel from "@/components/booking/BookingStepPanel";
import BookingWizardNav from "@/components/booking/BookingWizardNav";
import BookingSuccessPanel from "@/components/booking/BookingSuccessPanel";
import PriceWithVat from "@/components/booking/PriceWithVat";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useBookingDraft } from "@/hooks/useBookingDraft";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import { STUDIO_BOOKING_APPROVALS } from "@/lib/data/studio-recording-booking";
import {
  EVENT_BOOKING_ITEMS,
  EVENT_BUNDLE_BADGE_LABELS,
  EVENT_GIFT_THRESHOLD,
  getEventBundlePrice,
  type EventBookingItemId,
} from "@/lib/data/events-booking";
import { withVat } from "@/lib/data/pricing";
import {
  formatPhoneForDisplay,
  sanitizeLeadText,
  validateBookingLead,
} from "@/lib/form-validation";
import { notifyLeadByEmail } from "@/lib/lead-email-notify";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const STEPS = ["אטרקציות", "פרטים", "סיכום"] as const;

type FormState = {
  selected: EventBookingItemId[];
  name: string;
  phone: string;
  date: string;
  time: string;
  location: string;
  notes: string;
  termsAccepted: boolean;
};

const INITIAL: FormState = {
  selected: [],
  name: "",
  phone: "",
  date: "",
  time: "",
  location: "",
  notes: "",
  termsAccepted: false,
};

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20";

export default function EventsBookingWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [lastWaHref, setLastWaHref] = useState("");
  const { honeypot, setHoneypot, globalError, attemptSubmit } = useLeadFormGuard({
    formId: "events_booking_wizard",
  });

  const draft = useBookingDraft(
    "events",
    form,
    setForm,
    (s) => s,
    (raw) => (raw && typeof raw === "object" ? (raw as FormState) : null),
  );

  const count = form.selected.length;
  const bundleTotal = getEventBundlePrice(count);
  const singleTotal = count * 1750;
  const savings = singleTotal - bundleTotal;
  const today = new Date().toISOString().split("T")[0];

  const toggle = (id: EventBookingItemId) => {
    setForm((prev) => {
      const has = prev.selected.includes(id);
      return {
        ...prev,
        selected: has
          ? prev.selected.filter((x) => x !== id)
          : [...prev.selected, id],
      };
    });
  };

  const labels = useMemo(
    () =>
      form.selected
        .map((id) => EVENT_BOOKING_ITEMS.find((i) => i.id === id)?.name)
        .filter(Boolean),
    [form.selected],
  );

  const handleSubmit = () => {
    if (!form.termsAccepted) {
      setErrors({ terms: "יש לאשר את התנאים לפני שליחה" });
      return;
    }
    const fieldErrs = attemptSubmit(
      () =>
        validateBookingLead({
          name: form.name,
          phone: form.phone,
          date: form.date,
          time: form.time,
          location: form.location,
          notes: form.notes,
          requireLocation: true,
        }),
      (result) => {
        const displayPhone = result.normalizedPhone
          ? formatPhoneForDisplay(result.normalizedPhone)
          : form.phone.trim();
        const message = [
          "הזמנת אטרקציות לאירוע 🎉",
          "",
          `שם: ${sanitizeLeadText(form.name, 60)}`,
          `טלפון: ${displayPhone}`,
          `תאריך: ${form.date} · שעה: ${form.time}`,
          `מיקום: ${sanitizeLeadText(form.location, 120)}`,
          "",
          `אטרקציות (${count}):`,
          ...labels.map((n) => `• ${n}`),
          count >= EVENT_GIFT_THRESHOLD ? "🎁 מתנה: מצגת תמונות חינם בחבילת 4+" : null,
          "",
          `סה"כ חבילה: ${bundleTotal.toLocaleString()} ₪ לפני מע״מ`,
          `כולל מע״מ: ${withVat(bundleTotal).toLocaleString()} ₪`,
          savings > 0 ? `(חיסכון ${savings.toLocaleString()} ₪ לעומת בודד)` : null,
          form.notes ? `\nהערות: ${sanitizeLeadText(form.notes, 500)}` : null,
        ]
          .filter(Boolean)
          .join("\n");
        const href = buildWhatsAppHref({
          text: message,
          utm_source: "website",
          utm_campaign: "events_booking_wizard",
        });
        openWhatsAppLead(href);
        notifyLeadByEmail({
          formId: "events_booking_wizard",
          subject: "הזמנת אטרקציות לאירוע",
          body: message,
          name: form.name,
          phone: displayPhone,
        });
        setLastWaHref(href);
        setSubmitted(true);
        draft.clear();
      },
    );
    setErrors(fieldErrs ?? {});
  };

  const resetWizard = () => {
    setForm(INITIAL);
    setStep(0);
    setSubmitted(false);
    setErrors({});
  };

  if (submitted && lastWaHref) {
    return (
      <BookingSuccessPanel whatsappHref={lastWaHref} onNewBooking={resetWizard} />
    );
  }

  return (
    <div className="space-y-8">
      {draft.restored ? (
        <p className="rounded-lg border border-brand-red/20 bg-brand-red/5 px-4 py-2 text-xs text-muted-foreground">
          שחזרנו את הטיוטה האחרונה שלכם מהדפדפן.
        </p>
      ) : null}

      <BookingWizardNav steps={STEPS} currentStep={step} label="שלבי הזמנת אטרקציות" />

      {step === 0 && (
        <BookingStepPanel stepKey={0}>
          <h2 className="text-xl font-semibold text-foreground">בחרו אטרקציות</h2>
          <p className="text-sm text-muted-foreground">
            2 אטרקציות = חבילה · 4+ = מתנת מצגת תמונות
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {EVENT_BOOKING_ITEMS.map((item) => {
              const active = form.selected.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggle(item.id)}
                  className={cn(
                    "rounded-xl border p-4 text-start",
                    active ? "border-brand-red bg-brand-red/5" : "border-border",
                  )}
                  aria-pressed={active}
                >
                  <span className="text-2xl" aria-hidden="true">
                    {item.icon}
                  </span>
                  <p className="mt-2 text-sm font-semibold text-foreground">{item.name}</p>
                  {item.badge ? (
                    <span className="text-xs text-brand-red">
                      {EVENT_BUNDLE_BADGE_LABELS[item.badge]}
                    </span>
                  ) : null}
                  <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                </button>
              );
            })}
          </div>
          {count > 0 ? (
            <div className="rounded-xl border border-border bg-surface p-4">
              <PriceWithVat amountExVat={bundleTotal} size="lg" />
              {savings > 0 ? (
                <p className="mt-1 text-xs text-green-700">
                  חיסכון {savings.toLocaleString()} ₪ לעומת רכישה נפרדת
                </p>
              ) : null}
            </div>
          ) : null}
          <StepNav
            onNext={() => setStep(1)}
            nextDisabled={count === 0}
            showBack={false}
          />
        </BookingStepPanel>
      )}

      {step === 1 && (
        <BookingStepPanel stepKey={1}>
          <h2 className="text-xl font-semibold text-foreground">פרטי האירוע</h2>
          <div className="relative max-w-lg space-y-4">
            <HoneypotField value={honeypot} onChange={setHoneypot} />
            <LeadFormAlert message={globalError} />
            <input className={inputClass} placeholder="שם *" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} aria-label="שם" />
            <input className={inputClass} type="tel" placeholder="טלפון *" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} aria-label="טלפון" />
            <div className="grid grid-cols-2 gap-3">
              <input className={inputClass} type="date" min={today} value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} aria-label="תאריך" />
              <input className={inputClass} type="time" value={form.time} onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))} aria-label="שעה" />
            </div>
            <input className={inputClass} placeholder="שם האולם / מיקום *" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} aria-label="מיקום" />
            <textarea className={cn(inputClass, "resize-none")} rows={3} placeholder="הערות" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} aria-label="הערות" />
          </div>
          <StepNav onBack={() => setStep(0)} onNext={() => setStep(2)} />
        </BookingStepPanel>
      )}

      {step === 2 && count > 0 && (
        <BookingStepPanel stepKey={2}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="font-semibold">סיכום ({count} אטרקציות)</h2>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {labels.map((n) => (
                  <li key={n}>• {n}</li>
                ))}
              </ul>
              <PriceWithVat amountExVat={bundleTotal} size="lg" className="mt-4" />
            </div>
            <div className="space-y-4">
              <BookingApprovals
                copy={STUDIO_BOOKING_APPROVALS}
                termsAccepted={form.termsAccepted}
                onTermsChange={(v) => setForm((p) => ({ ...p, termsAccepted: v }))}
                onAcceptAll={() => setForm((p) => ({ ...p, termsAccepted: true }))}
                termsError={errors.terms}
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!form.termsAccepted}
                className="w-full rounded-xl bg-brand-red py-3.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                שליחה בוואטסאפ
              </button>
              <BookingConsultCta />
            </div>
          </div>
        </BookingStepPanel>
      )}
    </div>
  );
}

function StepNav({
  onBack,
  onNext,
  nextDisabled,
  showBack = true,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  showBack?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3 border-t border-border pt-6">
      {showBack && onBack ? (
        <button type="button" onClick={onBack} className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold">
          חזרה
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="rounded-xl bg-brand-red px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        המשך
      </button>
    </div>
  );
}
