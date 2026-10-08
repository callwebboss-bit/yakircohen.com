import assert from "node:assert/strict";
import test from "node:test";
import { fireCloserWebhook } from "@/lib/closer-webhook";

test("fireCloserWebhook: לא שולח שום בקשה, גם כשהמשתנים מוגדרים", async () => {
  const realFetch = globalThis.fetch;
  const before = {
    url: process.env.CLOSER_INTAKE_WEBHOOK_URL,
    token: process.env.CLOSER_INTAKE_TOKEN,
  };
  let calls = 0;
  globalThis.fetch = (async () => {
    calls += 1;
    return new Response(null, { status: 200 });
  }) as typeof fetch;
  process.env.CLOSER_INTAKE_WEBHOOK_URL = "https://example.invalid/closer";
  process.env.CLOSER_INTAKE_TOKEN = "test-token";
  try {
    await fireCloserWebhook({
      event_type: "touch",
      source: "test",
      page_path: "/",
      timestamp: 1,
    });
    assert.equal(calls, 0);
  } finally {
    globalThis.fetch = realFetch;
    if (before.url === undefined) delete process.env.CLOSER_INTAKE_WEBHOOK_URL;
    else process.env.CLOSER_INTAKE_WEBHOOK_URL = before.url;
    if (before.token === undefined) delete process.env.CLOSER_INTAKE_TOKEN;
    else process.env.CLOSER_INTAKE_TOKEN = before.token;
  }
});
