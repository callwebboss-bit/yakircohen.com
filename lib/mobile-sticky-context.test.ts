import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getMobileDecisiveNav } from "@/lib/mobile-sticky-context";

/* שלב 4 WP13: "מחירון" בעמודי DJ ואירועים קופץ לבלוק המחיר שבעמוד */
describe("mobile decisive nav pricing link", () => {
  it("DJ and event pages with a price block jump in-page", () => {
    for (const p of ["/events/dj-events", "/events/bar-mitzvah/", "/events/attractions/cold-fireworks"]) {
      assert.equal(getMobileDecisiveNav(p).pricingHref, "#pricing-section", p);
    }
  });
  it("other pages keep /pricing", () => {
    for (const p of ["/", "/events", "/events/host", "/studio/blessings"]) {
      assert.equal(getMobileDecisiveNav(p).pricingHref, "/pricing", p);
    }
  });
});
