import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it } from "node:test";
import {
  catalogBundleDiscountRate,
  CATALOG_BUNDLES,
  getExVat,
  getPriceById,
  getPriceTransparencyById,
  MAX_DISCOUNT_RATE,
  PODCAST_AUDIO_PACK_IDS,
  PODCAST_PARTICIPANT_RULES,
} from "@/lib/data/pricing-catalog";
import {
  clampPodcastParticipants,
  PODCAST_AUDIO_PACKS,
  podcastAudioPackLine,
  podcastParticipantExampleLine,
  podcastParticipantPriceLine,
  podcastParticipantsCostExVat,
  podcastSeriesAnswer,
} from "@/lib/data/podcast-calculator";
import { PODCAST_GRANDPA_FAQS } from "@/lib/data/podcast-with-grandpa-page";
import { PODCAST_HUB_FAQS } from "@/lib/data/podcast-hub-page";
import { resolveServiceBookCta } from "@/lib/data/service-book-map";
import { EVENT_BOOKING_ITEMS } from "@/lib/data/events-booking";
import { SERVICES } from "@/lib/data/booking-calculator-services";
import { PRICING_HUB_SECTIONS } from "@/lib/data/pricing-hub";

/* החלטות 5.10.2026 (פודקאסט) */
describe("podcast audio episode: what is included", () => {
  it("recording, editing and studio space, or sound improvement of an existing recording", () => {
    const item = getPriceById("podcast_audio");
    const t = getPriceTransparencyById("podcast_audio");
    const text = [item.context, item.scope?.includes, ...t.included, t.scopeNote].join(" ");
    for (const part of ["הקלטה", "עריכת ההקלטה", "חלל האולפן", "שיפור סאונד להקלטה קיימת"]) {
      assert.match(text, new RegExp(part), part);
    }
    assert.equal(getExVat("podcast_audio"), 950);
  });

  it("video and full production are unchanged (owner decides later)", () => {
    assert.equal(getExVat("podcast_video"), 1650);
    assert.equal(getExVat("full_podcast_production"), 2500);
  });
});

describe("podcast participants: 2 included, 99 each, up to 12", () => {
  it("rule and price", () => {
    assert.equal(getExVat("podcast_extra_participant"), 99);
    assert.deepEqual(
      { included: PODCAST_PARTICIPANT_RULES.included, max: PODCAST_PARTICIPANT_RULES.max },
      { included: 2, max: 12 },
    );
  });

  it("cost in the studio", () => {
    assert.equal(podcastParticipantsCostExVat(1, false), 0);
    assert.equal(podcastParticipantsCostExVat(2, false), 0);
    assert.equal(podcastParticipantsCostExVat(4, false), 198);
    assert.equal(podcastParticipantsCostExVat(12, false), 10 * 99);
    assert.equal(podcastParticipantsCostExVat(20, false), 10 * 99, "clamped to 12");
    assert.equal(clampPodcastParticipants(0), 1);
    assert.equal(clampPodcastParticipants(13), 12);
  });

  it("copy shows VAT-inclusive first", () => {
    assert.equal(
      podcastParticipantPriceLine(),
      "2 משתתפים כלולים. כל משתתף נוסף: +117 ₪ כולל מע״מ (99 ₪ + מע״מ) · עד 12 בפרק",
    );
    assert.equal(
      podcastParticipantExampleLine(4),
      "4 משתתפים: 1,121 + 117 + 117 ₪ כולל מע״מ (950 + 99 + 99 ₪ + מע״מ)",
    );
  });
});

describe("podcast audio packs", () => {
  it("are N × podcast_audio in CATALOG_BUNDLES, within the 8% cap", () => {
    assert.deepEqual([...PODCAST_AUDIO_PACK_IDS], ["podcast_audio_pack_4", "podcast_audio_pack_8"]);
    for (const id of PODCAST_AUDIO_PACK_IDS) {
      const b = CATALOG_BUNDLES.find((x) => x.bundleId === id);
      assert.ok(b, id);
      assert.equal(b.singleId, "podcast_audio");
      assert.ok(catalogBundleDiscountRate(b) <= MAX_DISCOUNT_RATE + 1e-9, id);
    }
    assert.equal(getExVat("podcast_audio_pack_4"), 3496);
    assert.equal(getExVat("podcast_audio_pack_8"), 6992);
    assert.deepEqual(PODCAST_AUDIO_PACKS.map((p) => p.episodes), [4, 8]);
  });

  it("pack line is VAT-inclusive first", () => {
    assert.equal(
      podcastAudioPackLine(PODCAST_AUDIO_PACKS[0]),
      "חבילת 4 פרקי אודיו: 4,125 ₪ כולל מע״מ (3,496 ₪ + מע״מ)",
    );
  });

  it("appear in the series answer, the hub FAQ, /pricing and llms.txt", () => {
    assert.match(podcastSeriesAnswer(), /חבילת 4 פרקי אודיו/);
    assert.doesNotMatch(podcastSeriesAnswer(), /אין חבילות/);
    assert.ok(PODCAST_HUB_FAQS.some((f) => f.answer.includes("חבילת 8 פרקי אודיו")));
    const podcastRows = PRICING_HUB_SECTIONS.find((c) => c.id === "podcast")?.rows ?? [];
    for (const id of PODCAST_AUDIO_PACK_IDS) {
      assert.ok(podcastRows.some((r) => r.catalogId === id), id);
    }
    const llms = readFileSync(resolve(import.meta.dirname, "../../public/llms.txt"), "utf8");
    assert.match(llms, /חבילת 4 פרקי אודיו: 4,125 ₪ כולל מע״מ/);
    assert.match(llms, /2 משתתפים כלולים\. כל משתתף נוסף: \+117 ₪/);
  });
});

describe("podcast with grandpa costs the same as a regular podcast", () => {
  it("book CTA uses podcast_audio", () => {
    assert.equal(resolveServiceBookCta("podcast/podcast-with-grandpa")?.priceCatalogId, "podcast_audio");
  });

  it("FAQ quotes the regular podcast prices, no 'depends on the package'", () => {
    const price = PODCAST_GRANDPA_FAQS.find((f) => f.id === "price")?.answer ?? "";
    assert.match(price, /1,121 ₪ כולל מע״מ \(950 ₪ \+ מע״מ\)/);
    assert.match(price, /1,947 ₪ כולל מע״מ \(1,650 ₪ \+ מע״מ\)/);
    assert.doesNotMatch(price, /המחיר משתנה לפי החבילה/);
    const people = PODCAST_GRANDPA_FAQS.find((f) => f.id === "participants")?.answer ?? "";
    assert.match(people, /עד 12/);
  });

  it("no attraction price borrowed in the events wizard or the old calculator", () => {
    assert.ok(!EVENT_BOOKING_ITEMS.some((i) => (i.id as string) === "podcast_grandpa"));
    assert.equal(SERVICES.podcast_grandpa.price, getExVat("podcast_audio"));
  });
});

describe("podcast copy rules", () => {
  it("no em-dash, curly quotes, ellipsis or ! in the new copy", () => {
    const texts = [
      podcastParticipantPriceLine(),
      podcastSeriesAnswer(),
      ...PODCAST_AUDIO_PACKS.map(podcastAudioPackLine),
      ...PODCAST_GRANDPA_FAQS.map((f) => f.answer),
      getPriceById("podcast_audio").context ?? "",
      ...PODCAST_AUDIO_PACK_IDS.map((id) => getPriceById(id).context ?? ""),
    ];
    for (const t of texts) assert.doesNotMatch(t, /[—–“”‘’…!]/, t);
  });
});
