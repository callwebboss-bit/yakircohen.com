/**
 * Progressive WhatsApp narrative - קצר יותר ל-quick/standard, מלא ל-full.
 */

import type { BookingSummaryLine, BookingWhatsAppBodyOptions } from "@/lib/booking-messages";
import type { ClosingIntent } from "@/lib/whatsapp-closing";

const PROGRESSIVE_PRIORITY_LABELS = [
  "סוג",
  "מסלול",
  "מקליטים",
  "מועד מועדף",
  "שיר",
  "שם החוגג/ת",
  "אווירה",
] as const;

export function shouldUseProgressiveNarrative(
  wizardDepth?: "quick" | "standard" | "full" | null,
): boolean {
  return wizardDepth === "quick" || wizardDepth === "standard";
}

export function pickProgressiveSummaryLines(
  lines: readonly BookingSummaryLine[],
  max = 3,
): BookingSummaryLine[] {
  const picked: BookingSummaryLine[] = [];
  for (const label of PROGRESSIVE_PRIORITY_LABELS) {
    const row = lines.find((l) => l.label === label);
    if (row?.value?.trim()) picked.push(row);
    if (picked.length >= max) break;
  }
  if (picked.length < max) {
    for (const row of lines) {
      if (picked.some((p) => p.label === row.label)) continue;
      if (!row.value?.trim()) continue;
      picked.push(row);
      if (picked.length >= max) break;
    }
  }
  return picked;
}

export function progressiveIntentLine(intent: ClosingIntent): string {
  return intent === "start_now"
    ? "מוכן/ה להתחיל - נשמח לסגור מועד"
    : "רק בודק/ת - נשמח להמשיך בוואטסאפ בלי לחץ";
}

export function shouldIncludeGroupEnrichment(
  wizardDepth: BookingWhatsAppBodyOptions["ycWizardDepth"],
  recorders: number,
): boolean {
  if (wizardDepth === "quick" && recorders < 8) return false;
  return recorders >= 2;
}

export type ProgressiveBookingShape = {
  progressiveNarrative: boolean;
  summaryLines: BookingSummaryLine[];
  includeTrustFooter: boolean;
  skipGroupEnrichment: boolean;
};

export function shapeProgressiveBooking(
  opts: BookingWhatsAppBodyOptions,
): ProgressiveBookingShape | null {
  if (!shouldUseProgressiveNarrative(opts.ycWizardDepth)) return null;
  const recorders = opts.studioLead?.recorderCount ?? 0;
  return {
    progressiveNarrative: true,
    summaryLines: pickProgressiveSummaryLines(
      opts.summaryLines,
      opts.ycWizardDepth === "quick" ? 3 : 4,
    ),
    includeTrustFooter: opts.ycWizardDepth === "full" ? !!opts.includeTrustFooter : false,
    skipGroupEnrichment: !shouldIncludeGroupEnrichment(opts.ycWizardDepth, recorders),
  };
}
