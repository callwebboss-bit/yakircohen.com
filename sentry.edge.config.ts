import * as Sentry from "@sentry/nextjs";

const PII_FIELDS = ["name", "phone", "email", "ip_address", "username"];
/* כותרות שאסור שיגיעו ל-Sentry בשום מצב. הקוקי של האדמין נושא אישור גישה
   לכל מסד הלידים, ו-requestDataIntegration אוסף כותרות וקוקיז כברירת מחדל
   גם כש-sendDefaultPii כבוי. בלי הסינון הזה, שגיאה אחת בזמן שאדמין מחובר
   מעבירה את האישור לכל מי שיש לו גישה לפרויקט ב-Sentry. */
const SECRET_HEADERS = ["cookie", "authorization", "x-admin-token", "proxy-authorization"];

function scrubRequest(event: { request?: Record<string, unknown> }): void {
  const req = event.request;
  if (!req) return;
  if (req.cookies) req.cookies = { "[Filtered]": "" };
  const headers = req.headers as Record<string, unknown> | undefined;
  if (headers && typeof headers === "object") {
    for (const key of Object.keys(headers)) {
      if (SECRET_HEADERS.includes(key.toLowerCase())) headers[key] = "[Filtered]";
    }
  }
  if (req.data && typeof req.data === "object") {
    const data = req.data as Record<string, unknown>;
    for (const field of PII_FIELDS) {
      if (field in data) data[field] = "[Filtered]";
    }
  }
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.VERCEL_ENV ?? "development",
  tracesSampleRate: 0.05,
  sendDefaultPii: false,
  debug: false,
  beforeSend(event) {
    if (event.user) event.user = {};
    scrubRequest(event as { request?: Record<string, unknown> });
    return event;
  },
});
