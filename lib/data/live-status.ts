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

/** Curated project ideas for the home status ticker — relative dates never go stale. */
export type LiveStatusProjectIdea = {
  title: string;
  url: string;
  /** Days before "today" for the relative label (0 = היום). */
  daysAgo: number;
};

export const LIVE_STATUS_PROJECT_IDEAS: readonly LiveStatusProjectIdea[] = [
  { title: "ברכת חתן וכלה", url: "/studio/blessings/bride-groom-blessing", daysAgo: 0 },
  { title: "הקלטת שיר באולפן", url: "/studio/recording-song-modiin", daysAgo: 1 },
  { title: "עריכת פרק פודקאסט", url: "/podcast/podcast-editing", daysAgo: 2 },
  { title: "דיג׳יי לחתונה", url: "/events/dj-events", daysAgo: 0 },
  { title: "ברכה לבר מצווה", url: "/studio/blessings/bar-mitzvah", daysAgo: 3 },
  { title: "קריינות לסרטון", url: "/voiceover/services", daysAgo: 1 },
  { title: "אולפן נייד עד הבית", url: "/studio/mobile-studio", daysAgo: 2 },
  { title: "שחזור ווקאל אונליין", url: "/online/vocal-fix", daysAgo: 0 },
  { title: "סרט תדמית לעסק", url: "/video/corporate-video", daysAgo: 4 },
  { title: "עשן כבד לחופה", url: "/events/attractions/wedding-smoking-machine", daysAgo: 1 },
  { title: "פודקאסט עם סבא", url: "/podcast/podcast-with-grandpa", daysAgo: 3 },
  { title: "שיר + קליפ באולפן", url: "/studio/blessings/video-clip", daysAgo: 2 },
];

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

export function formatDaysAgo(daysAgo: number): string {
  if (daysAgo <= 0) return "היום";
  if (daysAgo === 1) return "אתמול";
  if (daysAgo < 7) return `לפני ${daysAgo} ימים`;
  if (daysAgo < 14) return "לפני שבוע";
  if (daysAgo < 21) return "לפני שבועיים";
  if (daysAgo < 30) return `לפני ${Math.floor(daysAgo / 7)} שבועות`;
  const months = Math.floor(daysAgo / 30);
  if (months === 1) return "לפני חודש";
  if (months < 12) return `לפני ${months} חודשים`;
  return `לפני ${daysAgo} ימים`;
}

export function formatLastProjectDate(dateStr: string, now = new Date()): string {
  const date = parseIsraeliDate(dateStr);
  if (!date || isNaN(date.getTime())) return dateStr;

  const diffDays = Math.floor(
    (now.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0)) / 86_400_000,
  );

  return formatDaysAgo(diffDays);
}

export const AVAILABILITY_TONE_CLASS: Record<ResolvedAvailability["tone"], string> = {
  available: "text-emerald-700",
  busy: "text-orange-600",
  consultation: "text-blue-700",
  closed: "text-muted-foreground",
};
