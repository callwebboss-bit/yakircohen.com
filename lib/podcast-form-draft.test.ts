import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parsePodcastFormDraft, type PodcastFormDraft } from "@/lib/podcast-form-draft";

const INITIAL: PodcastFormDraft = {
  packageId: "",
  overtimeBlocks: 0,
  participantCount: 1,
  location: "modiin",
  mobileGeo: "",
  name: "",
  phone: "",
  timeframe: "",
  customerNeed: "",
  notes: "",
  selectedUpsells: [],
  sessionPriority: "",
  welcomePerk: "",
  lastMinuteUpsell: false,
  termsAccepted: false,
};

describe("parsePodcastFormDraft", () => {
  it("returns null for invalid envelope", () => {
    assert.equal(parsePodcastFormDraft(undefined, INITIAL), null);
  });

  it("parses CRO fields sessionPriority, welcomePerk, lastMinuteUpsell", () => {
    const result = parsePodcastFormDraft(
      {
        sessionPriority: "mic_fear",
        welcomePerk: "prep_call",
        lastMinuteUpsell: true,
      },
      INITIAL,
    );
    assert.ok(result);
    assert.equal(result!.sessionPriority, "mic_fear");
    assert.equal(result!.welcomePerk, "prep_call");
    assert.equal(result!.lastMinuteUpsell, true);
  });

  it("ignores invalid CRO field ids", () => {
    const result = parsePodcastFormDraft(
      { sessionPriority: "nope", welcomePerk: "bad" },
      INITIAL,
    );
    assert.ok(result);
    assert.equal(result!.sessionPriority, "");
    assert.equal(result!.welcomePerk, "");
  });
});
