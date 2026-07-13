import type { LeadRecord } from "@/lib/leads/types";
import { scoreBand } from "@/lib/leads/score";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildAdminContextCardHtml(lead: LeadRecord, isDuplicate: boolean): string {
  const band = scoreBand(lead.score);
  const bandColor =
    band === "high" ? "#16a34a" : band === "low" ? "#ca8a04" : "#2563eb";
  const price = lead.pricingRef?.exVat
    ? `${lead.pricingRef.exVat.toLocaleString("he-IL")} ₪ לפני מע״מ`
    : "—";
  const geo = [lead.enrichment.geo?.city, lead.enrichment.geo?.country]
    .filter(Boolean)
    .join(", ");

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;direction:rtl;text-align:right;">
  <tr>
    <td style="background:#111827;color:#fff;padding:14px 16px;border-radius:12px 12px 0 0;">
      <div style="font-size:12px;opacity:.8;">כרטיס ליד מהיר</div>
      <div style="font-size:22px;font-weight:700;margin-top:4px;">ציון ${lead.score}/100</div>
      <div style="display:inline-block;margin-top:8px;padding:4px 10px;border-radius:999px;background:${bandColor};font-size:12px;font-weight:700;">
        ${band === "high" ? "דחוף" : band === "low" ? "רך" : "רגיל"}
      </div>
      ${isDuplicate ? `<div style="margin-top:8px;font-size:12px;color:#fca5a5;">כפילות אפשרית (24ש)</div>` : ""}
    </td>
  </tr>
  <tr>
    <td style="border:1px solid #e5e7eb;border-top:0;padding:12px 16px;background:#f9fafb;border-radius:0 0 12px 12px;">
      <table width="100%" style="font-size:13px;color:#111827;border-collapse:collapse;">
        <tr><td style="padding:4px 0;color:#6b7280;">שירות</td><td style="padding:4px 0;font-weight:600;">${esc(lead.serviceType)}</td></tr>
        <tr><td style="padding:4px 0;color:#6b7280;">מחיר מחירון</td><td style="padding:4px 0;font-weight:600;">${esc(price)}</td></tr>
        <tr><td style="padding:4px 0;color:#6b7280;">שם</td><td style="padding:4px 0;">${esc(lead.name || "—")}</td></tr>
        <tr><td style="padding:4px 0;color:#6b7280;">טלפון</td><td style="padding:4px 0;">${esc(lead.phone || "—")}</td></tr>
        <tr><td style="padding:4px 0;color:#6b7280;">מכשיר</td><td style="padding:4px 0;">${esc(lead.enrichment.device)}</td></tr>
        <tr><td style="padding:4px 0;color:#6b7280;">מיקום</td><td style="padding:4px 0;">${esc(geo || "—")}</td></tr>
        <tr><td style="padding:4px 0;color:#6b7280;">מקור</td><td style="padding:4px 0;">${esc(lead.enrichment.referrer || lead.enrichment.landingPath || "—")}</td></tr>
        <tr><td style="padding:4px 0;color:#6b7280;">formId</td><td style="padding:4px 0;">${esc(lead.formId)}</td></tr>
      </table>
    </td>
  </tr>
</table>`.trim();
}
