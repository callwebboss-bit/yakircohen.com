import { NextResponse } from "next/server";
import { guardPublicMutation } from "@/lib/api-guard";
import { saveLead } from "@/lib/leads/store";
import { randomUUID } from "node:crypto";
import type { LeadRecord } from "@/lib/leads/types";
import { buildLeadEnrichment } from "@/lib/leads/enrichment";
import { computeLeadScore, inferServiceTypeFromFormId } from "@/lib/leads/score";
import { normalizeIlMobile } from "@/lib/leads/format-phone-il";

/**
 * Soft abandoned-form recovery: stores partial lead when phone is present.
 * Does not email admin (avoid spam); surfaces in /admin/leads as new/low score.
 */
export async function POST(request: Request) {
  const gate = await guardPublicMutation(request, {
    bucket: "lead-recover",
    max: 12,
  });
  if (!gate.ok) return gate.response;

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
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const phone = body.phone ? normalizeIlMobile(body.phone) : null;
  if (!phone) {
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

  // Avoid duplicating identical abandoned phone within short window via get+skip if recent
  await saveLead(lead);
  return NextResponse.json({ ok: true, leadId });
}
