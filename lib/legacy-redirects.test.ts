import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildCustomRoute } from "next/dist/lib/build-custom-route";
import { getPathMatch } from "next/dist/shared/lib/router/utils/path-match";
import {
  clearCartQuery,
  getLegacyRedirects,
  toNextSource,
  withOptionalTrailingSlash,
} from "@/lib/legacy-redirects";

/** הנתיב כפי שהנתב של Next רואה אותו: parseUrl(req.url).pathname, כלומר מקודד */
function requestPathname(rawPath: string): string {
  return new URL(rawPath, "https://yakircohen.com").pathname;
}

/** אותו matcher ששרת Next בונה ל-redirects (server/lib/router-utils/filesystem.js:99) */
function serverMatches(source: string, pathname: string): boolean {
  return getPathMatch(source, { strict: true, removeUnnamedParams: true })(pathname) !== false;
}

/** ה-regex שנכתב ל-routes-manifest, שממנו Vercel בונה את הניתוב */
function manifestMatches(source: string, pathname: string): boolean {
  /* ['/_next'] כמו ש-next build מעביר. בלי דגל i: הדפדפן שולח hex באותיות גדולות */
  const route = buildCustomRoute("redirect", { source, destination: "/", permanent: true }, ["/_next"]);
  return new RegExp(route.regex).test(pathname);
}

const NON_ASCII = /[^\x00-\x7F]/;

/** המקור בלי סיומת הסלאש האופציונלי, כדי לבנות ממנו נתיב בקשה */
function bareSource(source: string): string {
  return source.replace(/\{\/\}\?$/, "");
}

describe("legacy redirects: Hebrew sources (ED-01)", () => {
  it("reproduces the bug: a raw Hebrew source never matches the request pathname", () => {
    const pathname = requestPathname("/תקליטן-לחתונות");
    assert.equal(pathname, "/%D7%AA%D7%A7%D7%9C%D7%99%D7%98%D7%9F-%D7%9C%D7%97%D7%AA%D7%95%D7%A0%D7%95%D7%AA");
    assert.equal(serverMatches("/תקליטן-לחתונות", pathname), false);
    assert.equal(manifestMatches("/תקליטן-לחתונות", pathname), false);
  });

  it("toNextSource percent-encodes Hebrew exactly like encodeURI", () => {
    assert.equal(toNextSource("/מחירון"), encodeURI("/מחירון"));
    assert.equal(toNextSource("/דניס-צ׳רקוב"), encodeURI("/דניס-צ׳רקוב"));
    assert.equal(toNextSource("/magazin/תקליטן-לאירועים"), encodeURI("/magazin/תקליטן-לאירועים"));
  });

  it("toNextSource leaves ASCII sources and pattern syntax untouched", () => {
    assert.equal(toNextSource("/recording"), "/recording");
    assert.equal(toNextSource("/attractions/:path*"), "/attractions/:path*");
    assert.equal(toNextSource("/\\+6"), "/\\+6");
    /* לא מקודד פעמיים מקור שכבר מקודד */
    const encoded = encodeURI("/מחירון");
    assert.equal(toNextSource(encoded), encoded);
  });

  it("every emitted source is ASCII only", () => {
    const offenders = getLegacyRedirects().filter((r) => NON_ASCII.test(r.source));
    assert.deepEqual(offenders, []);
  });

  it("every Hebrew source matches its own request pathname, upper or lower case hex", () => {
    const hebrew = getLegacyRedirects().filter((r) => r.source.includes("%D7"));
    assert.ok(hebrew.length >= 214, `expected at least 214 Hebrew sources, got ${hebrew.length}`);
    for (const { source } of hebrew) {
      const pathname = requestPathname(decodeURI(bareSource(source)));
      assert.ok(serverMatches(source, pathname), `server matcher misses ${decodeURI(source)}`);
      assert.ok(manifestMatches(source, pathname), `manifest regex misses ${decodeURI(source)}`);
      assert.ok(serverMatches(source, pathname.toLowerCase()), `lower-case hex misses ${decodeURI(source)}`);
    }
  });

  it("replaces instead of duplicating: no source appears twice", () => {
    const sources = getLegacyRedirects().map((r) => r.source);
    const dupes = sources.filter((s, i) => sources.indexOf(s) !== i);
    assert.deepEqual(dupes, []);
  });

  it("stays well under the Vercel limit of 1,024 redirects", () => {
    /* +5 בשביל הכללים שכתובים ישירות ב-next.config.ts (היום 4: שני כללי www, סלאש ו-.html) */
    assert.ok(getLegacyRedirects().length + 5 < 1024);
  });

  it("English redirects are unchanged", () => {
    const byDecoded = new Map(getLegacyRedirects().map((r) => [decodeURI(bareSource(r.source)), r]));
    assert.deepEqual(byDecoded.get("/recording"), {
      source: "/recording{/}?",
      destination: "https://yakircohen.com/studio",
      permanent: true,
    });
    assert.equal(
      byDecoded.get("/attractions/:path*")?.destination,
      "https://yakircohen.com/events/attractions/:path*",
    );
  });

  it("maps the obvious legacy paths and keeps bat mitzvah songs off the wedding post", () => {
    const dest = new Map(
      getLegacyRedirects().map((r) => [
        decodeURI(bareSource(r.source)),
        r.destination.replace("https://yakircohen.com", ""),
      ]),
    );
    assert.equal(dest.get("/צרו-קשר"), "/contact");
    assert.equal(dest.get("/אודותינו"), "/about");
    assert.equal(dest.get("/אולפן-הקלטות"), "/studio");
    assert.equal(dest.get("/תקליטן-בנתניה"), "/events/dj-events");
    for (const old of [
      "/שירים-לבת-מצווה",
      "/שירים-לבת-מצווה-2",
      "/רשימת-שירים-לבת-מצווה",
      "/שירי-בת-מצווה-להרים-את-הרחבה-ולשמח-את-כ",
      "/2021/05/15/שירים-לבת-מצווה",
      "/2021/09/06/רשימת-שירים-לבת-מצווה",
    ]) {
      assert.equal(dest.get(old), "/blog/bat-mitzvah-songs", old);
    }
  });

  it("dated bat mitzvah URLs come before the /2021 catch-all that sends to /blog", () => {
    const sources = getLegacyRedirects().map((r) => decodeURI(bareSource(r.source)));
    const catchAll = sources.indexOf("/2021/:path*");
    assert.ok(catchAll >= 0);
    for (const dated of ["/2021/05/15/שירים-לבת-מצווה", "/2021/09/06/רשימת-שירים-לבת-מצווה"]) {
      const at = sources.indexOf(dated);
      assert.ok(at >= 0 && at < catchAll, dated);
    }
  });

  it("all destinations are ASCII (Location header must not carry raw Hebrew)", () => {
    const offenders = getLegacyRedirects().filter((r) => NON_ASCII.test(r.destination));
    assert.deepEqual(offenders, []);
  });
});

describe("legacy redirects: one hop (www, trailing slash)", () => {
  it("withOptionalTrailingSlash adds {/}? once and trims a written slash", () => {
    assert.equal(withOptionalTrailingSlash("/recording"), "/recording{/}?");
    assert.equal(withOptionalTrailingSlash("/recording/"), "/recording{/}?");
    assert.equal(withOptionalTrailingSlash("/attractions/:path*"), "/attractions/:path*{/}?");
    assert.equal(withOptionalTrailingSlash("/"), "/");
  });

  it("every source matches with and without a trailing slash (old WordPress URLs end in /)", () => {
    const hebrew = getLegacyRedirects().filter((r) => r.source.includes("%D7"));
    for (const { source } of hebrew) {
      const pathname = requestPathname(decodeURI(bareSource(source)));
      assert.ok(serverMatches(source, `${pathname}/`), `slash form misses ${decodeURI(bareSource(source))}`);
      assert.ok(manifestMatches(source, `${pathname}/`), `slash form misses in manifest ${decodeURI(bareSource(source))}`);
      assert.ok(serverMatches(source, pathname), `bare form misses ${decodeURI(bareSource(source))}`);
    }
    assert.ok(serverMatches("/2019/:path*{/}?", "/2019/some-post/"));
    assert.ok(serverMatches("/2019/:path*{/}?", "/2019/some-post"));
  });

  it("a destination with a query keeps the literal source form that works live today (no {/}? group)", () => {
    const withQuery = getLegacyRedirects().filter((r) => r.destination.includes("?"));
    assert.ok(withQuery.length >= 2);
    for (const r of withQuery) assert.ok(!r.source.includes("{"), `group in ${r.source}`);
    const sources = withQuery.map((r) => r.source);
    assert.ok(sources.includes("/studio/upload") && sources.includes("/studio/upload/"));
  });

  it("every destination is absolute, so www lands in one hop", () => {
    /* יעד חיצוני (וואטסאפ של /studio/upload) כבר מלא. השאר על הדומיין הקנוני. */
    const offenders = getLegacyRedirects().filter(
      (r) => !r.destination.startsWith("https://yakircohen.com/") && !r.destination.startsWith("https://wa.me/"),
    );
    assert.deepEqual(offenders, []);
  });
});

describe("clearCartQuery (ED-12)", () => {
  it("drops the whole query when add-to-cart is present", () => {
    const url = new URL("https://yakircohen.com/?add-to-cart=123&quantity=1&utm_source=fb");
    assert.equal(clearCartQuery(url), true);
    assert.equal(url.href, "https://yakircohen.com/");
  });

  it("leaves other URLs alone, so the redirect can not loop", () => {
    const url = new URL("https://yakircohen.com/studio?utm_source=google");
    assert.equal(clearCartQuery(url), false);
    assert.equal(url.href, "https://yakircohen.com/studio?utm_source=google");
  });

  it("an empty add-to-cart value still counts", () => {
    const url = new URL("https://yakircohen.com/studio?add-to-cart");
    assert.equal(clearCartQuery(url), true);
    assert.equal(url.search, "");
  });
});
