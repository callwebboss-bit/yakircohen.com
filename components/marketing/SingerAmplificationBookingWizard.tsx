"use client";

import { useEffect, useMemo } from "react";
import BookingApprovals from "@/components/booking/BookingApprovals";
import BookingPaymentTrust from "@/components/booking/BookingPaymentTrust";
import { useReportBookWizardLivePrice } from "@/components/booking/BookWizardLivePrice";
import BookingSummaryActions from "@/components/booking/BookingSummaryActions";
import BookTrustBadges from "@/components/booking/BookTrustBadges";
import BookUpsellSection from "@/components/booking/BookUpsellSection";
import BookWhatHappensNext from "@/components/booking/BookWhatHappensNext";
import BookingStepPanel from "@/components/booking/BookingStepPanel";
import BookingWhatsAppPreview from "@/components/booking/BookingWhatsAppPreview";
import BookingWizardNav from "@/components/booking/BookingWizardNav";
import BookDraftRecoveryBanner from "@/components/booking/BookDraftRecoveryBanner";
import BookingSuccessPanel from "@/components/booking/BookingSuccessPanel";
import PriceWithVat from "@/components/booking/PriceWithVat";
import BookingDateTimeFields from "@/components/booking/BookingDateTimeFields";
import BookingFormField from "@/components/booking/BookingFormField";
import BookingPhoneInput from "@/components/booking/BookingPhoneInput";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useBookingWizard } from "@/hooks/useBookingWizard";
import { FORM_MICROCOPY } from "@/lib/form-microcopy";
import {
  SINGER_PACKAGES,
  type SingerPackageId,
} from "@/lib/data/singer-amplification-page";
import {
  SINGER_BOOKING_ADDONS,
  sumSingerAddons,
} from "@/lib/data/singer-booking-addons";
import { sendBookingWaCta } from "@/lib/data/conversion-copy";
import { withVat } from "@/lib/data/pricing";
import { useBookWizardStep } from "@/hooks/useBookWizardStep";
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
  buildConsultWhatsAppHref,
  readUtmSource,
} from "@/lib/booking-messages";
import { parseSingerFormDraft, type SingerFormDraft } from "@/lib/singer-form-draft";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const STEPS = ["בחירת מערכת", "פרטי ההופעה", "אישור ושליחה"] as const;

const INITIAL: SingerFormDraft = {
  packageId: "",
  name: "",
  phone: "",
  date: "",
  time: "",
  location: "",
  notes: "",
  selectedAddons: [],
  termsAccepted: false,
};

function parseSingerPriceNis(price: string): number {
  const n = parseInt(price.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

export type SingerAmplificationBookingWizardProps = {
  initialPackageId?: SingerPackageId | null;
  routeId?: string | null;
};

export default function SingerAmplificationBookingWizard({
  initialPackageId = null,
  routeId = null,
}: SingerAmplificationBookingWizardProps) {
  const initialForm = useMemo<SingerFormDraft>(
    () => ({ ...INITIAL, packageId: initialPackageId ?? "" }),
    [initialPackageId],
  );

  const {
    step,
    form,
    errors,
    setStep,
    patchForm,
    setErrors,
    draft,
    guard,
    dismissDraft,
    runSubmit,
    resetWizard,
    isSubmitted,
    lastWaHref,
    lastIntent,
  } = useBookingWizard({
    storageKey: "singer_amplification",
    formId: "singer_amplification_booking",
    initialForm,
    parseDraft: (raw) => parseSingerFormDraft(raw, initialForm, initialPackageId ?? ""),
    persistStepInDraft: true,
    maxStep: 2,
  });

  const { honeypot, setHoneypot, globalError } = guard;

  useBookWizardStep("singer", step);

  useEffect(() => {
    if (!initialPackageId || form.packageId) return;
    queueMicrotask(() => patchForm({ packageId: initialPackageId }));
  }, [initialPackageId, form.packageId, patchForm]);

  const selected = SINGER_PACKAGES.find((p) => p.id === form.packageId);
  const packageExVat = selected ? parseSingerPriceNis(selected.price) : 0;
  const addonExVat = sumSingerAddons(new Set(form.selectedAddons));
  const totalExVat = packageExVat + addonExVat;
  const livePriceReport = useMemo(() => {
    if (totalExVat <= 0 || !selected) return null;
    return {
      totalExVat,
      title: selected.name,
      ctaLabel: sendBookingWaCta(withVat(totalExVat)),
    };
  }, [totalExVat, selected]);
  useReportBookWizardLivePrice(livePriceReport);
  const selectedAddonSet = new Set(form.selectedAddons);
  const today = new Date().toISOString().split("T")[0];

  const toggleAddon = (id: string) => {
    const has = form.selectedAddons.includes(id);
    patchForm({
      selectedAddons: has
        ? form.selectedAddons.filter((x) => x !== id)
        : [...form.selectedAddons, id],
    });
  };

  const canStep0 = form.packageId !== "";
  const canStep1 = useMemo(
    () => Boolean(form.name.trim() && form.phone.trim()),
    [form.name, form.phone],
  );

  const buildSummaryLines = () => [
    ...(form.date ? [{ label: "תאריך", value: form.date }] : []),
    ...(form.time ? [{ label: "שעה", value: form.time }] : []),
    ...(form.location ? [{ label: "מיקום", value: sanitizeLeadText(form.location, 120) }] : []),
    ...(selected ? [{ label: "חבילה", value: `${selected.name} (${selected.price})` }] : []),
    ...SINGER_BOOKING_ADDONS.filter((a) => form.selectedAddons.includes(a.id)).map((a) => ({
      label: "תוספת",
      value: `${a.name} (+${a.price.toLocaleString("he-IL")} ₪)`,
    })),
    ...(form.notes ? [{ label: "הערות", value: sanitizeLeadText(form.notes, 500) }] : []),
  ];

  const consultHref = useMemo(() => {
    const displayPhone = form.phone.trim()
      ? formatPhoneForDisplay(form.phone.trim())
      : "";
    return buildConsultWhatsAppHref(buildSummaryLines(), {
      name: sanitizeLeadText(form.name, 60),
      phone: displayPhone,
    }, { bookCategory: "singer", source: "/book#singer" });
  }, [form, selected]);

  const handleAction = (intent: "continue_chat" | "start_now") => {
    if (!form.termsAccepted) {
      setErrors({ terms: "יש לאשר את התנאים לפני שליחה" });
      return;
    }
    runSubmit(
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
          summaryLines: buildSummaryLines(),
          contact: { name: sanitizeLeadText(form.name, 60), phone: displayPhone },
          priceExVat: totalExVat,
          totalEstimate: withVat(totalExVat),
          utmSource: readUtmSource() ?? "/book#singer",
          bookCategory: "singer",
          includeTrustFooter: true,
          ycForm: "singer_amplification_booking",
        });
        const href = buildWhatsAppHref({
          text: body,
          utm_source: "website",
          utm_campaign: "singer_amplification_booking",
        });
        return {
          waHref: href,
          intent,
          email: {
            formId: "singer_amplification_booking",
            subject: "הזמנת הגברה לזמרים",
            body,
            name: form.name,
            phone: displayPhone,
            crossSell: { bookCategory: "singer", routeId },
          },
        };
      },
      { leadCategory: "singer" },
    );
  };

  const handleNewBooking = () => {
    resetWizard();
    if (initialPackageId) patchForm({ packageId: initialPackageId });
  };

  const previewBody =
    step === 2 && selected
      ? buildBookingWhatsAppBody({
          intent: "continue_chat",
          serviceLabel: `הגברה לזמר/ה - ${selected.name}`,
          summaryLines: buildSummaryLines(),
          contact: {
            name: sanitizeLeadText(form.name, 60) || "[שם]",
            phone: form.phone ? formatPhoneForDisplay(form.phone) : "[טלפון]",
          },
          priceExVat: totalExVat,
          totalEstimate: withVat(totalExVat),
          utmSource: readUtmSource() ?? "/book#singer",
          bookCategory: "singer",
          includeTrustFooter: true,
          ycForm: "singer_amplification_booking",
        })
      : undefined;

  if (isSubmitted && lastWaHref) {
    return (
      <BookingSuccessPanel
        intent={lastIntent}
        whatsappHref={lastWaHref}
        bookCategory="singer"
        routeId={routeId}
        onNewBooking={handleNewBooking}
      />
    );
  }

  return (
    <div className="min-w-0 max-w-full space-y-8">
      {draft.restored && draft.savedAt ? (
        <BookDraftRecoveryBanner
          savedAt={draft.savedAt}
          onClear={() => draft.clear()}
          onDismiss={() => dismissDraft()}
        />
      ) : null}

      <BookingWizardNav steps={STEPS} currentStep={step} label="שלבי הזמנת הגברה לזמרים" />

      {step === 0 && (
        <BookingStepPanel stepKey={0}>
          <h2 className="text-xl font-semibold text-foreground">
            בחרו חבילת הגברה לזמר/ה
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            זמרים, הרכבים ומפיקי אירועים - מחירים גלויים - שינויים אפשריים במעמד העסקה.
            לא בטוחים?{" "}
            <a
              href="/events/equipment/singer-amplification#system-builder-heading"
              className="font-medium text-brand-red hover:underline"
            >
              הריצו את מחשבון המערכת בעמוד השירות
            </a>
          </p>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {SINGER_PACKAGES.map((pkg) => {
              const active = form.packageId === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => patchForm({ packageId: pkg.id })}
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
                  <PriceWithVat amountExVat={parseSingerPriceNis(pkg.price)} size="sm" className="mt-1" />
                  <p className="mt-2 text-xs text-muted-foreground">{pkg.suitedFor}</p>
                </button>
              );
            })}
          </div>
          {form.packageId ? (
            <BookUpsellSection
              items={SINGER_BOOKING_ADDONS}
              selected={selectedAddonSet}
              onToggle={toggleAddon}
              className="mt-6"
            />
          ) : null}
          <StepNav onNext={() => setStep(1)} nextDisabled={!canStep0} showBack={false} />
        </BookingStepPanel>
      )}

      {step === 1 && (
        <BookingStepPanel stepKey={1}>
          <h2 className="text-xl font-semibold text-foreground">פרטי הופעה ותיאום</h2>
          <div className="relative max-w-lg space-y-4">
            <HoneypotField value={honeypot} onChange={setHoneypot} />
            <LeadFormAlert message={globalError} />
            <BookingFormField
              id="sg-name"
              label={`${FORM_MICROCOPY.nameLabel} *`}
              placeholder={FORM_MICROCOPY.namePlaceholder}
              autoComplete="name"
              value={form.name}
              error={errors.name}
              onChange={(v) => patchForm({ name: v })}
            />
            <BookingPhoneInput
              id="sg-phone"
              value={form.phone}
              required
              error={errors.phone}
              onChange={(v) => patchForm({ phone: v })}
              onBlurValidate={(msg) => {
                const next = { ...errors };
                if (msg) next.phone = msg;
                else delete next.phone;
                setErrors(next);
              }}
            />
            <BookingDateTimeFields
              date={form.date}
              time={form.time}
              minDate={today}
              onDateChange={(v) => patchForm({ date: v })}
              onTimeChange={(v) => patchForm({ time: v })}
              errors={{ date: errors.date, time: errors.time }}
            />
            <BookingFormField
              id="sg-location"
              label="מיקום ההופעה *"
              value={form.location}
              error={errors.location}
              onChange={(v) => patchForm({ location: v })}
            />
            <BookingFormField
              id="sg-notes"
              label="הערות (סגנון, מספר מיקרופונים וכו')"
              multiline
              value={form.notes}
              onChange={(v) => patchForm({ notes: v })}
            />
          </div>
          <StepNav onBack={() => setStep(0)} onNext={() => setStep(2)} nextDisabled={!canStep1} />
        </BookingStepPanel>
      )}

      {step === 2 && selected && (
        <BookingStepPanel stepKey={2}>
          <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="font-semibold text-foreground">סיכום</h2>
              <p className="mt-2 text-sm text-muted-foreground">{selected.name}</p>
              <div className="mt-3">
                <PriceWithVat amountExVat={totalExVat} size="lg" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {form.date} - {form.time}
              </p>
              <p className="text-sm text-muted-foreground">{form.location}</p>
            </div>
            <div className="space-y-4">
              <BookWhatHappensNext />
              <BookTrustBadges badges={[{ icon: "🎤", label: "צ'ק סאונד לפני ההופעה" }]} />
              {previewBody ? <BookingWhatsAppPreview messageBody={previewBody} /> : null}
              <p className="text-sm text-muted-foreground">{BOOKING_SUMMARY_INTRO}</p>
              <div className="rounded-xl bg-surface px-4 py-3 text-center">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  המציאות דינמית. אם תצטרכו לשנות שעה או מיקום ההופעה אחרי השליחה הכל בסדר. הכל גמיש עד ההופעה עצמה. אין קנסות ואין אותיות קטנות.
                </p>
              </div>
              <BookingApprovals
                variant="light"
                termsAccepted={form.termsAccepted}
                onTermsChange={(v) => patchForm({ termsAccepted: v })}
                termsError={errors.terms}
              />
              <BookingSummaryActions
                disabled={!form.termsAccepted}
                continueWhatsApp={{
                  label: sendBookingWaCta(withVat(totalExVat)),
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
        <button type="button" onClick={onBack} className="rounded-2xl border border-border/60 px-5 py-2.5 text-sm font-semibold">
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
          "rounded-2xl px-6 py-2.5 text-sm font-semibold transition-opacity",
          nextDisabled
            ? "cursor-not-allowed bg-border text-muted-foreground"
            : "bg-brand-red text-white hover:opacity-90",
        )}
      >
        המשך
      </button>
    </div>
  );
}
