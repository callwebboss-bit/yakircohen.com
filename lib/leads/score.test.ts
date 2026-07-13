import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { computeLeadScore, inferServiceTypeFromFormId, scoreBand } from "./score";
import { formatIlMobileDisplay, normalizeIlMobile } from "./format-phone-il";

describe("computeLeadScore", () => {
  it("scores a rich lead higher than empty", () => {
    const low = computeLeadScore({ body: "hi" });
    const high = computeLeadScore({
      name: "ישראל",
      phone: "0587555456",
      email: "a@b.com",
      serviceType: "studio",
      body: "א".repeat(130),
      eventDate: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10),
      budgetHint: 2500,
      pricingRefExVat: 750,
      enrichment: { referrer: "https://www.google.com", sessionSeconds: 200 },
    });
    assert.ok(high >= 80);
    assert.ok(high > low);
    assert.equal(scoreBand(high), "high");
  });
});

describe("inferServiceTypeFromFormId", () => {
  it("maps podcast and pricing", () => {
    assert.equal(inferServiceTypeFromFormId("podcast_booking_wizard"), "podcast");
    assert.equal(inferServiceTypeFromFormId("pricing_inquiry"), "unknown");
  });
});

describe("formatIlMobile", () => {
  it("normalizes and formats", () => {
    assert.equal(normalizeIlMobile("058-755-5456"), "0587555456");
    assert.equal(formatIlMobileDisplay("0587555456"), "058-755-5456");
  });
});
