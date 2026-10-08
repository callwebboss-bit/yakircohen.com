import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import {
  closureOf,
  countFanout,
  createImportGraph,
  latestGitDate,
  parseGitLog,
  readStringConstant,
  resolveRouteDate,
  routeFromFile,
  routeSourceFiles,
} from "../../scripts/sitemap-dates-core.mjs";
import {
  categoryLastModified,
  postLastModified,
  routeDateFor,
} from "./sitemap-lastmod";

describe("parseGitLog", () => {
  it("keeps the first (newest) date per file", () => {
    const raw = [
      "__C__2026-10-03T10:00:00+03:00",
      "lib/a.ts",
      "lib/b.ts",
      "",
      "__C__2026-09-01T10:00:00+03:00",
      "lib/a.ts",
      "lib/c.ts",
    ].join("\n");
    const map = parseGitLog(raw);
    assert.equal(map.get("lib/a.ts"), "2026-10-03T10:00:00+03:00");
    assert.equal(map.get("lib/c.ts"), "2026-09-01T10:00:00+03:00");
  });
});

describe("latestGitDate", () => {
  const toRel = (f: string) => f;

  it("compares by instant, not by string, across UTC offsets", () => {
    /* A נראה מאוחר יותר כמחרוזת, אבל B מאוחר ברגע (23:00Z מול 21:30Z) */
    const dates = new Map([
      ["a.ts", "2026-03-29T00:30:00+03:00"],
      ["b.ts", "2026-03-28T23:00:00+00:00"],
    ]);
    assert.equal(latestGitDate(["a.ts", "b.ts"], dates, toRel), "2026-03-28T23:00:00+00:00");
  });

  it("skips files with no history and returns undefined when none has one", () => {
    const dates = new Map([["a.ts", "2026-10-01T00:00:00+03:00"]]);
    assert.equal(latestGitDate(["a.ts", "new.ts"], dates, toRel), "2026-10-01T00:00:00+03:00");
    assert.equal(latestGitDate(["new.ts"], dates, toRel), undefined);
  });
});

describe("resolveRouteDate fallback chain", () => {
  const none = undefined;

  it("prefers git over everything", () => {
    assert.deepEqual(
      resolveRouteDate({ gitDate: "2026-10-01T00:00:00+03:00", contentDate: "2026-10-09", previousDate: "2026-10-02" }),
      { date: "2026-10-01T00:00:00+03:00", source: "git" },
    );
  });

  it("without git, takes the later of content constant and previous value", () => {
    assert.deepEqual(
      resolveRouteDate({ gitDate: none, contentDate: "2026-10-04", previousDate: "2026-10-03T10:00:00+03:00" }),
      { date: "2026-10-04", source: "content" },
    );
    assert.deepEqual(
      resolveRouteDate({ gitDate: none, contentDate: "2026-10-04", previousDate: "2026-10-06T10:00:00+03:00" }),
      { date: "2026-10-06T10:00:00+03:00", source: "previous" },
    );
  });

  it("keeps the previous value on a same-day tie so the file does not churn", () => {
    assert.deepEqual(
      resolveRouteDate({ gitDate: none, contentDate: "2026-10-04", previousDate: "2026-10-04T01:05:25+03:00" }),
      { date: "2026-10-04T01:05:25+03:00", source: "previous" },
    );
  });

  it("falls through to content-only, previous-only, then nothing", () => {
    assert.deepEqual(
      resolveRouteDate({ gitDate: none, contentDate: "2026-10-04", previousDate: none }),
      { date: "2026-10-04", source: "content" },
    );
    assert.deepEqual(
      resolveRouteDate({ gitDate: none, contentDate: none, previousDate: "2026-10-02" }),
      { date: "2026-10-02", source: "previous" },
    );
    assert.deepEqual(
      resolveRouteDate({ gitDate: none, contentDate: none, previousDate: none }),
      { date: undefined, source: "none" },
    );
  });
});

describe("readStringConstant", () => {
  it("reads exported string constants, typed or not", () => {
    const src = 'export const A_UPDATED_AT = "2026-10-04";\nexport const B: string = \'2026-10-03\';';
    assert.equal(readStringConstant(src, "A_UPDATED_AT"), "2026-10-04");
    assert.equal(readStringConstant(src, "B"), "2026-10-03");
    assert.equal(readStringConstant(src, "MISSING"), undefined);
  });
});

describe("routeFromFile", () => {
  const app = path.join(path.sep, "repo", "app");
  const page = (...segs: string[]) => path.join(app, ...segs, "page.tsx");

  it("strips route groups and maps the root", () => {
    assert.equal(routeFromFile(page(), app), "/");
    assert.equal(routeFromFile(page("(services)", "studio", "x"), app), "/studio/x");
  });

  it("returns null for dynamic segments unless explicitly allowed", () => {
    assert.equal(routeFromFile(page("online", "[category]"), app), null);
    assert.equal(
      routeFromFile(page("online", "[category]"), app, ["/online/[category]"]),
      "/online/[category]",
    );
    assert.equal(routeFromFile(page("glossary", "[slug]"), app, ["/online/[category]"]), null);
  });

  it("returns null for private folders", () => {
    assert.equal(routeFromFile(page("_private"), app), null);
  });
});

describe("routeSourceFiles", () => {
  function fixture() {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "sitemap-dates-"));
    const write = (rel: string, body: string) => {
      const full = path.join(root, rel);
      fs.mkdirSync(path.dirname(full), { recursive: true });
      fs.writeFileSync(full, body);
      return full;
    };
    /* חמישה עמודים, כולם מייבאים shared.ts, ורק a מייבא את התוכן הפרטי שלו */
    const pages: string[] = [];
    for (const name of ["a", "b", "c", "d", "e"]) {
      pages.push(
        write(
          `app/${name}/page.tsx`,
          [
            'import Shared from "@/lib/shared";',
            name === "a" ? 'import Content from "@/components/AContent";' : "",
            name === "a" ? 'import Stamp from "@/lib/x.generated";' : "",
          ].join("\n"),
        ),
      );
    }
    write("lib/shared.ts", 'import Hidden from "./hidden";\nexport default 1;');
    write("lib/hidden.ts", "export default 2;");
    write("components/AContent.tsx", 'import Data from "../lib/a-data";\nexport default 3;');
    write("lib/a-data.ts", "export default 4;");
    write("lib/x.generated.ts", "export default 5;");
    /* עמוד פרטי שמייבא את קובץ המילון: רק עמוד אחד מגיע אליו, ובכל זאת הוא מוחרג */
    pages.push(write("app/glossary/page.tsx", 'import terms from "@/lib/data/glossary";'));
    write("lib/data/glossary.ts", "export default [];");
    return { root, pages };
  }

  it("keeps the page and its private content, drops shared and generated files", () => {
    const { root, pages } = fixture();
    try {
      const depsOf = createImportGraph(root);
      const closures = new Map(pages.map((p) => [p, closureOf(p, depsOf)]));
      const fanout = countFanout(closures.values());
      const toRel = (f: string) => path.relative(root, f).split(path.sep).join("/");

      const a = routeSourceFiles(pages[0], closures.get(pages[0])!, fanout, root, 3).map(toRel).sort();
      assert.deepEqual(a, ["app/a/page.tsx", "components/AContent.tsx", "lib/a-data.ts"]);

      /* עמוד בלי תוכן פרטי נשאר עם ה-page.tsx שלו בלבד, גם אם כל השאר משותפים */
      const b = routeSourceFiles(pages[1], closures.get(pages[1])!, fanout, root, 3).map(toRel);
      assert.deepEqual(b, ["app/b/page.tsx"]);

      /* glossary.ts מגיע לעמוד אחד (מתחת לסף), אבל הוא קובץ של הרבה מונחים */
      const g = pages[5];
      assert.equal(fanout.get(path.join(root, "lib/data/glossary.ts")), 1);
      assert.deepEqual(routeSourceFiles(g, closures.get(g)!, fanout, root, 3).map(toRel), ["app/glossary/page.tsx"]);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});

describe("postLastModified", () => {
  const seo = { datePublished: "2026-05-01" };

  it("uses dateModified when present, otherwise datePublished", () => {
    assert.equal(postLastModified({ category: "x", seo }), "2026-05-01");
    assert.equal(
      postLastModified({ category: "x", seo: { ...seo, dateModified: "2026-10-03" } }),
      "2026-10-03",
    );
  });
});

describe("categoryLastModified", () => {
  const posts = [
    { category: "אולפן הקלטות", seo: { datePublished: "2026-03-01" } },
    { category: "אולפן והקלטה", seo: { datePublished: "2026-02-01", dateModified: "2026-10-03" } },
    { category: "פודקאסט", seo: { datePublished: "2026-09-01" } },
  ];

  it("returns the newest post date in the category, across its raw category variants", () => {
    assert.equal(categoryLastModified("studio", posts), "2026-10-03");
    assert.equal(categoryLastModified("podcast", posts), "2026-09-01");
  });

  it("returns undefined for a category with no posts", () => {
    assert.equal(categoryLastModified("gifts", posts), undefined);
  });
});

describe("routeDateFor", () => {
  const dates = {
    "/": "2026-10-01",
    "/online": "2026-06-11",
    "/online/vocal-fix": "2026-06-24",
    "/online/[category]": "2026-10-03",
  };

  it("matches exact routes first, ignoring a trailing slash", () => {
    assert.equal(routeDateFor(dates, "/"), "2026-10-01");
    assert.equal(routeDateFor(dates, "/online/vocal-fix/"), "2026-06-24");
  });

  it("matches a dynamic key against any single segment at that depth", () => {
    assert.equal(routeDateFor(dates, "/online/audio-music"), "2026-10-03");
  });

  it("does not match other depths or other prefixes", () => {
    assert.equal(routeDateFor(dates, "/online/a/b"), undefined);
    assert.equal(routeDateFor(dates, "/studio/audio-music"), undefined);
    assert.equal(routeDateFor(dates, "/missing"), undefined);
  });
});
