import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { describe, it } from "node:test";

/* 11.10.2026: כל קישור פנימי עובר דרך components/ui/IntentLink, שטוען מראש רק
   בכוונה. ייבוא ישיר של next/link מחזיר טעינה מראש של כל קישור שנכנס למסך
   (92 בקשות לביקור אחד ב-/studio), וזה מה שהקפיץ את ISR Reads ב-Vercel. */
describe("IntentLink guard", () => {
  it("only IntentLink imports next/link", () => {
    const out = execFileSync(
      "git",
      ["grep", "-l", 'from "next/link"', "--", "app", "components", "lib", "hooks"],
      { encoding: "utf8" },
    );
    const files = out.split("\n").filter(Boolean);
    assert.deepEqual(files, ["components/ui/IntentLink.tsx"]);
  });
});
