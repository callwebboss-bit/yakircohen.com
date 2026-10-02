import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { VAT_RATE, withVat } from "@/lib/data/pricing";
import { getExVat, getWithEditingById } from "@/lib/data/pricing-catalog";
import {
  calcStudioPriceBuilder,
  extraParticipantCount,
  PRICE_BUILDER_DEFAULTS,
  PRICE_BUILDER_DURATION_OPTIONS,
  PRICE_BUILDER_FINISH_OPTIONS,
  PRICE_BUILDER_SONG_LINK,
  resolveDurationFinish,
  type PriceBuilderAnswers,
} from "@/lib/data/studio-price-builder";
import { STUDIO_EXTRA_PARTICIPANT_PRICE } from "@/lib/data/studio-recording-booking";

const defaults = PRICE_BUILDER_DEFAULTS;

function calc(partial: Partial<PriceBuilderAnswers>) {
  return calcStudioPriceBuilder({ ...defaults, ...partial });
}

describe("studio price builder (room time only)", () => {
  it("maps 30 minutes + raw + 1 to studio_half_hour 750", () => {
    const result = calc({});
    assert.equal(result.catalogId, "studio_half_hour");
    assert.equal(result.useWithEditing, false);
    assert.equal(result.exVat, getExVat("studio_half_hour"));
    assert.equal(result.exVat, 750);
    assert.equal(result.withVat, withVat(750));
    assert.equal(VAT_RATE, 0.18);
    assert.equal(result.withVat, Math.round(750 * 1.18));
    assert.match(result.bookHref, /catalog=studio_half_hour/);
  });

  it("adds basic editing from catalog withEditing, not a formula", () => {
    const result = calc({ finish: "edit" });
    const edited = getWithEditingById("studio_half_hour");
    assert.ok(edited);
    assert.equal(result.exVat, edited!.exVat);
    assert.equal(result.exVat, 1100);
    assert.equal(result.useWithEditing, true);
  });

  it("maps one hour to studio_hour, raw and edited", () => {
    assert.equal(calc({ duration: "1hour" }).exVat, getExVat("studio_hour"));
    assert.equal(
      calc({ duration: "1hour", finish: "edit" }).exVat,
      getWithEditingById("studio_hour")!.exVat,
    );
  });

  it("adds one extra participant at catalog 190", () => {
    assert.equal(extraParticipantCount("pair"), 1);
    const result = calc({ participants: "pair" });
    assert.equal(result.extrasExVat, STUDIO_EXTRA_PARTICIPANT_PRICE);
    assert.equal(result.exVat, 750 + 190);
  });

  it("charges three extras for 4+ participants", () => {
    const result = calc({ participants: "group" });
    assert.equal(result.extraCount, 3);
    assert.equal(result.extrasExVat, 570);
    assert.equal(result.exVat, 750 + 570);
  });

  it("never returns a song id, and offers no mix, long sessions or urgency (2.10.2026)", () => {
    for (const duration of PRICE_BUILDER_DURATION_OPTIONS) {
      for (const finish of PRICE_BUILDER_FINISH_OPTIONS) {
        const resolved = resolveDurationFinish(duration.id, finish.id);
        assert.ok(
          resolved.catalogId === "studio_half_hour" || resolved.catalogId === "studio_hour",
          `${duration.id}/${finish.id} -> ${resolved.catalogId}`,
        );
        const result = calc({ duration: duration.id, finish: finish.id });
        assert.doesNotMatch(result.whatsappText, /מתי:|48|express/);
      }
    }
    assert.deepEqual(
      PRICE_BUILDER_DURATION_OPTIONS.map((o) => o.id),
      ["30min", "1hour"],
    );
    assert.deepEqual(
      PRICE_BUILDER_FINISH_OPTIONS.map((o) => o.id),
      ["raw", "edit"],
    );
  });

  it("links songs to the song offer instead", () => {
    assert.equal(PRICE_BUILDER_SONG_LINK.href, "/studio/recording-song-modiin#song-offer");
  });
});
