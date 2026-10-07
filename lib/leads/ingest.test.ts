import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { afterEach, before, beforeEach, describe, it, mock } from "node:test";
/* ייבוא סטטי מורם בכל מקרה לראש הקובץ ב-ESM. callback-lead לא נוגע ב-store, ב-ingest או ב-redis */
import {
  buildCallbackLead,
  CALLBACK_PODCAST_CONTEXT,
  CALLBACK_PODCAST_SERVICE_OPTIONS,
} from "@/lib/leads/callback-lead";

/* בלי Upstash אמיתי ובלי Resend אמיתי: כל fetch עובר דרך המוק */
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;
delete process.env.LEAD_DRY_RUN;
delete process.env.ADMIN_WHATSAPP_ALERT;


type IngestMod = typeof import("@/lib/leads/ingest");
type StoreMod = typeof import("@/lib/leads/store");
let ingest: IngestMod;
let store: StoreMod;

before(async () => {
  ingest = await import("@/lib/leads/ingest");
  store = await import("@/lib/leads/store");
});

type Call = { url: string; body: Record<string, unknown> };
let calls: Call[] = [];

function mockFetch(handler: (url: string) => { status: number; json?: unknown }) {
  mock.method(globalThis, "fetch", async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    let body: Record<string, unknown> = {};
    try {
      body = JSON.parse(String(init?.body ?? "{}"));
    } catch {
      /* ignore */
    }
    calls.push({ url, body });
    const r = handler(url);
    return new Response(JSON.stringify(r.json ?? {}), {
      status: r.status,
      headers: { "Content-Type": "application/json" },
    });
  });
}

const resendCalls = () => calls.filter((c) => c.url.startsWith("https://api.resend.com"));

let n = 0;
function phone(): string {
  n += 1;
  return `05${String(30000000 + n).padStart(8, "0")}`;
}

function input(overrides: Partial<Parameters<IngestMod["ingestLead"]>[0]> = {}) {
  return {
    formId: "contact_quiz",
    subject: "ליד חדש",
    body: "שלום, אשמח להקליט",
    name: "נועה",
    phone: phone(),
    request: new Request("http://localhost:3000/api/lead-notify", { method: "POST" }),
    ip: "127.0.0.1",
    ...overrides,
  };
}

beforeEach(() => {
  calls = [];
  process.env.RESEND_API_KEY = "re_test_dummy";
  process.env.LEAD_NOTIFY_EMAIL = "owner@example.test";
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  delete process.env.LEAD_DRY_RUN;
});

afterEach(() => {
  mock.restoreAll();
});

describe("ingestLead", () => {
  it("ghost then final: the final is emailed as an update and stays status new (LF-03)", async () => {
    mockFetch(() => ({ status: 200, json: { id: "email-id" } }));
    const p = phone();
    const ghost = await ingest.ingestLead(
      input({ formId: "events_booking", phone: p, body: "טיוטה\n[partial: שלב סגירה - לא נשלח לוואטסאפ]" }),
    );
    assert.equal(ghost.notified, true);
    assert.equal(ghost.duplicate, false);

    const final = await ingest.ingestLead(
      input({ formId: "events_booking_wizard", phone: p, body: "הזמנה מלאה", submissionId: randomUUID() }),
    );
    assert.equal(final.notified, true);
    assert.equal(final.duplicate, "update");
    const sends = resendCalls();
    assert.equal(sends.length, 2);
    assert.match(String(sends[1].body.subject), /\[עדכון לליד קיים\]/);
    assert.match(String(sends[1].body.text), /הזמנה מלאה/);

    const saved = await store.getLead(final.leadId);
    assert.equal(saved?.status, "new");
    assert.equal(saved?.duplicateOf, ghost.leadId);
  });

  it("an Upstash 500 does not block the owner email (LF-07)", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://upstash.example.test";
    process.env.UPSTASH_REDIS_REST_TOKEN = "dummy";
    mockFetch((url) =>
      url.startsWith("https://upstash.example.test")
        ? { status: 500 }
        : { status: 200, json: { id: "email-id" } },
    );
    const errors = mock.method(console, "error", () => undefined);
    const r = await ingest.ingestLead(input());
    assert.equal(r.notified, true);
    assert.equal(r.stored, false);
    assert.equal(resendCalls().length, 1);
    assert.ok(errors.mock.calls.some((c) => c.arguments[0] === "[lead-store]"));
  });

  it("a Resend 403 means not notified", async () => {
    mockFetch(() => ({ status: 403, json: { message: "domain not verified" } }));
    const r = await ingest.ingestLead(input());
    assert.equal(r.notified, false);
    assert.equal(r.notConfigured, false);
  });

  it("a Resend failure falls back to the admin webhook when it is https", async () => {
    process.env.ADMIN_WHATSAPP_ALERT = "https://hook.example.test/lead";
    try {
      mockFetch((url) => (url.startsWith("https://hook.example.test") ? { status: 200 } : { status: 500 }));
      const r = await ingest.ingestLead(input());
      assert.equal(r.notified, true);
      assert.ok(calls.some((c) => c.url === "https://hook.example.test/lead"));
    } finally {
      delete process.env.ADMIN_WHATSAPP_ALERT;
    }
  });

  it("a Resend network error (fetch throws) still tries the webhook and does not throw", async () => {
    process.env.ADMIN_WHATSAPP_ALERT = "https://hook.example.test/lead";
    try {
      mock.method(globalThis, "fetch", async (url: RequestInfo | URL) => {
        calls.push({ url: String(url), body: {} });
        if (String(url).startsWith("https://api.resend.com")) throw new TypeError("fetch failed");
        return new Response("{}", { status: 200 });
      });
      mock.method(console, "error", () => undefined);
      const r = await ingest.ingestLead(input());
      assert.equal(r.notified, true);
      assert.ok(calls.some((c) => c.url === "https://hook.example.test/lead"));
    } finally {
      delete process.env.ADMIN_WHATSAPP_ALERT;
    }
  });

  it("no RESEND_API_KEY is notConfigured, not a silent success", async () => {
    delete process.env.RESEND_API_KEY;
    mockFetch(() => ({ status: 200 }));
    const r = await ingest.ingestLead(input());
    assert.equal(r.notified, false);
    assert.equal(r.notConfigured, true);
    assert.equal(resendCalls().length, 0);
  });

  it("the same submission after delivery is a repeat and is not emailed twice", async () => {
    mockFetch(() => ({ status: 200, json: { id: "email-id" } }));
    const same = input({ submissionId: randomUUID() });
    const first = await ingest.ingestLead(same);
    const second = await ingest.ingestLead({ ...same });
    assert.equal(first.notified, true);
    assert.equal(second.notified, true);
    assert.equal(second.duplicate, "repeat");
    assert.equal(second.leadId, first.leadId);
    assert.equal(resendCalls().length, 1);
  });

  it("soft flags prefix the subject with [לבדיקה]", async () => {
    mockFetch(() => ({ status: 200, json: { id: "email-id" } }));
    await ingest.ingestLead(input({ flags: ["spam_keyword"] }));
    assert.match(String(resendCalls()[0].body.subject), /^\[לבדיקה\] /);
  });

  it("a callback lead says so in the footer and the subject, without a WhatsApp claim", async () => {
    mockFetch(() => ({ status: 200, json: { id: "email-id" } }));
    await ingest.ingestLead(
      input({ formId: "song_offer_callback", subject: "שיחה חוזרת", contactChannel: "callback" }),
    );
    const sent = resendCalls()[0].body;
    assert.match(String(sent.subject), /^\[שיחה חוזרת\] /);
    assert.match(String(sent.text), /הלקוח ביקש שיחה חוזרת\. לא נשלחה לו הודעת וואטסאפ\.$/);
    assert.doesNotMatch(String(sent.text), /קיבל קישור לוואטסאפ/);
  });

  it("CallbackLeadForm: the owner email names the service the customer picked", async () => {
    mockFetch(() => ({ status: 200, json: { id: "email-id" } }));
    const lead = buildCallbackLead({
      name: "נועה",
      phone: phone(),
      selectedService: "הפקת פודקאסט אודיו מלאה",
      options: CALLBACK_PODCAST_SERVICE_OPTIONS,
      context: CALLBACK_PODCAST_CONTEXT,
      sourcePath: "/podcast",
    });
    await ingest.ingestLead(
      input({
        formId: lead.payload.formId,
        subject: lead.payload.subject,
        body: lead.payload.body,
        phone: lead.payload.phone,
        serviceType: lead.payload.serviceType,
        contactChannel: lead.payload.contactChannel,
      }),
    );
    const sent = resendCalls()[0].body;
    assert.match(
      String(sent.subject),
      /^\[שיחה חוזרת\] (\[דחוף\] )?\[יקיר כהן\] ליד חדש - פודקאסט \(הפקת פודקאסט אודיו מלאה\)$/,
    );
    assert.match(String(sent.text), /\*שירות:\* פודקאסט \(הפקת פודקאסט אודיו מלאה\)/);
    assert.match(String(sent.text), /service=podcast\|/);
    assert.match(String(sent.text), /source=\/podcast\|/);
    assert.match(String(sent.html), /ליד פודקאסט/);
  });

  it("a subject that already starts with the brand tag is not tagged twice", async () => {
    mockFetch(() => ({ status: 200, json: { id: "email-id" } }));
    await ingest.ingestLead(
      input({ subject: "[יקיר כהן] שיחה חוזרת: הקלטת שיר", contactChannel: "callback" }),
    );
    assert.equal(
      String(resendCalls()[0].body.subject),
      "[שיחה חוזרת] [יקיר כהן] שיחה חוזרת: הקלטת שיר",
    );
  });

  it("the callback mark comes after [לבדיקה] so a flagged lead still leads with review", async () => {
    mockFetch(() => ({ status: 200, json: { id: "email-id" } }));
    await ingest.ingestLead(input({ contactChannel: "callback", flags: ["spam_keyword"] }));
    assert.match(String(resendCalls()[0].body.subject), /^\[לבדיקה\] \[שיחה חוזרת\] /);
  });

  it("a WhatsApp lead keeps the WhatsApp footer and an unmarked subject", async () => {
    mockFetch(() => ({ status: 200, json: { id: "email-id" } }));
    await ingest.ingestLead(input({ contactChannel: "whatsapp" }));
    const sent = resendCalls()[0].body;
    assert.match(String(sent.text), /הלקוח גם קיבל קישור לוואטסאפ\.$/);
    assert.doesNotMatch(String(sent.subject), /שיחה חוזרת/);
  });

  it("no channel (old browser JS) gets a neutral footer, even for a callback formId", async () => {
    mockFetch(() => ({ status: 200, json: { id: "email-id" } }));
    await ingest.ingestLead(input({ formId: "song_offer_callback" }));
    const sent = resendCalls()[0].body;
    assert.match(String(sent.text), /נשלח אוטומטית מהאתר \(גיבוי לידים\)\.$/);
    assert.doesNotMatch(String(sent.text), /וואטסאפ\.$/);
    assert.doesNotMatch(String(sent.subject), /שיחה חוזרת\]/);
  });

  it("customer follow-ups are returned, not sent inline", async () => {
    mockFetch(() => ({ status: 200, json: { id: "email-id" } }));
    const r = await ingest.ingestLead(input({ email: "noa@example.com" }));
    assert.equal(resendCalls().length, 1);
    assert.equal(typeof r.followUps, "function");
    await r.followUps!();
    assert.equal(resendCalls().length, 3);
  });

  it("LEAD_DRY_RUN=1 never calls Resend and logs the email", async () => {
    process.env.LEAD_DRY_RUN = "1";
    mockFetch(() => ({ status: 200 }));
    const info = mock.method(console, "info", () => undefined);
    const r = await ingest.ingestLead(input());
    assert.equal(r.dryRun, true);
    assert.equal(r.notified, true);
    assert.equal(calls.length, 0);
    assert.ok(info.mock.calls.some((c) => c.arguments[0] === "[lead-dry-run]"));
  });

  it("LEAD_DRY_RUN=fail simulates a failed send", async () => {
    process.env.LEAD_DRY_RUN = "fail";
    mockFetch(() => ({ status: 200 }));
    mock.method(console, "info", () => undefined);
    const r = await ingest.ingestLead(input());
    assert.equal(r.notified, false);
    assert.equal(calls.length, 0);
  });

  it("LEAD_DRY_RUN is ignored in production", async () => {
    const prev = process.env.NODE_ENV;
    process.env.LEAD_DRY_RUN = "1";
    (process.env as Record<string, string>).NODE_ENV = "production";
    try {
      mockFetch(() => ({ status: 200, json: { id: "email-id" } }));
      const r = await ingest.ingestLead(input());
      assert.equal(r.dryRun, false);
      assert.equal(resendCalls().length, 1);
    } finally {
      if (prev === undefined) delete (process.env as Record<string, string | undefined>).NODE_ENV;
      else (process.env as Record<string, string>).NODE_ENV = prev;
    }
  });
});
