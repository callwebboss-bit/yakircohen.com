import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { classifyResendEvent, deliveryIssueLabel, leadMailStatusLabel, redactEmails } from "@/lib/leads/resend-events";

describe("classifyResendEvent", () => {
  it("open and click are engagement only", () => {
    assert.equal(classifyResendEvent("email.opened"), "engagement");
    assert.equal(classifyResendEvent("email.clicked"), "engagement");
  });

  it("a mail that will never arrive is a problem", () => {
    for (const t of ["email.bounced", "email.failed", "email.complained", "email.suppressed"]) {
      assert.equal(classifyResendEvent(t), "problem", t);
    }
  });

  it("delivered, delayed and unknown types", () => {
    assert.equal(classifyResendEvent("email.delivered"), "delivered");
    assert.equal(classifyResendEvent("email.delivery_delayed"), "delayed");
    assert.equal(classifyResendEvent("email.sent"), "ignore");
    assert.equal(classifyResendEvent(""), "ignore");
  });
});

describe("deliveryIssueLabel / redactEmails", () => {
  it("labels in Hebrew", () => {
    assert.equal(deliveryIssueLabel("email.bounced"), "חזר");
    assert.equal(deliveryIssueLabel("email.delivery_delayed"), "מתעכב");
  });

  it("removes email addresses from text kept by third parties", () => {
    assert.equal(
      redactEmails("You can only send testing emails to your own email address (a.b@gmail.com)."),
      "You can only send testing emails to your own email address ([email]).",
    );
  });
});

describe("leadMailStatusLabel", () => {
  it("a problem wins over everything", () => {
    assert.equal(
      leadMailStatusLabel({ resendEmailId: "x", deliveredAt: "t", deliveryIssue: { type: "email.bounced" } }),
      "⚠ חזר",
    );
  });

  it("opened, delivered, delayed, sent, never sent", () => {
    assert.equal(leadMailStatusLabel({ resendEmailId: "x", deliveredAt: "t", openedAt: "t" }), "נפתח");
    assert.equal(leadMailStatusLabel({ resendEmailId: "x", deliveredAt: "t" }), "נמסר");
    assert.equal(leadMailStatusLabel({ resendEmailId: "x", deliveryIssue: { type: "email.delivery_delayed" } }), "מתעכב");
    assert.equal(leadMailStatusLabel({ resendEmailId: "x" }), "נשלח");
    assert.equal(leadMailStatusLabel({}), "לא נשלח");
  });
});
