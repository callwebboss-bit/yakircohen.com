export type ContactQuizDraft = {
  step: number;
  service: string | null;
  timing: string | null;
  budget: string | null;
  name: string;
  phone: string;
  email: string;
  message: string;
};

const SERVICE_KEYS = new Set([
  "studio",
  "dj",
  "voice",
  "podcast",
  "clip",
  "online",
  "other",
]);
const TIMING_KEYS = new Set(["urgent", "month", "flexible", "future"]);
const BUDGET_KEYS = new Set(["minimal", "standard", "fullpower"]);

function pickString(raw: unknown, max: number): string {
  return typeof raw === "string" ? raw.slice(0, max) : "";
}

function pickNullableKey(raw: unknown, allowed: Set<string>): string | null {
  return typeof raw === "string" && allowed.has(raw) ? raw : null;
}

function pickStep(raw: unknown): number {
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n)) return 1;
  return Math.min(4, Math.max(1, Math.round(n)));
}

export function parseContactQuizDraft(raw: unknown): ContactQuizDraft | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  return {
    step: pickStep(o.step),
    service: pickNullableKey(o.service, SERVICE_KEYS),
    timing: pickNullableKey(o.timing, TIMING_KEYS),
    budget: pickNullableKey(o.budget, BUDGET_KEYS),
    name: pickString(o.name, 80),
    phone: pickString(o.phone, 24),
    email: pickString(o.email, 120),
    message: pickString(o.message, 2000),
  };
}

export const CONTACT_QUIZ_DRAFT_INITIAL: ContactQuizDraft = {
  step: 1,
  service: null,
  timing: null,
  budget: null,
  name: "",
  phone: "",
  email: "",
  message: "",
};
