import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { batMitzvahSongListHtml } from "./bat-mitzvah-songs";
import {
  WEDDING_SLOW_EXCLUDED_TITLES,
  WEDDING_SLOW_NEW_SONGS,
  WEDDING_SLOW_SONG_LISTS,
} from "./wedding-slow-songs";
import { getLegacyRedirects } from "../legacy-redirects";

const all = WEDDING_SLOW_SONG_LISTS.flatMap((list) => list.songs);

describe("wedding slow songs", () => {
  it("every song has a public source for its title and artist", () => {
    for (const song of all) assert.match(song.source, /^https:\/\//, song.title);
  });

  it("no song appears twice across the lists", () => {
    const keys = all.map((s) => `${s.title}|${s.artist}`);
    assert.equal(new Set(keys).size, keys.length);
  });

  it("songs the owner removed stay out", () => {
    const titles = new Set(all.map((s) => s.title));
    for (const title of WEDDING_SLOW_EXCLUDED_TITLES) assert.ok(!titles.has(title), title);
  });

  it("renders each list", () => {
    assert.match(batMitzvahSongListHtml(WEDDING_SLOW_NEW_SONGS), /^<ul>[\s\S]*<\/ul>$/);
  });

  it("the old slow songs URLs, dated ones included, go to the post", () => {
    const redirects = getLegacyRedirects();
    for (const old of [
      "/שירי-סלואו-לחתונה",
      "/שירי-סלואו-לחתונה-2",
      "/שירי-סלואו",
      "/2019/11/05/שירי-סלואו-לחתונה",
      "/2021/08/25/שירי-סלואו",
    ]) {
      const hit = redirects.find((r) => decodeURI(r.source).replace(/\{\/\}\?$/, "") === old);
      assert.ok(hit, old);
      assert.match(hit.destination, /\/blog\/wedding-slow-songs$/, old);
    }
  });

  it("dated slow songs URLs come before the /2019 and /2021 catch-alls", () => {
    const sources = getLegacyRedirects().map((r) => decodeURI(r.source).replace(/\{\/\}\?$/, ""));
    for (const [dated, catchAll] of [
      ["/2019/11/05/שירי-סלואו-לחתונה", "/2019/:path*"],
      ["/2021/08/25/שירי-סלואו", "/2021/:path*"],
    ]) {
      const at = sources.indexOf(dated);
      const all = sources.indexOf(catchAll);
      assert.ok(at >= 0 && all >= 0 && at < all, dated);
    }
  });
});
