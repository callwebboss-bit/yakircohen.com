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
  buildClosingMessage,
  PREMIUM_THRESHOLD,
  type ClosingIntent,
  type ClosingTiming,
} from "@/lib/whatsapp-closing";

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
};

export { PREMIUM_THRESHOLD };

/**
 * Builds a scannable WhatsApp message body for booking flows.
 */
/** Read filter answers from sessionStorage — returns null if not set or SSR */
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
}: BookingWhatsAppBodyOptions): string {
  const resolvedCloser =
    closerServiceId ??
    (bookCategory ? BOOK_CLOSER_SERVICE[bookCategory] : undefined);

  // Enrich with filter answers if not explicitly provided
  const filterAnswers = readFilterAnswers();
  const resolvedTiming = timing ?? filterAnswers?.timing ?? null;
  const resolvedPurpose = ycPurpose ?? filterAnswers?.purpose ?? null;

  return buildClosingMessage({
    serviceLabel,
    contact,
    intent,
    customerNeed,
    packageLabel: packageLabel ?? serviceLabel,
    priceExVat,
    totalWithVat: totalEstimate,
    summaryLines,
    source: utmSource,
    timing: resolvedTiming,
    includeTrustFooter,
    closerServiceId: resolvedCloser,
    ycStep: ycStep ?? 1,
    ycSchedule,
    ycPackage,
    ycIntent,
    ycForm,
    ycPurpose: resolvedPurpose,
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
        return `/book#studio · ${parsed.purpose} · ${parsed.timeline}`;
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
