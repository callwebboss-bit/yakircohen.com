/**
 * audit:thin-pages - מאתר דפים רזים, בודק מה חסר בהם ומסמן סכנת קניבליזציה.
 *
 * למה זה קיים: audit:seo-diff סופר מילים בכל ה-body, כולל header, footer
 * ו-nav, ולכן הדף הקטן ביותר שלו הוא 804 מילים, מספר שלא אומר כלום על
 * תוכן הדף. כאן סופרים רק בתוך <main id="main-content">, ומפרידים בין
 * טקסט ייחודי לבין משפטי תבנית שחוזרים בהרבה דפים.
 *
 * מדווח בלבד, חוץ מ---strict-intent. לא משנה שום קובץ באתר. ההחלטה על כל דף נשארת
 * אצל הבעלים (D130-D133, 12.10.2026).
 *
 * מה נמדד לכל כתובת שאפשר לאנדקס ב-.next/server/app:
 *   מילים ב-main · מילים ייחודיות (בלי משפט שמופיע ב-5 דפים ומעלה)
 *   דמיון לדף אח (Jaccard על 5 מילים, ערים ומספרים מנורמלים)
 *   סימני מידע: H2, שאלות FAQPage, AnswerBlock, ₪, וידאו/אודיו, קישורים מה-main
 *   ביטויי כוונה ב-H1 מול בעל הביטוי (lib/seo/intent-owners.ts)
 *   רשימת חוסרים לפי סוג הדף, והמלצה: MERGE / NOINDEX / IMPROVE_EXISTING / DO_NOTHING
 *
 * מה הוא לא יודע, ואומר את זה במפורש:
 *  1. תוכן שנטען רק בדפדפן (גלריה, סיור וירטואלי, widget ביקורות) נספר כחסר,
 *     כי זה גם מה שגוגל מקבל ב-HTML הראשון.
 *  2. איכות וכנות הטקסט. "ניסיון מהאולפן" ו"מקור לכל מספר" נבדקים ידנית.
 *  3. ביקוש. בלי --gsc אין חשיפות וקליקים, ואסור למזג דף בלי לראות אותם.
 *  4. עמודים דינמיים בלי HTML בבנייה (/book, /blog, /online/*) לא נסרקים.
 *
 * שימוש:
 *   npm run build:full && npm run audit:thin-pages
 *   npm run audit:thin-pages -- --gsc=pages.csv   ייצוא "דפים" מסרץ' קונסול
 *   npm run audit:thin-pages -- --json            JSON מלא ל-stdout
 *   npm run audit:thin-pages -- --strict-intent   שער קניבליזציה (verify:predeploy)
 * פלט: .reports/thin-pages.json ו-.reports/thin-pages.md (לא בגיט)
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { GLOSSARY_TERMS } from "../lib/data/glossary";
import {
  SERVICE_OFFER_LABELS,
  isServiceOfferPublished,
  type ServiceOfferPath,
} from "../lib/data/service-offers/status";
import {
  KNOWN_INTENT_CONFLICTS,
  conflictKey,
  findIntentConflicts,
  matchIntentPhrases,
  type IntentConflict,
} from "../lib/seo/intent-owners";

const BUILD_DIR = ".next/server/app";
const BASELINE = "scripts/baselines/seo-pages.json";
const OUT_DIR = ".reports";
const SKIP_PREFIXES = ["_", "("];

/* ספים. משפט שחוזר ב-5 דפים ומעלה הוא תבנית. דמיון 0.6 ומעלה לדף אח
   הוא כפילות שכדאי למזג. הספים נבחרו מול 4 דפי העיר של הפודקאסט, שה-diff
   ביניהם הוא רק שם עיר, דקות וכביש. */
const BOILERPLATE_MIN_PAGES = 5;
const MERGE_SIMILARITY = 0.6;
const THIN_UNIQUE: Record<PageType, number> = {
  service: 300,
  post: 300,
  glossary: 80,
  portfolio: 120,
  city: 150,
  category: 80,
  hub: 150,
  utility: 0,
};
const GLOSSARY_KEEP = 20;

/* דפים שהבעלים הקפיא עד דוח סרץ' קונסול של 2.11.2026. מדווחים, לא ממליצים. */
const FROZEN = new Set([
  "/studio/recording-song-modiin",
  "/studio/recording-song-modiin/gifts",
  "/podcast/podcast-studio-modiin",
]);
/* דפי השירות שעלו ב-11.10.2026. בדיקת סרץ' קונסול שלהם מתוזמנת ל-8.11. */
const NEW_SERVICE_PAGES = new Set(
  (Object.keys(SERVICE_OFFER_LABELS) as ServiceOfferPath[]).filter(isServiceOfferPublished),
);

const args = process.argv.slice(2);
const JSON_OUT = args.includes("--json");
/* --strict-intent: השער שב-verify:predeploy. נכשל על דף כסף חדש שה-H1 שלו מחזיק
   ביטוי של דף אחר, ועל פריט ב-KNOWN_INTENT_CONFLICTS שכבר נפתר. רץ על הבנייה של
   הענף הנוכחי, ולכן נעצר מי שיצר את ההתנגשות, לא מי שמרענן baseline אחר כך. */
const STRICT_INTENT = args.includes("--strict-intent");
const GSC_FILE = (args.find((a) => a.startsWith("--gsc=")) || "").slice("--gsc=".length);

type PageType = "service" | "post" | "glossary" | "portfolio" | "city" | "category" | "hub" | "utility";

/* ---------- סריקה, אותו הילוך כמו audit-seo-diff ---------- */

function walk(dir: string, out: string[] = []): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (SKIP_PREFIXES.some((p) => entry.startsWith(p))) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

function toUrl(file: string): string {
  const rel = relative(BUILD_DIR, file).split(sep).join("/");
  const noExt = rel.replace(/\.html$/, "");
  return noExt === "index" ? "/" : "/" + noExt;
}

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d));

const stripTags = (s: string) => decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

function mainHtml(html: string): string {
  const start = html.search(/<main\b[^>]*id="main-content"/i);
  if (start < 0) return "";
  const end = html.indexOf("</main>", start);
  return html
    .slice(start, end < 0 ? undefined : end)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<template[\s\S]*?<\/template>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
}

/* קטעי טקסט לפי גבולות בלוק, ואז לפי סוף משפט. */
function segments(main: string): string[] {
  const blocks = main.replace(/<\/(p|li|h[1-6]|div|section|summary|td|th|figcaption|dd|dt|a|button|span)>|<br\s*\/?>/gi, "\n");
  return stripTags(blocks.replace(/\n/g, " ¶ "))
    .split(/¶|(?<=[.?:])\s/)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).length >= 3);
}

const words = (s: string) => s.split(/\s+/).filter(Boolean);

function ldCounts(html: string): Record<string, number> {
  const counts: Record<string, number> = {};
  const visit = (node: unknown): void => {
    if (Array.isArray(node)) return node.forEach(visit);
    if (!node || typeof node !== "object") return;
    const t = (node as Record<string, unknown>)["@type"];
    for (const name of Array.isArray(t) ? t : t ? [t] : []) counts[String(name)] = (counts[String(name)] || 0) + 1;
    Object.values(node).forEach(visit);
  };
  for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      visit(JSON.parse(m[1]));
    } catch {
      /* JSON-LD שבור נתפס ב-audit:seo-diff */
    }
  }
  return counts;
}

function mainLinks(main: string): string[] {
  const set = new Set<string>();
  for (const m of main.matchAll(/href="(\/[^"#?]*)"/g)) {
    if (m[1].startsWith("/_next/")) continue;
    set.add(m[1].length > 1 ? m[1].replace(/\/$/, "") : m[1]);
  }
  return [...set];
}

/* ---------- סוג הדף ---------- */

const CITY_RE =
  /^\/(podcast\/(jerusalem|shoham|rehovot|beit-shemesh)|events\/attractions\/(jerusalem|shoham|beit-shemesh)|studio\/studio-[a-z-]+|dj-events\/cities\/[a-z-]+)$/;
const UTILITY = new Set([
  "/",
  "/about",
  "/accessibility",
  "/privacy",
  "/terms",
  "/contact",
  "/sustainability",
  "/start",
  "/pricing",
  "/whats-included",
  "/glossary",
  "/portfolio",
]);

/* דפי מרכז, רשימה ושאלות. לא נבדקים מול רשימת דף שירות. */
const HUB_EXTRA = new Set(["/studio/virtual-tour", "/pro/event-index"]);

function pageType(url: string): PageType {
  if (UTILITY.has(url)) return "utility";
  if (url.startsWith("/blog/category/")) return "category";
  if (url.startsWith("/blog/") || url.startsWith("/data/")) return "post";
  if (url.startsWith("/glossary/")) return "glossary";
  if (url.startsWith("/portfolio/")) return "portfolio";
  if (CITY_RE.test(url)) return "city";
  if (url.split("/").length === 2 || url.endsWith("/faq") || HUB_EXTRA.has(url)) return "hub";
  return "service";
}

/* משפחה לדמיון: המקטע הראשון, ודפי עיר כמשפחה אחת לכל שירות. */
function family(url: string): string {
  const s = url.split("/").filter(Boolean);
  if (CITY_RE.test(url)) return "city:" + s[0];
  return s.length <= 1 ? "/" + (s[0] || "") : "/" + s[0];
}

/* ---------- דמיון ---------- */

const CITY_WORDS = ["ירושלים", "שוהם", "רחובות", "בית שמש", "מודיעין", "תל אביב", "פתח תקווה", "ראשון לציון"];
const CITY_NORM = new RegExp("[והבלמשכ]?(" + CITY_WORDS.join("|") + ")", "g");

function shingles(text: string, n = 5): Set<string> {
  const w = words(text.replace(CITY_NORM, "עיר").replace(/\d+(-\d+)?/g, "#"));
  const out = new Set<string>();
  for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(" "));
  return out;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  const [small, big] = a.size < b.size ? [a, b] : [b, a];
  for (const x of small) if (big.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

/* ---------- GSC ---------- */

type Gsc = { clicks: number; impressions: number; position: number | null };

function readGsc(file: string): Map<string, Gsc> {
  const out = new Map<string, Gsc>();
  if (!file) return out;
  const lines = readFileSync(file, "utf8").replace(/^﻿/, "").split(/\r?\n/).filter(Boolean);
  const head = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const col = (...names: string[]) => head.findIndex((h) => names.some((n) => h.includes(n)));
  const iClicks = col("clicks", "קליקים");
  const iImpr = col("impressions", "חשיפות");
  const iPos = col("position", "מיקום");
  for (const line of lines.slice(1)) {
    const cells = line.split(",");
    let path: string;
    try {
      path = decodeURIComponent(new URL(cells[0].replace(/^"|"$/g, "")).pathname).replace(/\/$/, "") || "/";
    } catch {
      continue;
    }
    out.set(path, {
      clicks: Number(cells[iClicks]) || 0,
      impressions: Number(cells[iImpr]) || 0,
      position: iPos >= 0 ? Number(cells[iPos]) || null : null,
    });
  }
  return out;
}

/* ---------- בדיקת חוסרים ---------- */

type Signals = {
  text: string;
  heads: string[];
  faqQuestions: number;
  answerBlock: boolean;
  price: boolean;
  media: boolean;
  links: string[];
};

function gaps(type: PageType, s: Signals, intentOwners: string[]): string[] {
  const out: string[] = [];
  const has = (re: RegExp) => re.test(s.text) || s.heads.some((h) => re.test(h));
  const head = (re: RegExp) => s.heads.some((h) => re.test(h));
  const serviceLinks = s.links.filter((l) => !/^\/(blog|glossary|portfolio)\//.test(l) && l !== "/");
  if (type === "service") {
    if (!s.price) out.push("מחיר מהקטלוג");
    if (!head(/כלול|מקבלים|מה יש|מה תקבלו|מה מגיע/)) out.push("מה כלול");
    if (!has(/תהליך|איך זה עובד|שלבים|איך מזמינים|איך התהליך|פונים, קובעים/)) out.push("תהליך");
    if (!has(/תוך \d|תוך שעה|ימי עבודה|באותה שנייה|זמן מסירה|\d+ שעות|\d+-\d+ ימים/)) out.push("זמן מסירה");
    if (!head(/למי|מתאים ל/)) out.push("למי זה מתאים");
    if (!has(/חניה|עמק איילון|מודיעין|מגיעים אליכם|עד הבית|מרחוק|אונליין/)) out.push("מיקום / מגיעים אליכם / מרחוק");
    if (!s.media) out.push("דוגמה אמיתית (וידאו או אודיו)");
    if (s.faqQuestions < 5) out.push(`FAQ (${s.faqQuestions} שאלות, צריך 5 לפחות)`);
    if (serviceLinks.length < 2) out.push("קישור לחלופות");
  }
  if (type === "post") {
    if (!s.answerBlock) out.push("תשובה קצרה בראש הפוסט (AnswerBlock)");
    const missingOwner = intentOwners.filter((o) => !s.links.includes(o));
    if (missingOwner.length) out.push("קישור לדף הבעלים: " + missingOwner.join(", "));
    if (!serviceLinks.length) out.push("קישור לשירות");
  }
  if (type === "glossary") {
    if (!has(/באולפן|אצלנו|בהקלטה|בעריכה|באירוע/)) out.push("מתי זה חשוב באולפן");
    if (!has(/לדוגמה|למשל/)) out.push("דוגמה");
    if (!serviceLinks.length) out.push("קישור לשירות");
  }
  if (type === "portfolio") {
    if (!has(/ביקש|רצה|המטרה/)) out.push("מה הלקוח ביקש");
    if (!has(/תוצאה|יצא|קיבל/)) out.push("תוצאה");
  }
  if (type === "city") out.push("עובדה מקומית אמיתית (לקוחות, אולמות, הגעה) או מיזוג");
  if (type === "category" && !s.answerBlock) out.push("פתיח לקטגוריה");
  if (type === "hub") {
    if (!s.answerBlock) out.push("פתיח שעונה במשפט אחד (AnswerBlock)");
    if (s.faqQuestions < 3) out.push(`FAQ (${s.faqQuestions} שאלות)`);
  }
  return out;
}

/* ---------- הרצה ---------- */

if (!existsSync(BUILD_DIR)) {
  console.error("\naudit:thin-pages\n  ✗ אין בנייה ב-" + BUILD_DIR + ". קודם npm run build:full.\n");
  process.exit(1);
}

const baseline = existsSync(BASELINE)
  ? (JSON.parse(readFileSync(BASELINE, "utf8")).pages as Record<string, { inbound?: number }>)
  : {};
const gsc = readGsc(GSC_FILE);

type Row = {
  url: string;
  type: PageType;
  family: string;
  h1: string[];
  mainWords: number;
  uniqueWords: number;
  maxSimilarity: number;
  similarTo: string | null;
  inbound: number | null;
  h2: number;
  faqQuestions: number;
  answerBlock: boolean;
  price: boolean;
  media: boolean;
  mainLinks: number;
  intent: IntentConflict[];
  gaps: string[];
  gsc: Gsc | null;
  recommendation: "MERGE" | "REVIEW_INTENT" | "NOINDEX" | "IMPROVE_EXISTING" | "DO_NOTHING";
  why: string;
  _segments: string[];
  _shingles: Set<string>;
  _links: string[];
  _heads: string[];
  _text: string;
};

const rows: Row[] = [];
for (const file of walk(BUILD_DIR)) {
  const html = readFileSync(file, "utf8");
  const robots = (html.match(/<meta[^>]*name="robots"[^>]*content="([^"]*)"/i) || [])[1] || "";
  if (robots.includes("noindex")) continue;
  const main = mainHtml(html);
  if (!main) continue; /* redirect() בלי תוכן */
  const url = toUrl(file);
  const h1 = [...main.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => stripTags(m[1]));
  const h2 = [...main.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => stripTags(m[1]));
  const h3 = [...main.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi)].map((m) => stripTags(m[1]));
  const text = stripTags(main);
  const ld = ldCounts(html);
  rows.push({
    url,
    type: pageType(url),
    family: family(url),
    h1,
    mainWords: words(text).length,
    uniqueWords: 0,
    maxSimilarity: 0,
    similarTo: null,
    inbound: baseline[url]?.inbound ?? null,
    h2: h2.length,
    faqQuestions: ld.Question || 0,
    answerBlock: /data-speakable/.test(main),
    price: /₪/.test(text),
    media: /youtube(-nocookie)?\.com\/embed|i\.ytimg\.com|<audio|<video|data-video-id|lite-youtube/i.test(main) || (ld.VideoObject || 0) + (ld.AudioObject || 0) > 0,
    mainLinks: 0,
    intent: [],
    gaps: [],
    gsc: gsc.get(url) ?? null,
    recommendation: "DO_NOTHING",
    why: "",
    _segments: segments(main),
    _shingles: shingles(text),
    _links: mainLinks(main),
    _heads: [...h2, ...h3],
    _text: text,
  });
  const r = rows[rows.length - 1];
  r.mainLinks = r._links.length;
}

/* משפטי תבנית: קטע שמופיע ב-BOILERPLATE_MIN_PAGES דפים ומעלה */
const segPages = new Map<string, number>();
for (const r of rows) for (const s of new Set(r._segments)) segPages.set(s, (segPages.get(s) || 0) + 1);
for (const r of rows) {
  r.uniqueWords = r._segments
    .filter((s) => (segPages.get(s) || 0) < BOILERPLATE_MIN_PAGES)
    .reduce((n, s) => n + words(s).length, 0);
}

/* דמיון בתוך משפחה */
const byFamily = new Map<string, Row[]>();
for (const r of rows) byFamily.set(r.family, [...(byFamily.get(r.family) || []), r]);
for (const group of byFamily.values()) {
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const sim = jaccard(group[i]._shingles, group[j]._shingles);
      for (const [a, b] of [
        [group[i], group[j]],
        [group[j], group[i]],
      ]) {
        if (sim > a.maxSimilarity) {
          a.maxSimilarity = sim;
          a.similarTo = b.url;
        }
      }
    }
  }
}

/* כוונה */
const conflicts = findIntentConflicts(rows.map((r) => ({ url: r.url, h1: r.h1 })));
for (const c of conflicts) rows.find((r) => r.url === c.url)!.intent.push(c);

/* אשכולות תמיכה: כמה דפי תוכן מחזיקים אותו ביטוי */
const supportClusters = new Map<string, string[]>();
for (const c of conflicts.filter((x) => x.kind === "support" && x.url.startsWith("/blog/"))) {
  supportClusters.set(c.phrase, [...(supportClusters.get(c.phrase) || []), c.url]);
}

/* מועמדי המילון שנשארים באינדקס: קשורים לשירות, עדיפות לפוקוס D10 */
const D10 = /^\/(studio|podcast|online|matanot)/;
const glossaryRank = GLOSSARY_TERMS.map((t) => {
  const url = "/glossary/" + t.slug;
  const svc = t.relatedService?.href || "";
  const score = (svc ? 10 : 0) + (D10.test(svc) ? 20 : 0) + (baseline[url]?.inbound || 0) + (gsc.get(url)?.impressions || 0) / 10;
  return { url, svc, score };
}).sort((a, b) => b.score - a.score);
const glossaryKeep = new Set(glossaryRank.slice(0, GLOSSARY_KEEP).map((g) => g.url));

/* חוסרים והמלצה */
for (const r of rows) {
  const owners = [...new Set(matchIntentPhrases(r.h1.join(" ")).map((m) => m.owner).filter((o) => o !== r.url))];
  r.gaps = gaps(
    r.type,
    {
      text: r._text,
      heads: r._heads,
      faqQuestions: r.faqQuestions,
      answerBlock: r.answerBlock,
      price: r.price,
      media: r.media,
      links: r._links,
    },
    r.type === "post" ? owners : [],
  );
  const thin = r.uniqueWords < THIN_UNIQUE[r.type];
  const competing = r.intent.filter((c) => c.kind === "competing");
  if (r.type === "utility") {
    r.recommendation = "DO_NOTHING";
    r.why = "דף מערכת";
  } else if (FROZEN.has(r.url)) {
    r.recommendation = "DO_NOTHING";
    r.why = "קפוא עד דוח סרץ' קונסול של 2.11";
  } else if (r.maxSimilarity >= MERGE_SIMILARITY) {
    r.recommendation = "MERGE";
    r.why = `דומה ${Math.round(r.maxSimilarity * 100)}% ל-${r.similarTo}`;
  } else if (r.type === "city" && thin) {
    r.recommendation = "MERGE";
    r.why = `דף עיר עם ${r.uniqueWords} מילים ייחודיות`;
  } else if (competing.length) {
    r.recommendation = "REVIEW_INTENT";
    r.why = "ה-H1 מחזיק ביטוי של " + competing.map((c) => `${c.owner} ("${c.phrase}")`).join(", ");
  } else if (r.type === "glossary" && !glossaryKeep.has(r.url)) {
    r.recommendation = "NOINDEX";
    r.why = `מחוץ ל-${GLOSSARY_KEEP} המונחים הקשורים לשירות (D131)`;
  } else if (thin || r.gaps.length >= 4) {
    r.recommendation = "IMPROVE_EXISTING";
    r.why = thin ? `${r.uniqueWords} מילים ייחודיות, סף ${THIN_UNIQUE[r.type]}` : `${r.gaps.length} חוסרים`;
  } else {
    r.recommendation = "DO_NOTHING";
    r.why = "";
  }
  if (NEW_SERVICE_PAGES.has(r.url as ServiceOfferPath) && r.recommendation !== "DO_NOTHING") {
    r.why += ". עלה ב-11.10, לחכות לבדיקת 8.11";
  }
  if ((r.recommendation === "MERGE" || r.recommendation === "REVIEW_INTENT") && !r.gsc) {
    r.why += ". לפני החלטה: חשיפות וקליקים מסרץ' קונסול";
  }
}

/* ---------- פלט ---------- */

/* שדות העבודה (מתחילים ב-_) לא נכנסים לדוח */
type CleanRow = Omit<Row, "_segments" | "_shingles" | "_links" | "_heads" | "_text">;
const clean: CleanRow[] = rows
  .map((r) => {
    const out: CleanRow = { ...r, maxSimilarity: Math.round(r.maxSimilarity * 100) / 100 };
    for (const key of Object.keys(out)) if (key.startsWith("_")) delete (out as Record<string, unknown>)[key];
    return out;
  })
  .sort((a, b) => a.uniqueWords - b.uniqueWords);

const counts = clean.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.recommendation]: (acc[r.recommendation] || 0) + 1 }), {});
const report = {
  generatedAt: new Date().toISOString(),
  buildId: existsSync(".next/BUILD_ID") ? readFileSync(".next/BUILD_ID", "utf8").trim() : null,
  pages: clean.length,
  gscRows: gsc.size,
  counts,
  glossaryKeepCandidates: glossaryRank.slice(0, GLOSSARY_KEEP),
  blogClusters: [...supportClusters.entries()].filter(([, urls]) => urls.length > 1).map(([phrase, urls]) => ({ phrase, urls })),
  rows: clean,
};

if (JSON_OUT) {
  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, "thin-pages.json"), JSON.stringify(report, null, 2));

const esc = (s: string) => s.replace(/\|/g, "\\|");
const gscCell = (g: Gsc | null) => (g ? `${g.clicks}/${g.impressions}${g.position ? " @" + g.position : ""}` : "-");
const table = (list: typeof clean) =>
  [
    "| דף | סוג | מילים ב-main | ייחודיות | דמיון | נכנסים | GSC קליקים/חשיפות | למה | מה חסר |",
    "|---|---|---|---|---|---|---|---|---|",
    ...list.map(
      (r) =>
        `| \`${r.url}\` | ${r.type} | ${r.mainWords} | ${r.uniqueWords} | ${Math.round(r.maxSimilarity * 100)}% | ${r.inbound ?? "-"} | ${gscCell(r.gsc)} | ${esc(r.why)} | ${esc(r.gaps.join("; ") || "-")} |`,
    ),
  ].join("\n");

const section = (rec: string, title: string) => {
  const list = clean.filter((r) => r.recommendation === rec);
  return `## ${title} (${list.length})\n\n${list.length ? table(list) : "אין."}\n`;
};

const md = [
  `# דפים רזים וקניבליזציה, ${report.generatedAt.slice(0, 10)}`,
  "",
  `נוצר ב-\`npm run audit:thin-pages\` מבנייה ${report.buildId ?? "?"}. ${clean.length} דפים שאפשר לאנדקס. נתוני סרץ' קונסול: ${gsc.size ? gsc.size + " שורות" : "לא סופקו (--gsc)"}.`,
  "",
  "מילים נספרות רק בתוך `<main>`. \"ייחודיות\" = בלי משפט שמופיע ב-5 דפים ומעלה. \"דמיון\" = Jaccard על רצפים של 5 מילים מול הדף הקרוב ביותר באותה משפחה, אחרי נרמול שמות ערים ומספרים.",
  "",
  "ההמלצה היא הצעה בלבד. אף דף לא משתנה בלי אישור, ואף דף לא ממוזג בלי לראות קודם חשיפות וקליקים.",
  "",
  section("MERGE", "למזג (308 לדף הבעלים)"),
  section("REVIEW_INTENT", "כוונה כפולה: לשנות H1 בתוך הדף, למזג, או לתקן את היעד במפה"),
  section("IMPROVE_EXISTING", "לעבות"),
  section("NOINDEX", "noindex"),
  `## אשכולות בבלוג על אותו ביטוי (${report.blogClusters.length})\n`,
  ...report.blogClusters.map((c) => `- **${c.phrase}**: ${c.urls.map((u) => "`" + u + "`").join(", ")}`),
  "",
  `## מועמדי המילון שנשארים באינדקס (${GLOSSARY_KEEP})\n`,
  "דירוג: מונח עם relatedService מקבל 10, שירות בפוקוס D10 (אולפן, פודקאסט, אונליין, מתנות) מקבל עוד 20, ועוד מספר הקישורים הנכנסים. הרשימה טעונה אישור.\n",
  ...report.glossaryKeepCandidates.map((g) => `- \`${g.url}\` -> ${g.svc || "-"} (${Math.round(g.score)})`),
  "",
].join("\n");
writeFileSync(join(OUT_DIR, "thin-pages.md"), md);

console.log("\naudit:thin-pages (מדווח בלבד)");
console.log(`  ${clean.length} דפים · ` + Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(" · "));
console.log(`  אשכולות בלוג: ${report.blogClusters.length} · GSC: ${gsc.size ? gsc.size + " שורות" : "לא סופק"}`);
console.log(`  דוח: ${OUT_DIR}/thin-pages.md, ${OUT_DIR}/thin-pages.json\n`);

/* שער הכוונה */
const competingKeys = new Set(conflicts.filter((c) => c.kind === "competing").map(conflictKey));
const freshConflicts = conflicts.filter((c) => c.kind === "competing" && !KNOWN_INTENT_CONFLICTS.has(conflictKey(c)));
/* עמוד דינמי בלי HTML בבנייה (למשל /online/podcast-voice) לא נשפט כ"נפתר" */
const scanned = new Set(rows.map((r) => r.url));
const staleKnown = [...KNOWN_INTENT_CONFLICTS].filter(
  (k) => scanned.has(k.split(" | ")[0]) && !competingKeys.has(k),
);
for (const c of freshConflicts) {
  console.log(`  ✗ התנגשות חדשה: ${conflictKey(c)} -> ${c.owner} (H1: ${c.h1})`);
}
if (freshConflicts.length) {
  console.log("    לשנות את ה-H1 בתוך הדף, למזג, או לתקן את היעד ב-lib/internal-links/keyword-map.ts.");
  console.log("    אם הבעלים אישר שהדף נשאר כך: להוסיף ל-KNOWN_INTENT_CONFLICTS ב-lib/seo/intent-owners.ts.");
}
for (const k of staleKnown) console.log(`  ✗ נפתר, להוציא מ-KNOWN_INTENT_CONFLICTS: ${k}`);
if (!freshConflicts.length && !staleKnown.length) {
  console.log(`  כוונה: אין התנגשות חדשה (${KNOWN_INTENT_CONFLICTS.size} ידועות).\n`);
} else if (STRICT_INTENT) {
  process.exit(1);
}
