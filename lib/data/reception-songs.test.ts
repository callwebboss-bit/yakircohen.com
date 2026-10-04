import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { RECEPTION_SONG_LISTS } from "./reception-songs";
import { getLegacyRedirects } from "../legacy-redirects";

const all = RECEPTION_SONG_LISTS.flatMap((list) => list.songs);

describe("reception songs", () => {
  it("every song has a public source for its title and artist", () => {
    for (const song of all) assert.match(song.source, /^https:\/\//, song.title);
  });

  it("no song appears twice across the lists", () => {
    const keys = all.map((s) => `${s.title}|${s.artist}`);
    assert.equal(new Set(keys).size, keys.length);
  });

  it("the old reception URLs, the dated one included, go to the post", () => {
    const redirects = getLegacyRedirects();
    const bare = (s: string) => decodeURI(s).replace(/\{\/\}\?$/, "");
    for (const old of ["/שירים-לקבלת-פנים", "/2019/11/05/שירים-לקבלת-פנים"]) {
      const hit = redirects.find((r) => bare(r.source) === old);
      assert.ok(hit, old);
      assert.match(hit.destination, /\/blog\/reception-songs$/, old);
    }
    const sources = redirects.map((r) => bare(r.source));
    assert.ok(sources.indexOf("/2019/11/05/שירים-לקבלת-פנים") < sources.indexOf("/2019/:path*"));
  });
});
