import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { catalogWithVat, getPriceById } from "@/lib/data/pricing-catalog";
import {
  checkMorningLinks,
  getDepositLink,
  getPaymentLink,
  isMorningUrl,
  missingBaseLinks,
  MORNING_LINKS,
  type MorningLinksFile,
} from "@/lib/sales/morning-links";
import { buildSalesBook } from "@/lib/sales/sales-book";
import { buildDepositMessage, buildMorningLinkFields, buildPaymentMessage, SALES_MESSAGE_MAX } from "@/lib/sales/sales-copy";

const song = getPriceById("song_recording");
assert.ok(song);
const SONG_INCL = catalogWithVat(song.exVat);
const FIXED = "https://app.greeninvoice.co.il/payment/abc123";
const OPEN = "https://pay.morning.co/open/xyz";
const DEPOSIT = "https://app.greeninvoice.co.il/payment/dep200";

const full: MorningLinksFile = {
  updated: "2026-10-11",
  deposit: { url: DEPOSIT, inclVat: 200 },
  open: { url: OPEN },
  cards: { song_recording: { url: FIXED, inclVat: SONG_INCL } },
};
const empty: MorningLinksFile = { updated: "2026-10-11", deposit: { url: "", inclVat: 200 }, open: { url: "" }, cards: {} };

describe("isMorningUrl", () => {
  it("מקבל רק https על דומיין של מורנינג", () => {
    assert.equal(isMorningUrl(FIXED), true);
    assert.equal(isMorningUrl(OPEN), true);
    assert.equal(isMorningUrl("http://app.greeninvoice.co.il/x"), false);
    assert.equal(isMorningUrl("https://evil.com/greeninvoice.co.il"), false);
    assert.equal(isMorningUrl("https://greeninvoice.co.il.evil.com/x"), false);
    assert.equal(isMorningUrl("לא כתובת"), false);
  });
});

describe("getPaymentLink", () => {
  it("קבוע כשיש, אחרת סכום פתוח, אחרת null", () => {
    assert.deepEqual(getPaymentLink("song_recording", { file: full }), { kind: "fixed", url: FIXED, inclVat: SONG_INCL });
    assert.deepEqual(getPaymentLink("studio_hour", { file: full }), { kind: "open", url: OPEN, inclVat: null });
    assert.equal(getPaymentLink("studio_hour", { file: empty }), null);
  });
  it('ב"החל מ" אין לינק קבוע גם אם נשמר', () => {
    assert.equal(getPaymentLink("song_recording", { priceFrom: true, file: full })?.kind, "open");
  });
  it("מקדמה", () => {
    assert.deepEqual(getDepositLink(full), { kind: "deposit", url: DEPOSIT, inclVat: 200 });
    assert.equal(getDepositLink(empty), null);
    assert.deepEqual(missingBaseLinks(empty), ["deposit", "open"]);
    assert.deepEqual(missingBaseLinks(full), []);
  });
});

describe("checkMorningLinks", () => {
  it("תקין על קובץ מלא ועל הקובץ בריפו", () => {
    assert.deepEqual(checkMorningLinks(full), []);
    assert.deepEqual(checkMorningLinks(MORNING_LINKS), []);
  });
  it("תופס מזהה לא קיים, URL זר ומחיר שזז", () => {
    const bad: MorningLinksFile = {
      ...full,
      open: { url: "https://example.com/pay" },
      cards: {
        song_recording: { url: FIXED, inclVat: SONG_INCL + 1 },
        no_such_item: { url: FIXED, inclVat: 1 },
      },
    };
    const ids = checkMorningLinks(bad).map((i) => i.id).sort();
    assert.deepEqual(ids, ["no_such_item", "open", "song_recording"]);
  });
});

describe("הודעות התשלום", () => {
  const card = buildSalesBook().cards.find((c) => c.id === "song_recording");
  assert.ok(card);
  const fromCard = buildSalesBook().cards.find((c) => c.priceFrom);
  assert.ok(fromCard);

  it("לינק קבוע: הסכום כולל מע״מ מהכרטיס והלינק, עד המגבלה, בלי סימני קריאה", () => {
    const text = buildPaymentMessage(card, { kind: "fixed", url: FIXED, inclVat: SONG_INCL });
    assert.ok(text.includes(`${SONG_INCL.toLocaleString("he-IL")} ₪ כולל מע״מ`));
    assert.ok(text.includes(FIXED));
    assert.ok(text.length <= SALES_MESSAGE_MAX);
    assert.ok(!/[!—…]/.test(text));
  });
  it("סכום פתוח: אומר ללקוח לבחור את הסכום, וב'החל מ' בלי מספר", () => {
    const open = buildPaymentMessage(card, { kind: "open", url: OPEN, inclVat: null });
    assert.ok(open.includes("בוחרים את הסכום"));
    const from = buildPaymentMessage(fromCard, { kind: "open", url: OPEN, inclVat: null });
    assert.ok(from.includes("בסכום שסיכמנו"));
    assert.ok(!/\d/.test(from.split(OPEN)[0]!), "בלי מספר לפני הלינק");
  });
  it("מקדמה: הסכום מהלינק", () => {
    const text = buildDepositMessage({ kind: "deposit", url: DEPOSIT, inclVat: 200 });
    assert.ok(text.startsWith("מקדמה של 200 ₪"));
    assert.ok(text.includes(DEPOSIT));
  });
  it("השדות למורנינג: שם, שני המחירים, הקוד והפקודה", () => {
    const fields = buildMorningLinkFields(card);
    assert.ok(fields.includes(card.title));
    assert.ok(fields.includes(`${SONG_INCL.toLocaleString("he-IL")} ₪ כולל מע״מ`));
    assert.ok(fields.includes(`${song.exVat.toLocaleString("he-IL")} ₪ לפני מע״מ`));
    assert.ok(fields.includes("--id song_recording --url"));
  });
  it("בספר: בלי לינקים בקובץ אין הודעה, ויש שדות ליצירה לכרטיס רגיל", () => {
    const book = buildSalesBook();
    const anyLink = Boolean(MORNING_LINKS.open.url) || Object.keys(MORNING_LINKS.cards).length > 0;
    if (!anyLink) {
      assert.equal(card.payLink, null);
      assert.equal(card.payMessage, null);
      assert.equal(book.deposit, MORNING_LINKS.deposit.url ? book.deposit : null);
    }
    assert.ok(card.morningLinkFields == null || card.morningLinkFields.includes(card.id));
    assert.equal(fromCard.morningLinkFields, null);
  });
});
