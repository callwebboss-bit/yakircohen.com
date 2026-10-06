import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it } from "node:test";
import {
  BLESSING_PARTICIPANT_RULES,
  CATALOG_BUNDLES,
  catalogWithVat,
  DJ_TRAVEL_FEE_IDS,
  getExVat,
  getPriceById,
  getPriceFromById,
  getPriceTransparencyById,
  MOBILE_STUDIO_CHANNEL_RULES,
  PODCAST_AUDIO_PACK_IDS,
  PODCAST_PARTICIPANT_RULES,
  PRICING_CATALOG,
  SONG_PARTICIPANT_RULES,
  type PriceItem,
  type PriceItemId,
} from "@/lib/data/pricing-catalog";
import { formatPrice } from "@/lib/data/pricing-display";
import { calcSongOffer, getSongOfferExport } from "@/lib/data/song-offer";
import { blessingTotalExVat } from "@/lib/data/blessing-offer";
import { podcastParticipantsCostExVat } from "@/lib/data/podcast-calculator";
import { calcMobileStudioAtHomeExVat } from "@/lib/data/mobile-studio-booking";
import { DJ_CALC_ADDONS } from "@/lib/data/dj-events-calculator";
import { LIQUID_FREQUENCY_OPTIONS, RIGID_ACTIVATION_OPTIONS } from "@/lib/data/events-booking";
import {
  BILLING_UNIT_BY_LABEL,
  buildSalesBook,
  catalogContentHash,
  FEATURED_CARD_IDS,
  getSalesCard,
  SALES_IGNORED_IDS,
  sha256Hex,
  type SalesCard,
  type SalesCombo,
} from "@/lib/sales/sales-book";
import { CONFIRM_PREFIX, SALES_MESSAGE_MAX } from "@/lib/sales/sales-copy";

const book = buildSalesBook();
const ROOT = resolve(import.meta.dirname, "../..");

function card(id: PriceItemId): SalesCard {
  const found = getSalesCard(id);
  assert.ok(found, `no card for ${id}`);
  return found;
}

function comboByKey(c: SalesCard, key: string): SalesCombo {
  const found = c.combos.find((x) => x.key === key);
  assert.ok(found, `${c.id}: no combo ${key}`);
  return found;
}

function linesTotal(combo: SalesCombo): number {
  return Math.round(combo.lines.reduce((sum, l) => sum + l.qty * l.unitExVat, 0) * 100) / 100;
}

function isFromId(id: string): boolean {
  return getPriceFromById(id as PriceItemId) || getPriceTransparencyById(id as PriceItemId).pricingMode === "from";
}

/** יחידת החיוב של הכרטיס ("לחודש"), או null לתשלום חד-פעמי */
function billingUnit(id: string): string | null {
  return BILLING_UNIT_BY_LABEL[getPriceById(id as PriceItemId).scope?.billingLabel ?? ""] ?? null;
}

describe("sales book: catalog hash", () => {
  it("SHA-256 matches node:crypto (pure implementation, runs in the browser too)", () => {
    for (const text of ["", "abc", "הקלטת שיר באולפן", "x".repeat(1000)]) {
      assert.equal(sha256Hex(text), createHash("sha256").update(text).digest("hex"), text.slice(0, 20));
    }
  });

  it("contentHash equals docs/pricing-export.json (scripts/export-pricing.ts)", () => {
    const exported = JSON.parse(readFileSync(resolve(ROOT, "docs/pricing-export.json"), "utf8"));
    assert.equal(book.contentHash, exported.contentHash);
    assert.equal(catalogContentHash(), exported.contentHash);
    assert.equal(book.itemCount, exported.itemCount);
  });
});

describe("sales book: every catalog id has a place", () => {
  const cardIds = new Set(book.cards.map((c) => c.id));
  const addonIds = new Set(book.cards.flatMap((c) => c.addons.flatMap((a) => a.catalogIds)));
  const lineIds = new Set(
    book.cards.flatMap((c) => [...c.morningLines, ...c.combos.flatMap((x) => x.lines)].map((l) => l.id)),
  );
  const ignored = new Set(Object.keys(SALES_IGNORED_IDS));

  it("each id is a card, an add-on, a combo line, or ignored with a reason", () => {
    const missing = PRICING_CATALOG.map((p) => p.id).filter(
      (id) => !cardIds.has(id) && !addonIds.has(id) && !lineIds.has(id) && !ignored.has(id),
    );
    assert.deepEqual(missing, []);
  });

  it("ignored ids are real catalog ids, not cards, and each has a reason", () => {
    const catalogIds = new Set<string>(PRICING_CATALOG.map((p) => p.id));
    for (const [id, reason] of Object.entries(SALES_IGNORED_IDS)) {
      assert.ok(catalogIds.has(id), id);
      assert.ok(!cardIds.has(id), id);
      assert.ok((reason ?? "").length > 10, id);
    }
  });

  it("one card per id, and the eight common services come first, in order", () => {
    assert.equal(cardIds.size, book.cards.length);
    assert.deepEqual(
      book.cards.slice(0, FEATURED_CARD_IDS.length).map((c) => c.id),
      [...FEATURED_CARD_IDS],
    );
    assert.deepEqual(
      book.cards.filter((c) => c.featured).map((c) => c.family),
      ["song", "blessing", "remote", "podcast", "mobile", "dj", "attractions", "sound"],
    );
  });

  it("pure add-ons are not cards", () => {
    for (const id of ["song_pitch_coaching", "blessing_extra_participant", "travel_north_south", "event_extra_activation"]) {
      assert.ok(!cardIds.has(id), id);
    }
  });
});

describe("sales book: prices come from the catalog", () => {
  it("each card's price, VAT and price line", () => {
    for (const c of book.cards) {
      const id = c.id as PriceItemId;
      assert.equal(c.exVat, getExVat(id), c.id);
      assert.equal(c.inclVat, catalogWithVat(getExVat(id)), c.id);
      const price = formatPrice(c.exVat, { from: c.priceFrom, audience: c.audience });
      const unit = billingUnit(id);
      assert.equal(c.priceLine, unit ? `${price.headline} ${unit} (${price.vatNote})` : price.inline, c.id);
      assert.equal(c.priceLine.startsWith("מ-"), c.priceFrom, c.id);
      assert.equal(c.priceFrom, isFromId(id), c.id);
      assert.deepEqual(c.morningLines, [{ id: c.id, label: getPriceById(id).label, qty: 1, unitExVat: c.exVat }]);
    }
  });

  it("monthly, per-day and per-episode prices carry their unit, in the card and in the message", () => {
    const withUnit = book.cards.filter((c) => billingUnit(c.id));
    assert.ok(withUnit.length >= 3);
    for (const c of withUnit) {
      const unit = billingUnit(c.id);
      const head = formatPrice(c.exVat, { from: c.priceFrom, audience: c.audience }).headline;
      assert.ok(c.priceLine.includes(`${head} ${unit} (`), c.id);
      assert.ok(c.message.includes(c.priceLine), c.id);
    }
    assert.ok(card("employer_monthly").priceLine.includes(" לחודש ("));
    assert.ok(card("dry_hire_day").priceLine.includes(" ליום ("));
  });

  it("business cards show the price before VAT first", () => {
    const pro = book.cards.find((c) => c.category === "pro");
    assert.ok(pro);
    assert.equal(pro.audience, "business");
    assert.equal(card("content_studio_pilot").audience, "business");
    assert.equal(card("song_recording").audience, "consumer");
    for (const c of book.cards.filter((x) => x.audience === "business")) {
      assert.ok(c.priceLine.indexOf("+ מע״מ") < c.priceLine.indexOf("כולל מע״מ"), c.id);
    }
  });

  it("add-ons carry catalog prices, and DJ add-ons come from the DJ calculator", () => {
    for (const c of book.cards) {
      for (const a of c.addons) {
        assert.equal(a.inclVat, catalogWithVat(a.exVat), `${c.id}/${a.id}`);
        assert.equal(a.exVat, a.catalogIds.reduce((sum, id) => sum + getExVat(id as PriceItemId), 0), `${c.id}/${a.id}`);
        assert.equal(a.priceFrom, a.catalogIds.some(isFromId), `${c.id}/${a.id}`);
      }
    }
    for (const id of ["dj_premium", "dj_yakir_personal"] as const) {
      assert.deepEqual(
        card(id).addons.map((a) => [a.label, a.exVat]),
        DJ_CALC_ADDONS.map((o) => [o.name, o.priceExVat]),
      );
    }
    assert.ok(card("song_recording").addons.some((a) => a.id === "song_home_media_40" && a.requires === "studio_session_clip_edited"));
    /* צילום פודקאסט באירוע בנוי על אולפן נייד, מחיר התחלה */
    const fromAddons = card("dj_premium").addons.filter((a) => a.priceFrom);
    assert.ok(fromAddons.length > 0);
    assert.ok(fromAddons.every((a) => a.catalogIds.some((id) => getPriceFromById(id as PriceItemId))));
  });
});

describe("sales book: combos", () => {
  it("lines add up to the total, and VAT is applied once on the total", () => {
    for (const c of book.cards) {
      for (const combo of c.combos) {
        assert.equal(linesTotal(combo), combo.totalExVat, `${c.id}/${combo.key}`);
        assert.equal(combo.totalInclVat, catalogWithVat(combo.totalExVat), `${c.id}/${combo.key}`);
        assert.ok(combo.lines.every((l) => l.qty >= 1 && l.unitExVat > 0), `${c.id}/${combo.key}`);
      }
      assert.equal(new Set(c.combos.map((x) => x.key)).size, c.combos.length, c.id);
    }
  });

  it("song: the form's own combinations, plus 4 singers with pitch correction", () => {
    const exported = getSongOfferExport().combinations;
    const song = card("song_recording");
    for (const combo of song.combos.filter((x) => !x.key.startsWith("participants-"))) {
      const match = exported.find((e) => e.addonIds.join(",") === combo.key);
      assert.ok(match, combo.key);
      assert.equal(combo.totalExVat, match.totalExVat);
      assert.equal(combo.totalInclVat, match.totalWithVat);
    }
    const group = calcSongOffer(["song_pitch_coaching"], 4);
    const four = comboByKey(song, "participants-4+song_pitch_coaching");
    assert.equal(four.totalExVat, group.totalExVat);
    assert.equal(four.totalInclVat, group.totalWithVat);
    assert.ok(four.lines.some((l) => l.id === SONG_PARTICIPANT_RULES.extraId && l.qty === 3));
  });

  it("blessing: 4 speakers is VAT on the total (blessingTotalExVat), plus rewrite and pitch", () => {
    const b = card("blessing_recording");
    const four = comboByKey(b, "speakers-4");
    assert.equal(four.totalExVat, blessingTotalExVat(4));
    assert.equal(four.totalInclVat, catalogWithVat(blessingTotalExVat(4)));
    assert.equal(comboByKey(b, "blessing_text_rewrite").totalExVat, getExVat("blessing_recording") + getExVat("blessing_text_rewrite"));
    assert.equal(comboByKey(b, "studio_pitch_correction").totalExVat, getExVat("blessing_recording") + getExVat("studio_pitch_correction"));
    const r = card("studio_remote");
    assert.equal(comboByKey(r, "speakers-2").totalExVat, blessingTotalExVat(2, "studio_remote"));
    assert.equal(comboByKey(r, "studio_pitch_correction").totalExVat, getExVat("studio_remote") + getExVat("studio_pitch_correction"));
  });

  it("podcast: 3 and 4 participants, and the episode packs", () => {
    const p = card("podcast_audio");
    for (const n of [PODCAST_PARTICIPANT_RULES.included + 1, PODCAST_PARTICIPANT_RULES.included + 2]) {
      assert.equal(comboByKey(p, `participants-${n}`).totalExVat, getExVat("podcast_audio") + podcastParticipantsCostExVat(n, false));
    }
    for (const id of PODCAST_AUDIO_PACK_IDS) assert.equal(comboByKey(p, id).totalExVat, getExVat(id));
  });

  it("mobile studio: every combo equals calcMobileStudioAtHomeExVat and is a starting price", () => {
    const m = card("mobile_podcast_at_home");
    assert.equal(m.combos.length, 4);
    const cases = { "center-2": ["center", 2], "center-4": ["center", 4], "north_south-2": ["north_south", 2], "eilat-1": ["eilat", 1] } as const;
    for (const [key, [geo, people]] of Object.entries(cases)) {
      const combo = comboByKey(m, key);
      assert.equal(combo.totalExVat, calcMobileStudioAtHomeExVat(geo, people), key);
      assert.ok(combo.priceFrom, key);
    }
  });

  it("DJ: center, the two travel fees, and Yakir personally", () => {
    const dj = card("dj_premium");
    assert.equal(comboByKey(dj, "center").totalExVat, getExVat("dj_premium"));
    for (const id of DJ_TRAVEL_FEE_IDS) assert.equal(comboByKey(dj, id).totalExVat, getExVat("dj_premium") + getExVat(id));
    assert.equal(comboByKey(dj, "dj_yakir_personal").totalExVat, getExVat("dj_yakir_personal"));
    const yakir = card("dj_yakir_personal");
    for (const id of DJ_TRAVEL_FEE_IDS) assert.equal(comboByKey(yakir, id).totalExVat, getExVat("dj_yakir_personal") + getExVat(id));
  });

  it("attractions: catalog bundles and the booking wizard's activation rules", () => {
    const a = card("event_attraction_1");
    for (const b of CATALOG_BUNDLES.filter((x) => x.singleId === "event_attraction_1")) {
      const combo = comboByKey(a, b.bundleId);
      assert.equal(combo.totalExVat, getExVat(b.bundleId));
      assert.equal(combo.priceFrom, getPriceFromById(b.bundleId));
    }
    for (const opt of RIGID_ACTIVATION_OPTIONS.filter((o) => o.addOnPrice > 0)) {
      assert.equal(comboByKey(a, opt.key).totalExVat, getExVat("event_attraction_1") + opt.addOnPrice, opt.key);
    }
    for (const opt of LIQUID_FREQUENCY_OPTIONS.filter((o) => o.addOnPrice > 0)) {
      assert.equal(comboByKey(a, opt.key).totalExVat, getExVat("event_attraction_1") + opt.addOnPrice, opt.key);
    }
  });

  it("every price with editing (withEditing) is a combo on its card", () => {
    const items = (PRICING_CATALOG as readonly PriceItem[]).filter((p) => p.withEditing);
    assert.ok(items.length > 0);
    for (const item of items) {
      const editing = item.withEditing;
      assert.ok(editing);
      const combo = comboByKey(card(item.id as PriceItemId), "with_editing");
      assert.equal(combo.label, editing.label, item.id);
      assert.equal(combo.totalExVat, editing.exVat, item.id);
      assert.equal(combo.totalInclVat, catalogWithVat(editing.exVat), item.id);
      assert.equal(combo.lines[0].id, item.id, item.id);
      assert.equal(linesTotal(combo), editing.exVat, item.id);
    }
  });

  it("sound rental with one attraction", () => {
    assert.equal(
      comboByKey(card("event_sound_rental"), "event_attraction_1").totalExVat,
      getExVat("event_sound_rental") + getExVat("event_attraction_1"),
    );
  });
});

describe("sales book: participants", () => {
  it("song, blessing, remote, podcast and mobile use the site's own calculators", () => {
    const song = card("song_recording").participants;
    assert.ok(song);
    assert.equal(song[0].count, SONG_PARTICIPANT_RULES.included);
    assert.equal(song[song.length - 1].count, SONG_PARTICIPANT_RULES.max);
    for (const row of song) assert.equal(row.totalExVat, calcSongOffer([], row.count).totalExVat);

    for (const id of ["blessing_recording", "studio_remote"] as const) {
      const rows = card(id).participants;
      assert.ok(rows);
      assert.equal(rows.length, BLESSING_PARTICIPANT_RULES.max - BLESSING_PARTICIPANT_RULES.included + 1);
      for (const row of rows) assert.equal(row.totalExVat, blessingTotalExVat(row.count, id));
    }

    const podcast = card("podcast_audio").participants;
    assert.ok(podcast);
    assert.equal(podcast[0].count, PODCAST_PARTICIPANT_RULES.included);
    assert.equal(podcast[0].totalExVat, getExVat("podcast_audio"));
    for (const row of podcast) assert.equal(row.totalExVat, getExVat("podcast_audio") + podcastParticipantsCostExVat(row.count, false));

    const mobile = card("mobile_podcast_at_home").participants;
    assert.ok(mobile);
    assert.equal(mobile[0].count, MOBILE_STUDIO_CHANNEL_RULES.included);
    for (const row of mobile) assert.equal(row.totalExVat, calcMobileStudioAtHomeExVat("center", row.count));

    for (const c of book.cards) {
      for (const row of c.participants ?? []) assert.equal(row.totalInclVat, catalogWithVat(row.totalExVat), c.id);
    }
    assert.equal(card("dj_premium").participants, null);
  });
});

describe("sales book: what is included", () => {
  it("song keeps the scope line first, then the item's own lines", () => {
    const song = card("song_recording");
    assert.equal(song.included?.[0], getPriceById("song_recording").scope?.includes);
    assert.ok(song.excluded?.includes("תיקון זיופים"));
  });

  it("a scope line that repeats the override is dropped (DJ from the team)", () => {
    const dj = card("dj_premium");
    assert.ok(dj.included?.includes("DJ מנוסה מהצוות"));
    assert.ok(!dj.included?.includes("תקליטן מהצוות"));
  });

  it("items with only the category's default wording are null", () => {
    assert.equal(card("ulpan_trial").included, null);
    assert.equal(card("ulpan_trial").excluded, null);
    /* צילום אירוע: יש לו "לא כולל" משלו, אבל "כולל" רק מהקטגוריה */
    assert.equal(card("full_event_photo_8h").included, null);
    assert.ok(card("full_event_photo_8h").excluded?.length);
    /* פסטיבל: רק שורת ה-scope היא פירוט אמיתי */
    assert.deepEqual(card("festival_all_in").included, [getPriceById("festival_all_in").scope?.includes]);
  });

  it("no card repeats a line", () => {
    for (const c of book.cards) {
      for (const lines of [c.included, c.excluded]) {
        if (lines) assert.equal(new Set(lines).size, lines.length, c.id);
      }
    }
  });
});

/* ─── הודעות ─── */

const BANNED_CHARS = /[!—–…“”‘’]/;
const AI_TELL_PHRASES = [
  ...readFileSync(resolve(ROOT, "scripts/audit-ai-tells.mjs"), "utf8").matchAll(/phrase: "([^"]+)"/g),
].map((m) => m[1]);

/** כל הסכומים בהודעה שיש לידם ₪ */
function shekelAmounts(text: string): number[] {
  return [...text.matchAll(/(\d[\d,]*(?:\.\d+)?)\s*₪/g)].map((m) => Number(m[1].replace(/,/g, "")));
}

function allowedAmounts(c: SalesCard): Set<number> {
  return new Set([
    c.exVat,
    c.inclVat,
    ...c.addons.flatMap((a) => [a.exVat, a.inclVat]),
    ...c.combos.flatMap((x) => [x.totalExVat, x.totalInclVat]),
    ...(c.participants ?? []).flatMap((r) => [r.totalExVat, r.totalInclVat]),
  ]);
}

describe("sales copy: first message and confirm line", () => {
  it("found the banned phrases list", () => {
    assert.ok(AI_TELL_PHRASES.length >= 5);
  });

  it("every message: short, human, ends with a question, prices from the card", () => {
    for (const c of book.cards) {
      assert.ok(c.message.length <= SALES_MESSAGE_MAX, `${c.id}: ${c.message.length}`);
      assert.doesNotMatch(c.message, BANNED_CHARS, c.id);
      assert.ok(c.message.endsWith("?"), c.id);
      for (const phrase of AI_TELL_PHRASES) assert.ok(!c.message.includes(phrase), `${c.id}: ${phrase}`);
      assert.ok(c.message.includes(c.priceLine), c.id);
      const allowed = allowedAmounts(c);
      const amounts = shekelAmounts(c.message);
      for (const amount of amounts) assert.ok(allowed.has(amount), `${c.id}: ${amount}`);
      /* לכל היותר מחיר אחד מעבר למחיר של הכרטיס */
      const extra = amounts.filter((x) => x !== c.exVat && x !== c.inclVat);
      assert.ok(extra.length <= 1, `${c.id}: ${extra.join(", ")}`);
    }
  });

  it("every confirm line: starts with 'רק לוודא', ends with a question", () => {
    for (const c of book.cards) {
      if (c.confirmLine == null) continue;
      assert.ok(c.confirmLine.startsWith(CONFIRM_PREFIX), c.id);
      assert.ok(c.confirmLine.length <= SALES_MESSAGE_MAX, c.id);
      assert.doesNotMatch(c.confirmLine, BANNED_CHARS, c.id);
      assert.ok(c.confirmLine.endsWith("?"), c.id);
      assert.deepEqual(shekelAmounts(c.confirmLine), [], c.id);
    }
    for (const id of FEATURED_CARD_IDS) assert.ok(card(id).confirmLine, id);
  });

  it("the common services mention the right add-on, computed from the catalog", () => {
    const song = card("song_recording");
    assert.ok(song.message.includes(formatPrice(getExVat("studio_session_clip_edited")).headline));
    const blessing = card("blessing_recording");
    assert.ok(blessing.message.includes(formatPrice(getExVat("blessing_text_rewrite")).headline));
    const podcast = card("podcast_audio");
    assert.ok(podcast.message.includes(`${PODCAST_PARTICIPANT_RULES.included} משתתפים כלולים`));
    assert.ok(podcast.message.includes(formatPrice(getExVat(PODCAST_PARTICIPANT_RULES.extraId)).headline));
    const attraction = card("event_attraction_1");
    assert.ok(attraction.message.includes(formatPrice(getExVat("event_attraction_2")).headline));
    assert.ok(card("mobile_podcast_at_home").message.includes(formatPrice(getExVat("mobile_podcast_at_home"), { from: true }).inline));
    const sound = getPriceById("event_sound_rental");
    assert.ok(card("event_sound_rental").message.includes(sound.scope?.includes ?? "?"));
    assert.equal(card("dj_premium").confirmLine, `${CONFIRM_PREFIX}אפקטים לא כלולים במחיר הזה. מספיק לכם DJ בלי אפקטים?`);
  });
});

describe("sales copy: what goes into the order confirmation", () => {
  it("every confirm line has an agreed line: a fact, no price, no question", () => {
    for (const c of book.cards) {
      assert.equal(c.agreedLine == null, c.confirmLine == null, c.id);
      if (c.agreedLine == null) continue;
      assert.doesNotMatch(c.agreedLine, /מחיר|₪|מע״מ|\?/, c.id);
      assert.doesNotMatch(c.agreedLine, BANNED_CHARS, c.id);
      assert.ok(!c.agreedLine.startsWith(CONFIRM_PREFIX), c.id);
    }
    assert.equal(card("dj_premium").agreedLine, "בלי אפקטים");
    assert.equal(card("blessing_recording").agreedLine, "דובר אחד");
    assert.equal(card("song_recording").agreedLine, "בלי תיקון זיופים, השיר יוצא כמו ששרתם");
  });
});

describe("sales copy: messages read like a person, not a price table", () => {
  const featured = new Set<string>(FEATURED_CARD_IDS);
  const bundles = new Set<string>(CATALOG_BUNDLES.filter((b) => b.singleId === "event_attraction_1").map((b) => b.bundleId));
  const generic = book.cards.filter((c) => !featured.has(c.id) && !bundles.has(c.id) && c.id !== "dj_yakir_personal");

  it("no table shorthand (' - ', ' + ', '/') outside the price itself", () => {
    for (const c of generic) {
      const text = c.message.replace(c.priceLine, "");
      assert.doesNotMatch(text, /\s-\s|\s\+\s|\//, `${c.id}: ${text}`);
    }
  });

  it("almost every message says what the customer gets", () => {
    /* intro + שאלה בלבד: רק כשבקטלוג אין שורה שמתאימה להודעה */
    const bare = generic.filter((c) => c.message.replace(c.priceLine, "").split(/[.?]\s/).length <= 2);
    assert.ok(bare.length <= 10, bare.map((c) => c.id).join(", "));
    const context = getPriceById("full_podcast_production").context ?? "?";
    assert.ok(card("full_podcast_production").message.includes(context));
  });

  it("the closing question fits the service", () => {
    assert.ok(card("employer_monthly").message.endsWith("מאיזה חודש תרצו להתחיל?"));
    assert.ok(card("dry_hire_day").message.endsWith("לאיזה תאריך?"));
    assert.ok(card("workshop_full_day").message.endsWith("לאיזה תאריך?"));
    assert.ok(card("on_site_full_day").message.endsWith("לאיזה תאריך?"));
    assert.ok(card("podcast_editing_hour").message.endsWith("עד מתי צריך את זה?"));
    assert.ok(card("audiobook_hour").message.endsWith("מתי נוח לכם להקליט?"));
  });

  it("Yakir personally writes in the first person", () => {
    const yakir = card("dj_yakir_personal").message;
    assert.ok(yakir.includes("אני אישית"));
    assert.ok(!yakir.includes("יקיר"));
  });
});

describe("sales book: search", () => {
  it("one Hebrew word finds the common services", () => {
    const find = (term: string) => book.cards.filter((c) => c.searchTerms.some((t) => t.includes(term))).map((c) => c.id);
    assert.ok(find("שיר").includes("song_recording"));
    assert.ok(find("דרשה").includes("blessing_recording"));
    assert.ok(find("סבא").includes("podcast_audio"));
    assert.ok(find("DJ").includes("dj_premium"));
    assert.ok(find("דיג׳יי").includes("dj_premium"));
    assert.ok(find("תקליטן").includes("dj_yakir_personal"));
    assert.ok(find("זיקוקים").includes("event_attraction_1"));
    assert.ok(find("עשן").includes("event_attraction_1"));
    assert.ok(find("הגברה").includes("event_sound_rental"));
    assert.ok(find("נייד").includes("mobile_podcast_at_home"));
    assert.ok(find("פודקאסט").includes("podcast_audio"));
  });

  it("page links point at the site", () => {
    assert.ok(card("song_recording").pageUrl?.startsWith("https://yakircohen.com/"));
  });
});
