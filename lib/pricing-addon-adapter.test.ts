import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  catalogItemsToUpsellItems,
  getCatalogAddonsForEventsBundle,
  getCatalogAddonsForPodcastPackage,
  getCatalogAddonsForStudioPackage,
  resolveAddonLabel,
  resolveAddonPrice,
  sumAddonPrices,
} from "@/lib/pricing-addon-adapter";
import { getExVat } from "@/lib/data/pricing-catalog";

describe("pricing-addon-adapter", () => {
  it("maps podcast audio package to catalog addons", () => {
    const items = getCatalogAddonsForPodcastPackage("audio");
    assert.ok(items.length >= 2);
    assert.equal(items[0]?.id, "podcast_extra_participant");
    assert.equal(items[0]?.price, getExVat("podcast_extra_participant"));
  });

  it("maps studio pro package to catalog addons", () => {
    const items = getCatalogAddonsForStudioPackage("pro");
    assert.ok(items.some((i) => i.id === "express_delivery"));
  });

  it("maps events bundle tiers to catalog addons", () => {
    const one = getCatalogAddonsForEventsBundle(1);
    const four = getCatalogAddonsForEventsBundle(4);
    assert.ok(one.some((i) => i.id === "single_effect"));
    assert.ok(four.length >= one.length);
  });

  it("sums catalog and legacy upsell prices", () => {
    const total = sumAddonPrices(
      new Set(["podcast_editing_hour", "editing_advanced"]),
    );
    assert.equal(
      total,
      getExVat("podcast_editing_hour") + 590,
    );
  });

  it("resolves labels from catalog", () => {
    const label = resolveAddonLabel("quick_summary_clip");
    assert.ok(label.length > 0);
    assert.equal(resolveAddonPrice("not_a_real_id_xyz"), 0);
  });

  it("catalogItemsToUpsellItems uses exVat only", () => {
    const [item] = catalogItemsToUpsellItems([
      { id: "podcast_pilot", label: "פיילוט", exVat: 950, category: "podcast" },
    ]);
    assert.equal(item?.price, 950);
    assert.equal(item?.name, "פיילוט");
  });
});
