"use client";

import { useMemo } from "react";
import BookingApprovals from "@/components/booking/BookingApprovals";
import BookingPaymentTrust from "@/components/booking/BookingPaymentTrust";
import BookingSummaryActions from "@/components/booking/BookingSummaryActions";
import BookTrustBadges from "@/components/booking/BookTrustBadges";
import BookUpsellSection from "@/components/booking/BookUpsellSection";
import BookWhatHappensNext from "@/components/booking/BookWhatHappensNext";
import BookingStepPanel from "@/components/booking/BookingStepPanel";
import BookingWhatsAppPreview from "@/components/booking/BookingWhatsAppPreview";
import BookingWizardNav from "@/components/booking/BookingWizardNav";
import BookDraftRecoveryBanner from "@/components/booking/BookDraftRecoveryBanner";
import BookingSuccessPanel from "@/components/booking/BookingSuccessPanel";
import BookingDateTimeFields from "@/components/booking/BookingDateTimeFields";
import BookingFormField from "@/components/booking/BookingFormField";
import BookingPhoneInput from "@/components/booking/BookingPhoneInput";
import PriceWithVat from "@/components/booking/PriceWithVat";
import NeedsDiscoveryStep from "@/components/booking/NeedsDiscoveryStep";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useBookingWizard } from "@/hooks/useBookingWizard";
import { FORM_MICROCOPY } from "@/lib/form-microcopy";
import {
  EVENT_BOOKING_ITEMS,
  EVENT_BUNDLE_BADGE_LABELS,
  EVENT_GIFT_THRESHOLD,
  getEventBundlePrice,
  type EventBookingItemId,
} from "@/lib/data/events-booking";
import {
  EVENT_BOOKING_UPSELLS,
  sumEventUpsells,
} from "@/lib/data/events-booking-upsells";
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
import { parseEventsFormDraft, type EventsFormDraft } from "@/lib/events-form-draft";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const STEPS = ["אטרקציות", "פרטים", "סיכום"] as const;

const INITIAL: EventsFormDraft = {
  selected: [],
  name: "",
  phone: "",
  date: "",
  time: "",
  location: "",
  customerNeed: "",
  notes: "",
  selectedUpsells: [],
  termsAccepted: false,
};

type EventsBookingWizardProps = {
  routeId?: string | null;
};

export default function EventsBookingWizard({ routeId = null }: EventsBookingWizardProps) {
  const {
    step,
    form,
    errors,
    setStep,
    patchForm,
    setErrors,
    toggleUpsell,
    selectedUpsellSet,
    draft,
    guard,
    dismissDraft,
    runSubmit,
    resetWizard,
    isSubmitted,
    lastWaHref,
    lastIntent,
  } = useBookingWizard({
    storageKey: "events",
    formId: "events_booking_wizard",
    initialForm: INITIAL,
    parseDraft: (raw) => parseEventsFormDraft(raw, INITIAL),
    persistStepInDraft: true,
    maxStep: 2,
  });

  const { honeypot, setHoneypot, globalError } = guard;

  useBookWizardStep("events", step);

  const count = form.selected.length;
  const upsellTotal = sumEventUpsells(new Set(form.selectedUpsells));
  const bundleTotal = getEventBundlePrice(count) + upsellTotal;
  const singleTotal = count * 1750;
  const savings = singleTotal - bundleTotal;
  const today = new Date().toISOString().split("T")[0];
  const toggle = (id: EventBookingItemId) => {
    const has = form.selected.includes(id);
    patchForm({
      selected: has
        ? form.selected.filter((x) => x !== id)
        : [...form.selected, id],
    });
  };

  const labels = useMemo(
    () =>
      form.selected
        .map((id) => EVENT_BOOKING_ITEMS.find((i) => i.id === id)?.name)
        .filter(Boolean),
    [form.selected],
  );

  const canStep1 = useMemo(
    () => Boolean(form.name.trim() && form.phone.trim()),
    [form.name, form.phone],
  );

  const buildSummaryLines = () => [
    ...(form.date ? [{ label: "תאריך", value: form.date }] : []),
    ...(form.time ? [{ label: "שעה", value: form.time }] : []),
    ...(form.location ? [{ label: "מיקום", value: sanitizeLeadText(form.location, 120) }] : []),
    ...(labels.length > 0 ? [{ label: "אטרקציות", value: labels.join(", ") }] : []),
    ...(count >= EVENT_GIFT_THRESHOLD ? [{ label: "מתנה", value: "מצגת תמונות חינם" }] : []),
    ...(savings > 0 ? [{ label: "חיסכון", value: `${savings.toLocaleString()} ₪` }] : []),
    ...(form.notes ? [{ label: "הערות", value: sanitizeLeadText(form.notes, 500) }] : []),
    ...EVENT_BOOKING_UPSELLS.filter((u) => form.selectedUpsells.includes(u.id)).map((u) => ({
      label: "תוספת",
      value: `${u.name} (+${u.price.toLocaleString("he-IL")} ₪)`,
    })),
  ];

  const consultHref = useMemo(() => {
    const displayPhone = form.phone.trim()
      ? formatPhoneForDisplay(form.phone.trim())
      : "";
    return buildConsultWhatsAppHref(buildSummaryLines(), {
      name: sanitizeLeadText(form.name, 60),
      phone: displayPhone,
    }, { bookCategory: "events", source: "/book#events" });
  }, [form, labels, count, savings]);

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
          serviceLabel: `אטרקציות לאירוע - ${count} אטרקציות`,
          summaryLines: buildSummaryLines(),
          contact: { name: sanitizeLeadText(form.name, 60), phone: displayPhone },
          priceExVat: bundleTotal,
          totalEstimate: withVat(bundleTotal),
          customerNeed: sanitizeLeadText(form.customerNeed, 500) || null,
          utmSource: readUtmSource() ?? "/book#events",
          bookCategory: "events",
          includeTrustFooter: true,
          ycForm: "events_booking_wizard",
        });
        const href = buildWhatsAppHref({
          text: body,
          utm_source: "website",
          utm_campaign: "events_booking_wizard",
        });
        return {
          waHref: href,
          intent,
          email: {
            formId: "events_booking_wizard",
            subject: "הזמנת אטרקציות לאירוע",
            body,
            name: form.name,
            phone: displayPhone,
            crossSell: { bookCategory: "events", routeId },
          },
        };
      },
      { leadCategory: "events" },
    );
  };

  const previewBody =
    step === 2 && count > 0
      ? buildBookingWhatsAppBody({
          intent: "continue_chat",
          serviceLabel: `אטרקציות לאירוע - ${count} אטרקציות`,
          summaryLines: buildSummaryLines(),
          contact: {
            name: sanitizeLeadText(form.name, 60) || "[שם]",
            phone: form.phone ? formatPhoneForDisplay(form.phone) : "[טלפון]",
          },
          priceExVat: bundleTotal,
          totalEstimate: withVat(bundleTotal),
          customerNeed: sanitizeLeadText(form.customerNeed, 500) || null,
          utmSource: readUtmSource() ?? "/book#events",
          bookCategory: "events",
          includeTrustFooter: true,
          ycForm: "events_booking_wizard",
        })
      : undefined;

  if (isSubmitted && lastWaHref) {
    return (
      <BookingSuccessPanel
        intent={lastIntent}
        whatsappHref={lastWaHref}
        bookCategory="events"
        routeId={routeId}
        onNewBooking={resetWizard}
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

      <BookingWizardNav steps={STEPS} currentStep={step} label="שלבי הזמנת אטרקציות" />

      {step === 0 && (
        <BookingStepPanel stepKey={0}>
          <h2 className="text-xl font-semibold text-foreground">בחרו אטרקציות</h2>
          <p className="text-sm text-muted-foreground">
            2 אטרקציות = חבילה - 4+ = מתנת מצגת תמונות
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
          {count > 0 ? (
            <BookUpsellSection
              items={EVENT_BOOKING_UPSELLS}
              selected={selectedUpsellSet}
              onToggle={toggleUpsell}
            />
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
            <BookingFormField
              id="ev-name"
              label={`${FORM_MICROCOPY.nameLabel} *`}
              placeholder={FORM_MICROCOPY.namePlaceholder}
              autoComplete="name"
              value={form.name}
              error={errors.name}
              onChange={(v) => patchForm({ name: v })}
            />
            <BookingPhoneInput
              id="ev-phone"
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
              id="ev-location"
              label="שם האולם / מיקום *"
              value={form.location}
              error={errors.location}
              onChange={(v) => patchForm({ location: v })}
            />
            <BookingFormField
              id="ev-notes"
              label="הערות"
              placeholder={FORM_MICROCOPY.visionPlaceholder}
              multiline
              value={form.notes}
              onChange={(v) => patchForm({ notes: v })}
            />
          </div>
          <StepNav onBack={() => setStep(0)} onNext={() => setStep(2)} nextDisabled={!canStep1} />
        </BookingStepPanel>
      )}

      {step === 2 && count > 0 && (
        <BookingStepPanel stepKey={2}>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
          > ערוך בחירה
          </button>
          <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
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
              <BookWhatHappensNext
                steps={[
                  { number: 1, title: "שולחים הודעה בוואטסאפ", body: "עם האטרקציות שבחרתם" },
                  { number: 2, title: "מתאמים תאריך ומיקום", body: "שם האולם והשעה המדויקת" },
                  { number: 3, title: "מגיעים לאירוע", body: "אנחנו מקימים ומרימים את האווירה" },
                ]}
              />
              <BookTrustBadges />
              <NeedsDiscoveryStep
                value={form.customerNeed}
                onChange={(v) => patchForm({ customerNeed: v })}
                id="ev-customer-need"
              />
              {previewBody ? <BookingWhatsAppPreview messageBody={previewBody} /> : null}
              <p className="text-sm text-muted-foreground">{BOOKING_SUMMARY_INTRO}</p>
              <BookingApprovals
                variant="light"
                termsAccepted={form.termsAccepted}
                onTermsChange={(v) => patchForm({ termsAccepted: v })}
                termsError={errors.terms}
              />
              <BookingSummaryActions
                disabled={!form.termsAccepted}
                continueWhatsApp={{
                  label: sendBookingWaCta(withVat(bundleTotal)),
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
