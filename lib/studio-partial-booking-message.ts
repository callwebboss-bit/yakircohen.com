import { buildBookingWhatsAppBody } from "@/lib/booking-messages";
import { pickProgressiveSummaryLines } from "@/lib/progressive-booking-message";
import { withVat } from "@/lib/data/pricing";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import type { BookingSummaryLine } from "@/lib/booking-messages";

export function buildStudioEscapeWhatsAppHref(opts: {
  summaryLines: readonly BookingSummaryLine[];
  priceExVat: number;
  packageLabel?: string;
  contactName?: string;
  contactPhone?: string;
  ycStep: number;
}): string {
  const lines = pickProgressiveSummaryLines(opts.summaryLines, 4);
  const body = buildBookingWhatsAppBody({
    intent: "continue_chat",
    serviceLabel: "הקלטה באולפן — טיוטה מהאתר",
    packageLabel: opts.packageLabel,
    summaryLines: lines,
    contact: {
      name: opts.contactName?.trim() || "[שם]",
      phone: opts.contactPhone?.trim() || "[טלפון]",
    },
    priceExVat: opts.priceExVat > 0 ? opts.priceExVat : undefined,
    totalEstimate: opts.priceExVat > 0 ? withVat(opts.priceExVat) : undefined,
    utmSource: "/book#studio",
    bookCategory: "studio",
    ycIntent: "continue_chat",
    ycStep: opts.ycStep,
    ycForm: "studio_recording_booking",
  });

  return buildWhatsAppHref({
    text: body,
    utm_source: "website",
    utm_campaign: "studio_wizard_escape",
  });
}
