"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Headphones, Lightbulb, TrendingUp } from "lucide-react";
import InfoTip from "@/components/ui/InfoTip";
import BookingApprovals from "@/components/booking/BookingApprovals";
import BookingPhoneInput from "@/components/booking/BookingPhoneInput";
import BookingSchedulePicker from "@/components/booking/BookingSchedulePicker";
import BookingSubmitButton from "@/components/booking/BookingSubmitButton";
import StudioValueChips from "@/components/booking/StudioValueChips";
import BookingPaymentTrust from "@/components/booking/BookingPaymentTrust";
import BookRecordingVsProduction from "@/components/booking/BookRecordingVsProduction";
import BookUpsellSection from "@/components/booking/BookUpsellSection";
import SmartAddonDrawer from "@/components/booking/SmartAddonDrawer";
import WizardContextFaqSnapshot from "@/components/booking/WizardContextFaqSnapshot";
import BookingSelectableCard, {
  BookingSelectionConfirm,
  BookingStepGuide,
} from "@/components/booking/BookingSelectableCard";
import BookingStepPanel from "@/components/booking/BookingStepPanel";
import BookingWhatsAppPreview from "@/components/booking/BookingWhatsAppPreview";
import BookingWizardNav from "@/components/booking/BookingWizardNav";
import WizardStepCelebrate from "@/components/booking/WizardStepCelebrate";
import BookDraftRecoveryBanner from "@/components/booking/BookDraftRecoveryBanner";
import BookingFieldFeedback from "@/components/booking/BookingFieldFeedback";
import BookingSuccessPanel from "@/components/booking/BookingSuccessPanel";
import BookReplyStudio from "@/components/booking/BookReplyStudio";
import PriceWithVat from "@/components/booking/PriceWithVat";
import WizardCouponPriceLine from "@/components/booking/WizardCouponPriceLine";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useBookingWizard } from "@/hooks/useBookingWizard";
import {
  buildBookingWhatsAppBody,
  readUtmSource,
} from "@/lib/booking-messages";
import {
  FILTER_QUESTIONS,
  type FilterAnswers,
} from "@/lib/data/filter-questions";
import { sendBookingWaCta } from "@/lib/data/conversion-copy";
import {
  calcMobileStudioExVat,
  MOBILE_GEO_FEES,
  type MobileGeoId,
} from "@/lib/data/mobile-studio-booking";
import { getRecordingTypeFlow } from "@/lib/data/studio-recording-type-flow";
import { emotionalLabelToId } from "@/lib/yc-lead-tag";
import { formatNis, VAT_RATE, withVat } from "@/lib/data/pricing";
import {
  buildStudioGuidelinesLine,
  buildStudioScheduleDisplayLabel,
  type StudioCloserCroInput,
  type StudioLeadMessageContext,
} from "@/lib/studio-booking-message";
import {
  buildGroupFamilyPitchBlock,
  getGroupMessageContext,
  isGroupBookingLead,
  type GroupMessageInput,
} from "@/lib/studio-group-messaging";
import { getClientScenarioDescription, getClientScenarioShortTitle } from "@/lib/data/client-scenario-labels";
import {
  calcStudioScenarios,
  isGroupPricingEligible,
  parseParticipantsFromText,
  STUDIO_RECORDING_MAX,
  STUDIO_SAVINGS_TIP_THRESHOLD,
} from "@/lib/studio-participant-pricing";
import { useBookWizardStep } from "@/hooks/useBookWizardStep";
import { bookFieldClass, bookSectionClass } from "@/lib/book-form-ui";
import { FORM_MICROCOPY } from "@/lib/form-microcopy";
import {
  formatPhoneForDisplay,
  sanitizeLeadText,
  validateBookingLead,
  validateScheduleWindow,
} from "@/lib/form-validation";
import {
  buildStudioDeferredFields,
  isEventCelebrantRecordingType,
  parseStudioFormDraft,
  type StudioFormDraft,
  type WizardDepthId,
} from "@/lib/studio-form-draft";
import type { AudioDemoId } from "@/lib/data/audio-demos";
import {
  getCatalogAddonsForStudioPackage,
  resolveAddonLabel,
  resolveAddonPrice,
  sumAddonPrices,
} from "@/lib/pricing-addon-adapter";
import { getWizardFaqsForStudioPackage } from "@/lib/data/wizard-step-faqs";
import {
  CONSULTATION_PACKAGES,
  RECORDING_ATMOSPHERES,
  RECORDING_TYPES,
  STUDIO_RECORDING_PACKAGES,
  STUDIO_RECORDING_UPGRADES,
  STUDIO_SURPRISE_GIFT_NOTE,
  STUDIO_UPGRADES_BY_PATH,
  getStudioBookingPath,
  scheduleWindowSummaryLabel,
  type AtmosphereId,
  type ConsultationPackageId,
  type RecordingTypeId,
  type ScheduleWindowId,
  type StudioBookingPath,
  type StudioPackageId,
  type StudioUpgradeId,
} from "@/lib/data/studio-recording-booking";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { scrollAndHighlightFirstError } from "@/lib/scroll-to-error";
import type { ReplyContext } from "@/lib/reply-copy-builders";
import type { PriceItemId } from "@/lib/data/pricing-catalog";
import { useReportBookWizardLivePrice } from "@/components/booking/BookWizardLivePrice";
import WizardWhatsAppEscapeLink from "@/components/booking/WizardWhatsAppEscapeLink";
import WizardUrgencyHint from "@/components/booking/WizardUrgencyHint";
import { WizardCroShell } from "@/components/booking/cro/WizardCroShell";
import {
  StudioBusinessFields,
  StudioCostSplitBlock,
  StudioDecoyVipCard,
  StudioFitMeter,
  StudioLastMinuteBtsOffer,
  StudioParkingBanner,
  StudioPitchSafetyBadge,
  StudioProjectModeToggle,
  StudioSessionPriorityPills,
  StudioTravelModeToggle,
  StudioUpgradeQuickPills,
  StudioWelcomePerkPills,
  WizardInlinePriceBar,
  WizardStep3HoldTimer,
  WizardStepTransitionOverlay,
} from "@/components/booking/StudioWizardCroBlocks";
import { useStudioGhostLead } from "@/hooks/useStudioGhostLead";
import { useBookExitIntent } from "@/hooks/useBookExitIntent";
import { useWizardUserIdle } from "@/hooks/useWizardUserIdle";
import { useBookCoreContactBridge } from "@/hooks/useBookCoreContactBridge";
import { useWizardHistory } from "@/hooks/useWizardHistory";
import {
  BOOK_WIZARD_COPY,
  SESSION_PRIORITY_LABELS,
  TRAVEL_MODE_LABELS,
  WELCOME_PERK_LABELS,
} from "@/lib/data/book-wizard-copy";
import { STUDIO_CRO_CONFIG } from "@/lib/data/cro/studio";
import {
  readInitialPriceHoldBadge,
  saveStudioPriceHold,
} from "@/lib/book-wizard-urgency";
import { ensureHoldDeadline } from "@/lib/book-wizard-cro/urgency";
import { readBookCoreContact } from "@/lib/book-wizard-cro/shared-contact";
import { fireBookingConfetti } from "@/lib/book-wizard-confetti";
import { trackBookWizardFunnel } from "@/lib/analytics/book-wizard-funnel";
import { calcUpgradesTotalExVat } from "@/lib/studio-upgrade-pricing";
import { buildWizardEscapeHref } from "@/lib/book-wizard-cro/build-wizard-escape-href";
import { WizardPriceReframe } from "@/components/booking/cro/WizardCroExtras";
import PricingCatalogBanner from "@/components/pricing/PricingCatalogBanner";
import { scrollToBookWizardPanelAndFocusStep } from "@/lib/book-wizard-step-focus";
import { clearAllBookingDrafts } from "@/hooks/useBookingDraft";
import { cn } from "@/lib/utils";

const STEPS = ["איסוף נתונים", "התאמת פתרון", "יציאה לביצוע"] as const;

const STUDIO_PACKAGE_AUDIO_DEMO: Partial<Record<StudioPackageId, AudioDemoId>> = {
  remote: "podcast-zoom-cleanup",
  classic: "recording-vocal-polish",
  pro: "recording-vocal-polish",
  viral: "full-production",
  all_in: "full-production",
};

const ZEIGARNIK_PROGRESS = [35, 70, 100] as const;

const WIZARD_DEPTH_OPTIONS: readonly {
  id: WizardDepthId;
  label: string;
  detail: string;
}[] = [
  { id: "quick", label: "מהיר", detail: "רק החיוני - נשלים בוואטסאפ" },
  { id: "standard", label: "רגיל", detail: "מאוזן - ברירת מחדל" },
  { id: "full", label: "מלא", detail: "כל הפרטים מראש" },
];

const FAMILY_QUICK_PICKS: readonly {
  id: RecordingTypeId;
  label: string;
  emoji: string;
}[] = [
  { id: "event_song", label: "שיר הפתעה", emoji: "🎁" },
  { id: "bride_blessing", label: "ברכת כלה", emoji: "💍" },
  { id: "bar_mitzvah_speech", label: "בר/בת מצווה", emoji: "🎉" },
];

type FormState = StudioFormDraft;

function applyRecordingTypeToForm(
  prev: FormState,
  recordingType: RecordingTypeId,
): FormState {
  const flow = getRecordingTypeFlow(recordingType);
  return {
    ...prev,
    recordingType,
    packageId: flow.defaultPackageId ?? (prev.packageId || "classic"),
    location: flow.hideLocation ? "modiin" : prev.location,
    mobileGeo: flow.hideLocation ? "" : prev.mobileGeo,
  };
}

function clampCount(n: number): number {
  return Math.max(0, Math.min(30, n));
}

function resolveRecipientHint(childrenCount: number, recorderCount: number): string | null {
  if (childrenCount > 0) return "mom";
  if (recorderCount >= 2) return "group";
  return "booker";
}

function BookReassuranceLine({ wizardDepth }: { wizardDepth: WizardDepthId }) {
  return (
    <p className="text-center text-xs leading-relaxed text-muted-foreground">
      {wizardDepth === "quick"
        ? "אפשר לשלוח עכשיו ולסיים את הפרטים בוואטסאפ - בלי התחייבות"
        : "יקיר עונה בדרך כלל בערב - אפשר גם רק לשלוח ולהמשיך מכאן"}
    </p>
  );
}

function ParticipantCounter({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background px-3 py-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-lg font-semibold transition-[border-color,transform] duration-fast ease-luxury hover:border-[var(--service-accent,#d42b2b)]/40 active:scale-[0.97]"
          onClick={() => onChange(clampCount(value - 1))}
          aria-label={`הפחת ${label}`}
        >
          −
        </button>
        <span className="min-w-[2ch] text-center text-sm font-semibold tabular-nums">{value}</span>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-lg font-semibold transition-[border-color,transform] duration-fast ease-luxury hover:border-[var(--service-accent,#d42b2b)]/40 active:scale-[0.97]"
          onClick={() => onChange(clampCount(value + 1))}
          aria-label={`הוסף ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

function FilterContextBanner({ filterAnswers }: { filterAnswers?: FilterAnswers | null }) {
  if (!filterAnswers) return null;
  const timelineOpt = FILTER_QUESTIONS[0].options.find((o) => o.id === filterAnswers.timeline);
  const purposeOpt = FILTER_QUESTIONS[1].options.find((o) => o.id === filterAnswers.purpose);
  if (!timelineOpt && !purposeOpt) return null;
  return (
    <div className="mb-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-2xl border border-border/60 bg-surface px-5 py-2 text-xs text-muted-foreground sm:rounded-full">
      {timelineOpt && (
        <span className="flex items-center gap-1 font-medium text-foreground">
          <span aria-hidden="true">{timelineOpt.icon}</span>
          {timelineOpt.label}
        </span>
      )}
      {timelineOpt && purposeOpt && (
        <span aria-hidden="true" className="select-none">
          -
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
  initialEmotionalLabel,
  routeId = null,
  initialStudioPackageId = null,
  initialRecordingTypeId = null,
  pricingCatalogId = null,
}: {
  filterAnswers?: FilterAnswers | null;
  initialEmotionalLabel?: string | null;
  routeId?: string | null;
  initialStudioPackageId?: StudioPackageId | null;
  initialRecordingTypeId?: RecordingTypeId | null;
  pricingCatalogId?: PriceItemId | null;
}) {
  const initialGiftMode = filterAnswers?.purpose === "gift";

  const initialForm = useMemo<FormState>(
    () => ({
      wizardDepth: "standard",
      scenarioChoice: "",
      projectMode: "personal",
      companyName: "",
      needsInvoice: false,
      splitCostEnabled: false,
      splitCostCount: 4,
      recordingType: initialRecordingTypeId ?? "",
      songName: "",
      celebrantName: "",
      referrer: "",
      atmosphere: "",
      packageId: initialStudioPackageId ?? "",
      location: "modiin",
      mobileGeo: "",
      selectedUpgrades: [],
      surpriseGift: false,
      giftRecipientName: "",
      name: "",
      phone: "",
      scheduleWindow: "",
      date: "",
      time: "",
      notes: "",
      adultsCount: 0,
      childrenCount: 0,
      customerNeed: initialEmotionalLabel ?? "",
      sessionPriority: "",
      welcomePerk: "",
      travelMode: "",
      lastMinuteBtsDeal: false,
      termsAccepted: false,
      selectedUpsells: [],
    }),
    [initialEmotionalLabel, initialRecordingTypeId, initialStudioPackageId],
  );

  const giftPresetApplied = useRef(false);
  const coreContactMerged = useRef(false);
  const [step3Transition, setStep3Transition] = useState(false);
  const [exitIntentOpen, setExitIntentOpen] = useState(false);
  const [celebrateKey, setCelebrateKey] = useState(0);
  const [celebrateMeta, setCelebrateMeta] = useState<{ from: number; to: number } | null>(
    null,
  );
  const prevStepRef = useRef(0);
  const [step3HoldDeadline, setStep3HoldDeadline] = useState<number | null>(null);
  const [priceHoldLabel, setPriceHoldLabel] = useState<string | null>(() =>
    readInitialPriceHoldBadge("studio", BOOK_WIZARD_COPY.priceHoldBadge),
  );
  const [addonDrawerOpen, setAddonDrawerOpen] = useState(false);

  const {
    step,
    form,
    errors,
    setStep,
    patchForm,
    replaceForm,
    mergeErrors,
    toggleUpgrade,
    toggleUpsell,
    selectedUpgradeSet,
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
    storageKey: "studio-recording",
    formId: "studio_recording_booking",
    initialForm,
    parseDraft: (raw) => parseStudioFormDraft(raw, initialForm),
    persistStepInDraft: true,
    maxStep: STEPS.length - 1,
  });

  const { honeypot, setHoneypot, globalError } = guard;

  useBookWizardStep("studio", step);

  useEffect(() => {
    if (step > prevStepRef.current) {
      setCelebrateMeta({ from: prevStepRef.current, to: step });
      setCelebrateKey((k) => k + 1);
    }
    prevStepRef.current = step;
  }, [step]);

  useBookCoreContactBridge(form.name, form.phone);

  useWizardHistory({
    category: "studio",
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

  useEffect(() => {
    if (giftPresetApplied.current) return;
    if (draft.restored) {
      giftPresetApplied.current = true;
      return;
    }
    if (initialGiftMode) {
      patchForm({ surpriseGift: true });
    }
    giftPresetApplied.current = true;
  }, [draft.restored, initialGiftMode, patchForm]);

  useEffect(() => {
    if (initialStudioPackageId && !form.packageId) {
      patchForm({ packageId: initialStudioPackageId });
    }
    if (initialRecordingTypeId && !form.recordingType) {
      patchForm({ recordingType: initialRecordingTypeId });
    }
  }, [
    initialStudioPackageId,
    initialRecordingTypeId,
    form.packageId,
    form.recordingType,
    patchForm,
  ]);

  const isConsultation = form.recordingType === "song_promotion_consultation";
  const bookingPath: StudioBookingPath = getStudioBookingPath(form.recordingType);
  const showCelebrantField = isEventCelebrantRecordingType(form.recordingType);
  /** ברכת כלה = מקליטת אחת בלבד - counter מסיח ומבלבל */
  const showParticipantCounter = !isConsultation && form.recordingType !== "bride_blessing";
  const typeFlow = getRecordingTypeFlow(form.recordingType);
  const emotionalId = emotionalLabelToId(initialEmotionalLabel);
  const mobileExVat =
    form.location === "mobile" && form.mobileGeo
      ? calcMobileStudioExVat(form.mobileGeo)
      : 0;
  const consultationPackage = isConsultation
    ? CONSULTATION_PACKAGES.find((p) => p.id === form.packageId)
    : undefined;
  const selectedPackage = isConsultation
    ? undefined
    : STUDIO_RECORDING_PACKAGES.find((p) => p.id === form.packageId);
  const activePackage = consultationPackage ?? selectedPackage;
  const upgradesTotal = calcUpgradesTotalExVat(form.selectedUpgrades, {
    lastMinuteBtsDeal: form.lastMinuteBtsDeal,
  });
  const catalogUpsellTotal = sumAddonPrices(new Set(form.selectedUpsells ?? []));
  const baseSubtotal =
    (activePackage?.price ?? 0) + upgradesTotal + catalogUpsellTotal + mobileExVat;
  const isMotzash = form.scheduleWindow === "motzash";
  const parsedNotesParticipants = parseParticipantsFromText(form.notes);
  const adultsCount = form.adultsCount || parsedNotesParticipants.adultsCount || 0;
  const childrenCount = form.childrenCount || parsedNotesParticipants.childrenCount || 0;
  let recorderCount = adultsCount + childrenCount;
  if (recorderCount === 0 && parsedNotesParticipants.recorderCount) {
    recorderCount = parsedNotesParticipants.recorderCount;
  }
  const isAmbiguousGroup =
    recorderCount === 0 &&
    (parsedNotesParticipants.isAmbiguousGroup ||
      (form.adultsCount === 0 && form.childrenCount === 0 && parsedNotesParticipants.isAmbiguousGroup));

  const groupPricingEligible =
    !isConsultation &&
    isGroupPricingEligible({
      packageId: form.packageId || null,
      recordingType: form.recordingType,
      serviceId: "recording",
    });

  const classicFallbackPrice =
    STUDIO_RECORDING_PACKAGES.find((p) => p.id === "classic")?.price ?? 990;
  const estimateSubtotal =
    (activePackage?.price ?? classicFallbackPrice) + upgradesTotal + mobileExVat;

  const groupScenariosForDisplay =
    !isConsultation && recorderCount >= 2 && groupPricingEligible
      ? calcStudioScenarios({
          baseExVat: estimateSubtotal,
          recorderCount,
          isMotzash,
          vatRate: VAT_RATE,
          packageId: form.packageId || null,
          recordingType: form.recordingType,
          serviceId: "recording",
        })
      : null;

  const groupScenarios =
    !isConsultation && activePackage && recorderCount >= 2 && groupPricingEligible
      ? calcStudioScenarios({
          baseExVat: baseSubtotal,
          recorderCount,
          isMotzash,
          vatRate: VAT_RATE,
          packageId: form.packageId || null,
          recordingType: form.recordingType,
          serviceId: "recording",
        })
      : null;

  const resolvedGroupScenario =
    form.scenarioChoice === "pairs"
      ? "pairs"
      : (groupScenarios?.recommended?.id ?? "pairs");

  const isQuickWizard = form.wizardDepth === "quick";
  const isFullWizard = form.wizardDepth === "full";
  const deferredFields = buildStudioDeferredFields(
    form,
    form.wizardDepth,
    showCelebrantField,
  );

  const studioLeadContext: StudioLeadMessageContext | null = isConsultation
    ? null
    : {
        adultsCount,
        childrenCount,
        recorderCount,
        isAmbiguousGroup,
        baseExVat: activePackage?.price ?? 0,
        upgradesExVat: upgradesTotal,
        packageId: (form.packageId as StudioPackageId) || null,
        recordingType: form.recordingType,
        selectedUpgrades: form.selectedUpgrades,
        isMotzash,
        vatRate: VAT_RATE,
        recommendedScenario: resolvedGroupScenario,
      };

  const total =
    groupScenarios?.recommended?.subtotalExVat ??
    (isMotzash ? Math.round(baseSubtotal * 1.5) : baseSubtotal);

  const groupMessageInput: GroupMessageInput | null =
    studioLeadContext && recorderCount >= 2
      ? {
          leadName: sanitizeLeadText(form.name, 60) || undefined,
          adultsCount,
          childrenCount,
          recorderCount,
          customerNeed: sanitizeLeadText(form.customerNeed, 500) || undefined,
          leadNotes: sanitizeLeadText(form.notes, 500) || undefined,
          recordingType: form.recordingType,
          scheduleWindow: form.scheduleWindow || null,
          studioPackageId: (form.packageId as StudioPackageId) || null,
          packageName: activePackage?.name,
          baseExVat: activePackage?.price ?? 0,
          upgradesExVat: upgradesTotal + mobileExVat,
          isAmbiguousGroup,
          selectedUpgrades: form.selectedUpgrades,
          isMotzash,
          vatRate: VAT_RATE,
          hasMobile: form.location === "mobile",
          atmosphere: form.atmosphere || undefined,
          leadDate: form.date || undefined,
        }
      : null;

  const groupMsgCtx =
    groupMessageInput && isGroupBookingLead(groupMessageInput)
      ? getGroupMessageContext(groupMessageInput)
      : null;

  const copyGroupText = async (text: string, toastMsg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      window.alert(toastMsg);
    } catch {
      window.prompt("העתק את הטקסט:", text);
    }
  };

  const recordingLabel = RECORDING_TYPES.find((t) => t.id === form.recordingType)?.label ?? "";
  const atmosphereLabel = RECORDING_ATMOSPHERES.find((a) => a.id === form.atmosphere)?.title ?? "";

  const replyStudioContext: ReplyContext | null = isConsultation
    ? null
    : {
        leadName: sanitizeLeadText(form.name, 60) || undefined,
        recorderName: sanitizeLeadText(form.celebrantName, 60) || undefined,
        song: sanitizeLeadText(form.songName, 80) || undefined,
        occasion: recordingLabel || undefined,
        leadDate: form.date || undefined,
        leadTime: form.time || undefined,
        scheduleWindow: form.scheduleWindow || null,
        recorderCount: Math.max(recorderCount, childrenCount > 0 ? recorderCount || 1 : recorderCount || 1),
        childrenCount,
        adultsCount,
        intent: "continue_chat",
        recordingType: form.recordingType,
      };

  const showPreSubmitReplyStudio =
    !!replyStudioContext &&
    isFullWizard &&
    (routeId === "family-gifts" || childrenCount > 0);

  const pathUpgradeIds = bookingPath ? new Set<string>(STUDIO_UPGRADES_BY_PATH[bookingPath]) : null;
  const upgradeItems = STUDIO_RECORDING_UPGRADES
    .filter((u) => !pathUpgradeIds || pathUpgradeIds.has(u.id))
    .map((u) => ({
      id: u.id,
      name: u.name,
      description: u.description,
      price: u.price,
      badge: u.badge,
    }));

  const catalogAddonItems = useMemo(
    () =>
      isConsultation
        ? []
        : getCatalogAddonsForStudioPackage(form.packageId as StudioPackageId),
    [form.packageId, isConsultation],
  );
  const studioWizardFaqs = useMemo(
    () =>
      isConsultation
        ? []
        : getWizardFaqsForStudioPackage(form.packageId as StudioPackageId),
    [form.packageId, isConsultation],
  );

  const handleStudioPackageSelect = useCallback(
    (pkgId: StudioPackageId) => {
      patchForm({ packageId: pkgId, selectedUpsells: [] });
      const addons = getCatalogAddonsForStudioPackage(pkgId);
      if (addons.length > 0) setAddonDrawerOpen(true);
    },
    [patchForm],
  );

  const allInPrice = STUDIO_RECORDING_PACKAGES.find((p) => p.id === "all_in")?.price ?? 2380;
  const autoUpgradeThreshold = allInPrice * 0.85;
  const showAutoUpgrade =
    step === 1 &&
    form.packageId !== "all_in" &&
    !isConsultation &&
    baseSubtotal >= autoUpgradeThreshold;

  const canAdvanceStep0 =
    form.recordingType !== "" &&
    (isQuickWizard ||
      isConsultation ||
      typeFlow.hideAtmosphere ||
      form.atmosphere !== "");
  const canAdvanceStep1 = form.packageId !== "";
  const progressPct = ZEIGARNIK_PROGRESS[step] ?? ZEIGARNIK_PROGRESS[0];

  const handleScheduleWindowChange = (value: ScheduleWindowId) => {
    patchForm({ scheduleWindow: value, date: "", time: "" });
    mergeErrors((prev) => {
      const next = { ...prev };
      delete next.date;
      delete next.time;
      delete next.scheduleWindow;
      return next;
    });
  };

  const summaryLines = [
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
    ...(form.celebrantName && showCelebrantField
      ? [{ label: "שם החוגג/ת", value: sanitizeLeadText(form.celebrantName, 60) }]
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
    ...(form.scheduleWindow
      ? [
          {
            label: "מועד מועדף",
            value: scheduleWindowSummaryLabel(form.scheduleWindow),
          },
        ]
      : []),
    ...(form.date ? [{ label: "תאריך", value: form.date }] : []),
    ...(form.time ? [{ label: "שעה", value: form.time }] : []),
    ...(form.location === "mobile" && form.mobileGeo
      ? [
          {
            label: "מיקום",
            value: `אולפן נייד - ${MOBILE_GEO_FEES[form.mobileGeo].label} (+${calcMobileStudioExVat(form.mobileGeo).toLocaleString("he-IL")} ₪ לפני מע״מ)`,
          },
        ]
      : form.location === "mobile"
        ? [{ label: "מיקום", value: "אולפן נייד עד הבית" }]
        : typeFlow.hideLocation
          ? [{ label: "מיקום", value: "הקלטה מרחוק" }]
          : [{ label: "מיקום", value: "אולפן אקוסטי במודיעין" }]),
    ...form.selectedUpgrades.map((id) => {
      const u = STUDIO_RECORDING_UPGRADES.find((x) => x.id === id);
      return { label: "תוספת", value: u ? `${u.name} (+${u.price} ₪)` : id };
    }),
    ...(form.selectedUpsells ?? [])
      .filter((id) => resolveAddonPrice(id) > 0)
      .map((id) => ({
        label: "תוספת מחירון",
        value: `${resolveAddonLabel(id)} (+${resolveAddonPrice(id).toLocaleString("he-IL")} ₪)`,
      })),
    ...(form.projectMode === "business"
      ? [
          { label: "פרויקט", value: "עסקי" },
          ...(form.companyName
            ? [{ label: "חברה", value: sanitizeLeadText(form.companyName, 80) }]
            : []),
          ...(form.needsInvoice ? [{ label: "חשבונית", value: "כן" }] : []),
        ]
      : form.projectMode === "personal"
        ? [{ label: "פרויקט", value: "פרטי" }]
        : []),
    ...(form.splitCostEnabled
      ? [{ label: "חלוקת עלות", value: `${form.splitCostCount} משתתפים` }]
      : []),
    ...(adultsCount > 0 ? [{ label: "מבוגרים", value: String(adultsCount) }] : []),
    ...(childrenCount > 0 ? [{ label: "ילדים", value: String(childrenCount) }] : []),
    ...(recorderCount > 0 ? [{ label: "סה״כ מקליטים", value: String(recorderCount) }] : []),
    ...(form.notes || form.customerNeed
      ? [
          {
            label: "הערות",
            value: sanitizeLeadText(
              [form.customerNeed, form.notes].filter(Boolean).join(" - "),
              500,
            ),
          },
        ]
      : []),
    ...(form.sessionPriority && form.sessionPriority in SESSION_PRIORITY_LABELS
      ? [
          {
            label: "עדיפות בסשן",
            value: SESSION_PRIORITY_LABELS[form.sessionPriority],
          },
        ]
      : []),
    ...(form.welcomePerk && form.welcomePerk in WELCOME_PERK_LABELS
      ? [{ label: "צ'ופר הגעה", value: WELCOME_PERK_LABELS[form.welcomePerk] }]
      : []),
    ...(form.travelMode && form.travelMode in TRAVEL_MODE_LABELS
      ? [{ label: "הגעה", value: TRAVEL_MODE_LABELS[form.travelMode] }]
      : []),
    {
      label: "הנחיות",
      value: studioLeadContext
        ? buildStudioGuidelinesLine(studioLeadContext)
        : "חזרות בבית - שקט באולפן",
    },
  ];

  const livePriceReport =
    total <= 0 || step > 2
      ? null
      : {
          totalExVat: total,
          title: activePackage?.name ?? (recordingLabel || "הקלטה באולפן"),
          ctaLabel: sendBookingWaCta(withVat(total)),
        };
  useReportBookWizardLivePrice(livePriceReport);

  const escapeWaHref = buildWizardEscapeHref({
    category: "studio",
    serviceLabel: STUDIO_CRO_CONFIG.serviceLabel,
    formId: STUDIO_CRO_CONFIG.formId,
    summaryLines,
    priceExVat: total,
    packageLabel: activePackage?.name,
    contactName: form.name,
    contactPhone: form.phone,
    ycStep: step + 1,
  });

  const handleGhostLeadFired = () => {
    trackBookWizardFunnel("GhostLead_Fired", {
      category: "studio",
      package_id: form.packageId || "",
      step: 3,
    });
  };

  useStudioGhostLead({
    step,
    name: form.name,
    phone: form.phone,
    subject: "טיוטת הזמנת אולפן - שלב סגירה",
    body: summaryLines.map((l) => `${l.label}: ${l.value}`).join("\n"),
    onFired: handleGhostLeadFired,
  });

  const ycBookingMeta = {
    ycSchedule: form.scheduleWindow || null,
    ycPackage:
      !isConsultation && form.packageId ? (form.packageId as string) : null,
    ycStep: step === 0 ? 1 : step === 1 ? 2 : 3,
    ycForm: "studio_recording_booking",
    ycRoute: routeId,
    ycEmotional: emotionalId,
    ycRecordingType: form.recordingType || null,
    ycCelebrant:
      showCelebrantField && form.celebrantName.trim()
        ? sanitizeLeadText(form.celebrantName, 60)
        : null,
    ycMobileGeo: form.location === "mobile" && form.mobileGeo ? form.mobileGeo : null,
    ycAtmosphere: form.atmosphere || null,
    ycWizardDepth: form.wizardDepth,
    ycScenarioChosen: form.scenarioChoice === "pairs" ? true : null,
    ycScenarioHint: form.scenarioChoice === "unsure" ? ("unsure" as const) : null,
    ycDeferred: deferredFields,
    ycRecipientHint: resolveRecipientHint(childrenCount, recorderCount),
    ycSessionPriority: form.sessionPriority || null,
    ycWelcomePerk: form.welcomePerk || null,
    ycTravelMode: form.travelMode || null,
    ycSplitCount: form.splitCostEnabled ? form.splitCostCount : null,
    ycConfigVersion: 3,
  };

  const studioCroMeta: StudioCloserCroInput = {
    sessionPriority: form.sessionPriority,
    welcomePerk: form.welcomePerk,
    travelMode: form.travelMode,
    splitCostEnabled: form.splitCostEnabled,
    splitCostCount: form.splitCostCount,
    location: form.location,
    projectMode: form.projectMode,
    recorderCount: recorderCount > 0 ? recorderCount : undefined,
  };

  const scheduleDisplayLabel = buildStudioScheduleDisplayLabel({
    scheduleSummary: form.scheduleWindow
      ? scheduleWindowSummaryLabel(form.scheduleWindow)
      : undefined,
    date: form.date,
    time: form.time,
  });

  const previewBody =
    step === 2 && activePackage
      ? buildBookingWhatsAppBody({
          intent: "continue_chat",
          serviceLabel: isConsultation
            ? "ייעוץ לקידום שיר"
            : `הקלטה באולפן - ${activePackage.name}`,
          packageLabel: activePackage.name,
          summaryLines,
          contact: {
            name: sanitizeLeadText(form.name, 60) || "[שם]",
            phone: form.phone ? formatPhoneForDisplay(form.phone) : "[טלפון]",
          },
          priceExVat: total,
          totalEstimate: withVat(total),
          customerNeed:
            (form.sessionPriority && form.sessionPriority in SESSION_PRIORITY_LABELS
              ? SESSION_PRIORITY_LABELS[form.sessionPriority]
              : sanitizeLeadText(form.customerNeed, 500)) || null,
          utmSource: readUtmSource() ?? "/book#studio",
          bookCategory: "studio",
          includeTrustFooter: true,
          studioLead: studioLeadContext,
          studioCro: studioCroMeta,
          scheduleDisplayLabel,
          ...ycBookingMeta,
        })
      : undefined;

  const handleClearDraft = () => {
    clearAllBookingDrafts();
    resetWizard();
  };

  const goToStep = (n: number) => {
    if (n === 1 && step === 0) {
      trackBookWizardFunnel("Step1_Complete", {
        category: "studio",
        recording_type: form.recordingType || "",
      });
    }
    setStep(n);
    scrollToBookWizardPanelAndFocusStep(n);
  };

  const completeStep3Transition = useCallback(() => {
    setStep3Transition(false);
    setStep3HoldDeadline(ensureHoldDeadline("studio"));
    setStep(2);
    scrollToBookWizardPanelAndFocusStep(2);
  }, [setStep]);

  const beginStep3Transition = () => {
    if (!canAdvanceStep1) return;
    trackBookWizardFunnel("Step2_PackageSelected", {
      category: "studio",
      package_id: form.packageId || "",
      package_price: activePackage?.price ?? 0,
    });

    if (form.phone.trim()) {
      const phoneCheck = validateBookingLead({
        name: form.name,
        phone: form.phone,
        date: "",
        time: "",
        location: "",
        notes: "",
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

    setStep3Transition(true);
  };

  const handleLastMinuteBtsChange = (checked: boolean) => {
    if (checked) {
      const nextUpgrades: StudioUpgradeId[] = form.selectedUpgrades.includes("bts")
        ? form.selectedUpgrades
        : [...form.selectedUpgrades, "bts"];
      patchForm({ lastMinuteBtsDeal: true, selectedUpgrades: nextUpgrades });
      return;
    }
    patchForm({
      lastMinuteBtsDeal: false,
      selectedUpgrades: form.selectedUpgrades.filter((id) => id !== "bts"),
    });
  };

  const showLastMinuteBtsOffer =
    !isConsultation &&
    (form.lastMinuteBtsDeal || !form.selectedUpgrades.includes("bts"));

  const showStudioParking =
    !typeFlow.hideLocation && form.location === "modiin";

  const showCroOverlays = !isSubmitted && step < 2;

  const handleExitIntent = () => {
    if (activePackage && total > 0) {
      saveStudioPriceHold({
        packageLabel: activePackage.name,
        totalExVat: total,
      });
      setPriceHoldLabel(BOOK_WIZARD_COPY.priceHoldBadge);
    }
    setExitIntentOpen(true);
  };

  useBookExitIntent({
    enabled: showCroOverlays && !!activePackage && total > 0,
    onTrigger: handleExitIntent,
  });

  const { idle: wizardIdle, dismiss: dismissWizardIdle } = useWizardUserIdle({
    enabled: !isSubmitted && step <= 2,
  });

  const handleAction = (intent: "continue_chat" | "start_now") => {
    const fieldErrs = runSubmit(
      () =>
        validateBookingLead({
          name: form.name,
          phone: form.phone,
          date: form.date,
          time: form.time,
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

        const serviceLabel = isConsultation
          ? "ייעוץ לקידום שיר"
          : `הקלטה באולפן - ${activePackage?.name ?? recordingLabel}`;

        const body = buildBookingWhatsAppBody({
          intent,
          serviceLabel,
          packageLabel: activePackage?.name,
          summaryLines,
          contact: { name: sanitizeLeadText(form.name, 60), phone: displayPhone },
          priceExVat: total,
          totalEstimate: withVat(total),
          customerNeed:
            (form.sessionPriority && form.sessionPriority in SESSION_PRIORITY_LABELS
              ? SESSION_PRIORITY_LABELS[form.sessionPriority]
              : sanitizeLeadText(form.customerNeed, 500)) || null,
          utmSource: readUtmSource() ?? "/book#studio",
          bookCategory: "studio",
          includeTrustFooter: true,
          studioLead: studioLeadContext,
          studioCro: studioCroMeta,
          scheduleDisplayLabel,
          ...ycBookingMeta,
          ycIntent: intent,
        });

        const href = buildWhatsAppHref({
          text: body,
          utm_source: "website",
          utm_campaign: "studio_recording_booking",
        });

        return {
          waHref: href,
          intent,
          email: {
            formId: "studio_recording_booking",
            subject: "הזמנת הקלטה באולפן",
            body,
            name: form.name,
            phone: displayPhone,
            crossSell: {
              bookCategory: "studio" as const,
              routeId,
              recordingType: form.recordingType || null,
              atmosphere: form.atmosphere || null,
              mobileGeo:
                form.location === "mobile" && form.mobileGeo ? form.mobileGeo : null,
              largeGroup: form.location !== "mobile" && recorderCount >= 12,
            },
          },
        };
      },
      { leadCategory: "studio" },
    );

    if (fieldErrs && Object.keys(fieldErrs).length > 0) {
      scrollAndHighlightFirstError();
      return;
    }

    trackBookWizardFunnel("WhatsApp_Click", {
      category: "studio",
      package_id: form.packageId || "",
      total_ex_vat: total,
      last_minute_bts: form.lastMinuteBtsDeal,
    });
    void fireBookingConfetti();
  };

  const onSubmitClick = (intent: "continue_chat" | "start_now") => {
    const nextErrors: Record<string, string> = {};

    const scheduleResult = validateScheduleWindow({
      scheduleWindow: form.scheduleWindow,
      date: form.date,
      time: form.time,
    });
    if (!scheduleResult.ok) {
      Object.assign(nextErrors, scheduleResult.errors);
    }

    const leadResult = validateBookingLead({
      name: form.name,
      phone: form.phone,
      date: form.date,
      time: form.time,
      location: "",
      notes: form.notes,
      requireLocation: false,
      requireDate: false,
      requireTime: false,
    });
    if (!leadResult.ok && leadResult.errors) {
      Object.assign(nextErrors, leadResult.errors);
    }

    if (!form.termsAccepted) {
      nextErrors.terms = "יש לאשר את התנאים לפני שליחה";
    }

    if (Object.keys(nextErrors).length > 0) {
      mergeErrors(nextErrors);
      scrollAndHighlightFirstError();
      return;
    }

    if (
      showCelebrantField &&
      !form.celebrantName.trim() &&
      !isQuickWizard &&
      typeof window !== "undefined" &&
      !window.confirm("לא הזנת שם חוגג/ת (מי יקליט). להמשיך בכל זאת?")
    ) {
      return;
    }

    handleAction(intent);
  };

  const today = new Date().toISOString().split("T")[0];
  const stepAnnouncement = `שלב ${step + 1} מתוך ${STEPS.length}: ${STEPS[step]}`;

  if (isSubmitted && lastWaHref) {
    return (
      <BookingSuccessPanel
        intent={lastIntent}
        whatsappHref={lastWaHref}
        bookCategory="studio"
        routeId={routeId ?? (initialGiftMode ? "family-gifts" : null)}
        recordingType={form.recordingType || null}
        atmosphere={form.atmosphere || null}
        replyStudioContext={replyStudioContext ?? undefined}
        onNewBooking={resetWizard}
      />
    );
  }

  return (
    <div className={cn("min-w-0 max-w-full space-y-10", step === 2 && activePackage && "pb-24")}>
      {draft.restored && draft.savedAt ? (
        <BookDraftRecoveryBanner
          savedAt={draft.savedAt}
          onClear={handleClearDraft}
          onDismiss={dismissDraft}
        />
      ) : null}

      <FilterContextBanner filterAnswers={filterAnswers} />
      {pricingCatalogId ? <PricingCatalogBanner catalogId={pricingCatalogId} /> : null}

      <StudioProjectModeToggle
        value={form.projectMode}
        onChange={(mode) => patchForm({ projectMode: mode })}
      />

      <div
        className="h-1 w-full overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuenow={progressPct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-1 rounded-full bg-[var(--service-accent,#d42b2b)] transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {celebrateMeta ? (
        <WizardStepCelebrate
          key={celebrateKey}
          category="studio"
          fromStep={celebrateMeta.from}
          toStep={celebrateMeta.to}
        />
      ) : null}

      {showCroOverlays ? (
        <WizardUrgencyHint priceHoldLabel={priceHoldLabel} className="-mt-6" />
      ) : null}

      <p className="sr-only" aria-live="polite">
        {stepAnnouncement}
      </p>

      <BookingWizardNav steps={STEPS} currentStep={step} label="שלבי הזמנת הקלטה" />
      <BookReassuranceLine wizardDepth={form.wizardDepth} />

      {/* Step 0: recording type + atmosphere */}
      {step === 0 && (
        <BookingStepPanel stepKey={0} stepLabel={stepAnnouncement}>
          <section className={bookSectionClass} aria-labelledby="book-step-heading-0">
            <header className="space-y-4">
              <h2
                id="book-step-heading-0"
                tabIndex={-1}
                className="text-xl font-semibold text-foreground sm:text-2xl"
              >
                בחרו סוג הקלטה
              </h2>
              <StudioValueChips />
              <div>
                <p className="mb-2 text-xs font-semibold text-muted-foreground">
                  כמה זמן יש לכם עכשיו?
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {WIZARD_DEPTH_OPTIONS.map((opt) => {
                    const active = form.wizardDepth === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => patchForm({ wizardDepth: opt.id })}
                        className={cn(
                          "min-h-11 rounded-xl border px-3 py-3 text-start text-sm transition-[border-color,background-color,color,transform] duration-fast ease-luxury active:scale-[0.98]",
                          active
                            ? "border-[var(--service-accent,#d42b2b)] bg-[color-mix(in_srgb,var(--service-accent,#d42b2b)_10%,transparent)] text-[var(--service-accent,#d42b2b)]"
                            : "border-border/60 hover:border-[var(--service-accent,#d42b2b)]/40",
                        )}
                        aria-pressed={active}
                      >
                        <span className="block font-semibold">{opt.label}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {opt.detail}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <BookingStepGuide
                lines={
                  isQuickWizard
                    ? [
                        "בחרו סוג הקלטה - נשלים שיר, שעה ואווירה בוואטסאפ",
                        "מספר מקליטים עוזר להערכת מחיר",
                      ]
                    : [
                        "בחרו סוג הקלטה - אפשר לשנות בכל שלב",
                        "שם השיר עוזר לנו להתכונן מראש",
                        "האווירה קובעת את אופי ההפקה",
                      ]
                }
              />
            </header>

            {routeId === "family-gifts" ? (
              <div>
                <p className="mb-2 text-xs font-semibold text-muted-foreground">
                  מה מתכננים? (בחירה מהירה)
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {FAMILY_QUICK_PICKS.map((pick) => {
                    const active = form.recordingType === pick.id;
                    return (
                      <button
                        key={pick.id}
                        type="button"
                        onClick={() => replaceForm(applyRecordingTypeToForm(form, pick.id))}
                        className={cn(
                          "min-h-11 rounded-xl border px-3 py-3 text-center text-sm font-semibold transition-[border-color,background-color,color,transform] duration-fast ease-luxury active:scale-[0.98]",
                          active
                            ? "border-[var(--service-accent,#d42b2b)] bg-[color-mix(in_srgb,var(--service-accent,#d42b2b)_10%,transparent)] text-[var(--service-accent,#d42b2b)]"
                            : "border-border/60 hover:border-[var(--service-accent,#d42b2b)]/40",
                        )}
                        aria-pressed={active}
                      >
                        <span className="block text-lg" aria-hidden="true">
                          {pick.emoji}
                        </span>
                        {pick.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {typeFlow.remoteHint ? (
              <p className="rounded-xl border border-[var(--service-accent,#d42b2b)]/20 bg-[color-mix(in_srgb,var(--service-accent,#d42b2b)_5%,transparent)] px-4 py-3 text-sm text-foreground">
                {typeFlow.remoteHint}
              </p>
            ) : null}

            <div>
              <p className="mb-2 text-xs font-semibold text-muted-foreground">סוג הקלטה</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {RECORDING_TYPES.map((type) => {
                  const active = form.recordingType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() =>
                        replaceForm(applyRecordingTypeToForm(form, type.id))
                      }
                      className={cn(
                        "relative min-h-11 min-w-0 break-words rounded-xl border px-3 py-3 text-center text-sm font-semibold leading-snug transition-[border-color,background-color,color,transform] duration-fast ease-luxury active:scale-[0.98]",
                        active
                          ? "border-[var(--service-accent,#d42b2b)] bg-[color-mix(in_srgb,var(--service-accent,#d42b2b)_10%,transparent)] pe-8 text-[var(--service-accent,#d42b2b)]"
                          : "border-border/60 bg-background text-foreground hover:border-[var(--service-accent,#d42b2b)]/40",
                      )}
                      aria-pressed={active}
                    >
                      {active ? (
                        <span
                          className="absolute end-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--service-accent,#d42b2b)] text-[0.55rem] font-bold text-white"
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                      ) : null}
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {form.recordingType ? (
              <BookingSelectionConfirm
                title={`נבחר: ${recordingLabel}`}
                detail="המשיכו למילוי פרטים או בחרו סוג אחר"
              />
            ) : null}

            {form.recordingType && !isConsultation ? (
              <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 px-4 py-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">עובדה מול סיפור</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      הסיפור בראש אומר שחייבים לדעת לשיר. המציאות היא שהתוכנות שלנו מסדרות כל זיוף. התפקיד שלכם הוא להביא מצב רוח טוב. השאר זה פיזיקה ומחשבים.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="song-name" className="mb-1.5 block text-xs font-semibold">
                  שם השיר
                </label>
                <input
                  id="song-name"
                  type="text"
                  value={form.songName}
                  onChange={(e) => patchForm({ songName: e.target.value })}
                  placeholder='לדוגמה: "אין כאן מקרה"'
                  className={bookFieldClass}
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
                  onChange={(e) => patchForm({ referrer: e.target.value })}
                  placeholder="שם מי שהמליץ עליכם"
                  autoComplete="off"
                  className={bookFieldClass}
                />
              </div>
            </div>

            {showCelebrantField ? (
              <div>
                <label htmlFor="celebrant-name" className="mb-1.5 block text-xs font-semibold">
                  שם החוגג/ת - מי יקליט ויקבל הנחיות
                </label>
                <input
                  id="celebrant-name"
                  type="text"
                  value={form.celebrantName}
                  onChange={(e) => patchForm({ celebrantName: e.target.value })}
                  placeholder="למשל: יונתן / מיה / דודי"
                  autoComplete="off"
                  className={bookFieldClass}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  השם יופיע בהקדשות פלייבק ובהודעות להורים
                </p>
              </div>
            ) : null}

            {showParticipantCounter && (
              <div className="space-y-3">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-base font-semibold text-foreground">
                      כמה מקליטים צפויים?
                    </h3>
                    <InfoTip text="מעל 2 מקליטים עוברים למחירון קבוצתי -- כל זוג מקליט בנפרד, מחיר לאדם יורד. נחשב ביחד בוואטסאפ." />
                  </div>
                  <p className="mb-3 text-xs text-muted-foreground">
                    מבוגר וילד -- אותו מחיר. עוזר לנו להכין הצעה מדויקת
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <ParticipantCounter
                    label="מבוגרים"
                    value={form.adultsCount}
                    onChange={(n) => patchForm({ adultsCount: n })}
                  />
                  <ParticipantCounter
                    label="ילדים"
                    value={form.childrenCount}
                    onChange={(n) => patchForm({ childrenCount: n })}
                  />
                </div>
                {form.adultsCount + form.childrenCount > 1 &&
                groupPricingEligible &&
                groupScenariosForDisplay?.recommended ? (
                  <div className="rounded-xl border border-[var(--service-accent,#d42b2b)]/20 bg-[color-mix(in_srgb,var(--service-accent,#d42b2b)_5%,transparent)] px-4 py-3 text-sm">
                    <p className="font-semibold text-foreground">
                      הערכת מחיר מומלצת לקבוצה (סופי יתואם בשיחה)*
                    </p>
                    <p className="mt-1 text-foreground">
                      {getClientScenarioShortTitle("pairs")}:{" "}
                      {formatNis(groupScenariosForDisplay.recommended.subtotalExVat)} לפני מע״מ -{" "}
                      {formatNis(groupScenariosForDisplay.recommended.withVat)} סופי
                    </p>
                    {isMotzash ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        כולל +50% פתיחת מוצ״ש
                      </p>
                    ) : null}
                    {form.adultsCount + form.childrenCount > STUDIO_SAVINGS_TIP_THRESHOLD ? (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {getClientScenarioDescription("save5")}
                      </p>
                    ) : null}
                  </div>
                ) : null}
                {form.adultsCount + form.childrenCount > STUDIO_RECORDING_MAX ? (
                  <p className="text-xs font-medium text-amber-800">
                    מעל {STUDIO_RECORDING_MAX} מקליטים - נתאם חלוקה לזוגות בשקט באולפן
                  </p>
                ) : null}
              </div>
            )}

            {!isConsultation && !typeFlow.hideAtmosphere && (
              <div>
                <h3 className="mb-2 text-base font-semibold text-foreground">
                  בחרו את האווירה שלכם
                </h3>
                <BookingStepGuide
                  lines={[
                    "האווירה משפיעה על כל ההפקה",
                    "אפשר לשנות עד שלב האישור",
                    "בחרו את הרגש שמתאים לכם",
                  ]}
                />
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {RECORDING_ATMOSPHERES.map((item) => {
                    const active = form.atmosphere === item.id;
                    return (
                      <BookingSelectableCard
                        key={item.id}
                        active={active}
                        onClick={() => patchForm({ atmosphere: item.id })}
                        title={item.title}
                        highlights={[item.subtitle]}
                        emoji={item.emoji}
                        compact
                        className={active ? "ring-2 ring-[var(--service-accent,#d42b2b)]/20" : undefined}
                      />
                    );
                  })}
                </div>
                {form.atmosphere ? (
                  <BookingSelectionConfirm
                    className="mt-4"
                    title={`אווירה: ${atmosphereLabel}`}
                    detail="נשמור את הבחירה לסיכום ולוואטסאפ"
                  />
                ) : null}
              </div>
            )}

            {form.projectMode === "business" ? (
              <StudioBusinessFields
                companyName={form.companyName}
                needsInvoice={form.needsInvoice}
                onCompanyNameChange={(v) => patchForm({ companyName: v })}
                onNeedsInvoiceChange={(v) => patchForm({ needsInvoice: v })}
              />
            ) : null}

            {form.projectMode !== "business" ? (
            <div
              className={cn(
                "rounded-xl border border-dashed p-4 transition-colors",
                form.surpriseGift
                  ? "border-amber-400 bg-amber-50"
                  : "border-[var(--service-accent,#d42b2b)]/30 bg-[color-mix(in_srgb,var(--service-accent,#d42b2b)_5%,transparent)]",
              )}
            >
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.surpriseGift}
                  onChange={(e) =>
                    patchForm({ surpriseGift: e.target.checked })
                  }
                  className={cn(
                    "mt-1 h-4 w-4",
                    form.surpriseGift ? "accent-amber-600" : "accent-[var(--service-accent,#d42b2b)]",
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
                      patchForm({ giftRecipientName: e.target.value })
                    }
                    placeholder="לדוגמה: נועה"
                    className={cn(
                      bookFieldClass,
                      "border-amber-300 focus:border-amber-500 focus:ring-amber-200/50",
                    )}
                  />
                </div>
              )}
            </div>
            ) : null}

            <WizardInlinePriceBar
              title={activePackage?.name ?? (recordingLabel || "הערכת מחיר")}
              totalExVat={total}
            />

            <StepNav
              onNext={() => goToStep(1)}
              nextDisabled={!canAdvanceStep0}
              nextLabel={BOOK_WIZARD_COPY.nextStep}
              showBack={false}
            />
            <WizardWhatsAppEscapeLink href={escapeWaHref} />
          </section>
        </BookingStepPanel>
      )}

      {/* Step 1: package selection */}
      {step === 1 && (
        <BookingStepPanel stepKey={1} stepLabel={stepAnnouncement}>
          <section className={bookSectionClass} aria-labelledby="book-step-heading-1">
            <header>
              <h2
                id="book-step-heading-1"
                tabIndex={-1}
                className="text-xl font-semibold text-foreground sm:text-2xl"
              >
                {isConsultation ? "בחרו סוג ייעוץ" : "בחרו את המסלול שלכם"}
              </h2>
              <BookingStepGuide
                lines={
                  isConsultation
                    ? [
                        "בחרו טלפוני או פרונטלי לפי הנוחות שלכם",
                        "המחיר כולל ייעוץ מקצועי מלא",
                        "אפשר לשנות מסלול לפני השליחה",
                      ]
                    : [
                        "כל מסלול כולל מיקס, מאסטרינג ותיקון זיופים",
                        "המחיר הוא על התוצאה הסופית - לא על זמן באולפן",
                        "תוספות אופציונליות מופיעות מתחת לבחירה",
                      ]
                }
              />
            </header>

            <div className="grid gap-4 lg:grid-cols-2">
              {(isConsultation ? CONSULTATION_PACKAGES : STUDIO_RECORDING_PACKAGES).map((pkg) => {
                const active = form.packageId === pkg.id;
                return (
                  <BookingSelectableCard
                    key={pkg.id}
                    active={active}
                    onClick={() =>
                      isConsultation
                        ? patchForm({ packageId: pkg.id })
                        : handleStudioPackageSelect(pkg.id as StudioPackageId)
                    }
                    audioDemoId={
                      !isConsultation
                        ? STUDIO_PACKAGE_AUDIO_DEMO[pkg.id as StudioPackageId]
                        : undefined
                    }
                    title={pkg.name}
                    highlights={pkg.highlights}
                    emoji={pkg.emoji}
                    badge={pkg.badge}
                    featured={"featured" in pkg ? pkg.featured : undefined}
                    featuredLabel="הכי מומלץ - שגר ושכח"
                    savings={"savings" in pkg ? pkg.savings : undefined}
                    footer={
                      <div className="flex items-center justify-between">
                        <PriceWithVat amountExVat={pkg.price} size="md" />
                        {!isConsultation && (
                          <span title="ככה ישמע הקובץ שתקבלו לטלפון" className="cursor-help">
                            <Headphones className="size-4 text-muted-foreground" aria-hidden="true" />
                          </span>
                        )}
                      </div>
                    }
                  />
                );
              })}
              {!isConsultation ? <StudioDecoyVipCard waHref={escapeWaHref} /> : null}
            </div>

            {!isConsultation && form.packageId ? (
              <WizardContextFaqSnapshot items={studioWizardFaqs} className="mt-4" />
            ) : null}

            {activePackage ? (
              <BookingSelectionConfirm
                title={`מסלול נבחר: ${activePackage.name}`}
                detail={`${activePackage.price.toLocaleString("he-IL")} ₪ לפני מע״מ - לחצו המשך לפרטים ואישור`}
              />
            ) : (
              <p className="rounded-xl border border-dashed border-border/60 bg-surface px-4 py-3 text-center text-sm text-muted-foreground">
                בחרו מסלול אחד כדי להמשיך
              </p>
            )}

            <StudioFitMeter form={form} />

            {!isConsultation && (
              <StudioUpgradeQuickPills
                allowedIds={pathUpgradeIds}
                selected={selectedUpgradeSet}
                onToggle={toggleUpgrade}
              />
            )}

            {!isConsultation && (
              <>
                {!isQuickWizard ? <BookRecordingVsProduction /> : null}
                {!isQuickWizard ? (
                  <BookUpsellSection
                    items={upgradeItems}
                    selected={selectedUpgradeSet}
                    onToggle={toggleUpgrade}
                  />
                ) : (
                  <p className="text-xs text-muted-foreground">
                    תוספות אופציונליות - נציע בוואטסאפ לפי הצורך
                  </p>
                )}
              </>
            )}

            {bookingPath === "events" && !isConsultation ? (
              <div className="rounded-xl border border-border/60 bg-surface px-4 py-4">
                <p className="text-sm font-semibold text-foreground">
                  🎊 סוגרים אירוע? תוסיפו אטרקציה לרחבה
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  עשן כבד לחופה וסלואו · זיקוקים קרים · בועות סבון עשן לילדים - מ-₪1,750
                </p>
                <a
                  href="/events/attractions"
                  className="mt-2 inline-block text-xs font-semibold text-[var(--service-accent,#d42b2b)] hover:underline"
                >
                  לקטלוג האטרקציות ←
                </a>
              </div>
            ) : null}

            {!isConsultation && baseSubtotal > 0 ? (
              <StudioCostSplitBlock
                enabled={form.splitCostEnabled}
                count={form.splitCostCount}
                totalExVat={baseSubtotal}
                onEnabledChange={(v) => patchForm({ splitCostEnabled: v })}
                onCountChange={(n) => patchForm({ splitCostCount: n })}
              />
            ) : null}

            {showAutoUpgrade ? (
              <div className="rounded-xl border border-[var(--service-accent,#d42b2b)] bg-[color-mix(in_srgb,var(--service-accent,#d42b2b)_8%,transparent)] px-4 py-4 space-y-2">
                <div className="flex items-start gap-2">
                  <TrendingUp className="mt-0.5 size-4 shrink-0 text-[var(--service-accent,#d42b2b)]" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      המתמטיקה מראה שחבילת הפרימיום כבר יותר משתלמת עבורך.
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      לוגית שווה לך לשדרג ולקבל הכל כלול.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => patchForm({ packageId: "all_in" })}
                  className="min-h-11 rounded-lg bg-[var(--service-accent,#d42b2b)] px-4 py-2 text-sm font-semibold text-white transition-opacity duration-fast ease-luxury hover:opacity-90"
                >
                  שדרג לחבילה המלאה ({allInPrice.toLocaleString("he-IL")} ₪ לפני מע״מ)
                </button>
              </div>
            ) : null}

            <WizardInlinePriceBar
              title={activePackage?.name ?? "הערכת מחיר"}
              totalExVat={total}
            />

            <StepNav
              onBack={() => goToStep(0)}
              onNext={beginStep3Transition}
              nextDisabled={!canAdvanceStep1}
              nextLabel={BOOK_WIZARD_COPY.nextStep}
            />
            <WizardWhatsAppEscapeLink href={escapeWaHref} />
          </section>
        </BookingStepPanel>
      )}

      {/* Step 2: summary + contact form (closing) */}
      {step === 2 && (
        <BookingStepPanel stepKey={2} stepLabel={stepAnnouncement}>
          <section className={cn("mx-auto max-w-lg", bookSectionClass)}>
            {step3HoldDeadline ? (
              <WizardStep3HoldTimer deadlineMs={step3HoldDeadline} />
            ) : null}
            <div className="rounded-2xl bg-surface p-5">
              <h2
                id="book-step-heading-2"
                tabIndex={-1}
                className="mb-4 text-center text-base font-semibold text-foreground"
              >
                {BOOK_WIZARD_COPY.step3Closer}
              </h2>
              <p className="mb-3 text-xs font-semibold text-muted-foreground">
                {BOOK_WIZARD_COPY.step3SummaryHeading}
              </p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {recordingLabel && (
                  <li>
                    <span className="font-medium text-foreground">סוג: </span>
                    {recordingLabel}
                  </li>
                )}
                {activePackage && (
                  <li>
                    <span className="font-medium text-foreground">מסלול: </span>
                    {activePackage.name}
                  </li>
                )}
                {form.scheduleWindow && (
                  <li>
                    <span className="font-medium text-foreground">מועד: </span>
                    {scheduleWindowSummaryLabel(form.scheduleWindow)}
                  </li>
                )}
              </ul>
              <div className="mt-4 border-t border-border pt-3 space-y-2">
                <WizardCouponPriceLine totalExVat={total} size="lg" />
                {STUDIO_CRO_CONFIG.priceReframe ? (
                  <WizardPriceReframe text={STUDIO_CRO_CONFIG.priceReframe} />
                ) : null}
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <h3 className="text-base font-semibold text-foreground">
                {BOOK_WIZARD_COPY.step3ContactHeading}
              </h3>
              <div className="relative space-y-4">
                <HoneypotField value={honeypot} onChange={setHoneypot} />
                <LeadFormAlert message={globalError} />

                <div>
                  <label htmlFor="sr-name" className="mb-1.5 block text-xs font-semibold">
                    {FORM_MICROCOPY.nameLabel} *
                  </label>
                  <input
                    id="sr-name"
                    type="text"
                    autoComplete="name"
                    placeholder={FORM_MICROCOPY.namePlaceholder}
                    value={form.name}
                    onChange={(e) => patchForm({ name: e.target.value })}
                    onBlur={() => {
                      const val = form.name.trim();
                      if (val.length > 0 && val.length < 2) {
                        mergeErrors({ name: "שם חייב להכיל לפחות 2 תווים" });
                      } else if (val.length >= 2 && errors.name) {
                        mergeErrors((prev) => {
                          const n = { ...prev };
                          delete n.name;
                          return n;
                        });
                      }
                    }}
                    className={cn(bookFieldClass, errors.name && "border-red-400")}
                  />
                  {errors.name ? (
                    <p className="mt-1 text-xs text-red-500" data-field-error="">
                      {errors.name}
                    </p>
                  ) : (
                    <BookingFieldFeedback
                      valid={form.name.trim().length >= 2}
                      hint="שם מעולה"
                    />
                  )}
                </div>

                <BookingPhoneInput
                  id="sr-phone"
                  value={form.phone}
                  required
                  error={errors.phone}
                  onChange={(value) => patchForm({ phone: value })}
                  onBlurValidate={(msg) => {
                    mergeErrors((prev) => {
                      const next = { ...prev };
                      if (msg) next.phone = msg;
                      else delete next.phone;
                      return next;
                    });
                  }}
                />

                <BookingSchedulePicker
                  scheduleWindow={form.scheduleWindow}
                  onScheduleWindowChange={handleScheduleWindowChange}
                  date={form.date}
                  time={form.time}
                  onDateChange={(value) => patchForm({ date: value })}
                  onTimeChange={(value) => patchForm({ time: value })}
                  minDate={today}
                  windowsOnly={isQuickWizard}
                  errors={{
                    scheduleWindow: errors.scheduleWindow,
                    date: errors.date,
                    time: errors.time,
                  }}
                />

                <StudioSessionPriorityPills
                  value={form.sessionPriority}
                  onChange={(id) => patchForm({ sessionPriority: id })}
                />

                {form.sessionPriority === "vocal_fix" ? <StudioPitchSafetyBadge /> : null}

                <StudioWelcomePerkPills
                  value={form.welcomePerk}
                  onChange={(id) => patchForm({ welcomePerk: id })}
                />

                {showStudioParking ? (
                  <>
                    <StudioTravelModeToggle
                      value={form.travelMode}
                      onChange={(id) => patchForm({ travelMode: id })}
                    />
                    {form.travelMode === "car" ? <StudioParkingBanner /> : null}
                  </>
                ) : null}

                {!typeFlow.hideLocation ? (
                  <details className="rounded-xl border border-border/60 bg-surface px-4 py-3">
                    <summary className="cursor-pointer text-xs font-semibold text-foreground">
                      איפה נקליט? (ברירת מחדל: אולפן במודיעין)
                    </summary>
                    <div className="mt-3 space-y-3">
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {(
                          [
                            { id: "modiin" as const, label: "אולפן אקוסטי במודיעין", sub: "חנייה חופשית" },
                            { id: "mobile" as const, label: "אולפן נייד", sub: "מגיעים עד אליכם" },
                          ] as const
                        ).map((loc) => (
                          <button
                            key={loc.id}
                            type="button"
                            onClick={() =>
                              patchForm({
                                location: loc.id,
                                mobileGeo: loc.id === "mobile" ? form.mobileGeo || "center" : "",
                                travelMode: loc.id === "mobile" ? "" : form.travelMode,
                              })
                            }
                            className={cn(
                              "min-h-11 rounded-2xl border px-4 py-3 text-start text-sm transition-[border-color,background-color,color,transform] duration-fast ease-luxury active:scale-[0.98]",
                              form.location === loc.id
                                ? "border-[var(--service-accent,#d42b2b)] bg-[color-mix(in_srgb,var(--service-accent,#d42b2b)_5%,transparent)] text-[var(--service-accent,#d42b2b)]"
                                : "border-border/60 hover:border-[var(--service-accent,#d42b2b)]/30",
                            )}
                            aria-pressed={form.location === loc.id}
                          >
                            <span className="font-semibold">{loc.label}</span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">{loc.sub}</span>
                          </button>
                        ))}
                      </div>
                      {form.location === "mobile" ? (
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
                                  "min-h-11 rounded-xl border px-3 py-2 text-start text-xs",
                                  active
                                    ? "border-[var(--service-accent,#d42b2b)] bg-[color-mix(in_srgb,var(--service-accent,#d42b2b)_5%,transparent)] text-[var(--service-accent,#d42b2b)]"
                                    : "border-border/60",
                                )}
                                aria-pressed={active}
                              >
                                <span className="font-semibold">{geo.label}</span>
                                <span className="mt-0.5 block text-muted-foreground">
                                  {price.toLocaleString("he-IL")} ₪ - {geo.detail}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  </details>
                ) : null}

                <div>
                  <label htmlFor="sr-notes" className="mb-1.5 block text-xs font-semibold">
                    {BOOK_WIZARD_COPY.notesOptional}
                  </label>
                  <textarea
                    id="sr-notes"
                    rows={2}
                    autoComplete="off"
                    value={form.notes}
                    onChange={(e) => patchForm({ notes: e.target.value })}
                    className={cn(bookFieldClass, "resize-none")}
                  />
                </div>
              </div>

              {previewBody ? (
                <BookingWhatsAppPreview messageBody={previewBody} />
              ) : null}

              {showPreSubmitReplyStudio ? (
                <BookReplyStudio
                  context={replyStudioContext!}
                  onCopy={() => window.alert("הועתק ללוח - אפשר להדביק בוואטסאפ")}
                />
              ) : null}

              {groupMsgCtx && groupMessageInput ? (
                <div className="rounded-xl border border-[var(--service-accent,#d42b2b)]/20 bg-[color-mix(in_srgb,var(--service-accent,#d42b2b)_5%,transparent)] p-4 space-y-3">
                  <p className="text-sm font-semibold text-foreground">
                    קבוצה של {recorderCount}
                    {groupMsgCtx.useDualTier
                      ? ` - תקרת זוגות ~${groupMsgCtx.pricePerPersonPairs} ₪ לאדם | המלצתנו ~${groupMsgCtx.pricePerPersonSave5} ₪ לאדם`
                      : ` - ~${groupMsgCtx.pricePerPersonPairs} ₪ לאדם (כולל מע״מ)`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    מקדמה לשריון: {groupMsgCtx.depositTotal} ₪ ({groupMsgCtx.depositPerPerson} ₪ לאדם)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="min-h-11 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium transition-[border-color,transform] duration-fast ease-luxury hover:border-[var(--service-accent,#d42b2b)]/40 active:scale-[0.98]"
                      onClick={() =>
                        void copyGroupText(
                          buildGroupFamilyPitchBlock(groupMessageInput, groupMsgCtx),
                          "הטקסט לקבוצה המשפחתית הועתק - שלחו בוואטסאפ המשפחתי",
                        )
                      }
                    >
                      💡 העתק פיץ&apos; לקבוצה (מחירון)
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="rounded-xl bg-surface px-4 py-3 text-center">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  המציאות דינמית. אם אחרי השליחה תצטרכו לשנות שעה או להוריד תוספת הכל בסדר. הכל גמיש ואפשר לשנות הכל בשיחת הוואטסאפ שלנו. אין קנסות ואין אותיות קטנות.
                </p>
              </div>

              <BookingApprovals
                variant="light"
                termsAccepted={form.termsAccepted}
                onTermsChange={(accepted) => {
                  patchForm({ termsAccepted: accepted });
                  if (accepted && errors.terms) {
                    mergeErrors((prev) => {
                      const next = { ...prev };
                      delete next.terms;
                      return next;
                    });
                  }
                }}
                termsError={errors.terms}
              />

              {showLastMinuteBtsOffer ? (
                <StudioLastMinuteBtsOffer
                  checked={form.lastMinuteBtsDeal}
                  onChange={handleLastMinuteBtsChange}
                />
              ) : null}

              <BookingSubmitButton
                onClick={() => onSubmitClick("continue_chat")}
              >
                {sendBookingWaCta(withVat(total))}
              </BookingSubmitButton>

              <BookingPaymentTrust />

              <button
                type="button"
                onClick={() => goToStep(1)}
                className="w-full text-center text-xs text-muted-foreground transition-colors duration-fast ease-luxury hover:text-[var(--service-accent,#d42b2b)]"
              >
                חזרה לבחירת מסלול
              </button>
            </div>
          </section>
        </BookingStepPanel>
      )}

      {/* Sticky price bar - step 2 only */}
      {step === 2 && activePackage && (
        <div className="fixed inset-x-0 bottom-0 z-30 overflow-x-clip border-t border-border bg-surface/95 backdrop-blur-sm sm:hidden">
          <div className="mx-auto flex min-w-0 max-w-4xl items-center justify-between gap-4 px-4 py-3">
            <div>
              <p className="text-xs text-muted-foreground">{activePackage.name}</p>
              <p className="text-base font-bold tabular-nums text-[var(--service-accent,#d42b2b)]">
                {withVat(total).toLocaleString("he-IL")} ₪ סופי
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSubmitClick("continue_chat")}
              className="shrink-0 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white"
            >
              וואטסאפ
            </button>
          </div>
        </div>
      )}
      <SmartAddonDrawer
        open={addonDrawerOpen && Boolean(activePackage) && !isConsultation}
        packageLabel={activePackage?.name ?? "מסלול"}
        basePriceExVat={(activePackage?.price ?? 0) + upgradesTotal + mobileExVat}
        items={catalogAddonItems}
        selected={selectedUpsellSet}
        onToggle={toggleUpsell}
        onClose={() => setAddonDrawerOpen(false)}
        onContinue={() => setAddonDrawerOpen(false)}
      />
      <WizardStepTransitionOverlay
        active={step3Transition}
        layout="summary"
        onComplete={completeStep3Transition}
        onAbort={() => setStep3Transition(false)}
      />
      <WizardCroShell
        config={STUDIO_CRO_CONFIG}
        exitIntentOpen={exitIntentOpen}
        packageLabel={activePackage?.name ?? "הקלטה באולפן"}
        totalExVat={total}
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
          className="min-h-11 rounded-2xl border border-border/60 px-5 py-2.5 text-sm font-semibold text-foreground transition-[border-color,transform] duration-fast ease-luxury hover:border-[var(--service-accent,#d42b2b)]/40 active:scale-[0.98]"
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
          "min-h-11 rounded-xl px-6 py-2.5 text-sm font-semibold transition-[opacity,transform] duration-fast ease-luxury active:scale-[0.98]",
          nextDisabled
            ? "cursor-not-allowed bg-border text-muted-foreground"
            : "bg-[var(--service-accent,#d42b2b)] text-white hover:opacity-90",
        )}
      >
        {nextLabel}
      </button>
    </div>
  );
}
