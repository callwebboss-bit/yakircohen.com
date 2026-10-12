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
import {
  buildDepositMessage,
  buildMorningLinkFields,
  buildPaymentFailedMessage,
  buildPaymentMessage,
  buildPaymentMessageFull,
  buildPaymentWithBankMessage,
  includedLine,
  paymentNote,
  SALES_MESSAGE_MAX,
} from "@/lib/sales/sales-copy";

const song = getPriceById("song_recording");
assert.ok(song);
const SONG_INCL = catalogWithVat(song.exVat);
const FIXED = "https://app.greeninvoice.co.il/payment/abc123";
const OPEN = "https://pay.morning.co/open/xyz";
const DEPOSIT = "https://app.greeninvoice.co.il/payment/dep200";

const full: MorningLinksFile = {
  updated: "2026-10-11",
  bankTransferLine: "לבנק הפועלים, אישור בוואטסאפ",
  deposit: { url: DEPOSIT, inclVat: 200 },
  open: { url: OPEN, presets: [590, 885] },
  cards: { song_recording: { url: FIXED, inclVat: SONG_INCL } },
};
const empty: MorningLinksFile = {
  updated: "2026-10-11",
  bankTransferLine: "",
  deposit: { url: "", inclVat: 200 },
  open: { url: "" },
  cards: {},
};

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
    assert.deepEqual(getPaymentLink("studio_hour", { file: full }), {
      kind: "open",
      url: OPEN,
      inclVat: null,
      presets: [590, 885],
    });
    assert.equal(getPaymentLink("studio_hour", { file: empty }), null);
  });
  it("לינק קבוע שנשמר על מחיר ישן לא נשלח: נופל לסכום הפתוח", () => {
    const stale: MorningLinksFile = { ...full, cards: { song_recording: { url: FIXED, inclVat: SONG_INCL - 1 } } };
    assert.equal(getPaymentLink("song_recording", { file: stale })?.kind, "open");
    assert.equal(getPaymentLink("no_such_item", { file: full })?.kind, "open");
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

  it("לינק קבוע: קצרה, שתי שורות, הסכום כולל מע״מ מהכרטיס והלינק, בלי סימני קריאה", () => {
    const text = buildPaymentMessage(card, { kind: "fixed", url: FIXED, inclVat: SONG_INCL });
    assert.ok(text.includes(`${SONG_INCL.toLocaleString("he-IL")} ₪ כולל מע״מ`));
    assert.ok(text.includes(FIXED));
    assert.equal(text.split("\n").length, 2);
    assert.ok(!text.includes("כולל הקלטה"), "הקצרה בלי פירוט");
    assert.ok(text.length <= SALES_MESSAGE_MAX);
    assert.ok(!/[!—…]/.test(text));
  });
  it("המלאה: כולל / לא כולל מהכרטיס, עד 350, והלינק תמיד נשאר", () => {
    const link = { kind: "fixed" as const, url: FIXED, inclVat: SONG_INCL };
    const full = buildPaymentMessageFull(card, link);
    assert.ok(full.includes("כולל הקלטה, מיקס ומאסטר"));
    assert.ok(full.includes("לא כולל תיקון זיופים"));
    assert.ok(full.length <= SALES_MESSAGE_MAX);
    const detail = includedLine(card);
    assert.ok(detail && detail.startsWith("כולל ") && detail.includes(". לא כולל "));
    /* לינק ארוך מאוד: הפירוט נופל, הלינק נשאר */
    const longUrl = `${FIXED}/${"x".repeat(320)}`;
    const squeezed = buildPaymentMessageFull(card, { ...link, url: longUrl });
    assert.ok(squeezed.includes(longUrl));
    assert.ok(!squeezed.includes("כולל הקלטה"));
  });
  it("או בהעברה, והתשלום לא עבר", () => {
    const link = { kind: "fixed" as const, url: FIXED, inclVat: SONG_INCL };
    const bank = buildPaymentWithBankMessage(card, link, " לבנק, אישור בוואטסאפ ");
    assert.ok(bank.includes("או בהעברה: לבנק, אישור בוואטסאפ"));
    assert.ok(buildPaymentFailedMessage(link, "בנק").includes("או בהעברה"));
    assert.ok(!buildPaymentFailedMessage(link, null).includes("או בהעברה"));
    assert.ok(buildPaymentFailedMessage(link, null).endsWith(FIXED));
  });
  it("סכום פתוח: אומר ללקוח לבחור את הסכום, וב'החל מ' בלי מספר", () => {
    const inList = buildPaymentMessage(card, { kind: "open", url: OPEN, inclVat: null, presets: [SONG_INCL] });
    assert.ok(inList.includes(`בלינק בוחרים ${SONG_INCL.toLocaleString("he-IL")} ₪`));
    const notInList = buildPaymentMessage(card, { kind: "open", url: OPEN, inclVat: null, presets: [885] });
    assert.ok(notInList.includes(`בלינק מקלידים ${SONG_INCL.toLocaleString("he-IL")} ₪`));
    const noPresets = buildPaymentMessage(card, { kind: "open", url: OPEN, inclVat: null });
    assert.ok(noPresets.includes("בלינק מקלידים"));
    const from = buildPaymentMessage(fromCard, { kind: "open", url: OPEN, inclVat: null });
    assert.ok(from.includes("בסכום שסיכמנו"));
    assert.ok(!/\d/.test(from.split(OPEN)[0]!), "בלי מספר לפני הלינק");
  });
  it("מקדמה: הסכום מהלינק", () => {
    const text = buildDepositMessage({ kind: "deposit", url: DEPOSIT, inclVat: 200 });
    assert.ok(text.startsWith("מקדמה של 200 ₪"));
    assert.ok(text.includes(DEPOSIT));
  });
  it("השדות למורנינג: שם, שני המחירים, תיאור קצר עם התנאים, הקוד והפקודה", () => {
    const fields = buildMorningLinkFields(card);
    assert.ok(fields.includes(card.title));
    assert.ok(fields.includes("yakircohen.com/whats-included"));
    assert.ok(!fields.includes("תיקון זיופים"), "הרשימה המלאה לא על החשבונית");
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
  it("מנוי חודשי: הסכום עם 'לחודש', כדי שלא ייקרא כתשלום חד פעמי", () => {
    const monthly = buildSalesBook().cards.find((c) => c.id === "content_studio_retainer");
    assert.ok(monthly);
    const text = buildPaymentMessage(monthly, { kind: "open", url: OPEN, inclVat: null });
    assert.ok(text.includes("כולל מע״מ לחודש"), text);
  });
});

describe("paymentTexts במחשבון", () => {
  const card = buildSalesBook().cards.find((c) => c.id === "studio_hour");
  assert.ok(card);
  it("שדות ללינק קבוע רק לשירות עצמו, במחיר הקטלוג; עם שדרוג אין שדות", async () => {
    const { paymentTexts } = await import("@/components/admin/PaymentLinks");
    const base = paymentTexts(card, { totalInclVat: card.inclVat, priceFrom: false, hasSelection: false });
    const fields = base.byKind["morning-fields"];
    if (base.link?.kind !== "fixed") {
      assert.ok(fields?.includes(`${card.inclVat.toLocaleString("he-IL")} ₪ כולל מע״מ`));
    }
    const upsold = paymentTexts(card, { totalInclVat: card.inclVat + 500, priceFrom: false, hasSelection: true });
    assert.equal(upsold.byKind["morning-fields"], null);
  });
});

/* החלטת הבעלים 12.10.2026: הסכומים בלינק הפתוח כמו שהוגדרו במורנינג, וההודעה במחשבון
   כותבת "בוחרים" רק כשסכום ההצעה ברשימה, אחרת "מקלידים" */
describe("הלינק הפתוח האמיתי והסכום של ההצעה", () => {
  const presets = MORNING_LINKS.open.presets ?? [];
  const book = buildSalesBook();
  const card = book.cards.find((c) => c.id === "studio_hour");
  assert.ok(card);
  it("כל סכום קבוע בלינק הוא מחיר כולל מע״מ של פריט בקטלוג", async () => {
    const { PRICING_CATALOG } = await import("@/lib/data/pricing-catalog");
    const inCatalog = new Set(PRICING_CATALOG.map((item) => catalogWithVat(item.exVat)));
    assert.ok(presets.length > 0 && presets.length <= 5);
    for (const p of presets) assert.ok(inCatalog.has(p), `${p} לא מחיר כולל מע״מ בקטלוג`);
  });
  it("סכום הצעה ברשימה: בוחרים. סכום אחר: מקלידים", async () => {
    if (!MORNING_LINKS.open.url) return;
    const { paymentTexts } = await import("@/components/admin/PaymentLinks");
    for (const p of presets) {
      const pay = paymentTexts(card, { totalInclVat: p, priceFrom: false, hasSelection: true }).byKind.pay ?? "";
      assert.ok(pay.includes(`בלינק בוחרים ${p.toLocaleString("he-IL")} ₪`), pay);
    }
    let other = Math.max(...presets) + 1;
    while (presets.includes(other)) other += 1;
    const typed = paymentTexts(card, { totalInclVat: other, priceFrom: false, hasSelection: true });
    for (const kind of ["pay", "pay-full"] as const) {
      const text = typed.byKind[kind] ?? "";
      assert.ok(text.includes(`בלינק מקלידים ${other.toLocaleString("he-IL")} ₪`), text);
      assert.ok(!text.includes("בוחרים"), text);
    }
  });
});

describe("שורת ההערה ללינק הפתוח", () => {
  const card = buildSalesBook().cards.find((c) => c.id === "studio_hour");
  assert.ok(card);
  it("מופיעה רק כשיש שם שדה, עם שם השירות במילים ספורות", () => {
    const off = buildPaymentMessage(card, { kind: "open", url: OPEN, inclVat: null });
    assert.ok(!off.includes("כתבו"));
    const on = buildPaymentMessage(card, { kind: "open", url: OPEN, inclVat: null, noteLabel: "הערות" });
    assert.ok(on.includes(`בשדה "הערות" כתבו: ${paymentNote(card)}`), on);
    assert.ok(paymentNote(card).split(" ").length <= 3);
    assert.ok(!/[!—…]/.test(on));
  });
  it("בלינק קבוע אין שורת הערה: השירות כבר בלינק", () => {
    const fixed = buildPaymentMessage(card, { kind: "fixed", url: FIXED, inclVat: card.inclVat, noteLabel: "הערות" });
    assert.ok(!fixed.includes("כתבו"));
  });
});

describe("סוכן המכירות נותן לינק מהמנוע", () => {
  it("quote מחזיר הודעת תשלום זהה למחשבון", async () => {
    const { quoteService } = await import("@/lib/sales/agent-tools");
    const { paymentTexts } = await import("@/lib/sales/payment-texts");
    const q = quoteService({ id: "song_recording" });
    const card = buildSalesBook().cards.find((c) => c.id === "song_recording");
    assert.ok(card);
    const expected = paymentTexts(card, { totalInclVat: q.totalInclVat, priceFrom: q.priceFrom, hasSelection: false }).byKind.pay;
    assert.equal(q.payMessage, expected);
  });
});

