import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { LeadSubmitState } from "@/hooks/useLeadSubmit";

describe("LeadSubmitState", () => {
  it("success state carries waHref and intent", () => {
    const state: LeadSubmitState = {
      status: "success",
      waHref: "https://wa.me/123",
      intent: "start_now",
    };
    assert.equal(state.status, "success");
    if (state.status === "success") {
      assert.match(state.waHref, /wa\.me/);
      assert.equal(state.intent, "start_now");
    }
  });

  it("idle and submitting are distinct statuses", () => {
    const idle: LeadSubmitState = { status: "idle" };
    const submitting: LeadSubmitState = { status: "submitting" };
    assert.notEqual(idle.status, submitting.status);
  });

  it("failed state keeps the same WhatsApp link for the fallback", () => {
    const state: LeadSubmitState = {
      status: "failed",
      waHref: "https://wa.me/123",
      intent: "continue_chat",
      reason: "server",
    };
    assert.equal(state.status, "failed");
    if (state.status === "failed") {
      assert.match(state.waHref, /wa\.me/);
      assert.equal(state.reason, "server");
    }
  });
});
