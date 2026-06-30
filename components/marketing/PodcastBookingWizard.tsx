"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import InfoTip from "@/components/ui/InfoTip";
import BookingApprovals from "@/components/booking/BookingApprovals";
import KoalendarModal from "@/components/booking/KoalendarModal";
import BookingPaymentTrust from "@/components/booking/BookingPaymentTrust";
import { useReportBookWizardLivePrice } from "@/components/booking/BookWizardLivePrice";
import BookingSummaryActions from "@/components/booking/BookingSummaryActions";
import BookTrustBadges from "@/components/booking/BookTrustBadges";
import SmartAddonDrawer from "@/components/booking/SmartAddonDrawer";
import BookUpsellSection from "@/components/booking/BookUpsellSection";
import WizardContextFaqSnapshot from "@/components/booking/WizardContextFaqSnapshot";
import WizardProgressBar from "@/components/booking/WizardProgressBar";
import WizardStepCelebrate from "@/components/booking/WizardStepCelebrate";
import MicroAudioAudition from "@/components/ui/MicroAudioAudition";
import BookWhatHappensNext from "@/components/booking/BookWhatHappensNext";
import BookingStepPanel from "@/components/booking/BookingStepPanel";
import BookingWhatsAppPreview from "@/components/booking/BookingWhatsAppPreview";
import BookingWizardNav from "@/components/booking/BookingWizardNav";
import BookDraftRecoveryBanner from "@/components/booking/BookDraftRecoveryBanner";
import {
  PodcastLastMinuteHighlightsOffer,
  PodcastPriceReframe,
  PodcastReassuranceBadge,
  PodcastSessionPriorityPills,
  PodcastWelcomePerkPills,
  PodcastWizardStep3HoldTimer,
  PodcastWizardStepTransitionOverlay,
  PodcastWizardUrgencyHint,
} from "@/components/booking/PodcastWizardCroBlocks";
import { WizardCroShell } from "@/components/booking/cro/WizardCroShell";
import WizardWhatsAppEscapeLink from "@/components/booking/WizardWhatsAppEscapeLink";
import BookingSuccessPanel from "@/components/booking/BookingSuccessPanel";
import BookingFormField from "@/components/booking/BookingFormField";
import BookingPhoneInput from "@/components/booking/BookingPhoneInput";
import { bookFieldClass } from "@/lib/book-form-ui";
import { FORM_MICROCOPY } from "@/lib/form-microcopy";
import PriceWithVat from "@/components/booking/PriceWithVat";
import WizardCouponPriceLine from "@/components/booking/WizardCouponPriceLine";
import NeedsDiscoveryStep from "@/components/booking/NeedsDiscoveryStep";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useBookCoreContactBridge } from "@/hooks/useBookCoreContactBridge";
import { useBookExitIntent } from "@/hooks/useBookExitIntent";
import { useWizardHistory } from "@/hooks/useWizardHistory";
import { useWizardUserIdle } from "@/hooks/useWizardUserIdle";
import { PODCAST_CRO_CONFIG } from "@/lib/data/cro/podcast";
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
import { useBookWizardStep } from "@/hooks/useBookWizardStep";
import { useBookingWizard } from "@/hooks/useBookingWizard";
import {
  PODCAST_EXTRA_PARTICIPANT_PRICE,
  PODCAST_OVERTIME_RATE,
  PODCAST_PACKAGES,
  type PodcastPackageId,
} from "@/lib/data/podcast-calculator";
import {
  getCatalogAddonsForPodcastPackage,
  resolveAddonLabel,
  resolveAddonPrice,
  sumAddonPrices,
} from "@/lib/pricing-addon-adapter";
import { getPodcastUpsellItems } from "@/lib/data/podcast-booking-upsells";
import { UPSELLS } from "@/lib/data/booking-calculator-services";
import { getWizardFaqsForPodcastPackage } from "@/lib/data/wizard-step-faqs";
import type { AudioDemoId } from "@/lib/data/audio-demos";
import { sendBookingWaCta } from "@/lib/data/conversion-copy";
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
import { getAudienceRouteById } from "@/lib/data/book-audience-routes";
import {
  calcMobileStudioExVat,
  MOBILE_GEO_FEES,
  type MobileGeoId,
} from "@/lib/data/mobile-studio-booking";
import { emotionalLabelToId } from "@/lib/yc-lead-tag";
import { parsePodcastFormDraft, type PodcastFormDraft } from "@/lib/podcast-form-draft";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { scrollAndHighlightFirstError } from "@/lib/scroll-to-error";
import type { PriceItemId } from "@/lib/data/pricing-catalog";
import PricingCatalogBanner from "@/components/pricing/PricingCatalogBanner";
import { cn } from "@/lib/utils";

const PODCAST_PACKAGE_AUDIO_DEMO: Partial<Record<PodcastPackageId, AudioDemoId>> = {
  starter: "podcast-zoom-cleanup",
  audio: "podcast-zoom-cleanup",
  video: "recording-vocal-polish",
  social: "recording-vocal-polish",
};

const STEPS = ["חבילה", "פרטים", "סיכום"] as const;

const TIMEFRAME_OPTIONS = [
  { value: "", label: "מתי מתאים לכם?" },
  { value: "asap", label: "בהקדם האפשרי" },
  { value: "next_week", label: "שבוע הקרוב" },
  { value: "this_month", label: "בחודש הקרוב" },
  { value: "exploring", label: "רק בודק/ת אפשרויות" },
] as const;

const PODCAST_COMPARISON_ROWS = [
  { label: "הקלטה באולפן", ids: ["starter", "audio", "video", "social"] },
  { label: "עריכה ומיקס", ids: ["audio", "video", "social"] },
  { label: "מאסטרינג", ids: ["audio", "video", "social"] },
  { label: "העלאה לספוטיפיי", ids: ["audio", "video", "social"] },
  { label: "הקלטת וידאו (3 מצלמות)", ids: ["video", "social"] },
  { label: "3 קטעי רילס", ids: ["social"] },
  { label: "העלאה לאפל + יוטיוב", ids: ["social"] },
] as const;

const INITIAL: PodcastFormDraft = {
  packageId: "",
  overtimeBlocks: 0,
  participantCount: 1,
  location: "modiin",
  mobileGeo: "",
  name: "",
  phone: "",
  timeframe: "",
  customerNeed: "",
  notes: "",
  selectedUpsells: [],
  sessionPriority: "",
  welcomePerk: "",
  lastMinuteUpsell: false,
  termsAccepted: false,
};

type PodcastBookingWizardProps = {
  routeId?: string | null;
  emotionalLabel?: string | null;
  initialPackageId?: PodcastPackageId | null;
  initialParticipantCount?: number;
  initialLocation?: "modiin" | "mobile";
  pricingCatalogId?: PriceItemId | null;
};

export default function PodcastBookingWizard({
  routeId = null,
  emotionalLabel = null,
  initialPackageId = null,
  initialParticipantCount,
  initialLocation,
  pricingCatalogId = null,
}: PodcastBookingWizardProps) {
  const coreContactMerged = useRef(false);
  const [step2Transition, setStep2Transition] = useState(false);
  const [exitIntentOpen, setExitIntentOpen] = useState(false);
  const [step3HoldDeadline, setStep3HoldDeadline] = useState<number | null>(null);
  const [priceHoldLabel, setPriceHoldLabel] = usePriceHoldBadge(
    "podcast",
    PODCAST_CRO_CONFIG.urgency.priceHoldBadge,
  );
  const [addonDrawerOpen, setAddonDrawerOpen] = useState(false);
  const [celebrateKey, setCelebrateKey] = useState(0);
  const [celebrateMeta, setCelebrateMeta] = useState<{ from: number; to: number } | null>(
    null,
  );
  const prevStepRef = useRef(0);
  const initialForm = useMemo<PodcastFormDraft>(
    () => ({
      ...INITIAL,
      packageId: initialPackageId ?? "",
      participantCount: initialParticipantCount ?? INITIAL.participantCount,
      location: initialLocation ?? INITIAL.location,
    }),
    [initialPackageId, initialParticipantCount, initialLocation],
  );

  const {
    step,
    form,
    errors,
    koalendarOpen,
    setStep,
    patchForm,
    setErrors,
    mergeErrors,
    toggleUpsell,
    selectedUpsellSet,
    setKoalendarOpen,
    draft,
    guard,
    dismissDraft,
    runSubmit,
    resetWizard,
    isSubmitted,
    lastWaHref,
    lastIntent,
  } = useBookingWizard({
    storageKey: "podcast",
    formId: "podcast_booking_wizard",
    initialForm,
    parseDraft: (raw) => parsePodcastFormDraft(raw, initialForm),
    persistStepInDraft: true,
    maxStep: 2,
  });

  const { honeypot, setHoneypot, globalError } = guard;

  const trackFunnel = useWizardFunnel("podcast");

  useBookCoreContactBridge(form.name, form.phone);

  useWizardHistory({
    category: "podcast",
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

  useBookWizardStep("podcast", step);

  useEffect(() => {
    if (step > prevStepRef.current) {
      setCelebrateMeta({ from: prevStepRef.current, to: step });
      setCelebrateKey((k) => k + 1);
    }
    prevStepRef.current = step;
  }, [step]);

  const catalogAddonItems = useMemo(
    () => getCatalogAddonsForPodcastPackage(form.packageId),
    [form.packageId],
  );
  const upsellItems = useMemo(
    () =>
      catalogAddonItems.length > 0
        ? catalogAddonItems
        : getPodcastUpsellItems(form.packageId),
    [catalogAddonItems, form.packageId],
  );
  const wizardFaqs = useMemo(
    () => getWizardFaqsForPodcastPackage(form.packageId),
    [form.packageId],
  );

  const handlePackageSelect = useCallback(
    (pkgId: PodcastPackageId) => {
      patchForm({
        packageId: pkgId,
        overtimeBlocks: 0,
        selectedUpsells: [],
      });
      const addons = getCatalogAddonsForPodcastPackage(pkgId);
      if (addons.length > 0) setAddonDrawerOpen(true);
    },
    [patchForm],
  );

  useEffect(() => {
    if (initialPackageId && !form.packageId) {
      patchForm({ packageId: initialPackageId });
    }
    if (initialParticipantCount && form.participantCount < initialParticipantCount) {
      patchForm({ participantCount: initialParticipantCount });
    }
    if (initialLocation && form.location !== initialLocation) {
      patchForm({ location: initialLocation });
    }
  }, [
    initialPackageId,
    initialParticipantCount,
    initialLocation,
    form.packageId,
    form.participantCount,
    form.location,
    patchForm,
  ]);

  const routeMeta = routeId ? getAudienceRouteById(routeId) : undefined;
  const ycFormId = routeMeta?.utm_campaign ?? "podcast_booking_wizard";
  const emotionalId = emotionalLabelToId(emotionalLabel);
  const mobileExVat =
    form.location === "mobile" && form.mobileGeo
      ? calcMobileStudioExVat(form.mobileGeo)
      : 0;

  const selected = PODCAST_PACKAGES.find((p) => p.id === form.packageId);
  const extraParticipantsCost =
    form.participantCount > 2
      ? (form.participantCount - 2) * PODCAST_EXTRA_PARTICIPANT_PRICE
      : 0;
  const upsellTotal = sumAddonPrices(new Set(form.selectedUpsells));
  const lastMinuteUpsellCfg = PODCAST_CRO_CONFIG.lastMinuteUpsell;
  const lastMinuteHighlightsDiscount =
    form.lastMinuteUpsell &&
    lastMinuteUpsellCfg &&
    form.selectedUpsells.includes(lastMinuteUpsellCfg.upgradeId)
      ? lastMinuteUpsellCfg.listPrice - lastMinuteUpsellCfg.promoPrice
      : 0;
  const adjustedUpsellTotal = upsellTotal - lastMinuteHighlightsDiscount;
  const packageTotal =
    (selected?.price ?? 0) +
    form.overtimeBlocks * PODCAST_OVERTIME_RATE +
    extraParticipantsCost +
    adjustedUpsellTotal +
    mobileExVat;

  const livePriceReport = useMemo(() => {
    if (!selected || packageTotal <= 0) return null;
    return {
      totalExVat: packageTotal,
      title: selected.name,
      ctaLabel: sendBookingWaCta(withVat(packageTotal)),
    };
  }, [selected, packageTotal]);
  useReportBookWizardLivePrice(livePriceReport);

  const canStep0 = form.packageId !== "";

  const buildSummaryContext = () => {
    const displayPhone = form.phone.trim()
      ? formatPhoneForDisplay(form.phone.trim())
      : "";
    const timeframeLabel =
      TIMEFRAME_OPTIONS.find((o) => o.value === form.timeframe)?.label ?? "";
    const summaryLines = [
      ...(selected ? [{ label: "חבילה", value: selected.name }] : []),
      ...(form.participantCount > 1
        ? [
            {
              label: "מספר משתתפים",
              value:
                form.participantCount > 2
                  ? `${form.participantCount} (+${extraParticipantsCost.toLocaleString("he-IL")} ₪)`
                  : String(form.participantCount),
            },
          ]
        : []),
      ...(form.overtimeBlocks > 0
        ? [
            {
              label: "זמן נוסף",
              value: `+${form.overtimeBlocks * 30} דק׳ (+${(form.overtimeBlocks * PODCAST_OVERTIME_RATE).toLocaleString("he-IL")} ₪)`,
            },
          ]
        : []),
      ...(timeframeLabel ? [{ label: "מועד מועדף", value: timeframeLabel }] : []),
      ...(form.location === "mobile" && form.mobileGeo
        ? [
            {
              label: "מיקום",
              value: `אולפן נייד - ${MOBILE_GEO_FEES[form.mobileGeo].label} (+${calcMobileStudioExVat(form.mobileGeo).toLocaleString("he-IL")} ₪ לפני מע״מ)`,
            },
          ]
        : [{ label: "מיקום", value: "אולפן אקוסטי במודיעין" }]),
      ...(form.notes ? [{ label: "הערות", value: sanitizeLeadText(form.notes, 500) }] : []),
      ...(form.sessionPriority
        ? [
            {
              label: "עדיפות",
              value:
                PODCAST_CRO_CONFIG.anxieties.find((a) => a.id === form.sessionPriority)
                  ?.label ?? form.sessionPriority,
            },
          ]
        : []),
      ...(form.welcomePerk
        ? [
            {
              label: "הטבת הגעה",
              value:
                PODCAST_CRO_CONFIG.perks.find((p) => p.id === form.welcomePerk)?.label ??
                form.welcomePerk,
            },
          ]
        : []),
      ...(form.selectedUpsells ?? [])
        .filter((k) => resolveAddonPrice(k) > 0)
        .map((k) => ({
          label: "תוספת",
          value: `${resolveAddonLabel(k)} (+${resolveAddonPrice(k).toLocaleString("he-IL")} ₪)`,
        })),
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

  const summaryLinesForEscape = useMemo(
    () => buildSummaryContext().summaryLines,
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mirrors form selections
    [
      form,
      selected,
      extraParticipantsCost,
      packageTotal,
    ],
  );

  const escapeWaHref = useMemo(
    () =>
      buildWizardEscapeHref({
        category: "podcast",
        serviceLabel: PODCAST_CRO_CONFIG.serviceLabel,
        formId: PODCAST_CRO_CONFIG.formId,
        summaryLines: summaryLinesForEscape,
        priceExVat: packageTotal,
        packageLabel: selected?.name,
        contactName: form.name,
        contactPhone: form.phone,
        ycStep: step + 1,
      }),
    [summaryLinesForEscape, packageTotal, selected?.name, form.name, form.phone, step],
  );

  const handleGhostLeadFired = useCallback(() => {
    trackFunnel("GhostLead_Fired", {
      package_id: form.packageId || "",
      step: 3,
    });
  }, [form.packageId, trackFunnel]);

  useWizardGhostLead({
    category: "podcast",
    formId: PODCAST_CRO_CONFIG.formId,
    step,
    closingStepIndex: 2,
    name: form.name,
    phone: form.phone,
    subject: "טיוטת הזמנת פודקאסט - שלב סגירה",
    body: summaryLinesForEscape.map((l) => `${l.label}: ${l.value}`).join("\n"),
    onFired: handleGhostLeadFired,
  });

  const showCroOverlays = !isSubmitted && step < 2;
  const packageSummaryLabel = selected?.name ?? "";

  const showLastMinuteHighlightsOffer =
    lastMinuteUpsellCfg &&
    (form.lastMinuteUpsell ||
      !form.selectedUpsells.includes(lastMinuteUpsellCfg.upgradeId));

  const handleLastMinuteHighlightsChange = (checked: boolean) => {
    if (!lastMinuteUpsellCfg) return;
    const id = lastMinuteUpsellCfg.upgradeId;
    if (checked) {
      const next = form.selectedUpsells.includes(id)
        ? form.selectedUpsells
        : [...form.selectedUpsells, id];
      patchForm({ lastMinuteUpsell: true, selectedUpsells: next });
      return;
    }
    patchForm({
      lastMinuteUpsell: false,
      selectedUpsells: form.selectedUpsells.filter((uid) => uid !== id),
    });
  };

  const handleExitIntent = useCallback(() => {
    if (packageTotal > 0 && packageSummaryLabel) {
      saveCategoryPriceHold("podcast", {
        packageLabel: packageSummaryLabel,
        totalExVat: packageTotal,
      });
      setPriceHoldLabel(PODCAST_CRO_CONFIG.urgency.priceHoldBadge);
    }
    setExitIntentOpen(true);
  }, [packageTotal, packageSummaryLabel]);

  useBookExitIntent({
    enabled: showCroOverlays && packageTotal > 0 && !!selected,
    onTrigger: handleExitIntent,
  });

  const { idle: wizardIdle, dismiss: dismissWizardIdle } = useWizardUserIdle({
    enabled: !isSubmitted && step <= 2,
  });

  const completeStep2Transition = useCallback(() => {
    setStep2Transition(false);
    setStep3HoldDeadline(ensureHoldDeadline("podcast"));
    setStep(2);
    scrollToBookWizardPanelAndFocusStep(2);
  }, [setStep]);

  const beginStep2Transition = () => {
    if (!canStep1) return;
    trackFunnel("Step2_PackageSelected", {
      package_id: form.packageId || "",
      step: 2,
    });

    if (form.phone.trim()) {
      const phoneCheck = validateBookingLead({
        name: form.name,
        phone: form.phone,
        date: "",
        time: "",
        location: "",
        notes: form.notes,
        requireLocation: false,
        requireDate: false,
        requireTime: false,
      });
      if (!phoneCheck.ok && phoneCheck.errors?.phone) {
        mergeErrors({ phone: phoneCheck.errors.phone });
        scrollAndHighlightFirstError();
        return;
      }
    }

    setStep2Transition(true);
  };

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
      last_minute_highlights: form.lastMinuteUpsell,
    });
    void fireBookingConfetti();
    runSubmit(
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
          packageLabel: selected?.name,
          summaryLines,
          contact: { name: sanitizeLeadText(form.name, 60), phone: displayPhone },
          priceExVat: selected ? packageTotal : undefined,
          totalEstimate: selected ? withVat(packageTotal) : undefined,
          customerNeed: sanitizeLeadText(form.customerNeed, 500) || null,
          timing:
            form.timeframe === "asap"
              ? "urgent"
              : form.timeframe === "exploring"
                ? "future"
                : form.timeframe
                  ? "month"
                  : null,
          utmSource: readUtmSource() ?? "/book#podcast",
          bookCategory: "podcast",
          includeTrustFooter: true,
          ycForm: ycFormId,
          ycRoute: routeId,
          ycEmotional: emotionalId,
          ycMobileGeo: form.location === "mobile" && form.mobileGeo ? form.mobileGeo : null,
        });
        const href = buildWhatsAppHref({
          text: body,
          utm_source: "website",
          utm_campaign: ycFormId,
        });
        return {
          waHref: href,
          intent,
          email: {
            formId: ycFormId,
            subject: "הזמנת פודקאסט",
            body,
            name: form.name,
            phone: displayPhone,
            crossSell: {
              bookCategory: "podcast",
              routeId,
              recordingType: form.packageId || null,
              mobileGeo:
                form.location === "mobile" && form.mobileGeo ? form.mobileGeo : null,
              largeGroup:
                form.location !== "mobile" && form.participantCount >= 12,
            },
          },
        };
      },
      { leadCategory: "podcast" },
    );
  };

  const previewBody =
    step === 2 && selected
      ? buildBookingWhatsAppBody({
          intent: "continue_chat",
          serviceLabel: `פודקאסט - ${selected.name}`,
          packageLabel: selected.name,
          summaryLines: buildSummaryContext().summaryLines,
          contact: buildSummaryContext().contact,
          priceExVat: packageTotal,
          totalEstimate: withVat(packageTotal),
          customerNeed: sanitizeLeadText(form.customerNeed, 500) || null,
          timing:
            form.timeframe === "asap"
              ? "urgent"
              : form.timeframe === "exploring"
                ? "future"
                : form.timeframe
                  ? "month"
                  : null,
          utmSource: readUtmSource() ?? "/book#podcast",
          bookCategory: "podcast",
          includeTrustFooter: true,
          ycForm: ycFormId,
          ycRoute: routeId,
          ycEmotional: emotionalId,
          ycMobileGeo: form.location === "mobile" && form.mobileGeo ? form.mobileGeo : null,
        })
      : undefined;

  if (isSubmitted && lastWaHref) {
    return (
      <BookingSuccessPanel
        intent={lastIntent}
        whatsappHref={lastWaHref}
        bookCategory="podcast"
        routeId={routeId}
        recordingType={form.packageId || null}
        onNewBooking={resetWizard}
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

      {pricingCatalogId ? <PricingCatalogBanner catalogId={pricingCatalogId} /> : null}

      <BookingWizardNav steps={STEPS} currentStep={step} label="שלבי הזמנת פודקאסט" />
      <WizardProgressBar
        currentStep={step}
        totalSteps={STEPS.length}
        celebrateKey={celebrateKey}
        className="-mt-4"
      />
      {celebrateMeta ? (
        <WizardStepCelebrate
          key={celebrateKey}
          category="podcast"
          fromStep={celebrateMeta.from}
          toStep={celebrateMeta.to}
        />
      ) : null}

      {step === 0 && (
        <BookingStepPanel stepKey={0}>
          <PodcastWizardUrgencyHint priceHoldLabel={priceHoldLabel} className="mb-4" />
          <h2 className="text-xl font-semibold text-foreground">בחרו חבילת פודקאסט</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {PODCAST_PACKAGES.map((pkg) => {
              const active = form.packageId === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => handlePackageSelect(pkg.id)}
                  className={cn(
                    "relative rounded-2xl border p-5 text-start",
                    active ? "border-brand-red bg-brand-red/5" : "border-border bg-background",
                  )}
                  aria-pressed={active}
                >
                  {PODCAST_PACKAGE_AUDIO_DEMO[pkg.id] ? (
                    <MicroAudioAudition
                      demoId={PODCAST_PACKAGE_AUDIO_DEMO[pkg.id]!}
                      className="absolute start-3 top-3"
                    />
                  ) : null}
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

          {form.packageId ? (
            <WizardContextFaqSnapshot items={wizardFaqs} className="mt-6" />
          ) : null}

          {/* Participant count */}
          <div className="mt-6">
            <p className="mb-1 text-sm font-semibold text-foreground">כמה משתתפים בפרק?</p>
            <p className="mb-3 text-xs text-muted-foreground">
              עד 2 משתתפים - כלול במחיר. כל משתתף נוסף:{" "}
              <span className="font-medium text-foreground">
                +{PODCAST_EXTRA_PARTICIPANT_PRICE} ₪
              </span>{" "}
              (מיקרופון נוסף + עריכה מוגברת)
            </p>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((count) => {
                const extra = Math.max(0, count - 2) * PODCAST_EXTRA_PARTICIPANT_PRICE;
                const active = form.participantCount === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => patchForm({ participantCount: count })}
                    className={cn(
                      "flex flex-col items-center rounded-xl border px-4 py-2.5 text-center transition-colors",
                      active
                        ? "border-brand-red bg-brand-red/10 text-brand-red"
                        : "border-border bg-background text-foreground hover:border-brand-red/40",
                    )}
                    aria-pressed={active}
                  >
                    <span className="text-sm font-semibold">
                      {count === 1 ? "מגיש יחיד" : `${count} אנשים`}
                    </span>
                    <span className={cn("text-[0.65rem]", active ? "text-brand-red/80" : "text-muted-foreground")}>
                      {extra > 0 ? `+${extra} ₪` : "כלול"}
                    </span>
                  </button>
                );
              })}
              <a
                href="https://wa.me/972587555456"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center rounded-xl border border-dashed border-border px-4 py-2.5 text-center text-sm text-muted-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
              >
                <span className="text-sm font-semibold">5+ אנשים</span>
                <span className="text-[0.65rem]">ווטסאפ לתיאום</span>
              </a>
            </div>
          </div>

          {selected ? (
            <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">
                גלישה בזמן - {PODCAST_OVERTIME_RATE.toLocaleString("he-IL")} ₪ לכל 30 דקות
              </p>
              <p className="mb-3 text-sm font-semibold text-foreground">כמה זמן הקלטה נוסף?</p>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => patchForm({ overtimeBlocks: b })}
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

          {/* Comparison - mobile: selected package only; desktop: full table */}
          {selected ? (
            <div className="rounded-xl border border-border bg-surface p-4 md:hidden">
              <p className="mb-3 text-xs font-semibold text-muted-foreground">
                מה כלול ב{selected.name.split(" - ")[0]}?
              </p>
              <ul className="space-y-2">
                {PODCAST_COMPARISON_ROWS.filter((row) =>
                  (row.ids as readonly string[]).includes(selected.id),
                ).map((row) => (
                  <li key={row.label} className="flex items-start gap-2 text-xs text-foreground">
                    <span className="text-green-600" aria-hidden="true">
                      ✓
                    </span>
                    {row.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
            <table className="w-full text-sm">
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
                {PODCAST_COMPARISON_ROWS.map((row, ri) => (
                  <tr
                    key={row.label}
                    className={cn("border-b border-border last:border-0", ri % 2 === 1 && "bg-surface/50")}
                  >
                    <td className="px-4 py-2 text-xs text-foreground">{row.label}</td>
                    {PODCAST_PACKAGES.map((pkg) => (
                      <td key={pkg.id} className="px-3 py-2 text-center text-base">
                        {(row.ids as readonly string[]).includes(pkg.id) ? (
                          <span className="text-green-600" aria-label="כלול">
                            ✓
                          </span>
                        ) : (
                          <span className="text-muted-foreground/40" aria-label="לא כלול">
                            -
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {form.packageId && upsellItems.length > 0 && catalogAddonItems.length === 0 ? (
            <BookUpsellSection
              items={upsellItems}
              selected={selectedUpsellSet}
              onToggle={toggleUpsell}
              className="mt-6"
            />
          ) : null}

          {PODCAST_CRO_CONFIG.escapePlacements.includes("after_packages") && selected ? (
            <WizardWhatsAppEscapeLink href={escapeWaHref} />
          ) : null}

          <StepNav
            onNext={() => {
              trackFunnel("Step1_Complete", {
                package_id: form.packageId || "",
                step: 1,
              });
              setStep(1);
            }}
            nextDisabled={!canStep0}
            showBack={false}
          />
        </BookingStepPanel>
      )}

      {step === 1 && (
        <BookingStepPanel stepKey={1}>
          <h2 className="text-xl font-semibold text-foreground">פרטים לתיאום</h2>
          <div className="relative max-w-lg space-y-4">
            <HoneypotField value={honeypot} onChange={setHoneypot} />
            <LeadFormAlert message={globalError} />
            <BookingFormField
              id="pb-name"
              label={`${FORM_MICROCOPY.nameLabel} *`}
              placeholder={FORM_MICROCOPY.namePlaceholder}
              autoComplete="name"
              value={form.name}
              error={errors.name}
              onChange={(v) => patchForm({ name: v })}
            />
            <BookingPhoneInput
              id="pb-phone"
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
            <div>
              <label htmlFor="pb-timeframe" className="mb-1.5 block text-xs font-semibold">
                מועד מועדף
              </label>
              <select
                id="pb-timeframe"
                value={form.timeframe}
                onChange={(e) => patchForm({ timeframe: e.target.value })}
                className={cn(bookFieldClass, "appearance-none")}
              >
                {TIMEFRAME_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} disabled={o.value === ""}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold text-foreground">איפה נקליט?</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(
                  [
                    { id: "modiin" as const, label: "אולפן אקוסטי במודיעין", sub: "חנייה חופשית" },
                    {
                      id: "mobile" as const,
                      label: "🚗🏠 אולפן נייד - מגיעים עד אליכם",
                      sub: "מ-999 ₪ לפני מע״מ + אזור",
                    },
                  ] as const
                ).map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() =>
                      patchForm({
                        location: loc.id,
                        mobileGeo:
                          loc.id === "mobile" ? form.mobileGeo || "center" : "",
                      })
                    }
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-start text-sm",
                      form.location === loc.id
                        ? "border-brand-red bg-brand-red/5 text-brand-red"
                        : "border-border/60 hover:border-brand-red/30",
                    )}
                    aria-pressed={form.location === loc.id}
                  >
                    <span className="font-semibold">{loc.label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{loc.sub}</span>
                  </button>
                ))}
              </div>
              {form.location === "mobile" ? (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">בחירת אזור</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {(Object.keys(MOBILE_GEO_FEES) as MobileGeoId[]).map((geoId) => {
                      const geo = MOBILE_GEO_FEES[geoId];
                      const active = form.mobileGeo === geoId;
                      const price = calcMobileStudioExVat(geoId);
                      return (
                        <button
                          key={geoId}
                          type="button"
                          onClick={() => patchForm({ mobileGeo: geoId })}
                          className={cn(
                            "rounded-xl border px-3 py-2 text-start text-xs",
                            active
                              ? "border-brand-red bg-brand-red/5 text-brand-red"
                              : "border-border/60",
                          )}
                          aria-pressed={active}
                        >
                          <span className="font-semibold">{geo.label}</span>
                          <span className="mt-0.5 block text-muted-foreground">
                            {price.toLocaleString("he-IL")} ₪ לפני מע״מ - {geo.detail}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
            <BookingFormField
              id="pb-notes"
              label="הערות"
              placeholder={FORM_MICROCOPY.visionPlaceholder}
              multiline
              value={form.notes}
              onChange={(v) => patchForm({ notes: v })}
            />
            <PodcastSessionPriorityPills
              value={form.sessionPriority}
              onChange={(id) => patchForm({ sessionPriority: id })}
            />
            {form.sessionPriority ? (
              <PodcastReassuranceBadge anxietyId={form.sessionPriority} />
            ) : null}
            <PodcastWelcomePerkPills
              value={form.welcomePerk}
              onChange={(id) => patchForm({ welcomePerk: id })}
            />
          </div>
          {PODCAST_CRO_CONFIG.escapePlacements.includes("step_contact") ? (
            <WizardWhatsAppEscapeLink href={escapeWaHref} />
          ) : null}
          <StepNav
            onBack={() => setStep(0)}
            onNext={beginStep2Transition}
            nextDisabled={!canStep1}
          />
        </BookingStepPanel>
      )}

      {step === 2 && selected && (
        <BookingStepPanel stepKey={2}>
          {step3HoldDeadline ? (
            <PodcastWizardStep3HoldTimer deadlineMs={step3HoldDeadline} />
          ) : null}
          <p className="mb-4 text-center text-base font-semibold text-foreground">
            {PODCAST_CRO_CONFIG.step3Closer}
          </p>
          <PodcastPriceReframe />
          <button
            type="button"
            onClick={() => setStep(0)}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
          > ערוך בחירה
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
              <WizardCouponPriceLine totalExVat={packageTotal} size="lg" className="mt-4" />
            </div>
            <div className="relative z-10 space-y-4 pb-28">
              <BookWhatHappensNext />
              <BookTrustBadges
                badges={[
                  { icon: "🔄", label: "סבב תיקונים אחד כלול בעריכה" },
                  { icon: "☁️", label: "גיבוי ענן עד ההקלטה הבאה" },
                  ...(form.location !== "mobile"
                    ? [{ icon: "🅿️", label: "חנייה חופשית במודיעין" }]
                    : [{ icon: "🚗", label: "מגיעים אליכם עם כל הציוד" }]),
                ]}
              />
              <div className="rounded-xl bg-surface px-4 py-4 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">ציר זמן ריאלי</h3>
                <ol className="space-y-2 text-sm text-muted-foreground list-none">
                  <li>
                    <span className="font-medium text-foreground">היום:</span>{" "}
                    הקלטה באולפן. חומרי הגלם אצלכם ביד בסוף הסשן
                  </li>
                  <li>
                    <span className="font-medium text-foreground">1 עד 3 ימי עבודה:</span>{" "}
                    עריכה, מיקס ומאסטרינג מלאים
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span>
                      <span className="font-medium text-foreground">לאחר האישור שלכם:</span>{" "}
                      העלאה לספוטיפיי, אפל פודקאסטים ויוטיוב לפי חבילה
                    </span>
                    <InfoTip
                      text="העלאה לפלטפורמות כלולה בחבילות Audio ומעלה. חבילת Starter מספקת קובץ מוכן להעלאה עצמית."
                      className="mt-0.5 shrink-0"
                    />
                  </li>
                </ol>
                <p className="text-xs text-muted-foreground">
                  סבב תיקונים ראשון כלול. כל סבב נוסף מעבר לכך הוא עבודת מחשב נוספת ועולה בהתאם
                </p>
              </div>
              {showLastMinuteHighlightsOffer ? (
                <PodcastLastMinuteHighlightsOffer
                  checked={form.lastMinuteUpsell}
                  onChange={handleLastMinuteHighlightsChange}
                />
              ) : null}
              <NeedsDiscoveryStep
                value={form.customerNeed}
                onChange={(v) => patchForm({ customerNeed: v })}
                id="pb-customer-need"
              />
              {previewBody ? <BookingWhatsAppPreview messageBody={previewBody} /> : null}
              <p className="text-sm text-muted-foreground">{BOOKING_SUMMARY_INTRO}</p>
              <div className="rounded-xl bg-surface px-4 py-3 text-center">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  המציאות דינמית. אם תצטרכו לשנות שעה או להוסיף משתתף אחרי השליחה הכל בסדר. גמיש עד רגע ההקלטה. אין קנסות ואין אותיות קטנות.
                </p>
              </div>
              <BookingApprovals
                variant="light"
                termsAccepted={form.termsAccepted}
                onTermsChange={(v) => patchForm({ termsAccepted: v })}
                termsError={errors.terms}
              />
              <BookingSummaryActions
                socialProof="פרק ראשון מוכן בדרך כלל תוך 5 ימי עבודה"
                continueWhatsApp={{
                  label: sendBookingWaCta(withVat(packageTotal)),
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

              {form.phone.trim().length >= 9 && (
                <p className="text-center text-xs text-muted-foreground">
                  לא עכשיו?{" "}
                  <a
                    href={buildWhatsAppHref({
                      text:
                        `שמרתי את הפרטים שלי לפודקאסט באולפן יקיר כהן:\n\n` +
                        buildSummaryContext().summaryLines
                          .map((l) => `• ${l.label}: ${l.value}`)
                          .join("\n") +
                        `\n\nלהמשיך מכאן: yakircohen.com/book#podcast`,
                      utm_source: "website",
                      utm_campaign: "podcast_save_for_later",
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-brand-red"
                  >
                    שלחו לעצמכם ווטסאפ לחזרה
                  </a>
                </p>
              )}

              <button type="button" onClick={() => setStep(1)} className="w-full text-xs text-muted-foreground hover:text-brand-red">
                חזרה לפרטים
              </button>
            </div>
          </div>
        </BookingStepPanel>
      )}

      <PodcastWizardStepTransitionOverlay
        active={step2Transition}
        layout="summary"
        onComplete={completeStep2Transition}
        onAbort={() => setStep2Transition(false)}
      />
      <SmartAddonDrawer
        open={addonDrawerOpen && Boolean(selected)}
        packageLabel={selected?.name ?? "חבילה"}
        basePriceExVat={
          (selected?.price ?? 0) +
          form.overtimeBlocks * PODCAST_OVERTIME_RATE +
          extraParticipantsCost +
          mobileExVat
        }
        items={catalogAddonItems}
        selected={selectedUpsellSet}
        onToggle={toggleUpsell}
        onClose={() => setAddonDrawerOpen(false)}
        onContinue={() => setAddonDrawerOpen(false)}
      />
      <WizardCroShell
        config={PODCAST_CRO_CONFIG}
        exitIntentOpen={exitIntentOpen}
        packageLabel={packageSummaryLabel || "פודקאסט"}
        totalExVat={packageTotal}
        onContinueExit={() => {
          setExitIntentOpen(false);
          scrollToBookWizardPanelAndFocusStep(step);
        }}
        onCloseExit={() => setExitIntentOpen(false)}
        idleVisible={wizardIdle}
        escapeWaHref={escapeWaHref}
        onDismissIdle={dismissWizardIdle}
      />
      <KoalendarModal open={koalendarOpen} onClose={() => setKoalendarOpen(false)} />
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
