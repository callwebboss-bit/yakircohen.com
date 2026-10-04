import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BOOK_CATEGORY_TESTIMONIAL_CATEGORY,
  PRICE_PROOF_TESTIMONIAL_ID,
  getTestimonialById,
} from "@/lib/data/price-social-proof";
import { BOOK_NEED_RESULTS } from "@/lib/data/book-need-matcher";
import { SITE_TESTIMONIALS } from "@/lib/data/testimonials";
import type { BookCategoryId } from "@/lib/book-url";

describe("PriceSocialProof: רק המלצה מאותו שירות (FIT-04, OAC-07)", () => {
  for (const [category, id] of Object.entries(PRICE_PROOF_TESTIMONIAL_ID)) {
    it(`/book ${category} -> המלצה ${id} מאותה קטגוריה`, () => {
      const t = getTestimonialById(id);
      assert.ok(t, `אין המלצה עם id ${id}`);
      const expected = BOOK_CATEGORY_TESTIMONIAL_CATEGORY[category as BookCategoryId];
      assert.ok(expected, `לקטגוריה ${category} אין קטגוריית המלצות`);
      assert.equal(t.serviceCategory, expected);
    });
  }

  it("כל תוצאה ב-BookNeedMatcher עם המלצה מקבלת המלצה מאותה קטגוריה", () => {
    for (const r of BOOK_NEED_RESULTS) {
      if (!r.testimonialId) continue;
      const t = getTestimonialById(r.testimonialId);
      assert.ok(t, `${r.id}: אין המלצה ${r.testimonialId}`);
      assert.equal(t.serviceCategory, BOOK_CATEGORY_TESTIMONIAL_CATEGORY[r.categoryId], r.id);
    }
  });

  it("אין המלצות אקדמיה ממקום שמור, ואין את ההמלצה שהועברה לשם אחר", () => {
    assert.equal(SITE_TESTIMONIALS.some((t) => t.serviceCategory === "academy"), false);
    assert.equal(SITE_TESTIMONIALS.some((t) => t.name === "דניאל גרין"), false);
    assert.equal(
      SITE_TESTIMONIALS.some((t) => (t.projectImageSrc ?? "").includes("אוהד בוזגלו")),
      false,
    );
  });
});
