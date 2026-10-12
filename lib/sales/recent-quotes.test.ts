import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildSalesBook, type SalesCard } from "@/lib/sales/sales-book";
import {
  addRecentQuote,
  isRecentQuote,
  parseRecentQuotes,
  RECENT_QUOTES_MAX,
  repriceRecentQuote,
  toRecentSelection,
  type RecentQuote,
} from "@/lib/sales/recent-quotes";
import { buildSelectionQuote, defaultSelection, selectionOptions } from "@/lib/sales/selection-quote";

/* החלטת הבעלים 12.10.2026: ההצעות האחרונות בעמדת המכירות */

const { cards } = buildSalesBook();
const withAddons = cards.find((c) => selectionOptions(c).addons.length > 0);
assert.ok(withAddons, "כרטיס עם שדרוגים");
const card: SalesCard = withAddons;
const addonId = selectionOptions(card).addons.find((a) => !a.requires)!.id;
const selection = { ...defaultSelection(card), addonIds: [addonId] };
const todayTotal = buildSelectionQuote(card, selection).totalInclVat;

function entry(over: Partial<RecentQuote> = {}): RecentQuote {
  return {
    cardId: card.id,
    selection: toRecentSelection(selection),
    totalInclVat: todayTotal,
    leadCode: "YC-A7K2",
    savedAt: "2026-10-12T10:00:00.000Z",
    ...over,
  };
}

describe("recent quotes", () => {
  it("only the allowed fields are kept: no name, no phone", () => {
    const dirty = { ...entry(), firstName: "דנה", phone: "0501234567" } as RecentQuote;
    const [saved] = addRecentQuote([], dirty);
    assert.deepEqual(Object.keys(saved!).sort(), ["cardId", "leadCode", "savedAt", "selection", "totalInclVat"]);
    assert.ok(!JSON.stringify(saved).includes("050"));
  });

  it("an invalid lead code is not stored", () => {
    assert.equal(isRecentQuote(entry({ leadCode: "0501234567" })), false);
    assert.equal(addRecentQuote([], entry({ leadCode: "0501234567" }))[0]!.leadCode, null);
    assert.equal(isRecentQuote(entry({ leadCode: null })), true);
  });

  it("newest first, the same quote is not duplicated, at most 20", () => {
    let list: RecentQuote[] = [];
    for (let i = 0; i < RECENT_QUOTES_MAX + 5; i++) {
      list = addRecentQuote(list, entry({ leadCode: null, savedAt: new Date(Date.UTC(2026, 9, 1, 0, i)).toISOString() }));
    }
    assert.equal(list.length, 1, "same card, selection and code: one entry");
    const other = entry({ leadCode: "YC-B3C4", savedAt: "2026-10-12T11:00:00.000Z" });
    list = addRecentQuote(list, other);
    assert.equal(list.length, 2);
    assert.equal(list[0]!.leadCode, "YC-B3C4");
    let many: RecentQuote[] = [];
    for (let i = 0; i < RECENT_QUOTES_MAX + 5; i++) {
      many = addRecentQuote(many, entry({ selection: { ...toRecentSelection(selection), activations: i } }));
    }
    assert.equal(many.length, RECENT_QUOTES_MAX);
  });

  it("parsing localStorage: garbage or bad entries are dropped, never throws", () => {
    assert.deepEqual(parseRecentQuotes(null), []);
    assert.deepEqual(parseRecentQuotes("{not json"), []);
    assert.deepEqual(parseRecentQuotes(JSON.stringify({ a: 1 })), []);
    const good = entry();
    const parsed = parseRecentQuotes(JSON.stringify([good, { cardId: 5 }, { ...good, selection: null }]));
    assert.deepEqual(parsed, [good]);
  });

  it("reopening recomputes with today's prices; same total means no note", () => {
    const repriced = repriceRecentQuote(entry(), card);
    assert.equal(repriced.todayInclVat, todayTotal);
    assert.equal(repriced.priceChanged, false);
    assert.deepEqual(repriced.preset.addonIds, [addonId]);
  });

  it("a total saved before a price change shows 'the price was updated'", () => {
    const old = entry({ totalInclVat: todayTotal - 1 });
    const repriced = repriceRecentQuote(old, card);
    assert.equal(repriced.priceChanged, true);
    assert.equal(repriced.todayInclVat, todayTotal);
  });
});
