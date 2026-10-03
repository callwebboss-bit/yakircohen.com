import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { studioPackageExperienceLine } from "@/lib/studio-group-messaging";

describe("studioPackageExperienceLine", () => {
  it("excludes pitch correction on remote", () => {
    const line = studioPackageExperienceLine("remote");
    assert.match(line, /תיקון זיופים לא כלול/);
    assert.doesNotMatch(line, /תיקון זיופים דיגיטלי מלא/);
  });

  it("does not promise pitch correction on the song package (2.10.2026)", () => {
    const line = studioPackageExperienceLine("song");
    assert.match(line, /מיקס ומאסטר/);
    assert.match(line, /תיקון זיופים לא כלול/);
  });

  it("never promises full pitch correction for any package", () => {
    for (const id of ["remote", "song", null, undefined] as const) {
      assert.doesNotMatch(studioPackageExperienceLine(id), /תיקון זיופים דיגיטלי מלא/);
    }
  });
});
