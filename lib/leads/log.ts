import { captureException } from "@/lib/sentry-capture";
import { redactEmails } from "@/lib/leads/resend-events";

/**
 * שורת לוג אחת לכל ליד שלא הגיע לבעלים, כדי שאפשר יהיה לחפש "[lead-fail]"
 * בלוגים של Vercel ולראות מאיזה טופס ולמה. קודם כל ה-400 של lead-notify
 * חזרו בלי שום עקבות (LF-02).
 *
 * בכוונה בלי שם, טלפון או גוף ההודעה: הלוג נשמר אצל צד שלישי.
 */
export type LeadFailureInput = {
  route: "lead-notify" | "lead-intake" | "lead-recover";
  formId: string;
  status: number;
  error: string;
  leadId?: string;
  bodyLength?: number;
};

/**
 * למה המייל לבעלים לא נשלח, כפי ש-Resend ענה (סטטוס וטקסט השגיאה). קודם נשמר
 * רק "not_notified", ואי אפשר היה להבדיל בין מפתח פסול לדומיין לא מאומת.
 * כתובות מייל נמחקות מהטקסט לפני שהוא יוצא לצד שלישי.
 */
export function logLeadEmailSendFailure(input: { formId: string; status: number; error: string }): void {
  const entry = {
    formId: input.formId || "unknown",
    status: input.status,
    error: redactEmails(input.error).slice(0, 300),
  };
  console.error("[lead-email-fail]", JSON.stringify(entry));
  captureException(new Error(`lead-email-fail ${entry.status}`), {
    tags: { route: "lead-email", formId: entry.formId, status: String(entry.status) },
    extra: entry,
  });
}

/** המייל לבעלים חזר או נחסם אחרי שנשלח (webhook של Resend). בלי פרטי לקוח */
export function logLeadDeliveryProblem(input: { leadId: string; formId: string; type: string }): void {
  console.error("[lead-delivery]", JSON.stringify(input));
  captureException(new Error(`lead-delivery ${input.type}`), {
    tags: { route: "resend-webhook", event: input.type, formId: input.formId || "unknown" },
    extra: input,
  });
}

export function logLeadFailure(input: LeadFailureInput): void {
  const entry = {
    route: input.route,
    formId: input.formId || "unknown",
    status: input.status,
    error: input.error,
    ...(input.leadId ? { leadId: input.leadId } : {}),
    ...(typeof input.bodyLength === "number" ? { bodyLength: input.bodyLength } : {}),
  };
  console.error("[lead-fail]", JSON.stringify(entry));
  captureException(new Error(`lead-fail ${entry.route} ${entry.status} ${entry.error}`), {
    tags: { route: entry.route, formId: entry.formId, status: String(entry.status) },
    extra: entry,
  });
}
