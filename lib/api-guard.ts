import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/site-url";

export const PUBLIC_API_ALLOWED_ORIGINS = new Set([
  SITE_URL,
  "https://www.yakircohen.com",
  ...(process.env.NODE_ENV === "development"
    ? ["http://localhost:3000", "http://127.0.0.1:3000"]
    : []),
]);

type MemoryBucket = { count: number; resetAt: number };
const memoryBuckets = new Map<string, MemoryBucket>();

export type ApiGuardOptions = {
  /** Logical bucket name, e.g. lead-intake */
  bucket: string;
  /** Max requests per window */
  max: number;
  /** Window length in ms (default 60s) */
  windowMs?: number;
};

export type ApiGuardResult =
  | { ok: true; ip: string }
  | { ok: false; response: NextResponse };

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Browser POSTs must carry Origin or Referer from our site.
 * Fail-closed in production when both are missing (blocks CSRF-style probes).
 * Server-to-server callers should set `Origin: https://yakircohen.com`.
 */
export function isAllowedPublicOrigin(request: Request): boolean {
  const origin = request.headers.get("origin")?.trim();
  if (origin) return PUBLIC_API_ALLOWED_ORIGINS.has(origin);

  const referer = request.headers.get("referer")?.trim();
  if (referer) {
    try {
      return PUBLIC_API_ALLOWED_ORIGINS.has(new URL(referer).origin);
    } catch {
      return false;
    }
  }

  // Same-origin navigations rarely omit both; treat as forbidden in prod.
  return process.env.NODE_ENV !== "production";
}

function memoryIsLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = memoryBuckets.get(key);
  if (!entry || entry.resetAt <= now) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > max;
}

/**
 * Durable rate limit via Upstash Redis REST when env is set.
 * Falls back to in-memory (per-instance) otherwise.
 */
async function isRateLimitedDurable(
  key: string,
  max: number,
  windowMs: number,
): Promise<boolean> {
  const base = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!base || !token) {
    return memoryIsLimited(key, max, windowMs);
  }

  const ttlSec = Math.max(1, Math.ceil(windowMs / 1000));
  try {
    const res = await fetch(`${base}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, ttlSec],
      ]),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[api-guard] upstash HTTP", res.status);
      return memoryIsLimited(key, max, windowMs);
    }
    const data = (await res.json()) as Array<{ result?: number }>;
    const count = Number(data?.[0]?.result ?? 0);
    return count > max;
  } catch (err) {
    console.error("[api-guard] upstash error", err);
    return memoryIsLimited(key, max, windowMs);
  }
}

/** Origin + rate-limit gate for public mutation APIs. */
export async function guardPublicMutation(
  request: Request,
  options: ApiGuardOptions,
): Promise<ApiGuardResult> {
  if (!isAllowedPublicOrigin(request)) {
    return {
      ok: false,
      response: NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 }),
    };
  }

  const ip = getClientIp(request);
  const windowMs = options.windowMs ?? 60_000;
  const limited = await isRateLimitedDurable(
    `rl:${options.bucket}:${ip}`,
    options.max,
    windowMs,
  );

  if (limited) {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: "rate_limited" },
        { status: 429 },
      ),
    };
  }

  return { ok: true, ip };
}
