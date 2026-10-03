import { captureException } from "@/lib/sentry-capture";

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
