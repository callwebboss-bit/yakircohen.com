import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  COUPON_SNOOZE_MS,
  assertOfferWithinCap,
  getCurrentSeason,
  resolveCouponByCode,
  resolveOfferForPath,
  sanitizeCouponParam,
  validateCouponConfig,
} from "./coupon-offers";

describe("getCurrentSeason", () => {
  it("returns summer in August", () => {
    assert.equal(getCurrentSeason(new Date(2026, 7, 15)), "summer");
  });

  it("returns default on September 1", () => {
    assert.equal(getCurrentSeason(new Date(2026, 8, 1)), "default");
  });

  it("returns rosh from September 15", () => {
    assert.equal(getCurrentSeason(new Date(2026, 8, 20)), "rosh");
  });
});

describe("sanitizeCouponParam", () => {
  it("accepts valid codes", () => {
    assert.equal(sanitizeCouponParam("YAKIRSUMMER"), "YAKIRSUMMER");
  });

  it("rejects injection characters", () => {
    assert.equal(sanitizeCouponParam("<script>"), null);
  });
});

describe("resolveCouponByCode", () => {
  it("resolves summer code with fixed amount", () => {
    const offer = resolveCouponByCode("YAKIRSUMMER");
    assert.ok(offer);
    assert.equal(offer.amountOffExVat, 60);
    assert.equal(offer.catalogId, "podcast_pilot");
  });
});

describe("resolveOfferForPath contextual", () => {
  it("uses studio hour on /studio in summer", () => {
    const offer = resolveOfferForPath("/studio", "summer");
    assert.ok(offer);
    assert.equal(offer.catalogId, "studio_hour");
    assert.equal(offer.amountOffExVat, 75);
  });

  it("blocks blog paths", () => {
    assert.equal(resolveOfferForPath("/blog/foo", "summer"), null);
  });
});

describe("assertOfferWithinCap", () => {
  it("throws when discount exceeds 7%", () => {
    assert.throws(() =>
      assertOfferWithinCap({ catalogId: "podcast_pilot", amountOffExVat: 200 }),
    );
  });
});

describe("validateCouponConfig", () => {
  it("passes for production config", () => {
    assert.doesNotThrow(() => validateCouponConfig());
  });
});

describe("snooze duration constant", () => {
  it("is 7 days in ms", () => {
    assert.equal(COUPON_SNOOZE_MS, 7 * 24 * 60 * 60 * 1000);
  });
});
