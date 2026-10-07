/**
 * שליחת הליד לשרת (/api/lead-notify). חוזה אחד לכל הטפסים (LF-02):
 * submitLeadToServer לא זורק אף פעם ומחזיר LeadSubmitResult, והחלטת ההצלחה
 * יושבת בפונקציה טהורה אחת, interpretLeadResponse: הצלחה = 200 ו-ok:true.
 * השרת עונה 200 רק כשהבעלים באמת קיבל את הליד.
 */
import { trackConversion } from "@/lib/analytics/conversion-events";
import { buildBookHref } from "@/lib/book-url";
import { buildCloserDeepLink } from "@/lib/closer-deep-link";
import {
  getCrossSellOffers,
  type CrossSellContext,
} from "@/lib/data/booking-cross-sell";
import type { LeadContactChannel } from "@/lib/leads/contact-channel";
import { findLeadCode, generateLeadCode, normalizeLeadCode, withLeadCodeLine } from "@/lib/lead-code";
import { fitLeadBody } from "@/lib/leads/payload-check";
import type { LeadIngestClientMeta, ServiceType } from "@/lib/leads/types";
import { readWhatsAppLeadCode, stampWhatsAppLeadCode } from "@/lib/whatsapp";

export type LeadEmailPayload = {
  formId: string;
  subject: string;
  body: string;
  name?: string;
  phone?: string;
  email?: string;
  /** Honeypot - must stay empty for humans; bots that fill it are rejected server-side. */
  website_verification?: string;
  /** מזהה שליחה. ניסיון חוזר עם אותו מזהה לא ייצור מייל כפול אצל הבעלים. */
  submissionId?: string;
  /**
   * מה הלקוח קיבל: "whatsapp" כשהדפדפן פתח לו וואטסאפ, "callback" כשביקש
   * שיחה חוזרת. קובע את השורה האחרונה ואת הנושא במייל לבעלים. בלי ערך השרת
   * כותב ניסוח ניטרלי. ראו lib/leads/contact-channel.ts.
   */
  contactChannel?: LeadContactChannel;
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

/** גוף המייל לבעלים כפי שהדפדפן שולח אותו. מיוצא לבדיקות. */
export function buildLeadNotifyBody(payload: LeadEmailPayload): string {
  const crossSellBlock = buildCrossSellEmailBlock(payload.crossSell);
  if (!payload.body.trim()) return payload.body;

  const closerLink = buildCloserDeepLink(payload.body);
  /* fitLeadBody מוריד את שורת הקישור כשהגוף חורג מהמגבלה של השרת */
  return fitLeadBody(
    `${payload.body.trim()}${crossSellBlock}\n\n---\nלהדבקה ב-yakir-closer: העתיקו את גוף ההודעה למעלה לשדה "קליטה מהירה".\nאו פתחו מקומית: ${closerLink}\nאחרי ייבוא - שלב א׳: הצעת מחיר.`,
  );
}

/**
 * קוד פנייה אחד לליד ולהודעת הוואטסאפ שלו (החלטת הבעלים D67, 7.10.2026).
 * הבעלים מקבל במייל את הגוף המלא עם תג [YC:] ועם "קוד פנייה: XXXX", והלקוח
 * שולח בוואטסאפ רק את הקוד, כך שיקיר מחבר בין השניים לפי הקוד. קוד שכבר
 * קיים בגוף או בקישור נשמר, כדי שניסיון חוזר או מסך הצלחה לא ייצרו קוד שני.
 * השרת לא סומך על הקוד הזה לשום החלטה: הוא רק מחלץ אותו מהגוף לנושא המייל.
 */
export function attachLeadCode(
  payload: LeadEmailPayload,
  waHref?: string,
  /** קוד שהטופס כבר החזיק (קבוע לניסיונות חוזרים), כשאין קוד בגוף */
  knownCode?: string,
): { payload: LeadEmailPayload; waHref: string; code: string } {
  const code =
    findLeadCode(payload.body) ??
    (waHref ? readWhatsAppLeadCode(waHref) : null) ??
    normalizeLeadCode(knownCode) ??
    generateLeadCode();
  return {
    payload: { ...payload, body: withLeadCodeLine(payload.body, code) },
    waHref: waHref ? stampWhatsAppLeadCode(waHref, code) : "",
    code,
  };
}

export const LEAD_SUBMIT_TIMEOUT_MS = 12_000;

export type LeadSubmitFailReason =
  | "network"
  | "timeout"
  | "rejected"
  | "rate_limited"
  | "server";

export type LeadSubmitResult =
  | { ok: true; leadId?: string; duplicate?: string; dryRun?: boolean }
  | { ok: false; reason: LeadSubmitFailReason; status?: number };

function isRecordLike(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

/** ההחלטה היחידה אם ליד נקלט. טהורה, ולכן נבדקת בלי דפדפן. */
export function interpretLeadResponse(status: number, json: unknown): LeadSubmitResult {
  if (status === 200 && isRecordLike(json) && json.ok === true) {
    return {
      ok: true,
      leadId: typeof json.leadId === "string" ? json.leadId : undefined,
      duplicate: typeof json.duplicate === "string" ? json.duplicate : undefined,
      dryRun: json.dryRun === true ? true : undefined,
    };
  }
  if (status === 429) return { ok: false, reason: "rate_limited", status };
  if (status >= 400 && status < 500) return { ok: false, reason: "rejected", status };
  return { ok: false, reason: "server", status };
}

/** fetch שנזרק: ביטול בגלל timeout, או כשל רשת. */
export function interpretLeadError(err: unknown): LeadSubmitResult {
  const name = isRecordLike(err) && typeof err.name === "string" ? err.name : "";
  if (name === "AbortError" || name === "TimeoutError") {
    return { ok: false, reason: "timeout" };
  }
  return { ok: false, reason: "network" };
}

export function createSubmissionId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    /* fallback below */
  }
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export type SubmitLeadOptions = {
  timeoutMs?: number;
  /** false לליד "רוח" חלקי, כדי שלא ייספר ב-GA4 כליד */
  track?: boolean;
};

/**
 * שולח את הליד ומחזיר תוצאה. לא זורק אף פעם.
 * generate_lead נשלח ל-GA4 רק אחרי 200 מהשרת, ו-lead_submit_failed בכשל.
 */
export async function submitLeadToServer(
  payload: LeadEmailPayload,
  options?: SubmitLeadOptions,
): Promise<LeadSubmitResult> {
  if (typeof window === "undefined") return { ok: false, reason: "network" };
  const track = options?.track !== false;
  const timeoutMs = options?.timeoutMs ?? LEAD_SUBMIT_TIMEOUT_MS;
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

  let result: LeadSubmitResult;
  try {
    const clientMeta = collectClientMeta(payload.clientMeta);
    const res = await fetch("/api/lead-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        body: buildLeadNotifyBody(payload),
        clientMeta,
      }),
      keepalive: true,
      signal: controller?.signal,
    });
    const json: unknown = await res.json().catch(() => null);
    result = interpretLeadResponse(res.status, json);
  } catch (err) {
    result = interpretLeadError(err);
  } finally {
    if (timer) clearTimeout(timer);
  }

  if (track) {
    if (result.ok) {
      trackConversion("generate_lead", { form_id: payload.formId });
    } else {
      trackConversion("lead_submit_failed", {
        form_id: payload.formId,
        reason: result.reason,
        ...(result.status ? { status: result.status } : {}),
      });
    }
  }
  return result;
}

/** עטיפה ותיקה שזורקת בכשל, בשביל useWizardGhostLead ו-notifyLeadByEmail. */
export async function notifyLeadByEmailAsync(
  payload: LeadEmailPayload,
  options?: SubmitLeadOptions,
): Promise<void> {
  if (typeof window === "undefined") return;
  const result = await submitLeadToServer(payload, options);
  if (!result.ok) {
    throw new Error(`lead-notify failed: ${result.reason}${result.status ? ` ${result.status}` : ""}`);
  }
}

export function notifyLeadByEmail(payload: LeadEmailPayload): void {
  if (typeof window === "undefined") return;
  void notifyLeadByEmailAsync(payload).catch(() => {
    /* optional channel */
  });
}
