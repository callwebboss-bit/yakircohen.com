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

  it("lists gift song includes with mix, master and one revision", () => {
    const t = getPriceTransparencyById("cover_song");
    assert.ok(t.included.some((line) => line.includes("מיקס")));
    assert.ok(t.included.some((line) => line.includes("מאסטרינג")));
    assert.ok(t.excluded.includes("קליפ"));
    assert.ok(t.glossaryTermSlugs?.includes("pitch-correction"));
  });

  it("keeps remote mix but excludes pitch correction", () => {
    const t = getPriceTransparencyById("studio_remote");
    assert.ok(t.included.includes("מיקס"));
    assert.ok(t.excluded.includes("תיקון זיופים"));
    assert.ok(t.addons.includes("studio_pitch_correction"));
  });
});
