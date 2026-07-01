import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getPodcastStep0Blockers,
  getPodcastStep1Blockers,
} from "@/lib/podcast-wizard-step-guards";

describe("podcast-wizard-step-guards", () => {
  it("blocks step 0 without package", () => {
    assert.equal(getPodcastStep0Blockers({ packageId: "" }).length, 1);
    assert.equal(getPodcastStep0Blockers({ packageId: "audio" }).length, 0);
  });

  it("blocks step 1 without name and phone", () => {
    const blockers = getPodcastStep1Blockers({
      name: "",
      phone: "",
      location: "modiin",
      mobileGeo: "",
    });
    assert.ok(blockers.some((b) => b.fieldId === "name"));
    assert.ok(blockers.some((b) => b.fieldId === "phone"));
  });

  it("blocks mobile without geo", () => {
    const blockers = getPodcastStep1Blockers({
      name: "יקיר",
      phone: "0587555456",
      location: "mobile",
      mobileGeo: "",
    });
    assert.ok(blockers.some((b) => b.fieldId === "mobileGeo"));
  });
});
