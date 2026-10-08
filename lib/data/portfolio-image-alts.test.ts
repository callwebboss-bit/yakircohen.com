import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { describe, it } from "node:test";
import {
  deriveHebrewAlt,
  deriveHebrewAltOrNull,
  IMAGE_ALT_FALLBACK_LABEL,
  isUsableDerivedAlt,
} from "@/lib/hebrew-image-alt";
import { ensureImageAlt } from "@/lib/image-alt";
import { BLOG_POSTS, type BlogPost } from "./blog";
import { BLOG_OG_BY_THUMBNAIL } from "./blog-og.generated";
import {
  BLOG_THUMBNAIL_ALTS,
  blogThumbnailAlt,
  PORTFOLIO_IMAGE_ALTS,
  resolvePortfolioImageAlt,
} from "./portfolio-image-alts";

/*
 * F-20 / F-36 / F-54 (ביקורת נגישות 7.10.2026). ה-alt של גלריות השירותים נגזר
 * משם הקובץ, ושמות של מצלמה, של WordPress ושל כלי עריכה הגיעו לקורא המסך
 * ("פתח תמונה: leom9008") ולכיתוב הגלוי מתחת לתמונה. הבדיקות האלה הולכות על
 * כל התמונות ב-public/images/services דרך אותה פונקציה שהאתר משתמש בה.
 */

const SERVICES_ROOT = resolve(import.meta.dirname, "../../public/images/services");
const PUBLIC_ROOT = resolve(import.meta.dirname, "../../public");
const IMAGE_EXT = /\.(avif|gif|jpe?g|jfif|png|svg|webp)$/i;

/** מונחי מותג שנשארים באותיות לטיניות בתוך alt עברי. "קורס DJ" יש בו 4 אותיות עבריות בלבד. */
const LATIN_ALLOWLIST = new Set(["DJ", "102FM", "SHURE"]);

/** תיקיות הארכיון נטענות לאותה גלריה כמו תיקיית השורש שלהן. */
const ARCHIVE_SEGMENT = /\/(?:archive|arcive)$/;

function walkImages(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkImages(full, out);
    else if (IMAGE_EXT.test(entry.name)) out.push(full);
  }
  return out;
}

/** נתיב יחסי עם "/" ובלי התמונות שיושבות ישר בשורש (שום גלריה לא קוראת אותן). */
const SERVICE_IMAGES = walkImages(SERVICES_ROOT)
  .map((full) => relative(SERVICES_ROOT, full).split(sep).join("/"))
  .filter((rel) => rel.includes("/"))
  .sort();

const wordCount = (alt: string) => alt.trim().split(/\s+/).length;

function altProblems(alt: string): string[] {
  const problems: string[] = [];
  if (!isUsableDerivedAlt(alt)) problems.push("בלי עברית או עם שריד של שם קובץ");
  if (wordCount(alt) < 2) problems.push("פחות משתי מילים");
  const latin = alt
    .split(/\s+/)
    .filter((token) => /[A-Za-z]/.test(token) && !LATIN_ALLOWLIST.has(token.toUpperCase()));
  if (latin.length > 0) problems.push(`אנגלית: ${latin.join(", ")}`);
  return problems;
}

describe("alt של תמונות השירותים", () => {
  it("יש תמונות לבדוק", () => {
    assert.ok(SERVICE_IMAGES.length > 150, `נמצאו ${SERVICE_IMAGES.length} תמונות`);
  });

  it("כל תמונה מקבלת alt בעברית בלי שרידי שם קובץ", () => {
    const bad = SERVICE_IMAGES.map((rel, index) => ({
      rel,
      alt: resolvePortfolioImageAlt(rel, index),
    }))
      .map((row) => ({ ...row, problems: altProblems(row.alt) }))
      .filter((row) => row.problems.length > 0);
    assert.deepEqual(bad, []);
  });

  it("אין שתי תמונות בגלריה אחת עם אותו alt", () => {
    const seen = new Map<string, string[]>();
    for (const rel of SERVICE_IMAGES) {
      const folder = rel.slice(0, rel.lastIndexOf("/")).replace(ARCHIVE_SEGMENT, "");
      const key = `${folder}\u0000${resolvePortfolioImageAlt(rel)}`;
      seen.set(key, [...(seen.get(key) ?? []), rel]);
    }
    const duplicates = [...seen.entries()].filter(([, rels]) => rels.length > 1);
    assert.deepEqual(duplicates, []);
  });

  it("כל מפתח במפה מצביע על קובץ שקיים", () => {
    const stale = Object.keys(PORTFOLIO_IMAGE_ALTS).filter(
      (rel) => !existsSync(join(SERVICES_ROOT, rel)),
    );
    assert.deepEqual(stale, []);
  });

  it("כל משפט במפה בן 5 עד 12 מילים, בעברית", () => {
    const bad = Object.entries(PORTFOLIO_IMAGE_ALTS)
      .filter(([, alt]) => wordCount(alt) < 5 || wordCount(alt) > 12 || altProblems(alt).length > 0)
      .map(([rel, alt]) => ({ rel, alt }));
    assert.deepEqual(bad, []);
  });

  it("אין סימנים אסורים בטקסט: מקף ארוך, גרשיים מסולסלים, שלוש נקודות וסימן קריאה", () => {
    const all = [...Object.values(PORTFOLIO_IMAGE_ALTS), ...Object.values(BLOG_THUMBNAIL_ALTS)];
    const bad = all.filter((alt) => /[–—‘’“”…!]/.test(alt));
    assert.deepEqual(bad, []);
  });

  it("הקבצים שהביקורת סימנה מקבלים תיאור ולא את שם הקובץ", () => {
    const flagged: Array<[string, RegExp]> = [
      ["photography/wedding/LEOM9008.webp", /leom/i],
      ["photography/wedding/LMS02518.webp", /lms/i],
      ["studio/recording-song-modiin/00000IMG_00000_BURST20200701191123548_COVER-scaled.webp", /burst|scaled|img/i],
      ["video/photo-slideshow/ננו בננה 2 copy.webp", /copy/i],
      ["events/attractions/giant-balloons/Ballroom Close Up Decor.webp", /[a-z]/i],
      ["events/equipment/eq-מיקרופון שור לזמרים.webp", /(?:^|\s)eq(?:\s|$)/i],
      ["events/attractions/led-booth/400120200453_289382.webp", /מהגלריה|\d{5,}/],
    ];
    for (const [rel, forbidden] of flagged) {
      const alt = resolvePortfolioImageAlt(rel);
      assert.doesNotMatch(alt, forbidden, rel);
      assert.match(alt, /[א-ת]/, rel);
    }
  });

  it("שתי הטעויות שהועתקו משמות קבצים תוקנו", () => {
    for (const rel of [
      "events/attractions/led-booth/כמדת שידור עמדת לד ניידת.webp",
      "events/dj-events/כמדת שידור עמדת לד ניידת.webp",
    ]) {
      assert.doesNotMatch(resolvePortfolioImageAlt(rel), /כמדת/, rel);
    }
    assert.doesNotMatch(resolvePortfolioImageAlt("voiceover/קרינות באולפן.webp"), /קרינות/);
  });
});

describe("deriveHebrewAlt אחרי החיזוק", () => {
  it("שם קובץ של מצלמה או של כלי עריכה נופל לתווית עברית עם מספר", () => {
    const names = [
      "LEOM9008.webp",
      "LMR52141.webp",
      "IMG-20200706-WA0025.webp",
      "00000IMG_00000_BURST20200701191123548_COVER-scaled.webp",
      "400120200453_289382.webp",
      "ננו בננה 2 copy.webp",
      "עמדת-לד-השכרות-1024x576.webp",
      "בלוני ענק לרחבה(1).webp",
    ];
    for (const name of names) {
      assert.equal(deriveHebrewAlt(name, 4), `${IMAGE_ALT_FALLBACK_LABEL} - תמונה 5`, name);
      assert.equal(deriveHebrewAltOrNull(name), null, name);
    }
  });

  it("שם קובץ בעברית שכתב אדם נשאר כמו שהוא", () => {
    assert.equal(deriveHebrewAlt("אירוע חברה עם מיתוג.webp"), "אירוע חברה עם מיתוג");
    assert.equal(deriveHebrewAlt("אולפן-הקלטה-במודיעין.webp"), "אולפן הקלטה במודיעין");
  });

  it("מילים לא מתורגמות לא מצטרפות לתוצאה ואנגלית לא נכנסת ל-alt", () => {
    for (const name of [
      "Sparklers on Dance Floor.webp",
      "Cold Spark Machine - Close-up.webp",
      "Colorful Confetti Shower (1).webp",
    ]) {
      assert.doesNotMatch(deriveHebrewAlt(name), /[A-Za-z]/, name);
    }
  });

  it("isUsableDerivedAlt דוחה אנגלית בלבד ושרידים, ומקבל מילה עברית עם ספרה", () => {
    assert.equal(isUsableDerivedAlt("leom9008"), false);
    assert.equal(isUsableDerivedAlt("אולפן ההקלטות scaled"), false);
    assert.equal(isUsableDerivedAlt("עשן כבד 2"), true);
    assert.equal(isUsableDerivedAlt("קורס DJ"), true);
  });
});

describe("ensureImageAlt", () => {
  it("alt מפורש גובר, ושם קובץ גולמי לא הופך ל-alt", () => {
    assert.equal(ensureImageAlt("תיאור כתוב", { filename: "LEOM9008.webp" }), "תיאור כתוב");
    assert.equal(
      ensureImageAlt("", { filename: "LEOM9008.webp", fallback: "גלריה - תמונה 3" }),
      "גלריה - תמונה 3",
    );
    assert.equal(ensureImageAlt(undefined), IMAGE_ALT_FALLBACK_LABEL);
  });

  it("שם קובץ בעברית עדיין משמש כשאין alt", () => {
    assert.equal(ensureImageAlt(null, { filename: "אולפן פודקאסט.webp" }), "אולפן פודקאסט");
  });
});

describe("alt של תמונת ההירו בבלוג", () => {
  const posts = BLOG_POSTS as readonly BlogPost[];

  it("לכל תמונה ממוזערת של פוסט יש תיאור, והוא לא כותרת הפוסט", () => {
    const missing = [...new Set(posts.map((post) => post.thumbnail))].filter(
      (thumbnail) => !blogThumbnailAlt(thumbnail),
    );
    assert.deepEqual(missing, []);
    const sameAsTitle = posts.filter((post) => blogThumbnailAlt(post.thumbnail) === post.title);
    assert.deepEqual(sameAsTitle.map((post) => post.slug), []);
  });

  it("המפה מכסה את כל התמונות שבמפת תמונות השיתוף, וההפך", () => {
    assert.deepEqual(Object.keys(BLOG_THUMBNAIL_ALTS).sort(), Object.keys(BLOG_OG_BY_THUMBNAIL).sort());
  });

  it("כל מפתח מצביע על קובץ שקיים ו-alt קצר בעברית", () => {
    for (const [thumbnail, alt] of Object.entries(BLOG_THUMBNAIL_ALTS)) {
      assert.ok(existsSync(join(PUBLIC_ROOT, thumbnail)), thumbnail);
      assert.deepEqual(altProblems(alt), [], thumbnail);
      assert.ok(wordCount(alt) >= 4 && wordCount(alt) <= 12, `${thumbnail}: ${wordCount(alt)} מילים`);
    }
  });
});
