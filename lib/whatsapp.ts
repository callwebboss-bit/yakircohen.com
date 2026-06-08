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
  const fullText = source && text ? `${text}\n\n📍 מקור: ${source}` : text;
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
