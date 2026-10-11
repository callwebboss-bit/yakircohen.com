/**
 * לקוח ה-API של מורנינג (חשבונית ירוקה), לסקריפטים במחשב של יקיר בלבד.
 *
 * כתיבה בלבד (פריטים, לינקים, דפי תשלום) לפי החלטת הבעלים 12.10.2026; קריאת
 * נתוני לקוחות נשארת אחרי PRIVACY-AUDIT (D29). המפתח מגיע רק מ-process.env
 * (MORNING_API_ID, MORNING_API_SECRET ב-.env.local), אף פעם לא ב-Vercel ואף
 * פעם לא בלוג: הטוקן והסוד לא מודפסים.
 *
 * מה ידוע על ה-API (12.10, מקורות: API_REFERENCE.md ו-src/client.ts של
 * GreenInvoice-MCP, והתיעוד הישן ב-Apiary): טוקן ב-POST /account/token
 * {id, secret}, תוקף ~30 דקות, ~3 בקשות לשנייה, 401 = טוקן פג.
 */
export const MORNING_API_BASE = "https://api.greeninvoice.co.il/api/v1";
export const MORNING_SANDBOX_BASE = "https://sandbox.d.greeninvoice.co.il/api/v1";

const TOKEN_TTL_MS = 25 * 60 * 1000;
const MIN_GAP_MS = 350;

export type MorningResponse<T = unknown> = { status: number; ok: boolean; body: T | null; text: string };

export class MorningClient {
  private token: string | null = null;
  private tokenAt = 0;
  private lastCall = 0;

  constructor(
    private readonly creds: { id: string; secret: string },
    private readonly base: string = MORNING_API_BASE,
  ) {}

  /** מ-.env.local. זורק הודעה ברורה בלי לחשוף ערכים. */
  static fromEnv(env: NodeJS.ProcessEnv = process.env, { sandbox = false } = {}): MorningClient {
    const id = env.MORNING_API_ID?.trim();
    const secret = env.MORNING_API_SECRET?.trim();
    if (!id || !secret) {
      throw new Error(
        "חסרים MORNING_API_ID / MORNING_API_SECRET ב-.env.local (מורנינג > הגדרות > כלים למפתחים > API Keys). docs/MORNING-LINKS.md",
      );
    }
    return new MorningClient({ id, secret }, sandbox ? MORNING_SANDBOX_BASE : MORNING_API_BASE);
  }

  private async pace(): Promise<void> {
    const wait = this.lastCall + MIN_GAP_MS - Date.now();
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    this.lastCall = Date.now();
  }

  private async fetchToken(): Promise<string> {
    await this.pace();
    const res = await fetch(`${this.base}/account/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: this.creds.id, secret: this.creds.secret }),
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`טוקן נכשל (${res.status}): ${redact(text, this.creds)}`);
    let token: string | undefined;
    try {
      token = (JSON.parse(text) as { token?: string }).token;
    } catch {
      /* גוף לא JSON, ננסה את הכותרת */
    }
    token ??= res.headers.get("x-authorization-bearer") ?? undefined;
    if (!token) throw new Error("התשובה לטוקן בלי token וגם בלי X-Authorization-Bearer");
    this.token = token;
    this.tokenAt = Date.now();
    return token;
  }

  private async getToken(): Promise<string> {
    if (this.token && Date.now() - this.tokenAt < TOKEN_TTL_MS) return this.token;
    return this.fetchToken();
  }

  /** בקשה עם טוקן; על 401 מרענן פעם אחת. הגוף מוחזר גם כטקסט, בלי הסודות. */
  async request<T = unknown>(method: "GET" | "POST" | "PUT" | "DELETE", path: string, body?: unknown): Promise<MorningResponse<T>> {
    const send = async (token: string) => {
      await this.pace();
      return fetch(`${this.base}${path}`, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    };
    let res = await send(await this.getToken());
    if (res.status === 401) {
      this.token = null;
      res = await send(await this.fetchToken());
    }
    const text = await res.text();
    let parsed: T | null = null;
    try {
      parsed = text ? (JSON.parse(text) as T) : null;
    } catch {
      parsed = null;
    }
    return { status: res.status, ok: res.ok, body: parsed, text: redact(text, this.creds) };
  }

  get<T = unknown>(path: string) {
    return this.request<T>("GET", path);
  }
  post<T = unknown>(path: string, body: unknown) {
    return this.request<T>("POST", path, body);
  }
  put<T = unknown>(path: string, body: unknown) {
    return this.request<T>("PUT", path, body);
  }
}

/* אם הסוד או המזהה הופיעו בטקסט תשובה, הם לא מגיעים ללוג */
function redact(text: string, creds: { id: string; secret: string }): string {
  return text.split(creds.secret).join("[secret]").split(creds.id).join("[id]");
}

/** שדות שמותר להדפיס מתשובות: בלי שם, מייל, טלפון, כתובת, ת.ז של לקוחות */
const PRIVATE_KEYS = /^(name|email|emails|phone|mobile|address|city|taxId|ssn|contact|client|clientName|clientEmail|clientPhone|payer|card)$/i;

export function stripPrivate(value: unknown, depth = 0): unknown {
  if (depth > 6) return "[...]";
  if (Array.isArray(value)) return value.slice(0, 3).map((v) => stripPrivate(v, depth + 1));
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = PRIVATE_KEYS.test(k) ? "[private]" : stripPrivate(v, depth + 1);
    }
    return out;
  }
  if (typeof value === "string" && value.length > 160) return `${value.slice(0, 160)}...`;
  return value;
}
