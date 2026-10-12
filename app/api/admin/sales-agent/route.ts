import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { guardRateLimit, isAllowedPublicOrigin } from "@/lib/api-guard";
import {
  AGENT_NOT_CONFIGURED,
  runSalesAgent,
  SalesAgentNotConfiguredError,
  salesAgentConfigured,
} from "@/lib/sales/agent-run";

/**
 * סוכן המכירות של /admin/sales (החלטת הבעלים 12.10.2026, סוכן מכירות).
 *
 * רק עם קוקי הסשן של האדמין. בלי סשן: 401, ושום דבר לא יוצא למודל. השיחה
 * מגיעה מהדפדפן בכל בקשה ולא נשמרת כאן, ואין לוג של תוכן.
 */

export const dynamic = "force-dynamic";
/* חיפוש, כרטיס ומחיר הם כמה סבבים מול המודל */
export const maxDuration = 60;

const MAX_MESSAGES = 20;
const MAX_CHARS = 2000;

const bodySchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(MAX_CHARS) }))
    .min(1)
    .max(MAX_MESSAGES)
    .refine((list) => list[list.length - 1]?.role === "user", { message: "last message must be from the user" }),
});

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return json({ ok: false, error: "unauthorized" }, 401);
  if (!isAllowedPublicOrigin(request)) return json({ ok: false, error: "forbidden" }, 403);

  /* יקיר לבד, אבל לולאה בדפדפן או לחיצות חוזרות לא יעלו כסף בגייטוויי */
  const guard = await guardRateLimit(request, { bucket: "admin-sales-agent", max: 20 });
  if (!guard.ok) return json({ ok: false, error: "rate_limited", message: "יותר מדי שאלות בדקה. מחכים רגע." }, 429);

  if (!salesAgentConfigured()) {
    return json({ ok: false, error: "not_configured", message: AGENT_NOT_CONFIGURED }, 503);
  }

  let parsed: z.infer<typeof bodySchema>;
  try {
    const result = bodySchema.safeParse(await request.json());
    if (!result.success) return json({ ok: false, error: "invalid" }, 400);
    parsed = result.data;
  } catch {
    return json({ ok: false, error: "invalid" }, 400);
  }

  try {
    const reply = await runSalesAgent(parsed.messages);
    return json({ ok: true, reply });
  } catch (error) {
    if (error instanceof SalesAgentNotConfiguredError) {
      return json({ ok: false, error: "not_configured", message: AGENT_NOT_CONFIGURED }, 503);
    }
    /* רק סוג השגיאה, לא התוכן: בשיחה יש פרטים של לקוחות */
    console.error("[sales-agent] failed:", error instanceof Error ? error.name : "unknown");
    return json({ ok: false, error: "failed", message: "הסוכן לא ענה הפעם. מנסים שוב, או עוברים למחשבון." }, 502);
  }
}
