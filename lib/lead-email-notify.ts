/**

 * גיבוי מייל ללידים (אופציונלי - דורש RESEND_API_KEY + LEAD_NOTIFY_EMAIL ב-Vercel).

 * לא חוסם שליחה לוואטסאפ; שגיאות נבלעות בשקט.

 */

import { buildBookHref } from "@/lib/book-url";

import {

  getCrossSellOffers,

  type CrossSellContext,

} from "@/lib/data/booking-cross-sell";



export type LeadEmailPayload = {

  formId: string;

  subject: string;

  body: string;

  name?: string;

  phone?: string;

  crossSell?: CrossSellContext;

};



function buildCrossSellContextLine(ctx: CrossSellContext): string {
  const parts: string[] = [];
  if (ctx.atmosphere) parts.push(`אווירה: ${ctx.atmosphere}`);
  if (ctx.recordingType) parts.push(`סוג: ${ctx.recordingType}`);
  if (ctx.mobileGeo) parts.push(`אולפן נייד (${ctx.mobileGeo})`);
  if (ctx.largeGroup) parts.push("קבוצה 12+ — שקול אולפן נייד");
  return parts.length ? `${parts.join(" · ")}\n` : "";
}

function buildCrossSellEmailBlock(ctx?: CrossSellContext): string {

  if (!ctx) return "";

  const offers = getCrossSellOffers(ctx, 2);

  if (!offers.length) return "";

  const contextLine = buildCrossSellContextLine(ctx);

  const category = ctx.bookCategory as Parameters<typeof buildBookHref>[0] | undefined;

  const bookPath =

    category && ["studio", "podcast", "events", "dj", "photography", "clips", "singer", "academy", "online"].includes(category)

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



function buildEmailBody(payload: LeadEmailPayload): string {
  const crossSellBlock = buildCrossSellEmailBlock(payload.crossSell);
  return payload.body.trim()
    ? `${payload.body.trim()}${crossSellBlock}\n\n---\nלהדבקה ב-yakir-closer: העתיקו את גוף ההודעה למעלה לשדה "קליטה מהירה".`
    : payload.body;
}

export async function notifyLeadByEmailAsync(payload: LeadEmailPayload): Promise<void> {
  if (typeof window === "undefined") return;

  const res = await fetch("/api/lead-notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, body: buildEmailBody(payload) }),
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


