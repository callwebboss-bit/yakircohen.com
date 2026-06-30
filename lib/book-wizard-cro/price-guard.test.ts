import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertPriceMatches,
  guardSubmitTotalExVat,
  lastMinuteUpsellDiscount,
} from "@/lib/book-wizard-cro/price-guard";

describe("price-guard", () => {
  it("assertPriceMatches returns computed when reported diverges", () => {
    assert.equal(assertPriceMatches(1200, 999), 1200);
    assert.equal(assertPriceMatches(1200, 1200), 1200);
  });

  it("lastMinuteUpsellDiscount applies only when flag and id match", () => {
    const cfg = { upgradeId: "addon_3", promoPrice: 399, listPrice: 500, label: "x" };
    assert.equal(lastMinuteUpsellDiscount(cfg, ["addon_3"], true), 101);
    assert.equal(lastMinuteUpsellDiscount(cfg, ["addon_3"], false), 0);
    assert.equal(lastMinuteUpsellDiscount(cfg, ["other"], true), 0);
  });

  it("guardSubmitTotalExVat prefers computed total", () => {
    assert.equal(guardSubmitTotalExVat(1500, 1), 1500);
    assert.equal(guardSubmitTotalExVat(1500, null), 1500);
    assert.equal(guardSubmitTotalExVat(1500, 1500), 1500);
  });
});
