"use client";

import { useMemo, useState } from "react";
import BookingApprovals from "@/components/booking/BookingApprovals";
import KoalendarModal from "@/components/booking/KoalendarModal";
import BookingPaymentTrust from "@/components/booking/BookingPaymentTrust";
import BookingSummaryActions from "@/components/booking/BookingSummaryActions";
import BookingStepPanel from "@/components/booking/BookingStepPanel";
import BookingWizardNav from "@/components/booking/BookingWizardNav";
import BookingSuccessPanel from "@/components/booking/BookingSuccessPanel";
import PhoneInputField from "@/components/forms/PhoneInputField";
import PriceWithVat from "@/components/booking/PriceWithVat";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useBookingDraft } from "@/hooks/useBookingDraft";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import {
  PODCAST_OVERTIME_RATE,
  PODCAST_PACKAGES,
  type PodcastPackageId,
} from "@/lib/data/podcast-calculator";
import { withVat } from "@/lib/data/pricing";
import {
  BOOKING_CTA,
  BOOKING_SUMMARY_INTRO,
  BOOKING_CONSULT_15_MIN,
} from "@/lib/data/booking-shared";
import {
  formatPhoneForDisplay,
  sanitizeLeadText,
  validateBookingLead,
} from "@/lib/form-validation";
import {
  buildBookingWhatsAppBody,
  readUtmSource,
} from "@/lib/booking-messages";
import { notifyLeadByEmail } from "@/lib/lead-email-notify";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const STEPS = ["חבילה", "פרטים", "סיכום"] as const;

const TIMEFRAME_OPTIONS = [
  { value: "", label: "מתי מתאים לכם?" },
  { value: "asap", label: "בהקדם האפשרי" },
  { value: "next_week", label: "שבוע הקרוב" },
  { value: "this_month", label: "בחודש הקרוב" },
  { value: "exploring", label: "רק בודק/ת אפשרויות" },
] as const;

type FormState = {
  packageId: PodcastPackageId | "";
  overtimeBlocks: number;
  name: string;
  phone: string;
  timeframe: string;
  notes: string;
  termsAccepted: boolean;
};

const INITIAL: FormState = {
  packageId: "",
  overtimeBlocks: 0,
  name: "",
  phone: "",
  timeframe: "",
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
  const [lastIntent, setLastIntent] = useState<"continue_chat" | "start_now">("continue_chat");
  const [koalendarOpen, setKoalendarOpen] = useState(false);
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
  const packageTotal = (selected?.price ?? 0) + form.overtimeBlocks * PODCAST_OVERTIME_RATE;

  const canStep0 = form.packageId !== "";

  const buildSummaryContext = () => {
    const displayPhone = form.phone.trim()
      ? formatPhoneForDisplay(form.phone.trim())
      : "";
    const timeframeLabel =
      TIMEFRAME_OPTIONS.find((o) => o.value === form.timeframe)?.label ?? "";
    const summaryLines = [
      ...(selected ? [{ label: "חבילה", value: selected.name }] : []),
      ...(form.overtimeBlocks > 0
        ? [
            {
              label: "זמן נוסף",
              value: `+${form.overtimeBlocks * 30} דק׳ (+${(form.overtimeBlocks * PODCAST_OVERTIME_RATE).toLocaleString("he-IL")} ₪)`,
            },
          ]
        : []),
      ...(timeframeLabel ? [{ label: "מועד מועדף", value: timeframeLabel }] : []),
      ...(form.notes ? [{ label: "הערות", value: sanitizeLeadText(form.notes, 500) }] : []),
    ];
    return {
      summaryLines,
      contact: {
        name: sanitizeLeadText(form.name, 60),
        phone: displayPhone,
      },
    };
  };

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
          date: "",
          time: "",
          location: "",
          notes: form.notes,
          requireLocation: false,
          requireDate: false,
          requireTime: false,
        }),
      (result) => {
        const displayPhone = result.normalizedPhone
          ? formatPhoneForDisplay(result.normalizedPhone)
          : form.phone.trim();
        const { summaryLines } = buildSummaryContext();
        const body = buildBookingWhatsAppBody({
          intent,
          serviceLabel: selected ? `פודקאסט - ${selected.name}` : "פודקאסט",
          summaryLines,
          contact: { name: sanitizeLeadText(form.name, 60), phone: displayPhone },
          totalEstimate: selected ? withVat(packageTotal) : undefined,
          utmSource: readUtmSource(),
        });
        const href = buildWhatsAppHref({
          text: body,
          utm_source: "website",
          utm_campaign: "podcast_booking_wizard",
        });
        openWhatsAppLead(href);
        notifyLeadByEmail({
          formId: "podcast_booking_wizard",
          subject: "הזמנת פודקאסט",
          body,
          name: form.name,
          phone: displayPhone,
        });
        setLastIntent(intent);
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
      <BookingSuccessPanel
        intent={lastIntent}
        whatsappHref={lastWaHref}
        onNewBooking={resetWizard}
      />
    );
  }

  return (
    <div className="min-w-0 max-w-full space-y-8">
      {draft.restored && draft.savedAt ? (
        <p className="rounded-lg border border-brand-red/20 bg-brand-red/5 px-4 py-2 text-xs text-muted-foreground">
          שחזרנו טיוטה שמורה מ-
          {new Date(draft.savedAt).toLocaleDateString("he-IL", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
          .{" "}
          <button
            type="button"
            onClick={() => { draft.clear(); }}
            className="underline hover:text-brand-red"
          >
            נקה
          </button>
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
                  onClick={() =>
                    setForm((p) => ({ ...p, packageId: pkg.id, overtimeBlocks: 0 }))
                  }
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
          {selected ? (
            <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">
                גלישה בזמן · {PODCAST_OVERTIME_RATE.toLocaleString("he-IL")} ₪ לכל 30 דקות
              </p>
              <p className="mb-3 text-sm font-semibold text-foreground">כמה זמן הקלטה נוסף?</p>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, overtimeBlocks: b }))}
                    className={cn(
                      "rounded-xl border px-4 py-2 text-sm font-semibold transition-colors",
                      form.overtimeBlocks === b
                        ? "border-brand-red bg-brand-red text-white"
                        : "border-border bg-background hover:border-brand-red/40",
                    )}
                  >
                    {b === 0
                      ? "ללא גלישה"
                      : `+${b * 30} דק׳ (+${(b * PODCAST_OVERTIME_RATE).toLocaleString("he-IL")} ₪)`}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Comparison table */}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[28rem] text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="px-4 py-2.5 text-start text-xs font-semibold text-muted-foreground">
                    מה כלול
                  </th>
                  {PODCAST_PACKAGES.map((pkg) => (
                    <th
                      key={pkg.id}
                      className="px-3 py-2.5 text-center text-xs font-semibold text-foreground"
                    >
                      {pkg.name.split(" - ")[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    { label: "הקלטה באולפן", ids: ["starter", "audio", "video", "social"] },
                    { label: "עריכה ומיקס", ids: ["audio", "video", "social"] },
                    { label: "מאסטרינג", ids: ["audio", "video", "social"] },
                    { label: "העלאה לספוטיפיי", ids: ["audio", "video", "social"] },
                    { label: "הקלטת וידאו (3 מצלמות)", ids: ["video", "social"] },
                    { label: "3 קטעי רילס", ids: ["social"] },
                    { label: "העלאה לאפל + יוטיוב", ids: ["social"] },
                  ] as { label: string; ids: string[] }[]
                ).map((row, ri) => (
                  <tr
                    key={row.label}
                    className={cn("border-b border-border last:border-0", ri % 2 === 1 && "bg-surface/50")}
                  >
                    <td className="px-4 py-2 text-xs text-foreground">{row.label}</td>
                    {PODCAST_PACKAGES.map((pkg) => (
                      <td key={pkg.id} className="px-3 py-2 text-center text-base">
                        {row.ids.includes(pkg.id) ? (
                          <span className="text-green-600" aria-label="כלול">✓</span>
                        ) : (
                          <span className="text-muted-foreground/40" aria-label="לא כלול">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
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
            <PhoneInputField
              id="pb-phone"
              value={form.phone}
              onChange={(v) => setForm((p) => ({ ...p, phone: v }))}
              error={errors.phone}
            />
            <div>
              <label htmlFor="pb-timeframe" className="mb-1.5 block text-xs font-semibold">
                מועד מועדף
              </label>
              <select
                id="pb-timeframe"
                value={form.timeframe}
                onChange={(e) => setForm((p) => ({ ...p, timeframe: e.target.value }))}
                className={cn(inputClass, "appearance-none")}
              >
                {TIMEFRAME_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} disabled={o.value === ""}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <Field id="pb-notes" label="הערות" multiline value={form.notes} onChange={(v) => setForm((p) => ({ ...p, notes: v }))} />
          </div>
          <StepNav onBack={() => setStep(0)} onNext={() => setStep(2)} nextDisabled={!canStep1} />
        </BookingStepPanel>
      )}

      {step === 2 && selected && (
        <BookingStepPanel stepKey={2}>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
          >
            → ערוך בחירה
          </button>
          <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="font-semibold text-foreground">סיכום</h2>
              <p className="mt-2 text-sm text-muted-foreground">{selected.name}</p>
              {form.overtimeBlocks > 0 ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  +{form.overtimeBlocks * 30} דק׳ הקלטה נוספת
                </p>
              ) : null}
              <PriceWithVat amountExVat={packageTotal} size="lg" className="mt-4" />
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
                disabled={!form.termsAccepted}
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
                  onClick: () => setKoalendarOpen(true),
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

      <KoalendarModal open={koalendarOpen} onClose={() => setKoalendarOpen(false)} />
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
