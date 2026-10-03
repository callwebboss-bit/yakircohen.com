import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import brandCopy from "@/lib/data/closer-brand-copy.json";
import {
  DATE_HOLD_TERMS,
  DATE_HOLD_TERMS_BODY,
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

/* החלטת הבעלים 3.10.2026 (סבב שני): נוסח אחד לשריון מועד ומקדמה בכל האתר
   ובכלי הבעלים. closer-brand-copy.json הוא JSON ולא יכול לייבא את הקבוע,
   ולכן הבדיקה מוודאת שהוא לא נפרד ממנו (OE-18, PJ-28, S21, LF-15). */
describe("date hold terms", () => {
  const CONTRADICTIONS = [
    /\bHold\b(?! Us)/,
    /לשמור תאריך ל-\d+ שעות|Hold \d/,
    /תשלום מראש/,
    /\d+%\s*מקדמה|מקדמה (?:של )?\d+%/,
    /שוטף \+ ?\d+/,
    /\{deposit(?:Total|PerPerson)?\}/,
  ];

  it("the statement reads as the owner set it", () => {
    assert.equal(DATE_HOLD_TERMS, `שריון מועד: ${DATE_HOLD_TERMS_BODY}.`);
    assert.match(DATE_HOLD_TERMS_BODY, /מקדמה בסכום שמסכמים יחד/);
  });

  it("every deposit and hold string in the owner tool uses the same statement", () => {
    const texts = [
      brandCopy.yakirCallScripts.hold5h,
      brandCopy.leadFlowWaTemplates.quoteHold,
      brandCopy.leadFlowWaTemplates.paymentAsk,
      brandCopy.groupMessaging.microDeposit,
      brandCopy.voiceScriptVariants.deposit,
    ];
    for (const t of texts) assert.ok(t.includes(DATE_HOLD_TERMS_BODY), t);
  });

  it("no contradicting payment term is left in the owner tool copy", () => {
    const json = JSON.stringify(brandCopy);
    for (const re of CONTRADICTIONS) assert.doesNotMatch(json, re);
    assert.equal("studioDepositExVat" in brandCopy.groupMessaging, false);
  });

  it("the pure reply builder carries the same statement", () => {
    const core = readFileSync("lib/reply-copy-builders-core.ts", "utf8");
    assert.ok(core.includes(DATE_HOLD_TERMS_BODY.replace(/^ב/, "")));
  });
});
