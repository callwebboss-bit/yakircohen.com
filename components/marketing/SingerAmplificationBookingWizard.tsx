"use client";

import { useEffect, useMemo, useState } from "react";
import BookingApprovals from "@/components/booking/BookingApprovals";
import BookingPaymentTrust from "@/components/booking/BookingPaymentTrust";
import BookingSummaryActions from "@/components/booking/BookingSummaryActions";
import BookingStepPanel from "@/components/booking/BookingStepPanel";
import BookingWizardNav from "@/components/booking/BookingWizardNav";
import BookingSuccessPanel from "@/components/booking/BookingSuccessPanel";
import PhoneInputField from "@/components/forms/PhoneInputField";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useBookingDraft } from "@/hooks/useBookingDraft";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import {
  SINGER_PACKAGES,
  type SingerPackageId,
} from "@/lib/data/singer-amplification-page";
import {
  BOOKING_SUMMARY_INTRO,
  BOOKING_CONSULT_15_MIN,
} from "@/lib/data/booking-shared";
import {
  formatPhoneForDisplay,
  sanitizeLeadText,
  validateBookingLead,
} from "@/lib/form-validation";
import { buildBookingWhatsAppBody, readUtmSource } from "@/lib/booking-messages";
import { notifyLeadByEmail } from "@/lib/lead-email-notify";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const STEPS = ["חבילה", "פרטים", "סיכום"] as const;

const consultHref = buildWhatsAppHref({
  text: BOOKING_CONSULT_15_MIN.whatsappText,
  utm_source: "website",
  utm_campaign: BOOKING_CONSULT_15_MIN.utmCampaign,
});

type FormState = {
  packageId: SingerPackageId | "";
  name: string;
  phone: string;
  date: string;
  time: string;
  location: string;
  notes: string;
  termsAccepted: boolean;
};

const INITIAL: FormState = {
  packageId: "",
  name: "",
  phone: "",
  date: "",
  time: "",
  location: "",
  notes: "",
  termsAccepted: false,
};

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-fast ease-luxury focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20";

export type SingerAmplificationBookingWizardProps = {
  initialPackageId?: SingerPackageId | null;
};

export default function SingerAmplificationBookingWizard({
  initialPackageId = null,
}: SingerAmplificationBookingWizardProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(() => ({
    ...INITIAL,
    packageId: initialPackageId ?? "",
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [lastWaHref, setLastWaHref] = useState("");
  const { honeypot, setHoneypot, globalError, attemptSubmit } = useLeadFormGuard({
    formId: "singer_amplification_booking",
  });

  const draft = useBookingDraft(
    "singer_amplification",
    form,
    setForm,
    (s) => s,
    (raw) => (raw && typeof raw === "object" ? (raw as FormState) : null),
  );

  useEffect(() => {
    if (!initialPackageId) return;
    setForm((prev) =>
      prev.packageId ? prev : { ...prev, packageId: initialPackageId },
    );
  }, [initialPackageId]);

  const selected = SINGER_PACKAGES.find((p) => p.id === form.packageId);
  const today = new Date().toISOString().split("T")[0];

  const canStep0 = form.packageId !== "";
  const canStep1 = useMemo(
    () => Boolean(form.name.trim() && form.phone.trim()),
    [form.name, form.phone],
  );

  const handleAction = (intent: "continue_chat" | "start_now") => {
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
        const body = buildBookingWhatsAppBody({
          intent,
          serviceLabel: selected ? `הגברה לזמר/ה - ${selected.name}` : "הגברה לזמר/ה",
          summaryLines: [
            ...(form.date ? [{ label: "תאריך", value: form.date }] : []),
            ...(form.time ? [{ label: "שעה", value: form.time }] : []),
            ...(form.location ? [{ label: "מיקום", value: sanitizeLeadText(form.location, 120) }] : []),
            ...(selected ? [{ label: "חבילה", value: `${selected.name} (${selected.price})` }] : []),
            ...(form.notes ? [{ label: "הערות", value: sanitizeLeadText(form.notes, 500) }] : []),
          ],
          contact: { name: sanitizeLeadText(form.name, 60), phone: displayPhone },
          utmSource: readUtmSource(),
        });
        const href = buildWhatsAppHref({
          text: body,
          utm_source: "website",
          utm_campaign: "singer_amplification_booking",
        });
        openWhatsAppLead(href);
        notifyLeadByEmail({
          formId: "singer_amplification_booking",
          subject: "הזמנת הגברה לזמרים",
          body,
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
    setForm({ ...INITIAL, packageId: initialPackageId ?? "" });
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

      <BookingWizardNav steps={STEPS} currentStep={step} label="שלבי הזמנת הגברה לזמרים" />

      {step === 0 && (
        <BookingStepPanel stepKey={0}>
          <h2 className="text-xl font-semibold text-foreground">בחרו חבילת הגברה</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            מחירים גלויים · שינויים אפשריים במעמד העסקה
          </p>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {SINGER_PACKAGES.map((pkg) => {
              const active = form.packageId === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, packageId: pkg.id }))}
                  className={cn(
                    "flex flex-col rounded-2xl border p-5 text-start",
                    active ? "border-brand-red bg-brand-red/5" : "border-border bg-background",
                  )}
                  aria-pressed={active}
                >
                  {pkg.badge ? (
                    <span className="text-xs font-bold text-brand-red">{pkg.badge}</span>
                  ) : null}
                  <p className="mt-1 font-semibold text-foreground">{pkg.name}</p>
                  <p className="mt-1 text-lg font-bold text-brand-red">{pkg.price}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{pkg.suitedFor}</p>
                </button>
              );
            })}
          </div>
          <StepNav onNext={() => setStep(1)} nextDisabled={!canStep0} showBack={false} />
        </BookingStepPanel>
      )}

      {step === 1 && (
        <BookingStepPanel stepKey={1}>
          <h2 className="text-xl font-semibold text-foreground">פרטי הופעה ותיאום</h2>
          <div className="relative max-w-lg space-y-4">
            <HoneypotField value={honeypot} onChange={setHoneypot} />
            <LeadFormAlert message={globalError} />
            <Field id="sg-name" label="שם *" value={form.name} error={errors.name} onChange={(v) => setForm((p) => ({ ...p, name: v }))} />
            <PhoneInputField
              id="sg-phone"
              value={form.phone}
              onChange={(v) => setForm((p) => ({ ...p, phone: v }))}
              error={errors.phone}
            />
            <div className="grid grid-cols-2 gap-3">
              <Field id="sg-date" label="תאריך *" type="date" min={today} value={form.date} error={errors.date} onChange={(v) => setForm((p) => ({ ...p, date: v }))} />
              <Field id="sg-time" label="שעה *" type="time" value={form.time} error={errors.time} onChange={(v) => setForm((p) => ({ ...p, time: v }))} />
            </div>
            <Field id="sg-location" label="מיקום ההופעה *" value={form.location} error={errors.location} onChange={(v) => setForm((p) => ({ ...p, location: v }))} />
            <Field id="sg-notes" label="הערות (סגנון, מספר מיקרופונים וכו')" multiline value={form.notes} onChange={(v) => setForm((p) => ({ ...p, notes: v }))} />
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
              <p className="mt-2 text-xl font-bold text-brand-red">{selected.price}</p>
              <p className="mt-3 text-sm text-muted-foreground">
                {form.date} · {form.time}
              </p>
              <p className="text-sm text-muted-foreground">{form.location}</p>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{BOOKING_SUMMARY_INTRO}</p>
              <BookingApprovals
                variant="light"
                termsAccepted={form.termsAccepted}
                onTermsChange={(v) => setForm((p) => ({ ...p, termsAccepted: v }))}
                termsError={errors.terms}
              />
              <BookingSummaryActions
                continueWhatsApp={{
                  label: "המשך בוואטסאפ",
                  onClick: () => handleAction("continue_chat"),
                }}
                startNow={{
                  label: "שליחה והתחלה מיידית",
                  onClick: () => handleAction("start_now"),
                }}
                consult15Min={{
                  label: BOOKING_CONSULT_15_MIN.title,
                  href: consultHref,
                }}
              />
              <BookingPaymentTrust />
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
