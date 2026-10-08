import type { BookIntakeCloserPayload } from "@/lib/book-intake/build-payload";

export type CloserTouchPayload = {
  event_type: "touch";
  source: string;
  page_path: string;
  timestamp: number;
  cta_type?: string;
};

/**
 * מושבת. החלטת הבעלים 8.10.2026: yakir-closer הוא כלי פנימי של יקיר בלבד ולא
 * מקבל שום דבר מהאתר. הפונקציה נשארת כדי שהנתיבים /api/lead-intake ו-/api/lead-touch
 * והרכיבים בצד הלקוח ימשיכו לעבוד בלי שינוי, אבל היא לא שולחת בקשה לשום כתובת,
 * גם אם CLOSER_INTAKE_WEBHOOK_URL ו-CLOSER_INTAKE_TOKEN עדיין מוגדרים ב-Vercel.
 * lib/closer-webhook.test.ts מוכיח את זה. להסרה מלאה: למחוק את שני המשתנים מ-Vercel,
 * ואז את /api/lead-touch ואת fireLeadTouch (הם שולחים רק לקלוסר).
 */
export async function fireCloserWebhook(
  payload: BookIntakeCloserPayload | CloserTouchPayload,
): Promise<void> {
  void payload;
}
