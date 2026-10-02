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
    assert.equal(getStep1Blockers("song").length, 0);
  });
});

describe("buildStudioUpgradeItems", () => {
  it("offers the edited clip and the interview on the song events path", () => {
    const ids = buildStudioUpgradeItems("song", "events").map((i) => i.id);
    assert.ok(ids.includes("performance_clip"));
    assert.ok(ids.includes("podcast_interview"));
    assert.ok(ids.includes("bts"));
  });

  it("offers pitch correction on the song package too, it is not included (2.10.2026)", () => {
    const remote = buildStudioUpgradeItems("remote", "events").map((i) => i.id);
    const song = buildStudioUpgradeItems("song", "events").map((i) => i.id);
    const songPro = buildStudioUpgradeItems("song", "pro").map((i) => i.id);
    assert.ok(remote.includes("pitch_correction"));
    assert.ok(song.includes("pitch_correction"));
    assert.ok(songPro.includes("pitch_correction"));
  });

  it("never offers the removed express upgrade", () => {
    for (const path of ["events", "pro"] as const) {
      const ids = buildStudioUpgradeItems("song", path).map((i) => i.id as string);
      assert.ok(!ids.includes("express"));
    }
  });
});
