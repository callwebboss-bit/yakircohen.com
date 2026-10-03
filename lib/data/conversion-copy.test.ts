import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  hubBookCtaLabel,
  pricingRowBookCta,
  whatsappAriaLabel,
  whatsappQuoteCta,
} from "@/lib/data/conversion-copy";
import {
  formatFromPriceDual,
  formatFromPriceExVat,
  formatPriceLine,
} from "@/lib/data/pricing-catalog";
import { withVat } from "@/lib/data/pricing";

/* WP1 (OE-27, ED-08, S15): כפתורי המחיר הציגו "מ-כרגע: מ-990" כי הפורמטר
   החזיר "כרגע: מ-..." והקוראים הוסיפו "מ-" משלהם. */
const SAMPLES = [500, 950, 1695, 5000, 8305];

function nis(n: number): string {
  return n.toLocaleString("he-IL");
}

const outputs = (ex: number): string[] => [
  formatPriceLine(ex),
  formatPriceLine(ex, "שיר"),
  formatFromPriceExVat(ex),
  formatFromPriceDual(ex),
  formatFromPriceDual(ex, "business"),
  whatsappQuoteCta("הקלטת שיר", ex),
  whatsappAriaLabel("הקלטת שיר", ex),
  hubBookCtaLabel(ex),
  hubBookCtaLabel(ex, "business"),
  pricingRowBookCta(ex),
  pricingRowBookCta(ex, true),
];

describe("conversion-copy price labels", () => {
  it("never print כרגע, מ-מ- or 0 ₪", () => {
    for (const ex of SAMPLES) {
      for (const out of outputs(ex)) {
        assert.doesNotMatch(out, /כרגע/, out);
        assert.doesNotMatch(out, /מ-\s*מ-/, out);
        assert.doesNotMatch(out, /(^|[^\d,])0 ₪/, out);
        assert.doesNotMatch(out, /NaN|undefined/, out);
      }
    }
  });

  it("show both the ex-VAT amount and the VAT-inclusive total", () => {
    for (const ex of SAMPLES) {
      for (const out of outputs(ex).filter((o) => o !== formatFromPriceExVat(ex))) {
        assert.ok(out.includes(nis(ex)), `${out} missing ${nis(ex)}`);
        assert.ok(out.includes(nis(withVat(ex))), `${out} missing ${nis(withVat(ex))}`);
      }
    }
  });

  it("consumer labels lead with the VAT-inclusive total, business with ex-VAT", () => {
    const ex = 500;
    const consumer = formatFromPriceDual(ex);
    const business = formatFromPriceDual(ex, "business");
    assert.equal(consumer, "מ-590 ₪ כולל מע״מ (500 ₪ + מע״מ)");
    assert.equal(business, "מ-500 ₪ + מע״מ (590 ₪ כולל מע״מ)");
    assert.ok(hubBookCtaLabel(ex).startsWith("הזמנה מקוונת מ-590 ₪"));
    assert.ok(whatsappQuoteCta("שיר", ex).startsWith("אני רוצה הצעה לשיר מ-590 ₪"));
  });
});
