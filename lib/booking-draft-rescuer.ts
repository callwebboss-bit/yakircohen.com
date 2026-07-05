import { buildBookHref, type BookCategoryId } from "@/lib/book-url";
import {
  buildQualificationResumeHref,
  hasMeaningfulQualificationAnswers,
  readBookQualificationDraft,
} from "@/lib/book-qualification-draft";
import { getAudienceRouteById } from "@/lib/data/book-audience-routes";
import { PODCAST_PACKAGES } from "@/lib/data/podcast-calculator";
import { STUDIO_RECORDING_PACKAGES } from "@/lib/data/studio-recording-booking";
import { EVENT_BOOKING_ITEMS } from "@/lib/data/events-booking";
import { SINGER_PACKAGES } from "@/lib/data/singer-amplification-page";
import { PRIVATE_SESSION_PLANS } from "@/lib/data/academy-private-sessions";
import { isRecord } from "@/lib/wizard-draft-parse";

const STORAGE_PREFIX = "yakir-booking-draft:";
const DRAFT_VERSION = 2;

export type RescuableDraft = {
  category: BookCategoryId;
  storageKey: string;
  step: number;
  packageLabel: string;
  stepLabel: string;
  resumeHref: string;
  savedAt: string;
};

type DraftMeta = {
  storageKey: string;
  category: BookCategoryId;
  stepLabels: readonly string[];
};

const DRAFT_REGISTRY: readonly DraftMeta[] = [
  {
    storageKey: "podcast",
    category: "podcast",
    stepLabels: ["חבילה", "פרטים", "סיכום"],
  },
  {
    storageKey: "studio-recording",
    category: "studio",
    stepLabels: ["איסוף נתונים", "התאמת פתרון", "יציאה לביצוע"],
  },
  {
    storageKey: "events",
    category: "events",
    stepLabels: ["אטרקציות", "פרטים", "סיכום"],
  },
  {
    storageKey: "singer_amplification",
    category: "singer",
    stepLabels: ["בחירת מערכת", "פרטי ההופעה", "אישור"],
  },
  {
    storageKey: "dj-events",
    category: "dj",
    stepLabels: ["בחירת חבילה", "פרטי אירוע", "סיכום"],
  },
  {
    storageKey: "photography",
    category: "photography",
    stepLabels: ["הגדרות צילום", "פרטי קשר", "סיכום"],
  },
  {
    storageKey: "clips",
    category: "clips",
    stepLabels: ["בחירת שירותים", "פרטי קשר", "סיכום"],
  },
  {
    storageKey: "academy",
    category: "academy",
    stepLabels: ["בחירת מפגש", "פרטי קשר", "סיכום"],
  },
  {
    storageKey: "online-restore",
    category: "online",
    stepLabels: ["תיאור הבעיה", "פרטי קשר", "סיכום"],
  },
];

function readEnvelope(
  storageKey: string,
): { data: unknown; savedAt: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { v?: number; savedAt?: string; data?: unknown };
    if (parsed?.v !== DRAFT_VERSION || !parsed.data) return null;
    return { data: parsed.data, savedAt: parsed.savedAt ?? new Date().toISOString() };
  } catch {
    return null;
  }
}

function resolvePackageLabel(
  category: BookCategoryId,
  data: unknown,
): string {
  if (!isRecord(data)) return "הזמנה";

  switch (category) {
    case "podcast": {
      const id = typeof data.packageId === "string" ? data.packageId : "";
      return PODCAST_PACKAGES.find((p) => p.id === id)?.name ?? "פודקאסט";
    }
    case "studio": {
      const id = typeof data.packageId === "string" ? data.packageId : "";
      return STUDIO_RECORDING_PACKAGES.find((p) => p.id === id)?.name ?? "הקלטת אולפן";
    }
    case "events": {
      const ids = Array.isArray(data.selected)
        ? (data.selected as string[]).filter(Boolean)
        : [];
      if (ids.length === 1) {
        return EVENT_BOOKING_ITEMS.find((i) => i.id === ids[0])?.name ?? "אירוע";
      }
      if (ids.length > 1) return `חבילת אירוע (${ids.length} פריטים)`;
      return "אירוע";
    }
    case "singer": {
      const id = typeof data.packageId === "string" ? data.packageId : "";
      return SINGER_PACKAGES.find((p) => p.id === id)?.name ?? "הגברת זמר";
    }
    case "dj": {
      if (data.festivalSelected) return 'חבילת "פסטיבל"';
      const djId = typeof data.djId === "string" ? data.djId : "";
      if (djId === "dj_yakir") return "DJ יקיר כהן";
      if (djId === "dj_team") return "DJ מהצוות";
      return "DJ לאירועים";
    }
    case "photography": {
      const hours = typeof data.hours === "number" ? data.hours : null;
      return hours ? `צילום ${hours} שעות` : "צילום אירועים";
    }
    case "clips": {
      const count = Array.isArray(data.selected) ? data.selected.length : 0;
      return count > 0 ? `קליפים (${count} שירותים)` : "קליפים ודיגיטל";
    }
    case "academy": {
      const id = typeof data.planId === "string" ? data.planId : "";
      return PRIVATE_SESSION_PLANS.find((p) => p.id === id)?.name ?? "שיעור פרטי";
    }
    case "online": {
      const issue = typeof data.issue === "string" ? data.issue.trim() : "";
      return issue ? `שחזור סאונד - ${issue.slice(0, 24)}` : "שחזור סאונד";
    }
    default:
      return "הזמנה";
  }
}

function resolveStep(data: unknown): number {
  if (!isRecord(data)) return 0;
  return typeof data.step === "number" ? Math.max(0, data.step) : 0;
}

/** סורק טיוטות וויזארד שלא הושלמו, מחזיר את העדכנית ביותר עם step >= 1 */
export function scanBookingDrafts(): RescuableDraft | null {
  if (typeof window === "undefined") return null;

  let best: RescuableDraft | null = null;

  const qualSaved = readBookQualificationDraft();
  if (
    qualSaved &&
    hasMeaningfulQualificationAnswers(qualSaved.data.answers)
  ) {
    const route = getAudienceRouteById(qualSaved.data.routeId);
    best = {
      category: qualSaved.data.categoryId,
      storageKey: "book-qualification",
      step: 1,
      packageLabel: route?.title ?? "השלמת פרטים להצעה",
      stepLabel: "השלמת פרטים",
      resumeHref: buildQualificationResumeHref(qualSaved.data.routeId),
      savedAt: qualSaved.savedAt,
    };
  }

  for (const meta of DRAFT_REGISTRY) {
    const envelope = readEnvelope(meta.storageKey);
    if (!envelope) continue;

    const step = resolveStep(envelope.data);
    if (step < 1) continue;

    const packageLabel = resolvePackageLabel(meta.category, envelope.data);
    const stepLabel = meta.stepLabels[step] ?? `שלב ${step + 1}`;
    const resumeHref = `${buildBookHref(meta.category)}#${meta.category}/step/${step}`;

    const candidate: RescuableDraft = {
      category: meta.category,
      storageKey: meta.storageKey,
      step,
      packageLabel,
      stepLabel,
      resumeHref,
      savedAt: envelope.savedAt,
    };

    if (!best || candidate.savedAt > best.savedAt) {
      best = candidate;
    }
  }

  return best;
}

export function sessionRescuerDismissKey(category: BookCategoryId): string {
  return `yc_session_rescuer_dismissed:${category}`;
}
