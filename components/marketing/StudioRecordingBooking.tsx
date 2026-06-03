"use client";

import { useState } from "react";
import BookingApprovals from "@/components/booking/BookingApprovals";
import BookingPaymentTrust from "@/components/booking/BookingPaymentTrust";
import BookingStepPanel from "@/components/booking/BookingStepPanel";
import BookingWizardNav from "@/components/booking/BookingWizardNav";
import BookingSuccessPanel from "@/components/booking/BookingSuccessPanel";
import PriceWithVat from "@/components/booking/PriceWithVat";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useBookingDraft } from "@/hooks/useBookingDraft";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import {
  buildBookingWhatsAppBody,
  readUtmSource,
} from "@/lib/booking-messages";
import {
  FILTER_QUESTIONS,
  type FilterAnswers,
} from "@/lib/data/filter-questions";
import { withVat } from "@/lib/data/pricing";
import {
  formatPhoneForDisplay,
  sanitizeLeadText,
  validateBookingLead,
} from "@/lib/form-validation";
import { notifyLeadByEmail } from "@/lib/lead-email-notify";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import {
  CONSULTATION_PACKAGES,
  RECORDING_ATMOSPHERES,
  RECORDING_TYPES,
  STUDIO_RECORDING_PACKAGES,
  STUDIO_SURPRISE_GIFT_NOTE,
  type AtmosphereId,
  type ConsultationPackageId,
  type RecordingTypeId,
  type StudioPackageId,
} from "@/lib/data/studio-recording-booking";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const STEPS = ["בחירה", "חבילה", "פרטים ואישור"] as const;

type FormState = {
  recordingType: RecordingTypeId | "";
  songName: string;
  referrer: string;
  atmosphere: AtmosphereId | "";
  packageId: StudioPackageId | ConsultationPackageId | "";
  surpriseGift: boolean;
  giftRecipientName: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  notes: string;
  termsAccepted: boolean;
};

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-fast ease-luxury focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20";

type DraftPayload = {
  recordingType: RecordingTypeId | "";
  songName: string;
  referrer: string;
  atmosphere: AtmosphereId | "";
  packageId: StudioPackageId | ConsultationPackageId | "";
  surpriseGift: boolean;
  giftRecipientName: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  notes: string;
  termsAccepted: boolean;
  step: number;
};

function FilterContextBanner({ filterAnswers }: { filterAnswers?: FilterAnswers | null }) {
  if (!filterAnswers) return null;
  const timelineOpt = FILTER_QUESTIONS[0].options.find((o) => o.id === filterAnswers.timeline);
  const purposeOpt = FILTER_QUESTIONS[1].options.find((o) => o.id === filterAnswers.purpose);
  if (!timelineOpt && !purposeOpt) return null;
  return (
    <div className="mb-6 flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 py-2 text-xs text-muted-foreground">
      {timelineOpt && (
        <span className="flex items-center gap-1 font-medium text-foreground">
          <span aria-hidden="true">{timelineOpt.icon}</span>
          {timelineOpt.label}
        </span>
      )}
      {timelineOpt && purposeOpt && (
        <span aria-hidden="true" className="select-none">
          ·
        </span>
      )}
      {purposeOpt && (
        <span className="flex items-center gap-1 font-medium text-foreground">
          <span aria-hidden="true">{purposeOpt.icon}</span>
          {purposeOpt.label}
        </span>
      )}
    </div>
  );
}

export default function StudioRecordingBooking({
  filterAnswers,
}: {
  filterAnswers?: FilterAnswers | null;
}) {
  const initialGiftMode = filterAnswers?.purpose === "gift";
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({
    recordingType: "",
    songName: "",
    referrer: "",
    atmosphere: "",
    packageId: "",
    surpriseGift: initialGiftMode,
    giftRecipientName: "",
    name: "",
    phone: "",
    date: "",
    time: "",
    notes: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [lastWaHref, setLastWaHref] = useState("");
  const [lastIntent, setLastIntent] = useState<"continue_chat" | "start_now">("continue_chat");
  const { honeypot, setHoneypot, globalError, attemptSubmit } = useLeadFormGuard({
    formId: "studio_recording_booking",
  });

  const draft = useBookingDraft<DraftPayload>(
    "studio-recording",
    { ...form, step },
    (payload) => {
      setForm({
        recordingType: payload.recordingType,
        songName: payload.songName,
        referrer: payload.referrer,
        atmosphere: payload.atmosphere,
        packageId: payload.packageId,
        surpriseGift: payload.surpriseGift || initialGiftMode,
        giftRecipientName: payload.giftRecipientName ?? "",
        name: payload.name,
        phone: payload.phone,
        date: payload.date,
        time: payload.time,
        notes: payload.notes,
        termsAccepted: payload.termsAccepted,
      });
      setStep(Math.min(payload.step, STEPS.length - 1));
    },
    (s) => s,
    (raw) => (raw && typeof raw === "object" ? (raw as DraftPayload) : null),
  );

  const isConsultation = form.recordingType === "song_promotion_consultation";
  const consultationPackage = isConsultation
    ? CONSULTATION_PACKAGES.find((p) => p.id === form.packageId)
    : undefined;
  const selectedPackage = isConsultation
    ? undefined
    : STUDIO_RECORDING_PACKAGES.find((p) => p.id === form.packageId);
  const activePackage = consultationPackage ?? selectedPackage;
  const total = activePackage?.price ?? 0;

  const recordingLabel = RECORDING_TYPES.find((t) => t.id === form.recordingType)?.label ?? "";
  const atmosphereLabel = RECORDING_ATMOSPHERES.find((a) => a.id === form.atmosphere)?.title ?? "";

  const canAdvanceStep0 =
    form.recordingType !== "" && (isConsultation || form.atmosphere !== "");
  const canAdvanceStep1 = form.packageId !== "";
  const progressPct = step === 0 ? 0 : step === 1 ? 50 : 100;

  const buildSummaryLines = () => [
    ...(filterAnswers
      ? [
          {
            label: "מטרה",
            value:
              FILTER_QUESTIONS[1].options.find((o) => o.id === filterAnswers.purpose)?.label ??
              filterAnswers.purpose,
          },
          {
            label: "לוח זמנים",
            value:
              FILTER_QUESTIONS[0].options.find((o) => o.id === filterAnswers.timeline)?.label ??
              filterAnswers.timeline,
          },
        ]
      : []),
    { label: "סוג", value: recordingLabel },
    ...(form.songName && !isConsultation
      ? [{ label: "שיר", value: sanitizeLeadText(form.songName, 80) }]
      : []),
    ...(form.referrer
      ? [{ label: "הופנה על ידי", value: sanitizeLeadText(form.referrer, 60) }]
      : []),
    ...(!isConsultation && atmosphereLabel
      ? [{ label: "אווירה", value: atmosphereLabel }]
      : []),
    ...(activePackage
      ? [
          {
            label: "מסלול",
            value: `${activePackage.name} (${activePackage.price.toLocaleString("he-IL")} ₪)`,
          },
        ]
      : []),
    ...(form.surpriseGift ? [{ label: "מתנת הפתעה", value: "כן" }] : []),
    ...(form.surpriseGift && form.giftRecipientName
      ? [{ label: "מתנה עבור", value: sanitizeLeadText(form.giftRecipientName, 60) }]
      : []),
    ...(form.date ? [{ label: "תאריך", value: form.date }] : []),
    ...(form.time ? [{ label: "שעה", value: form.time }] : []),
    ...(form.notes ? [{ label: "הערות", value: sanitizeLeadText(form.notes, 500) }] : []),
  ];

  const resetWizard = () => {
    setForm({
      recordingType: "",
      songName: "",
      referrer: "",
      atmosphere: "",
      packageId: "",
      surpriseGift: initialGiftMode,
      giftRecipientName: "",
      name: "",
      phone: "",
      date: "",
      time: "",
      notes: "",
      termsAccepted: false,
    });
    setStep(0);
    setSubmitted(false);
    setErrors({});
  };

  const goToStep = (n: number) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleAction = (intent: "continue_chat" | "start_now") => {
    if (!form.termsAccepted) {
      setErrors((prev) => ({ ...prev, terms: "יש לאשר את התנאים לפני שליחה" }));
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

        const serviceLabel = isConsultation
          ? "ייעוץ לקידום שיר"
          : `הקלטה באולפן - ${activePackage?.name ?? recordingLabel}`;

        const body = buildBookingWhatsAppBody({
          intent,
          serviceLabel,
          summaryLines: buildSummaryLines(),
          contact: { name: sanitizeLeadText(form.name, 60), phone: displayPhone },
          totalEstimate: withVat(total),
          utmSource: readUtmSource(),
        });

        const href = buildWhatsAppHref({
          text: body,
          utm_source: "website",
          utm_campaign: "studio_recording_booking",
        });
        openWhatsAppLead(href);
        notifyLeadByEmail({
          formId: "studio_recording_booking",
          subject: "הזמנת הקלטה באולפן",
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
    if (fieldErrs && Object.keys(fieldErrs).length > 0) {
      setTimeout(() => {
        document
          .querySelector("[data-field-error]")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    }
  };

  const today = new Date().toISOString().split("T")[0];

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
    <div className={cn("min-w-0 max-w-full space-y-10", step === 2 && activePackage && "pb-24")}>
      {draft.restored ? (
        <p className="rounded-lg border border-brand-red/20 bg-brand-red/5 px-4 py-2 text-xs text-muted-foreground">
          שחזרנו את הטיוטה האחרונה שלכם מהדפדפן.
        </p>
      ) : null}

      <FilterContextBanner filterAnswers={filterAnswers} />

      <div
        className="h-1 w-full overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuenow={progressPct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-1 rounded-full bg-brand-red transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <BookingWizardNav steps={STEPS} currentStep={step} label="שלבי הזמנת הקלטה" />

      {/* Step 0: recording type + atmosphere */}
      {step === 0 && (
        <BookingStepPanel stepKey={0}>
          <section className="space-y-8" aria-labelledby="step0-heading">
            <header>
              <h2
                id="step0-heading"
                className="text-xl font-semibold text-foreground sm:text-2xl"
              >
                בחרו סוג הקלטה
              </h2>
            </header>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {RECORDING_TYPES.map((type) => {
                const active = form.recordingType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, recordingType: type.id }))}
                    className={cn(
                      "rounded-xl border px-3 py-3 text-sm font-semibold transition-colors",
                      active
                        ? "border-brand-red bg-brand-red/10 text-brand-red"
                        : "border-border bg-background text-foreground hover:border-brand-red/40",
                    )}
                    aria-pressed={active}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="song-name" className="mb-1.5 block text-xs font-semibold">
                  שם השיר
                </label>
                <input
                  id="song-name"
                  type="text"
                  value={form.songName}
                  onChange={(e) => setForm((prev) => ({ ...prev, songName: e.target.value }))}
                  placeholder='לדוגמה: "אין כאן מקרה"'
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="referrer" className="mb-1.5 block text-xs font-semibold">
                  מי שלח אותך? (אופציונלי)
                </label>
                <input
                  id="referrer"
                  type="text"
                  value={form.referrer}
                  onChange={(e) => setForm((prev) => ({ ...prev, referrer: e.target.value }))}
                  placeholder="שם מי שהמליץ עליכם"
                  className={inputClass}
                />
              </div>
            </div>

            {!isConsultation && (
              <div>
                <h3 className="mb-2 text-base font-semibold text-foreground">
                  בחרו את האווירה שלכם
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  האווירה משפיעה על כל ההפקה — בחרו את הרגש שאתם רוצים
                </p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {RECORDING_ATMOSPHERES.map((item) => {
                    const active = form.atmosphere === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, atmosphere: item.id }))}
                        className={cn(
                          "flex flex-col items-center gap-3 rounded-2xl border p-6 text-center transition-all",
                          active
                            ? "border-brand-red bg-brand-red/5 shadow-[0_4px_16px_rgba(212,43,43,0.12)]"
                            : "border-border bg-background hover:border-brand-red/30",
                        )}
                        aria-pressed={active}
                      >
                        <span className="text-3xl" aria-hidden="true">
                          {item.emoji}
                        </span>
                        <span className="font-semibold text-foreground">{item.title}</span>
                        <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div
              className={cn(
                "rounded-xl border border-dashed p-4 transition-colors",
                form.surpriseGift
                  ? "border-amber-400 bg-amber-50"
                  : "border-brand-red/30 bg-brand-red/5",
              )}
            >
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.surpriseGift}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, surpriseGift: e.target.checked }))
                  }
                  className={cn(
                    "mt-1 h-4 w-4",
                    form.surpriseGift ? "accent-amber-600" : "accent-brand-red",
                  )}
                />
                <span className="text-sm text-foreground">
                  <span className={cn("font-semibold", form.surpriseGift && "text-amber-800")}>
                    מתנה קטנה של האולפן
                  </span>
                  <br />
                  <span className="text-muted-foreground">{STUDIO_SURPRISE_GIFT_NOTE}</span>
                </span>
              </label>
              {form.surpriseGift && (
                <div className="mt-3">
                  <label
                    htmlFor="gift-recipient"
                    className="mb-1.5 block text-xs font-semibold text-amber-800"
                  >
                    שם המקבל (אופציונלי)
                  </label>
                  <input
                    id="gift-recipient"
                    type="text"
                    value={form.giftRecipientName}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, giftRecipientName: e.target.value }))
                    }
                    placeholder="לדוגמה: נועה"
                    className={cn(
                      inputClass,
                      "border-amber-300 focus:border-amber-500 focus:ring-amber-200/50",
                    )}
                  />
                </div>
              )}
            </div>

            <StepNav
              onNext={() => goToStep(1)}
              nextDisabled={!canAdvanceStep0}
              showBack={false}
            />
          </section>
        </BookingStepPanel>
      )}

      {/* Step 1: package selection */}
      {step === 1 && (
        <BookingStepPanel stepKey={1}>
          <section className="space-y-8" aria-labelledby="package-heading">
            <header>
              <h2
                id="package-heading"
                className="text-xl font-semibold text-foreground sm:text-2xl"
              >
                {isConsultation ? "בחרו סוג ייעוץ" : "בחרו את המסלול שלכם"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {isConsultation
                  ? "ייעוץ מקצועי לקידום השיר ברשתות החברתיות"
                  : "המחיר הוא על התוצאה הסופית — לא על זמן באולפן"}
              </p>
            </header>

            <div className="grid gap-4 lg:grid-cols-2">
              {(isConsultation ? CONSULTATION_PACKAGES : STUDIO_RECORDING_PACKAGES).map((pkg) => {
                const active = form.packageId === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, packageId: pkg.id }))}
                    className={cn(
                      "relative flex flex-col items-start gap-2 rounded-2xl border p-5 text-start",
                      "featured" in pkg && pkg.featured && "ring-1 ring-brand-red/30",
                      active
                        ? "border-brand-red bg-brand-red/5"
                        : "border-border bg-background hover:border-brand-red/30",
                    )}
                    aria-pressed={active}
                  >
                    {pkg.badge && (
                      <span className="absolute left-3 top-3 rounded-full bg-brand-red px-2 py-0.5 text-[0.6rem] font-bold text-white">
                        {pkg.badge}
                      </span>
                    )}
                    {"featured" in pkg && pkg.featured && (
                      <span className="mb-1 w-full text-center text-xs font-bold text-brand-red">
                        הכי מומלץ — שגר ושכח
                      </span>
                    )}
                    <span className="text-2xl" aria-hidden="true">
                      {pkg.emoji}
                    </span>
                    <span className="text-sm font-semibold text-foreground">{pkg.name}</span>
                    <span className="text-xs leading-relaxed text-muted-foreground">
                      {pkg.description}
                    </span>
                    {"savings" in pkg && pkg.savings && (
                      <span className="text-xs font-medium text-green-700">{pkg.savings}</span>
                    )}
                    <div className="mt-auto">
                      <PriceWithVat amountExVat={pkg.price} size="md" />
                    </div>
                  </button>
                );
              })}
            </div>

            <StepNav
              onBack={() => goToStep(0)}
              onNext={() => goToStep(2)}
              nextDisabled={!canAdvanceStep1}
            />
          </section>
        </BookingStepPanel>
      )}

      {/* Step 2: summary + contact form (closing) */}
      {step === 2 && (
        <BookingStepPanel stepKey={2}>
          <section className="mx-auto max-w-lg space-y-8">
            {/* Read-only summary */}
            <div className="rounded-2xl bg-surface p-6">
              <h2 className="mb-4 text-lg font-medium text-foreground">מה שבחרת</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {recordingLabel && (
                  <li>
                    <span className="font-medium text-foreground">סוג: </span>
                    {recordingLabel}
                  </li>
                )}
                {form.songName && !isConsultation && (
                  <li>
                    <span className="font-medium text-foreground">שיר: </span>
                    {form.songName}
                  </li>
                )}
                {form.referrer && (
                  <li>
                    <span className="font-medium text-foreground">הופנה ע&quot;י: </span>
                    {form.referrer}
                  </li>
                )}
                {atmosphereLabel && !isConsultation && (
                  <li>
                    <span className="font-medium text-foreground">אווירה: </span>
                    {atmosphereLabel}
                  </li>
                )}
                {activePackage && (
                  <li>
                    <span className="font-medium text-foreground">מסלול: </span>
                    {activePackage.name} · {activePackage.price.toLocaleString("he-IL")} ₪
                  </li>
                )}
                {form.surpriseGift && (
                  <li>
                    מתנת הפתעה
                    {form.giftRecipientName && ` — עבור ${form.giftRecipientName}`}
                  </li>
                )}
              </ul>
              <div className="mt-5 border-t border-border pt-4">
                <PriceWithVat amountExVat={total} size="lg" />
              </div>
            </div>

            {/* Contact form */}
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-foreground">פרטים לתיאום</h2>
              <div className="relative space-y-4">
                <HoneypotField value={honeypot} onChange={setHoneypot} />
                <LeadFormAlert message={globalError} />

                <div>
                  <label htmlFor="sr-name" className="mb-1.5 block text-xs font-semibold">
                    שם מלא *
                  </label>
                  <input
                    id="sr-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    onBlur={() => {
                      const val = form.name.trim();
                      if (val.length > 0 && val.length < 2) {
                        setErrors((prev) => ({
                          ...prev,
                          name: "שם חייב להכיל לפחות 2 תווים",
                        }));
                      } else if (val.length >= 2 && errors.name) {
                        setErrors((prev) => {
                          const n = { ...prev };
                          delete n.name;
                          return n;
                        });
                      }
                    }}
                    className={cn(inputClass, errors.name && "border-red-400")}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500" data-field-error="">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="sr-phone" className="mb-1.5 block text-xs font-semibold">
                    טלפון *
                  </label>
                  <input
                    id="sr-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                    onBlur={() => {
                      const val = form.phone.trim().replace(/[\s\-]/g, "");
                      if (
                        val.length > 0 &&
                        !/^(0[5-9]\d{8}|972[5-9]\d{8})$/.test(val)
                      ) {
                        setErrors((prev) => ({
                          ...prev,
                          phone: "מספר טלפון לא תקין",
                        }));
                      } else if (val.length > 0 && errors.phone) {
                        setErrors((prev) => {
                          const n = { ...prev };
                          delete n.phone;
                          return n;
                        });
                      }
                    }}
                    className={cn(inputClass, errors.phone && "border-red-400")}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500" data-field-error="">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="sr-date" className="mb-1.5 block text-xs font-semibold">
                      תאריך *
                    </label>
                    <input
                      id="sr-date"
                      type="date"
                      min={today}
                      value={form.date}
                      onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                      className={cn(inputClass, errors.date && "border-red-400")}
                    />
                    {errors.date && (
                      <p className="mt-1 text-xs text-red-500" data-field-error="">
                        {errors.date}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="sr-time" className="mb-1.5 block text-xs font-semibold">
                      שעה *
                    </label>
                    <input
                      id="sr-time"
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))}
                      className={cn(inputClass, errors.time && "border-red-400")}
                    />
                    {errors.time && (
                      <p className="mt-1 text-xs text-red-500" data-field-error="">
                        {errors.time}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="sr-notes" className="mb-1.5 block text-xs font-semibold">
                    הערות
                  </label>
                  <textarea
                    id="sr-notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                    className={cn(inputClass, "resize-none")}
                  />
                </div>
              </div>

              <BookingApprovals
                variant="light"
                termsAccepted={form.termsAccepted}
                onTermsChange={(accepted) => {
                  setForm((prev) => ({ ...prev, termsAccepted: accepted }));
                  if (accepted && errors.terms) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.terms;
                      return next;
                    });
                  }
                }}
                termsError={errors.terms}
              />

              <button
                type="button"
                onClick={() => handleAction("continue_chat")}
                disabled={!form.termsAccepted}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold shadow-sm transition-opacity",
                  form.termsAccepted
                    ? "bg-brand-red text-white hover:opacity-90"
                    : "cursor-not-allowed bg-border text-muted-foreground",
                )}
              >
                {`שליחה בוואטסאפ · ${total.toLocaleString("he-IL")} ₪`}
              </button>

              <BookingPaymentTrust />

              <button
                type="button"
                onClick={() => goToStep(1)}
                className="w-full text-center text-xs text-muted-foreground hover:text-brand-red"
              >
                חזרה לבחירת מסלול
              </button>
            </div>
          </section>
        </BookingStepPanel>
      )}

      {/* Sticky price bar — step 2 only */}
      {step === 2 && activePackage && (
        <div className="fixed inset-x-0 bottom-0 z-30 overflow-x-clip border-t border-border bg-surface/95 backdrop-blur-sm">
          <div className="mx-auto flex min-w-0 max-w-4xl items-center gap-4 px-4 py-3">
            <div>
              <p className="text-xs text-muted-foreground">{activePackage.name}</p>
              <p className="text-base font-bold text-foreground">
                {total.toLocaleString("he-IL")} ₪{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  לפני מע&quot;מ
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StepNav({
  onBack,
  onNext,
  nextDisabled,
  nextLabel = "המשך",
  showBack = true,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  showBack?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
      {showBack && onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-brand-red/40"
        >
          חזרה
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className={cn(
          "rounded-xl px-6 py-2.5 text-sm font-semibold transition-opacity",
          nextDisabled
            ? "cursor-not-allowed bg-border text-muted-foreground"
            : "bg-brand-red text-white hover:opacity-90",
        )}
      >
        {nextLabel}
      </button>
    </div>
  );
}
