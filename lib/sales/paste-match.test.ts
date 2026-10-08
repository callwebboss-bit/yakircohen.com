import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildSongOfferQuote } from "@/lib/data/song-offer";
import { buildSalesBook } from "@/lib/sales/sales-book";
import { findPasteCode, matchPaste, parseSongSelection } from "@/lib/sales/paste-match";
import { stampWhatsAppLeadCode } from "@/lib/whatsapp";

/* החלטת הבעלים D67, 7.10.2026: תיבת ההדבקה קוראת "קוד פנייה" ומזהה את השירות מגוף ההודעה */
const { cards } = buildSalesBook();
const CLIP = "studio_session_clip_edited";

/* ההודעה שהלקוח באמת שולח מטופס השיר, עם קוד ידוע */
function songMessage(code = "A7K2", participants = 3): { text: string; ycTag: string } {
  const quote = buildSongOfferQuote([CLIP], { source: "/studio", participants });
  const href = stampWhatsAppLeadCode(quote.waHref, code);
  return { text: new URL(href).searchParams.get("text") ?? "", ycTag: quote.ycTag };
}

describe("paste box: lead code", () => {
  it("reads the site's code line into the order confirmation form", () => {
    assert.equal(findPasteCode(songMessage("A7K2").text), "YC-A7K2");
    assert.equal(findPasteCode("שלום\nקוד פנייה: b2c3"), "YC-B2C3");
    assert.equal(findPasteCode("שלום, מה המחיר?"), null);
  });

  it("still reads a code written another way", () => {
    assert.equal(findPasteCode("אישור YC-A7K2"), "YC-A7K2");
    assert.equal(findPasteCode("[YC:service=dj|code=A7K2]"), "YC-A7K2");
  });
});

describe("paste box: service from the message text", () => {
  it("rebuilds the song selection exactly, with no tag in the message", () => {
    const { text } = songMessage();
    assert.ok(!text.includes("[YC:"));
    const selection = parseSongSelection(text);
    assert.ok(selection);
    assert.equal(selection.participants, 3);
    assert.equal(selection.addonLabels.length, 1);

    const { match, code } = matchPaste(text, cards);
    assert.equal(code, "YC-A7K2");
    assert.ok(match);
    assert.equal(match.card.id, "song_recording");
    assert.equal(match.via, "selection");
    assert.deepEqual(match.addonIds, [CLIP]);
    assert.equal(match.participants, 3);
    assert.equal(match.exact, true);
    assert.equal(match.seenExVat, match.todayExVat);
    assert.equal(match.mismatch, false);
  });

  it("warns when the song total the customer saw is not today's price", () => {
    const { text } = songMessage();
    const today = matchPaste(text, cards).match?.todayExVat ?? 0;
    const old = text.replace(/\(\s*[\d,.]+\s*₪\s*\+\s*מע״מ\s*\)/, `(${today + 50} ₪ + מע״מ)`);
    const { match } = matchPaste(old, cards);
    assert.equal(match?.exact, true);
    assert.equal(match?.seenExVat, today + 50);
    assert.equal(match?.mismatch, true);
  });

  it("finds a card by its title and search words, with no price warning", () => {
    const card = cards.find((c) => c.searchTerms.length > 0 && c.id !== "song_recording");
    assert.ok(card);
    const { match, code } = matchPaste(`שלום, מעוניין ב${card.title}\nקוד פנייה: C4D5`, cards);
    assert.equal(code, "YC-C4D5");
    assert.equal(match?.card.id, card.id);
    assert.equal(match?.via, "words");
    assert.equal(match?.exact, false);
    assert.equal(match?.mismatch, false);
  });

  it("an old message with a [YC:] tag still matches by the tag", () => {
    const { text, ycTag } = songMessage();
    const legacy = `${text.replace(/\nקוד פנייה: .*$/, "")}\n${ycTag}`;
    const { match, code } = matchPaste(legacy, cards);
    assert.equal(code, null);
    assert.equal(match?.card.id, "song_recording");
    assert.equal(match?.via, "tag");
    assert.equal(match?.exact, true);
    assert.equal(match?.mismatch, false);
  });

  it("nothing to match returns no card", () => {
    assert.equal(matchPaste("היי", cards).match, null);
  });
});
