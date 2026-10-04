import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calcMobileStudioAtHomeExVat,
  calcMobileStudioExVat,
  clampMobilePeople,
  MOBILE_STUDIO_CHANNELS,
  mobileChannelPriceLine,
  mobileChannelsBreakdown,
  mobileChannelsSurchargeExVat,
} from "@/lib/data/mobile-studio-booking";
import {
  buildPersonBreakdown,
  EXTRA_PERSON_COST_NOTE,
  formatPerPersonPrice,
  formatPriceParts,
} from "@/lib/data/participant-cost-copy";
import {
  CATALOG_BUNDLES,
  getExVat,
  getPriceTransparencyById,
  MOBILE_STUDIO_EVENT_SERVICES,
  mobileStudioEventExVat,
  PRICING_ADDON_LINKS,
} from "@/lib/data/pricing-catalog";
import {
  podcastPackageExVat,
  podcastParticipantsCostExVat,
  PODCAST_PACKAGES,
} from "@/lib/data/podcast-calculator";
import { studioParticipantsBreakdown, studioPerPersonPriceLine } from "@/lib/studio-participant-pricing";

const AI_TELLS = /[!—–…“”]/;

describe("participant cost copy (owner decision 3.10.2026, round 3)", () => {
  it("one sentence, no AI tells", () => {
    assert.equal(EXTRA_PERSON_COST_NOTE, "כל משתתף נוסף הוא ערוץ הקלטה נוסף ומוסיף למחיר");
    assert.doesNotMatch(EXTRA_PERSON_COST_NOTE, AI_TELLS);
  });

  it("formats parts and folds long runs", () => {
    assert.equal(formatPriceParts([500, 99, 99, 99]), "500 + 99 + 99 + 99");
    assert.equal(formatPriceParts([500, 190, 99, 99, 99]), "500 + 190 + 99 + 99 + 99");
    assert.equal(formatPriceParts([2500, 99, 99, 99, 99]), "2,500 + 4 × 99");
  });

  it("per-person price is VAT-inclusive first", () => {
    assert.equal(formatPerPersonPrice(99, 0.18), "כל משתתף נוסף: +117 ₪ כולל מע״מ (99 ₪ + מע״מ)");
  });

  it("a single person breakdown is just the base", () => {
    const b = buildPersonBreakdown({ count: 1, baseExVat: 500, extrasExVat: [], vatRate: 0.18 });
    assert.equal(b.line, "משתתף אחד: 590 ₪ כולל מע״מ (500 ₪ + מע״מ)");
    assert.equal(b.extrasExVat, 0);
  });
});

describe("mobile studio at home: audio included, +1 channel per extra person, up to 12", () => {
  it("the catalog item and rules", () => {
    assert.equal(getExVat("mobile_extra_channel"), 99);
    assert.equal(getExVat("mobile_podcast_at_home"), 2500);
    assert.equal(MOBILE_STUDIO_CHANNELS.included, 1);
    assert.equal(MOBILE_STUDIO_CHANNELS.max, 12);
    assert.deepEqual(PRICING_ADDON_LINKS.mobile_podcast_at_home, ["mobile_extra_channel"]);
    assert.ok(
      getPriceTransparencyById("mobile_podcast_at_home").included.some((x) => x.includes("הקלטת אודיו")),
    );
  });

  it("channels 1..12", () => {
    for (let people = 1; people <= 12; people += 1) {
      assert.equal(mobileChannelsSurchargeExVat(people), (people - 1) * 99);
      assert.equal(calcMobileStudioAtHomeExVat("center", people), 2500 + (people - 1) * 99);
      assert.equal(mobileChannelsBreakdown(people).extrasExVat, (people - 1) * 99);
    }
    assert.equal(calcMobileStudioAtHomeExVat("north_south", 3), calcMobileStudioExVat("north_south") + 198);
  });

  it("limits: below 1 is 1, above 12 is 12, junk is 1", () => {
    assert.equal(clampMobilePeople(0), 1);
    assert.equal(clampMobilePeople(13), 12);
    assert.equal(clampMobilePeople(40), 12);
    assert.equal(clampMobilePeople("abc"), 1);
    assert.equal(clampMobilePeople(null), 1);
    assert.equal(mobileChannelsSurchargeExVat(40), 11 * 99);
  });

  it("breakdown text", () => {
    assert.equal(
      mobileChannelsBreakdown(4).line,
      "4 אנשים: 2,950 + 117 + 117 + 117 ₪ כולל מע״מ (2,500 + 99 + 99 + 99 ₪ + מע״מ)",
    );
    assert.equal(mobileChannelsBreakdown(1).head, "אדם אחד");
    assert.equal(
      mobileChannelPriceLine(),
      "כל אדם נוסף: +117 ₪ כולל מע״מ (99 ₪ + מע״מ), עד 12 אנשים בהקלטה",
    );
    for (let p = 1; p <= 12; p += 1) assert.doesNotMatch(mobileChannelsBreakdown(p).line, AI_TELLS);
  });
});

describe("podcast participants: studio vs mobile", () => {
  const audio = PODCAST_PACKAGES.find((p) => p.id === "audio")!;
  const video = PODCAST_PACKAGES.find((p) => p.id === "video")!;

  it("in the studio 2 are included, then podcast_extra_participant each", () => {
    assert.equal(podcastParticipantsCostExVat(2, false), 0);
    assert.equal(podcastParticipantsCostExVat(4, false), 2 * getExVat("podcast_extra_participant"));
    assert.equal(podcastPackageExVat(audio, false), getExVat("podcast_audio"));
  });

  it("at home audio is included and each extra person is a channel", () => {
    assert.equal(podcastPackageExVat(audio, true), 0);
    assert.equal(podcastPackageExVat(video, true), getExVat("podcast_video"));
    assert.equal(podcastParticipantsCostExVat(2, true), 99);
    assert.equal(podcastParticipantsCostExVat(12, true), 11 * 99);
    assert.equal(podcastParticipantsCostExVat(20, true), 11 * 99);
  });
});

describe("studio wizard per-person line and breakdown", () => {
  it("song uses the song rules", () => {
    assert.equal(
      studioParticipantsBreakdown({ baseExVat: 500, recorderCount: 4, packageId: "song" })?.line,
      "4 משתתפים: 590 + 117 + 117 + 117 ₪ כולל מע״מ (500 + 99 + 99 + 99 ₪ + מע״מ)",
    );
    assert.equal(
      studioPerPersonPriceLine("song"),
      "כל משתתף נוסף +117 ₪ כולל מע״מ (99 ₪ + מע״מ) · עד 12 בשיר",
    );
    assert.equal(
      studioParticipantsBreakdown({ baseExVat: 500, recorderCount: 12, packageId: "song" })?.extrasExVat,
      11 * 99,
    );
  });

  it("remote (blessings) uses the pairs price the wizard charges", () => {
    const b = studioParticipantsBreakdown({ baseExVat: 500, recorderCount: 3, packageId: "remote" });
    assert.equal(b?.extrasExVat, 2 * Math.round(getExVat("studio_extra_participant") / 2));
    assert.match(studioPerPersonPriceLine("remote"), /^כל מקליט נוסף: \+\d+ ₪ כולל מע״מ/);
  });

  it("one recorder or a consultation type has no breakdown", () => {
    assert.equal(studioParticipantsBreakdown({ baseExVat: 500, recorderCount: 1, packageId: "song" }), null);
    assert.equal(
      studioParticipantsBreakdown({
        baseExVat: 500,
        recorderCount: 3,
        packageId: "song",
        recordingType: "song_promotion_consultation",
      }),
      null,
    );
  });
});

describe("owner decisions 3.10.2026 round 3: items 1 and 2 recorded as they are", () => {
  it("business bundle prices stay", () => {
    const want: Record<string, number> = {
      mashup_ready_pack_3: 1794,
      mashup_ready_pack_5: 2990,
      mashup_ready_pack_10: 5980,
      mashup_custom_pack_3: 4554,
      dj_voice_tag_pack_5: 1610,
    };
    for (const [id, exVat] of Object.entries(want)) {
      assert.ok(CATALOG_BUNDLES.some((b) => b.bundleId === id));
      assert.equal(getExVat(id as Parameters<typeof getExVat>[0]), exVat);
    }
  });

  it("event audio recording is priced like an audio podcast, plus the arrival", () => {
    assert.equal(MOBILE_STUDIO_EVENT_SERVICES.audioId, "podcast_audio");
    assert.equal(getExVat("podcast_audio"), 950);
    assert.equal(mobileStudioEventExVat("audio"), 950 + 2500);
  });
});
