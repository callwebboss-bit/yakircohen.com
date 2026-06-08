/**
 * WhatsApp message builders for booking flows.
 * Delegates to whatsapp-closing.ts for unified lead structure.
 */

import { BOOKING_CONSULT_15_MIN } from "@/lib/data/booking-shared";
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
};

export { PREMIUM_THRESHOLD };

/**
 * Builds a scannable WhatsApp message body for booking flows.
 */
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
}: BookingWhatsAppBodyOptions): string {
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
    timing,
    includeTrustFooter,
  });
}

/** Builds consult WhatsApp text with optional booking context from the form. */
export function buildConsultWhatsAppText(
  summaryLines: BookingSummaryLine[],
  contact: { name: string; phone: string },
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

  return lines.join("\n").trim();
}

/** Builds a WhatsApp href for the 15-minute consult CTA with booking context. */
export function buildConsultWhatsAppHref(
  summaryLines: BookingSummaryLine[],
  contact: { name: string; phone: string },
): string {
  return buildWhatsAppHref({
    text: buildConsultWhatsAppText(summaryLines, contact),
    utm_source: "website",
    utm_campaign: BOOKING_CONSULT_15_MIN.utmCampaign,
  });
}

/**
 * Reads booking context for WhatsApp `source` line — filter answers, UTM, or path.
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
