import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { EVENT_BOOKING_UPSELLS } from "@/lib/data/events-booking-upsells";
import { RIGID_ACTIVATION_OPTIONS } from "@/lib/data/events-booking";
import { bundleSavingWithVat, getBundlePricingTable } from "@/lib/data/attraction-book-pricing";
import { PRICING_CATALOG, getExVat } from "@/lib/data/pricing-catalog";
import { withVat } from "@/lib/data/pricing";

/* WP4 (OE-03, PI-06, PI-07, PI-08, OE-13, FIT-05) */
describe("event upsells and savings come from the catalog", () => {
  const catalogValues = new Set<number>(PRICING_CATALOG.map((i) => i.exVat));

  it("no fake 1,400 instead of 1,750 promo", () => {
    for (const u of EVENT_BOOKING_UPSELLS) {
      assert.notEqual(u.originalPrice, 1750, u.id);
      assert.ok(!u.id.endsWith("_act2_promo"), u.id);
    }
  });

  it("every crossed-out reference price is a catalog price", () => {
    for (const u of EVENT_BOOKING_UPSELLS) {
      if (u.originalPrice == null) continue;
      assert.ok(catalogValues.has(u.originalPrice), `${u.id}: ${u.originalPrice}`);
    }
  });

  it("extra activation is bound to its catalog id", () => {
    const act2 = RIGID_ACTIVATION_OPTIONS.find((o) => o.key === "act_2");
    const act3 = RIGID_ACTIVATION_OPTIONS.find((o) => o.key === "act_3");
    assert.equal(act2?.addOnPrice, getExVat("event_extra_activation"));
    assert.equal(act3?.addOnPrice, getExVat("event_extra_activation") * 2);
  });

  it("bundle savings are computed, not written", () => {
    const single = withVat(getExVat("event_attraction_1"));
    assert.equal(bundleSavingWithVat(2), single * 2 - withVat(getExVat("event_attraction_2")));
    assert.equal(bundleSavingWithVat(3), single * 3 - withVat(getExVat("event_attraction_3")));
    const rows = getBundlePricingTable();
    assert.ok(rows[1].saving.includes(bundleSavingWithVat(2).toLocaleString("he-IL")));
    assert.ok(rows[2].saving.includes(bundleSavingWithVat(3).toLocaleString("he-IL")));
  });
});
