import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { findIntentConflicts, intentOwnerOf, matchIntentPhrases } from "./intent-owners";

/* בדיקת האתר עצמו (H1 מול KNOWN_INTENT_CONFLICTS) רצה אחרי הבנייה:
   npm run audit:thin-pages -- --strict-intent, בתוך verify:predeploy. כאן רק הלוגיקה. */

describe("matchIntentPhrases", () => {
  it("prefers the longer phrase, like buildMatcher", () => {
    const found = matchIntentPhrases("אולפן פודקאסט להשכרה במודיעין");
    assert.deepEqual(
      found.map((f) => f.phrase),
      ["אולפן פודקאסט להשכרה"],
    );
  });

  it("allows one Hebrew prefix letter", () => {
    const found = matchIntentPhrases("מה חשוב בתקליטן לחתונה");
    assert.ok(found.some((f) => f.phrase === "תקליטן לחתונה"));
  });

  it("does not match inside a longer word", () => {
    assert.equal(
      matchIntentPhrases("קריינותית").some((f) => f.phrase === "קריינות"),
      false,
    );
  });
});

describe("intentOwnerOf", () => {
  it("strips the hash from the owner path", () => {
    assert.equal(intentOwnerOf("שובר מתנה"), "/shop");
  });
});

describe("findIntentConflicts", () => {
  it("treats a blog post as support and a service page as competing", () => {
    const conflicts = findIntentConflicts([
      { url: "/blog/x", h1: ["תקליטן לחתונה: מדריך"] },
      { url: "/events/y", h1: ["תקליטן לחתונה במודיעין"] },
      { url: "/events/dj-events", h1: ["תקליטן לחתונה"] },
      { url: "/events/z", h1: ["תקליטן לחתונה"], robots: "noindex, follow" },
    ]);
    assert.deepEqual(
      conflicts.map((c) => [c.url, c.kind]),
      [
        ["/blog/x", "support"],
        ["/events/y", "competing"],
      ],
    );
  });
});
