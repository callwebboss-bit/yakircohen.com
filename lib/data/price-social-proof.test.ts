import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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

/*
 * החלטת הבעלים 8.10.2026, בדיקת ההמלצות: 19 ציטוטים בלי מקור ציבורי הוסרו (8 באתר, 3 בכל אחד משלושת העמודים, 2 בפודקאסט הנייד).
 * הבדיקות כאן מוודאות שהם לא חוזרים בשקט. המלצה אמיתית עם מקור ואישור
 * יכולה להיכנס ל-SITE_TESTIMONIALS בלי לשבור אותן.
 */
const REMOVED_SITE_NAMES = [
  "דנה לוי",
  "מיכל אברהם",
  "יוסי כהן",
  "נועה שפירא",
  "רחל גולן",
  "משה ברק",
  "תמר ויקי",
  "איתי לוינסון",
];

const REMOVED_IN_FILE: Record<string, readonly string[]> = {
  "lib/data/podcast-hub-page.ts": ["PODCAST_HUB_TESTIMONIALS"],
  "lib/data/recording-song-modiin-page.ts": ["RECORDING_SONG_TESTIMONIALS"],
  "lib/data/wedding-photography-page.ts": ["WEDDING_PHOTO_TESTIMONIALS"],
  "components/seo/MobilePodcastAtHomePageContent.tsx": [
    "דניאל גרין",
    "יוסי כהן",
    "<blockquote",
  ],
};

describe("המלצות בלי מקור לא חוזרות (בדיקת ההמלצות, 8.10.2026)", () => {
  it("השמות שהוסרו לא נמצאים ב-SITE_TESTIMONIALS", () => {
    for (const name of REMOVED_SITE_NAMES) {
      assert.equal(SITE_TESTIMONIALS.some((t) => t.name === name), false, name);
    }
  });

  for (const [file, needles] of Object.entries(REMOVED_IN_FILE)) {
    it(`${file} בלי ההמלצות שהוסרו`, () => {
      const code = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
      for (const needle of needles) {
        assert.equal(code.includes(needle), false, `${file}: ${needle}`);
      }
    });
  }
});
