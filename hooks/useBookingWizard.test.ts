import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createBookingWizardReducer, deriveSubmitView } from "@/hooks/useBookingWizard";

type TestForm = {
  name: string;
  selectedUpsells: string[];
  selectedUpgrades: string[];
};

const INITIAL: TestForm = { name: "", selectedUpsells: [], selectedUpgrades: [] };
const reducer = createBookingWizardReducer(INITIAL);

const baseState = {
  step: 0,
  form: INITIAL,
  errors: {},
  submit: { status: "idle" as const },
  koalendarOpen: false,
  draftDismissed: false,
};

describe("bookingWizardReducer", () => {
  it("PATCH_FORM updates form without changing koalendarOpen", () => {
    const next = reducer(baseState, {
      type: "PATCH_FORM",
      patch: { name: "Yakir" },
    });
    assert.equal(next.form.name, "Yakir");
    assert.equal(next.koalendarOpen, false);
  });

  it("TOGGLE_UPGRADE adds and removes upgrade ids", () => {
    const added = reducer(baseState, { type: "TOGGLE_UPGRADE", id: "mix" });
    assert.deepEqual(added.form.selectedUpgrades, ["mix"]);

    const removed = reducer(added, { type: "TOGGLE_UPGRADE", id: "mix" });
    assert.deepEqual(removed.form.selectedUpgrades, []);
  });

  it("TOGGLE_UPSELL adds and removes upsell ids", () => {
    const added = reducer(baseState, { type: "TOGGLE_UPSELL", id: "a" });
    assert.deepEqual(added.form.selectedUpsells, ["a"]);

    const removed = reducer(added, { type: "TOGGLE_UPSELL", id: "a" });
    assert.deepEqual(removed.form.selectedUpsells, []);
  });

  it("SET_SUBMIT transitions to success", () => {
    const next = reducer(baseState, {
      type: "SET_SUBMIT",
      submit: { status: "success", waHref: "https://wa.me/1", intent: "continue_chat" },
    });
    assert.equal(next.submit.status, "success");
    if (next.submit.status === "success") {
      assert.match(next.submit.waHref, /wa\.me/);
    }
  });

  it("DISMISS_DRAFT sets draftDismissed", () => {
    const next = reducer(baseState, { type: "DISMISS_DRAFT" });
    assert.equal(next.draftDismissed, true);
  });

  it("SET_SUBMIT idle clears success state on reset path", () => {
    const success = reducer(baseState, {
      type: "SET_SUBMIT",
      submit: { status: "success", waHref: "https://wa.me/1", intent: "start_now" },
    });
    const reset = reducer(success, { type: "SET_SUBMIT", submit: { status: "idle" } });
    assert.equal(reset.submit.status, "idle");
  });
});

describe("deriveSubmitView (the failure screen stays during a retry)", () => {
  it("first submit in flight: the form stays, no result screen", () => {
    const v = deriveSubmitView({ status: "submitting" });
    assert.equal(v.isSubmitFailed, false);
    assert.equal(v.isRetrying, false);
    assert.equal(v.lastWaHref, "");
  });

  it("failed: the fallback screen with the WhatsApp link", () => {
    const v = deriveSubmitView({
      status: "failed",
      waHref: "https://wa.me/1",
      intent: "start_now",
      reason: "network",
    });
    assert.equal(v.isSubmitFailed, true);
    assert.equal(v.isRetrying, false);
    assert.equal(v.lastWaHref, "https://wa.me/1");
    assert.equal(v.lastIntent, "start_now");
  });

  it("retry in flight: still the fallback screen, now retrying, same link", () => {
    const v = deriveSubmitView({
      status: "submitting",
      retry: { waHref: "https://wa.me/1", intent: "start_now" },
    });
    assert.equal(v.isSubmitFailed, true);
    assert.equal(v.isRetrying, true);
    assert.equal(v.lastWaHref, "https://wa.me/1");
    assert.equal(v.lastIntent, "start_now");
    assert.equal(v.isSubmitted, false);
  });
});
