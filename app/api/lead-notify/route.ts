import { NextResponse } from "next/server";

const RESEND_API = "https://api.resend.com/emails";

type LeadPayload = {
  formId: string;
  subject: string;
  body: string;
  name?: string;
  phone?: string;
};

function isConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      process.env.LEAD_NOTIFY_EMAIL?.trim(),
  );
}

export async function POST(request: Request) {
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

  if (body.length > 8000) {
    return NextResponse.json({ ok: false, error: "body_too_long" }, { status: 400 });
  }

  const to = process.env.LEAD_NOTIFY_EMAIL!.trim();
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
        payload.name ? `שם: ${payload.name}` : null,
        payload.phone ? `טלפון: ${payload.phone}` : null,
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
