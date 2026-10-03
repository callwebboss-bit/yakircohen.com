import { CONTACT_PHONE_WHATSAPP } from "@/lib/constants";

/** Standard inquiry line - always names the service or package on the page.
 *  When startingPrice is provided it appends the starting price so the client
 *  enters the conversation already knowing what to expect.
 */
export function buildServiceWhatsAppText(subject: string, startingPrice?: string): string {
  const trimmed = subject.trim();
  const base = trimmed
    ? `שלום, אשמח לשמוע על ${trimmed}`
    : "שלום, אשמח לשמוע על השירות";
  return startingPrice ? `${base} - מחיר: ${startingPrice}` : base;
}

/*
 * שורות פנימיות שנבנות ב-buildClosingMessage (lib/whatsapp-closing.ts) בשביל
 * הבעלים, ושאסור שהלקוח ישלח מהטלפון שלו: "ליד פרימיום", דגלי תזמון ושורת
 * "כוונה" (LF-06). המייל לבעלים מקבל את הגוף המלא בנפרד בכל נקודת קריאה,
 * ולכן שם הן נשארות. תג [YC:...] נשאר גם כאן: הכלי המקומי של הבעלים קורא
 * אותו מתוך הודעת הוואטסאפ, וההחלטה עליו עדיין פתוחה.
 * הסינון לפי שורה שלמה בלבד, כדי לא לגעת בטקסט שהלקוח כתב.
 */
const CUSTOMER_HIDDEN_LINES = new Set([
  "🚨 ליד פרימיום",
  "⏰ דחוף",
  "📆 תוך חודש",
  "🗓️ גמיש",
  "🔭 עתידי",
]);
const CUSTOMER_HIDDEN_PREFIXES = ["*כוונה:* "];

/** מסיר מהודעת הלקוח את השורות הפנימיות. טהורה. */
export function toCustomerWhatsAppText(text: string): string {
  const kept = text
    .split("\n")
    .filter((line) => {
      const t = line.trim();
      if (CUSTOMER_HIDDEN_LINES.has(t)) return false;
      return !CUSTOMER_HIDDEN_PREFIXES.some((p) => t.startsWith(p));
    });
  /* שורות ריקות שנשארו בראש ההודעה אחרי ההסרה */
  while (kept.length && !kept[0].trim()) kept.shift();
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
  const fullText = source && customerText ? `${customerText}\n\n📍 מקור: ${source}` : customerText;
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
