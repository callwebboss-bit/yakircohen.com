/**
 * שורת הספירה השבועית בעמדת המחירים (החלטת הבעלים D95, 11.10.2026).
 *
 * הטפסים נספרים לבד מהלידים שבשרת. שאר המספרים יקיר מקליד פעם בשבוע:
 * צ'אטים בוואטסאפ עם "קוד פנייה", שיחות מלקוחות חדשים (ומהן "מהאתר"),
 * ועסקאות ששולמו (D22, ומהן עם קוד, D25). נשמרות ספירות בלבד, בלי שמות
 * ובלי מספרי טלפון, עד בדיקת הפרטיות של שלב 2 (D29, DATA-MODEL.md).
 */
import type { LeadRecord, ServiceType } from "@/lib/leads/types";
import { redisCommand } from "@/lib/leads/redis";

export const WEEKLY_MANUAL_FIELDS = [
  { key: "whatsappWithCode", label: "וואטסאפ עם קוד פנייה" },
  { key: "callsNew", label: "שיחות מלקוחות חדשים" },
  { key: "callsFromSite", label: "מהן אמרו 'מהאתר'" },
  { key: "dealsPaid", label: "עסקאות ששולמו (מקדמה או מלא)" },
  { key: "dealsWithCode", label: "מהן עם קוד פנייה" },
] as const;

export type WeeklyManualKey = (typeof WEEKLY_MANUAL_FIELDS)[number]["key"];
export type WeeklyManualCounts = Partial<Record<WeeklyManualKey, number>> & { updatedAt?: string };

const KEY_PREFIX = "weekly-counts:";
/* שנה ועוד קצת, כדי שאפשר יהיה להשוות לאותו שבוע בשנה הקודמת */
const TTL_SECONDS = 60 * 60 * 24 * 400;
export const WEEKLY_MAX_COUNT = 999;

/** יום ראשון של השבוע, לפי שעון ישראל, כ-YYYY-MM-DD */
export function weekStartIsrael(now: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const local = new Date(Date.UTC(Number(get("year")), Number(get("month")) - 1, Number(get("day"))));
  local.setUTCDate(local.getUTCDate() - Math.max(dayIndex, 0));
  return local.toISOString().slice(0, 10);
}

/** הוספת ימים לתאריך YYYY-MM-DD */
export function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** תחילת יום בשעון ישראל, כרגע UTC. ישראל ב-UTC+2 או UTC+3 */
function israelDayStartMs(isoDate: string): number {
  const noonUtc = new Date(`${isoDate}T12:00:00Z`);
  const offsetHours = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jerusalem", hour: "2-digit", hour12: false })
      .format(noonUtc)
      .replace(/\D/g, ""),
  ) - 12;
  return Date.parse(`${isoDate}T00:00:00Z`) - offsetHours * 60 * 60 * 1000;
}

export type WeeklyFormCount = { total: number; byService: Partial<Record<ServiceType, number>> };

/**
 * טפסים מהשבוע: בלי ספאם, בלי טיוטות נטושות ובלי פנייה חוזרת מאותו לקוח
 * (duplicateOf), כי אף אחד מהם אינו פנייה חדשה.
 */
export function countWeeklyFormLeads(leads: readonly LeadRecord[], weekStart: string): WeeklyFormCount {
  const from = israelDayStartMs(weekStart);
  const to = israelDayStartMs(addDays(weekStart, 7));
  const byService: Partial<Record<ServiceType, number>> = {};
  let total = 0;
  for (const lead of leads) {
    const at = Date.parse(lead.createdAt);
    if (!(at >= from && at < to)) continue;
    if (lead.status === "spam" || lead.duplicateOf || lead.subject.startsWith("טיוטה נטושה")) continue;
    total += 1;
    byService[lead.serviceType] = (byService[lead.serviceType] ?? 0) + 1;
  }
  return { total, byService };
}

/** מספר שלם בין 0 ל-999, או undefined לשדה ריק. כל דבר אחר נדחה */
export function parseWeeklyCount(raw: unknown): number | undefined | null {
  const text = String(raw ?? "").trim();
  if (!text) return undefined;
  if (!/^\d{1,3}$/.test(text)) return null;
  const n = Number(text);
  return n <= WEEKLY_MAX_COUNT ? n : null;
}

export async function getWeeklyManualCounts(weekStart: string): Promise<WeeklyManualCounts> {
  const raw = await redisCommand(["GET", `${KEY_PREFIX}${weekStart}`]);
  if (typeof raw !== "string") return {};
  try {
    return JSON.parse(raw) as WeeklyManualCounts;
  } catch {
    return {};
  }
}

export async function saveWeeklyManualCounts(weekStart: string, counts: WeeklyManualCounts): Promise<void> {
  await redisCommand([
    "SET",
    `${KEY_PREFIX}${weekStart}`,
    JSON.stringify({ ...counts, updatedAt: new Date().toISOString() }),
    "EX",
    TTL_SECONDS,
  ]);
}
