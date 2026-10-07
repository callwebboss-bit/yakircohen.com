import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { BLOG_POSTS } from "./blog";

/* 6.10.2026: בפוסט bar-mitzvah-speech נכתב Y8w_BRwe_tg במקום y8w_BRwe_tg.
   YouTube רגיש לאותיות גדולות וקטנות, ולכן ה-oEmbed החזיר 404 והנגן והפוסטר נשברו.
   המבחן תופס רק את המחלקה הזו: מזהה שקיים במפת התאריכים או בקטלוג באות אחרת. */
const KNOWN = new Set<string>([
  ...Object.keys(JSON.parse(readFileSync("lib/data/youtube-upload-dates.generated.json", "utf8"))),
  ...[...readFileSync("lib/data/video-catalog.generated.ts", "utf8").matchAll(/"videoId":\s*"([A-Za-z0-9_-]{11})"/g)].map(
    (m) => m[1],
  ),
]);
const LOWER_TO_KNOWN = new Map([...KNOWN].map((id) => [id.toLowerCase(), id]));
const ID_RE = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/g;

describe("blog YouTube ids", () => {
  it("no id differs from a known video only by letter case", () => {
    const wrong: string[] = [];
    for (const post of BLOG_POSTS) {
      for (const text of [post.content, (post as { youtubeUrl?: string }).youtubeUrl ?? ""]) {
        for (const m of text.matchAll(ID_RE)) {
          const known = LOWER_TO_KNOWN.get(m[1].toLowerCase());
          if (known && known !== m[1]) wrong.push(`${post.slug}: ${m[1]} should be ${known}`);
        }
      }
    }
    assert.deepEqual(wrong, []);
  });
});
