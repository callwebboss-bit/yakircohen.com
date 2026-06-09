/**
 * תג [YC:...] לסנכרון לידים עם yakir-closer.
 */

export type YcScheduleId = "weekdays" | "motzash";
export type YcIntentId = "start_now" | "continue_chat";

export type YcTimingId = "urgent" | "month" | "flexible" | "future";
export type YcPurposeId = "professional" | "personal" | "gift";

export type YcLeadTagInput = {
  service: string;
  price?: number | null;
  source: string;
  step?: number;
  schedule?: YcScheduleId | null;
  package?: string | null;
  intent?: YcIntentId | null;
  form?: string | null;
  /** Urgency from filter questions */
  timing?: YcTimingId | null;
  /** Purpose/goal from filter questions */
  purpose?: YcPurposeId | null;
};

const YC_TAG_RE =
  /\[YC:service=([^|\]]+)(?:\|price=(\d+))?(?:\|schedule=(weekdays|motzash))?(?:\|package=([^|\]]+))?(?:\|intent=(start_now|continue_chat))?(?:\|form=([^|\]]+))?(?:\|timing=([^|\]]+))?(?:\|purpose=([^|\]]+))?\|source=([^|\]]+)(?:\|step=(\d+))?\]/;

export function buildYcLeadTag({
  service,
  price,
  source,
  step = 1,
  schedule,
  package: pkg,
  intent,
  form,
  timing,
  purpose,
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
  if (intent) {
    parts.push(`intent=${intent}`);
  }
  if (form) {
    parts.push(`form=${form}`);
  }
  if (timing) {
    parts.push(`timing=${timing}`);
  }
  if (purpose) {
    parts.push(`purpose=${purpose}`);
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
  intent: YcIntentId | null;
  form: string | null;
  timing: YcTimingId | null;
  purpose: YcPurposeId | null;
};

export function parseYcLeadTag(text: string): ParsedYcLeadTag | null {
  const match = text.match(YC_TAG_RE);
  if (!match) return null;
  return {
    service: match[1],
    price: match[2] ? Number(match[2]) : null,
    schedule: (match[3] as YcScheduleId | undefined) ?? null,
    package: match[4] ?? null,
    intent: (match[5] as YcIntentId | undefined) ?? null,
    form: match[6] ?? null,
    timing: (match[7] as YcTimingId | undefined) ?? null,
    purpose: (match[8] as YcPurposeId | undefined) ?? null,
    source: match[9],
    step: match[10] ? Number(match[10]) : 1,
  };
}
