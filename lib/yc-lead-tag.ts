/**
 * תג [YC:...] לסנכרון לידים עם yakir-closer.
 */

export type YcScheduleId = "weekdays" | "motzash";

export type YcLeadTagInput = {
  service: string;
  price?: number | null;
  source: string;
  step?: number;
  schedule?: YcScheduleId | null;
  package?: string | null;
};

const YC_TAG_RE =
  /\[YC:service=([^|\]]+)(?:\|price=(\d+))?(?:\|schedule=(weekdays|motzash))?(?:\|package=([^|\]]+))?\|source=([^|\]]+)(?:\|step=(\d+))?\]/;

export function buildYcLeadTag({
  service,
  price,
  source,
  step = 1,
  schedule,
  package: pkg,
}: YcLeadTagInput): string {
  const parts = [`service=${service}`];
  if (price !== undefined && price !== null && price > 0) {
    parts.push(`price=${price}`);
  }
  if (schedule) {
    parts.push(`schedule=${schedule}`);
  }
  if (pkg) {
    parts.push(`package=${pkg}`);
  }
  parts.push(`source=${source}`, `step=${step}`);
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
  schedule: YcScheduleId | null;
  package: string | null;
};

export function parseYcLeadTag(text: string): ParsedYcLeadTag | null {
  const match = text.match(YC_TAG_RE);
  if (!match) return null;
  return {
    service: match[1],
    price: match[2] ? Number(match[2]) : null,
    schedule: (match[3] as YcScheduleId | undefined) ?? null,
    package: match[4] ?? null,
    source: match[5],
    step: match[6] ? Number(match[6]) : 1,
  };
}
