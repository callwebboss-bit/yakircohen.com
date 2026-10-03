/**
 * איך הלקוח ביקש שנחזור אליו, כפי שהדפדפן מצהיר בחוזה השליחה
 * (submitLeadToServer). השרת לא מנחש לפי formId: טופס עם "callback" בשם
 * יכול לפתוח וואטסאפ, ולהפך.
 *
 * - "whatsapp": הדפדפן פתח ללקוח וואטסאפ עם ההודעה.
 * - "callback": הלקוח ביקש שיחה חוזרת, ולא נשלחה לו הודעת וואטסאפ.
 * - חסר או לא מוכר: ניסוח ניטרלי שלא טוען כלום על וואטסאפ. כך דפדפן עם JS
 *   ישן או טופס שלא הצהיר לא יגרום לשורה שקרית במייל לבעלים.
 *
 * מודול טהור, בלי תלות בשרת, כדי שגם הדפדפן וגם ingest ישתמשו בו.
 */
export const LEAD_CONTACT_CHANNELS = ["whatsapp", "callback"] as const;

export type LeadContactChannel = (typeof LEAD_CONTACT_CHANNELS)[number];

export const CALLBACK_SUBJECT_PREFIX = "[שיחה חוזרת] ";

const FOOTER_BASE = "נשלח אוטומטית מהאתר (גיבוי לידים).";

/** ערך מהרשת: רק ערוץ מוכר עובר, כל השאר undefined (ניסוח ניטרלי). */
export function parseLeadContactChannel(v: unknown): LeadContactChannel | undefined {
  return typeof v === "string" && (LEAD_CONTACT_CHANNELS as readonly string[]).includes(v)
    ? (v as LeadContactChannel)
    : undefined;
}

/** השורה האחרונה במייל לבעלים, לפי מה שהלקוח באמת קיבל. */
export function leadEmailFooter(channel: LeadContactChannel | undefined): string {
  if (channel === "callback") {
    return `${FOOTER_BASE} הלקוח ביקש שיחה חוזרת. לא נשלחה לו הודעת וואטסאפ.`;
  }
  if (channel === "whatsapp") {
    return `${FOOTER_BASE} הלקוח גם קיבל קישור לוואטסאפ.`;
  }
  return FOOTER_BASE;
}

/** בשיחה חוזרת הנושא מסומן, כדי שהבעלים יראה מיד שצריך להתקשר. */
export function leadSubjectChannelPrefix(channel: LeadContactChannel | undefined): string {
  return channel === "callback" ? CALLBACK_SUBJECT_PREFIX : "";
}

/**
 * ברירת המחדל של useLeadSubmit לפי מצב הוואטסאפ, כשהטופס לא הצהיר בעצמו:
 * "auto" פותח וואטסאפ, "none" הוא "נחזור אליכם", ו-"button" רק מציע קישור
 * במסך ההצלחה, כלומר לא ידוע אם הלקוח לחץ.
 */
export function contactChannelForWhatsAppMode(
  mode: "auto" | "button" | "none",
): LeadContactChannel | undefined {
  if (mode === "auto") return "whatsapp";
  if (mode === "none") return "callback";
  return undefined;
}
