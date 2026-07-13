import { NextResponse } from "next/server";
import {
  HONEYPOT_FIELD_NAME,
  isLeadSpam,
  sanitizeLeadText,
  validateHoneypot,
  validateIsraeliMobile,
} from "@/lib/form-validation";
import { guardPublicMutation } from "@/lib/api-guard";
import { captureException } from "@/lib/sentry-capture";
import { ingestLead } from "@/lib/leads/ingest";
import type { LeadIngestClientMeta, ServiceType } from "@/lib/leads/types";

type LeadPayload = {
  formId: string;
  subject: string;
  body: string;
  name?: string;
  phone?: string;
  email?: string;
  website_verification?: string;
  serviceType?: ServiceType;
  eventDate?: string;
  budgetHint?: number;
  pricingRef?: LeadIngestClientMeta["pricingRef"];
  clientMeta?: LeadIngestClientMeta;
};

/** בדיקת תצורה בלי שליחת מייל (לדיבוג אחרי deploy). */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    configured: Boolean(process.env.RESEND_API_KEY?.trim()),
    hasApiKey: Boolean(process.env.RESEND_API_KEY?.trim()),
    intelligence: true,
  });
}

export async function POST(request: Request) {
  const gate = await guardPublicMutation(request, {
    bucket: "lead-notify",
    max: 8,
  });
  if (!gate.ok) return gate.response;

  let payload: LeadPayload;
  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const { formId, subject, body } = payload;
  if (!formId?.trim() || !subject?.trim() || !body?.trim()) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const honeypotValue =
    payload.website_verification ??
    (payload as Record<string, unknown>)[HONEYPOT_FIELD_NAME];
  if (typeof honeypotValue === "string" && !validateHoneypot(honeypotValue)) {
    return NextResponse.json({ ok: true });
  }

  if (!/^[a-z][a-z0-9_]{2,63}$/.test(formId.trim())) {
    return NextResponse.json({ ok: false, error: "invalid_form" }, { status: 400 });
  }

  if (isLeadSpam(subject) || isLeadSpam(body)) {
    return NextResponse.json({ ok: false, error: "rejected" }, { status: 400 });
  }

  if (payload.phone?.trim()) {
    const phoneR = validateIsraeliMobile(payload.phone);
    if (!phoneR.ok) {
      return NextResponse.json({ ok: false, error: "invalid_phone" }, { status: 400 });
    }
  }

  if (body.length > 8000) {
    return NextResponse.json({ ok: false, error: "body_too_long" }, { status: 400 });
  }

  try {
    const result = await ingestLead({
      formId: formId.trim(),
      subject: subject.trim(),
      body,
      name: payload.name ? sanitizeLeadText(payload.name, 200) : undefined,
      phone: payload.phone?.trim(),
      email: payload.email?.trim() || payload.clientMeta?.email,
      serviceType: payload.serviceType || payload.clientMeta?.serviceType,
      eventDate: payload.eventDate || payload.clientMeta?.eventDate,
      budgetHint: payload.budgetHint ?? payload.clientMeta?.budgetHint,
      pricingRef: payload.pricingRef || payload.clientMeta?.pricingRef,
      clientMeta: payload.clientMeta,
      request,
      ip: gate.ip,
    });

    if (result.sendFailed) {
      return NextResponse.json(
        {
          ok: false,
          error: "send_failed",
          leadId: result.leadId,
          score: result.score,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      leadId: result.leadId,
      score: result.score,
      duplicate: result.duplicate,
      skipped: result.skipped,
    });
  } catch (err) {
    captureException(err, {
      tags: { route: "lead-notify", channel: "ingest" },
      extra: { formId },
    });
    return NextResponse.json({ ok: false, error: "ingest_failed" }, { status: 500 });
  }
}
