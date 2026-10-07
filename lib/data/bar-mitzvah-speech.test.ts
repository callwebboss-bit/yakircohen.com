import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getLegacyRedirects } from "../legacy-redirects";
import { getBlogPostBySlug } from "./blog";

describe("bar mitzvah speech guide", () => {
  it("both old URLs of the speech article go to the guide, the dated one before /2022", () => {
    const redirects = getLegacyRedirects();
    const bare = (s: string) => decodeURI(s).replace(/\{\/\}\?$/, "");
    const sources = redirects.map((r) => bare(r.source));
    for (const old of ["/דרשה-לבר-מצווה-קצר-ולעניין", "/2022/05/17/דרשה-לבר-מצווה-קצר-ולעניין"]) {
      const hit = redirects.find((r) => bare(r.source) === old);
      assert.ok(hit, old);
      assert.match(hit.destination, /\/blog\/bar-mitzvah-speech$/, old);
    }
    assert.ok(sources.indexOf("/2022/05/17/דרשה-לבר-מצווה-קצר-ולעניין") < sources.indexOf("/2022/:path*"));
  });

  it("the guide links to the recording service and puts the owner's video on top", () => {
    const post = getBlogPostBySlug("bar-mitzvah-speech");
    assert.ok(post);
    assert.ok(post.content.includes('href="/studio/blessings/bar-mitzvah"'));
    assert.match(post.youtubeUrl ?? "", /y8w_BRwe_tg/);
  });
});
