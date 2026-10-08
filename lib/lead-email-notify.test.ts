import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { findLeadCode } from "@/lib/lead-code";
import {
  attachLeadCode,
  buildLeadNotifyBody,
  interpretLeadError,
  interpretLeadResponse,
} from "@/lib/lead-email-notify";
import { buildWhatsAppHref, readWhatsAppLeadCode, stampWhatsAppLeadCode } from "@/lib/whatsapp";
import { buildClosingMessage } from "@/lib/whatsapp-closing";

/* החלטת ההצלחה היחידה של כל הטפסים (LF-02): 200 ו-ok:true, ושום דבר אחר */
describe("interpretLeadResponse", () => {
  it("200 with ok:true is success", () => {
    assert.deepEqual(interpretLeadResponse(200, { ok: true, leadId: "abc", duplicate: "update" }), {
      ok: true,
      leadId: "abc",
      duplicate: "update",
      dryRun: undefined,
    });
  });

  it("200 with ok:false or no JSON is a server failure", () => {
    assert.deepEqual(interpretLeadResponse(200, { ok: false }), { ok: false, reason: "server", status: 200 });
    assert.deepEqual(interpretLeadResponse(200, null), { ok: false, reason: "server", status: 200 });
  });

  it("400 is rejected", () => {
    assert.deepEqual(interpretLeadResponse(400, { ok: false, error: "rejected" }), {
      ok: false,
      reason: "rejected",
      status: 400,
    });
  });

  it("429 is rate limited", () => {
    assert.deepEqual(interpretLeadResponse(429, {}), { ok: false, reason: "rate_limited", status: 429 });
  });

  it("502 not_notified and 503 not_configured are server failures", () => {
    assert.deepEqual(interpretLeadResponse(502, { ok: false, error: "not_notified" }), {
      ok: false,
      reason: "server",
      status: 502,
    });
    assert.equal(interpretLeadResponse(503, {}).ok, false);
  });
});

describe("interpretLeadError", () => {
  it("a thrown fetch is a network failure", () => {
    assert.deepEqual(interpretLeadError(new TypeError("Failed to fetch")), { ok: false, reason: "network" });
  });

  it("an abort is a timeout", () => {
    const err = new Error("aborted");
    err.name = "AbortError";
    assert.deepEqual(interpretLeadError(err), { ok: false, reason: "timeout" });
  });
});

/* החלטת הבעלים D67, 7.10.2026: אותו קוד פנייה במייל לבעלים ובהודעת הלקוח */
describe("attachLeadCode", () => {
  const body = buildClosingMessage({
    serviceLabel: "הקלטה באולפן",
    contact: { name: "נועה", phone: "050-123-4567" },
    priceExVat: 500,
    closerServiceId: "recording",
    ycForm: "contact_quiz",
  });
  const waHref = buildWhatsAppHref({ text: body, utm_source: "website" });
  const payload = { formId: "contact_quiz", subject: "ליד חדש", body };

  it("one code in the owner body and in the customer's WhatsApp text", () => {
    const coded = attachLeadCode(payload, waHref);
    assert.match(coded.code, /^[A-HJKMNP-Z2-9]{4}$/);
    assert.equal(findLeadCode(coded.payload.body), coded.code);
    assert.equal(readWhatsAppLeadCode(coded.waHref), coded.code);
    /* המייל שומר את הפרטים המלאים והתג, הלקוח רק את הקוד */
    assert.ok(coded.payload.body.includes("[YC:"));
    const customer = new URL(coded.waHref).searchParams.get("text") ?? "";
    assert.ok(!customer.includes("[YC:"));
    assert.ok(customer.endsWith(`קוד פנייה: ${coded.code}`));
  });

  it("the browser's notify body still carries the code", () => {
    const coded = attachLeadCode(payload, waHref);
    assert.equal(findLeadCode(buildLeadNotifyBody(coded.payload)), coded.code);
  });

  it("keeps a code that is already there, so a retry or success link has the same one", () => {
    const first = attachLeadCode(payload, waHref);
    const again = attachLeadCode(first.payload, first.waHref);
    assert.equal(again.code, first.code);
    assert.equal(again.payload.body, first.payload.body);
    assert.equal(again.waHref, first.waHref);

    const fromHref = attachLeadCode(payload, stampWhatsAppLeadCode(waHref, "A7K2"));
    assert.equal(fromHref.code, "A7K2");
    assert.equal(findLeadCode(fromHref.payload.body), "A7K2");
  });

  it("works without a WhatsApp link (callback only) and with a known code", () => {
    const coded = attachLeadCode(payload, undefined, "a7k2");
    assert.equal(coded.code, "A7K2");
    assert.equal(coded.waHref, "");
    assert.equal(findLeadCode(coded.payload.body), "A7K2");
    assert.match(attachLeadCode(payload, "", "nope").code, /^[A-HJKMNP-Z2-9]{4}$/);
  });
});
