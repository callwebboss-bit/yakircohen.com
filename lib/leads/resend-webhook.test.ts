import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { POST } from "@/app/api/webhooks/resend/route";
import { getLead, saveLead } from "@/lib/leads/store";
import type { LeadRecord } from "@/lib/leads/types";

/* בלי RESEND_WEBHOOK_SECRET ומחוץ ל-production ה-webhook מאשר (route.ts). בלי
   Upstash הליד נשמר בזיכרון של התהליך */
function lead(id: string, emailId: string): LeadRecord {
  return {
    id,
    createdAt: new Date().toISOString(),
    formId: "callback",
    serviceType: "studio",
    subject: "בדיקה",
    body: "",
    score: 50,
    status: "new",
    enrichment: { ipHash: "x", device: "mobile" },
    resendEmailId: emailId,
  };
}

function event(type: string, emailId: string): Request {
  return new Request("http://localhost/api/webhooks/resend", {
    method: "POST",
    body: JSON.stringify({ type, data: { email_id: emailId, created_at: "2026-10-11T10:00:00.000Z" } }),
  });
}

describe("Resend webhook (11.10.2026)", () => {
  it("open records openedAt and keeps the status new (D34)", async () => {
    await saveLead(lead("wh-1", "em-1"));
    await POST(event("email.delivered", "em-1"));
    await POST(event("email.opened", "em-1"));
    const after = await getLead("wh-1");
    assert.equal(after?.status, "new");
    assert.ok(after?.openedAt);
    assert.ok(after?.deliveredAt);
  });

  it("a bounce is recorded on the lead", async () => {
    await saveLead(lead("wh-2", "em-2"));
    const res = await POST(event("email.bounced", "em-2"));
    assert.equal(res.status, 200);
    const after = await getLead("wh-2");
    assert.equal(after?.deliveryIssue?.type, "email.bounced");
  });

  it("an email that is not the owner's lead mail changes nothing", async () => {
    const res = await POST(event("email.bounced", "someone-else"));
    assert.deepEqual(await res.json(), { ok: true, matched: false });
  });
});
