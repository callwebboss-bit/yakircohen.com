import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getExVat, getPriceById, getPriceTransparencyById } from "@/lib/data/pricing-catalog";

/* החלטות הבעלים 11.10.2026: כרטיסיות שעות במחיר שעה רגיל, בתוקף שנה. אם
   studio_hour משתנה, הכרטיסיות חייבות להשתנות איתו */
describe("podcast hour passes", () => {
  for (const [id, hours] of [["podcast_hours_pass_5", 5], ["podcast_hours_pass_10", 10]] as const) {
    it(`${id} = ${hours} x studio_hour, valid one year`, () => {
      assert.equal(getExVat(id), hours * getExVat("studio_hour"));
      assert.match(getPriceById(id).context ?? "", /בתוקף שנה/);
    });
  }
});

describe("competitor-gap add-ons (11.10.2026)", () => {
  it("bat mitzvah clip offers makeup and green screen", () => {
    assert.deepEqual(getPriceTransparencyById("bat_mitzvah_clip").addons, [
      "bat_mitzvah_clip_makeup",
      "bat_mitzvah_clip_green_screen",
    ]);
    assert.equal(getExVat("bat_mitzvah_clip_makeup"), 300);
  });

  it("both DJ tiers offer the electronic drummer", () => {
    for (const id of ["dj_premium", "dj_yakir_personal"] as const) {
      assert.ok(getPriceTransparencyById(id).addons.includes("electronic_drummer"), id);
    }
  });

  it("full production includes 2 reels with subtitles", () => {
    const t = getPriceTransparencyById("full_podcast_production");
    assert.ok(t.included.includes("2 רילס עם כתוביות"), t.included.join(" | "));
    assert.ok(!t.excluded.includes("רילס נוספים"));
  });
});
