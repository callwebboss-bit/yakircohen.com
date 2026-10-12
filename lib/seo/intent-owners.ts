/**
 * בעלי כוונה: מי מחזיק כל ביטוי חיפוש, ואיפה דף אחר מתחרה בו.
 *
 * למה זה קיים: KEYWORD_LINK_MAP כבר קובע לכל ביטוי דף יעד אחד, אבל רק
 * לקישורים פנימיים. שום דבר לא בדק שדף אחר לא שם את אותו ביטוי בכותרת
 * הראשית שלו, וכך נוצרו זוגות של דפי כסף שמתחרים על אותה שאילתה
 * (סריקת ה-H1 מול המפה ב-12.10.2026 מצאה 70 התנגשויות).
 *
 * המקור היחיד לבעלות הוא KEYWORD_LINK_MAP. אין כאן רשימת ביטויים שנייה
 * שיכולה להיסחף ממנה. מה שיש כאן:
 *  1. התאמת ביטויים ל-H1 באותו כלל כמו buildMatcher: הביטוי הארוך גובר,
 *     גבול אות או ספרה, תחילית עברית אחת מותרת.
 *  2. סיווג כל התנגשות: דף תוכן (בלוג, מילון, תיק עבודות, נתונים) שתומך
 *     בדף הכסף מותר. דף כסף שמחזיק ביטוי של דף כסף אחר הוא קניבליזציה.
 *  3. KNOWN_INTENT_CONFLICTS: ההתנגשויות שכבר קיימות באתר. הרשימה יכולה
 *     רק להתקצר. audit:thin-pages --strict-intent (בתוך verify:predeploy, על
 *     הבנייה של הענף) נכשל על התנגשות חדשה ועל פריט שכבר נפתר.
 */
import { KEYWORD_LINK_MAP } from "../internal-links/keyword-map";

export type IntentPage = {
  url: string;
  h1: readonly string[];
  robots?: string | null;
};

export type IntentConflictKind = "support" | "competing";

export type IntentConflict = {
  url: string;
  phrase: string;
  owner: string;
  kind: IntentConflictKind;
  h1: string;
};

/** דפי תוכן שתפקידם לתמוך בדף כסף, לא להחליף אותו. */
const SUPPORT_PREFIXES = ["/blog/", "/glossary/", "/portfolio/", "/data/"];

export const isSupportPage = (url: string): boolean =>
  SUPPORT_PREFIXES.some((p) => url.startsWith(p));

const normalizeOwner = (href: string): string => {
  const path = href.split("#")[0].split("?")[0];
  return path.length > 1 ? path.replace(/\/$/, "") : path || "/";
};

const decodeEntities = (s: string): string =>
  s
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");

const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* תחילית עברית אחת (ו, ה, ב, ל, מ, ש, כ), כמו "לחתונה" מול "חתונה". */
const HEB_PREFIX = "[והבלמשכ]?";

type Matcher = { phrase: string; owner: string; re: RegExp };

let matchers: Matcher[] | null = null;

function getMatchers(): Matcher[] {
  if (matchers) return matchers;
  matchers = Object.entries(KEYWORD_LINK_MAP)
    .sort((a, b) => b[0].length - a[0].length)
    .map(([phrase, link]) => ({
      phrase,
      owner: normalizeOwner(link.href),
      re: new RegExp(
        "(^|[^\\p{L}\\p{N}])" + HEB_PREFIX + escapeRe(phrase) + "(?=$|[^\\p{L}\\p{N}])",
        "u",
      ),
    }));
  return matchers;
}

/** הביטויים מהמפה שמופיעים בטקסט, הארוך קודם, בלי חפיפה. */
export function matchIntentPhrases(text: string): { phrase: string; owner: string }[] {
  let rest = decodeEntities(text);
  const found: { phrase: string; owner: string }[] = [];
  for (const m of getMatchers()) {
    if (m.re.test(rest)) {
      found.push({ phrase: m.phrase, owner: m.owner });
      rest = rest.replace(m.re, " ");
    }
  }
  return found;
}

/** הדף שמחזיק את הביטוי, או null אם הביטוי לא במפה. */
export function intentOwnerOf(phrase: string): string | null {
  const link = KEYWORD_LINK_MAP[phrase];
  return link ? normalizeOwner(link.href) : null;
}

/** כל ההתנגשויות בין H1 של דף שאפשר לאנדקס לבין בעל הביטוי. */
export function findIntentConflicts(pages: readonly IntentPage[]): IntentConflict[] {
  const out: IntentConflict[] = [];
  for (const page of pages) {
    if (String(page.robots || "").includes("noindex")) continue;
    const h1 = decodeEntities(page.h1.join(" "));
    for (const { phrase, owner } of matchIntentPhrases(h1)) {
      if (owner === page.url) continue;
      out.push({
        url: page.url,
        phrase,
        owner,
        kind: isSupportPage(page.url) ? "support" : "competing",
        h1,
      });
    }
  }
  return out;
}

export const conflictKey = (c: { url: string; phrase: string }): string => c.url + " | " + c.phrase;

/**
 * התנגשויות "competing" שקיימות באתר ב-12.10.2026 (baseline של seo-diff).
 * כל פריט הוא מועמד לבדיקה: מיזוג, שינוי H1 בתוך הדף או תיקון היעד במפה.
 * פריט יוצא מהרשימה רק כשהוא נפתר, והשער דורש להוציא אותו אז.
 * דף תוכן שתומך (kind "support") לא נרשם כאן. הוא מדווח ב-audit:thin-pages.
 */
export const KNOWN_INTENT_CONFLICTS: ReadonlySet<string> = new Set([
  /* דף הבית ו-/studio/recording-studio מחזיקים את אותו H1 כמו /studio */
  "/ | אולפן הקלטות במודיעין",
  "/studio/recording-studio | אולפן הקלטות במודיעין",
  /* דפי עיר של הפודקאסט: החלפת מילים, הוחלט מיזוג (12.10.2026) */
  "/podcast/beit-shemesh | אולפן פודקאסט",
  "/podcast/jerusalem | אולפן פודקאסט",
  "/podcast/rehovot | אולפן פודקאסט",
  "/podcast/shoham | אולפן פודקאסט",
  "/podcast/self-service-studio | אולפן פודקאסט",
  /* קריינות: שלושה דפי כסף על "קריינות" מול /voiceover */
  "/business/professional-voiceover | קריינות",
  "/events/dj/voice-tags | קריינות",
  "/voiceover/services | קריינות",
  "/online/podcast-voice | קריינות",
  "/voiceover/course | קורס קריינות",
  /* גמגום: הקורס מול דף האימון */
  "/academy/stuttering-course | גמגום",
  /* "שיעור פרטי עברית" הוא כוונה אחרת מ"שיעור פרטי". לבדוק את היעד במפה */
  "/academy/ulpan | שיעור פרטי",
  "/business/on-site-studio | אולפן זמני בחברה",
  "/events/attractions/bubble-machine/smoke-bubble-machine-events | מכונת בועות",
  "/events/equipment/faq | השכרת הגברה",
  "/matanot/gift-voucher | שובר מתנה",
  "/online/online-ai-pricing | מחירון",
  "/podcast/podcast-with-grandpa | הקלטת שיר באולפן",
  "/studio/blessings/video-clip | הקלטת שיר",
  /* דף השיר והמתנות קפואים עד דוח 2.11 */
  "/studio/professional-singer | שיר במתנה",
]);
