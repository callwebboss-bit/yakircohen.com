import { generateObject, generateText } from "ai";
import { createGateway } from "@ai-sdk/gateway";
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

const ADVISOR_MODELS = ["openai/gpt-4o-mini", "google/gemini-2.5-flash"] as const;

function gatewayProviders() {
  const apiKey = process.env.AI_GATEWAY_API_KEY?.trim();
  const providers = [];
  if (apiKey) providers.push(createGateway({ apiKey }));
  providers.push(createGateway());
  return providers;
}

function extractJsonObject(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1]?.trim() ?? trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object in model response");
  }
  return JSON.parse(candidate.slice(start, end + 1)) as unknown;
}

async function generateWithModel(
  model: ReturnType<ReturnType<typeof createGateway>>,
  proId: ProServiceId,
  inputs: Record<string, string>,
) {
  const system = buildAdvisorSystemPrompt(proId);
  const prompt = buildAdvisorUserPrompt(proId, inputs);

  try {
    const { object } = await generateObject({
      model,
      schema: advisorResponseSchema,
      system,
      prompt,
    });
    return object;
  } catch (objectError) {
    const { text } = await generateText({ model, system, prompt });
    const parsed = advisorResponseSchema.safeParse(extractJsonObject(text));
    if (!parsed.success) {
      throw objectError;
    }
    return parsed.data;
  }
}

async function generateAdvisorResponse(
  proId: ProServiceId,
  inputs: Record<string, string>,
) {
  const providers = gatewayProviders();
  let lastError: unknown;

  for (const provider of providers) {
    for (const modelId of ADVISOR_MODELS) {
      try {
        return await generateWithModel(provider(modelId), proId, inputs);
      } catch (error) {
        lastError = error;
      }
    }
  }

  throw lastError ?? new Error("AI advisor unavailable");
}

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

function hasAiGatewayAccess(): boolean {
  if (process.env.AI_GATEWAY_API_KEY?.trim()) return true;
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "development";
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

  if (!hasAiGatewayAccess()) {
    const fallback = buildRuleBasedAdvisor(proId, inputs);
    return NextResponse.json({ ...fallback, source: "rules" });
  }

  try {
    const object = await generateAdvisorResponse(proId, inputs);
    return NextResponse.json({ ...object, source: "ai" });
  } catch (error) {
    console.error(
      "[service-advisor] AI failed:",
      error instanceof Error ? error.message : error,
    );
    const fallback = buildRuleBasedAdvisor(proId, inputs);
    return NextResponse.json({ ...fallback, source: "rules_fallback" });
  }
}
