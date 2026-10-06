import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ADMIN_COOKIE_MAX_AGE_SEC,
  ADMIN_SESSION_RENEW_THRESHOLD_DAYS,
  issueSessionValue,
  shouldRenewSession,
  verifySessionValue,
} from "@/lib/admin-session-value";

/* סוד בדיקה בלבד. הסוד האמיתי חי במשתני הסביבה של Vercel. */
const SECRET = "test-admin-secret-value";
const NOW = Date.UTC(2026, 8, 30, 12, 0, 0);
const DAY = 24 * 60 * 60 * 1000;

describe("קוקי האדמין: תפוגה וחתימה", () => {
  it("ערך שהונפק עכשיו תקף עכשיו", () => {
    const value = issueSessionValue(SECRET, NOW);
    assert.ok(value);
    assert.equal(verifySessionValue(value, SECRET, NOW), true);
  });

  it("ערך פג אחרי 30 יום, וזה מה שלא היה קיים קודם", () => {
    const value = issueSessionValue(SECRET, NOW)!;
    assert.equal(verifySessionValue(value, SECRET, NOW + 29 * DAY), true);
    assert.equal(verifySessionValue(value, SECRET, NOW + 31 * DAY), false);
  });

  it("הארכת התפוגה ביד פוסלת את החתימה", () => {
    const value = issueSessionValue(SECRET, NOW)!;
    const signature = value.slice(value.indexOf(".") + 1);
    const forged = `${NOW + 365 * DAY}.${signature}`;
    assert.equal(verifySessionValue(forged, SECRET, NOW), false);
  });

  it("סוד אחר אינו מאמת", () => {
    const value = issueSessionValue(SECRET, NOW)!;
    assert.equal(verifySessionValue(value, "another-secret-entirely", NOW), false);
  });

  it("הפורמט הישן, HMAC בלי תפוגה, נפסל", () => {
    assert.equal(verifySessionValue("a".repeat(64), SECRET, NOW), false);
  });

  it("ערכים פגומים אינם זורקים", () => {
    for (const bad of ["", ".", "abc", "123.", ".abc", "NaN.deadbeef", null, undefined]) {
      assert.equal(verifySessionValue(bad, SECRET, NOW), false);
    }
  });

  it("בלי סוד אין הנפקה ואין אימות", () => {
    assert.equal(issueSessionValue(null, NOW), null);
    assert.equal(verifySessionValue("1.2", null, NOW), false);
  });
});

describe("חידוש קוקי האדמין", () => {
  const LIFETIME_DAYS = ADMIN_COOKIE_MAX_AGE_SEC / (24 * 60 * 60);
  /* היום שבו נשארו בדיוק THRESHOLD ימים עד התפוגה */
  const RENEW_FROM_DAY = LIFETIME_DAYS - ADMIN_SESSION_RENEW_THRESHOLD_DAYS;

  it("קוקי טרי לא מתחדש", () => {
    const value = issueSessionValue(SECRET, NOW);
    assert.equal(shouldRenewSession(value, SECRET, NOW), false);
  });

  it("כשנשארו יותר מ-7 ימים עוד לא מחדשים", () => {
    const value = issueSessionValue(SECRET, NOW);
    assert.equal(shouldRenewSession(value, SECRET, NOW + (RENEW_FROM_DAY - 1) * DAY), false);
  });

  it("בדיוק 7 ימים לפני התפוגה עוד לא מחדשים, דקה אחרי כן כן", () => {
    const value = issueSessionValue(SECRET, NOW);
    assert.equal(shouldRenewSession(value, SECRET, NOW + RENEW_FROM_DAY * DAY), false);
    assert.equal(shouldRenewSession(value, SECRET, NOW + RENEW_FROM_DAY * DAY + 60_000), true);
  });

  it("כשנשארו פחות מ-7 ימים מחדשים, עד הרגע האחרון", () => {
    const value = issueSessionValue(SECRET, NOW);
    assert.equal(shouldRenewSession(value, SECRET, NOW + (LIFETIME_DAYS - 3) * DAY), true);
    assert.equal(shouldRenewSession(value, SECRET, NOW + LIFETIME_DAYS * DAY - 1), true);
  });

  it("קוקי שכבר פג לא מתחדש, צריך להיכנס מחדש", () => {
    const value = issueSessionValue(SECRET, NOW);
    assert.equal(shouldRenewSession(value, SECRET, NOW + LIFETIME_DAYS * DAY), false);
    assert.equal(shouldRenewSession(value, SECRET, NOW + (LIFETIME_DAYS + 1) * DAY), false);
  });

  it("חתימה מזויפת, סוד אחר או ערך פגום לא מתחדשים גם כשהתפוגה קרובה", () => {
    const value = issueSessionValue(SECRET, NOW)!;
    const late = NOW + (LIFETIME_DAYS - 1) * DAY;
    const signature = value.slice(value.indexOf(".") + 1);
    assert.equal(shouldRenewSession(`${NOW + 2 * DAY}.${signature}`, SECRET, NOW), false);
    assert.equal(shouldRenewSession(value, "another-secret-entirely", late), false);
    for (const bad of ["", ".", "abc", "NaN.deadbeef", null, undefined]) {
      assert.equal(shouldRenewSession(bad, SECRET, late), false);
    }
    assert.equal(shouldRenewSession(value, null, late), false);
  });

  it("הסף ניתן לשינוי", () => {
    const value = issueSessionValue(SECRET, NOW);
    const at = NOW + (LIFETIME_DAYS - 10) * DAY;
    assert.equal(shouldRenewSession(value, SECRET, at, 7), false);
    assert.equal(shouldRenewSession(value, SECRET, at, 14), true);
  });

  it("ערך שחודש תקף לעוד תקופה מלאה מרגע החידוש", () => {
    const renewAt = NOW + (LIFETIME_DAYS - 2) * DAY;
    const renewed = issueSessionValue(SECRET, renewAt);
    assert.equal(verifySessionValue(renewed, SECRET, renewAt + (LIFETIME_DAYS - 1) * DAY), true);
    assert.equal(shouldRenewSession(renewed, SECRET, renewAt), false);
  });
});
