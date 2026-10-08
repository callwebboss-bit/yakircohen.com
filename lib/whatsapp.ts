import { CONTACT_PHONE_WHATSAPP } from "@/lib/constants";
import { findLeadCode, generateLeadCode, withLeadCodeLine } from "@/lib/lead-code";

/* נושא שכבר פותח בברכה הוא הודעה מוכנה מנתוני השירות ("שלום, מעוניין/ת
   ב..."). עד 6.10.2026 היא נעטפה בפתיחה שנייה, והלקוח שלח "שלום, אשמח לשמוע
   על שלום, מעוניין..." (תוכנית עמדת המכירות, סעיף 8). רק מילת ברכה שאחריה
   פסיק או רווח, כדי ש"הילוך" או "היין" לא ייתפסו כברכה. */
const GREETING_START = /^(?:שלום|היי|הי|אהלן)[,\s]/;

/** Standard inquiry line - always names the service or package on the page.
 *  When startingPrice is provided it appends the starting price so the client
 *  enters the conversation already knowing what to expect.
 *  A subject that already opens with a greeting is used as-is, without a second greeting.
 */
export function buildServiceWhatsAppText(subject: string, startingPrice?: string): string {
  const trimmed = subject.trim();
  const base = GREETING_START.test(trimmed)
    ? trimmed
    : `שלום, אשמח לשמוע על ${trimmed || "השירות"}`;
  return startingPrice ? `${base} - מחיר: ${startingPrice}` : base;
}

/*
 * שורות פנימיות שנבנות ב-buildClosingMessage (lib/whatsapp-closing.ts) בשביל
 * הבעלים, ושאסור שהלקוח ישלח מהטלפון שלו: "ליד פרימיום", דגלי תזמון ושורת
 * "כוונה" (LF-06). המייל לבעלים מקבל את הגוף המלא בנפרד בכל נקודת קריאה,
 * ולכן שם הן נשארות. גם תג [YC:...] יורד כאן: במקומו הלקוח שולח "קוד פנייה:
 * XXXX" בשורה האחרונה, והתג המלא נשאר רק במייל לבעלים (החלטת הבעלים D67,
 * 7.10.2026). הסינון לפי שורה שלמה בלבד, כדי לא לגעת בטקסט שהלקוח כתב.
 */
const CUSTOMER_HIDDEN_LINES = new Set([
  "🚨 ליד פרימיום",
  "⏰ דחוף",
  "📆 תוך חודש",
  "🗓️ גמיש",
  "🔭 עתידי",
]);
const CUSTOMER_HIDDEN_PREFIXES = ["*כוונה:* "];
/* התג נבנה תמיד בשורה משלו (appendYcLeadTag), אבל מסירים אותו גם מתוך שורה */
const YC_TAG_ANYWHERE = /\[YC:[^\]]*\]/g;

/** מסיר מהודעת הלקוח את השורות הפנימיות ואת תג [YC:]. טהורה. */
export function toCustomerWhatsAppText(text: string): string {
  const hadTag = text.includes("[YC:");
  const kept = text
    .split("\n")
    .flatMap((line) => {
      if (!line.includes("[YC:")) return [line];
      const withoutTag = line.replace(YC_TAG_ANYWHERE, "").trimEnd();
      /* שורה שהייתה רק תג יורדת כולה */
      return withoutTag.trim() ? [withoutTag] : [];
    })
    .filter((line) => {
      const t = line.trim();
      if (CUSTOMER_HIDDEN_LINES.has(t)) return false;
      return !CUSTOMER_HIDDEN_PREFIXES.some((p) => t.startsWith(p));
    });
  /* שורות ריקות שנשארו בראש ההודעה אחרי ההסרה, ובסופה כשהתג היה השורה האחרונה */
  while (kept.length && !kept[0].trim()) kept.shift();
  while (hadTag && kept.length && !kept[kept.length - 1].trim()) kept.pop();
  return kept.join("\n");
}

export type WhatsAppWidgetProps = {
  text?: string;
  utm_source?: string;
  utm_campaign?: string;
  phone?: string;
  className?: string;
  "aria-label"?: string;
};

/**
 * Builds a wa.me deep-link with every dynamic query value passed through
 * `encodeURIComponent` to preserve Hebrew text and prevent URL breakage.
 * Pass `source` to append "📍 מקור: ..." to the message body (not as a UTM param).
 */
export function buildWhatsAppHref({
  text,
  utm_source,
  utm_campaign,
  phone = CONTACT_PHONE_WHATSAPP,
  source,
}: Pick<
  WhatsAppWidgetProps,
  "text" | "utm_source" | "utm_campaign" | "phone"
> & { source?: string }): string {
  const customerText = text ? toCustomerWhatsAppText(text) : text;
  let fullText = source && customerText ? `${customerText}\n\n📍 מקור: ${source}` : customerText;
  /* קוד פנייה שכבר בטקסט נשאר השורה האחרונה, גם אחרי שורת המקור (D67) */
  const code = fullText ? findLeadCode(fullText) : null;
  if (fullText && code) fullText = withLeadCodeLine(fullText, code);
  const queryParts: string[] = [];

  if (fullText) {
    queryParts.push(`text=${encodeURIComponent(fullText)}`);
  }
  if (utm_source) {
    queryParts.push(`utm_source=${encodeURIComponent(utm_source)}`);
  }
  if (utm_campaign) {
    queryParts.push(`utm_campaign=${encodeURIComponent(utm_campaign)}`);
  }

  const query = queryParts.join("&");
  return query
    ? `https://wa.me/${encodeURIComponent(phone)}?${query}`
    : `https://wa.me/${encodeURIComponent(phone)}`;
}

/* ─── קוד פנייה בקישור (החלטת הבעלים D67, 7.10.2026) ─── */

const WA_HOSTS = new Set(["wa.me", "api.whatsapp.com"]);

type WhatsAppTextParts = { before: string; after: string; text: string };

/*
 * הטקסט מקישור וואטסאפ לעסק בלבד: wa.me/<המספר של האתר>?text=... קישור שיתוף
 * (wa.me/?text=) או קישור ללקוח מהמייל לבעלים לא מקבלים קוד. הפירוק ידני ולא
 * URLSearchParams, כדי שרווח יישאר %20 כמו ב-buildWhatsAppHref ולא יהפוך ל-+.
 */
function splitBusinessWhatsAppText(href: string): WhatsAppTextParts | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (!WA_HOSTS.has(url.hostname)) return null;
  const phone = url.hostname === "wa.me" ? url.pathname.replace(/\//g, "") : url.searchParams.get("phone") ?? "";
  if (phone !== CONTACT_PHONE_WHATSAPP) return null;
  const queryStart = href.indexOf("?");
  if (queryStart < 0) return null;
  const hashStart = href.indexOf("#", queryStart);
  const queryEnd = hashStart < 0 ? href.length : hashStart;
  const parts = href.slice(queryStart + 1, queryEnd).split("&");
  const index = parts.findIndex((p) => p.startsWith("text="));
  if (index < 0) return null;
  let text: string;
  try {
    text = decodeURIComponent(parts[index].slice("text=".length).replace(/\+/g, "%20"));
  } catch {
    return null;
  }
  if (!text.trim()) return null;
  return {
    before: `${href.slice(0, queryStart + 1)}${parts.slice(0, index).map((p) => `${p}&`).join("")}`,
    after: `${parts.slice(index + 1).map((p) => `&${p}`).join("")}${href.slice(queryEnd)}`,
    text,
  };
}

/** קוד הפנייה שכבר נמצא בהודעה שבקישור, או null */
export function readWhatsAppLeadCode(href: string): string | null {
  const parts = splitBusinessWhatsAppText(href);
  return parts ? findLeadCode(parts.text) : null;
}

/**
 * מוסיף לקישור הוואטסאפ לעסק את השורה "קוד פנייה: XXXX" בסוף ההודעה.
 * בלי code: קוד שכבר בהודעה נשאר (לחיצה שנייה על אותו קישור), אחרת נוצר חדש.
 * עם code: הקוד הזה, כדי שיהיה זהה לקוד שנשלח לבעלים במייל.
 * קישור שאינו לעסק, או בלי טקסט, חוזר כמו שהוא. טהורה חוץ מהמחולל.
 */
export function stampWhatsAppLeadCode(href: string, code?: string): string {
  const parts = splitBusinessWhatsAppText(href);
  if (!parts) return href;
  const existing = findLeadCode(parts.text);
  if (!code && existing) return href;
  const text = withLeadCodeLine(toCustomerWhatsAppText(parts.text), code ?? generateLeadCode());
  return `${parts.before}text=${encodeURIComponent(text)}${parts.after}`;
}
