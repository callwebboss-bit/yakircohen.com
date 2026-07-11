import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normalizeVoiceQuery, resolveVoiceIntent } from "./voice-search-intents";

describe("voice-search-intents", () => {
  it("normalizes Hebrew text", () => {
    assert.equal(normalizeVoiceQuery("  פודקאסט!  "), "פודקאסט");
  });

  it("navigates to podcast hub for short phrase", () => {
    const result = resolveVoiceIntent("פודקאסט");
    assert.equal(result.type, "navigate");
    if (result.type === "navigate") {
      assert.equal(result.href, "/podcast");
      assert.equal(result.confidence, "high");
    }
  });

  it("strips opener and navigates to podcast", () => {
    const result = resolveVoiceIntent("תראה לי פודקאסט");
    assert.equal(result.type, "navigate");
    if (result.type === "navigate") assert.equal(result.href, "/podcast");
  });

  it("navigates to book for booking phrase", () => {
    const result = resolveVoiceIntent("רוצה להזמין תור");
    assert.equal(result.type, "navigate");
    if (result.type === "navigate") assert.equal(result.href, "/book");
  });

  it("navigates to contact", () => {
    const result = resolveVoiceIntent("צור קשר");
    assert.equal(result.type, "navigate");
    if (result.type === "navigate") assert.equal(result.href, "/contact");
  });

  it("navigates to pricing", () => {
    const result = resolveVoiceIntent("כמה זה עולה");
    assert.equal(result.type, "navigate");
    if (result.type === "navigate") assert.equal(result.href, "/pricing");
  });

  it("navigates to online AI hub", () => {
    const result = resolveVoiceIntent("שירותי AI");
    assert.equal(result.type, "navigate");
    if (result.type === "navigate") assert.equal(result.href, "/online");
  });

  it("navigates to recording song page for specific phrase", () => {
    const result = resolveVoiceIntent("הקלטת שיר במודיעין");
    assert.equal(result.type, "navigate");
    if (result.type === "navigate") {
      assert.equal(result.href, "/studio/recording-song-modiin");
    }
  });

  it("navigates spoken wedding song price query to recording page", () => {
    const result = resolveVoiceIntent("רוצה להקליט שיר לחתונה");
    assert.equal(result.type, "navigate");
    if (result.type === "navigate") {
      assert.equal(result.href, "/studio/recording-song-modiin");
    }
  });

  it("navigates bar mitzvah DJ query to dj-events", () => {
    const result = resolveVoiceIntent("תקליטן לבר מצווה במודיעין");
    assert.equal(result.type, "navigate");
    if (result.type === "navigate") {
      assert.equal(result.href, "/events/dj-events");
    }
  });

  it("navigates studio gift voucher to shop vouchers", () => {
    const result = resolveVoiceIntent("שובר מתנה לאולפן");
    assert.equal(result.type, "navigate");
    if (result.type === "navigate") {
      assert.equal(result.href, "/shop#vouchers");
    }
  });

  it("navigates attractions smoke query", () => {
    const result = resolveVoiceIntent("עשן כבד לחתונה");
    assert.equal(result.type, "navigate");
    if (result.type === "navigate") {
      assert.equal(result.href, "/events/attractions");
    }
  });

  it("navigates mashup page", () => {
    const result = resolveVoiceIntent("מאשאפים");
    assert.equal(result.type, "navigate");
    if (result.type === "navigate") assert.equal(result.href, "/online/mashup-fixer");
  });

  it("navigates to blessings page", () => {
    const result = resolveVoiceIntent("ברכות מוקלטות");
    assert.equal(result.type, "navigate");
    if (result.type === "navigate") assert.equal(result.href, "/studio/blessings");
  });

  it("searches for longer specific studio query", () => {
    const result = resolveVoiceIntent("הקלטת שיר במודיעין עם עיבוד מלא");
    assert.equal(result.type, "search");
    if (result.type === "search") {
      assert.ok(result.query.includes("עיבוד"));
    }
  });

  it("searches for unmatched phrase", () => {
    const result = resolveVoiceIntent("מיקס ומאסטרינג לשיר");
    assert.equal(result.type, "search");
    if (result.type === "search") {
      assert.ok(result.query.includes("מיקס"));
    }
  });

  it("navigates to studio for short אולפן query", () => {
    const result = resolveVoiceIntent("אולפן");
    assert.equal(result.type, "navigate");
    if (result.type === "navigate") assert.equal(result.href, "/studio");
  });
});
