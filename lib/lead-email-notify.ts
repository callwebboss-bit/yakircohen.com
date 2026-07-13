/**
 * גיבוי מייל ללידים (אופציונלי - דורש RESEND_API_KEY + LEAD_NOTIFY_EMAIL ב-Vercel).
 * לא חוסם שליחה לוואטסאפ; שגיאות נבלעות בשקט.
 */
import { buildBookHref } from "@/lib/book-url";
import {
  getCrossSellOffers,
  type CrossSellContext,
} from "@/lib/data/booking-cross-sell";
import type { LeadIngestClientMeta, ServiceType } from "@/lib/leads/types";

export type LeadEmailPayload = {
  formId: string;
  subject: string;
  body: string;
  name?: string;
  phone?: string;
  email?: string;
  /** Honeypot - must stay empty for humans; bots that fill it are rejected server-side. */
  website_verification?: string;
  crossSell?: CrossSellContext;
  serviceType?: ServiceType;
  eventDate?: string;
  budgetHint?: number;
  pricingRef?: LeadIngestClientMeta["pricingRef"];
  clientMeta?: LeadIngestClientMeta;
};

function buildCrossSellContextLine(ctx: CrossSellContext): string {
  const parts: string[] = [];
  if (ctx.atmosphere) parts.push(`אווירה: ${ctx.atmosphere}`);
  if (ctx.recordingType) parts.push(`סוג: ${ctx.recordingType}`);
  if (ctx.mobileGeo) parts.push(`אולפן נייד (${ctx.mobileGeo})`);
  if (ctx.largeGroup) parts.push("קבוצה 12+ - שקול אולפן נייד");
  return parts.length ? `${parts.join(" - ")}\n` : "";
}

function buildCrossSellEmailBlock(ctx?: CrossSellContext): string {
  if (!ctx) return "";
  const offers = getCrossSellOffers(ctx, 2);
  if (!offers.length) return "";
  const contextLine = buildCrossSellContextLine(ctx);
  const category = ctx.bookCategory as Parameters<typeof buildBookHref>[0] | undefined;
  const bookPath =
    category &&
    ["studio", "podcast", "events", "dj", "photography", "clips", "singer", "academy", "online"].includes(
      category,
    )
      ? buildBookHref(category)
      : "/book";
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://yakircohen.com";
  const bookUrl = `${origin}${bookPath}`;
  const lines = offers.map((o) => `• ${o.headline}`);
  return [
    "",
    "---",
    "הצעות משלימות לשלוח ללקוח אחרי אישור:",
    ...(contextLine ? [contextLine.trimEnd()] : []),
    ...lines,
    `קישור להזמנה: ${bookUrl}`,
  ].join("\n");
}

function collectClientMeta(
  extra?: LeadIngestClientMeta,
): LeadIngestClientMeta | undefined {
  if (typeof window === "undefined") return extra;
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const v = params.get(key);
    if (v) utm[key] = v;
  }
  const nav = performance.getEntriesByType?.("navigation")?.[0] as
    | PerformanceNavigationTiming
    | undefined;
  const sessionSeconds = nav
    ? Math.round((performance.now() - (nav.startTime || 0)) / 1000)
    : Math.round(performance.now() / 1000);

  return {
    ...extra,
    referrer: extra?.referrer || document.referrer || undefined,
    landingPath: extra?.landingPath || `${window.location.pathname}${window.location.search}`,
    sessionSeconds: extra?.sessionSeconds ?? sessionSeconds,
    utm: Object.keys(utm).length ? { ...utm, ...extra?.utm } : extra?.utm,
  };
}

function buildEmailBody(payload: LeadEmailPayload): string {
  const crossSellBlock = buildCrossSellEmailBlock(payload.crossSell);
  return payload.body.trim()
    ? `${payload.body.trim()}${crossSellBlock}\n\n---\nלהדבקה ב-yakir-closer: העתיקו את גוף ההודעה למעלה לשדה "קליטה מהירה".`
    : payload.body;
}

export async function notifyLeadByEmailAsync(payload: LeadEmailPayload): Promise<void> {
  if (typeof window === "undefined") return;

  const clientMeta = collectClientMeta(payload.clientMeta);
  const res = await fetch("/api/lead-notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      body: buildEmailBody(payload),
      clientMeta,
    }),
    keepalive: true,
  });

  if (!res.ok) {
    throw new Error(`lead-notify failed: ${res.status}`);
  }
}

export function notifyLeadByEmail(payload: LeadEmailPayload): void {
  if (typeof window === "undefined") return;
  void notifyLeadByEmailAsync(payload).catch(() => {
    /* optional channel */
  });
}
