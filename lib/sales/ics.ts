/**
 * "תזכיר לי" בעמדת המכירות (תוכנית עמדת המכירות, סעיף 5): קובץ יומן לעוד 24
 * או 48 שעות, עם התראה בזמן האירוע. תווית לבד בוואטסאפ היא רק תיוק, והתזכורת
 * ביומן היא מה שבאמת קופץ.
 *
 * בלי פרטים אישיים: בכותרת רק שירות ומחיר ("מעקב הצעה · שיר · <מחיר>"). הכותרת
 * מגיעה מהעמוד, ולכן מספר טלפון או מייל שהודבקו אליה בטעות נמחקים כאן.
 * הפורמט לפי RFC 5545: שורות CRLF, זמנים ב-UTC, ושורה ארוכה מקופלת ב-75 בתים.
 */

const ICS_LINE_OCTETS = 75;
const FOLLOW_UP_MINUTES = 15;
const PRODUCT_ID = "-//yakircohen.com//sales-desk//HE";
const UID_DOMAIN = "yakircohen.com";

/* מספר טלפון (9 ספרות ומעלה עם מקפים או רווחים) ומייל. מחיר עם פסיק אלפים לא נתפס. */
const PHONE_RE = /\+?\d(?:[\s-]?\d){8,}/g;
const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/g;

function stripPersonalData(text: string): string {
  return text.replace(EMAIL_RE, " ").replace(PHONE_RE, " ").replace(/\s+/g, " ").trim();
}

/** TEXT לפי RFC 5545 (סעיף 3.3.11): לוכסן הפוך, נקודה-פסיק, פסיק ושורה חדשה */
function escapeText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** 20261006T091500Z */
function utcStamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

/* קיפול לפי בתים ולא לפי תווים: אות עברית היא 2 בתים ב-UTF-8. שורת המשך מתחילה
   ברווח, שנספר בתוך ה-75 */
function foldLine(lineText: string): string {
  const encoder = new TextEncoder();
  const out: string[] = [];
  let current = "";
  let currentBytes = 0;
  for (const char of lineText) {
    const size = encoder.encode(char).length;
    const limit = out.length === 0 ? ICS_LINE_OCTETS : ICS_LINE_OCTETS - 1;
    if (currentBytes + size > limit) {
      out.push(current);
      current = "";
      currentBytes = 0;
    }
    current += char;
    currentBytes += size;
  }
  out.push(current);
  return out.join("\r\n ");
}

/** קובץ .ics לתזכורת מעקב, עם התראה בזמן האירוע */
export function buildFollowUpIcs({
  title,
  now,
  hoursFromNow,
}: {
  title: string;
  now: Date;
  hoursFromNow: 24 | 48;
}): string {
  const start = new Date(now.getTime() + hoursFromNow * 60 * 60 * 1000);
  const end = new Date(start.getTime() + FOLLOW_UP_MINUTES * 60 * 1000);
  const summary = escapeText(stripPersonalData(title) || "מעקב הצעה");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${PRODUCT_ID}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:followup-${now.getTime().toString(36)}-${hoursFromNow}h@${UID_DOMAIN}`,
    `DTSTAMP:${utcStamp(now)}`,
    `DTSTART:${utcStamp(start)}`,
    `DTEND:${utcStamp(end)}`,
    `SUMMARY:${summary}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${summary}`,
    "TRIGGER;RELATED=START:PT0S",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `${lines.map(foldLine).join("\r\n")}\r\n`;
}
