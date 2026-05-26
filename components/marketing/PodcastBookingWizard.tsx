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
  PODCAST_PACKAGES,
  type PodcastPackageId,
} from "@/lib/data/podcast-calculator";
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

const STEPS = ["חבילה", "פרטים", "סיכום"] as const;

type FormState = {
  packageId: PodcastPackageId | "";
  name: string;
  phone: string;
  date: string;
  time: string;
  notes: string;
  termsAccepted: boolean;
};

const INITIAL: FormState = {
  packageId: "",
  name: "",
  phone: "",
  date: "",
  time: "",
  notes: "",
  termsAccepted: false,
};

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-fast ease-luxury focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20";

export default function PodcastBookingWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [lastWaHref, setLastWaHref] = useState("");
  const { honeypot, setHoneypot, globalError, attemptSubmit } = useLeadFormGuard({
    formId: "podcast_booking_wizard",
  });

  const draft = useBookingDraft(
    "podcast",
    form,
    setForm,
    (s) => s,
    (raw) => (raw && typeof raw === "object" ? (raw as FormState) : null),
  );

  const selected = PODCAST_PACKAGES.find((p) => p.id === form.packageId);
  const today = new Date().toISOString().split("T")[0];

  const canStep0 = form.packageId !== "";
  const canStep1 = useMemo(
    () => form.name.trim() && form.phone.trim() && form.date && form.time,
    [form.name, form.phone, form.date, form.time],
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
          location: "",
          notes: form.notes,
          requireLocation: false,
        }),
      (result) => {
        const displayPhone = result.normalizedPhone
          ? formatPhoneForDisplay(result.normalizedPhone)
          : form.phone.trim();
        const message = [
          "הזמנת פודקאסט 🎙️",
          "",
          `שם: ${sanitizeLeadText(form.name, 60)}`,
          `טלפון: ${displayPhone}`,
          `תאריך: ${form.date} · שעה: ${form.time}`,
          selected ? `חבילה: ${selected.name} (${selected.price.toLocaleString()} ₪ לפני מע״מ)` : null,
          selected
            ? `כולל מע״מ: ${withVat(selected.price).toLocaleString()} ₪`
            : null,
          "",
          STUDIO_BOOKING_APPROVALS.pricingNote,
          "✓ אישרתי את התנאים",
          form.notes ? `\nהערות: ${sanitizeLeadText(form.notes, 500)}` : null,
        ]
          .filter(Boolean)
          .join("\n");
        const href = buildWhatsAppHref({
          text: message,
          utm_source: "website",
          utm_campaign: "podcast_booking_wizard",
        });
        openWhatsAppLead(href);
        notifyLeadByEmail({
          formId: "podcast_booking_wizard",
          subject: "הזמנת פודקאסט",
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

      <BookingWizardNav steps={STEPS} currentStep={step} label="שלבי הזמנת פודקאסט" />

      {step === 0 && (
        <BookingStepPanel stepKey={0}>
          <h2 className="text-xl font-semibold text-foreground">בחרו חבילת פודקאסט</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {PODCAST_PACKAGES.map((pkg) => {
              const active = form.packageId === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, packageId: pkg.id }))}
                  className={cn(
                    "rounded-2xl border p-5 text-start",
                    active ? "border-brand-red bg-brand-red/5" : "border-border bg-background",
                  )}
                  aria-pressed={active}
                >
                  {pkg.badge ? (
                    <span className="text-xs font-bold text-brand-red">{pkg.badge}</span>
                  ) : null}
                  <p className="mt-1 font-semibold text-foreground">{pkg.name}</p>
                  <p className="text-xs text-muted-foreground">{pkg.subtitle}</p>
                  <div className="mt-3">
                    <PriceWithVat amountExVat={pkg.price} size="md" />
                  </div>
                </button>
              );
            })}
          </div>
          <StepNav onNext={() => setStep(1)} nextDisabled={!canStep0} showBack={false} />
        </BookingStepPanel>
      )}

      {step === 1 && (
        <BookingStepPanel stepKey={1}>
          <h2 className="text-xl font-semibold text-foreground">פרטים לתיאום</h2>
          <div className="relative max-w-lg space-y-4">
            <HoneypotField value={honeypot} onChange={setHoneypot} />
            <LeadFormAlert message={globalError} />
            <Field id="pb-name" label="שם *" value={form.name} error={errors.name} onChange={(v) => setForm((p) => ({ ...p, name: v }))} />
            <Field id="pb-phone" label="טלפון *" type="tel" value={form.phone} error={errors.phone} onChange={(v) => setForm((p) => ({ ...p, phone: v }))} />
            <div className="grid grid-cols-2 gap-3">
              <Field id="pb-date" label="תאריך *" type="date" min={today} value={form.date} error={errors.date} onChange={(v) => setForm((p) => ({ ...p, date: v }))} />
              <Field id="pb-time" label="שעה *" type="time" value={form.time} error={errors.time} onChange={(v) => setForm((p) => ({ ...p, time: v }))} />
            </div>
            <Field id="pb-notes" label="הערות" multiline value={form.notes} onChange={(v) => setForm((p) => ({ ...p, notes: v }))} />
          </div>
          <StepNav onBack={() => setStep(0)} onNext={() => setStep(2)} nextDisabled={!canStep1} />
        </BookingStepPanel>
      )}

      {step === 2 && selected && (
        <BookingStepPanel stepKey={2}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="font-semibold text-foreground">סיכום</h2>
              <p className="mt-2 text-sm text-muted-foreground">{selected.name}</p>
              <PriceWithVat amountExVat={selected.price} size="lg" className="mt-4" />
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
                className="w-full rounded-xl bg-brand-red py-3.5 text-sm font-semibold text-white hover:bg-brand-red-light disabled:cursor-not-allowed disabled:opacity-50"
              >
                שליחה בוואטסאפ
              </button>
              <BookingConsultCta />
              <button type="button" onClick={() => setStep(1)} className="w-full text-xs text-muted-foreground hover:text-brand-red">
                חזרה לפרטים
              </button>
            </div>
          </div>
        </BookingStepPanel>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  min,
  multiline,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  min?: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold">
        {label}
      </label>
      {multiline ? (
        <textarea id={id} rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={cn(inputClass, "resize-none")} />
      ) : (
        <input id={id} type={type} min={min} value={value} onChange={(e) => onChange(e.target.value)} className={cn(inputClass, error && "border-red-400")} />
      )}
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
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
