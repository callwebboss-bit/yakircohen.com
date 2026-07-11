import type { BookIntakeCloserPayload } from "@/lib/book-intake/build-payload";

export type CloserTouchPayload = {
  event_type: "touch";
  source: string;
  page_path: string;
  timestamp: number;
  cta_type?: string;
};

export async function fireCloserWebhook(
  payload: BookIntakeCloserPayload | CloserTouchPayload,
): Promise<void> {
  const url = process.env.CLOSER_INTAKE_WEBHOOK_URL?.trim();
  if (!url) return;

  const token = process.env.CLOSER_INTAKE_TOKEN?.trim();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err) {
    console.warn("[closer-webhook] closer webhook failed", err);
  } finally {
    clearTimeout(timeout);
  }
}
