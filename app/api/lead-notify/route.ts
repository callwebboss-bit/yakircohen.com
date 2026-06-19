import { NextResponse } from "next/server";
import { CONTACT_EMAIL_INTERNAL } from "@/lib/constants";
import {
  HONEYPOT_FIELD_NAME,
  isLeadSpam,
  sanitizeLeadText,
  validateHoneypot,
  validateIsraeliMobile,
} from "@/lib/form-validation";
import { SITE_URL } from "@/lib/site-url";

const RESEND_API = "https://api.resend.com/emails";

const ALLOWED_ORIGINS = new Set([
  SITE_URL,
  "https://www.yakircohen.com",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
]);

type LeadPayload = {
  formId: string;
  subject: string;
  body: string;
  name?: string;
  phone?: string;
  website_verification?: string;
};

function leadNotifyEmail(): string {
  return process.env.LEAD_NOTIFY_EMAIL?.trim() || CONTACT_EMAIL_INTERNAL;
}

function isConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && leadNotifyEmail());
}

function isAllowedRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (origin) return ALLOWED_ORIGINS.has(origin);
  const referer = request.headers.get("referer");
  if (!referer) return true;
  try {
    return ALLOWED_ORIGINS.has(new URL(referer).origin);
  } catch {
    return false;
  }
}

/** בדיקת תצורה בלי שליחת מייל (לדיבוג אחרי deploy). */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    configured: isConfigured(),
    hasApiKey: Boolean(process.env.RESEND_API_KEY?.trim()),
    notifyEmail: leadNotifyEmail(),
  });
}

export async function POST(request: Request) {
  if (!isAllowedRequest(request)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  if (!isConfigured()) {
    return NextResponse.json({ ok: false, skipped: true }, { status: 200 });
  }

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
  if (
    typeof honeypotValue === "string" &&
    !validateHoneypot(honeypotValue)
  ) {
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

  const to = leadNotifyEmail();
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || "לידים מהאתר <onboarding@resend.dev>";

  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `[יקיר כהן] ${subject}`,
      text: [
        `מקור: ${formId}`,
        payload.name ? `שם: ${sanitizeLeadText(payload.name, 200)}` : null,
        payload.phone ? `טלפון: ${sanitizeLeadText(payload.phone, 20)}` : null,
        "",
        body,
        "",
        "---",
        "נשלח אוטומטית מהאתר (גיבוי לידים). הלקוח גם קיבל קישור לוואטסאפ.",
      ]
        .filter(Boolean)
        .join("\n"),
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("[lead-notify] Resend error", res.status, errText);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
