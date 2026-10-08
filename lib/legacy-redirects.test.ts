import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildCustomRoute } from "next/dist/lib/build-custom-route";
import { getPathMatch } from "next/dist/shared/lib/router/utils/path-match";
import {
  clearCartQuery,
  getLegacyRedirects,
  goneEquivalent,
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
  /* ['/_next'] כמו ש-next build מעביר. בלי דגל i, כמו ב-routes-manifest: Next שומר
     רק את compiled.source (build-custom-route.js:24, 28), ולכן %d7 לא תואם %D7 ב-Vercel */
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

/** אותו נתיב בקשה, עם hex באותיות קטנות כמו בקישורים של WordPress (%d7%a9) */
function lowerHex(pathname: string): string {
  return pathname.replace(/%[0-9A-F]{2}/g, (escape) => escape.toLowerCase());
}

/**
 * היעד של הכלל הראשון שתואם, לפי הסדר ב-routes-manifest וב-regex שלו. זה מה
 * ש-Vercel עושה: הכללים של getLegacyRedirects יושבים ראשונים ב-next.config.ts:135,
 * לפני כללי ה-www והסלאש, ולכן התאמה כאן היא קפיצה אחת ליעד מלא.
 */
function firstManifestDestination(pathname: string): string | null {
  const hit = getLegacyRedirects().find((r) => manifestMatches(r.source, pathname));
  return hit ? hit.destination.replace("https://yakircohen.com", "") : null;
}

describe("legacy redirects: lowercase hex from WordPress links (8.10.2026)", () => {
  /* כתובות ישנות מוכרות. /שיר-במתנה הוא המקרה שנבדק באתר החי (404 באותיות
     קטנות). מדריך הדרשה הוא הכתובת עם הכי הרבה קליקים במפה. הכתובת עם התאריך
     בודקת שהתאום יושב לפני "/2019/:path*". */
  const known: ReadonlyArray<readonly [string, string]> = [
    ["/שיר-במתנה", "/studio/recording-song-modiin/gifts"],
    ["/שיר-מתנה-לחתן-ולכלה-להעניק-להם-רגע-מה", "/studio/recording-song-modiin/gifts"],
    ["/דרשה-לבר-מצווה-קצר-ולעניין", "/blog/bar-mitzvah-speech"],
    ["/צרו-קשר", "/contact"],
    ["/אולפן-הקלטות-בירושלים", "/studio/studio-jerusalem"],
    ["/2019/11/05/שירי-סלואו-לחתונה", "/blog/wedding-slow-songs"],
  ];

  it("reproduces the bug: the upper-case source alone misses a lower-case request in the manifest regex", () => {
    const source = getLegacyRedirects().find((r) => decodeURI(bareSource(r.source)) === "/שיר-במתנה")!.source;
    assert.match(source, /%D7/);
    const lower = lowerHex(requestPathname("/שיר-במתנה"));
    assert.equal(lower, "/%d7%a9%d7%99%d7%a8-%d7%91%d7%9e%d7%aa%d7%a0%d7%94");
    assert.equal(manifestMatches(source, lower), false);
  });

  it("known old Hebrew URLs reach the same target in upper and lower case, with and without the slash", () => {
    for (const [old, target] of known) {
      const upper = requestPathname(old);
      const lower = lowerHex(upper);
      assert.notEqual(lower, upper, old);
      for (const pathname of [upper, `${upper}/`, lower, `${lower}/`]) {
        assert.equal(firstManifestDestination(pathname), target, `${old} as ${pathname}`);
      }
    }
  });

  it("the dated lower-case URL does not fall into the /2019 catch-all", () => {
    const lower = lowerHex(requestPathname("/2019/11/05/שירי-סלואו-לחתונה/"));
    assert.notEqual(firstManifestDestination(lower), "/blog");
  });

  it("every encoded source is followed directly by its lower-case twin with the same destination", () => {
    const all = getLegacyRedirects();
    /* המקורות עצמם, בלי התאומים: יש בהם לפחות escape אחד עם אות גדולה */
    const encoded = all.filter((r) => r.source !== lowerHex(r.source));
    assert.ok(encoded.length >= 214);
    for (const r of encoded) {
      const twin = all[all.indexOf(r) + 1];
      assert.ok(twin, `no twin after ${decodeURI(r.source)}`);
      assert.equal(twin.source, lowerHex(r.source), decodeURI(r.source));
      assert.equal(twin.destination, r.destination, decodeURI(r.source));
      const pathname = lowerHex(requestPathname(decodeURI(bareSource(r.source))));
      assert.ok(manifestMatches(twin.source, pathname), `twin misses ${decodeURI(r.source)}`);
    }
  });

  it("ASCII sources get no twin", () => {
    const all = getLegacyRedirects();
    assert.equal(all.filter((r) => decodeURI(bareSource(r.source)) === "/recording").length, 1);
  });

  it("stays under the 1,000 custom routes where next build starts warning", () => {
    /* load-custom-routes.js:473 סופר headers + rewrites + redirects. היום: כלל
       headers אחד ב-next.config.ts, אפס rewrites, וארבעה redirects שכתובים שם ישירות. */
    assert.ok(getLegacyRedirects().length + 4 + 1 < 1000);
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

describe("goneEquivalent (product URLs with a real page get 308, not 410)", () => {
  it("maps an encoded product path, with or without a trailing slash", () => {
    const encoded = encodeURI("/product/קורס-די-גיי-פרטי");
    assert.equal(goneEquivalent(encoded), "/academy/dj-course");
    assert.equal(goneEquivalent(`${encoded}/`), "/academy/dj-course");
  });

  it("leaves every other product path to the 410", () => {
    assert.equal(goneEquivalent(encodeURI("/product/מוצר-שלא-קיים")), null);
    assert.equal(goneEquivalent("/product"), null);
  });

  it("does not throw on a malformed encoding", () => {
    assert.equal(goneEquivalent("/product/%E0%A4%A"), null);
  });
});
