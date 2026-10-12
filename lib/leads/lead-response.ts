import { normalizeIlMobile } from "@/lib/leads/format-phone-il";
import type { LeadRecord } from "@/lib/leads/types";

/**
 * כמה מהר עונים לפנייה מהאתר (12.10.2026, רעיונות 4 ו-5 לעמדת המכירות).
 *
 * באתר כתוב "בדרך כלל תוך שעה" (למשל components/events/AudienceTabs.tsx).
 * עמודי הניהול מראים כמה זמן כל פנייה חדשה מחכה, ופותחים וואטסאפ או חיוג
 * ללקוח בלחיצה אחת במקום להעתיק מספר.
 *
 * מודול טהור: הזמן הנוכחי מגיע כפרמטר, כדי שהשרת והדפדפן יציגו אותו דבר
 * (בלי אי-התאמה ב-hydration) וכדי שהבדיקות יהיו יציבות.
 */

/** ההבטחה באתר: "בדרך כלל תוך שעה" */
export const LEAD_REPLY_PROMISE_MINUTES = 60;

/*
 * פנייה שעדיין "חדש" אחרי שלושה ימים כבר טופלה בוואטסאפ ולא עודכנה בלוח, או
 * שכבר אבודה. בלי החלון הזה המונה היה סופר כל ליד שלא הועבר עמודה, ומתרגלים
 * להתעלם ממנו.
 */
export const LEAD_WAITING_WINDOW_HOURS = 72;

const MINUTE_MS = 60 * 1000;

/** קישור וואטסאפ ללקוח, רק לנייד ישראלי תקין */
export function leadWhatsAppUrl(phone: string | undefined): string | null {
  const local = phone ? normalizeIlMobile(phone) : null;
  return local ? `https://wa.me/972${local.slice(1)}` : null;
}

/** קישור חיוג: נייד בפורמט בינלאומי, או קווי ישראלי (0 ועוד 8 או 9 ספרות) */
export function leadTelUrl(phone: string | undefined): string | null {
  if (!phone) return null;
  const local = normalizeIlMobile(phone);
  if (local) return `tel:+972${local.slice(1)}`;
  const digits = phone.replace(/\D/g, "");
  return /^0\d{8,9}$/.test(digits) ? `tel:${digits}` : null;
}

/** דקות מאז הפנייה, או null לתאריך לא תקין */
export function minutesSince(createdAt: string, nowMs: number): number | null {
  const at = Date.parse(createdAt);
  if (Number.isNaN(at)) return null;
  return Math.max(0, Math.floor((nowMs - at) / MINUTE_MS));
}

/** "לפני 25 דק׳", "לפני 3 שע׳", "לפני יומיים" */
export function waitingLabel(minutes: number): string {
  if (minutes < 1) return "עכשיו";
  if (minutes < 60) return `לפני ${minutes} דק׳`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? "לפני שעה" : `לפני ${hours} שע׳`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "לפני יום";
  if (days === 2) return "לפני יומיים";
  return `לפני ${days} ימים`;
}

/** פנייה שמחכה לתשובה: חדשה, בלי ספאם, בלי פנייה חוזרת ובלי טיוטה נטושה (כמו weekly-count) */
function isWaiting(lead: LeadRecord): boolean {
  return (
    lead.status === "new" && !lead.duplicateOf && !lead.subject.startsWith("טיוטה נטושה")
  );
}

export type WaitingSummary = {
  /** פניות שמחכות בתוך החלון */
  count: number;
  /** מהן, כמה מחכות יותר מההבטחה */
  overdue: number;
  /** כמה דקות מחכה הוותיקה שבהן, או null כשאין */
  oldestMinutes: number | null;
};

/** הפניות שמחכות לתשובה, בתוך החלון של 72 שעות */
export function summarizeWaitingLeads(leads: readonly LeadRecord[], nowMs: number): WaitingSummary {
  const windowMinutes = LEAD_WAITING_WINDOW_HOURS * 60;
  let count = 0;
  let overdue = 0;
  let oldestMinutes: number | null = null;
  for (const lead of leads) {
    if (!isWaiting(lead)) continue;
    const minutes = minutesSince(lead.createdAt, nowMs);
    if (minutes == null || minutes > windowMinutes) continue;
    count += 1;
    if (minutes > LEAD_REPLY_PROMISE_MINUTES) overdue += 1;
    if (oldestMinutes == null || minutes > oldestMinutes) oldestMinutes = minutes;
  }
  return { count, overdue, oldestMinutes };
}

/** תווית ההמתנה לפנייה בודדת, רק לפנייה שמחכה. לשאר null */
export function leadWaitingLabel(lead: LeadRecord, nowMs: number): { text: string; overdue: boolean } | null {
  if (!isWaiting(lead)) return null;
  const minutes = minutesSince(lead.createdAt, nowMs);
  if (minutes == null) return null;
  return { text: waitingLabel(minutes), overdue: minutes > LEAD_REPLY_PROMISE_MINUTES };
}
