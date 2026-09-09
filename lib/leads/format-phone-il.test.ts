import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  digitsOnlyPhone,
  formatIlMobileDisplay,
  normalizeIlMobile,
  toE164Il,
} from "./format-phone-il";

/**
 * נרמול טלפון הוא נתיב הכסף: מספר שלא מנורמל נכון מגיע ל-CRM שבור, ונרמול
 * שמחזיר null גורם לליד להישמר עם המחרוזת הגולמית. לכן כל פורמט שלקוח באמת
 * מקליד נבדק כאן במפורש.
 */
describe("normalizeIlMobile", () => {
  const accepted: Array<[string, string]> = [
    ["0501234567", "0501234567"],
    ["050-123-4567", "0501234567"],
    ["050 123 4567", "0501234567"],
    ["+972501234567", "0501234567"],
    ["+972-50-123-4567", "0501234567"],
    ["972501234567", "0501234567"],
    ["501234567", "0501234567"],
    ["0521234567", "0521234567"],
    ["0581234567", "0581234567"],
  ];

  for (const [input, expected] of accepted) {
    it(`מנרמל ${input}`, () => {
      assert.equal(normalizeIlMobile(input), expected);
    });
  }

  const rejected = [
    ["", "ריק"],
    ["   ", "רווחים בלבד"],
    ["021234567", "קו נייח"],
    ["0212345678", "קו נייח ארוך"],
    ["05012345678", "ספרה אחת יותר מדי"],
    ["050123456", "ספרה אחת חסרה"],
    ["97250123456", "בינלאומי קצר מדי"],
    ["abcdefghij", "אותיות"],
    ["0401234567", "קידומת שאינה נייד"],
  ];

  for (const [input, why] of rejected) {
    it(`דוחה ${JSON.stringify(input)} (${why})`, () => {
      assert.equal(normalizeIlMobile(input), null);
    });
  }

  it("מקבל קידומת חיוג בינלאומית 00972", () => {
    /* פורמט נפוץ בהעתקה מאנשי קשר. לפני התיקון הוא נדחה, והליד לא הצליח להישלח. */
    assert.equal(normalizeIlMobile("00972501234567"), "0501234567");
  });
});

describe("toE164Il", () => {
  it("ממיר לפורמט בינלאומי", () => {
    assert.equal(toE164Il("050-123-4567"), "+972501234567");
  });
  it("מחזיר null למספר לא תקין", () => {
    assert.equal(toE164Il("021234567"), null);
  });
});

describe("formatIlMobileDisplay", () => {
  it("מוסיף מקפים תוך כדי הקלדה", () => {
    assert.equal(formatIlMobileDisplay("05"), "05");
    assert.equal(formatIlMobileDisplay("050"), "050");
    assert.equal(formatIlMobileDisplay("0501"), "050-1");
    assert.equal(formatIlMobileDisplay("050123"), "050-123");
    assert.equal(formatIlMobileDisplay("0501234567"), "050-123-4567");
  });
  it("חותך מעבר לעשר ספרות", () => {
    assert.equal(formatIlMobileDisplay("05012345678999"), "050-123-4567");
  });
});

describe("digitsOnlyPhone", () => {
  it("מסיר כל תו שאינו ספרה", () => {
    assert.equal(digitsOnlyPhone("+972 (50) 123-4567"), "972501234567");
  });
});
