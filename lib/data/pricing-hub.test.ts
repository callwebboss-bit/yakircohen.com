import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  groupPricingHubSections,
  PRICING_HUB_SECTIONS,
} from "@/lib/data/pricing-hub";

describe("pricing hub studio display order", () => {
  it("keeps room-hour rows after the gift ladder", () => {
    const groups = groupPricingHubSections(PRICING_HUB_SECTIONS);
    const studio = groups.find((g) => g.id === "studio");
    assert.ok(studio);
    const labels = studio!.sections
      .find((s) => s.id === "studio")
      ?.rows.map((row) => row.catalogId);
    assert.ok(labels);
    const gift = labels!.indexOf("cover_song");
    const half = labels!.indexOf("studio_half_hour");
    const hour = labels!.indexOf("studio_hour");
    const clip = labels!.indexOf("studio_session_clip");
    assert.ok(gift >= 0 && half > gift);
    assert.ok(hour > half);
    assert.ok(clip > gift);
  });
});
