import assert from "node:assert/strict";
import test from "node:test";
import { GIFT_VALIDITY_YEARS } from "@/lib/sales/voucher";
import {
  findVoucher,
  formatVoucherDate,
  getAllVoucherCodes,
  isVoucherExpired,
  normalizeVoucherCode,
} from "@/lib/gift-voucher";
import {
  GIFT_VOUCHER_CHOICES,
  GIFT_VOUCHER_VALIDITY_LABEL,
  GIFT_VOUCHER_VALIDITY_TEXT,
  GIFT_VOUCHER_VALIDITY_YEARS,
} from "@/lib/data/gift-voucher";
import { SHOP_VOUCHER_FAQ_SCHEMA } from "@/lib/data/shop-vouchers";

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

test("תוקף השובר זהה לשובר עמדת המכירות ולשאלות החנות", () => {
  assert.equal(GIFT_VOUCHER_VALIDITY_YEARS, GIFT_VALIDITY_YEARS);
  assert.equal(GIFT_VOUCHER_VALIDITY_LABEL, "תוקף: שנתיים מיום הרכישה");
});

test("GIFT_VOUCHER_CHOICES: מזהים ייחודיים, סכום חיובי, חבילות בלבד", () => {
  const ids = GIFT_VOUCHER_CHOICES.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const choice of GIFT_VOUCHER_CHOICES) assert.ok(choice.amountNis > 0);
});

/* תשובות הבעלים 8.10.2026, תשובה 4: שנתיים בכל מקום. הקבוע של האתר נפרד מזה של
   עמדת המכירות רק כדי לא למשוך את עמדת המכירות לדפדפן, ולכן הם חייבים להיות שווים. */
test("תוקף השובר: שנתיים, זהה לשובר של עמדת המכירות ולשאלות החנות", () => {
  assert.equal(GIFT_VOUCHER_VALIDITY_YEARS, GIFT_VALIDITY_YEARS);
  assert.ok(GIFT_VOUCHER_VALIDITY_YEARS >= 2, "חוק הגנת הצרכן: שנתיים לפחות");
  assert.equal(GIFT_VOUCHER_VALIDITY_TEXT, "שנתיים");
  assert.equal(GIFT_VOUCHER_VALIDITY_LABEL, "תוקף: שנתיים מיום הרכישה");
  const answer = SHOP_VOUCHER_FAQ_SCHEMA.find((q) => /תוקף/.test(q.question))?.answer ?? "";
  assert.ok(answer.startsWith(`${GIFT_VOUCHER_VALIDITY_TEXT} מיום הרכישה`), answer);
  assert.doesNotMatch(`${GIFT_VOUCHER_VALIDITY_LABEL} ${answer}`, /(^|\s)שנה(\s|$)/);
});
