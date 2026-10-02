import { randomUUID } from "node:crypto";
import { CONTACT_EMAIL_INTERNAL } from "@/lib/constants";
import { buildLeadEnrichment, type ClientEnrichmentHints } from "@/lib/leads/enrichment";
import {
  classifyLeadRepeat,
  exactRepeatKey,
  markDelivered,
  UPDATE_SUBJECT_PREFIX,
  type LeadRepeatResult,
} from "@/lib/leads/duplicate";
import { leadDryRunMode } from "@/lib/leads/dry-run";
import { normalizeIlMobile } from "@/lib/leads/format-phone-il";
import { REVIEW_SUBJECT_PREFIX, type LeadSoftFlag } from "@/lib/leads/payload-check";
import { isDurableStoreConfigured } from "@/lib/leads/redis";
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
import {
  defaultLeadFromAddress,
  sendResendEmail,
  type ResendSendInput,
  type ResendSendResult,
} from "@/lib/leads/resend-send";
import { validateEmailOptional } from "@/lib/form-validation";
import { pingAdminHighScore, postAdminWebhookFallback } from "@/lib/leads/admin-alert";
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
  /** סימונים רכים מ-checkLeadNotifyPayload. כשיש, הנושא מקבל "[לבדיקה] ". */
  flags?: LeadSoftFlag[];
  /** מזהה שליחה מהדפדפן. ניסיון חוזר עם אותו מזהה אחרי הצלחה לא יישלח פעמיים. */
  submissionId?: string;
  request: Request;
  ip: string;
};

/**
 * תוצאה מובנית. הראוט עונה 200 רק כש-notified (LF-02, LF-07):
 * - notified: הבעלים קיבל את הליד (Resend קיבל את המייל, או ה-webhook ענה).
 * - stored: הליד נשמר ב-Upstash. false כשאין Upstash או כש-Redis נפל.
 * - duplicate: "repeat" לשליחה זהה שכבר הגיעה, "update" לאותו לקוח ב-24 שעות.
 * - notConfigured: אין RESEND_API_KEY ואין webhook, כלומר אין לאן לשלוח.
 * - followUps: המענה האוטומטי ללקוח. הראוט מריץ אותו ב-after() כדי שהגולש
 *   לא יחכה לשני מיילים נוספים.
 */
export type IngestLeadResult = {
  leadId: string;
  score: number;
  notified: boolean;
  stored: boolean;
  duplicate: false | "repeat" | "update";
  dryRun: boolean;
  notConfigured: boolean;
  followUps?: () => Promise<void>;
};

function leadNotifyEmail(): string {
  return process.env.LEAD_NOTIFY_EMAIL?.trim() || CONTACT_EMAIL_INTERNAL;
}

function isConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && leadNotifyEmail());
}

/** שגיאת Redis נרשמת ללוג ולא עוצרת את המייל לבעלים. */
function logStoreError(step: string, err: unknown): void {
  console.error(
    "[lead-store]",
    JSON.stringify({ step, error: err instanceof Error ? err.message : String(err) }),
  );
}

/** במצב dry-run: בלי Resend, המייל שהיה יוצא נכתב ללוג המקומי. */
async function sendOrDryRun(input: ResendSendInput): Promise<ResendSendResult> {
  const mode = leadDryRunMode();
  if (mode === "off") return sendResendEmail(input);
  console.info(
    "[lead-dry-run]",
    JSON.stringify({ mode, to: input.to, subject: input.subject, text: input.text }),
  );
  return mode === "fail"
    ? { ok: false, status: 599, error: "dry_run_fail" }
    : { ok: true, id: `dry-run-${randomUUID()}` };
}

export async function ingestLead(input: IngestLeadInput): Promise<IngestLeadResult> {
  const leadId = randomUUID();
  const dryRun = leadDryRunMode() !== "off";
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

  const repeatInput = {
    formId: input.formId,
    phone,
    email,
    body: input.body,
    submissionId: input.submissionId,
  };
  let repeat: LeadRepeatResult;
  try {
    repeat = await classifyLeadRepeat(repeatInput, leadId);
  } catch (err) {
    logStoreError("classify", err);
    repeat = { kind: "new", exactKey: exactRepeatKey(repeatInput) };
  }

  /* אותה שליחה בדיוק כבר הגיעה לבעלים (markDelivered נכתב רק אחרי הצלחה).
     זה ניסיון חוזר של דפדפן שלא קיבל את התשובה, ולכן עונים בהצלחה בלי מייל נוסף. */
  if (repeat.kind === "repeat") {
    return {
      leadId: repeat.existingLeadId ?? leadId,
      score,
      notified: true,
      stored: isDurableStoreConfigured(),
      duplicate: "repeat",
      dryRun,
      notConfigured: false,
    };
  }

  const isUpdate = repeat.kind === "update";
  const flags = input.flags ?? [];

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
    /* זיהוי כפילות לעולם לא קובע "spam". עדכון ללקוח קיים הוא ליד חי. LF-03 */
    status: "new",
    enrichment,
    eventDate,
    budgetHint,
    duplicateOf: isUpdate ? repeat.existingLeadId : undefined,
    reviewFlags: flags.length ? flags : undefined,
  };

  let stored = false;
  try {
    await saveLead(lead);
    stored = isDurableStoreConfigured();
  } catch (err) {
    logStoreError("save", err);
  }

  const routing = planAdminRouting(lead);
  const card = buildAdminContextCardHtml(lead, false);
  const serviceHtml = buildServiceAdminBodyHtml(lead);
  const offers = routing.includeAlternativeOffers ? routing.alternativeOffersText : "";
  const textBody = [
    `מקור: ${lead.formId}`,
    isUpdate && lead.duplicateOf ? `עדכון לליד קיים: ${lead.duplicateOf}` : null,
    flags.length ? `לבדיקה: ${flags.join(", ")}` : null,
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

  const subject = `${flags.length ? REVIEW_SUBJECT_PREFIX : ""}${
    isUpdate ? UPDATE_SUBJECT_PREFIX : ""
  }${routing.urgentSubjectPrefix}[יקיר כהן] ${input.subject}`;

  const configured = dryRun || isConfigured();
  let emailed = false;
  if (configured) {
    /* תמיד מנסים לשלוח, גם אם Redis נפל למעלה. LF-07 */
    const adminSend = await sendOrDryRun({
      from: defaultLeadFromAddress(),
      to: [leadNotifyEmail()],
      subject,
      text: textBody,
      html,
    });
    emailed = adminSend.ok;
    if (adminSend.ok && adminSend.id && stored) {
      lead.resendEmailId = adminSend.id;
      try {
        await saveLead(lead);
      } catch (err) {
        logStoreError("save_resend_id", err);
      }
    }
  }

  const webhookOk = !emailed && !dryRun ? await postAdminWebhookFallback(lead) : false;
  const notified = emailed || webhookOk;

  if (notified) {
    try {
      await markDelivered(repeat.exactKey, leadId);
    } catch (err) {
      logStoreError("mark_delivered", err);
    }
  }

  if (emailed && !dryRun && routing.pingAdminWhatsApp) {
    await pingAdminHighScore(lead);
  }

  /* מענה אוטומטי ללקוח, רק לכתובת שעברה את אותו אימות שהטופס מריץ בדפדפן.
     קודם התנאי היה includes("@") בלבד, כלומר כל מחרוזת עם שטרודל גררה שני
     מיילים יוצאים מהדומיין של האתר אל כל כתובת שנשלחה ל-API. הליד עצמו
     נשמר ומגיע לבעלים בכל מקרה, ולכן פנייה אמיתית לא נפגעת: מי שהגיע דרך
     הטופס כבר עבר את אותו validateEmailOptional בצד הלקוח. 16.9.2026.
     בעדכון לליד קיים הלקוח כבר קיבל את המענה, ולא שולחים שוב. */
  const followUps =
    notified && !isUpdate && email && validateEmailOptional(email).ok
      ? async () => {
          const reply = buildAutoReplyText({
            name: lead.name,
            serviceType,
            etaHours: score >= 80 ? 12 : 24,
          });
          await sendOrDryRun({
            from: defaultLeadFromAddress(),
            to: [email],
            subject: reply.subject,
            text: reply.text,
            html: reply.html,
          });

          const guide = buildPreCallGuide(serviceType);
          await sendOrDryRun({
            from: defaultLeadFromAddress(),
            to: [email],
            subject: guide.subject,
            text: guide.text,
            html: guide.html,
          });
        }
      : undefined;

  return {
    leadId,
    score,
    notified,
    stored,
    duplicate: isUpdate ? "update" : false,
    dryRun,
    notConfigured: !configured && !webhookOk,
    followUps,
  };
}
