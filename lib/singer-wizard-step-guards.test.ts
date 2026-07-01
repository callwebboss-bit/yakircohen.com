import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getSingerStep0Blockers,
  getSingerStep1Blockers,
} from "@/lib/singer-wizard-step-guards";

describe("singer-wizard-step-guards", () => {
  it("blocks step 0 without package", () => {
    assert.equal(getSingerStep0Blockers({ packageId: "" }).length, 1);
    assert.equal(getSingerStep0Blockers({ packageId: "basic" }).length, 0);
  });

  it("blocks step 1 without contact fields", () => {
    const blockers = getSingerStep1Blockers({
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
