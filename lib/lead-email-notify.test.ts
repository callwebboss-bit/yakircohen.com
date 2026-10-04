import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { interpretLeadError, interpretLeadResponse } from "@/lib/lead-email-notify";

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
