import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildSongCallbackRequest,
  calcSongOffer,
  getSongOfferFormData,
  getSongOfferQuotes,
  normalizeSongAddons,
  SONG_ADDON_IDS,
} from "@/lib/data/song-offer";
import {
  buildSongCallbackPayload,
  normalizeSongSelection,
  songAddonKey,
} from "@/lib/data/song-offer-quote";
import { buildLeadNotifyBody } from "@/lib/lead-email-notify";
import { checkLeadNotifyPayload } from "@/lib/leads/payload-check";

const SOURCE = "/studio/recording-song-modiin";

/* כל תתי-הקבוצות של התוספות, כולל קלט עם כפילויות ומזהה מומצא */
function allInputs(): string[][] {
  const out: string[][] = [];
  for (let mask = 0; mask < 1 << SONG_ADDON_IDS.length; mask += 1) {
    const ids = SONG_ADDON_IDS.filter((_, i) => mask & (1 << i));
    out.push(ids, [...ids].reverse(), [...ids, "bogus", ...ids]);
  }
  return out;
}

describe("getSongOfferQuotes (the precomputed combinations the form receives)", () => {
  const quotes = getSongOfferQuotes({ source: SOURCE });

  it("holds exactly the six valid combinations (interview only with the clip)", () => {
    assert.equal(Object.keys(quotes).length, 6);
    assert.ok(quotes.base);
    assert.equal(quotes["song_pre_session_interview"], undefined);
  });

  it("every quote matches calcSongOffer and its link carries the VAT-inclusive total", () => {
    for (const [key, quote] of Object.entries(quotes)) {
      const calc = calcSongOffer(quote.addonIds);
      assert.equal(songAddonKey(quote.addonIds), key);
      assert.equal(quote.totalExVat, calc.totalExVat);
      assert.equal(quote.totalWithVat, calc.totalWithVat);
      assert.ok(quote.waHref.startsWith("https://wa.me/"));
      const text = decodeURIComponent(new URL(quote.waHref).searchParams.get("text") ?? "");
      assert.ok(text.includes(calc.totalWithVat.toLocaleString("he-IL")));
      assert.ok(quote.offerHref.endsWith("#song-offer"));
    }
  });

  it("base-only is 590 including VAT (500 before VAT)", () => {
    assert.equal(quotes.base.totalWithVat, 590);
    assert.equal(quotes.base.totalExVat, 500);
    assert.equal(quotes.base.totalLine, "590 ₪ כולל מע״מ (500 ₪ + מע״מ)");
  });
});

describe("normalizeSongSelection (client) agrees with normalizeSongAddons (server)", () => {
  const { addons } = getSongOfferFormData({ source: SOURCE });
  const rules = addons.map((a) => ({ id: a.id, requires: a.requires }));

  it("for every subset, in any order, with duplicates and unknown ids", () => {
    for (const input of allInputs()) {
      assert.deepEqual(normalizeSongSelection(input, rules), normalizeSongAddons(input));
    }
  });

  it("every normalized selection has a precomputed quote", () => {
    const quotes = getSongOfferQuotes({ source: SOURCE });
    for (const input of allInputs()) {
      assert.ok(quotes[songAddonKey(normalizeSongSelection(input, rules))]);
    }
  });
});

describe("buildSongCallbackPayload (client) equals buildSongCallbackRequest", () => {
  it("produces the same Phase 1 payload, which the server accepts", () => {
    const quotes = getSongOfferQuotes({ source: SOURCE, giftMode: true });
    const contact = {
      name: "נועה כהן",
      phone: "054-123-4567",
      source: SOURCE,
      giftMode: true,
      submissionId: "sub-9",
      honeypot: "",
    };
    for (const quote of Object.values(quotes)) {
      const fromQuote = buildSongCallbackPayload(quote, contact);
      const direct = buildSongCallbackRequest({ ...contact, addonIds: quote.addonIds });
      assert.deepEqual(fromQuote, direct);
      assert.equal(fromQuote.formId, "song_offer_callback");
      assert.deepEqual(
        checkLeadNotifyPayload({ ...fromQuote, body: buildLeadNotifyBody(fromQuote) }),
        { kind: "accept", flags: [] },
      );
    }
  });
});
