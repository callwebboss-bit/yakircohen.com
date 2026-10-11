import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { getLegacyRedirects } from "../legacy-redirects";
import { getBlogPostBySlug } from "./blog";
import { SPEECH_FORM_FIELDS, SPEECH_FORM_PDF } from "./bar-mitzvah-speech";

const root = join(import.meta.dirname, "..", "..");

function guide() {
  const post = getBlogPostBySlug("bar-mitzvah-speech");
  assert.ok(post);
  return post;
}

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

  it("the two speech-recording URLs from D57 go to the guide, the dated one before /2019", () => {
    const redirects = getLegacyRedirects();
    const bare = (s: string) => decodeURI(s).replace(/\{\/\}\?$/, "");
    const sources = redirects.map((r) => bare(r.source));
    for (const old of ["/הקלטת-דרשה-לבר-בת-מצווה", "/2019/11/26/הקלטת-דרשה-לבר-מצווה"]) {
      const hit = redirects.find((r) => bare(r.source) === old);
      assert.ok(hit, old);
      assert.match(hit.destination, /\/blog\/bar-mitzvah-speech$/, old);
    }
    const dated = sources.indexOf("/2019/11/26/הקלטת-דרשה-לבר-מצווה");
    assert.ok(dated >= 0 && dated < sources.indexOf("/2019/:path*"));
  });

  it("the guide links to the recording service and puts the owner's video on top", () => {
    const post = guide();
    assert.ok(post.content.includes('href="/studio/blessings/bar-mitzvah"'));
    assert.match(post.youtubeUrl ?? "", /y8w_BRwe_tg/);
  });
});

describe("bar mitzvah speech guide: the owner's ready-made speech (D100)", () => {
  it("comes back as its own section, before the structure", () => {
    const { content } = guide();
    const ready = content.indexOf("<h2>נוסח מוכן: דרשה קצרה ולעניין</h2>");
    assert.ok(ready > 0);
    assert.ok(ready < content.indexOf("<h2>המבנה: שלושה חלקים</h2>"));
    assert.ok(content.includes("<p>שלום אורחים,<br>שלום חברים,<br>אני עומד כאן נרגש מתמיד</p>"));
    assert.ok(content.includes("ועכשיו לחגיגות.</p>"));
  });

  it("leaves four blanks for the grandparents' names", () => {
    const { content } = guide();
    assert.equal(content.match(/_{6}/g)?.length, 4);
    assert.ok(content.includes("<p>לסבא ______, סבא ______<br>סבתא ______ וסבתא ______.</p>"));
  });

  it("carries the spelling fixes, with no exclamation mark and no dash end marker", () => {
    const { content } = guide();
    assert.ok(content.includes("אני אוהב אתכם"));
    assert.ok(!content.includes("אותכם"));
    assert.ok(content.includes("כאלה מדהימים"));
    assert.ok(!content.includes("!"));
    assert.ok(!/[–—]/.test(content));
  });

  it("keeps the owner's reading notes: not monotone, diction, and z\"l only when needed", () => {
    const { content } = guide();
    const at = content.indexOf("<h3>הערות הקלטה והקראה</h3>");
    assert.ok(at > 0);
    const notes = content.slice(at, content.indexOf("<h2>", at));
    assert.ok(notes.includes("מונוטוני"));
    assert.ok(notes.includes("דיקציה"));
    assert.ok(notes.includes("ז״ל"));
    assert.ok(notes.includes("רק על הסבים והסבתות שנמצאים בחיים"));
  });

  it("dates the update, in the schema and in the visible line", () => {
    const post = guide();
    assert.equal(post.seo.dateModified, "2026-10-12");
    assert.ok(post.content.includes("<strong>עודכן: 12 באוקטובר 2026.</strong>"));
  });
});

describe("bar mitzvah speech guide: the helper form (D100)", () => {
  it("is offered as a download on the page, and WhatsApp is for going over the written speech", () => {
    const { content } = guide();
    assert.ok(content.includes(`<a href="${SPEECH_FORM_PDF.path}">`));
    assert.ok(content.includes("רוצים שנעבור על הדרשה שכתבתם?"));
    assert.ok(!content.includes("רוצים את הטופס? שלחו לנו הודעה בוואטסאפ"));
  });

  it("lists the same fields on the page as in the PDF", () => {
    const { content } = guide();
    for (const { label, hint } of SPEECH_FORM_FIELDS) {
      assert.ok(content.includes(`<li><strong>${label}</strong>${hint ? ` ${hint}` : ""}</li>`), label);
    }
  });

  it("the PDF exists, is valid, and its size and page count match the data", () => {
    const file = join(root, "public", SPEECH_FORM_PDF.path);
    assert.ok(existsSync(file), `missing ${file}`);
    const bytes = readFileSync(file);
    assert.equal(bytes.subarray(0, 5).toString("latin1"), "%PDF-");
    assert.equal(
      statSync(file).size,
      SPEECH_FORM_PDF.sizeBytes,
      "the file changed. Run: npx tsx scripts/generate-speech-form-pdf.ts",
    );
    const pages = bytes.toString("latin1").match(/\/Type\s*\/Page(?![s\w])/g)?.length;
    assert.equal(pages, SPEECH_FORM_PDF.pages);
    assert.ok(SPEECH_FORM_PDF.path.startsWith("/downloads/") && SPEECH_FORM_PDF.path.endsWith(".pdf"));
  });
});
