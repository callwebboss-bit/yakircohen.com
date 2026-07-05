import type { BookCategoryId } from "@/lib/book-url";
import { buildBookHref } from "@/lib/book-url";
import { getAudienceRouteById } from "@/lib/data/book-audience-routes";

const STORAGE_PREFIX = "yakir-booking-draft:";
const STORAGE_KEY = "book-qualification";
const DRAFT_VERSION = 2;

export type BookQualificationDraft = {
  routeId: string;
  categoryId: BookCategoryId;
  answers: Record<string, string>;
  emotionalLabel?: string | null;
};

type Envelope = {
  v: number;
  savedAt: string;
  data: BookQualificationDraft;
};

export function readBookQualificationDraft(): { data: BookQualificationDraft; savedAt: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Envelope;
    if (parsed?.v !== DRAFT_VERSION || !parsed.data?.routeId) return null;
    return { data: parsed.data, savedAt: parsed.savedAt };
  } catch {
    return null;
  }
}

export function writeBookQualificationDraft(data: BookQualificationDraft): string {
  const savedAt = new Date().toISOString();
  const envelope: Envelope = { v: DRAFT_VERSION, savedAt, data };
  window.localStorage.setItem(STORAGE_PREFIX + STORAGE_KEY, JSON.stringify(envelope));
  return savedAt;
}

export function clearBookQualificationDraft(): void {
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function hasMeaningfulQualificationAnswers(answers: Record<string, string>): boolean {
  return Object.values(answers).some((v) => v.trim().length > 0);
}

export function buildQualificationResumeHref(routeId: string): string {
  const route = getAudienceRouteById(routeId);
  const params = new URLSearchParams({ route: routeId, qual: "1" });
  if (!route) {
    return `/book?${params.toString()}`;
  }
  const base = buildBookHref(route.categoryId).split("#")[0];
  return `${base}?${params.toString()}`;
}
