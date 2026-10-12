import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { quoteService } from "@/lib/sales/agent-tools";
import { assertMorningPathAllowed, buildMorningQuoteDocument, MORNING_QUOTE_TYPE } from "@/lib/sales/morning-document";

/* החלטת הבעלים 12.10.2026, סוכן מכירות: ה-CLI רק מציג במורנינג, לא יוצר */
describe("morning document for the sales CLI", () => {
  it("allows only the token and preview paths", () => {
    assert.equal(assertMorningPathAllowed("/account/token"), "/account/token");
    assert.equal(assertMorningPathAllowed("/documents/preview"), "/documents/preview");
    for (const path of ["/documents", "/documents/preview/../", "/payments/form", "/clients", ""]) {
      assert.throws(() => assertMorningPathAllowed(path));
    }
  });

  it("builds a VAT-inclusive quote whose lines sum to the site total", () => {
    const q = quoteService({ id: "song_recording", addonIds: ["song_pitch_coaching", "studio_session_clip_edited"], participants: 3 });
    const doc = buildMorningQuoteDocument({
      title: q.title,
      lines: q.morningInclLines,
      totalInclVat: q.totalInclVat,
      clientName: "בדיקה",
      priceHash: q.priceHash,
    });
    assert.equal(doc.type, MORNING_QUOTE_TYPE);
    assert.equal(doc.vatType, 0);
    assert.ok(doc.income.every((l) => l.quantity === 1 && l.vatType === 1));
    assert.equal(doc.income.reduce((s, l) => s + l.price, 0), Math.round(q.totalInclVat));
    assert.ok(!doc.remarks.includes("לתשלום"));
  });

  it("refuses lines that do not sum to the total", () => {
    assert.throws(() =>
      buildMorningQuoteDocument({
        title: "x",
        lines: [{ id: "a", label: "a", qty: 1, amountInclVat: 10 }],
        totalInclVat: 11,
        priceHash: "00000000",
      }),
    );
  });
});
