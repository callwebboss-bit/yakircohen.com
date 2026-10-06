import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { buildVideoObjectSchema, youtubeUploadDate } from "./video-schema";

/* Search Console, 6.10.2026: 16 VideoObject לא תקפים ב-/studio/recording-song-modiin,
   "חסר שדה uploadDate". כל סרטון בקטלוג חייב לקבל תאריך אמיתי מ-YouTube. */
describe("VideoObject uploadDate", () => {
  it("every catalog video has a real upload date", () => {
    const catalog = readFileSync("lib/data/video-catalog.generated.ts", "utf8");
    const ids = [...catalog.matchAll(/"videoId":\s*"([A-Za-z0-9_-]{11})"/g)].map((m) => m[1]);
    assert.ok(ids.length > 0);
    const missing = ids.filter((id) => !youtubeUploadDate(id));
    assert.deepEqual(missing, [], "npm run sync:youtube-dates");
  });

  it("the schema takes the date from YouTube when the caller does not pass one", () => {
    const schema = buildVideoObjectSchema({ videoId: "LKg3pwdon_M", name: "x" });
    assert.match(String((schema as { uploadDate?: string }).uploadDate), /^\d{4}-\d{2}-\d{2}T/);
  });

  it("an explicit date wins, and an unknown video gets no invented date", () => {
    const explicit = buildVideoObjectSchema({ videoId: "LKg3pwdon_M", name: "x", uploadDate: "2026-07-19" });
    assert.equal((explicit as { uploadDate?: string }).uploadDate, "2026-07-19");
    const unknown = buildVideoObjectSchema({ videoId: "zzzzzzzzzzz", name: "x" });
    assert.ok(!("uploadDate" in unknown));
  });
});
