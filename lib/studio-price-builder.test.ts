import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { VAT_RATE, withVat } from "@/lib/data/pricing";
import { getExVat, getWithEditingById } from "@/lib/data/pricing-catalog";
import {
  calcStudioPriceBuilder,
  extraParticipantCount,
  PRICE_BUILDER_DEFAULTS,
  resolveDurationFinish,
  type PriceBuilderAnswers,
} from "@/lib/data/studio-price-builder";
import { STUDIO_EXTRA_PARTICIPANT_PRICE } from "@/lib/data/studio-recording-booking";

const defaults = PRICE_BUILDER_DEFAULTS;

function calc(partial: Partial<PriceBuilderAnswers>) {
  return calcStudioPriceBuilder({ ...defaults, ...partial });
}

describe("studio price builder", () => {
  it("maps 30 minutes + raw + 1 + 5 days to studio_half_hour 750", () => {
    const result = calc({});
    assert.equal(result.catalogId, "studio_half_hour");
    assert.equal(result.useWithEditing, false);
    assert.equal(result.exVat, getExVat("studio_half_hour"));
    assert.equal(result.exVat, 750);
    assert.equal(result.withVat, withVat(750));
    assert.equal(VAT_RATE, 0.18);
    assert.equal(result.withVat, Math.round(750 * 1.18));
    assert.equal(result.preferWhatsApp, false);
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

  it("upgrades 30 minutes + mix to cover_song (שיר מוכן)", () => {
    const result = calc({ finish: "mix" });
    assert.equal(result.catalogId, "cover_song");
    assert.equal(result.exVat, getExVat("cover_song"));
    assert.equal(result.exVat, 990);
    assert.ok(result.notes.some((n) => n.includes("שיר מוכן")));
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

  it("adds express_delivery 1400 for 48 hours", () => {
    const result = calc({ urgency: "express" });
    assert.equal(result.expressExVat, getExVat("express_delivery"));
    assert.equal(result.expressExVat, 1400);
    assert.equal(result.exVat, 750 + 1400);
  });

  it("does not add a catalog surcharge for tomorrow", () => {
    const result = calc({ urgency: "tomorrow" });
    assert.equal(result.expressExVat, 0);
    assert.equal(result.exVat, 750);
    assert.equal(result.preferWhatsApp, true);
    assert.ok(result.whatsappText.includes("דרוש למחר"));
  });

  it("keeps 6 hours + mix above 30 minutes + raw", () => {
    const raw = calc({});
    const full = calc({ duration: "6hour", finish: "mix" });
    assert.equal(full.catalogId, "single_production");
    assert.equal(full.exVat, getExVat("single_production"));
    assert.ok(full.exVat > raw.exVat);
  });

  it("does not drop 3-hour raw below song_package", () => {
    const resolved = resolveDurationFinish("3hour", "raw");
    assert.equal(resolved.catalogId, "song_package");
    const result = calc({ duration: "3hour", finish: "raw" });
    assert.equal(result.exVat, getExVat("song_package"));
  });

  it("maps hour + mix to cover_song from catalog", () => {
    const result = calc({ duration: "1hour", finish: "mix" });
    assert.equal(result.catalogId, "cover_song");
    assert.equal(result.exVat, 990);
  });
});
