import assert from "node:assert/strict";
import test from "node:test";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import vouchersFile from "@/lib/data/vouchers.json";
import { isCode39Encodable } from "@/lib/code39";
import type { VoucherRecord } from "@/lib/gift-voucher";
import { GIFT_VALIDITY_YEARS } from "@/lib/sales/voucher";
import {
  addYearsIso,
  findVoucher,
  generateVoucherCode,
  getVoucherStatus,
  validateVoucherRecords,
  VOUCHER_CODE_PATTERN,
  formatVoucherDate,
  getAllVoucherCodes,
  isVoucherExpired,
  normalizeVoucherCode,
} from "@/lib/gift-voucher";
import {
  buildGiftVoucherRequestText,
  GIFT_VOUCHER_CHOICES,
  GIFT_VOUCHER_LIMITS,
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

test("buildGiftVoucherRequestText: הקישור בוואטסאפ נשאר קצר גם בקלט המקסימלי", () => {
  const text = buildGiftVoucherRequestText({
    valueLabel: "חצי שעה באולפן, ₪885 כולל מע״מ",
    to: "ש".repeat(GIFT_VOUCHER_LIMITS.name),
    from: "ד".repeat(GIFT_VOUCHER_LIMITS.name),
    message: "מ".repeat(GIFT_VOUCHER_LIMITS.message),
  });
  const href = buildWhatsAppHref({
    text,
    utm_source: "website",
    utm_campaign: "gift_voucher_builder",
  });
  assert.ok(href.length < 1750, `href length ${href.length}`);
  assert.ok(text.includes("(המשך בתמונה)"));
});

test("buildGiftVoucherRequestText: הודעה קצרה נשלחת כמו שהיא, בלי שדות ריקים", () => {
  const text = buildGiftVoucherRequestText({
    valueLabel: "שעה באולפן",
    to: "",
    from: "דנה",
    message: "מזל טוב",
  });
  assert.equal(
    text,
    "שלום, אשמח לרכוש שובר מתנה: שעה באולפן. מאת: דנה. ההודעה האישית: מזל טוב",
  );
});

test("generateVoucherCode: פורמט תקין, ייחודי, ומקודד ב-Code 39", () => {
  const codes = new Set<string>();
  for (let i = 0; i < 500; i += 1) {
    const code = generateVoucherCode();
    assert.match(code, VOUCHER_CODE_PATTERN);
    assert.ok(isCode39Encodable(code), code);
    codes.add(code);
  }
  assert.equal(codes.size, 500);
});

test("addYearsIso: שנתיים קדימה, וב-29 בפברואר נופל על 1 במרץ (מאוחר, לא מוקדם)", () => {
  assert.equal(addYearsIso("2026-10-08", 2), "2028-10-08");
  assert.equal(addYearsIso("2028-02-29", 2), "2030-03-01");
});

test("getVoucherStatus: מומש, פג תוקף, בתוקף", () => {
  const base = {
    code: "YC-AAAA-BBBB-CCCC",
    packageLabel: "שעה באולפן",
    from: "א",
    to: "ב",
    message: "",
    issuedAt: "2026-01-01",
    validUntil: "2028-01-01",
  };
  assert.equal(getVoucherStatus(base, new Date("2027-01-01T00:00:00Z")), "valid");
  assert.equal(getVoucherStatus(base, new Date("2028-06-01T00:00:00Z")), "expired");
  assert.equal(
    getVoucherStatus({ ...base, redeemedAt: "2026-05-05" }, new Date("2027-01-01T00:00:00Z")),
    "redeemed",
  );
});

test("validateVoucherRecords: תופס קוד קצר, כפילות ותוקף קצר מהמינימום", () => {
  const ok = {
    code: "YC-AAAA-BBBB-CCCC",
    packageLabel: "שעה באולפן",
    from: "א",
    to: "ב",
    message: "מזל טוב",
    issuedAt: "2026-10-08",
    validUntil: "2028-10-08",
  };
  assert.deepEqual(validateVoucherRecords([ok], GIFT_VOUCHER_VALIDITY_YEARS), []);
  const errors = validateVoucherRecords(
    [
      ok,
      { ...ok, code: "YC-A7K2", validUntil: "2027-10-08" },
      { ...ok, code: ok.code },
    ],
    GIFT_VOUCHER_VALIDITY_YEARS,
  );
  assert.ok(errors.some((e) => e.includes("פורמט")));
  assert.ok(errors.some((e) => e.includes("כפול")));
  assert.ok(errors.some((e) => e.includes("תוקף קצר")));
});

test("vouchers.json האמיתי: כל הרשומות עוברות אימות", () => {
  const errors = validateVoucherRecords(
    vouchersFile.vouchers as VoucherRecord[],
    GIFT_VOUCHER_VALIDITY_YEARS,
  );
  assert.deepEqual(errors, []);
});
