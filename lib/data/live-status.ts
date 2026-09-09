import liveStatusData from "@/lib/data/live-status.json";
import { getPlaylistVideos } from "@/lib/data/video-portfolio";
import {
  getPlaylistConfig,
  VIDEO_PLAYLISTS,
  type PlaylistId,
} from "@/lib/data/video-playlists";
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

export type LiveStatusRealWork = { title: string; url: string; count: number };

/**
 * הוכחות אמיתיות מתיק העבודות לטיקר בעמוד הבית: שם הקטגוריה ומספר העבודות
 * שבאמת נמצאות בה, אותו מספר שעמוד התיק מציג.
 *
 * קודם היו כאן "רעיונות לפרויקטים" עם daysAgo קבוע, שהוצגו כ"הושלם לאחרונה:
 * היום" בכל יום מחדש, כולל שבת. החלטת הבעלים מ-7.9.2026: עבודות אמיתיות
 * בלבד, בלי תאריכים. ניסיון ביניים להציג כותרות יוטיוב גולמיות נכשל, כי הן
 * נושאות קידומות וזנבות SEO ("אולפן הקלטות במודיעין | תקליטן | ...") ואינן
 * קופי. לכן לכל פלייליסט יש tickerLabel מפורש, ופלייליסט בלי תווית לא מופיע. הבחירה דטרמיניסטית כדי שהשרת והלקוח יראו אותה רשימה.
 */
const TICKER_MIN_WORKS = 3;
const TICKER_MAX_ITEMS = 10;

export const LIVE_STATUS_REAL_WORKS: readonly LiveStatusRealWork[] = (
  Object.keys(VIDEO_PLAYLISTS) as PlaylistId[]
)
  .map((id) => {
    const config = getPlaylistConfig(id);
    const href = config?.serviceLink?.href;
    const title = config?.tickerLabel;
    if (!href || !title) return null;
    const count = getPlaylistVideos(id).length;
    if (count < TICKER_MIN_WORKS) return null;
    return { title, url: href, count };
  })
  .filter((w): w is LiveStatusRealWork => w !== null)
  .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title, "he"))
  .slice(0, TICKER_MAX_ITEMS);

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

export const AVAILABILITY_TONE_CLASS: Record<ResolvedAvailability["tone"], string> = {
  available: "text-emerald-700",
  busy: "text-orange-600",
  consultation: "text-blue-700",
  closed: "text-muted-foreground",
};
