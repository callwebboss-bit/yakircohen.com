/**
 * WhatsApp message builders for booking flows.
 * Delegates to whatsapp-closing.ts for unified lead structure.
 */

import type { BookCategoryId } from "@/lib/book-url";
import { BOOK_CLOSER_SERVICE } from "@/lib/data/book-closer-map";
import { BOOKING_CONSULT_15_MIN } from "@/lib/data/booking-shared";
import { appendYcLeadTag } from "@/lib/yc-lead-tag";
import { FILTER_STORAGE_KEY } from "@/lib/data/filter-questions";
import { withVat } from "@/lib/data/pricing";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import {
  buildStudioGuidelinesLine,
  buildStudioParticipantsBlock,
  buildStudioPricingEstimateBlock,
  buildStudioScheduleDisplayLabel,
  buildStudioSplitWhatsAppBody,
  resolveStudioLeadPriceExVat,
  type StudioCloserCroInput,
  type StudioLeadMessageContext,
} from "@/lib/studio-booking-message";
import {
  buildBookGroupEnrichmentBlock,
  isGroupBookingLead,
  type GroupMessageInput,
} from "@/lib/studio-group-messaging";
import { shapeProgressiveBooking } from "@/lib/progressive-booking-message";
import {
  buildClosingMessage,
  PREMIUM_THRESHOLD,
  type ClosingIntent,
  type ClosingTiming,
} from "@/lib/whatsapp-closing";
import { VAT_RATE } from "@/lib/data/pricing";

export type BookingSummaryLine = {
  label: string;
  value: string;
};

export type BookingWhatsAppBodyOptions = {
  intent: ClosingIntent;
  serviceLabel: string;
  summaryLines: BookingSummaryLine[];
  contact: { name: string; phone: string };
  /** If provided and >= 3000 (with VAT), injects premium lead flag */
  totalEstimate?: number;
  /** Price before VAT for transparent split display */
  priceExVat?: number;
  packageLabel?: string;
  customerNeed?: string | null;
  utmSource?: string | null;
  timing?: ClosingTiming;
  includeTrustFooter?: boolean;
  bookCategory?: BookCategoryId;
  closerServiceId?: string;
  ycSchedule?: "weekdays" | "motzash" | null;
  ycPackage?: string | null;
  ycIntent?: "start_now" | "continue_chat" | null;
  ycStep?: number;
  ycForm?: string | null;
  /** Project purpose from filter questions */
  ycPurpose?: "professional" | "personal" | "gift" | null;
  /** Studio group pricing context */
  studioLead?: StudioLeadMessageContext | null;
  ycRoute?: string | null;
  ycEmotional?: string | null;
  ycRecordingType?: string | null;
  ycMobileGeo?: string | null;
  ycAtmosphere?: string | null;
  ycCelebrant?: string | null;
  ycWizardDepth?: "quick" | "standard" | "full" | null;
  ycScenarioChosen?: boolean | null;
  ycScenarioHint?: "unsure" | null;
  ycDeferred?: string | null;
  ycRecipientHint?: string | null;
  ycConfigVersion?: number | null;
  /** גל D — מטא CRO לפיצול הודעת WA (אולפן בלבד) */
  studioCro?: StudioCloserCroInput | null;
  scheduleDisplayLabel?: string | null;
  ycSessionPriority?: string | null;
  ycWelcomePerk?: string | null;
  ycTravelMode?: string | null;
  ycSplitCount?: number | null;
};

export { PREMIUM_THRESHOLD };

/**
 * Builds a scannable WhatsApp message body for booking flows.
 */
/** Read filter answers from sessionStorage - returns null if not set or SSR */
function readFilterAnswers(): { timing: ClosingTiming; purpose: "professional" | "personal" | "gift" } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(FILTER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { timeline?: string; purpose?: string };
    const timingMap: Record<string, ClosingTiming> = {
      this_week: "urgent",
      this_month: "month",
      just_browsing: "flexible",
    };
    const timing = parsed.timeline ? (timingMap[parsed.timeline] ?? null) : null;
    const purposeRaw = parsed.purpose;
    const purpose = purposeRaw === "professional" || purposeRaw === "personal" || purposeRaw === "gift"
      ? purposeRaw
      : null;
    if (!timing && !purpose) return null;
    return { timing: timing as ClosingTiming, purpose: purpose as "professional" | "personal" | "gift" };
  } catch {
    return null;
  }
}

export function buildBookingWhatsAppBody({
  intent,
  serviceLabel,
  summaryLines,
  contact,
  totalEstimate,
  priceExVat,
  packageLabel,
  customerNeed,
  utmSource,
  timing,
  includeTrustFooter = false,
  bookCategory,
  closerServiceId,
  ycSchedule,
  ycPackage,
  ycIntent,
  ycStep,
  ycForm,
  ycPurpose,
  studioLead,
  ycRoute,
  ycEmotional,
  ycRecordingType,
  ycMobileGeo,
  ycAtmosphere,
  ycCelebrant,
  ycWizardDepth,
  ycScenarioChosen,
  ycScenarioHint,
  ycDeferred,
  ycRecipientHint,
  ycConfigVersion,
  studioCro,
  scheduleDisplayLabel,
  ycSessionPriority,
  ycWelcomePerk,
  ycTravelMode,
  ycSplitCount,
}: BookingWhatsAppBodyOptions): string {
  const resolvedCloser =
    closerServiceId ??
    (bookCategory ? BOOK_CLOSER_SERVICE[bookCategory] : undefined);

  const filterAnswers = readFilterAnswers();
  const resolvedTiming = timing ?? filterAnswers?.timing ?? null;
  const resolvedPurpose = ycPurpose ?? filterAnswers?.purpose ?? null;

  let resolvedPriceExVat = priceExVat;
  if (studioLead && !studioLead.isAmbiguousGroup && studioLead.recorderCount >= 1) {
    resolvedPriceExVat = resolveStudioLeadPriceExVat(studioLead);
  }

  if (studioCro && ycForm === "studio_recording_booking" && resolvedCloser) {
    const scheduleLabel =
      scheduleDisplayLabel?.trim() ||
      buildStudioScheduleDisplayLabel({
        scheduleSummary: summaryLines.find((l) => l.label === "מועד מועדף")?.value,
      });

    return buildStudioSplitWhatsAppBody({
      contact,
      packageLabel: packageLabel ?? serviceLabel,
      scheduleLabel,
      cro: studioCro,
      ycTag: {
        service: resolvedCloser.trim(),
        price: resolvedPriceExVat ?? null,
        source: utmSource?.trim() || "website",
        step: ycStep ?? 3,
        schedule: ycSchedule ?? null,
        package: ycPackage ?? null,
        intent: ycIntent ?? intent ?? null,
        form: ycForm ?? null,
        timing: resolvedTiming,
        purpose: resolvedPurpose,
        adults: studioLead?.adultsCount ?? null,
        children: studioLead?.childrenCount ?? null,
        recorders: studioLead?.recorderCount ?? null,
        scenario: studioLead?.recommendedScenario ?? "pairs",
        ambiguous: studioLead?.isAmbiguousGroup ?? false,
        route: ycRoute ?? null,
        emotional: ycEmotional ?? null,
        recordingType: ycRecordingType ?? null,
        mobileGeo: ycMobileGeo ?? null,
        atmosphere: ycAtmosphere ?? null,
        celebrant: ycCelebrant ?? null,
        wizardDepth: ycWizardDepth ?? null,
        scenarioChosen: ycScenarioChosen ?? null,
        scenarioHint: ycScenarioHint ?? null,
        deferred: ycDeferred ?? null,
        recipientHint: ycRecipientHint ?? null,
        configVersion: ycConfigVersion ?? 3,
        sessionPriority: ycSessionPriority ?? (studioCro.sessionPriority || null),
        welcomePerk: ycWelcomePerk ?? (studioCro.welcomePerk || null),
        travelMode: ycTravelMode ?? (studioCro.travelMode || null),
        splitCount:
          ycSplitCount ??
          (studioCro.splitCostEnabled ? studioCro.splitCostCount : null),
      },
    });
  }

  const progressive = shapeProgressiveBooking({
    intent,
    serviceLabel,
    summaryLines,
    contact,
    totalEstimate,
    priceExVat,
    packageLabel,
    customerNeed,
    utmSource,
    timing,
    includeTrustFooter,
    bookCategory,
    closerServiceId,
    ycSchedule,
    ycPackage,
    ycIntent,
    ycStep,
    ycForm,
    ycPurpose,
    studioLead,
    ycWizardDepth,
    ycScenarioChosen,
    ycScenarioHint,
    ycDeferred,
    ycRecipientHint,
  });

  const extraBlocks: string[] = [];
  let resolvedTotal = totalEstimate;
  const narrativeSummary = progressive?.summaryLines ?? summaryLines;

  if (studioLead) {
    const participants = buildStudioParticipantsBlock(studioLead);
    const pricing = buildStudioPricingEstimateBlock(studioLead);
    extraBlocks.push(...participants, ...pricing);

    const groupInput: GroupMessageInput = {
      leadName: contact.name,
      adultsCount: studioLead.adultsCount,
      childrenCount: studioLead.childrenCount,
      recorderCount: studioLead.recorderCount,
      customerNeed: customerNeed ?? undefined,
      recordingType: studioLead.recordingType,
      scheduleWindow: ycSchedule ?? null,
      studioPackageId: studioLead.packageId ?? null,
      baseExVat: studioLead.baseExVat,
      upgradesExVat: studioLead.upgradesExVat,
      isAmbiguousGroup: studioLead.isAmbiguousGroup,
      selectedUpgrades: studioLead.selectedUpgrades,
      isMotzash: studioLead.isMotzash,
      vatRate: studioLead.vatRate,
      atmosphere: ycAtmosphere ?? undefined,
    };

    if (isGroupBookingLead(groupInput) && !progressive?.skipGroupEnrichment) {
      extraBlocks.push(...buildBookGroupEnrichmentBlock(groupInput));
    }

    if (!studioLead.isAmbiguousGroup && studioLead.recorderCount >= 1) {
      resolvedPriceExVat = resolveStudioLeadPriceExVat(studioLead);
      resolvedTotal = Math.round(resolvedPriceExVat * (1 + (studioLead.vatRate ?? VAT_RATE)));
    }
  }

  return buildClosingMessage({
    serviceLabel,
    contact,
    intent,
    customerNeed,
    packageLabel: packageLabel ?? serviceLabel,
    priceExVat: resolvedPriceExVat,
    totalWithVat: resolvedTotal,
    summaryLines: narrativeSummary,
    source: utmSource,
    timing: resolvedTiming,
    includeTrustFooter: progressive?.includeTrustFooter ?? includeTrustFooter,
    bookCategory,
    progressiveNarrative: progressive?.progressiveNarrative ?? false,
    closerServiceId: resolvedCloser,
    ycStep: ycStep ?? 1,
    ycSchedule,
    ycPackage,
    ycIntent,
    ycForm,
    ycPurpose: resolvedPurpose,
    ycAdults: studioLead?.adultsCount ?? null,
    ycChildren: studioLead?.childrenCount ?? null,
    ycRecorders: studioLead?.recorderCount ?? null,
    ycScenario: studioLead?.recommendedScenario ?? "pairs",
    ycAmbiguous: studioLead?.isAmbiguousGroup ?? false,
    ycRoute,
    ycEmotional,
    ycRecordingType,
    ycMobileGeo,
    ycAtmosphere,
    ycCelebrant,
    ycWizardDepth,
    ycScenarioChosen,
    ycScenarioHint,
    ycDeferred,
    ycRecipientHint,
    ycConfigVersion,
    extraBlocks,
  });
}

/** Builds consult WhatsApp text with optional booking context from the form. */
export function buildConsultWhatsAppText(
  summaryLines: BookingSummaryLine[],
  contact: { name: string; phone: string },
  options?: {
    bookCategory?: BookCategoryId;
    closerServiceId?: string;
    source?: string;
  },
): string {
  const lines: string[] = [
    "שלום, אשמח לייעוץ קצר לפני שבוחרים מסלול ומחיר - 15 דקות יסדרו את זה",
  ];

  if (contact.name.trim() || contact.phone.trim()) {
    lines.push("");
    if (contact.name.trim()) lines.push(`*שם:* ${contact.name.trim()}`);
    if (contact.phone.trim()) lines.push(`*טלפון:* ${contact.phone.trim()}`);
  }

  if (summaryLines.length > 0) {
    lines.push("");
    lines.push("*מה בחרתי עד כה:*");
    for (const { label, value } of summaryLines) {
      lines.push(`${label}: ${value}`);
    }
  }

  const resolvedCloser =
    options?.closerServiceId ??
    (options?.bookCategory ? BOOK_CLOSER_SERVICE[options.bookCategory] : "recording");

  const body = lines.join("\n").trim();
  return appendYcLeadTag(body, {
    service: resolvedCloser,
    source: options?.source ?? "/book",
    step: 1,
    intent: "continue_chat",
    form: "consult_15min",
  });
}

/** Builds a WhatsApp href for the 15-minute consult CTA with booking context. */
export function buildConsultWhatsAppHref(
  summaryLines: BookingSummaryLine[],
  contact: { name: string; phone: string },
  options?: {
    bookCategory?: BookCategoryId;
    closerServiceId?: string;
    source?: string;
  },
): string {
  return buildWhatsAppHref({
    text: buildConsultWhatsAppText(summaryLines, contact, options),
    utm_source: "website",
    utm_campaign: BOOKING_CONSULT_15_MIN.utmCampaign,
  });
}

/**
 * Reads booking context for WhatsApp `source` line - filter answers, UTM, or path.
 */
export function readUtmSource(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const filterRaw = sessionStorage.getItem(FILTER_STORAGE_KEY);
    if (filterRaw) {
      const parsed = JSON.parse(filterRaw) as { timeline?: string; purpose?: string };
      if (parsed.timeline && parsed.purpose) {
        return `/book#studio - ${parsed.purpose} - ${parsed.timeline}`;
      }
    }
    const params = new URLSearchParams(window.location.search);
    const campaign = params.get("utm_campaign");
    if (campaign) return campaign;
    const source = params.get("utm_source");
    if (source) return source;
    if (window.location.hash) return `/book${window.location.hash}`;
    return null;
  } catch {
    return null;
  }
}

/** Helper: derive ex-VAT from total with VAT for message display */
export function exVatFromTotalWithVat(totalWithVat: number): number {
  return Math.round(totalWithVat / (1 + 0.18));
}

export { withVat };
