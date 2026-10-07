/**
 * מציע קישורים פנימיים למאמרי הבלוג (lib/data/blog.ts).
 *
 * בונה מפת "ביטוי -> כתובת" משני מקורות, וסורק את התוכן של כל מאמר:
 *  - lib/data/glossary.ts: termHe, termEn ו-aliases של כל מונח -> /glossary/<slug>
 *  - lib/internal-links/keyword-map.ts: ביטוי -> עמוד שירות. גובר על המונחון,
 *    כמו בעמוד המרונדר (lib/sanitize-html.ts מסנן ממנו ביטויים כאלה).
 *
 * "מקושר" פירושו מקושר בעמוד המרונדר, לא רק כתוב כ-<a> במקור.
 * enhanceBlogHtmlWithGlossary (lib/sanitize-html.ts) כבר מקשר אוטומטית את ההופעה
 * הראשונה של כל מונח מילון בכל מאמר. לכן הסקריפט לא מציע מונחי מילון: קישור
 * שנכתב למקור היה משאיר את ההופעה הראשונה "תפוסה" בקישור ידני, והרינדור היה
 * מקשר גם את ההופעה השנייה, כלומר שני קישורים לאותו מונח. מונחי מילון שהרינדור
 * מקשר נספרים בסיכום בלבד. מה שמדווח כאן הוא ביטויי keyword-map, שאף מקום
 * באתר לא מכניס לתוכן המאמרים.
 *
 * כללים משותפים לדוח ול---apply:
 *  - לא נוגעים בטקסט שבתוך <a>, בכותרות (h1-h6) ובתוך <summary>.
 *  - יעד שהמאמר כבר מקשר אליו (ידנית או ברינדור) לא מוצע שוב.
 *  - קישור אחד לכל יעד במאמר: ההופעה הראשונה, גם כשכמה ביטויים מובילים לאותו יעד.
 *  - התאמה מדויקת ורגישה לרישיות, עם גבול אות/ספרה משני הצדדים (בלי תחיליות
 *    עבריות), בדיוק כמו ברינדור.
 *  - חלקי תוכן שמחושבים ב-${...} לא נסרקים.
 *
 * Usage:
 *   node scripts/suggest-internal-links.mjs                 דוח בלבד, לא משנה קבצים
 *   node scripts/suggest-internal-links.mjs --post <slug>   מאמר אחד
 *   node scripts/suggest-internal-links.mjs --apply         כותב את הקישורים ל-blog.ts
 *   node scripts/suggest-internal-links.mjs --apply --line 436,1425
 *       מחליף את "ההופעה הראשונה" בבחירה מפורשת: מקשר רק אזכורים שמתחילים בשורות
 *       האלה (מספרי שורה של blog.ts, כמו בדוח). שורה שאין בה אזכור שאפשר לקשר
 *       מפילה את ההרצה לפני כתיבה.
 *   אפשר לשלב: --apply --post <slug>
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BLOG_FILE = path.join(ROOT, "lib", "data", "blog.ts");
const GLOSSARY_FILE = path.join(ROOT, "lib", "data", "glossary.ts");
const KEYWORD_MAP_FILE = path.join(
  ROOT,
  "lib",
  "internal-links",
  "keyword-map.ts",
);

/** תו שמחליף ${...} ב-flat: לא אות ולא ספרה, כלומר גבול מילה */
const HOLE = "\u0001";

/* ---------- טעינת הנתונים מהמקור (בלי ייבוא TS, כמו שאר הסקריפטים) ---------- */

function unescapeLiteral(body) {
  try {
    return JSON.parse(`"${body}"`);
  } catch {
    return body;
  }
}

function stringField(block, name) {
  const re = new RegExp(String.raw`^ {4}${name}:\s*"((?:[^"\\\n]|\\.)*)"`, "m");
  const match = re.exec(block);
  return match ? unescapeLiteral(match[1]) : undefined;
}

/** מחזיר Map: ביטוי -> slug, באותו סדר ובאותה כלל "האחרון גובר" כמו GLOSSARY_PHRASE_TO_SLUG */
export function parseGlossaryPhrases(text) {
  const start = text.indexOf("export const GLOSSARY_TERMS");
  const end = text.indexOf("] as const;", start);
  if (start === -1 || end === -1) {
    throw new Error("GLOSSARY_TERMS not found in glossary.ts");
  }
  const blocks = text.slice(start, end).split(/^ {2}\{\s*$/m).slice(1);
  const phrases = new Map();
  for (const block of blocks) {
    const slug = stringField(block, "slug");
    const termHe = stringField(block, "termHe");
    if (!slug || !termHe) {
      throw new Error("glossary entry without slug or termHe");
    }
    const termEn = stringField(block, "termEn");
    const aliasesRaw = /^ {4}aliases:\s*\[([^\]]*)\]/m.exec(block);
    const aliases = aliasesRaw
      ? [...aliasesRaw[1].matchAll(/"((?:[^"\\\n]|\\.)*)"/g)].map((m) =>
          unescapeLiteral(m[1]),
        )
      : [];
    for (const phrase of [termHe, ...(termEn ? [termEn] : []), ...aliases]) {
      phrases.set(phrase, slug);
    }
  }
  return phrases;
}

/** מחזיר Map: ביטוי -> href */
export function parseKeywordMap(text) {
  const start = text.indexOf("export const KEYWORD_LINK_MAP");
  const end = text.indexOf("\n};", start);
  if (start === -1 || end === -1) {
    throw new Error("KEYWORD_LINK_MAP not found in keyword-map.ts");
  }
  const re = new RegExp(
    String.raw`^ {2}(?:"((?:[^"\\\n]|\\.)*)"|([^\s:"]+)):\s*\{\s*href:\s*"([^"]+)"`,
    "gm",
  );
  const map = new Map();
  for (const m of text.slice(start, end).matchAll(re)) {
    map.set(m[1] !== undefined ? unescapeLiteral(m[1]) : m[2], m[3]);
  }
  return map;
}

/* ---------- סריקת template literal של content ---------- */

/** מדלג על ביטוי בתוך ${...}. i הוא האינדקס אחרי ה-${ ; מחזיר את האינדקס אחרי ה-} */
function skipExpression(src, i) {
  let depth = 1;
  while (i < src.length) {
    const ch = src[i];
    if (ch === "{") {
      depth += 1;
    } else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return i + 1;
    } else if (ch === '"' || ch === "'") {
      i = skipQuoted(src, i);
    } else if (ch === "`") {
      i = scanTemplate(src, i).end;
    }
    i += 1;
  }
  throw new Error("unterminated ${...} in template literal");
}

/** open הוא אינדקס הגרש הפותח; מחזיר את האינדקס של הגרש הסוגר */
function skipQuoted(src, open) {
  const quote = src[open];
  let i = open + 1;
  while (i < src.length) {
    if (src[i] === "\\") i += 1;
    else if (src[i] === quote) return i;
    i += 1;
  }
  throw new Error("unterminated string inside ${...}");
}

/**
 * open הוא אינדקס הגרש ההפוך הפותח. מחזיר את גבולות התוכן במקור ואת flat:
 * אותו תוכן באותו אורך, כשכל ${...} וכל רצף escape הוחלפו ב-HOLE. כך אינדקס
 * ב-flat הוא אינדקס במקור, וגם תגית שמכילה ${...} נשארת תגית אחת.
 */
function scanTemplate(src, open) {
  const start = open + 1;
  let i = start;
  let flat = "";
  while (i < src.length) {
    const ch = src[i];
    if (ch === "`") return { start, end: i, flat };
    if (ch === "\\") {
      flat += HOLE.repeat(2);
      i += 2;
    } else if (ch === "$" && src[i + 1] === "{") {
      const after = skipExpression(src, i + 2);
      flat += HOLE.repeat(after - i);
      i = after;
    } else {
      flat += ch;
      i += 1;
    }
  }
  throw new Error("unterminated template literal");
}

/** כל מאמר: slug, שורת ההתחלה, אינדקס תחילת התוכן ב-blog.ts, ו-flat */
export function parseArticles(src) {
  const postsStart = src.indexOf("export const BLOG_POSTS");
  if (postsStart === -1) throw new Error("BLOG_POSTS not found in blog.ts");

  const slugRe = /^ {4}slug:\s*"([^"]+)"/gm;
  slugRe.lastIndex = postsStart;
  const heads = [...src.matchAll(slugRe)].filter((m) => m.index > postsStart);

  return heads.map((head, i) => {
    const regionEnd = heads[i + 1]?.index ?? src.length;
    const contentRe = /^ {4}content:\s*`/gm;
    contentRe.lastIndex = head.index;
    const found = contentRe.exec(src);
    if (!found || found.index >= regionEnd) {
      throw new Error(`content template not found for post "${head[1]}"`);
    }
    const open = found.index + found[0].length - 1;
    const { start, end, flat } = scanTemplate(src, open);
    return {
      slug: head[1],
      headIndex: head.index,
      start,
      end,
      flat,
      hasHoles: flat.includes(HOLE),
    };
  });
}

/* ---------- בניית המפה ---------- */

export function normalizeHref(href) {
  return href.replace(/[?#].*$/, "").replace(/\/+$/, "") || "/";
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** אותה התאמה כמו ב-lib/sanitize-html.ts: הארוך קודם, גבול אות/ספרה משני הצדדים */
function buildMatcher(phrases) {
  const sorted = [...phrases].sort((a, b) => b.length - a.length);
  return new RegExp(
    `(^|[^\\p{L}\\p{N}])(${sorted.map(escapeRegex).join("|")})(?=$|[^\\p{L}\\p{N}])`,
    "gu",
  );
}

export function buildTermMap(glossaryPhrases, keywordMap) {
  /* אותו מסנן כמו BLOG_GLOSSARY_PHRASES ב-lib/sanitize-html.ts */
  const renderedGlossary = new Map(
    [...glossaryPhrases].filter(([phrase]) => {
      const href = keywordMap.get(phrase);
      return !href || href.startsWith("/glossary");
    }),
  );
  const glossaryOverridden = [...glossaryPhrases.keys()].filter(
    (phrase) => !renderedGlossary.has(phrase),
  );
  return {
    glossaryPhrases,
    keywordMap,
    renderedGlossary,
    glossaryOverridden,
    renderedMatcher: buildMatcher(renderedGlossary.keys()),
    keywordMatcher: buildMatcher(keywordMap.keys()),
  };
}

/* ---------- ניתוח מאמר ---------- */

/** מפרק flat לצמתי טקסט, ומסמן לכל אחד אם הוא בתוך <a>, כותרת או <summary> */
function textNodes(flat) {
  const nodes = [];
  const hrefs = new Set();
  let anchor = 0;
  let heading = 0;
  let summary = 0;
  let pos = 0;

  for (const part of flat.split(/(<[^>]*>)/)) {
    if (part.startsWith("<") && part.endsWith(">")) {
      const closing = part.startsWith("</");
      const name = /^<\/?\s*([a-zA-Z][a-zA-Z0-9]*)/.exec(part)?.[1]?.toLowerCase();
      const delta = closing ? -1 : 1;
      if (name === "a") {
        anchor = Math.max(0, anchor + delta);
        if (!closing) {
          const href = /\bhref\s*=\s*["']([^"']*)["']/i.exec(part)?.[1];
          if (href && !href.includes(HOLE)) hrefs.add(normalizeHref(href));
        }
      } else if (name && /^h[1-6]$/.test(name)) {
        heading = Math.max(0, heading + delta);
      } else if (name === "summary") {
        summary = Math.max(0, summary + delta);
      }
    } else if (part) {
      nodes.push({ text: part, pos, anchor: anchor > 0, heading: heading > 0, summary: summary > 0 });
    }
    pos += part.length;
  }
  return { nodes, hrefs };
}

/** base הוא אינדקס תחילת התוכן ב-blog.ts, כדי שהאינדקסים שמוחזרים יהיו במקור */
function* matchesIn(node, matcher, base) {
  for (const m of node.text.matchAll(matcher)) {
    const start = base + node.pos + m.index + m[1].length;
    yield { phrase: m[2], start, end: start + m[2].length };
  }
}

export function analyzeArticle(article, terms) {
  const { nodes, hrefs: manualHrefs } = textNodes(article.flat);
  const renderEligible = nodes.filter((n) => !n.anchor && !n.heading);
  const suggestEligible = renderEligible.filter((n) => !n.summary);

  /* סימולציה של enhanceBlogHtmlWithGlossary: ההופעה הראשונה של כל slug */
  const renderedSlugs = new Map();
  for (const node of renderEligible) {
    for (const hit of matchesIn(node, terms.renderedMatcher, article.start)) {
      const slug = terms.renderedGlossary.get(hit.phrase);
      if (!renderedSlugs.has(slug)) renderedSlugs.set(slug, hit);
    }
  }
  const renderedHrefs = new Set(
    [...renderedSlugs.keys()].map((slug) => `/glossary/${slug}`),
  );
  const renderedSpans = [...renderedSlugs.values()];

  const covered = new Set([...manualHrefs, ...renderedHrefs]);
  const mentions = [];
  let coveredMentions = 0;
  for (const node of suggestEligible) {
    for (const hit of matchesIn(node, terms.keywordMatcher, article.start)) {
      const href = terms.keywordMap.get(hit.phrase);
      if (covered.has(normalizeHref(href))) {
        coveredMentions += 1;
        continue;
      }
      mentions.push({
        ...hit,
        href,
        /* הביטוי חופף להופעה שהרינדור מקשר למונח מילון: קישור כאן היה מזיז אותה */
        overlapsRendered: renderedSpans.some(
          (span) => hit.start < span.end && span.start < hit.end,
        ),
        apply: false,
      });
    }
  }

  /* קישור אחד לכל יעד: ההופעה הראשונה שאפשר לקשר */
  const linked = new Set();
  for (const mention of mentions) {
    const key = normalizeHref(mention.href);
    if (mention.overlapsRendered || linked.has(key)) continue;
    mention.apply = true;
    linked.add(key);
  }

  return {
    mentions,
    coveredMentions,
    renderedLinked: renderedSlugs.size,
  };
}

/* ---------- מספרי שורה והחלפה ---------- */

function lineLocator(src) {
  const newlines = [];
  for (let i = src.indexOf("\n"); i !== -1; i = src.indexOf("\n", i + 1)) {
    newlines.push(i);
  }
  return (index) => {
    let lo = 0;
    let hi = newlines.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (newlines[mid] < index) lo = mid + 1;
      else hi = mid;
    }
    return lo + 1;
  };
}

/** מחליף מהסוף להתחלה כדי שאינדקסים קודמים לא יזוזו */
export function applyEdits(src, edits) {
  let out = src;
  for (const edit of [...edits].sort((a, b) => b.start - a.start)) {
    out =
      out.slice(0, edit.start) +
      `<a href="${edit.href}">${out.slice(edit.start, edit.end)}</a>` +
      out.slice(edit.end);
  }
  return out;
}

/* ---------- CLI ---------- */

function parseArgs(argv) {
  const opts = { apply: false, post: undefined, lines: undefined };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--apply") {
      opts.apply = true;
    } else if (arg === "--post") {
      opts.post = argv[(i += 1)];
      if (!opts.post || opts.post.startsWith("--")) usage("--post needs a slug");
    } else if (arg.startsWith("--post=")) {
      opts.post = arg.slice("--post=".length);
      if (!opts.post) usage("--post needs a slug");
    } else if (arg === "--line" || arg.startsWith("--line=")) {
      const value = arg === "--line" ? argv[(i += 1)] : arg.slice("--line=".length);
      const numbers = (value ?? "").split(",").map((n) => Number(n));
      if (!value || numbers.some((n) => !Number.isInteger(n) || n < 1)) {
        usage("--line needs line numbers, for example --line 436,1425");
      }
      opts.lines = new Set([...(opts.lines ?? []), ...numbers]);
    } else {
      usage(`Unknown argument: ${arg}`);
    }
  }
  return opts;
}

function usage(message) {
  console.error(message);
  console.error("Usage: node scripts/suggest-internal-links.mjs [--post <slug>] [--line <n,n>] [--apply]");
  process.exit(1);
}

function formatRows(mentions, line) {
  /* שורה אחת לכל ביטוי ויעד: כל מספרי השורות שלו, ו-* על ההופעה שתקושר */
  const rows = new Map();
  for (const mention of mentions) {
    const key = `${mention.phrase}\u0000${mention.href}`;
    if (!rows.has(key)) rows.set(key, { ...mention, lines: [] });
    const mark = mention.apply ? "*" : mention.overlapsRendered ? "~" : "";
    rows.get(key).lines.push(`${line(mention.start)}${mark}`);
  }
  return [...rows.values()].map(
    (row) => `  שורות ${row.lines.join(", ")}  "${row.phrase}" -> ${row.href}`,
  );
}

/** --line: בחירה מפורשת לפי שורה במקום "ההופעה הראשונה". עדיין קישור אחד לכל יעד במאמר */
function selectLines(mentions, lines, line) {
  const linked = new Set();
  for (const mention of mentions) {
    const key = normalizeHref(mention.href);
    mention.apply =
      lines.has(line(mention.start)) && !mention.overlapsRendered && !linked.has(key);
    if (mention.apply) linked.add(key);
  }
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const blogSrc = fs.readFileSync(BLOG_FILE, "utf8");
  const terms = buildTermMap(
    parseGlossaryPhrases(fs.readFileSync(GLOSSARY_FILE, "utf8")),
    parseKeywordMap(fs.readFileSync(KEYWORD_MAP_FILE, "utf8")),
  );

  const allArticles = parseArticles(blogSrc);
  let articles = allArticles;
  if (opts.post) {
    articles = allArticles.filter((a) => a.slug === opts.post);
    if (articles.length === 0) {
      console.error(`No post with slug "${opts.post}" in lib/data/blog.ts`);
      process.exit(1);
    }
  }

  const line = lineLocator(blogSrc);
  const edits = [];
  const appliedLines = new Set();
  const totals = { articles: 0, mentions: 0, covered: 0, rendered: 0, overlaps: 0 };

  console.log(
    `מפת מונחים: ${terms.glossaryPhrases.size + terms.keywordMap.size} ביטויים`,
  );
  console.log(
    `  מילון (glossary.ts): ${terms.glossaryPhrases.size} ביטויים -> /glossary/*, מתוכם ${terms.glossaryOverridden.length} נדרסים על ידי keyword-map`,
  );
  console.log(`  keyword-map.ts: ${terms.keywordMap.size} ביטויים -> עמודי האתר`);
  console.log(`מאמרים: ${articles.length} (lib/data/blog.ts)`);
  console.log("* = ההופעה שתקושר עם --apply, ~ = חופף לקישור מילון שהרינדור מוסיף, לא ייגע");
  console.log("");

  for (const article of articles) {
    const result = analyzeArticle(article, terms);
    if (opts.lines) selectLines(result.mentions, opts.lines, line);
    totals.covered += result.coveredMentions;
    totals.rendered += result.renderedLinked;
    if (result.mentions.length === 0) continue;

    totals.articles += 1;
    totals.mentions += result.mentions.length;
    totals.overlaps += result.mentions.filter((m) => m.overlapsRendered).length;
    for (const mention of result.mentions) {
      if (mention.apply) {
        edits.push({ ...mention, slug: article.slug });
        appliedLines.add(line(mention.start));
      }
    }

    console.log(`${article.slug}  (שורה ${line(article.headIndex)})`);
    console.log(formatRows(result.mentions, line).join("\n"));
    console.log("");
  }

  const unmatched = opts.lines ? [...opts.lines].filter((n) => !appliedLines.has(n)) : [];
  if (unmatched.length > 0) {
    console.error(
      `--line: אין אזכור שאפשר לקשר בשורות ${unmatched.join(", ")} (או שהיעד כבר נבחר באותו מאמר). לא נכתב דבר.`,
    );
    process.exit(1);
  }

  const holes = articles.filter((a) => a.hasHoles).length;
  console.log("סיכום");
  console.log(`  אזכורים לא מקושרים: ${totals.mentions}, במאמרים: ${totals.articles}`);
  console.log(`  קישורים שייכתבו עם --apply (אחד לכל יעד בכל מאמר): ${edits.length}`);
  console.log(
    `  אזכורים שהיעד שלהם כבר מקושר במאמר (ידנית או ברינדור), לא מדווחים: ${totals.covered}`,
  );
  console.log(
    `  הופעות ראשונות של מונחי מילון שהרינדור מקשר אוטומטית, לא מדווחות ולא ייגעו: ${totals.rendered}`,
  );
  if (totals.overlaps > 0) {
    console.log(`  אזכורים החופפים לקישור מילון, מסומנים ~: ${totals.overlaps}`);
  }
  if (holes > 0) {
    console.log(`  מאמרים עם תוכן מחושב ב-\${...} שלא נסרק: ${holes}`);
  }

  if (!opts.apply) {
    console.log("");
    console.log("דוח בלבד, לא שונה אף קובץ. להחלה: --apply (אפשר עם --post <slug>)");
    return;
  }
  if (edits.length === 0) {
    console.log("");
    console.log("אין מה להחיל.");
    return;
  }

  const next = applyEdits(blogSrc, edits);

  /* בדיקה עצמית לפני כתיבה: סריקה חוזרת של התוצאה חייבת להראות את כל היעדים
     שהוחלו כמקושרים ידנית, וזהה ב-slugs ובמספר המאמרים */
  const rescanned = parseArticles(next);
  if (rescanned.length !== allArticles.length) {
    console.error("Self-check failed: article count changed. Nothing written.");
    process.exit(1);
  }
  for (const edit of edits) {
    const article = rescanned.find((a) => a.slug === edit.slug);
    const { hrefs } = textNodes(article.flat);
    if (!hrefs.has(normalizeHref(edit.href))) {
      console.error(`Self-check failed: ${edit.href} missing in ${edit.slug}. Nothing written.`);
      process.exit(1);
    }
  }

  fs.writeFileSync(BLOG_FILE, next, "utf8");
  console.log("");
  console.log(
    `נכתב אל lib/data/blog.ts. קישורים: ${edits.length}, מאמרים: ${new Set(edits.map((e) => e.slug)).size}`,
  );
}

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) main();
