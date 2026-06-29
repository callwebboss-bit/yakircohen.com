import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calcStudioPackageFitPct } from "@/lib/studio-package-fit";

describe("calcStudioPackageFitPct", () => {
  it("returns null without type or package", () => {
    assert.equal(calcStudioPackageFitPct({ recordingType: "", packageId: "", projectMode: "" }), null);
    assert.equal(calcStudioPackageFitPct({ recordingType: "cover", packageId: "", projectMode: "" }), null);
  });

  it("returns deterministic fit for cover classic", () => {
    const pct = calcStudioPackageFitPct({
      recordingType: "cover",
      packageId: "classic",
      projectMode: "personal",
    });
    assert.ok(pct !== null && pct >= 85 && pct <= 98);
    assert.equal(pct, 92);
  });
});
