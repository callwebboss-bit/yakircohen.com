/**
 * תג [YC:...] לסנכרון לידים עם yakir-closer.
 */

export type YcScheduleId = "weekdays" | "motzash";
export type YcIntentId = "start_now" | "continue_chat";
export type YcScenarioId = "pairs" | "solo" | "group" | "save5";

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
  timing?: YcTimingId | null;
  purpose?: YcPurposeId | null;
  adults?: number | null;
  children?: number | null;
  recorders?: number | null;
  scenario?: YcScenarioId | null;
  ambiguous?: boolean | null;
  route?: string | null;
  emotional?: string | null;
  recordingType?: string | null;
  mobileGeo?: string | null;
  atmosphere?: string | null;
};

/** מיפוי תשובה רגשית מכרטיס /book ל-id בקלוזר */
export function emotionalLabelToId(label: string | null | undefined): string | null {
  if (!label?.trim()) return null;
  const map: Record<string, string> = {
    "להפתיע ולרגש": "surprise",
    "לשמור רגע לנצח": "memory",
    "כיף משפחתי ביחד": "fun",
    "עדיין לא בטוח/ה": "unsure",
  };
  return map[label.trim()] ?? null;
}

const YC_TAG_RE = /\[YC:[^\]]+\]/;

function parseTagMap(text: string): Record<string, string> | null {
  const match = text.match(/\[YC:([^\]]+)\]/);
  if (!match) return null;
  const map: Record<string, string> = {};
  for (const part of match[1].split("|")) {
    const idx = part.indexOf("=");
    if (idx > 0) map[part.slice(0, idx)] = part.slice(idx + 1);
  }
  if (!map.service || !map.source) return null;
  return map;
}

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
  adults,
  children,
  recorders,
  scenario,
  ambiguous,
  route,
  emotional,
  recordingType,
  mobileGeo,
  atmosphere,
}: YcLeadTagInput): string {
  const parts = [`service=${service}`];
  if (price !== undefined && price !== null && price > 0) {
    parts.push(`price=${price}`);
  }
  if (schedule) parts.push(`schedule=${schedule}`);
  if (pkg) parts.push(`package=${pkg}`);
  if (intent) parts.push(`intent=${intent}`);
  if (form) parts.push(`form=${form}`);
  if (timing) parts.push(`timing=${timing}`);
  if (purpose) parts.push(`purpose=${purpose}`);
  if (adults !== undefined && adults !== null && adults >= 0) {
    parts.push(`adults=${adults}`);
  }
  if (children !== undefined && children !== null && children >= 0) {
    parts.push(`children=${children}`);
  }
  if (recorders !== undefined && recorders !== null && recorders > 0) {
    parts.push(`recorders=${recorders}`);
  }
  if (scenario) parts.push(`scenario=${scenario}`);
  if (ambiguous) parts.push("ambiguous=1");
  if (route) parts.push(`route=${route}`);
  if (emotional) parts.push(`emotional=${emotional}`);
  if (recordingType) parts.push(`recordingType=${recordingType}`);
  if (mobileGeo) parts.push(`mobileGeo=${mobileGeo}`);
  if (atmosphere) parts.push(`atmosphere=${atmosphere}`);
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
  adults: number | null;
  children: number | null;
  recorders: number | null;
  scenario: YcScenarioId | null;
  ambiguous: boolean;
  route: string | null;
  emotional: string | null;
  recordingType: string | null;
  mobileGeo: string | null;
  atmosphere: string | null;
};

export function parseYcLeadTag(text: string): ParsedYcLeadTag | null {
  const map = parseTagMap(text);
  if (!map) return null;

  return {
    service: map.service,
    price: map.price ? Number(map.price) : null,
    schedule: (map.schedule as YcScheduleId | undefined) ?? null,
    package: map.package ?? null,
    intent: (map.intent as YcIntentId | undefined) ?? null,
    form: map.form ?? null,
    timing: (map.timing as YcTimingId | undefined) ?? null,
    purpose: (map.purpose as YcPurposeId | undefined) ?? null,
    source: map.source,
    step: map.step ? Number(map.step) : 1,
    adults: map.adults ? Number(map.adults) : null,
    children: map.children ? Number(map.children) : null,
    recorders: map.recorders ? Number(map.recorders) : null,
    scenario: (map.scenario as YcScenarioId | undefined) ?? null,
    ambiguous: map.ambiguous === "1",
    route: map.route ?? null,
    emotional: map.emotional ?? null,
    recordingType: map.recordingType ?? null,
    mobileGeo: map.mobileGeo ?? null,
    atmosphere: map.atmosphere ?? null,
  };
}
