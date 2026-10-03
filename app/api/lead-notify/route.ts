import { after, NextResponse } from "next/server";
import { sanitizeLeadText } from "@/lib/form-validation";
import { guardPublicMutation } from "@/lib/api-guard";
import { captureException } from "@/lib/sentry-capture";
import { parseLeadContactChannel } from "@/lib/leads/contact-channel";
import { ingestLead } from "@/lib/leads/ingest";
import { logLeadFailure } from "@/lib/leads/log";
import { checkLeadNotifyPayload, fitLeadBody } from "@/lib/leads/payload-check";
import type { LeadIngestClientMeta, ServiceType } from "@/lib/leads/types";

type LeadPayload = {
  formId: string;
  subject: string;
  body: string;
  name?: string;
  phone?: string;
  email?: string;
  website_verification?: string;
  submissionId?: string;
  contactChannel?: unknown;
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

function formIdOf(payload: unknown): string {
  const v = (payload as { formId?: unknown } | null)?.formId;
  return typeof v === "string" && v.trim() ? v.trim().slice(0, 64) : "unknown";
}

/**
 * חוזה התשובה (LF-02, LF-07): 200 רק כשהבעלים קיבל את הליד.
 * כל תשובה אחרת נרשמת ב-"[lead-fail]" עם ה-formId, והדפדפן מציג מסך גיבוי
 * עם וואטסאפ וטלפון במקום "נשלח בהצלחה".
 */
export async function POST(request: Request) {
  const gate = await guardPublicMutation(request, {
    bucket: "lead-notify",
    max: 8,
  });
  if (!gate.ok) {
    logLeadFailure({
      route: "lead-notify",
      formId: "unknown",
      status: gate.response.status,
      error: "gate",
    });
    return gate.response;
  }

  let payload: LeadPayload;
  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    logLeadFailure({ route: "lead-notify", formId: "unknown", status: 400, error: "invalid_json" });
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  /* דפדפן עם JS ישן שולח את שורת הקישור המקומי גם כשהגוף ארוך מדי */
  if (payload && typeof payload.body === "string") {
    payload.body = fitLeadBody(payload.body);
  }
  const check = checkLeadNotifyPayload(payload ?? {});
  if (check.kind === "honeypot") {
    return NextResponse.json({ ok: true });
  }
  if (check.kind === "reject") {
    logLeadFailure({
      route: "lead-notify",
      formId: formIdOf(payload),
      status: 400,
      error: check.error,
      bodyLength: typeof payload?.body === "string" ? payload.body.length : undefined,
    });
    return NextResponse.json({ ok: false, error: check.error }, { status: 400 });
  }

  const formId = payload.formId.trim();
  try {
    const result = await ingestLead({
      formId,
      subject: payload.subject.trim(),
      body: payload.body,
      name: payload.name ? sanitizeLeadText(payload.name, 200) : undefined,
      phone: payload.phone?.trim(),
      email: payload.email?.trim() || payload.clientMeta?.email,
      serviceType: payload.serviceType || payload.clientMeta?.serviceType,
      eventDate: payload.eventDate || payload.clientMeta?.eventDate,
      budgetHint: payload.budgetHint ?? payload.clientMeta?.budgetHint,
      pricingRef: payload.pricingRef || payload.clientMeta?.pricingRef,
      clientMeta: payload.clientMeta,
      flags: check.flags,
      contactChannel: parseLeadContactChannel(payload.contactChannel),
      submissionId:
        typeof payload.submissionId === "string"
          ? payload.submissionId.trim().slice(0, 64) || undefined
          : undefined,
      request,
      ip: gate.ip,
    });

    if (result.followUps) {
      /* המענה ללקוח אחרי שהתשובה כבר יצאה. after() מתועד ל-Route Handlers
         ב-node_modules/next/dist/docs/01-app/03-api-reference/04-functions/after.md */
      const followUps = result.followUps;
      after(async () => {
        try {
          await followUps();
        } catch (err) {
          captureException(err, { tags: { route: "lead-notify", channel: "follow-ups" } });
        }
      });
    }

    if (!result.notified) {
      const status = result.notConfigured ? 503 : 502;
      const error = result.notConfigured ? "not_configured" : "not_notified";
      logLeadFailure({
        route: "lead-notify",
        formId,
        status,
        error,
        leadId: result.leadId,
        bodyLength: payload.body.length,
      });
      return NextResponse.json(
        { ok: false, error, leadId: result.leadId, stored: result.stored },
        { status },
      );
    }

    return NextResponse.json({
      ok: true,
      leadId: result.leadId,
      score: result.score,
      ...(result.duplicate ? { duplicate: result.duplicate } : {}),
      ...(result.dryRun ? { dryRun: true } : {}),
    });
  } catch (err) {
    captureException(err, {
      tags: { route: "lead-notify", channel: "ingest" },
      extra: { formId },
    });
    logLeadFailure({ route: "lead-notify", formId, status: 500, error: "ingest_failed" });
    return NextResponse.json({ ok: false, error: "ingest_failed" }, { status: 500 });
  }
}
