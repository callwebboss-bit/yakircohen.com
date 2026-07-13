import { createHash } from "node:crypto";
import type { LeadEnrichment } from "@/lib/leads/types";

export type ClientEnrichmentHints = {
  referrer?: string;
  landingPath?: string;
  sessionSeconds?: number;
  utm?: Record<string, string>;
};

function detectDevice(ua: string): LeadEnrichment["device"] {
  const u = ua.toLowerCase();
  if (/ipad|tablet/.test(u)) return "tablet";
  if (/mobi|android|iphone/.test(u)) return "mobile";
  if (/windows|macintosh|linux/.test(u)) return "desktop";
  return "unknown";
}

export function hashIp(ip: string): string {
  return createHash("sha256").update(`yc-lead-ip:${ip}`).digest("hex").slice(0, 16);
}

export function buildLeadEnrichment(
  request: Request,
  ip: string,
  hints?: ClientEnrichmentHints,
): LeadEnrichment {
  const ua = request.headers.get("user-agent")?.trim() || "";
  const city =
    request.headers.get("x-vercel-ip-city")?.trim() ||
    request.headers.get("cf-ipcity")?.trim() ||
    undefined;
  const country =
    request.headers.get("x-vercel-ip-country")?.trim() ||
    request.headers.get("cf-ipcountry")?.trim() ||
    undefined;

  return {
    ipHash: hashIp(ip || "unknown"),
    geo: city || country ? { city: city ? decodeURIComponent(city) : undefined, country } : undefined,
    device: detectDevice(ua),
    userAgent: ua.slice(0, 240) || undefined,
    referrer: hints?.referrer?.slice(0, 500),
    landingPath: hints?.landingPath?.slice(0, 200),
    sessionSeconds:
      typeof hints?.sessionSeconds === "number" && hints.sessionSeconds >= 0
        ? Math.min(hints.sessionSeconds, 86_400)
        : undefined,
    utm: hints?.utm,
  };
}
