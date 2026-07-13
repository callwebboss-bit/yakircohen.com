import { NextResponse } from "next/server";
import { listLeads, updateLead } from "@/lib/leads/store";
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

  // Simple shared-secret header (Resend also supports Svix — accept either)
  const headerSecret = request.headers.get("x-resend-webhook-secret")?.trim();
  if (headerSecret && headerSecret === secret) return true;

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

  if (type === "email.opened" || type === "email.clicked") {
    const leads = await listLeads(200);
    const match = leads.find((l) => l.resendEmailId === emailId);
    if (match && !match.openedAt) {
      await updateLead(match.id, {
        openedAt: event.data?.created_at || new Date().toISOString(),
        status: match.status === "new" ? "contacted" : match.status,
      });
    }
  }

  return NextResponse.json({ ok: true });
}
