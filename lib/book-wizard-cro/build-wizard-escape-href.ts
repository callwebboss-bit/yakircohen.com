import { buildBookingWhatsAppBody } from "@/lib/booking-messages";
import { pickProgressiveSummaryLines } from "@/lib/progressive-booking-message";
import { withVat } from "@/lib/data/pricing";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import type { BookingSummaryLine } from "@/lib/booking-messages";
import type { BookCategoryId } from "@/lib/book-url";
import { sanitizeLeadText } from "@/lib/form-validation";

export function buildWizardEscapeHref(opts: {
  category: BookCategoryId;
  serviceLabel: string;
  formId: string;
  summaryLines: readonly BookingSummaryLine[];
  priceExVat: number;
  packageLabel?: string;
  contactName?: string;
  contactPhone?: string;
  ycStep: number;
  utmCampaign?: string;
}): string {
  const lines = pickProgressiveSummaryLines(opts.summaryLines, 4);
  const body = buildBookingWhatsAppBody({
    intent: "continue_chat",
    serviceLabel: sanitizeLeadText(opts.serviceLabel, 120),
    packageLabel: opts.packageLabel ? sanitizeLeadText(opts.packageLabel, 80) : undefined,
    summaryLines: lines,
    contact: {
      name: sanitizeLeadText(opts.contactName ?? "", 60) || "[שם]",
      phone: sanitizeLeadText(opts.contactPhone ?? "", 20) || "[טלפון]",
    },
    priceExVat: opts.priceExVat > 0 ? opts.priceExVat : undefined,
    totalEstimate: opts.priceExVat > 0 ? withVat(opts.priceExVat) : undefined,
    utmSource: `/book#${opts.category}`,
    bookCategory: opts.category,
    ycIntent: "continue_chat",
    ycStep: opts.ycStep,
    ycForm: opts.formId,
  });

  return buildWhatsAppHref({
    text: body,
    utm_source: "website",
    utm_campaign: opts.utmCampaign ?? `${opts.category}_wizard_escape`,
  });
}

/** @deprecated use buildWizardEscapeHref */
export function buildStudioEscapeWhatsAppHref(opts: {
  summaryLines: readonly BookingSummaryLine[];
  priceExVat: number;
  packageLabel?: string;
  contactName?: string;
  contactPhone?: string;
  ycStep: number;
}): string {
  return buildWizardEscapeHref({
    category: "studio",
    serviceLabel: "הקלטה באולפן - טיוטה מהאתר",
    formId: "studio_recording_booking",
    ...opts,
  });
}
