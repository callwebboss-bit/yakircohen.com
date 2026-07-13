import type { LeadRecord } from "@/lib/leads/types";
import { defaultLeadFromAddress, sendResendEmail } from "@/lib/leads/resend-send";
import { CONTACT_EMAIL_INTERNAL } from "@/lib/constants";

/**
 * High-score admin ping.
 * - If ADMIN_WHATSAPP_ALERT is an https URL → POST JSON webhook
 * - Otherwise → short urgent email nudge (subject already marked דחוף on main mail)
 */
export async function pingAdminHighScore(lead: LeadRecord): Promise<void> {
  const alert = process.env.ADMIN_WHATSAPP_ALERT?.trim();
  if (!alert) return;

  const payload = {
    type: "high_score_lead",
    score: lead.score,
    name: lead.name,
    phone: lead.phone,
    serviceType: lead.serviceType,
    subject: lead.subject,
    leadId: lead.id,
    waHint: lead.phone
      ? `https://wa.me/972${lead.phone.replace(/^0/, "").replace(/\D/g, "")}`
      : undefined,
  };

  if (/^https?:\/\//i.test(alert)) {
    try {
      await fetch(alert, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
    } catch (err) {
      console.error("[leads] admin WA webhook failed", err);
    }
    return;
  }

  const to = process.env.LEAD_NOTIFY_EMAIL?.trim() || CONTACT_EMAIL_INTERNAL;
  await sendResendEmail({
    from: defaultLeadFromAddress(),
    to: [to],
    subject: `[פינג דחוף] ציון ${lead.score} — ${lead.name || lead.phone || lead.formId}`,
    text: [
      "ליד בציון גבוה — לטפל עכשיו.",
      `ציון: ${lead.score}`,
      `שם: ${lead.name || "—"}`,
      `טלפון: ${lead.phone || "—"}`,
      `שירות: ${lead.serviceType}`,
      payload.waHint ? `וואטסאפ ללקוח: ${payload.waHint}` : null,
      "",
      lead.body.slice(0, 1500),
    ]
      .filter(Boolean)
      .join("\n"),
  });
}
