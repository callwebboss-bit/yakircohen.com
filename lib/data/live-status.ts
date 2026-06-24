import liveStatusData from "@/lib/data/live-status.json";
import {
  getHoursAvailabilityHint,
  isShabbatOrAfterFriday,
  isStudioOpen,
} from "@/lib/studio-hours";

export type AvailabilityMode = "available" | "busy" | "consultation";

export type LiveStatusConfig = {
  availability: {
    mode: AvailabilityMode;
    busyUntil: string | null;
    customLabel: string | null;
  };
  lastProject: {
    title: string;
    date: string;
    url: string;
  };
  updatedAt: string;
};

export type ResolvedAvailability = {
  label: string;
  tone: "available" | "busy" | "consultation" | "closed";
};

const MODE_LABELS: Record<AvailabilityMode, string> = {
  available: "זמין להקלטות ואירועים",
  busy: "עסוק כרגע",
  consultation: "זמין לייעוץ מהיר",
};

export function getLiveStatusConfig(): LiveStatusConfig {
  return liveStatusData as LiveStatusConfig;
}

export function resolveAvailabilityLabel(
  config: LiveStatusConfig,
  now = new Date(),
): ResolvedAvailability {
  if (config.availability.customLabel?.trim()) {
    return {
      label: config.availability.customLabel.trim(),
      tone: config.availability.mode,
    };
  }

  if (isShabbatOrAfterFriday(now)) {
    return { label: getHoursAvailabilityHint(now), tone: "closed" };
  }

  const { mode, busyUntil } = config.availability;

  if (mode === "busy") {
    const label = busyUntil?.trim()
      ? `עסוק עד ${busyUntil.trim()}`
      : MODE_LABELS.busy;
    return { label, tone: "busy" };
  }

  if (mode === "consultation") {
    return { label: MODE_LABELS.consultation, tone: "consultation" };
  }

  if (!isStudioOpen(now)) {
    return { label: getHoursAvailabilityHint(now), tone: "closed" };
  }

  return { label: MODE_LABELS.available, tone: "available" };
}

function parseIsraeliDate(dateStr: string): Date | null {
  const parts = dateStr.split(".");
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
}

export function formatLastProjectDate(dateStr: string, now = new Date()): string {
  const date = parseIsraeliDate(dateStr);
  if (!date || isNaN(date.getTime())) return dateStr;

  const diffDays = Math.floor(
    (now.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0)) / 86_400_000,
  );

  if (diffDays === 0) return "היום";
  if (diffDays === 1) return "אתמול";
  if (diffDays < 7) return `לפני ${diffDays} ימים`;
  if (diffDays < 14) return "לפני שבוע";
  if (diffDays < 21) return "לפני שבועיים";
  if (diffDays < 30) return `לפני ${Math.floor(diffDays / 7)} שבועות`;
  const months = Math.floor(diffDays / 30);
  if (months === 1) return "לפני חודש";
  if (months < 12) return `לפני ${months} חודשים`;
  return dateStr;
}

export const AVAILABILITY_TONE_CLASS: Record<ResolvedAvailability["tone"], string> = {
  available: "text-emerald-700",
  busy: "text-orange-600",
  consultation: "text-blue-700",
  closed: "text-muted-foreground",
};
