import { NextResponse } from "next/server";
import { listLeads, updateLead } from "@/lib/leads/store";
import { classifyResendEvent } from "@/lib/leads/resend-events";
import { logLeadDeliveryProblem } from "@/lib/leads/log";
import { createHmac, timingSafeEqual } from "node:crypto";

type ResendWebhookEvent = {
  type?: string;
  data?: {
    email_id?: string;
    created_at?: string;
  };
};

function verifySvixOrSecret(
  request: Request,
  rawBody: string,
): boolean {
  const secret = process.env.RESEND_WEBHOOK_SECRET?.trim();
  if (!secret) {
    // Allow in development only
    return process.env.NODE_ENV !== "production";
  }

  // Simple shared-secret header (Resend also supports Svix - accept either)
  const headerSecret = request.headers.get("x-resend-webhook-secret")?.trim();
  if (headerSecret) {
    try {
      const a = Buffer.from(headerSecret);
      const b = Buffer.from(secret);
      if (a.length === b.length && timingSafeEqual(a, b)) return true;
    } catch {
      // fall through to Svix check
    }
  }

  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");
  if (svixId && svixTimestamp && svixSignature && secret.startsWith("whsec_")) {
    try {
      const key = Buffer.from(secret.replace("whsec_", ""), "base64");
      const toSign = `${svixId}.${svixTimestamp}.${rawBody}`;
      const expected = createHmac("sha256", key).update(toSign).digest("base64");
      const signatures = svixSignature.split(" ").map((part) => part.replace(/^v1,/, ""));
      return signatures.some((sig) => {
        try {
          const a = Buffer.from(sig);
          const b = Buffer.from(expected);
          return a.length === b.length && timingSafeEqual(a, b);
        } catch {
          return false;
        }
      });
    } catch {
      return false;
    }
  }

  return false;
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!verifySvixOrSecret(request, rawBody)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let event: ResendWebhookEvent;
  try {
    event = JSON.parse(rawBody) as ResendWebhookEvent;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const type = event.type || "";
  const emailId = event.data?.email_id;
  if (!emailId) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const kind = classifyResendEvent(type);
  if (kind === "ignore") return NextResponse.json({ ok: true });

  const at = event.data?.created_at || new Date().toISOString();
  const leads = await listLeads(200);
  const match = leads.find((l) => l.resendEmailId === emailId);
  /* רק המייל לבעלים נשמר על הליד (resendEmailId). מייל אחר, למשל התשובה
     האוטומטית ללקוח, לא מעדכן כלום */
  if (!match) return NextResponse.json({ ok: true, matched: false });

  if (kind === "engagement") {
    /* פתיחת המייל של הבעלים היא לא פנייה ללקוח, ולכן הסטטוס לא משתנה.
       לפי D34, contacted נרשם רק כשהבעלים פונה ללקוח (11.10.2026) */
    if (!match.openedAt) await updateLead(match.id, { openedAt: at });
  } else if (kind === "delivered") {
    if (!match.deliveredAt) await updateLead(match.id, { deliveredAt: at });
  } else {
    await updateLead(match.id, { deliveryIssue: { type, at } });
    if (kind === "problem") {
      logLeadDeliveryProblem({ leadId: match.id, formId: match.formId, type });
    }
  }

  return NextResponse.json({ ok: true });
}
