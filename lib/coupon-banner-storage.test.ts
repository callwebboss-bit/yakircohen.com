import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  COUPON_SNOOZE_MS,
  isSnoozedAt,
  shouldBlockCouponBanner,
  snoozeExpiresAt,
} from "./coupon-banner-storage";

describe("isSnoozedAt", () => {
  const now = Date.UTC(2026, 5, 15, 12, 0, 0);

  it("blocks during snooze window", () => {
    const until = now + COUPON_SNOOZE_MS - 1000;
    assert.equal(isSnoozedAt(String(until), now), true);
  });

  it("allows on day 8 after snooze start", () => {
    const snoozeStart = now;
    const until = snoozeStart + COUPON_SNOOZE_MS;
    assert.equal(isSnoozedAt(String(until), until), false);
    assert.equal(isSnoozedAt(String(until), until + 1), false);
  });
});

describe("snoozeExpiresAt", () => {
  it("is exactly 168 hours ahead", () => {
    const now = 1_700_000_000_000;
    assert.equal(snoozeExpiresAt(now), now + 7 * 24 * 60 * 60 * 1000);
  });
});

describe("shouldBlockCouponBanner", () => {
  it("blocks when claimed", () => {
    assert.equal(
      shouldBlockCouponBanner({ claimed: true, snoozeUntilRaw: null, sessionDismissed: false }),
      true,
    );
  });

  it("blocks when snoozed", () => {
    const until = Date.now() + COUPON_SNOOZE_MS;
    assert.equal(
      shouldBlockCouponBanner({
        claimed: false,
        snoozeUntilRaw: String(until),
        sessionDismissed: false,
      }),
      true,
    );
  });
});
