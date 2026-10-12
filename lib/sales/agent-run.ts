/**
 * הסוכן עצמו: המודל, הכלים והלולאה (החלטת הבעלים 12.10.2026, סוכן מכירות).
 *
 * המודל מקבל רק שלושה כלים, וכולם עוטפים את שכבת הכלים (agent-tools.ts),
 * כלומר את אותו מנוע של /admin/sales. הקריאה עוברת דרך Vercel AI Gateway כמו
 * יועץ השירותים (app/api/service-advisor/route.ts): AI_GATEWAY_API_KEY אם הוגדר,
 * ואחרת אסימון ה-OIDC של Vercel.
 *
 * כאן אין שמירה ואין לוג של תוכן. השיחה חיה רק בדפדפן של יקיר.
 */
import { generateText, stepCountIs, tool, type LanguageModel, type ModelMessage } from "ai";
import { createGateway } from "@ai-sdk/gateway";
import { z } from "zod";
import {
  buildSalesAgentSystemPrompt,
  cleanAgentCopy,
  getServiceDetails,
  priceHash,
  quoteService,
  REGION_INPUTS,
  SalesToolError,
  searchServices,
  stripContactInfo,
  unverifiedNumbers,
  type QuoteToolResult,
} from "@/lib/sales/agent-tools";

/*
 * המזהים נבדקו מול רשימת GatewayModelId ב-node_modules/@ai-sdk/gateway/dist/index.d.ts
 * (גרסה 3.0.209). Claude Sonnet ראשון, ואחריו גיבוי מספק אחר אם הראשון נופל.
 */
export const SALES_AGENT_MODELS = [
  "anthropic/claude-sonnet-5.5",
  "anthropic/claude-sonnet-4.6",
  "openai/gpt-5.4",
] as const;

/** כמה סבבים של כלי ותשובה בתור אחד: חיפוש, כרטיס, מחיר, ואולי תיקון */
export const SALES_AGENT_MAX_STEPS = 6;

export const AGENT_NOT_CONFIGURED = "הסוכן לא מוגדר: חסר מפתח AI ב-Vercel";

export type AgentChatMessage = { role: "user" | "assistant"; content: string };

export type AgentReply = {
  text: string;
  /** הקטעים לפי הכותרות [הודעה] [רק לוודא] [פנימי], אם המודל כתב אותן */
  blocks: { intro: string; message: string | null; confirm: string | null; internal: string | null };
  /** ה-quote האחרון שהצליח בתור הזה, לכפתור "פתח במחשבון" */
  quote: QuoteToolResult | null;
  /** מספרים בתשובה שלא הגיעו מכלי ולא מיקיר. ריק ברוב המקרים */
  unverified: number[];
  priceHash: string;
};

/** יש גישה לגייטוויי: מפתח מפורש, או ריצה ב-Vercel (OIDC), או פיתוח מקומי. כמו יועץ השירותים */
export function salesAgentConfigured(env: Readonly<Record<string, string | undefined>> = process.env): boolean {
  if (env.AI_GATEWAY_API_KEY?.trim()) return true;
  return env.VERCEL === "1" || Boolean(env.VERCEL_OIDC_TOKEN?.trim());
}

/* ─── הכלים ─── */

/* שגיאה של כלי חוזרת למודל כטקסט, כדי שיתקן (מזהה לא מוכר, שדרוג שלא שייך) */
function safe<T>(run: () => T): T | { error: string } {
  try {
    return run();
  } catch (error) {
    if (error instanceof SalesToolError) return { error: error.message };
    throw error;
  }
}

export type ToolLog = { name: string; output: string }[];

export function buildSalesAgentTools(log: ToolLog, onQuote: (q: QuoteToolResult) => void) {
  const record = <T>(name: string, output: T): T => {
    log.push({ name, output: JSON.stringify(output) });
    return output;
  };
  return {
    search_services: tool({
      description: "חיפוש שירות במחירון לפי מילים בעברית. מחזיר מזהה, שם ושורת מחיר לכל שירות.",
      inputSchema: z.object({ query: z.string().min(1).max(200) }),
      execute: async ({ query }) => record("search_services", { results: searchServices(query) }),
    }),
    get_service: tool({
      description:
        "כרטיס השירות: מה כלול, מה לא, השדרוגים עם המזהים שלהם, כללי משתתפים, אזורים, אטרקציות ושורת רק לוודא.",
      inputSchema: z.object({ id: z.string().min(1).max(80) }),
      execute: async ({ id }) => record("get_service", safe(() => getServiceDetails(id))),
    }),
    quote: tool({
      description:
        "המחיר המדויק לצירוף, מהמנוע של האתר: שורות, סה״כ כולל ולפני מע״מ, הודעת וואטסאפ מוכנה, רק לוודא, שורות מורנינג ואזהרות.",
      inputSchema: z.object({
        id: z.string().min(1).max(80),
        addonIds: z.array(z.string().max(80)).max(15).optional(),
        participants: z.number().int().min(0).max(100).optional(),
        region: z.enum(REGION_INPUTS).optional(),
        attractionsCount: z.number().int().min(0).max(20).optional(),
        activations: z.number().int().min(0).max(60).optional(),
      }),
      execute: async (input) =>
        record(
          "quote",
          safe(() => {
            const q = quoteService(input);
            onQuote(q);
            return q;
          }),
        ),
    }),
  };
}

/* ─── התשובה ─── */

const HEADINGS = { message: "[הודעה]", confirm: "[רק לוודא]", internal: "[פנימי]" } as const;

export function splitReply(text: string): AgentReply["blocks"] {
  const positions = (Object.entries(HEADINGS) as [keyof typeof HEADINGS, string][])
    .map(([key, mark]) => ({ key, mark, at: text.indexOf(mark) }))
    .filter((p) => p.at >= 0)
    .sort((a, b) => a.at - b.at);
  const blocks: AgentReply["blocks"] = { intro: text.trim(), message: null, confirm: null, internal: null };
  if (positions.length === 0) return blocks;
  blocks.intro = text.slice(0, positions[0].at).trim();
  positions.forEach((p, i) => {
    const end = i + 1 < positions.length ? positions[i + 1].at : text.length;
    const body = text.slice(p.at + p.mark.length, end).trim();
    blocks[p.key] = body || null;
  });
  return blocks;
}

/* ─── הריצה ─── */

function gatewayModels(): LanguageModel[] {
  const apiKey = process.env.AI_GATEWAY_API_KEY?.trim();
  const provider = apiKey ? createGateway({ apiKey }) : createGateway();
  return SALES_AGENT_MODELS.map((id) => provider(id));
}

function isAuthError(error: unknown): boolean {
  const name = error instanceof Error ? error.name : "";
  return name === "GatewayAuthenticationError" || name === "GatewayForbiddenError";
}

export class SalesAgentNotConfiguredError extends Error {
  constructor() {
    super(AGENT_NOT_CONFIGURED);
    this.name = "SalesAgentNotConfiguredError";
  }
}

/**
 * תור אחד בשיחה. models לבדיקות (מודל מדומה); בלי זה, רשימת הגיבוי דרך הגייטוויי.
 * הטלפונים והמיילים נמחקים מכל הודעה של יקיר לפני שהיא יוצאת.
 */
export async function runSalesAgent(
  history: readonly AgentChatMessage[],
  models: readonly LanguageModel[] = gatewayModels(),
): Promise<AgentReply> {
  const messages: ModelMessage[] = history.map((m) => ({
    role: m.role,
    content: m.role === "user" ? stripContactInfo(m.content) : m.content,
  }));
  const hash = priceHash();
  const system = buildSalesAgentSystemPrompt(hash);
  let lastError: unknown;
  for (const model of models) {
    const log: ToolLog = [];
    let quote: QuoteToolResult | null = null;
    try {
      const result = await generateText({
        model,
        system,
        messages,
        tools: buildSalesAgentTools(log, (q) => {
          quote = q;
        }),
        stopWhen: stepCountIs(SALES_AGENT_MAX_STEPS),
        temperature: 0.3,
      });
      const text = cleanAgentCopy(result.text).trim();
      const userText = messages.filter((m) => m.role === "user").map((m) => String(m.content));
      return {
        text,
        blocks: splitReply(text),
        quote,
        unverified: unverifiedNumbers(text, [...log.map((l) => l.output), ...userText, system]),
        priceHash: hash,
      };
    } catch (error) {
      lastError = error;
      if (isAuthError(error)) throw new SalesAgentNotConfiguredError();
    }
  }
  throw lastError ?? new Error("sales agent unavailable");
}
