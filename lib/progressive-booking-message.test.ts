import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  pickProgressiveSummaryLines,
  progressiveIntentLine,
  shouldIncludeGroupEnrichment,
  shouldUseProgressiveNarrative,
} from "@/lib/progressive-booking-message";

describe("progressive-booking-message", () => {
  it("enables progressive mode for quick and standard", () => {
    assert.equal(shouldUseProgressiveNarrative("quick"), true);
    assert.equal(shouldUseProgressiveNarrative("standard"), true);
    assert.equal(shouldUseProgressiveNarrative("full"), false);
  });

  it("picks priority summary lines", () => {
    const lines = pickProgressiveSummaryLines([
      { label: "הערות", value: "x" },
      { label: "סוג", value: "שיר הפתעה" },
      { label: "מסלול", value: "קלאסית" },
      { label: "מקליטים", value: "10" },
    ]);
    assert.equal(lines.length, 3);
    assert.equal(lines[0].label, "סוג");
  });

  it("skips group enrichment for small quick groups", () => {
    assert.equal(shouldIncludeGroupEnrichment("quick", 4), false);
    assert.equal(shouldIncludeGroupEnrichment("quick", 10), true);
    assert.equal(shouldIncludeGroupEnrichment("standard", 4), true);
  });

  it("uses softer continue_chat intent copy", () => {
    assert.match(progressiveIntentLine("continue_chat"), /בלי לחץ/);
  });
});
