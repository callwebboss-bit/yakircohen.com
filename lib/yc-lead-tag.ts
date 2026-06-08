/**
 * תג [YC:...] לסנכרון לידים עם yakir-closer.
 */

export type YcLeadTagInput = {
  service: string;
  price?: number | null;
  source: string;
  step?: number;
};

const YC_TAG_RE =
  /\[YC:service=([^|\]]+)(?:\|price=(\d+))?\|source=([^|\]]+)(?:\|step=(\d+))?\]/;

export function buildYcLeadTag({
  service,
  price,
  source,
  step = 1,
}: YcLeadTagInput): string {
  const parts = [`service=${service}`, `source=${source}`, `step=${step}`];
  if (price !== undefined && price !== null && price > 0) {
    parts.splice(1, 0, `price=${price}`);
  }
  return `[YC:${parts.join("|")}]`;
}

export function appendYcLeadTag(message: string, tag: YcLeadTagInput): string {
  const trimmed = message.trim();
  const line = buildYcLeadTag(tag);
  if (YC_TAG_RE.test(trimmed)) {
    return trimmed.replace(YC_TAG_RE, line);
  }
  return `${trimmed}\n${line}`;
}

export type ParsedYcLeadTag = {
  service: string;
  price: number | null;
  source: string;
  step: number;
};

export function parseYcLeadTag(text: string): ParsedYcLeadTag | null {
  const match = text.match(YC_TAG_RE);
  if (!match) return null;
  return {
    service: match[1],
    price: match[2] ? Number(match[2]) : null,
    source: match[3],
    step: match[4] ? Number(match[4]) : 1,
  };
}
