import { createSign } from "node:crypto";

const GA4_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

type ServiceAccount = {
  client_email: string;
  private_key: string;
};

function base64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function parseServiceAccountJson(raw: string | undefined): ServiceAccount | null {
  if (!raw?.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as ServiceAccount;
    if (parsed.client_email && parsed.private_key) return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

async function getGoogleAccessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: GA4_SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${claim}`;
  const sign = createSign("RSA-SHA256");
  sign.update(unsigned);
  sign.end();
  const signature = sign.sign(sa.private_key);
  const jwt = `${unsigned}.${base64url(signature)}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    throw new Error(`Google token error ${res.status}`);
  }
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("Missing access_token");
  return data.access_token;
}

export type RealtimeSnapshot = {
  configured: boolean;
  activeUsers: number;
  topPages: { path: string; views: number }[];
  events: { name: string; count: number }[];
  fetchedAt: string;
  reason?: string;
};

const CONVERSION_EVENTS = [
  "book_router_select",
  "book_fast_whatsapp",
  "book_wizard_start",
  "book_wizard_step",
  "book_lead_submit",
  "book_success_panel",
  "book_success_wa_click",
];

export async function fetchGa4RealtimeSnapshot(): Promise<RealtimeSnapshot> {
  const propertyId = process.env.GA4_PROPERTY_ID?.trim() || "397966715";
  const sa = parseServiceAccountJson(process.env.GA4_SERVICE_ACCOUNT_JSON);

  if (!sa) {
    return {
      configured: false,
      activeUsers: 0,
      topPages: [],
      events: [],
      fetchedAt: new Date().toISOString(),
      reason: "GA4_SERVICE_ACCOUNT_JSON not configured",
    };
  }

  try {
    const token = await getGoogleAccessToken(sa);
    const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runRealtimeReport`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dimensions: [{ name: "eventName" }, { name: "pagePath" }],
        metrics: [{ name: "eventCount" }, { name: "activeUsers" }],
        limit: 50,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return {
        configured: false,
        activeUsers: 0,
        topPages: [],
        events: [],
        fetchedAt: new Date().toISOString(),
        reason: `GA4 API ${res.status}: ${errText.slice(0, 120)}`,
      };
    }

    const data = (await res.json()) as {
      rows?: {
        dimensionValues?: { value?: string }[];
        metricValues?: { value?: string }[];
      }[];
    };

    let activeUsers = 0;
    const pageMap = new Map<string, number>();
    const eventMap = new Map<string, number>();

    for (const row of data.rows ?? []) {
      const eventName = row.dimensionValues?.[0]?.value || "";
      const pagePath = row.dimensionValues?.[1]?.value || "";
      const eventCount = Number(row.metricValues?.[0]?.value || 0);
      const users = Number(row.metricValues?.[1]?.value || 0);
      activeUsers = Math.max(activeUsers, users);
      if (pagePath && pagePath !== "(not set)") {
        pageMap.set(pagePath, (pageMap.get(pagePath) || 0) + eventCount);
      }
      if (eventName) {
        eventMap.set(eventName, (eventMap.get(eventName) || 0) + eventCount);
      }
    }

    const topPages = [...pageMap.entries()]
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    const events = CONVERSION_EVENTS.map((name) => ({
      name,
      count: eventMap.get(name) || 0,
    })).filter((e) => e.count > 0);

    return {
      configured: true,
      activeUsers,
      topPages,
      events,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      configured: false,
      activeUsers: 0,
      topPages: [],
      events: [],
      fetchedAt: new Date().toISOString(),
      reason: err instanceof Error ? err.message : "GA4 fetch failed",
    };
  }
}

export function verifyCloserAnalyticsToken(request: Request): boolean {
  const expected = process.env.CLOSER_ANALYTICS_TOKEN?.trim();
  if (!expected) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${expected}`;
}

export function verifyEventIndexToken(request: Request): boolean {
  const expected = process.env.EVENT_INDEX_TOKEN?.trim();
  if (!expected) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${expected}`;
}
