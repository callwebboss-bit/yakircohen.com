import { randomUUID } from "node:crypto";
import { CONTACT_EMAIL_INTERNAL } from "@/lib/constants";
import { buildLeadEnrichment, type ClientEnrichmentHints } from "@/lib/leads/enrichment";
import { checkAndMarkDuplicate } from "@/lib/leads/duplicate";
import { normalizeIlMobile } from "@/lib/leads/format-phone-il";
import { planAdminRouting } from "@/lib/leads/routing";
import {
  computeLeadScore,
  inferServiceTypeFromFormId,
} from "@/lib/leads/score";
import { saveLead } from "@/lib/leads/store";
import { buildAdminContextCardHtml } from "@/lib/leads/templates/admin-context-card";
import { buildAutoReplyText } from "@/lib/leads/templates/auto-reply";
import { buildPreCallGuide } from "@/lib/leads/templates/pre-call-guide";
import { buildServiceAdminBodyHtml } from "@/lib/leads/templates/by-service";
import { defaultLeadFromAddress, sendResendEmail } from "@/lib/leads/resend-send";
import { pingAdminHighScore } from "@/lib/leads/admin-alert";
import type {
  LeadIngestClientMeta,
  LeadPricingRef,
  LeadRecord,
  ServiceType,
} from "@/lib/leads/types";

export type IngestLeadInput = {
  formId: string;
  subject: string;
  body: string;
  name?: string;
  phone?: string;
  email?: string;
  serviceType?: ServiceType;
  eventDate?: string;
  budgetHint?: number;
  pricingRef?: LeadPricingRef;
  clientMeta?: ClientEnrichmentHints & LeadIngestClientMeta;
  request: Request;
  ip: string;
};

export type IngestLeadResult = {
  ok: boolean;
  leadId: string;
  score: number;
  duplicate: boolean;
  skipped?: boolean;
  sendFailed?: boolean;
};

function leadNotifyEmail(): string {
  return process.env.LEAD_NOTIFY_EMAIL?.trim() || CONTACT_EMAIL_INTERNAL;
}

function isConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && leadNotifyEmail());
}

export async function ingestLead(input: IngestLeadInput): Promise<IngestLeadResult> {
  const leadId = randomUUID();
  const phone = input.phone ? normalizeIlMobile(input.phone) || input.phone.trim() : undefined;
  const email =
    input.email?.trim() ||
    input.clientMeta?.email?.trim() ||
    undefined;
  const serviceType =
    input.serviceType ||
    input.clientMeta?.serviceType ||
    inferServiceTypeFromFormId(input.formId);

  const enrichment = buildLeadEnrichment(input.request, input.ip, {
    referrer: input.clientMeta?.referrer,
    landingPath: input.clientMeta?.landingPath,
    sessionSeconds: input.clientMeta?.sessionSeconds,
    utm: input.clientMeta?.utm,
  });

  const pricingRef = input.pricingRef || input.clientMeta?.pricingRef;
  const eventDate = input.eventDate || input.clientMeta?.eventDate;
  const budgetHint = input.budgetHint ?? input.clientMeta?.budgetHint;

  const score = computeLeadScore({
    name: input.name,
    phone,
    email,
    body: input.body,
    serviceType,
    eventDate,
    budgetHint,
    pricingRefExVat: pricingRef?.exVat,
    enrichment,
  });

  const dup = await checkAndMarkDuplicate(
    { phone, email, ipHash: enrichment.ipHash, formId: input.formId },
    leadId,
  );

  const lead: LeadRecord = {
    id: leadId,
    createdAt: new Date().toISOString(),
    formId: input.formId,
    serviceType,
    name: input.name?.trim(),
    phone,
    email,
    subject: input.subject,
    body: input.body,
    pricingRef,
    score,
    status: dup.isDuplicate ? "spam" : "new",
    enrichment,
    eventDate,
    budgetHint,
    duplicateOf: dup.existingLeadId,
  };

  await saveLead(lead);

  if (!isConfigured()) {
    return { ok: true, leadId, score, duplicate: dup.isDuplicate, skipped: true };
  }

  if (dup.isDuplicate) {
    // Persist but skip noisy second admin email
    return { ok: true, leadId, score, duplicate: true };
  }

  const routing = planAdminRouting(lead);
  const card = buildAdminContextCardHtml(lead, false);
  const serviceHtml = buildServiceAdminBodyHtml(lead);
  const offers = routing.includeAlternativeOffers ? routing.alternativeOffersText : "";
  const textBody = [
    `מקור: ${lead.formId}`,
    lead.name ? `שם: ${lead.name}` : null,
    lead.phone ? `טלפון: ${lead.phone}` : null,
    lead.email ? `אימייל: ${lead.email}` : null,
    `ציון: ${lead.score}`,
    "",
    lead.body,
    offers,
    "",
    "---",
    "נשלח אוטומטית מהאתר (גיבוי לידים). הלקוח גם קיבל קישור לוואטסאפ.",
  ]
    .filter(Boolean)
    .join("\n");

  const html = `${card}${serviceHtml}${
    offers
      ? `<pre style="font-family:Arial;direction:rtl;white-space:pre-wrap;">${offers.replace(/</g, "&lt;")}</pre>`
      : ""
  }`;

  const adminSend = await sendResendEmail({
    from: defaultLeadFromAddress(),
    to: [leadNotifyEmail()],
    subject: `${routing.urgentSubjectPrefix}[יקיר כהן] ${input.subject}`,
    text: textBody,
    html,
  });

  if (adminSend.ok && adminSend.id) {
    lead.resendEmailId = adminSend.id;
    await saveLead(lead);
  }

  if (routing.pingAdminWhatsApp) {
    await pingAdminHighScore(lead);
  }

  // Optional client auto-reply + pre-call guide
  if (email && email.includes("@")) {
    const reply = buildAutoReplyText({
      name: lead.name,
      serviceType,
      etaHours: score >= 80 ? 12 : 24,
    });
    await sendResendEmail({
      from: defaultLeadFromAddress(),
      to: [email],
      subject: reply.subject,
      text: reply.text,
      html: reply.html,
    });

    const guide = buildPreCallGuide(serviceType);
    await sendResendEmail({
      from: defaultLeadFromAddress(),
      to: [email],
      subject: guide.subject,
      text: guide.text,
      html: guide.html,
    });
  }

  return {
    ok: adminSend.ok || Boolean(adminSend.status === 0),
    leadId,
    score,
    duplicate: false,
    sendFailed: !adminSend.ok && adminSend.status !== 0,
  };
}
