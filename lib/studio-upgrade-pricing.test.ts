import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { VAT_RATE, withVat } from "@/lib/data/pricing";
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
      calcUpgradesTotalExVat(["express", "ai_playback"]),
      300 + 150,
    );
    assert.equal(
      calcUpgradesTotalExVat(["studio_session_video", "bts"]),
      999 + 250,
    );
  });

  it("applies last-minute BTS promo when enabled", () => {
    assert.equal(upgradePriceExVat("bts"), 250);
    assert.equal(upgradePriceExVat("bts", { lastMinuteBtsDeal: true }), 99);
  });

  it("classic package + express totals correctly with 18% VAT", () => {
    const classic = STUDIO_RECORDING_PACKAGES.find((p) => p.id === "classic");
    const express = STUDIO_RECORDING_UPGRADES.find((u) => u.id === "express");
    assert.ok(classic);
    assert.ok(express);

    const exVat = classic!.price + express!.price;
    assert.equal(exVat, 1290);
    assert.equal(VAT_RATE, 0.18);
    assert.equal(withVat(exVat), Math.round(exVat * 1.18));
    assert.equal(withVat(990), 1168);
  });
});
