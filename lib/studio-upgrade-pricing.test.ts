import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { VAT_RATE, withVat } from "@/lib/data/pricing";
import { getExVat } from "@/lib/data/pricing-catalog";
import {
  STUDIO_RECORDING_PACKAGES,
  STUDIO_RECORDING_UPGRADES,
} from "@/lib/data/studio-recording-booking";
import {
  calcUpgradesTotalExVat,
  upgradePriceExVat,
} from "@/lib/studio-upgrade-pricing";

describe("studio upgrade pricing", () => {
  it("sums selected upgrade prices", () => {
    assert.equal(
      calcUpgradesTotalExVat(["pitch_correction", "ai_playback"]),
      getExVat("studio_pitch_correction") + 150,
    );
    assert.equal(
      calcUpgradesTotalExVat(["studio_session_video", "bts"]),
      getExVat("studio_session_clip") + 250,
    );
  });

  it("applies last-minute BTS promo when enabled", () => {
    assert.equal(upgradePriceExVat("bts"), 250);
    assert.equal(upgradePriceExVat("bts", { lastMinuteBtsDeal: true }), 99);
  });

  it("song package + edited clip totals correctly with 18% VAT", () => {
    const song = STUDIO_RECORDING_PACKAGES.find((p) => p.id === "song");
    const clip = STUDIO_RECORDING_UPGRADES.find((u) => u.id === "performance_clip");
    assert.ok(song);
    assert.ok(clip);

    const exVat = song!.price + clip!.price;
    assert.equal(song!.price, getExVat("song_recording"));
    assert.equal(exVat, 1250);
    assert.equal(VAT_RATE, 0.18);
    assert.equal(withVat(exVat), Math.round(exVat * 1.18));
    assert.equal(withVat(exVat), 1475);
  });

  it("the song upgrades read their prices from the catalog", () => {
    assert.equal(upgradePriceExVat("performance_clip"), getExVat("studio_session_clip_edited"));
    assert.equal(upgradePriceExVat("podcast_interview"), getExVat("song_pre_session_interview"));
    assert.equal(upgradePriceExVat("pitch_correction"), getExVat("studio_pitch_correction"));
  });

  it("has no express upgrade and no song bundle package any more", () => {
    assert.ok(!STUDIO_RECORDING_UPGRADES.some((u) => (u.id as string) === "express"));
    assert.deepEqual(
      STUDIO_RECORDING_PACKAGES.map((p) => p.id),
      ["remote", "song"],
    );
  });

  it("wizard package prices match catalog identity", () => {
    for (const pkg of STUDIO_RECORDING_PACKAGES) {
      assert.equal(pkg.price, getExVat(pkg.catalogId), pkg.id);
    }
  });
});
