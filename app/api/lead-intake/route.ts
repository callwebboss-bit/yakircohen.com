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
import { captureException } from "@/lib/sentry-capture";
import { ingestLead } from "@/lib/leads/ingest";

const VALID_SERVICE_TAGS = new Set<ServiceTypeTag>([
  "MIX_AND_MASTER",
  "PODCAST_VOICE_CLEANUP",
  "VIDEO_AI_EDIT",
  "NEED_RECOMMENDATION",
]);

type LeadIntakeRequest = BookIntakeCloserPayload & {
  website_verification?: string;
};

/**
 * חסמי אורך על כל שדה שנכנס לגוף המייל.
 *
 * קודם הבקשה עברה דרך /api/lead-notify, ששם חסם 8,000 תווים על הגוף והריץ
 * isLeadSpam על הנושא ועל הגוף. המעבר לקריאה ישירה ל-ingestLead ויתר על שני
 * אלה. buildIntakeEmailBody משרשר את כל השדות לתוך הגוף, ולכן שדה בלי חסם
 * מאפשר לכתוב מגה-בייטים ל-Redis ל-90 יום ולשלוח מייל ענק, בעוד הלקוח מקבל ok.
 */
const FIELD_LIMITS: Record<string, number> = {
  ticket_code: 64,
  user_choice_preset: 120,
  lead_email: 120,
};
const MAX_EMAIL_BODY_CHARS = 8000;

function isValidPayload(body: LeadIntakeRequest): boolean {
  if (!body.ticket_code?.trim() || !body.lead_name?.trim() || !body.lead_phone?.trim()) {
    return false;
  }
  for (const [field, max] of Object.entries(FIELD_LIMITS)) {
    const value = (body as Record<string, unknown>)[field];
    if (typeof value === "string" && value.length > max) return false;
  }
  if (!VALID_SERVICE_TAGS.has(body.service_type_tag)) return false;
  if (body.urgency_flag !== false) return false;
  if (!body.user_choice_preset?.trim()) return false;
  if (typeof body.free_text_description !== "string") return false;
  if (body.free_text_description.length > 1500) return false;
  if (body.file_meta !== undefined) {
    /* body הוא JSON גולמי שהומר בכפייה לטיפוס, ולכן כל גישה לשדה חייבת לבוא
       אחרי בדיקת סוג. קודם חסמי האורך רצו כאן למעלה ו-file_meta:{} הפיל את
       הראוט ל-500 במקום להחזיר 400. */
    const m = body.file_meta as unknown;
    if (typeof m !== "object" || m === null) return false;
    const meta = m as Record<string, unknown>;
    if (typeof meta.name !== "string" || !meta.name.trim()) return false;
    if (typeof meta.mime !== "string" || !meta.mime.trim()) return false;
    if (typeof meta.size_bytes !== "number") return false;
    if (meta.name.length > 200 || meta.mime.length > 100) return false;
    if (meta.size_bytes > 524_288_000) return false;
  }
  return true;
}

/**
 * קליטת הליד ישירות, בלי קפיצת HTTP חזרה לאתר עצמו.
 *
 * הקוד הקודם עשה fetch ל-/api/lead-notify עם Origin מזויף, ותפס שגיאות ב-.catch.
 * שתי בעיות: קפיצת רשת מיותרת שיכולה ליפול על timeout או על cold start, ובעיקר
 * ש-fetch לא נכשל על סטטוס HTTP. תשובת 502 מ-lead-notify (כלומר המייל לא נשלח)
 * לא הפעילה את ה-catch כלל, והליד נחשב כאילו נקלט. כאן sendFailed נבדק במפורש.
 *
 * הבדיקות (honeypot, טלפון, ספאם) כבר רצו למעלה, ולכן אין צורך לשכפל אותן.
 */
async function notifyLead(
  payload: BookIntakeCloserPayload,
  emailBody: string,
  request: Request,
  ip: string,
): Promise<boolean> {
  try {
    const result = await ingestLead({
      formId: "book_intake_wizard",
      subject: `פנייה מהירה - ${payload.ticket_code}`,
      body: emailBody,
      name: payload.lead_name,
      phone: payload.lead_phone,
      request,
      ip,
    });

    if (result.sendFailed) {
      captureException(new Error("lead-intake: lead stored but email send failed"), {
        tags: { route: "lead-intake", channel: "ingest" },
        extra: { leadId: result.leadId, ticket: payload.ticket_code },
      });
      return false;
    }
    return true;
  } catch (err) {
    captureException(err, {
      tags: { route: "lead-intake", channel: "ingest" },
      extra: { ticket: payload.ticket_code },
    });
    return false;
  }
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

  /* אותן שתי בדיקות ש-/api/lead-notify הריץ על הגוף הבנוי, עכשיו כאן */
  const emailBody = buildIntakeEmailBody(payload);
  if (emailBody.length > MAX_EMAIL_BODY_CHARS) {
    return NextResponse.json({ ok: false, error: "body_too_long" }, { status: 400 });
  }
  if (isLeadSpam(emailBody)) {
    return NextResponse.json({ ok: false, error: "rejected" }, { status: 400 });
  }

  const [notified] = await Promise.all([
    notifyLead(payload, emailBody, request, gate.ip),
    fireCloserWebhook(payload),
  ]);

  /* ok נשאר true גם כשההתראה נכשלה: הלקוח ממשיך לוואטסאפ בכל מקרה, וזו עדיין
     הדרך שבה הליד מגיע. notified חושף את הכשל לניטור במקום להעלים אותו. */
  return NextResponse.json({ ok: true, ticket_code: payload.ticket_code, notified });
}
