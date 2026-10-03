import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { collectDiscounts, findDiscountViolations } from "@/lib/data/discount-policy";
import {
  CATALOG_BUNDLES,
  attractionBundleDiscountPercent,
  catalogBundleDiscountRate,
  getExVat,
  MAX_DISCOUNT_RATE,
} from "@/lib/data/pricing-catalog";
import { PRICING_TIERS } from "@/lib/data/attractions-calculator";
import { aiBundleDiscountExVat } from "@/lib/data/photography-calculator";
import { CRO_REGISTRY } from "@/lib/data/cro";
import type { CroLastMinuteUpsell } from "@/lib/book-wizard-cro/types";

/* החלטת הבעלים 3.10.2026 (סבב שני): "כרגע אין הנחה מעל 8%" */
describe("discount cap", () => {
  it("the cap is 8%", () => {
    assert.equal(MAX_DISCOUNT_RATE, 0.08);
  });

  it("no computed discount anywhere is above the cap", () => {
    assert.deepEqual(findDiscountViolations(), []);
    assert.ok(collectDiscounts().length >= CATALOG_BUNDLES.length);
  });

  it("every catalog bundle is close to the cap, not a leftover deeper discount", () => {
    for (const b of CATALOG_BUNDLES) {
      const rate = catalogBundleDiscountRate(b);
      assert.ok(rate <= MAX_DISCOUNT_RATE + 1e-9, b.bundleId);
      assert.ok(rate > MAX_DISCOUNT_RATE - 0.001, `${b.bundleId}: ${rate}`);
    }
  });

  it("attraction bundles: 2 = 3,119, 3 = 4,679, 4+ = 6,238 before VAT", () => {
    assert.equal(getExVat("event_attraction_2"), 3119);
    assert.equal(getExVat("event_attraction_3"), 4679);
    assert.equal(getExVat("event_attraction_4"), 6238);
    assert.equal(attractionBundleDiscountPercent(), 8);
    assert.equal(PRICING_TIERS[1].saving, "הנחה 8%");
  });

  it("the AI bundle discount is 8% of the AI services, rounded down", () => {
    assert.equal(aiBundleDiscountExVat(1800), 144);
    assert.ok(aiBundleDiscountExVat(1800) / 1800 <= MAX_DISCOUNT_RATE);
  });

  it("last-minute deals stay, but none shows an 'instead of' price above the cap", () => {
    for (const cfg of Object.values(CRO_REGISTRY)) {
      const up: CroLastMinuteUpsell | undefined = cfg.lastMinuteUpsell;
      if (!up?.referenceCatalogId || up.promoPrice == null) continue;
      const list = getExVat(up.referenceCatalogId);
      assert.ok((list - up.promoPrice) / list <= MAX_DISCOUNT_RATE + 1e-9);
    }
    const singer: CroLastMinuteUpsell | undefined = CRO_REGISTRY.singer.lastMinuteUpsell;
    const podcast: CroLastMinuteUpsell | undefined = CRO_REGISTRY.podcast.lastMinuteUpsell;
    assert.equal(singer?.promoPrice, 399);
    assert.equal(singer?.referenceCatalogId, undefined);
    assert.equal(podcast?.promoPrice, 199);
  });
});
