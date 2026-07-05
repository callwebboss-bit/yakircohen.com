"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BookingApprovals from "@/components/booking/BookingApprovals";
import { useReportBookWizardLivePrice } from "@/components/booking/BookWizardLivePrice";
import BookingSummaryActions from "@/components/booking/BookingSummaryActions";
import BookTrustBadges from "@/components/booking/BookTrustBadges";
import BookUpsellSection from "@/components/booking/BookUpsellSection";
import BookWhatHappensNext from "@/components/booking/BookWhatHappensNext";
import BookingStepPanel from "@/components/booking/BookingStepPanel";
import BookingWhatsAppPreview from "@/components/booking/BookingWhatsAppPreview";
import BookingWizardNav from "@/components/booking/BookingWizardNav";
import BookDraftRecoveryBanner from "@/components/booking/BookDraftRecoveryBanner";
import {
  SingerLastMinuteRecordingOffer,
  SingerPriceReframe,
  SingerReassuranceBadge,
  SingerSessionPriorityPills,
  SingerWelcomePerkPills,
  SingerWizardStep3HoldTimer,
  SingerWizardStepTransitionOverlay,
  SingerWizardUrgencyHint,
} from "@/components/booking/SingerWizardCroBlocks";
import { WizardCroShell } from "@/components/booking/cro/WizardCroShell";
import WizardWhatsAppEscapeLink from "@/components/booking/WizardWhatsAppEscapeLink";
import BookingSuccessPanel from "@/components/booking/BookingSuccessPanel";
import WizardStepBlockerBanner from "@/components/booking/WizardStepBlockerBanner";
import WizardStepProgress from "@/components/booking/WizardStepProgress";
import PriceWithVat from "@/components/booking/PriceWithVat";
import BookingDateTimeFields from "@/components/booking/BookingDateTimeFields";
import BookingFormField from "@/components/booking/BookingFormField";
import BookingPhoneInput from "@/components/booking/BookingPhoneInput";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useBookCoreContactBridge } from "@/hooks/useBookCoreContactBridge";
import { useBookExitIntent } from "@/hooks/useBookExitIntent";
import { useWizardHistory } from "@/hooks/useWizardHistory";
import { useWizardUserIdle } from "@/hooks/useWizardUserIdle";
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
import { SINGER_CRO_CONFIG } from "@/lib/data/cro/singer";
import { buildWizardEscapeHref } from "@/lib/book-wizard-cro/build-wizard-escape-href";
import { readBookCoreContact } from "@/lib/book-wizard-cro/shared-contact";
import { useWizardGhostLead } from "@/lib/book-wizard-cro/useWizardGhostLead";
import { useWizardFunnel } from "@/lib/book-wizard-cro/useWizardFunnel";
import { fireBookingConfetti } from "@/lib/book-wizard-confetti";
import { scrollToBookWizardPanelAndFocusStep } from "@/lib/book-wizard-step-focus";
import {
  ensureHoldDeadline,
  saveCategoryPriceHold,
} from "@/lib/book-wizard-urgency";
import { usePriceHoldBadge } from "@/lib/book-wizard-cro/use-price-hold-badge";
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
import { scrollAndHighlightFirstError, scrollToFirstWizardBlocker } from "@/lib/scroll-to-error";
import {
  getSingerStep0Blockers,
  getSingerStep0Checklist,
  getSingerStep1Blockers,
  getSingerStep1Checklist,
  type WizardStepBlocker,
} from "@/lib/singer-wizard-step-guards";
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
  sessionPriority: "",
  welcomePerk: "",
  lastMinuteUpsell: false,
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
  const coreContactMerged = useRef(false);
  const [step2Transition, setStep2Transition] = useState(false);
  const [exitIntentOpen, setExitIntentOpen] = useState(false);
  const [stepBlockers, setStepBlockers] = useState<readonly WizardStepBlocker[]>([]);
  const [step3HoldDeadline, setStep3HoldDeadline] = useState<number | null>(null);
  const [priceHoldLabel, setPriceHoldLabel] = usePriceHoldBadge(
    "singer",
    SINGER_CRO_CONFIG.urgency.priceHoldBadge,
  );

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
    mergeErrors,
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

  const trackFunnel = useWizardFunnel("singer");

  useBookCoreContactBridge(form.name, form.phone);

  useWizardHistory({
    category: "singer",
    step,
    setStep,
    enabled: !isSubmitted,
  });

  useEffect(() => {
    if (coreContactMerged.current) return;
    coreContactMerged.current = true;
    const core = readBookCoreContact();
    if (!core) return;
    patchForm({
      name: form.name.trim() ? form.name : core.name,
      phone: form.phone.trim() ? form.phone : core.phone,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  useBookWizardStep("singer", step);

  useEffect(() => {
    if (!initialPackageId || form.packageId) return;
    queueMicrotask(() => patchForm({ packageId: initialPackageId }));
  }, [initialPackageId, form.packageId, patchForm]);

  const selected = SINGER_PACKAGES.find((p) => p.id === form.packageId);
  const packageExVat = selected ? parseSingerPriceNis(selected.price) : 0;
  const lastMinuteUpsellCfg = SINGER_CRO_CONFIG.lastMinuteUpsell;
  const lastMinuteRecordingDiscount =
    form.lastMinuteUpsell &&
    lastMinuteUpsellCfg &&
    form.selectedAddons.includes(lastMinuteUpsellCfg.upgradeId)
      ? lastMinuteUpsellCfg.listPrice - lastMinuteUpsellCfg.promoPrice
      : 0;
  const addonExVat = sumSingerAddons(new Set(form.selectedAddons)) - lastMinuteRecordingDiscount;
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

  const step0Checklist = useMemo(
    () => getSingerStep0Checklist(form.packageId),
    [form.packageId],
  );

  const step1Checklist = useMemo(
    () =>
      getSingerStep1Checklist({
        name: form.name,
        phone: form.phone,
        date: form.date,
        time: form.time,
        location: form.location,
      }),
    [form.name, form.phone, form.date, form.time, form.location],
  );

  const buildSummaryLines = () => [
    ...(form.date ? [{ label: "תאריך", value: form.date }] : []),
    ...(form.time ? [{ label: "שעה", value: form.time }] : []),
    ...(form.location ? [{ label: "מיקום", value: sanitizeLeadText(form.location, 120) }] : []),
    ...(selected ? [{ label: "חבילה", value: `${selected.name} (${selected.price})` }] : []),
    ...SINGER_BOOKING_ADDONS.filter((a) => form.selectedAddons.includes(a.id)).map((a) => {
      let price = a.price;
      if (
        lastMinuteUpsellCfg &&
        form.lastMinuteUpsell &&
        a.id === lastMinuteUpsellCfg.upgradeId
      ) {
        price = lastMinuteUpsellCfg.promoPrice;
      }
      return {
        label: "תוספת",
        value: `${a.name} (+${price.toLocaleString("he-IL")} ₪)`,
      };
    }),
    ...(form.sessionPriority
      ? [
          {
            label: "עדיפות",
            value:
              SINGER_CRO_CONFIG.anxieties.find((a) => a.id === form.sessionPriority)?.label ??
              form.sessionPriority,
          },
        ]
      : []),
    ...(form.welcomePerk
      ? [
          {
            label: "הטבת הגעה",
            value:
              SINGER_CRO_CONFIG.perks.find((p) => p.id === form.welcomePerk)?.label ??
              form.welcomePerk,
          },
        ]
      : []),
    ...(form.notes ? [{ label: "הערות", value: sanitizeLeadText(form.notes, 500) }] : []),
  ];

  const summaryLinesForEscape = useMemo(
    () => buildSummaryLines(),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mirrors form selections
    [form, selected, lastMinuteUpsellCfg],
  );

  const escapeWaHref = useMemo(
    () =>
      buildWizardEscapeHref({
        category: "singer",
        serviceLabel: SINGER_CRO_CONFIG.serviceLabel,
        formId: SINGER_CRO_CONFIG.formId,
        summaryLines: summaryLinesForEscape,
        priceExVat: totalExVat,
        packageLabel: selected?.name,
        contactName: form.name,
        contactPhone: form.phone,
        ycStep: step + 1,
      }),
    [summaryLinesForEscape, totalExVat, selected?.name, form.name, form.phone, step],
  );

  const handleGhostLeadFired = useCallback(() => {
    trackFunnel("GhostLead_Fired", {
      package_id: form.packageId || "",
      step: 3,
    });
  }, [form.packageId, trackFunnel]);

  useWizardGhostLead({
    category: "singer",
    formId: SINGER_CRO_CONFIG.formId,
    step,
    closingStepIndex: 2,
    name: form.name,
    phone: form.phone,
    subject: "טיוטת הזמנת הגברה לזמרים - שלב סגירה",
    body: summaryLinesForEscape.map((l) => `${l.label}: ${l.value}`).join("\n"),
    onFired: handleGhostLeadFired,
  });

  const showCroOverlays = !isSubmitted && step < 2;
  const packageSummaryLabel = selected?.name ?? "";

  const showLastMinuteRecordingOffer =
    lastMinuteUpsellCfg &&
    (form.lastMinuteUpsell ||
      !form.selectedAddons.includes(lastMinuteUpsellCfg.upgradeId));

  const handleLastMinuteRecordingChange = (checked: boolean) => {
    if (!lastMinuteUpsellCfg) return;
    const id = lastMinuteUpsellCfg.upgradeId;
    if (checked) {
      const next = form.selectedAddons.includes(id)
        ? form.selectedAddons
        : [...form.selectedAddons, id];
      patchForm({ lastMinuteUpsell: true, selectedAddons: next });
      return;
    }
    patchForm({
      lastMinuteUpsell: false,
      selectedAddons: form.selectedAddons.filter((uid) => uid !== id),
    });
  };

  const handleExitIntent = useCallback(() => {
    if (totalExVat > 0 && packageSummaryLabel) {
      saveCategoryPriceHold("singer", {
        packageLabel: packageSummaryLabel,
        totalExVat,
      });
      setPriceHoldLabel(SINGER_CRO_CONFIG.urgency.priceHoldBadge);
    }
    setExitIntentOpen(true);
  }, [totalExVat, packageSummaryLabel]);

  useBookExitIntent({
    enabled: showCroOverlays && totalExVat > 0 && !!selected,
    onTrigger: handleExitIntent,
  });

  const { idle: wizardIdle, dismiss: dismissWizardIdle } = useWizardUserIdle({
    enabled: !isSubmitted && step <= 2,
  });

  const completeStep2Transition = useCallback(() => {
    setStep2Transition(false);
    setStep3HoldDeadline(ensureHoldDeadline("singer"));
    setStep(2);
    scrollToBookWizardPanelAndFocusStep(2);
  }, [setStep]);

  const goToStep = (n: number) => {
    setStepBlockers([]);
    setStep(n);
    scrollToBookWizardPanelAndFocusStep(n);
  };

  const attemptAdvanceFromStep0 = () => {
    const blockers = getSingerStep0Blockers({ packageId: form.packageId });
    if (blockers.length > 0) {
      setStepBlockers(blockers);
      scrollToFirstWizardBlocker(blockers[0]!.scrollTargetId);
      return;
    }
    trackFunnel("Step1_Complete", {
      package_id: form.packageId || "",
      step: 1,
    });
    goToStep(1);
  };

  const beginStep2Transition = () => {
    trackFunnel("Step2_PackageSelected", {
      package_id: form.packageId || "",
      step: 2,
    });
    setStepBlockers([]);
    setStep2Transition(true);
  };

  const attemptAdvanceFromStep1 = () => {
    const blockers = getSingerStep1Blockers({
      name: form.name,
      phone: form.phone,
      date: form.date,
      time: form.time,
      location: form.location,
    });
    if (blockers.length > 0) {
      const fieldErrors: Record<string, string> = {};
      for (const b of blockers) {
        fieldErrors[b.fieldId] = b.message;
      }
      mergeErrors(fieldErrors);
      setStepBlockers(blockers);
      scrollToFirstWizardBlocker(blockers[0]!.scrollTargetId);
      return;
    }
    setErrors({});
    beginStep2Transition();
  };

  useEffect(() => {
    return () => {
      setStep2Transition(false);
      setExitIntentOpen(false);
    };
  }, []);

  const consultHref = useMemo(() => {
    const displayPhone = form.phone.trim()
      ? formatPhoneForDisplay(form.phone.trim())
      : "";
    return buildConsultWhatsAppHref(buildSummaryLines(), {
      name: sanitizeLeadText(form.name, 60),
      phone: displayPhone,
    }, { bookCategory: "singer", source: "/book#singer" });
  }, [form, selected, lastMinuteUpsellCfg]);

  const handleAction = (intent: "continue_chat" | "start_now") => {
    if (!form.termsAccepted) {
      setErrors({ terms: "יש לאשר את התנאים לפני שליחה" });
      scrollAndHighlightFirstError();
      return;
    }
    trackFunnel("WhatsApp_Click", {
      package_id: form.packageId || "",
      step: 3,
      intent,
      last_minute_recording: form.lastMinuteUpsell,
    });
    void fireBookingConfetti();
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
    scrollAndHighlightFirstError();
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

  const handleNewBooking = () => {
    resetWizard();
    if (initialPackageId) patchForm({ packageId: initialPackageId });
  };

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
          onClear={resetWizard}
          onDismiss={() => dismissDraft()}
        />
      ) : null}

      <BookingWizardNav steps={STEPS} currentStep={step} label="שלבי הזמנת הגברה לזמרים" />

      {step === 0 && (
        <BookingStepPanel stepKey={0}>
          <SingerWizardUrgencyHint priceHoldLabel={priceHoldLabel} className="mb-4" />
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
          <div id="book-singer-package-grid" className="mt-6 grid gap-4 lg:grid-cols-3">
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
          {SINGER_CRO_CONFIG.escapePlacements.includes("after_packages") && form.packageId ? (
            <WizardWhatsAppEscapeLink href={escapeWaHref} />
          ) : null}
          <WizardStepProgress items={step0Checklist} className="mt-4" />
          <WizardStepBlockerBanner blockers={stepBlockers} className="mt-4" />

          <StepNav onNext={attemptAdvanceFromStep0} showBack={false} />
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
            <div id="book-singer-schedule">
              <BookingDateTimeFields
                date={form.date}
                time={form.time}
                minDate={today}
                onDateChange={(v) => patchForm({ date: v })}
                onTimeChange={(v) => patchForm({ time: v })}
                errors={{ date: errors.date, time: errors.time }}
              />
            </div>
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
            <SingerSessionPriorityPills
              value={form.sessionPriority}
              onChange={(id) => patchForm({ sessionPriority: id })}
            />
            {form.sessionPriority ? (
              <SingerReassuranceBadge anxietyId={form.sessionPriority} />
            ) : null}
            <SingerWelcomePerkPills
              value={form.welcomePerk}
              onChange={(id) => patchForm({ welcomePerk: id })}
            />
          </div>
          {SINGER_CRO_CONFIG.escapePlacements.includes("step_contact") ? (
            <WizardWhatsAppEscapeLink href={escapeWaHref} />
          ) : null}
          <WizardStepProgress items={step1Checklist} className="mt-4" />
          <WizardStepBlockerBanner blockers={stepBlockers} className="mt-4" />

          <StepNav onBack={() => goToStep(0)} onNext={attemptAdvanceFromStep1} />
        </BookingStepPanel>
      )}

      {step === 2 && selected && (
        <BookingStepPanel stepKey={2}>
          {step3HoldDeadline ? (
            <SingerWizardStep3HoldTimer deadlineMs={step3HoldDeadline} />
          ) : null}
          <p className="mb-4 text-center text-base font-semibold text-foreground">
            {SINGER_CRO_CONFIG.step3Closer}
          </p>
          <SingerPriceReframe />
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
            <div className="relative z-10 space-y-4 pb-28">
              <BookWhatHappensNext />
              <BookTrustBadges badges={[{ icon: "🎤", label: "צ'ק סאונד לפני ההופעה" }]} />
              {showLastMinuteRecordingOffer ? (
                <SingerLastMinuteRecordingOffer
                  checked={form.lastMinuteUpsell}
                  onChange={handleLastMinuteRecordingChange}
                />
              ) : null}
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
                showPaymentTrust
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
              <button type="button" onClick={() => setStep(1)} className="w-full text-xs text-muted-foreground hover:text-brand-red">
                חזרה לפרטים
              </button>
            </div>
          </div>
        </BookingStepPanel>
      )}

      <SingerWizardStepTransitionOverlay
        active={step2Transition}
        layout="summary"
        onComplete={completeStep2Transition}
        onAbort={() => setStep2Transition(false)}
      />
      <WizardCroShell
        config={SINGER_CRO_CONFIG}
        exitIntentOpen={exitIntentOpen}
        packageLabel={packageSummaryLabel || "הגברה לזמרים"}
        totalExVat={totalExVat}
        onContinueExit={() => {
          setExitIntentOpen(false);
          scrollToBookWizardPanelAndFocusStep(step);
        }}
        onCloseExit={() => setExitIntentOpen(false)}
        idleVisible={wizardIdle}
        escapeWaHref={escapeWaHref}
        onDismissIdle={dismissWizardIdle}
      />
    </div>
  );
}

function StepNav({
  onBack,
  onNext,
  showBack = true,
}: {
  onBack?: () => void;
  onNext: () => void;
  showBack?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3 border-t border-border pt-6">
      {showBack && onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="min-h-11 rounded-2xl border border-border/60 px-5 py-2.5 text-sm font-semibold"
        >
          חזרה
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onNext}
        className="min-h-12 rounded-2xl bg-brand-red px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        המשך
      </button>
    </div>
  );
}
