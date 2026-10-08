import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { bookFieldClass } from "@/lib/book-form-ui";

/* F-09 ו-F-48 (D4S-05), 7.10.2026: שדות אשפי ההזמנה. */
describe("bookFieldClass", () => {
  const tokens = bookFieldClass.split(/\s+/);

  it("גבול השדה הוא border-input (3:1), לא border-border (1.2:1)", () => {
    assert.ok(tokens.includes("border-input"));
    assert.ok(!tokens.some((t) => t === "border-border" || t.startsWith("border-border/")));
  });

  it("בפוקוס הגבול מלא והטבעת ring-2, לא brand-red/40 עם ring-1", () => {
    assert.ok(tokens.includes("focus:border-brand-red"));
    assert.ok(tokens.includes("focus:ring-2"));
    assert.ok(!tokens.includes("focus:border-brand-red/40"));
    assert.ok(!tokens.includes("focus:ring-1"));
  });
});
