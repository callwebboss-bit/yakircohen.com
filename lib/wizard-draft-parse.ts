/** Shared runtime guards for wizard localStorage drafts. */

export function isRecord(v: unknown): v is Record<string, unknown> {
  return v != null && typeof v === "object" && !Array.isArray(v);
}

export function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

export function pickEnum<T extends string>(
  v: unknown,
  allowed: readonly T[],
): T | null {
  return typeof v === "string" && (allowed as readonly string[]).includes(v)
    ? (v as T)
    : null;
}

export function pickString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

export function pickBoolean(v: unknown, fallback = false): boolean {
  return typeof v === "boolean" ? v : fallback;
}

export function pickNonNegativeInt(v: unknown, fallback: number): number {
  return typeof v === "number" && v >= 0 && Number.isFinite(v) ? v : fallback;
}

export function pickPositiveInt(v: unknown, fallback: number): number {
  return typeof v === "number" && v >= 1 && Number.isFinite(v) ? v : fallback;
}
