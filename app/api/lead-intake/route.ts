import { NextResponse } from "next/server";
import {
  buildIntakeEmailBody,
  type BookIntakeCloserPayload,
} from "@/lib/book-intake/build-payload";
import { fireCloserWebhook } from "@/lib/closer-webhook";
import type { ServiceTypeTag } from "@/lib/book-intake/presets";
import {
  HONEYPOT_FIELD_NAME,
  isLeadSpam,
  sanitizeLeadText,
  validateHoneypot,
  validateIsraeliMobile,
} from "@/lib/form-validation";
import { guardPublicMutation } from "@/lib/api-guard";
import { SITE_URL } from "@/lib/site-url";

const VALID_SERVICE_TAGS = new Set<ServiceTypeTag>([
  "MIX_AND_MASTER",
  "PODCAST_VOICE_CLEANUP",
  "VIDEO_AI_EDIT",
  "NEED_RECOMMENDATION",
]);

type LeadIntakeRequest = BookIntakeCloserPayload & {
  website_verification?: string;
};

function isValidPayload(body: LeadIntakeRequest): boolean {
  if (!body.ticket_code?.trim() || !body.lead_name?.trim() || !body.lead_phone?.trim()) {
    return false;
  }
  if (!VALID_SERVICE_TAGS.has(body.service_type_tag)) return false;
  if (body.urgency_flag !== false) return false;
  if (!body.user_choice_preset?.trim()) return false;
  if (typeof body.free_text_description !== "string") return false;
  if (body.free_text_description.length > 1500) return false;
  if (body.file_meta) {
    const m = body.file_meta;
    if (!m.name?.trim() || typeof m.size_bytes !== "number" || !m.mime?.trim()) {
      return false;
    }
    if (m.size_bytes > 524_288_000) return false;
  }
  return true;
}

async function proxyLeadNotify(
  payload: BookIntakeCloserPayload,
  honeypot: string | undefined,
): Promise<void> {
  const origin =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : SITE_URL;

  await fetch(`${origin}/api/lead-notify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
    },
    body: JSON.stringify({
      formId: "book_intake_wizard",
      subject: `פנייה מהירה - ${payload.ticket_code}`,
      body: buildIntakeEmailBody(payload),
      name: payload.lead_name,
      phone: payload.lead_phone,
      website_verification: honeypot,
    }),
  }).catch((err) => {
    console.error("[lead-intake] lead-notify proxy failed", err);
  });
}

export async function POST(request: Request) {
  const gate = await guardPublicMutation(request, {
    bucket: "lead-intake",
    max: 8,
  });
  if (!gate.ok) return gate.response;

  let body: LeadIntakeRequest;
  try {
    body = (await request.json()) as LeadIntakeRequest;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const honeypotValue =
    body.website_verification ??
    (body as Record<string, unknown>)[HONEYPOT_FIELD_NAME];
  if (typeof honeypotValue === "string" && !validateHoneypot(honeypotValue)) {
    return NextResponse.json({ ok: true });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const phoneR = validateIsraeliMobile(body.lead_phone);
  if (!phoneR.ok) {
    return NextResponse.json({ ok: false, error: "invalid_phone" }, { status: 400 });
  }

  const payload: BookIntakeCloserPayload = {
    ...body,
    lead_name: sanitizeLeadText(body.lead_name, 60),
    lead_phone: phoneR.normalizedPhone ?? body.lead_phone.trim(),
    free_text_description: sanitizeLeadText(body.free_text_description, 1500),
    urgency_flag: false,
  };

  if (isLeadSpam(payload.lead_name) || isLeadSpam(payload.free_text_description)) {
    return NextResponse.json({ ok: false, error: "rejected" }, { status: 400 });
  }

  await Promise.all([
    proxyLeadNotify(payload, typeof honeypotValue === "string" ? honeypotValue : undefined),
    fireCloserWebhook(payload),
  ]);

  return NextResponse.json({ ok: true, ticket_code: payload.ticket_code });
}
