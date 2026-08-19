import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { studioPackageExperienceLine } from "@/lib/studio-group-messaging";

describe("studioPackageExperienceLine", () => {
  it("excludes pitch correction on remote", () => {
    const line = studioPackageExperienceLine("remote");
    assert.match(line, /תיקון זיופים לא כלול/);
    assert.doesNotMatch(line, /תיקון זיופים דיגיטלי מלא/);
  });

  it("keeps pitch correction on classic song packages", () => {
    assert.match(studioPackageExperienceLine("classic"), /תיקון זיופים דיגיטלי מלא/);
  });
});
