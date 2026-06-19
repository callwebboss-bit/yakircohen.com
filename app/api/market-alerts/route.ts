import { NextResponse } from "next/server";
import { CONTACT_EMAIL_INTERNAL } from "@/lib/constants";
import alertsData from "@/lib/data/market-alerts.generated.json";

const RESEND_API = "https://api.resend.com/emails";

type MarketAlert = {
  id: string;
  message: string;
  segmentLabel: string;
  suggestedPremiumPct: number;
};

function parseSubscribers(): string[] {
  const raw = process.env.MARKET_ALERT_SUBSCRIBERS?.trim();
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function isConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function notifyEmail(): string {
  return process.env.LEAD_NOTIFY_EMAIL?.trim() || CONTACT_EMAIL_INTERNAL;
}

/** POST /api/market-alerts - cron digest of arbitrage signals (Bearer CRON_SECRET) */
export async function POST(request: Request) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const alerts = ((alertsData as { alerts?: MarketAlert[] }).alerts ?? []).filter(
    (a) => a.message,
  );

  if (!alerts.length) {
    return NextResponse.json({ ok: true, sent: 0, reason: "no_alerts" });
  }

  const subscribers = parseSubscribers();
  const to = subscribers.length ? subscribers : [notifyEmail()];

  if (!isConfigured()) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      alertCount: alerts.length,
      reason: "resend_not_configured",
    });
  }

  const body = alerts
    .map(
      (a, i) =>
        `${i + 1}. ${a.segmentLabel} (+${a.suggestedPremiumPct}%)\n${a.message}`,
    )
    .join("\n\n");

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || "דופק שוק <onboarding@resend.dev>";

  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `דופק השוק - ${alerts.length} התרעות מלאי`,
      text: [
        "דופק השוק - התרעות שבועיות",
        "",
        body,
        "",
        "---",
        "נשלח אוטומטית מ-yakircohen.com/api/market-alerts",
      ].join("\n"),
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("[market-alerts] Resend error", res.status, errText);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, sent: to.length, alertCount: alerts.length });
}

/** GET - dev-only status */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  const alerts = (alertsData as { alerts?: MarketAlert[] }).alerts ?? [];
  return NextResponse.json({
    alertCount: alerts.length,
    subscribers: parseSubscribers().length,
    resendConfigured: isConfigured(),
  });
}
