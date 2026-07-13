import { NextResponse } from "next/server";
import { listLeadsNeedingFollowUp, updateLead } from "@/lib/leads/store";
import { defaultLeadFromAddress, sendResendEmail } from "@/lib/leads/resend-send";
import { CONTACT_EMAIL_INTERNAL } from "@/lib/constants";

export const dynamic = "force-dynamic";

function authorize(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return process.env.NODE_ENV !== "production";
  const auth = request.headers.get("authorization")?.trim();
  return auth === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const stale = await listLeadsNeedingFollowUp(24 * 60 * 60 * 1000);
  const to = process.env.LEAD_NOTIFY_EMAIL?.trim() || CONTACT_EMAIL_INTERNAL;
  let sent = 0;

  for (const lead of stale.slice(0, 20)) {
    const result = await sendResendEmail({
      from: defaultLeadFromAddress(),
      to: [to],
      subject: `[תזכורת 24ש] ליד לא נפתח — ${lead.subject}`,
      text: [
        `ליד ${lead.id} נוצר ב-${lead.createdAt}`,
        `ציון: ${lead.score}`,
        `שם: ${lead.name || "—"}`,
        `טלפון: ${lead.phone || "—"}`,
        "",
        lead.body,
      ].join("\n"),
    });
    if (result.ok) {
      await updateLead(lead.id, { followUpSentAt: new Date().toISOString() });
      sent += 1;
    }
  }

  return NextResponse.json({ ok: true, candidates: stale.length, sent });
}
