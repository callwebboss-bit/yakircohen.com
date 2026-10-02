import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveServiceBookCta } from "@/lib/data/service-book-map";

/* עמודים עם טופס הקלטת השיר מציגים את כפתור ההזמנה כולל מע״מ, כמו הטופס.
   קודם עמוד השיר הציג "מ-500 ₪ + מע״מ = 590 ₪" מתחת לטופס שאומר 590 כולל מע״מ. */
describe("resolveServiceBookCta VAT display", () => {
  for (const slug of [
    "studio",
    "studio/recording-song-modiin",
    "studio/pricing",
    "studio/blessings/video-clip",
  ]) {
    it(`${slug}: כולל מע״מ קודם, בלי "+ מע״מ ="`, () => {
      const cta = resolveServiceBookCta(slug);
      assert.ok(cta);
      assert.match(cta.bookLabel, /^הזמנה מקוונת מ-[\d,]+ ₪ כולל מע״מ$/);
    });
  }

  it("עמוד השיר מציג את מחיר השיר, 590 כולל מע״מ", () => {
    assert.equal(
      resolveServiceBookCta("studio/recording-song-modiin")?.bookLabel,
      "הזמנה מקוונת מ-590 ₪ כולל מע״מ",
    );
  });

  it("עמודים בלי הטופס לא השתנו", () => {
    const cta = resolveServiceBookCta("voiceover");
    assert.ok(cta);
    assert.doesNotMatch(cta.bookLabel, /כולל מע״מ$/);
  });
});
