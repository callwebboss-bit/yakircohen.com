import assert from "node:assert/strict";
import test from "node:test";
import {
  findVoucher,
  formatVoucherDate,
  getAllVoucherCodes,
  isVoucherExpired,
  normalizeVoucherCode,
} from "@/lib/gift-voucher";
import {
  buildGiftVoucherCheckoutUrl,
  GIFT_VOUCHER_CHOICES,
} from "@/lib/data/gift-voucher";

test("normalizeVoucherCode: אותיות גדולות וניקוי רווחים", () => {
  assert.equal(normalizeVoucherCode(" ab-12 "), "AB-12");
  assert.equal(normalizeVoucherCode("ab%2D12"), "AB-12");
});

test("findVoucher: קוד לא ידוע או לא תקין מחזיר null", () => {
  assert.equal(findVoucher("NOT-A-REAL-CODE"), null);
  assert.equal(findVoucher("%E0%A4%A"), null);
});

test("findVoucher: מוצא כל קוד קיים בכל אותיות (כשיש שוברים)", () => {
  for (const code of getAllVoucherCodes()) {
    assert.ok(findVoucher(code), code);
    assert.ok(findVoucher(code.toLowerCase()), code.toLowerCase());
  }
});

test("isVoucherExpired: לפי תאריך סיום", () => {
  const record = {
    code: "X",
    from: "a",
    to: "b",
    message: "",
    issuedAt: "2026-01-01",
    validUntil: "2026-06-30",
  };
  assert.equal(isVoucherExpired(record, new Date("2026-06-30T10:00:00Z")), false);
  assert.equal(isVoucherExpired(record, new Date("2026-07-01T00:00:00Z")), true);
});

test("formatVoucherDate: תאריך לא תקין חוזר כמו שהוא", () => {
  assert.equal(formatVoucherDate("not-a-date"), "not-a-date");
});

test("buildGiftVoucherCheckoutUrl: ריק, http ולא תקין נדחים, {amount} מוחלף", () => {
  assert.equal(buildGiftVoucherCheckoutUrl("", 500), null);
  assert.equal(buildGiftVoucherCheckoutUrl("http://pay.example/x", 500), null);
  assert.equal(buildGiftVoucherCheckoutUrl("javascript:alert(1)", 500), null);
  assert.equal(
    buildGiftVoucherCheckoutUrl("https://pay.example/x?sum={amount}", 500),
    "https://pay.example/x?sum=500",
  );
});

test("GIFT_VOUCHER_CHOICES: מזהים ייחודיים וסכום חיובי", () => {
  const ids = GIFT_VOUCHER_CHOICES.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const choice of GIFT_VOUCHER_CHOICES) assert.ok(choice.amountNis > 0);
});
