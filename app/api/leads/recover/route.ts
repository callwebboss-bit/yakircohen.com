import { NextResponse } from "next/server";
import { guardPublicMutation } from "@/lib/api-guard";
import { saveLead } from "@/lib/leads/store";
import { randomUUID } from "node:crypto";
import type { LeadRecord } from "@/lib/leads/types";
import { buildLeadEnrichment } from "@/lib/leads/enrichment";
import { computeLeadScore, inferServiceTypeFromFormId } from "@/lib/leads/score";
import { normalizeIlMobile } from "@/lib/leads/format-phone-il";
import { checkDraftRepeat } from "@/lib/leads/duplicate";
import { logLeadFailure } from "@/lib/leads/log";

/**
 * Soft abandoned-form recovery: stores partial lead when phone is present.
 * Does not email admin (avoid spam); surfaces in /admin/leads as new/low score.
 */
export async function POST(request: Request) {
  const gate = await guardPublicMutation(request, {
    bucket: "lead-recover",
    max: 12,
  });
  if (!gate.ok) {
    logLeadFailure({
      route: "lead-recover",
      formId: "unknown",
      status: gate.response.status,
      error: "gate",
    });
    return gate.response;
  }

  let body: {
    formId?: string;
    name?: string;
    phone?: string;
    email?: string;
    draft?: string;
    serviceType?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    logLeadFailure({ route: "lead-recover", formId: "unknown", status: 400, error: "invalid_json" });
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const phone = body.phone ? normalizeIlMobile(body.phone) : null;
  if (!phone) {
    logLeadFailure({
      route: "lead-recover",
      formId: typeof body.formId === "string" ? body.formId.slice(0, 64) : "unknown",
      status: 400,
      error: "phone_required",
    });
    return NextResponse.json({ ok: false, error: "phone_required" }, { status: 400 });
  }

  const formId = (body.formId || "abandoned_form").replace(/[^a-z0-9_]/gi, "_").slice(0, 64);
  const leadId = randomUUID();
  const enrichment = buildLeadEnrichment(request, gate.ip, {});
  const serviceType = inferServiceTypeFromFormId(formId);
  const draftBody = (body.draft || "").slice(0, 4000);

  const lead: LeadRecord = {
    id: leadId,
    createdAt: new Date().toISOString(),
    formId,
    serviceType,
    name: body.name?.slice(0, 200),
    phone,
    email: body.email?.slice(0, 200),
    subject: `טיוטה נטושה - ${formId}`,
    body: draftBody || "טיוטת טופס נשמרה (לא הושלמה).",
    score: computeLeadScore({
      name: body.name,
      phone,
      email: body.email,
      body: draftBody,
      serviceType,
      enrichment,
    }),
    status: "new",
    enrichment,
  };

  /* טיוטה חוזרת מאותו טלפון אינה ליד חדש.
     הנקודה הזו נקראת אוטומטית מהטופס בכל פעם שגולש נוטש, ועד עכשיו כל
     קריאה יצרה רשומה חדשה בלי שום בדיקה. במגבלה של 12 בדקה לכל כתובת,
     זה 500 רשומות תוך 42 דקות, ו-/admin/leads מציג רק 150 אחרונות: פניות
     אמיתיות נדחקות מהתצוגה של הבעלים. ההערה שהייתה כאן תיארה בדיוק את
     הבדיקה הזו, והשורה הבאה אחריה שמרה בלעדיה.
     הבדיקה רצה במרחב מפתחות משלה (lead:draft:*) ולא כותבת את מפתח הטלפון של
     הלידים, כי אחרת ההזמנה המלאה שבאה אחרי הטיוטה סומנה ככפולה ולא נשלחה
     לבעלים. LF-03 */
  try {
    const dup = await checkDraftRepeat(phone, formId, leadId);
    if (dup.isRepeat) {
      return NextResponse.json({ ok: true, leadId: dup.existingLeadId, duplicate: true });
    }
    await saveLead(lead);
  } catch (err) {
    logLeadFailure({
      route: "lead-recover",
      formId,
      status: 500,
      error: err instanceof Error ? err.message.slice(0, 80) : "store_failed",
    });
    return NextResponse.json({ ok: false, error: "store_failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, leadId });
}
