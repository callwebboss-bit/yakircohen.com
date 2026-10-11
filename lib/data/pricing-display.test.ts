import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatConsumerPriceLine,
  formatDualPriceLines,
  formatHubPriceDual,
  formatPagePrice,
  formatPrice,
  formatPriceScopeDisplay,
  getPriceAudience,
} from "@/lib/data/pricing-display";
import { formatFromPriceDual } from "@/lib/data/pricing-catalog";
import { withVat } from "@/lib/data/pricing";

/* שלב 4 WP10-WP11 (החלטת הבעלים 2.10.2026): צרכן רואה כולל מע״מ קודם,
   עסק (/business, /pro, קטגוריה pro) רואה לפני מע״מ קודם. */
const n = (x: number) => x.toLocaleString("he-IL");
const firstAmount = (s: string) => Number((s.match(/[\d,]{3,}/)?.[0] ?? "").replace(/,/g, ""));

describe("pricing display audience", () => {
  it("getPriceAudience: business only for /business, /pro and category pro", () => {
    assert.equal(getPriceAudience("/business/audiobooks"), "business");
    assert.equal(getPriceAudience("/pro"), "business");
    assert.equal(getPriceAudience("pro"), "business");
    assert.equal(getPriceAudience("/events/dj-events"), "consumer");
    assert.equal(getPriceAudience("/professional"), "consumer");
    assert.equal(getPriceAudience(undefined), "consumer");
  });

  for (const ex of [500, 950, 1695, 5000, 8305]) {
    it(`consumer formatters lead with ${n(withVat(ex))} and carry ${n(ex)}`, () => {
      const outputs = [
        formatPrice(ex).inline,
        formatPrice(ex, { from: true }).inline,
        formatHubPriceDual(ex),
        formatConsumerPriceLine(ex, true),
        formatFromPriceDual(ex),
        formatPriceScopeDisplay({ exVat: ex }).primary + " " + formatPriceScopeDisplay({ exVat: ex }).vatLine,
        formatDualPriceLines(ex, { label: "עם עריכה", exVat: ex + 100 }).recordingOnly,
      ];
      for (const out of outputs) {
        assert.equal(firstAmount(out), withVat(ex), out);
        assert.ok(out.includes(n(ex)), out);
        assert.doesNotMatch(out, /כרגע|מ-\s*מ-|NaN|undefined/, out);
      }
    });

    it(`business formatters lead with ${n(ex)}`, () => {
      for (const out of [
        formatPrice(ex, { audience: "business" }).inline,
        formatHubPriceDual(ex, false, "business"),
        formatFromPriceDual(ex, "business"),
      ]) {
        assert.equal(firstAmount(out), ex, out);
        assert.ok(out.includes(n(withVat(ex))), out);
      }
    });
  }

  it("formatFromPriceDual and formatPrice agree", () => {
    assert.equal(formatFromPriceDual(1695), formatPrice(1695, { from: true }).inline);
    assert.equal(
      formatFromPriceDual(1695, "business"),
      formatPrice(1695, { from: true, audience: "business" }).inline,
    );
  });
});

/* D86 (11.10.2026): בעמוד צרכני מחיר אחד, כולל מע״מ. בהודעה לבעלים נשארים שניים.
   ברירת המחדל היא "message", כדי שהודעה לעולם לא תאבד את המחיר לפני מע״מ. */
describe("pricing display channel (D86)", () => {
  it("page channel, consumer: only the VAT-inclusive price", () => {
    const p = formatPrice(500, { channel: "page" });
    assert.equal(p.headline, `${n(withVat(500))} ₪ כולל מע״מ`);
    assert.equal(p.vatNote, "");
    assert.equal(p.inline, p.headline);
    assert.ok(!/\+ מע״מ|לפני מע״מ/.test(p.inline));
  });

  it("formatPagePrice keeps the from- prefix", () => {
    assert.equal(formatPagePrice(500, { from: true }).inline, `מ-${n(withVat(500))} ₪ כולל מע״מ`);
  });

  it("page channel, business: unchanged, ex-VAT first with the total beside it", () => {
    const page = formatPrice(500, { channel: "page", audience: "business" });
    const message = formatPrice(500, { audience: "business" });
    assert.deepEqual(page, message);
  });

  it("default channel is message and keeps both prices", () => {
    const p = formatPrice(500);
    assert.equal(p.vatNote, `${n(500)} ₪ + מע״מ`);
    assert.equal(p.inline, `${n(withVat(500))} ₪ כולל מע״מ (${n(500)} ₪ + מע״מ)`);
  });
});
