"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BookingApprovals from "@/components/booking/BookingApprovals";
import VenueApprovalShield from "@/components/confetti/VenueApprovalShield";
import ConfettiMomentSelector from "@/components/booking/ConfettiMomentSelector";
import { useReportBookWizardLivePrice } from "@/components/booking/BookWizardLivePrice";
import BookingSummaryActions from "@/components/booking/BookingSummaryActions";
import BookTrustBadges from "@/components/booking/BookTrustBadges";
import BookUpsellSection from "@/components/booking/BookUpsellSection";
import SmartAddonDrawer from "@/components/booking/SmartAddonDrawer";
import WizardContextFaqSnapshot from "@/components/booking/WizardContextFaqSnapshot";
import BookWhatHappensNext from "@/components/booking/BookWhatHappensNext";
import BookingStepPanel from "@/components/booking/BookingStepPanel";
import BookingWhatsAppPreview from "@/components/booking/BookingWhatsAppPreview";
import BookingWizardNav from "@/components/booking/BookingWizardNav";
import WizardProgressBar from "@/components/booking/WizardProgressBar";
import WizardStepCelebrate from "@/components/booking/WizardStepCelebrate";
import WizardStepBlockerBanner from "@/components/booking/WizardStepBlockerBanner";
import WizardStepProgress from "@/components/booking/WizardStepProgress";
import BookOptionalAddonsButton from "@/components/booking/BookOptionalAddonsButton";
import BookDraftRecoveryBanner from "@/components/booking/BookDraftRecoveryBanner";
import {
  EventsDecoyVipCard,
  EventsLastMinutePhotoOffer,
  EventsPriceReframe,
  EventsReassuranceBadge,
  EventsSessionPriorityPills,
  EventsWelcomePerkPills,
  EventsWizardStep3HoldTimer,
  EventsWizardStepTransitionOverlay,
  EventsWizardUrgencyHint,
} from "@/components/booking/EventsWizardCroBlocks";
import { WizardCroShell } from "@/components/booking/cro/WizardCroShell";
import WizardWhatsAppEscapeLink from "@/components/booking/WizardWhatsAppEscapeLink";
import BookingSuccessPanel from "@/components/booking/BookingSuccessPanel";
import BookingDateTimeFields from "@/components/booking/BookingDateTimeFields";
import BookingFormField from "@/components/booking/BookingFormField";
import BookingPhoneInput from "@/components/booking/BookingPhoneInput";
import PriceWithVat from "@/components/booking/PriceWithVat";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useBookingWizard } from "@/hooks/useBookingWizard";
import { FORM_MICROCOPY } from "@/lib/form-microcopy";
import {
  EVENT_BOOKING_ITEMS,
  EVENT_BUNDLE_BADGE_LABELS,
  EVENT_GIFT_THRESHOLD,
  RIGID_ACTIVATION_OPTIONS,
  LIQUID_FREQUENCY_OPTIONS,
  defaultQuantity,
  getEventBundlePrice,
  getAttractionAddOnPrice,
  type EventBookingItemId,
  type EventBookingItemQuantity,
} from "@/lib/data/events-booking";
import {
  EVENT_BOOKING_UPSELLS,
  EVENT_GENERAL_UPSELLS,
  EVENT_CONTEXTUAL_UPSELLS,
} from "@/lib/data/events-booking-upsells";
import {
  getCatalogAddonsForEventsBundle,
  resolveAddonLabel,
  resolveAddonPrice,
  sumAddonPrices,
} from "@/lib/pricing-addon-adapter";
import { getWizardFaqsForEventsStep } from "@/lib/data/wizard-step-faqs";
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
import { EVENTS_CRO_CONFIG } from "@/lib/data/cro/events";
import { buildWizardEscapeHref } from "@/lib/book-wizard-cro/build-wizard-escape-href";
import { readBookCoreContact } from "@/lib/book-wizard-cro/shared-contact";
import { useWizardGhostLead } from "@/lib/book-wizard-cro/useWizardGhostLead";
import { useWizardFunnel } from "@/lib/book-wizard-cro/useWizardFunnel";
import { useBookCoreContactBridge } from "@/hooks/useBookCoreContactBridge";
import { useBookExitIntent } from "@/hooks/useBookExitIntent";
import { useWizardHistory } from "@/hooks/useWizardHistory";
import { useWizardUserIdle } from "@/hooks/useWizardUserIdle";
import { fireBookingConfetti } from "@/lib/book-wizard-confetti";
import { scrollToBookWizardPanelAndFocusStep } from "@/lib/book-wizard-step-focus";
import {
  ensureHoldDeadline,
  saveCategoryPriceHold,
} from "@/lib/book-wizard-urgency";
import { usePriceHoldBadge } from "@/lib/book-wizard-cro/use-price-hold-badge";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import {
  scrollAndHighlightFirstError,
  scrollToFirstWizardBlocker,
} from "@/lib/scroll-to-error";
import {
  getEventsStep0Blockers,
  getEventsStep0Checklist,
  getEventsStep1Blockers,
  getEventsStep1Checklist,
  type WizardStepBlocker,
} from "@/lib/events-wizard-step-guards";
import { cn } from "@/lib/utils";

function AttractionIcon({
  svgPath,
  viewBox,
  size = 24,
}: {
  svgPath: string;
  viewBox: string;
  size?: number;
}) {
  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <path d={svgPath} />
    </svg>
  );
}

const CONFETTI_MOMENT_LABELS: Record<string, string> = {
  glass_break: "שבירת הכוס בחופה",
  slow_dance: "שיא ריקוד הסלואו",
  afterparty: "פתיחת הרחבה - אפטר פארטי",
};

const STEPS = ["אטרקציות", "פרטים", "סיכום"] as const;

const INITIAL: EventsFormDraft = {
  selected: [],
  quantities: {},
  name: "",
  phone: "",
  date: "",
  time: "",
  location: "",
  customerNeed: "",
  notes: "",
  selectedUpsells: [],
  sessionPriority: "",
  welcomePerk: "",
  lastMinuteUpsell: false,
  termsAccepted: false,
  confettiMoment: "",
};

/** תגי אמינות ספציפיים לאירועים (לא "גיבוי ענן" / "חניה") */
const EVENTS_TRUST_BADGES = [
  { icon: "⏰", label: "מגיעים לפחות 40 דקות לפני האירוע" },
  { icon: "🔌", label: "מחברים ומצפינים כבלים – עבודה מסודרת" },
  { icon: "✅", label: "בודקים כל הציוד לפני כניסת האורחים" },
  { icon: "🤝", label: "ראש שקט – אנחנו מסודרים עד הסוף" },
] as const;

/** צעדי "מה קורה אחרי שמזמינים?" */
const EVENTS_NEXT_STEPS = [
  { number: 1, title: "מזמינים ומאשרים", body: "שולחים הודעה ומקבלים אישור זמינות" },
  { number: 2, title: "אנחנו מגיעים מוקדם", body: "40+ דק׳ לפני – בדיקה, חיבור ואבטחת כבלים" },
  { number: 3, title: "אתם נהנים – אנחנו על זה", body: "ראש שקט מהרגע שאתם מזמינים" },
] as const;

type EventsBookingWizardProps = {
  routeId?: string | null;
  initialEventItemId?: EventBookingItemId | null;
};

function buildInitialEventsForm(itemId: EventBookingItemId | null): EventsFormDraft {
  if (!itemId) return INITIAL;
  const item = EVENT_BOOKING_ITEMS.find((i) => i.id === itemId);
  if (!item) return INITIAL;
  return {
    ...INITIAL,
    selected: [itemId],
    quantities: { [itemId]: defaultQuantity(item) },
  };
}

export default function EventsBookingWizard({
  routeId = null,
  initialEventItemId = null,
}: EventsBookingWizardProps) {
  const coreContactMerged = useRef(false);
  const [step2Transition, setStep2Transition] = useState(false);
  const [exitIntentOpen, setExitIntentOpen] = useState(false);
  const [celebrateKey, setCelebrateKey] = useState(0);
  const [celebrateMeta, setCelebrateMeta] = useState<{ from: number; to: number } | null>(
    null,
  );
  const [addonDrawerOpen, setAddonDrawerOpen] = useState(false);
  const [stepBlockers, setStepBlockers] = useState<readonly WizardStepBlocker[]>([]);
  const prevStepRef = useRef(0);
  const [step3HoldDeadline, setStep3HoldDeadline] = useState<number | null>(null);
  const [priceHoldLabel, setPriceHoldLabel] = usePriceHoldBadge(
    "events",
    EVENTS_CRO_CONFIG.urgency.priceHoldBadge,
  );
  const initialForm = useMemo(
    () => buildInitialEventsForm(initialEventItemId),
    [initialEventItemId],
  );

  const {
    step,
    form,
    errors,
    setStep,
    patchForm,
    setErrors,
    mergeErrors,
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
    initialForm,
    parseDraft: (raw) => parseEventsFormDraft(raw, initialForm),
    persistStepInDraft: true,
    maxStep: 2,
  });

  const trackFunnel = useWizardFunnel("events");

  const { honeypot, setHoneypot, globalError } = guard;

  useBookCoreContactBridge(form.name, form.phone);

  useWizardHistory({
    category: "events",
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
    if (!initialEventItemId || form.selected.length > 0) return;
    const item = EVENT_BOOKING_ITEMS.find((i) => i.id === initialEventItemId);
    if (!item) return;
    queueMicrotask(() =>
      patchForm({
        selected: [initialEventItemId],
        quantities: { [initialEventItemId]: defaultQuantity(item) },
      }),
    );
  }, [initialEventItemId, form.selected.length, patchForm]);

  useBookWizardStep("events", step);

  useEffect(() => {
    if (step > prevStepRef.current) {
      setCelebrateMeta({ from: prevStepRef.current, to: step });
      setCelebrateKey((k) => k + 1);
    }
    prevStepRef.current = step;
  }, [step]);

  const SOUND_RENTAL_ID: EventBookingItemId = "sound_rental";
  const SOUND_RENTAL_PRICE = 1750;

  /** הגברה היא line item נפרד – לא נכנסת לחישוב הבאנדל */
  const attractionIds = useMemo(
    () => form.selected.filter((id) => id !== SOUND_RENTAL_ID),
    [form.selected],
  );
  const count = attractionIds.length;
  const hasSoundRental = form.selected.includes(SOUND_RENTAL_ID);

  /** סכום תוספות הפעלה/תדירות (מעל מחיר הבסיס) */
  const addOnTotal = useMemo(
    () =>
      attractionIds.reduce((sum, id) => {
        const item = EVENT_BOOKING_ITEMS.find((i) => i.id === id);
        const qty = form.quantities[id] ?? (item ? defaultQuantity(item) : "standard");
        return sum + getAttractionAddOnPrice(id, qty);
      }, 0),
    [attractionIds, form.quantities],
  );

  /**
   * upsells הקשריים שיש להציג:
   * - הטריגר נבחר
   * - הactivation של הטריגר עדיין act_1 (לא שדרגו ידנית)
   * - ה-upsell עצמו לא בא להחליף activation שכבר נבחר
   */
  /** IDs של upsells שמוצגים inline בתוך כרטיס האטרקציה (לא בסקשן הנפרד) */
  const INLINE_UPSELL_IDS = new Set(["confetti_second_cannon"]);

  const visibleContextualUpsells = useMemo(
    () =>
      EVENT_CONTEXTUAL_UPSELLS.filter((u) => {
        if (INLINE_UPSELL_IDS.has(u.id)) return false; // מוצג inline
        if (!u.triggerAttractionIds) return false;
        return u.triggerAttractionIds.some((triggerId) => {
          const id = triggerId as EventBookingItemId;
          if (!form.selected.includes(id)) return false;
          // שדרוג הפעלה - נסתר כשכבר שדרגו ידנית ל-act_2/act_3
          const qty = form.quantities[id];
          return !qty || qty === "act_1";
        });
      }),
    [form.selected, form.quantities],
  );

  const upsellTotal = sumAddonPrices(new Set(form.selectedUpsells));
  const lastMinuteUpsellCfg = EVENTS_CRO_CONFIG.lastMinuteUpsell;
  const lastMinutePhotoDiscount =
    form.lastMinuteUpsell &&
    lastMinuteUpsellCfg &&
    form.selectedUpsells.includes(lastMinuteUpsellCfg.upgradeId)
      ? lastMinuteUpsellCfg.listPrice - lastMinuteUpsellCfg.promoPrice
      : 0;
  const adjustedUpsellTotal = upsellTotal - lastMinutePhotoDiscount;
  const bundleBase = getEventBundlePrice(count);
  const soundRentalLine = hasSoundRental ? SOUND_RENTAL_PRICE : 0;
  const bundleTotal = bundleBase + addOnTotal + soundRentalLine + adjustedUpsellTotal;
  /** חיסכון מהבאנדל – לא כולל הגברה ולא כולל תוספות */
  const savings = count > 1 ? count * 1750 - bundleBase : 0;
  /** חיסכון מ-upsells עם מחיר מקורי */
  const upsellSavings = useMemo(
    () =>
      form.selectedUpsells.reduce((sum, uid) => {
        const u = EVENT_BOOKING_UPSELLS.find((x) => x.id === uid);
        if (!u?.originalPrice || u.originalPrice <= u.price) return sum;
        return sum + (u.originalPrice - u.price);
      }, 0),
    [form.selectedUpsells],
  );
  /** סה״כ חיסכון: חבילה + upsells */
  const totalSavings = savings + upsellSavings;
  /** חיסכון פוטנציאלי אם יוסיפו את כל ה-upsells הנראים */
  const potentialUpsellSavings = useMemo(
    () =>
      visibleContextualUpsells
        .filter((u) => !form.selectedUpsells.includes(u.id) && u.originalPrice && u.originalPrice > u.price)
        .reduce((sum, u) => sum + (u.originalPrice! - u.price), 0),
    [visibleContextualUpsells, form.selectedUpsells],
  );
  const today = new Date().toISOString().split("T")[0];

  const livePriceReport = useMemo(() => {
    if (count === 0 && !hasSoundRental) return null;
    const attractionLabel =
      count > 0
        ? `${count} אטרקציה${count !== 1 ? "ות" : ""}`
        : "";
    const title = [attractionLabel, hasSoundRental ? "הגברה" : ""].filter(Boolean).join(" + ");
    return {
      totalExVat: bundleTotal,
      title: title || "אטרקציות לאירוע",
      ctaLabel: sendBookingWaCta(withVat(bundleTotal)),
    };
  }, [bundleTotal, count, hasSoundRental]);

  useReportBookWizardLivePrice(livePriceReport);

  const catalogAddonItems = useMemo(
    () => getCatalogAddonsForEventsBundle(count),
    [count],
  );
  const eventsWizardFaqs = useMemo(() => getWizardFaqsForEventsStep(), []);

  const whatsappCtaLabel = livePriceReport?.ctaLabel ?? sendBookingWaCta(withVat(bundleTotal));

  const toggle = (id: EventBookingItemId) => {
    const has = form.selected.includes(id);
    const nextSelected = has
      ? form.selected.filter((x) => x !== id)
      : [...form.selected, id];
    const nextQuantities = { ...form.quantities };
    if (has) delete nextQuantities[id];
    patchForm({ selected: nextSelected, quantities: nextQuantities });
  };

  const setQuantity = (id: EventBookingItemId, qty: EventBookingItemQuantity) => {
    const patch: Parameters<typeof patchForm>[0] = {
      quantities: { ...form.quantities, [id]: qty },
    };
    // אם שדרגו מ-act_1 - הסר רק upsells מסוג isActivationUpgrade (לא תוספות ציוד עצמאיות)
    if (qty !== "act_1") {
      const toRemove = new Set(
        EVENT_CONTEXTUAL_UPSELLS
          .filter((u) => u.isActivationUpgrade && u.triggerAttractionIds?.includes(id))
          .map((u) => u.id),
      );
      if (toRemove.size > 0) {
        patch.selectedUpsells = form.selectedUpsells.filter((uid) => !toRemove.has(uid));
      }
    }
    patchForm(patch);
  };

  const labels = useMemo(
    () =>
      form.selected
        .map((id) => {
          const item = EVENT_BOOKING_ITEMS.find((i) => i.id === id);
          if (!item) return null;
          const qty = form.quantities[id];
          if (item.pricingType === "rigid" && qty && qty !== "act_1") {
            const opt = RIGID_ACTIVATION_OPTIONS.find((o) => o.key === qty);
            if (opt) return `${item.name} (${opt.label})`;
          }
          if (item.pricingType === "liquid" && qty && qty !== "freq_single") {
            const opt = LIQUID_FREQUENCY_OPTIONS.find((o) => o.key === qty);
            if (opt) return `${item.name} (${opt.label})`;
          }
          if (qty === "double" && item.quantityLabel) {
            return `${item.name} × ${item.quantityLabel.double.split(" ")[0]}`;
          }
          return item.name;
        })
        .filter(Boolean),
    [form.selected, form.quantities],
  );

  const step0Checklist = useMemo(
    () => getEventsStep0Checklist(count),
    [count],
  );

  const step1Checklist = useMemo(
    () =>
      getEventsStep1Checklist({
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
    ...(labels.length > 0 ? [{ label: "אטרקציות", value: labels.join(", ") }] : []),
    ...(hasSoundRental ? [{ label: "הגברה", value: `השכרת ציוד הגברה (+${SOUND_RENTAL_PRICE.toLocaleString("he-IL")} ₪)` }] : []),
    ...(count >= EVENT_GIFT_THRESHOLD ? [{ label: "מתנה", value: "מצגת תמונות חינם" }] : []),
    ...(savings > 0 ? [{ label: "חיסכון חבילה", value: `${savings.toLocaleString()} ₪` }] : []),
    ...(form.sessionPriority
      ? [
          {
            label: "עדיפות",
            value:
              EVENTS_CRO_CONFIG.anxieties.find((a) => a.id === form.sessionPriority)?.label ??
              form.sessionPriority,
          },
        ]
      : []),
    ...(form.welcomePerk
      ? [
          {
            label: "הטבת הגעה",
            value:
              EVENTS_CRO_CONFIG.perks.find((p) => p.id === form.welcomePerk)?.label ??
              form.welcomePerk,
          },
        ]
      : []),
    ...(form.confettiMoment
      ? [{ label: "רגע שיא קונפטי", value: CONFETTI_MOMENT_LABELS[form.confettiMoment] ?? form.confettiMoment }]
      : []),
    ...(form.notes ? [{ label: "הערות", value: sanitizeLeadText(form.notes, 500) }] : []),
    ...form.selectedUpsells.map((uid) => {
      const price = resolveAddonPrice(uid);
      if (price <= 0) return null;
      return {
        label: "תוספת",
        value: `${resolveAddonLabel(uid)} (+${price.toLocaleString("he-IL")} ₪)`,
      };
    }).filter((line): line is { label: string; value: string } => line !== null),
  ];

  const summaryLines = useMemo(() => buildSummaryLines(), [
    form.date,
    form.time,
    form.location,
    form.notes,
    form.sessionPriority,
    form.welcomePerk,
    labels,
    hasSoundRental,
    count,
    savings,
    form.selectedUpsells,
  ]);

  const escapeWaHref = useMemo(
    () =>
      buildWizardEscapeHref({
        category: "events",
        serviceLabel: EVENTS_CRO_CONFIG.serviceLabel,
        formId: EVENTS_CRO_CONFIG.formId,
        summaryLines,
        priceExVat: bundleTotal,
        contactName: form.name,
        contactPhone: form.phone,
        ycStep: step + 1,
      }),
    [summaryLines, bundleTotal, form.name, form.phone, step],
  );

  const handleGhostLeadFired = useCallback(() => {
    trackFunnel("GhostLead_Fired", {
      package_id: form.selected.join(",") || "",
      step: 3,
    });
  }, [form.selected, trackFunnel]);

  useWizardGhostLead({
    category: "events",
    formId: EVENTS_CRO_CONFIG.formId,
    step,
    closingStepIndex: 2,
    name: form.name,
    phone: form.phone,
    subject: "טיוטת הזמנת אטרקציות - שלב סגירה",
    body: summaryLines.map((l) => `${l.label}: ${l.value}`).join("\n"),
    onFired: handleGhostLeadFired,
  });

  const showCroOverlays = !isSubmitted && step < 2;
  const packageSummaryLabel =
    count > 0
      ? `${count} אטרקציה${count !== 1 ? "ות" : ""}${hasSoundRental ? " + הגברה" : ""}`
      : hasSoundRental
        ? "השכרת הגברה"
        : "";

  const showLastMinutePhotoOffer =
    lastMinuteUpsellCfg &&
    (form.lastMinuteUpsell ||
      !form.selectedUpsells.includes(lastMinuteUpsellCfg.upgradeId));

  const handleLastMinutePhotoChange = (checked: boolean) => {
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
    if (bundleTotal > 0 && packageSummaryLabel) {
      saveCategoryPriceHold("events", {
        packageLabel: packageSummaryLabel,
        totalExVat: bundleTotal,
      });
      setPriceHoldLabel(EVENTS_CRO_CONFIG.urgency.priceHoldBadge);
    }
    setExitIntentOpen(true);
  }, [bundleTotal, packageSummaryLabel]);

  useBookExitIntent({
    enabled: showCroOverlays && bundleTotal > 0 && count > 0,
    onTrigger: handleExitIntent,
  });

  const { idle: wizardIdle, dismiss: dismissWizardIdle } = useWizardUserIdle({
    enabled: !isSubmitted && step <= 2,
  });

  const completeStep2Transition = useCallback(() => {
    setStep2Transition(false);
    setStep3HoldDeadline(ensureHoldDeadline("events"));
    setStep(2);
    scrollToBookWizardPanelAndFocusStep(2);
  }, [setStep]);

  const goToStep = (n: number) => {
    setStepBlockers([]);
    setStep(n);
    scrollToBookWizardPanelAndFocusStep(n);
  };

  const attemptAdvanceFromStep0 = () => {
    const blockers = getEventsStep0Blockers({ attractionCount: count });
    if (blockers.length > 0) {
      setStepBlockers(blockers);
      scrollToFirstWizardBlocker(blockers[0]!.scrollTargetId);
      return;
    }
    trackFunnel("Step1_Complete", {
      package_id: form.selected.join(",") || "",
      step: 1,
    });
    goToStep(1);
  };

  const beginStep2Transition = () => {
    trackFunnel("Step2_PackageSelected", {
      package_id: form.selected.join(",") || "",
      step: 2,
    });
    setStepBlockers([]);
    setStep2Transition(true);
  };

  const attemptAdvanceFromStep1 = () => {
    const blockers = getEventsStep1Blockers({
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
      setAddonDrawerOpen(false);
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
    }, { bookCategory: "events", source: "/book#events" });
  }, [form, labels, count, savings, form.sessionPriority, form.welcomePerk]);

  const handleAction = (intent: "continue_chat" | "start_now") => {
    if (!form.termsAccepted) {
      setErrors({ terms: "יש לאשר את התנאים לפני שליחה" });
      scrollAndHighlightFirstError();
      return;
    }
    trackFunnel("WhatsApp_Click", {
      package_id: form.selected.join(",") || "",
      step: 3,
      intent,
      last_minute_photo: form.lastMinuteUpsell,
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
      {/* SEO: אינדקס סטטי לסורקים ומנועי AI */}
      <section className="sr-only" aria-label="רשימת אטרקציות לאירועים">
        <h2>אטרקציות לחתונה, בר מצווה ואירועי חברה «יקיר כהן הפקות»</h2>
        {EVENT_BOOKING_ITEMS.map((item) => (
          <div key={item.id}>
            <h3>{item.name}</h3>
            <p>{item.desc}</p>
            <p>מחיר בסיס: 1,750 ₪</p>
          </div>
        ))}
      </section>

      {draft.restored && draft.savedAt ? (
        <BookDraftRecoveryBanner
          savedAt={draft.savedAt}
          onClear={resetWizard}
          onDismiss={() => dismissDraft()}
        />
      ) : null}

      <BookingWizardNav steps={STEPS} currentStep={step} label="שלבי הזמנת אטרקציות" />
      <WizardProgressBar
        currentStep={step}
        totalSteps={STEPS.length}
        celebrateKey={celebrateKey}
        className="-mt-4"
      />
      {celebrateMeta ? (
        <WizardStepCelebrate
          key={celebrateKey}
          category="events"
          fromStep={celebrateMeta.from}
          toStep={celebrateMeta.to}
        />
      ) : null}

      {/* ── שלב 0: בחירת אטרקציות ── */}
      {step === 0 && (
        <BookingStepPanel stepKey={0}>
          <EventsWizardUrgencyHint priceHoldLabel={priceHoldLabel} className="mb-4" />
          <h2 className="text-xl font-semibold text-foreground">בחרו אטרקציות</h2>
          <p className="text-sm text-muted-foreground">
            2 אטרקציות = חבילה · 4+ = מתנת מצגת תמונות · כמות כפולה = 25% הנחה
          </p>
          <div id="book-events-selection" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {EVENT_BOOKING_ITEMS.map((item) => {
              const active = form.selected.includes(item.id);
              const qty = form.quantities[item.id] ?? "standard";

              return (
                <div key={item.id} className="flex flex-col gap-1.5">
                  {/* כרטיס ראשי – לחיץ לבחירה */}
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    className={cn(
                      "rounded-xl border p-4 text-start transition-colors",
                      active ? "border-brand-red bg-brand-red/5" : "border-border hover:border-border/80",
                    )}
                    aria-pressed={active}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-muted-foreground" aria-hidden="true">
                        <AttractionIcon svgPath={item.svgPath} viewBox={item.svgViewBox} size={28} />
                      </span>
                      {/* קישור מידע על האטרקציה */}
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="shrink-0 text-[0.65rem] text-muted-foreground/70 hover:text-brand-red transition-colors underline-offset-2 hover:underline"
                          aria-label={`מידע נוסף על ${item.name}`}
                        >
                          מידע נוסף ↗
                        </a>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm font-semibold text-foreground">{item.name}</p>
                    {item.badge ? (
                      <span className="text-xs text-brand-red">
                        {EVENT_BUNDLE_BADGE_LABELS[item.badge]}
                      </span>
                    ) : null}
                    <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                  </button>

                  {/* סלקטור הפעלות לאטרקציות rigid (זיקוקים/קונפטי) */}
                  {active && item.pricingType === "rigid" ? (
                    <>
                      {/* כמות הפעלות */}
                      <p className="px-0.5 text-[0.65rem] font-semibold text-muted-foreground">כמות רגעי שיא</p>
                      <div className="flex flex-col gap-1 px-0.5">
                        {RIGID_ACTIVATION_OPTIONS.map((opt) => {
                          const isSelected = (qty ?? "act_1") === opt.key;
                          return (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => setQuantity(item.id, opt.key)}
                              className={cn(
                                "flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors text-right",
                                isSelected
                                  ? "border-brand-red bg-brand-red/5 text-brand-red"
                                  : "border-border text-muted-foreground hover:border-brand-red/40",
                              )}
                            >
                              <span>{opt.shortLabel}</span>
                              <span className={cn("text-[0.65rem] font-normal", opt.addOnPrice > 0 ? "" : "opacity-60")}>
                                {opt.addOnPrice > 0 ? `+${opt.addOnPrice.toLocaleString("he-IL")} ₪` : "כלול"}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* בוחר כמות תותחים - רק לקונפטי */}
                      {item.id === "event_confetti" ? (
                        <div className="px-0.5">
                          <p className="mb-1 text-[0.65rem] font-semibold text-muted-foreground">כמות תותחים</p>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (selectedUpsellSet.has("confetti_second_cannon")) {
                                  toggleUpsell("confetti_second_cannon");
                                }
                              }}
                              className={cn(
                                "flex-1 rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors text-right",
                                !selectedUpsellSet.has("confetti_second_cannon")
                                  ? "border-brand-red bg-brand-red/5 text-brand-red"
                                  : "border-border text-muted-foreground hover:border-brand-red/40",
                              )}
                            >
                              <span className="block font-semibold">תותח אחד</span>
                              <span className="block text-[0.6rem] opacity-70">כלול במחיר</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (!selectedUpsellSet.has("confetti_second_cannon")) {
                                  toggleUpsell("confetti_second_cannon");
                                }
                              }}
                              className={cn(
                                "flex-1 rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors text-right",
                                selectedUpsellSet.has("confetti_second_cannon")
                                  ? "border-brand-red bg-brand-red/5 text-brand-red"
                                  : "border-border text-muted-foreground hover:border-brand-red/40",
                              )}
                            >
                              <span className="block font-semibold">2 תותחים</span>
                              <span className="block text-[0.6rem] text-green-700">+875 ₪ (25% הנחה)</span>
                            </button>
                          </div>
                          {selectedUpsellSet.has("confetti_second_cannon") ? (
                            <p className="mt-1 text-[0.65rem] text-muted-foreground">
                              שני תותחים יורים בו-זמנית - גשם קונפטי מכל כיוון ברחבה
                            </p>
                          ) : null}
                        </div>
                      ) : null}

                      {item.id === "event_confetti" ? (
                        <ConfettiMomentSelector
                          value={form.confettiMoment}
                          onChange={(v) => patchForm({ confettiMoment: v })}
                        />
                      ) : null}

                      {item.id === "event_confetti" ? (
                        <VenueApprovalShield compact />
                      ) : null}

                      <p className="px-0.5 text-[0.65rem] leading-relaxed text-muted-foreground">
                        כל הפעלה כוללת מלאי גלם חדש ומלא.{" "}
                        <span className="font-medium">אישור האולם לזיקוקים/קונפטי - באחריות המזמין.</span>
                      </p>
                    </>
                  ) : null}

                  {/* סלקטור תדירות לאטרקציות liquid (עשן/בועות) */}
                  {active && item.pricingType === "liquid" ? (
                    <>
                      <div className="grid grid-cols-2 gap-1 px-0.5">
                        {LIQUID_FREQUENCY_OPTIONS.map((opt) => {
                          const isSelected = (qty ?? "freq_single") === opt.key;
                          return (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => setQuantity(item.id, opt.key)}
                              className={cn(
                                "flex flex-col rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors text-right",
                                isSelected
                                  ? "border-brand-red bg-brand-red/5 text-brand-red"
                                  : "border-border text-muted-foreground hover:border-brand-red/40",
                              )}
                            >
                              <span className="truncate">{opt.shortLabel}</span>
                              <span className={cn("text-[0.65rem] font-normal", opt.addOnPrice > 0 ? "text-green-700" : "opacity-60")}>
                                {opt.addOnPrice > 0
                                  ? `+${opt.addOnPercent} (+${opt.addOnPrice.toLocaleString("he-IL")} ₪)`
                                  : "כלול"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="px-0.5 text-[0.65rem] leading-relaxed text-muted-foreground">
                        {(qty ?? "freq_single") === "freq_extreme"
                          ? "אקסטרים = הפעלה בין סבבי ריקודים, עם הפסקות מחזור אוטומטיות. "
                          : ""}
                        פיזור האפקט תלוי בתנאי האולם (מזגן, זרימת אוויר). מתחייבים לציוד תקין ומלאי מקסימלי.
                      </p>
                    </>
                  ) : null}

                  {/* טוגל legacy לכמות כפולה – לפריטים ללא pricingType */}
                  {active && !item.pricingType && item.quantityLabel ? (
                    <>
                      <div className="flex gap-1.5 px-0.5">
                        <button
                          type="button"
                          onClick={() => setQuantity(item.id, "standard")}
                          className={cn(
                            "flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors",
                            (qty ?? "standard") === "standard"
                              ? "border-brand-red bg-brand-red/5 text-brand-red"
                              : "border-border text-muted-foreground hover:border-brand-red/40",
                          )}
                        >
                          {item.quantityLabel.standard}
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuantity(item.id, "double")}
                          className={cn(
                            "flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors",
                            qty === "double"
                              ? "border-brand-red bg-brand-red/5 text-brand-red"
                              : "border-border text-muted-foreground hover:border-brand-red/40",
                          )}
                        >
                          {item.quantityLabel.double}
                        </button>
                      </div>
                      <p className="px-0.5 text-[0.7rem]">
                        {qty === "double" ? (
                          <>
                            <span className="line-through text-muted-foreground/60">+1,750 ₪</span>{" "}
                            <span className="font-semibold text-green-700">+875 ₪</span>
                            <span className="text-muted-foreground"> (25% הנחה על הזוג)</span>
                          </>
                        ) : (
                          <span className="text-muted-foreground/60">בחר כמות כפולה וחסוך 25%</span>
                        )}
                      </p>
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>

          {count > 0 ? (
            <div className="rounded-xl border border-border bg-surface p-4">
              <PriceWithVat amountExVat={bundleTotal} size="lg" />
              {totalSavings > 0 ? (
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-950/30">
                  <span className="text-base" aria-hidden>💰</span>
                  <div>
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                      חסכתם {totalSavings.toLocaleString("he-IL")} ₪
                    </p>
                    <p className="text-[0.65rem] text-emerald-600 dark:text-emerald-500">
                      {savings > 0 && upsellSavings > 0
                        ? `${savings.toLocaleString("he-IL")} ₪ מהחבילה + ${upsellSavings.toLocaleString("he-IL")} ₪ מהצעות מיוחדות`
                        : savings > 0
                        ? "הנחת חבילה לעומת רכישה נפרדת"
                        : "מהצעות מיוחדות"}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {visibleContextualUpsells.length > 0 ? (
            <BookUpsellSection
              title={
                potentialUpsellSavings > 0
                  ? `🎁 הצעה מיוחדת - חסכו עד ${potentialUpsellSavings.toLocaleString("he-IL")} ₪`
                  : upsellSavings > 0
                  ? `🎁 חסכתם ${upsellSavings.toLocaleString("he-IL")} ₪ בהצעות מיוחדות`
                  : "🎁 הצעה מיוחדת בשבילכם"
              }
              items={visibleContextualUpsells}
              selected={selectedUpsellSet}
              onToggle={toggleUpsell}
            />
          ) : null}

          {count > 0 && catalogAddonItems.length === 0 ? (
            <BookUpsellSection
              items={EVENT_GENERAL_UPSELLS}
              selected={selectedUpsellSet}
              onToggle={toggleUpsell}
            />
          ) : null}

          <WizardContextFaqSnapshot items={eventsWizardFaqs} className="mt-6" />

          {EVENTS_CRO_CONFIG.escapePlacements.includes("after_packages") ? (
            <EventsDecoyVipCard escapeWaHref={escapeWaHref} />
          ) : null}

          {count === 0 &&
          EVENTS_CRO_CONFIG.escapePlacements.includes("empty_results") ? (
            <WizardWhatsAppEscapeLink href={escapeWaHref} />
          ) : null}

          <BookOptionalAddonsButton
            count={catalogAddonItems.length}
            onClick={() => setAddonDrawerOpen(true)}
            className="mt-6"
          />

          <WizardStepProgress items={step0Checklist} className="mt-4" />
          <WizardStepBlockerBanner blockers={stepBlockers} className="mt-4" />

          <StepNav onNext={attemptAdvanceFromStep0} showBack={false} />
        </BookingStepPanel>
      )}

      {/* ── שלב 1: פרטי האירוע ── */}
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
            <div id="book-events-schedule">
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
            <EventsSessionPriorityPills
              value={form.sessionPriority}
              onChange={(id) => patchForm({ sessionPriority: id })}
            />
            {form.sessionPriority ? (
              <EventsReassuranceBadge anxietyId={form.sessionPriority} />
            ) : null}
            <EventsWelcomePerkPills
              value={form.welcomePerk}
              onChange={(id) => patchForm({ welcomePerk: id })}
            />
          </div>
          {EVENTS_CRO_CONFIG.escapePlacements.includes("step_contact") ? (
            <WizardWhatsAppEscapeLink href={escapeWaHref} />
          ) : null}
          <WizardStepProgress items={step1Checklist} className="mt-4" />
          <WizardStepBlockerBanner blockers={stepBlockers} className="mt-4" />

          <StepNav
            onBack={() => goToStep(0)}
            onNext={attemptAdvanceFromStep1}
          />
        </BookingStepPanel>
      )}

      {/* ── שלב 2: סיכום ── */}
      {step === 2 && (count > 0 || hasSoundRental) && (
        <BookingStepPanel stepKey={2}>
          {step3HoldDeadline ? (
            <EventsWizardStep3HoldTimer deadlineMs={step3HoldDeadline} />
          ) : null}
          <p className="mb-4 text-center text-base font-semibold text-foreground">
            {EVENTS_CRO_CONFIG.step3Closer}
          </p>
          <EventsPriceReframe />
          <button
            type="button"
            onClick={() => setStep(0)}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
          >
            ✏️ ערוך בחירה
          </button>

          <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            {/* עמודת שמאל – סיכום מה שנבחר */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-surface p-6">
                <div className="flex items-center gap-2">
                  <span className="text-lg" aria-hidden="true">🎉</span>
                  <h2 className="font-semibold">
                    סיכום הזמנה ({count} אטרקציה{count !== 1 ? "ות" : ""}
                    {hasSoundRental ? " + הגברה" : ""})
                  </h2>
                </div>

                <ul className="mt-3 space-y-1.5">
                  {form.selected.map((id) => {
                    const item = EVENT_BOOKING_ITEMS.find((i) => i.id === id);
                    if (!item) return null;
                    const qty = form.quantities[id];
                    const isDouble = qty === "double" && item.quantityLabel;
                    return (
                      <li key={id} className="flex items-start gap-2 text-sm">
                        <span className="mt-0.5 shrink-0 text-green-600" aria-hidden="true">✓</span>
                        <span className="inline-flex items-center gap-1.5 text-foreground">
                          <AttractionIcon svgPath={item.svgPath} viewBox={item.svgViewBox} size={16} />
                          {item.name}
                          {isDouble ? (
                            <span className="mr-1 text-xs text-muted-foreground">
                              ({item.quantityLabel?.double.split(" ")[0]})
                            </span>
                          ) : null}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                {count >= EVENT_GIFT_THRESHOLD ? (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
                    <span aria-hidden="true">🎁</span>
                    <span>מגיע לכם קליפ היילייטס 60 שניות – מתנה</span>
                  </div>
                ) : null}

                {/* פירוט מחיר קירורגי */}
                <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
                  {count > 0 ? (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        חבילת {count} אטרקציה{count !== 1 ? "ות" : ""}
                      </span>
                      <span>{bundleBase.toLocaleString("he-IL")} ₪</span>
                    </div>
                  ) : null}
                  {attractionIds
                    .filter((id) => {
                      const item = EVENT_BOOKING_ITEMS.find((i) => i.id === id);
                      const qty = form.quantities[id] ?? (item ? defaultQuantity(item) : "standard");
                      return item ? getAttractionAddOnPrice(id, qty) > 0 : false;
                    })
                    .map((id) => {
                      const item = EVENT_BOOKING_ITEMS.find((i) => i.id === id);
                      if (!item) return null;
                      const qty = form.quantities[id] ?? defaultQuantity(item);
                      const addOn = getAttractionAddOnPrice(id, qty);
                      let addOnDesc = "";
                      if (item.pricingType === "rigid") {
                        addOnDesc = RIGID_ACTIVATION_OPTIONS.find((o) => o.key === qty)?.label ?? "";
                      } else if (item.pricingType === "liquid") {
                        addOnDesc = LIQUID_FREQUENCY_OPTIONS.find((o) => o.key === qty)?.label ?? "";
                      } else if (qty === "double" && item.quantityLabel) {
                        addOnDesc = item.quantityLabel.double;
                      }
                      return (
                        <div key={id} className="flex items-start justify-between gap-2 text-xs text-muted-foreground">
                          <span className="flex-1">{item.name} - {addOnDesc}</span>
                          <span className="shrink-0">+{addOn.toLocaleString("he-IL")} ₪</span>
                        </div>
                      );
                    })}
                  {hasSoundRental ? (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">🔊 השכרת ציוד הגברה</span>
                      <span>+{SOUND_RENTAL_PRICE.toLocaleString("he-IL")} ₪</span>
                    </div>
                  ) : null}
                  {EVENT_BOOKING_UPSELLS.filter((u) => form.selectedUpsells.includes(u.id)).map((u) => (
                    <div key={u.id} className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{u.name}</span>
                      <span>+{u.price.toLocaleString("he-IL")} ₪</span>
                    </div>
                  ))}
                  {savings > 0 ? (
                    <div className="flex items-center justify-between text-xs text-green-700">
                      <span>💰 חיסכון חבילה</span>
                      <span>-{savings.toLocaleString("he-IL")} ₪</span>
                    </div>
                  ) : null}
                  <div className="flex items-center justify-between border-t border-border pt-2 font-semibold">
                    <span>סה״כ לפני מע״מ</span>
                    <span>{bundleTotal.toLocaleString("he-IL")} ₪</span>
                  </div>
                  <PriceWithVat amountExVat={bundleTotal} size="lg" className="mt-1" />
                </div>
              </div>

              {/* מה קורה אחרי שמזמינים */}
              <BookWhatHappensNext steps={EVENTS_NEXT_STEPS} />
            </div>

            {/* עמודת ימין – אמינות ושליחה */}
            <div className="relative z-10 space-y-4 pb-28">
              <BookTrustBadges badges={EVENTS_TRUST_BADGES} />

              {showLastMinutePhotoOffer ? (
                <EventsLastMinutePhotoOffer
                  checked={form.lastMinuteUpsell}
                  onChange={handleLastMinutePhotoChange}
                />
              ) : null}

              {/* שדה פרטים נוספים - מותאם לכל קהל: זוגות, מוסדות, מפיקים */}
              <div className="space-y-1.5">
                <label htmlFor="ev-customer-need" className="block text-sm font-semibold text-foreground">
                  💬 פרטים חשובים לנו לפני שמגיעים
                </label>
                <p className="text-xs text-muted-foreground">
                  אופציונלי – עוזר לנו להגיע מוכנים ב-100%.
                </p>
                <textarea
                  id="ev-customer-need"
                  value={form.customerNeed}
                  onChange={(e) => patchForm({ customerNeed: e.target.value })}
                  rows={3}
                  placeholder="שעת ההפעלה המדויקת, אחראי מטעמכם באולם, מגבלות האולם (גובה תקרה, איסור עשן), ספקים נוספים לתיאום..."
                  className="mt-1 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:border-brand-red focus:ring-2 focus:ring-brand-red/30"
                />
              </div>

              {previewBody ? <BookingWhatsAppPreview messageBody={previewBody} /> : null}

              <p className="text-sm text-muted-foreground">{BOOKING_SUMMARY_INTRO}</p>

              <div className="rounded-xl bg-surface px-4 py-3 text-center">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  המציאות דינמית. אם תצטרכו לשנות שעה או להוסיף אטרקציה אחרי השליחה הכל בסדר. גמיש עד יום האירוע. אין קנסות ואין אותיות קטנות.
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
                  label: whatsappCtaLabel,
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

              {/* תנאי תשלום מורחבים לאירועים */}
              <div className="rounded-xl border border-border bg-surface/50 px-4 py-3 text-[0.7rem] leading-relaxed text-muted-foreground">
                <p className="font-medium text-foreground/70">תנאי תשלום</p>
                <p className="mt-1">
                  עד 3 תשלומים · שוטף +60 יום עם חתימה (אפשרי +90 בתיאום)
                </p>
                <p className="mt-1 text-muted-foreground/70">
                  * איחור בתשלום יחויב בריבית חוזית והצמדה למדד, בהתאם לחוק פסיקת ריבית והצמדה.
                </p>
              </div>

              {/* הגבלת אחריות ותנאים תפעוליים */}
              <div className="rounded-xl border border-border bg-surface/50 px-4 py-3 text-[0.65rem] leading-relaxed text-muted-foreground">
                <p className="font-medium text-foreground/70">תנאים תפעוליים ומגבלות אחריות</p>
                <p className="mt-1">
                  <strong className="font-medium text-foreground/60">זיקוקים קרים / קונפטי:</strong>{" "}
                  כל הפעלה כוללת הקצאת חומרי גלם מלאה וחדשה. אישור האולם לשימוש באטרקציות אלו - באחריות המזמין בלבד. מניעת הפעלה על-ידי האולם ביום האירוע לא תהווה עילה להחזר כספי.
                </p>
                <p className="mt-1.5">
                  <strong className="font-medium text-foreground/60">עשן / בועות:</strong>{" "}
                  התנהגות הערפל, העשן והבועות (פיזור, גובה, משך) תלויה במערכות המיזוג וזרימת האוויר באולם. מתחייבים לאספקת ציוד תקין ומלאי חומר בנפח מקסימלי. &quot;חבילת אקסטרים&quot; מוגדרת כהפעלה בסבבי הריקודים הרשמיים בהפסקות מחזור אוטומטיות של המכונה.
                </p>
                <p className="mt-1.5">
                  <strong className="font-medium text-foreground/60">כוח עליון / כשל טכני:</strong>{" "}
                  במקרה של תקלה טכנית מובהקת שמנעה ביצוע אטרקציה, יזוכה המזמין עבור עלות אותה האטרקציה בלבד. לא תהיה זכאות לפיצוי נוסף בגין עגמת נפש או נזק עקיף.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-xs text-muted-foreground hover:text-brand-red"
              >
                חזרה לפרטים
              </button>
            </div>
          </div>
        </BookingStepPanel>
      )}

      <EventsWizardStepTransitionOverlay
        active={step2Transition}
        layout="summary"
        onComplete={completeStep2Transition}
        onAbort={() => setStep2Transition(false)}
      />
      <SmartAddonDrawer
        open={addonDrawerOpen && count > 0}
        packageLabel={packageSummaryLabel || "אטרקציות לאירועים"}
        basePriceExVat={bundleBase + addOnTotal + soundRentalLine}
        items={catalogAddonItems}
        selected={selectedUpsellSet}
        onToggle={toggleUpsell}
        onClose={() => setAddonDrawerOpen(false)}
        onContinue={() => setAddonDrawerOpen(false)}
      />
      <WizardCroShell
        config={EVENTS_CRO_CONFIG}
        exitIntentOpen={exitIntentOpen}
        packageLabel={packageSummaryLabel || "אטרקציות לאירועים"}
        totalExVat={bundleTotal}
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
