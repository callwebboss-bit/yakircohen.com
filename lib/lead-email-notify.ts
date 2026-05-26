/**
 * גיבוי מייל ללידים (אופציונלי — דורש RESEND_API_KEY + LEAD_NOTIFY_EMAIL ב-Vercel).
 * לא חוסם שליחה לוואטסאפ; שגיאות נבלעות בשקט.
 */
export type LeadEmailPayload = {
  formId: string;
  subject: string;
  body: string;
  name?: string;
  phone?: string;
};

export function notifyLeadByEmail(payload: LeadEmailPayload): void {
  if (typeof window === "undefined") return;

  void fetch("/api/lead-notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    /* optional channel */
  });
}
