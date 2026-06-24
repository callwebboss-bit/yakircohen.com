import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { humanizeMashupCopy } from "./mashup-copy-humanize";

describe("humanizeMashupCopy", () => {
  it("replaces em-dash and arrows in prose", () => {
    const out = humanizeMashupCopy("פזמון עומר → דרופ Levitating -- מושלם!");
    assert.ok(!/--|→|!/.test(out));
    assert.ok(out.includes(", ואז"));
    assert.ok(out.includes("מתאים"));
  });

  it("keeps numeric ranges as hyphens", () => {
    const out = humanizeMashupCopy("128–132 BPM");
    assert.equal(out, "128-132 BPM");
  });
});
