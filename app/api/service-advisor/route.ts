import { generateObject } from "ai";
import { gateway } from "@ai-sdk/gateway";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { ProServiceId } from "@/lib/data/pro-services";
import { PRO_SERVICES } from "@/lib/data/pro-services";
import {
  advisorResponseSchema,
  buildAdvisorSystemPrompt,
  buildAdvisorUserPrompt,
  buildRuleBasedAdvisor,
} from "@/lib/pro-service-advisor";
import { SITE_URL } from "@/lib/site-url";

const VALID_IDS = new Set(PRO_SERVICES.map((s) => s.id));

const requestSchema = z.object({
  serviceId: z.string(),
  inputs: z.record(z.string(), z.string()),
});

const ALLOWED_ORIGINS = new Set([
  SITE_URL,
  "https://www.yakircohen.com",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
]);

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function isAllowedRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (origin) return ALLOWED_ORIGINS.has(origin);
  const referer = request.headers.get("referer");
  if (!referer) return true;
  try {
    return ALLOWED_ORIGINS.has(new URL(referer).origin);
  } catch {
    return false;
  }
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count += 1;
  return true;
}

export async function POST(request: Request) {
  if (!isAllowedRequest(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { serviceId, inputs } = parsed.data;
  if (!VALID_IDS.has(serviceId as ProServiceId)) {
    return NextResponse.json({ error: "Unknown service" }, { status: 400 });
  }

  const proId = serviceId as ProServiceId;
  const apiKey = process.env.AI_GATEWAY_API_KEY?.trim();

  if (!apiKey) {
    const fallback = buildRuleBasedAdvisor(proId, inputs);
    return NextResponse.json({ ...fallback, source: "rules" });
  }

  try {
    const { object } = await generateObject({
      model: gateway("openai/gpt-4o-mini"),
      schema: advisorResponseSchema,
      system: buildAdvisorSystemPrompt(proId),
      prompt: buildAdvisorUserPrompt(proId, inputs),
    });
    return NextResponse.json({ ...object, source: "ai" });
  } catch {
    const fallback = buildRuleBasedAdvisor(proId, inputs);
    return NextResponse.json({ ...fallback, source: "rules_fallback" });
  }
}
