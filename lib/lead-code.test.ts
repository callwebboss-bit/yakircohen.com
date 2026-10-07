import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  findLeadCode,
  formatLeadCodeLine,
  generateLeadCode,
  LEAD_CODE_ALPHABET,
  normalizeLeadCode,
  withLeadCodeLine,
} from "@/lib/lead-code";
import { generateVoucherCode, normalizeVoucherCode, VOUCHER_CODE_ALPHABET } from "@/lib/sales/voucher";

/* החלטת הבעלים D67 (D36 בפועל), 7.10.2026: "קוד פנייה: A7K2" בשורה האחרונה */
describe("lead code (D67)", () => {
  it("is 4 characters from an alphabet without look-alikes", () => {
    for (const ch of "0O1IL") assert.ok(!LEAD_CODE_ALPHABET.includes(ch), ch);
    for (let i = 0; i < 300; i += 1) {
      assert.match(generateLeadCode(), /^[A-HJKMNP-Z2-9]{4}$/);
    }
  });

  it("uses the random source it is given, including the edges", () => {
    assert.equal(generateLeadCode(() => 0), LEAD_CODE_ALPHABET[0].repeat(4));
    const last = LEAD_CODE_ALPHABET[LEAD_CODE_ALPHABET.length - 1];
    assert.equal(generateLeadCode(() => 0.999999), last.repeat(4));
    assert.equal(generateLeadCode(() => 1), last.repeat(4));
  });

  it("is the same code as the order confirmation, with YC- in front", () => {
    assert.equal(VOUCHER_CODE_ALPHABET, LEAD_CODE_ALPHABET);
    assert.equal(generateVoucherCode(() => 0), `YC-${generateLeadCode(() => 0)}`);
    const code = generateLeadCode();
    assert.equal(normalizeVoucherCode(code), `YC-${code}`);
  });

  it("normalizes case and rejects look-alikes or a wrong length", () => {
    assert.equal(normalizeLeadCode(" a7k2 "), "A7K2");
    assert.equal(normalizeLeadCode("A0K2"), null);
    assert.equal(normalizeLeadCode("AIK2"), null);
    assert.equal(normalizeLeadCode("A7K"), null);
    assert.equal(normalizeLeadCode("A7K22"), null);
    assert.equal(normalizeLeadCode(42), null);
  });

  it("formats and finds the line", () => {
    assert.equal(formatLeadCodeLine("A7K2"), "קוד פנייה: A7K2");
    assert.equal(findLeadCode("שלום\nקוד פנייה: A7K2"), "A7K2");
    assert.equal(findLeadCode("שלום\nקוד פנייה:a7k2"), "A7K2");
    assert.equal(findLeadCode("שלום\nקוד פנייה: A0K2"), null);
    assert.equal(findLeadCode("שלום"), null);
    assert.equal(findLeadCode(null), null);
    /* שתי שורות: האחרונה, כי האתר כותב את הקוד בסוף */
    assert.equal(findLeadCode("קוד פנייה: AAAA\nקוד פנייה: BBBB"), "BBBB");
  });

  it("withLeadCodeLine puts exactly one code line last", () => {
    assert.equal(withLeadCodeLine("שלום\nמתי נוח?", "A7K2"), "שלום\nמתי נוח?\nקוד פנייה: A7K2");
    assert.equal(withLeadCodeLine("שלום\n\n", "A7K2"), "שלום\nקוד פנייה: A7K2");
    const twice = withLeadCodeLine(withLeadCodeLine("שלום", "AAAA"), "BBBB");
    assert.equal(twice, "שלום\nקוד פנייה: BBBB");
    assert.equal(withLeadCodeLine("", "A7K2"), "קוד פנייה: A7K2");
  });
});
