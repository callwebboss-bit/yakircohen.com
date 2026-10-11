import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it } from "node:test";
import {
  catalogWithVat,
  DJ_TRAVEL_FEE_IDS,
  getExVat,
  MOBILE_STUDIO_CHANNEL_RULES,
  type PriceItemId,
} from "@/lib/data/pricing-catalog";
import { calcSongOffer } from "@/lib/data/song-offer";
import { blessingTotalExVat } from "@/lib/data/blessing-offer";
import { podcastParticipantsCostExVat } from "@/lib/data/podcast-calculator";
import { calcMobileStudioAtHomeExVat } from "@/lib/data/mobile-studio-booking";
import { EVENT_GIFT_THRESHOLD, getEventBundlePrice } from "@/lib/data/events-booking";
import { buildSongOfferQuote } from "@/lib/data/song-offer";
import { buildSalesBook, type SalesCard } from "@/lib/sales/sales-book";
import { matchPaste } from "@/lib/sales/paste-match";
import {
  buildSelectionQuote,
  defaultSelection,
  SELECTION_DJ_TRAVEL_IDS,
  SELECTION_MESSAGE_MAX,
  selectionOptions,
  type SelectionInput,
} from "@/lib/sales/selection-quote";

const { cards } = buildSalesBook();
function card(id: string): SalesCard {
  const found = cards.find((c) => c.id === id);
  assert.ok(found, id);
  return found;
}

const PITCH = "song_pitch_coaching";
const CLIP = "studio_session_clip_edited";
const INTERVIEW = "song_pre_session_interview";

function sumLines(lines: readonly { qty: number; unitExVat: number }[]): number {
  return Math.round(lines.reduce((s, l) => s + l.qty * l.unitExVat, 0) * 100) / 100;
}

describe("selection quote: totals match the site helpers", () => {
  it("song + pitch + clip equals calcSongOffer, VAT once on the total", () => {
    const q = buildSelectionQuote(card("song_recording"), { addonIds: [PITCH, CLIP], participants: 1 });
    const site = calcSongOffer([PITCH, CLIP], 1);
    assert.equal(q.totalExVat, site.totalExVat);
    assert.equal(q.totalInclVat, site.totalWithVat);
    assert.equal(q.totalInclVat, catalogWithVat(q.totalExVat));
    assert.equal(sumLines(q.lines), q.totalExVat);
    assert.deepEqual(q.warnings, []);
  });

  it("song with participants equals calcSongOffer for every count", () => {
    for (let n = 1; n <= 12; n += 1) {
      const q = buildSelectionQuote(card("song_recording"), { addonIds: [PITCH, CLIP], participants: n });
      assert.equal(q.totalExVat, calcSongOffer([PITCH, CLIP], n).totalExVat, String(n));
      assert.equal(sumLines(q.lines), q.totalExVat, String(n));
    }
  });

  it("blessing with 4 speakers equals the blessing helper", () => {
    const q = buildSelectionQuote(card("blessing_recording"), { addonIds: [], participants: 4 });
    assert.equal(q.totalExVat, blessingTotalExVat(4));
    assert.equal(q.totalInclVat, catalogWithVat(blessingTotalExVat(4)));
    assert.equal(sumLines(q.lines), q.totalExVat);
    const remote = buildSelectionQuote(card("studio_remote"), { addonIds: [], participants: 2 });
    assert.equal(remote.totalExVat, blessingTotalExVat(2, "studio_remote"));
  });

  it("podcast with 5 participants equals the podcast helper", () => {
    const q = buildSelectionQuote(card("podcast_audio"), { addonIds: [], participants: 5 });
    assert.equal(q.totalExVat, getExVat("podcast_audio") + podcastParticipantsCostExVat(5, false));
    assert.equal(sumLines(q.lines), q.totalExVat);
  });

  it("DJ north equals dj_premium + travel_north_south", () => {
    assert.deepEqual([...SELECTION_DJ_TRAVEL_IDS].sort(), [...DJ_TRAVEL_FEE_IDS].sort());
    const q = buildSelectionQuote(card("dj_premium"), { addonIds: [], region: "north_south" });
    const expected = getExVat("dj_premium") + getExVat("travel_north_south");
    assert.equal(q.totalExVat, expected);
    assert.equal(q.totalInclVat, catalogWithVat(expected));
    assert.deepEqual(q.lines.map((l) => l.id), ["dj_premium", "travel_north_south"]);
    const eilat = buildSelectionQuote(card("dj_premium"), { addonIds: [], region: "eilat" });
    assert.equal(eilat.totalExVat, getExVat("dj_premium") + getExVat("travel_eilat_golan"));
  });

  it("DJ add-on built on two catalog items: lines add up to the calculator price", () => {
    const dj = card("dj_premium");
    const multi = dj.addons.find((a) => a.catalogIds.length > 1);
    assert.ok(multi);
    const q = buildSelectionQuote(dj, { addonIds: [multi.id] });
    assert.equal(q.totalExVat, getExVat("dj_premium") + multi.exVat);
    assert.equal(sumLines(q.lines), q.totalExVat);
    assert.ok(q.priceFrom, "built on the mobile studio, a from-price");
  });

  it("mobile studio with 4 people in the center equals calcMobileStudioAtHomeExVat", () => {
    const q = buildSelectionQuote(card("mobile_podcast_at_home"), { addonIds: [], participants: 4, region: "center" });
    assert.equal(q.totalExVat, calcMobileStudioAtHomeExVat("center", 4));
    assert.equal(sumLines(q.lines), q.totalExVat);
    for (const geo of ["north_south", "eilat"] as const) {
      const far = buildSelectionQuote(card("mobile_podcast_at_home"), { addonIds: [], participants: 2, region: geo });
      assert.equal(far.totalExVat, calcMobileStudioAtHomeExVat(geo, 2), geo);
      assert.equal(sumLines(far.lines), far.totalExVat, geo);
      assert.equal(far.confirmLine, null, "the center-only confirm line is gone outside the center");
    }
  });

  it("singer amplification uses its own north and south travel items", () => {
    const singer = card("singer_amp_basic");
    const options = selectionOptions(singer);
    assert.deepEqual(options.regions?.map((r) => r.id), ["center", "north", "south"]);
    assert.ok(!options.addons.some((a) => a.id.startsWith("singer_travel_")), "travel is the region field, not a chip");
    const north = buildSelectionQuote(singer, { addonIds: [], region: "north" });
    assert.equal(north.totalExVat, getExVat("singer_amp_basic") + getExVat("singer_travel_north"));
    const south = buildSelectionQuote(singer, { addonIds: [], region: "south" });
    assert.equal(south.totalExVat, getExVat("singer_amp_basic") + getExVat("singer_travel_south"));
    /* אזור של DJ לא חל על הגברת זמר */
    const wrong = buildSelectionQuote(singer, { addonIds: [], region: "eilat" });
    assert.equal(wrong.totalExVat, getExVat("singer_amp_basic"));
    assert.ok(wrong.warnings.length > 0);
  });

  it("attractions bundles: the count picks the bundle, extra activations add up", () => {
    const single = card("event_attraction_1");
    for (let count = 1; count <= EVENT_GIFT_THRESHOLD; count += 1) {
      const q = buildSelectionQuote(single, { addonIds: [], attractionsCount: count });
      assert.equal(q.totalExVat, getEventBundlePrice(count), String(count));
      assert.equal(sumLines(q.lines), q.totalExVat, String(count));
    }
    const withActs = buildSelectionQuote(single, { addonIds: [], attractionsCount: 2, activations: 3 });
    assert.equal(withActs.totalExVat, getEventBundlePrice(2) + 3 * getExVat("event_extra_activation"));
    assert.equal(withActs.baseId, "event_attraction_2");
    const four = buildSelectionQuote(single, { addonIds: [], attractionsCount: EVENT_GIFT_THRESHOLD });
    assert.ok(four.priceFrom, "4 and up is an opening price");
    assert.ok(four.warnings.some((w) => w.includes("מחיר פתיחה")));
    /* כרטיס של חבילה מתחיל ממספר האטרקציות שלה */
    assert.equal(defaultSelection(card("event_attraction_3")).attractionsCount, 3);
    /* לא יותר מ-2 הפעלות נוספות לאטרקציה */
    const capped = buildSelectionQuote(single, { addonIds: [], attractionsCount: 1, activations: 9 });
    assert.equal(capped.activations, 2);
  });
});

describe("selection quote: rules", () => {
  it("an add-on without its requirement is rejected", () => {
    const song = card("song_recording");
    const addon = song.addons.find((a) => a.id === INTERVIEW);
    assert.equal(addon?.requires, CLIP);
    const q = buildSelectionQuote(song, { addonIds: [INTERVIEW] });
    assert.ok(!q.addonIds.includes(INTERVIEW));
    assert.equal(q.totalExVat, getExVat("song_recording"));
    assert.ok(q.warnings.some((w) => w.includes(addon.label)));
    const ok = buildSelectionQuote(song, { addonIds: [INTERVIEW, CLIP] });
    assert.ok(ok.addonIds.includes(INTERVIEW));
    assert.equal(ok.totalExVat, calcSongOffer([CLIP, INTERVIEW], 1).totalExVat);
  });

  it("participants are clamped to the card's max", () => {
    const q = buildSelectionQuote(card("song_recording"), { addonIds: [], participants: 99 });
    assert.equal(q.participants, 12);
    assert.ok(q.warnings.length > 0);
  });

  it("an add-on from another card is ignored", () => {
    const q = buildSelectionQuote(card("song_recording"), { addonIds: ["led_lighting"] });
    assert.deepEqual(q.addonIds, []);
    assert.equal(q.totalExVat, getExVat("song_recording"));
  });

  it("participant extras are the stepper, not a chip", () => {
    const blessing = selectionOptions(card("blessing_recording"));
    assert.ok(!blessing.addons.some((a) => a.id === "blessing_extra_participant"));
    const mobile = selectionOptions(card("mobile_podcast_at_home"));
    assert.ok(!mobile.addons.some((a) => a.id === MOBILE_STUDIO_CHANNEL_RULES.channelId));
  });

  it("no selection: the card's own approved message", () => {
    for (const c of cards) {
      const q = buildSelectionQuote(c, defaultSelection(c));
      assert.equal(q.hasSelection, false, c.id);
      assert.equal(q.message, c.message, c.id);
      assert.equal(q.totalExVat, c.exVat, c.id);
    }
  });

  it("a business card shows prices before VAT first", () => {
    const business = cards.find((c) => c.audience === "business" && selectionOptions(c).addons.length > 0);
    if (!business) return;
    const addon = selectionOptions(business).addons.find((a) => !a.requires);
    if (!addon) return;
    const q = buildSelectionQuote(business, { addonIds: [addon.id] });
    assert.ok(q.priceLine.includes("+ מע״מ"));
    assert.ok(q.priceLine.indexOf("+ מע״מ") < q.priceLine.indexOf("כולל מע״מ"));
  });
});

/* ─── הודעות ─── */

const ROOT = resolve(import.meta.dirname, "../..");
const BANNED_CHARS = /[!—–…“”‘’]/;
const AI_TELL_PHRASES = [
  ...readFileSync(resolve(ROOT, "scripts/audit-ai-tells.mjs"), "utf8").matchAll(/phrase: "([^"]+)"/g),
].map((m) => m[1]);

/* כל צירוף שהמחשבון יכול לבנות לכרטיס: כל שדרוג לבד, כולם יחד, ומקסימום בשאר השדות */
function sampleInputs(c: SalesCard): SelectionInput[] {
  const options = selectionOptions(c);
  const all = options.addons.map((a) => a.id);
  const max: SelectionInput = {
    addonIds: all,
    participants: options.participants?.max ?? null,
    region: options.regions?.[options.regions.length - 1]?.id ?? null,
    attractionsCount: options.attractions?.max ?? null,
    activations: 99,
  };
  /* שדרוג עם תנאי נבחר יחד עם התנאי שלו */
  const single = options.addons.map((a) => ({ addonIds: a.requires ? [a.id, a.requires] : [a.id] }));
  return [...single, max];
}

describe("selection quote: the WhatsApp message", () => {
  it("human copy, short, ends with a question, for every card and combination", () => {
    assert.ok(AI_TELL_PHRASES.length > 10);
    let checked = 0;
    for (const c of cards) {
      for (const input of sampleInputs(c)) {
        const q = buildSelectionQuote(c, input);
        if (!q.hasSelection) continue;
        checked += 1;
        assert.doesNotMatch(q.message, BANNED_CHARS, c.id);
        for (const phrase of AI_TELL_PHRASES) assert.ok(!q.message.includes(phrase), `${c.id}: ${phrase}`);
        assert.ok(q.message.endsWith("?"), c.id);
        assert.ok(q.message.length <= SELECTION_MESSAGE_MAX, `${c.id}: ${q.message.length}`);
        assert.ok(q.message.startsWith("היי"), c.id);
        assert.ok(q.message.includes(q.priceLine), `${c.id}: total in the message`);
      }
    }
    assert.ok(checked > 100, String(checked));
  });

  it("lists every selected item with its VAT-inclusive price", () => {
    const song = card("song_recording");
    const q = buildSelectionQuote(song, { addonIds: [PITCH, CLIP], participants: 3 });
    for (const id of [PITCH, CLIP]) {
      const addon = song.addons.find((a) => a.id === id);
      assert.ok(addon);
      assert.ok(
        q.message.includes(`${addon.label}: ${catalogWithVat(addon.exVat).toLocaleString("he-IL")} ₪`),
        addon.label,
      );
    }
    assert.ok(q.message.includes("3 משתתפים"));
    assert.ok(q.message.includes(`סה״כ ${q.priceLine}`));
    /* תיקון זיופים נבחר, ולכן "תיקון זיופים לא כלול" כבר לא נשלח */
    assert.equal(q.confirmLine, null);
  });
});

describe("selection quote: paste preselects", () => {
  it("a song-offer message gives the calculator the same add-ons, participants and total", () => {
    const quote = buildSongOfferQuote([CLIP], { source: "/studio", participants: 3 });
    const text = new URL(quote.waHref).searchParams.get("text") ?? "";
    const { match } = matchPaste(text, cards);
    assert.ok(match);
    assert.equal(match.card.id, "song_recording");
    const q = buildSelectionQuote(match.card, { addonIds: match.addonIds, participants: match.participants });
    assert.deepEqual(q.addonIds, [CLIP]);
    assert.equal(q.participants, 3);
    assert.equal(q.totalExVat, calcSongOffer([CLIP], 3).totalExVat);
    assert.equal(q.totalExVat, match.todayExVat);
  });
});

/* מזהה שלא בקטלוג לא מפיל את המודול */
describe("selection quote: catalog ids", () => {
  it("every line id is a catalog item", () => {
    for (const c of cards) {
      const q = buildSelectionQuote(c, sampleInputs(c).at(-1) ?? { addonIds: [] });
      for (const l of q.lines) assert.doesNotThrow(() => getExVat(l.id as PriceItemId), `${c.id}: ${l.id}`);
    }
  });
});
