/**
 * סיווג אירועי ה-webhook של Resend (תוכנית 1-8, סעיף 2, 11.10.2026).
 *
 * עד היום ה-webhook טיפל רק בפתיחה ובלחיצה. מייל לבעלים שחזר (bounce) או נחסם
 * לא השאיר שום עקבות: השרת ענה 200 ברגע ש-Resend קיבל את המייל, ואף אחד לא
 * ידע שהוא לא הגיע. סוגי האירועים: https://resend.com/docs/dashboard/webhooks/event-types
 */
export type ResendEventKind = "engagement" | "delivered" | "problem" | "delayed" | "ignore";

const ENGAGEMENT = new Set(["email.opened", "email.clicked"]);
/* המייל לא הגיע ולא יגיע: חזר, נכשל, סומן כספאם או נחסם ברשימת דיכוי */
const PROBLEM = new Set(["email.bounced", "email.failed", "email.complained", "email.suppressed"]);

export function classifyResendEvent(type: string): ResendEventKind {
  if (ENGAGEMENT.has(type)) return "engagement";
  if (type === "email.delivered") return "delivered";
  if (PROBLEM.has(type)) return "problem";
  /* עיכוב זמני: נרשם על הליד, בלי התראה. Resend ממשיך לנסות */
  if (type === "email.delivery_delayed") return "delayed";
  return "ignore";
}

/** תווית בעברית לעמודה ב-/admin/leads */
export function deliveryIssueLabel(type: string): string {
  switch (type) {
    case "email.bounced":
      return "חזר";
    case "email.failed":
      return "נכשל";
    case "email.complained":
      return "סומן כספאם";
    case "email.suppressed":
      return "נחסם";
    case "email.delivery_delayed":
      return "מתעכב";
    default:
      return type;
  }
}

/** בלי כתובות מייל בלוג שנשמר אצל צד שלישי */
export function redactEmails(text: string): string {
  return text.replace(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, "[email]");
}

/**
 * מה קרה למייל של הליד לבעלים, במילה אחת, לעמודה ב-/admin/leads.
 * בעיה גוברת על הכול, כי זה המקרה שבו הליד לא הגיע ולא יגיע.
 */
export function leadMailStatusLabel(lead: {
  resendEmailId?: string;
  deliveredAt?: string;
  openedAt?: string;
  deliveryIssue?: { type: string };
}): string {
  const issue = lead.deliveryIssue?.type;
  if (issue && classifyResendEvent(issue) === "problem") return `⚠ ${deliveryIssueLabel(issue)}`;
  if (lead.openedAt) return "נפתח";
  if (lead.deliveredAt) return "נמסר";
  if (issue) return deliveryIssueLabel(issue);
  if (lead.resendEmailId) return "נשלח";
  return "לא נשלח";
}
