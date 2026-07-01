import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getEventsStep0Blockers,
  getEventsStep1Blockers,
} from "@/lib/events-wizard-step-guards";

describe("events-wizard-step-guards", () => {
  it("blocks step 0 without attractions", () => {
    assert.equal(getEventsStep0Blockers({ attractionCount: 0 }).length, 1);
    assert.equal(getEventsStep0Blockers({ attractionCount: 2 }).length, 0);
  });

  it("blocks step 1 without contact fields", () => {
    const blockers = getEventsStep1Blockers({
      name: "",
      phone: "",
      date: "",
      time: "",
      location: "",
    });
    assert.ok(blockers.some((b) => b.fieldId === "name"));
    assert.ok(blockers.some((b) => b.fieldId === "phone"));
  });
});
