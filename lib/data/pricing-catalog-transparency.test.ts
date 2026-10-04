import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getPriceTransparencyById } from "@/lib/data/pricing-catalog";

describe("price transparency overlay lists", () => {
  it("lists blessing includes without pitch correction", () => {
    const t = getPriceTransparencyById("blessing_recording");
    assert.ok(t.included.some((line) => line.includes("עריכת סאונד בסיסית")));
    assert.ok(t.excluded.includes("תיקון זיופים"));
    assert.ok(t.excluded.includes("מוזיקה ברקע"));
    assert.ok(t.addons.includes("studio_pitch_correction"));
  });

  it("song recording includes mix and master and excludes pitch correction (2.10.2026)", () => {
    const t = getPriceTransparencyById("song_recording");
    assert.ok(t.included.some((line) => line.includes("מיקס")));
    assert.ok(t.included.some((line) => line.includes("מאסטר")));
    assert.ok(t.excluded.includes("תיקון זיופים"));
    assert.ok(
      !t.included.some((line) => /זיופ|pitch/i.test(line)),
      `included mentions pitch correction: ${t.included.join(" | ")}`,
    );
    assert.deepEqual(t.addons, [
      "song_pitch_coaching",
      "studio_session_clip_edited",
      "song_pre_session_interview",
      "studio_bts",
      "studio_photo_pack",
    ]);
    assert.equal(t.pricingMode, "fixed");
  });

  it("the 4,500 production card includes the clip and the writing it sells (S02)", () => {
    const t = getPriceTransparencyById("full_production_clip");
    assert.ok(t.included.some((line) => line.includes("קליפ")));
    assert.ok(t.included.some((line) => line.includes("כתיבת")));
    assert.ok(!t.excluded.includes("קליפ וידאו"));
    assert.ok(!t.excluded.includes("כתיבת מילים או לחן"));
  });

  it("the interview add-on says it is part of the edited clip", () => {
    const t = getPriceTransparencyById("song_pre_session_interview");
    assert.ok(t.included.some((line) => line.includes("משולב בקליפ")));
  });

  it("keeps remote mix but excludes pitch correction", () => {
    const t = getPriceTransparencyById("studio_remote");
    assert.ok(t.included.includes("מיקס"));
    assert.ok(t.excluded.includes("תיקון זיופים"));
    assert.ok(t.addons.includes("studio_pitch_correction"));
  });
});

/* שלב 4, סעיף 2H: רשימת "לא כולל" לא סותרת את שם המוצר, ואין טקסט תבנית */
describe("transparency lists do not contradict the product", () => {
  const KEYS = ["קליפ", "כתיבה", "כתיבת", "מיקס", "צילום", "תיקון זיופים"];
  /* צילום קליפ גלם: "לא כולל קליפ מוכן לרשתות" הוא ההבדל בין גלם לערוך */
  const ALLOWED = new Set(["studio_session_clip|קליפ"]);

  it("no word from an item's label appears in its own excluded list", async () => {
    const { PRICING_CATALOG, getPriceTransparencyById } = await import("@/lib/data/pricing-catalog");
    const bad: string[] = [];
    for (const item of PRICING_CATALOG) {
      const t = getPriceTransparencyById(item.id);
      for (const k of KEYS) {
        if (!item.label.includes(k) || ALLOWED.has(`${item.id}|${k}`)) continue;
        for (const line of t.excluded) if (line.includes(k)) bad.push(`${item.id}: ${line}`);
      }
    }
    assert.deepEqual(bad, []);
  });

  it("no template placeholder text reaches the customer", async () => {
    const { PRICING_CATALOG, getPriceTransparencyById } = await import("@/lib/data/pricing-catalog");
    for (const item of PRICING_CATALOG) {
      const t = getPriceTransparencyById(item.id);
      for (const line of [...t.included, ...t.excluded]) {
        assert.doesNotMatch(line, /שבכרטיס|__[A-Z_]+__/, item.id);
      }
    }
  });
});
