import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createBookingWizardReducer } from "@/hooks/useBookingWizard";

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
