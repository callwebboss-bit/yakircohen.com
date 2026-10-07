import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ADMIN_COOKIE_MAX_AGE_SEC,
  ADMIN_SESSION_ABSOLUTE_MAX_DAYS,
  ADMIN_SESSION_RENEW_THRESHOLD_DAYS,
  issueSessionValue,
  readSessionLoginAt,
  sessionMaxAgeSec,
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

  it("הארכת התפוגה או הזזת רגע הכניסה ביד פוסלות את החתימה", () => {
    const value = issueSessionValue(SECRET, NOW)!;
    const [, loginAt, signature] = value.split(".");
    assert.equal(verifySessionValue(`${NOW + 365 * DAY}.${loginAt}.${signature}`, SECRET, NOW), false);
    assert.equal(verifySessionValue(`${NOW + 20 * DAY}.${NOW + DAY}.${signature}`, SECRET, NOW + 2 * DAY), false);
  });

  it("הפורמט של v2, תפוגה וחתימה בלי רגע כניסה, נפסל", () => {
    assert.equal(verifySessionValue(`${NOW + DAY}.${"a".repeat(64)}`, SECRET, NOW), false);
  });

  it("סוד אחר אינו מאמת", () => {
    const value = issueSessionValue(SECRET, NOW)!;
    assert.equal(verifySessionValue(value, "another-secret-entirely", NOW), false);
  });

  it("הפורמט הישן, HMAC בלי תפוגה, נפסל", () => {
    assert.equal(verifySessionValue("a".repeat(64), SECRET, NOW), false);
  });

  it("ערכים פגומים אינם זורקים", () => {
    for (const bad of ["", ".", "..", "abc", "123.", ".abc", "1..x", "NaN.1.deadbeef", "1.2.3.4", null, undefined]) {
      assert.equal(verifySessionValue(bad, SECRET, NOW), false);
    }
  });

  it("בלי סוד אין הנפקה ואין אימות", () => {
    assert.equal(issueSessionValue(null, NOW), null);
    assert.equal(verifySessionValue("1.2.3", null, NOW), false);
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
    const [, loginAt, signature] = value.split(".");
    assert.equal(shouldRenewSession(`${NOW + 2 * DAY}.${loginAt}.${signature}`, SECRET, NOW), false);
    assert.equal(shouldRenewSession(value, "another-secret-entirely", late), false);
    for (const bad of ["", ".", "abc", "NaN.1.deadbeef", null, undefined]) {
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

describe("תקרת 90 יום מרגע הכניסה", () => {
  const MAX_DAYS = ADMIN_SESSION_ABSOLUTE_MAX_DAYS;

  /* מדמה שימוש יומיומי: בכל יום, אם צריך, מחדשים עם רגע הכניסה המקורי */
  function useDaily(days: number): { value: string | null; lastValidDay: number } {
    let value = issueSessionValue(SECRET, NOW);
    let lastValidDay = 0;
    for (let day = 1; day <= days; day++) {
      const at = NOW + day * DAY;
      if (!verifySessionValue(value, SECRET, at)) break;
      lastValidDay = day;
      if (shouldRenewSession(value, SECRET, at)) {
        value = issueSessionValue(SECRET, at, readSessionLoginAt(value, SECRET, at)!);
      }
    }
    return { value, lastValidDay };
  }

  it("שימוש כל יום מחזיק את הכניסה עד 90 יום, ולא יום אחרי", () => {
    const { lastValidDay } = useDaily(MAX_DAYS + 10);
    assert.equal(lastValidDay, MAX_DAYS - 1);
  });

  it("החידוש שומר את רגע הכניסה המקורי", () => {
    const first = issueSessionValue(SECRET, NOW)!;
    const at = NOW + 25 * DAY;
    const renewed = issueSessionValue(SECRET, at, readSessionLoginAt(first, SECRET, at)!)!;
    assert.equal(readSessionLoginAt(renewed, SECRET, at), NOW);
  });

  it("קרוב לתקרה התפוגה נעצרת בתקרה, ואין יותר חידוש", () => {
    const at = NOW + (MAX_DAYS - 5) * DAY;
    const renewed = issueSessionValue(SECRET, at, NOW)!;
    assert.equal(verifySessionValue(renewed, SECRET, NOW + MAX_DAYS * DAY - 1), true);
    assert.equal(verifySessionValue(renewed, SECRET, NOW + MAX_DAYS * DAY), false);
    assert.equal(shouldRenewSession(renewed, SECRET, NOW + (MAX_DAYS - 1) * DAY), false);
  });

  it("רגע כניסה מעבר לתקרה נפסל גם עם חתימה נכונה", () => {
    const loginAt = NOW - (MAX_DAYS + 1) * DAY;
    const value = issueSessionValue(SECRET, loginAt + (MAX_DAYS - 1) * DAY, loginAt)!;
    assert.equal(verifySessionValue(value, SECRET, NOW), false);
    assert.equal(readSessionLoginAt(value, SECRET, NOW), null);
  });

  it("maxAge של הקוקי שווה לזמן שנשאר עד התפוגה", () => {
    const value = issueSessionValue(SECRET, NOW)!;
    assert.equal(sessionMaxAgeSec(value, NOW), ADMIN_COOKIE_MAX_AGE_SEC);
    const near = issueSessionValue(SECRET, NOW + (MAX_DAYS - 2) * DAY, NOW)!;
    assert.equal(sessionMaxAgeSec(near, NOW + (MAX_DAYS - 2) * DAY), 2 * 24 * 60 * 60);
    assert.equal(sessionMaxAgeSec("garbage", NOW), 0);
  });
});
