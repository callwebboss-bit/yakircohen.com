import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildStudioUpgradeItems } from "@/lib/data/studio-upgrade-display";
import {
  getStep0Blockers,
  getStep1Blockers,
} from "@/lib/studio-wizard-step-guards";

describe("studio-wizard-step-guards", () => {
  it("blocks step 0 without recording type", () => {
    const blockers = getStep0Blockers({
      recordingType: "",
      atmosphere: "",
      isQuickWizard: false,
      isConsultation: false,
      hideAtmosphere: false,
    });
    assert.ok(blockers.some((b) => b.fieldId === "recordingType"));
  });

  it("blocks step 1 without package", () => {
    assert.equal(getStep1Blockers("").length, 1);
    assert.equal(getStep1Blockers("classic").length, 0);
  });
});

describe("buildStudioUpgradeItems", () => {
  it("hides video upsells on viral package", () => {
    const items = buildStudioUpgradeItems("viral", "events");
    const ids = items.map((i) => i.id);
    assert.ok(!ids.includes("studio_session_video"));
    assert.ok(!ids.includes("performance_clip"));
    assert.ok(ids.includes("bts"));
  });

  it("includes studio_session_video on classic events path", () => {
    const items = buildStudioUpgradeItems("classic", "events");
    assert.ok(items.some((i) => i.id === "studio_session_video"));
  });
});
