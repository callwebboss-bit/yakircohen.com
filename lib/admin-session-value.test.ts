import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { issueSessionValue, verifySessionValue } from "@/lib/admin-session-value";

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
