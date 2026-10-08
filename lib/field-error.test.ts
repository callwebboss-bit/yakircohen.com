import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describedBy, fieldErrorId, splitRequiredLabel } from "@/lib/field-error";

describe("מזהה שגיאת שדה", () => {
  it("נגזר ממזהה השדה", () => {
    assert.equal(fieldErrorId("phone"), "phone-error");
    assert.equal(fieldErrorId("trial-name"), "trial-name-error");
  });
});

describe("aria-describedby מורכב", () => {
  /* אותה צורה שבה הרכיבים קוראים לפונקציה: describedBy(hintId, error && errorId) */
  const compose = (error: string | undefined) => describedBy("p-hint", error && "p-error");

  it("בלי שגיאה נשאר הרמז בלבד", () => {
    assert.equal(compose(undefined), "p-hint");
  });

  it("עם שגיאה הרמז נשמר והשגיאה באה אחריו, לא במקומו", () => {
    assert.equal(compose("יש להזין טלפון"), "p-hint p-error");
  });

  it("הודעה ריקה (ניקוי שגיאה כמחרוזת ריקה) לא מוסיפה מזהה", () => {
    assert.equal(compose(""), "p-hint");
  });

  it("שדה בלי רמז: רק השגיאה, ובלי שגיאה undefined ולא מחרוזת ריקה", () => {
    assert.equal(describedBy(undefined, "n-error"), "n-error");
    assert.equal(describedBy(undefined, false), undefined);
    assert.equal(describedBy(null, "", "  "), undefined);
  });

  it("מזהים עם רווחים בקצוות מנוקים", () => {
    assert.equal(describedBy(" a ", "b"), "a b");
  });
});

describe("תווית עם כוכבית ישנה", () => {
  it("' *' בסוף הופך לדגל חובה והטקסט נקי", () => {
    assert.deepEqual(splitRequiredLabel("שם מלא *"), { text: "שם מלא", required: true });
    assert.deepEqual(splitRequiredLabel("שעה*"), { text: "שעה", required: true });
  });

  it("תווית רגילה או עם (אופציונלי) נשארת כמו שהיא", () => {
    assert.deepEqual(splitRequiredLabel("הערות"), { text: "הערות", required: false });
    assert.deepEqual(splitRequiredLabel("תאריך (אופציונלי)"), {
      text: "תאריך (אופציונלי)",
      required: false,
    });
  });

  it("כוכבית באמצע הטקסט לא נחשבת סימון חובה", () => {
    assert.deepEqual(splitRequiredLabel("* שדה חובה"), { text: "* שדה חובה", required: false });
  });
});
