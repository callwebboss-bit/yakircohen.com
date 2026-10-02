import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { before, describe, it } from "node:test";

/* Redis בזיכרון בלבד: בלי משתני Upstash ולפני הטעינה של המודול */
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;

type Mod = typeof import("@/lib/leads/duplicate");
let dup: Mod;

before(async () => {
  dup = await import("@/lib/leads/duplicate");
});

/* טלפון ייחודי לכל בדיקה, כי ה-Map בזיכרון משותף לכל הקובץ */
let n = 0;
function phone(): string {
  n += 1;
  return `05${String(20000000 + n).padStart(8, "0")}`;
}

describe("classifyLeadRepeat (LF-03)", () => {
  it("ghost lead then final order is an update, not spam", async () => {
    const p = phone();
    const ghost = await dup.classifyLeadRepeat(
      { formId: "events_booking", phone: p, body: "טיוטה [partial]" },
      "ghost-1",
    );
    assert.equal(ghost.kind, "new");
    const final = await dup.classifyLeadRepeat(
      { formId: "events_booking_wizard", phone: p, body: "הזמנה מלאה", submissionId: randomUUID() },
      "final-1",
    );
    assert.equal(final.kind, "update");
    assert.equal(final.existingLeadId, "ghost-1");
  });

  it("a recover draft does not make the final order a duplicate", async () => {
    const p = phone();
    const draft = await dup.checkDraftRepeat(p, "pricing_inquiry_draft", "draft-1");
    assert.equal(draft.isRepeat, false);
    const again = await dup.checkDraftRepeat(p, "pricing_inquiry_draft", "draft-2");
    assert.equal(again.isRepeat, true);
    assert.equal(again.existingLeadId, "draft-1");
    const final = await dup.classifyLeadRepeat(
      { formId: "pricing_inquiry", phone: p, body: "פנייה" },
      "final-2",
    );
    assert.equal(final.kind, "new");
  });

  it("same submissionId is a repeat only after markDelivered", async () => {
    const p = phone();
    const sid = randomUUID();
    const input = { formId: "contact_quiz", phone: p, body: "שלום", submissionId: sid };
    const first = await dup.classifyLeadRepeat(input, "lead-a");
    assert.equal(first.kind, "new");
    /* השליחה הראשונה נכשלה (בלי markDelivered): הניסיון החוזר לא נבלע */
    const retry = await dup.classifyLeadRepeat(input, "lead-b");
    assert.notEqual(retry.kind, "repeat");
    await dup.markDelivered(retry.exactKey, "lead-b");
    const third = await dup.classifyLeadRepeat(input, "lead-c");
    assert.equal(third.kind, "repeat");
    assert.equal(third.existingLeadId, "lead-b");
  });

  it("a different phone is new", async () => {
    await dup.classifyLeadRepeat({ formId: "contact_quiz", phone: phone(), body: "x" }, "l1");
    const other = await dup.classifyLeadRepeat({ formId: "contact_quiz", phone: phone(), body: "x" }, "l2");
    assert.equal(other.kind, "new");
  });

  it("same email from another form is an update", async () => {
    const email = `t${randomUUID().slice(0, 8)}@example.com`;
    await dup.classifyLeadRepeat({ formId: "contact_quiz", email, body: "x" }, "e1");
    const second = await dup.classifyLeadRepeat({ formId: "smart_form_book", email: email.toUpperCase(), body: "y" }, "e2");
    assert.equal(second.kind, "update");
    assert.equal(second.existingLeadId, "e1");
  });
});
