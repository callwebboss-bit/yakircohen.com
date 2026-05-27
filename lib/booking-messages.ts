/**
 * WhatsApp message builders for booking flows.
 * Uses WhatsApp markdown: *bold*, _italic_.
 * Lead scoring: totalEstimate >= 3000 → premium flag at top.
 */

export type BookingSummaryLine = {
  label: string;
  value: string;
};

export type BookingWhatsAppBodyOptions = {
  /** User intent: continue chat vs. immediate start */
  intent: "continue_chat" | "start_now";
  /** Human-readable service name */
  serviceLabel: string;
  /** Ordered key-value pairs shown in the summary block */
  summaryLines: BookingSummaryLine[];
  contact: { name: string; phone: string };
  /** If provided and >= 3000, injects premium lead flag at top */
  totalEstimate?: number;
  /** utm_source / campaign string appended at bottom for internal tracking */
  utmSource?: string | null;
};

const PREMIUM_THRESHOLD = 3_000;

/** Formats a number as Hebrew locale currency string. */
function formatNis(amount: number): string {
  return `${amount.toLocaleString("he-IL")} ₪`;
}

/**
 * Builds a scannable WhatsApp message body.
 * Caller encodes this with encodeURIComponent before appending to the WA href.
 */
export function buildBookingWhatsAppBody({
  intent,
  serviceLabel,
  summaryLines,
  contact,
  totalEstimate,
  utmSource,
}: BookingWhatsAppBodyOptions): string {
  const lines: string[] = [];

  // Lead scoring flag
  if (totalEstimate !== undefined && totalEstimate >= PREMIUM_THRESHOLD) {
    lines.push("🚨 ליד פרימיום");
    lines.push("");
  }

  // Intent + service
  const intentLabel = intent === "start_now" ? "התחלה מיידית" : "המשך שיחה";
  lines.push(`*כוונה:* ${intentLabel}`);
  lines.push(`*שירות:* ${serviceLabel}`);
  lines.push("");

  // Contact
  lines.push(`*שם:* ${contact.name}`);
  lines.push(`*טלפון:* ${contact.phone}`);

  // Summary
  if (summaryLines.length > 0) {
    lines.push("");
    lines.push("*פרטים:*");
    for (const { label, value } of summaryLines) {
      lines.push(`${label}: ${value}`);
    }
  }

  // Total estimate
  if (totalEstimate !== undefined) {
    lines.push("");
    lines.push(`*סה"כ מוערך:* ${formatNis(totalEstimate)}`);
  }

  // UTM source
  if (utmSource) {
    lines.push("");
    lines.push(`מקור הגעה: ${utmSource}`);
  }

  return lines.join("\n").trim();
}

/**
 * Reads the UTM source from sessionStorage (`ykr_filter`) or the current URL params.
 * Returns null on SSR or when no value is found.
 */
export function readUtmSource(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const fromSession = sessionStorage.getItem("ykr_filter");
    if (fromSession) return fromSession;
    const params = new URLSearchParams(window.location.search);
    return (
      params.get("utm_source") ?? params.get("utm_campaign") ?? null
    );
  } catch {
    return null;
  }
}
