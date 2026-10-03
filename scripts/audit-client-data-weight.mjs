/**
 * מאגרי תוכן כבדים לא נשלחים לדפדפן.
 *
 * הרקע: components/layout/Breadcrumbs.tsx הוא רכיב לקוח, והוא ייבא בעקיפין
 * את lib/data/blog.ts (409KB) ואת lib/data/services.ts (173KB). התוצאה:
 * כ-585KB נשלחו לכל דפדפן בכל עמוד באתר, גם בעמוד הבית שבו הקוד הזה מחזיר
 * רשימה ריקה לפני שהוא נוגע בנתונים. זה היה מקור רוב 750KB ה-JS הלא בשימוש
 * ש-Lighthouse דיווח עליו.
 *
 * השומר סורק את גרף הייבוא מכל קובץ "use client" ונכשל אם הוא מגיע למאגר
 * כבד. הוא לא מסתמך על גודל אלא על רשימה מפורשת, כי קובץ יכול לגדול.
 *
 * Run: npm run audit:client-data-weight
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["app", "components", "lib", "hooks"];

/** מאגרים שאסור להם להגיע ללקוח, ולמה */
const FORBIDDEN = {
  "lib/data/blog.ts": "כל 87 הפוסטים כמחרוזות HTML. להשתמש ב-blog-slugs או ב-breadcrumb-titles.generated",
  "lib/data/services.ts": "רג׳יסטרי השירותים המלא. להעביר את מה שצריך כ-prop מהשרת",
  "lib/data/video-catalog.generated.ts": "273 סרטונים. להעביר רק את הפלייליסט הרלוונטי",
  "lib/data/glossary.ts": "91 מונחים עם הגדרות",
};

/**
 * היתרים מפורשים: רכיב שהנתונים הכבדים הם התוכן שלו עצמו.
 *
 * ההיתר מאמת את עצמו: אם הרכיב כבר לא מייבא את המאגר, השומר נכשל ודורש
 * להסיר את ההיתר, ולכן הרשימה לא יכולה להתיישן בשקט.
 *
 * שניהם מחוץ לחמשת עמודי הליבה שנמדדים. **צריך אימות מחדש מול בנייה
 * אמיתית**, כי אם Turbopack מייצר חבילה מונוליטית הם כן יגיעו לכל עמוד.
 */
const ALLOWED = {
  "components/glossary/GlossaryHubContent.tsx|lib/data/glossary.ts":
    "עמוד /glossary עצמו. 91 המונחים הם התוכן של העמוד, לא נתוני עזר",
  "components/not-found/NotFoundContent.tsx|lib/data/services.ts":
    "עמוד 404 עם חיפוש. ראוט נפרד, לא בחמשת עמודי הליבה",
};

/**
 * מה נשלח לדפדפן בכל עמוד באתר.
 *
 * למה זה נחוץ בנפרד מ-FORBIDDEN: FORBIDDEN אוסר מודול על כל רכיב לקוח.
 * זה הכלי הנכון ל-blog.ts, שאין שום סיבה שיגיע לדפדפן. הוא הכלי הלא נכון
 * ל-pricing-catalog.ts: 107 מתוך 262 רכיבי הלקוח מגיעים אליו, ורובם
 * לגיטימיים, כי אשפי ההזמנה מחשבים מחיר בדפדפן. איסור גורף היה מייצר
 * 107 כשלים ומת תוך יום.
 *
 * מה שבאמת יקר הוא לא "מי נוגע בקטלוג" אלא "מה נשלח בכל כתובת". לכן
 * המדידה כאן היא סגירת הייבוא המאוחדת מכל רכיבי הלקוח ש-app/layout.tsx
 * מרנדר. זה בדיוק המטען שכל גולש משלם עליו בכל עמוד.
 *
 * למה קבוצת מודולים ולא תקציב בייטים: ניסיתי קודם תקציב בייטים והוא נכשל
 * בשני הכיוונים. רף הדוק נכשל על הוספת הערה לאחד משבעים הקבצים, ורף עם
 * מרווח של 7KB בלע ייבוא אמיתי של 5.4KB שהוספתי כדי לבדוק אותו. קבוצה
 * היא מדויקת: עריכת טקסט לא משנה אותה, וייבוא חדש משנה אותה תמיד, בלי
 * קשר לגודלו.
 *
 * המחגר דו כיווני. מודול חדש בסגירה נכשל. מודול שיצא ממנה גם נכשל, ודורש
 * לעדכן את הבסיס, אחרת כל שיפור נשחק בשקט חזרה.
 *
 * הערה על דיוק: אין בנייה מקומית על המכונה הזו (esbuild ו-swc מותקנים
 * ל-win32), ולכן זו סגירת מקור ולא צ׳אנקים אמיתיים. פיצול קוד של Turbopack
 * יכול להוציא חלק מזה מהנתיב הקריטי. הכיוון נכון, המספר המוחלט הוא קירוב.
 */
const LAYOUT_CLIENT_BASELINE = [
  /* מאזין מואצל אחד על document למדידת לחיצות וואטסאפ וטלפון. 3.7KB,
     מייבא רק useEffect ואת trackConversion, ואינו נוגע בשום מאגר תוכן.
     הוא חייב להיות בכל עמוד מעצם תפקידו: הוא תופס גם קישורים בעמודים
     שטרם נוצרו, במקום onClick בעשרות רכיבים שיתיישן בעמוד הבא. */
  "components/analytics/OutboundLeadTracker.tsx",
  "components/booking/SessionRescuerBarLazy.tsx",
  "components/business/CompanyDetailsCard.tsx",
  "components/glossary/GlossaryTooltipProvider.tsx",
  "components/layout/Breadcrumbs.tsx",
  "components/layout/BusinessOpenBadge.tsx",
  "components/layout/DeferredFloatingFabs.tsx",
  "components/layout/FooterCategorySitemap.tsx",
  "components/layout/FooterMobileDecisiveNav.tsx",
  "components/layout/Header.tsx",
  "components/layout/HeaderMobileSearchIsland.tsx",
  "components/layout/IntentNavStrip.tsx",
  "components/layout/MobileStickyCta.tsx",
  "components/layout/SearchKeyboardShortcut.tsx",
  "components/layout/SiteNav.tsx",
  "components/layout/SiteNavMenuIsland.tsx",
  "components/layout/StudioLiveIndicator.tsx",
  "components/layout/UtmSessionPersist.tsx",
  "components/layout/footer-category-icons.tsx",
  "components/layout/header-dynamic-badges-lazy.tsx",
  "components/layout/header-lazy.tsx",
  "components/layout/header-menu-context.tsx",
  /* שני הפופאפים עברו לטעינה דינמית ב-1.10.2026. הם מופיעים אחרי 8 ו-90
     שניות, ולכן לא היה טעם שיהיו בגרף הטעינה הראשון של כל עמוד. במקומם
     נשלחות שתי עטיפות של כ-550 בתים, באותו דפוס של SessionRescuerBarLazy.
     הרכיבים עצמם יצאו מהמטען, וסך המטען ירד מ-398.4KB ל-381.3KB. */
  "components/marketing/GiftFinderPopupLazy.tsx",
  "components/marketing/PwaInstallPromptLazy.tsx",
  "components/ui/Container.tsx",
  "components/ui/Icons.tsx",
  "components/ui/SiteSearch.tsx",
  "components/ui/VoiceSearchMicButton.tsx",
  "components/ui/accordion.tsx",
  "hooks/useBookUtmBoost.ts",
  "hooks/usePagefindSearch.ts",
  "hooks/useRenderCount.ts",
  "hooks/useScrollDirection.ts",
  "hooks/useSpeechRecognition.ts",
  "hooks/useVoiceSearch.ts",
  "lib/analytics/conversion-events.ts",
  "lib/book-url.ts",
  "lib/breadcrumbs/build-trail.ts",
  "lib/breadcrumbs/segment-labels.ts",
  "lib/business-hours.ts",
  "lib/company-details.ts",
  "lib/constants.ts",
  "lib/data/attraction-book-pricing.ts",
  "lib/data/book-audience-routes.ts",
  "lib/data/book-qualification-fields.ts",
  "lib/data/breadcrumb-titles.generated.ts",
  "lib/data/conversion-copy.ts",
  "lib/data/events-booking.ts",
  "lib/data/intent-nav.ts",
  "lib/data/pricing-book-map.ts",
  /* 2.10.2026: מיפוי הקישורים הישנים של חבילות השיר שירדו (?catalog=cover_song
     וכו'). כ-1.6KB בלי שום ייבוא. pricing-book-map צריך אותו כדי שקישורים
     ישנים ימשיכו לעבוד, ולכן הוא הופרד מ-song-offer.ts הכבד במכוון. */
  "lib/data/song-offer-aliases.ts",
  "lib/data/pricing-catalog.ts",
  "lib/data/pricing-display.ts",
  "lib/data/pricing.ts",
  "lib/data/youtube-embeds.ts",
  "lib/footer-category-tree.ts",
  "lib/mobile-sticky-context.ts",
  "lib/pagefind-loader.ts",
  "lib/safe-json-ld.ts",
  "lib/seo-footer-links.ts",
  "lib/site-architecture.ts",
  "lib/site-url.ts",
  "lib/studio-hours.ts",
  "lib/utils.ts",
  "lib/voice-search-intents.ts",
  "lib/whatsapp.ts",
  "lib/yc-lead-tag.ts",
];

const files = [];
const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if ([".next", "node_modules", ".git"].includes(e.name)) continue;
      walk(full);
    } else if (/\.(tsx?|mjs)$/.test(e.name) && !/\.test\./.test(e.name)) files.push(full);
  }
};
SCAN_DIRS.forEach((d) => walk(path.join(ROOT, d)));

const rel = (f) => path.relative(ROOT, f).split(path.sep).join("/");
const source = new Map();
for (const f of files) source.set(rel(f), fs.readFileSync(f, "utf8"));

/** ייבואים אמיתיים בלבד. type-only לא נשלח לדפדפן. */
function importsOf(file) {
  const src = source.get(file) ?? "";
  const out = new Set();
  /* [^;]* ולא [\s\S]*: הביטוי הקודם חצה שורות, התחיל בייבוא של react
     והמשיך עד ה-from של השורה הבאה, ולכן ייחס ייבוא type-only לייבוא ערך
     שקדם לו. ייבוא מרובה שורות עדיין נתפס, כי אין בו נקודה-פסיק. */
  for (const m of src.matchAll(/^[ \t]*import\s+(?!type\s)([^;]*?)from\s+"(@\/[^"]+|\.[^"]+)"/gm)) {
    const clause = m[1] ?? "";
    /* import { type X } בלבד גם הוא נמחק בקומפילציה */
    if (/^\s*\{\s*(type\s+[^,}]+\s*,?\s*)+\}\s*$/.test(clause)) continue;
    let spec = m[2];
    let target = spec.startsWith("@/")
      ? spec.slice(2)
      : path.posix.normalize(path.posix.join(path.posix.dirname(file), spec));
    for (const ext of [".ts", ".tsx", "/index.ts", "/index.tsx", ""]) {
      if (source.has(target + ext)) { out.add(target + ext); break; }
    }
  }
  return out;
}

const clientRoots = [...source.keys()].filter((f) => /^\s*["']use client["']/.test(source.get(f)));
const violations = [];
const allowedHits = new Set();

for (const root of clientRoots) {
  const seen = new Set([root]);
  const queue = [[root, [root]]];
  while (queue.length) {
    const [cur, chain] = queue.shift();
    for (const dep of importsOf(cur)) {
      if (seen.has(dep)) continue;
      seen.add(dep);
      const why = FORBIDDEN[dep];
      if (why) {
        const key = `${root}|${dep}`;
        if (ALLOWED[key]) { allowedHits.add(key); continue; }
        violations.push({ root, dep, why, chain: [...chain, dep] });
        continue;
      }
      queue.push([dep, [...chain, dep]]);
    }
  }
}

console.log("=== audit:client-data-weight ===\n");
if (violations.length) {
  console.error(`נמצאו ${violations.length} מאגרים כבדים שמגיעים ללקוח:\n`);
  for (const v of violations) {
    console.error(`  ✗ ${v.dep}`);
    console.error(`      ${v.why}`);
    console.error(`      שרשרת: ${v.chain.join(" -> ")}`);
  }
  process.exit(1);
}
/* היתר שכבר לא נחוץ חייב לרדת, אחרת הוא יכסה על תקלה עתידית */
const dead = Object.keys(ALLOWED).filter((k) => !allowedHits.has(k));
if (dead.length) {
  console.error("נמצאו היתרים מיותרים:\n");
  for (const k of dead) {
    console.error(`  ✗ ${k.replace("|", " -> ")} כבר לא קיים. להסיר מ-ALLOWED.`);
  }
  process.exit(1);
}

/* ── תקציב הבייטים של המטען שנשלח בכל עמוד ────────────────────────────── */

const isClient = (f) => /^\s*["']use client["']/.test(source.get(f) ?? "");

/* שורשי הלקוח שהפריסה מרנדרת: יורדים מ-app/layout.tsx דרך רכיבי שרת
   ועוצרים בכל רכיב "use client". מה שמתחתיו הוא מטען הדפדפן. */
function layoutClientRoots() {
  const seen = new Set();
  const stack = ["app/layout.tsx"];
  const roots = new Set();
  while (stack.length) {
    const cur = stack.pop();
    if (seen.has(cur)) continue;
    seen.add(cur);
    if (isClient(cur)) { roots.add(cur); continue; }
    for (const dep of importsOf(cur)) if (!seen.has(dep)) stack.push(dep);
  }
  return roots;
}

function unionClosure(roots) {
  const closure = new Set();
  const stack = [...roots];
  while (stack.length) {
    const cur = stack.pop();
    if (closure.has(cur)) continue;
    closure.add(cur);
    for (const dep of importsOf(cur)) if (!closure.has(dep)) stack.push(dep);
  }
  return closure;
}

const roots = layoutClientRoots();
if (roots.size === 0) {
  console.error("  ✗ לא נמצא אף רכיב לקוח מתחת ל-app/layout.tsx.");
  console.error("    זה כמעט בוודאי אומר שפותר הייבוא נשבר, לא שהמטען התאפס.");
  console.error("    בדיקה שמודדת אפס היא בדיקה שעוברת תמיד, ולכן היא נכשלת כאן.\n");
  process.exit(1);
}

const closure = unionClosure(roots);
const baseline = new Set(LAYOUT_CLIENT_BASELINE);
const added = [...closure].filter((f) => !baseline.has(f)).sort();
const removed = [...baseline].filter((f) => !closure.has(f)).sort();
const bytesOf = (f) => Buffer.byteLength(source.get(f) ?? "", "utf8");
const totalBytes = [...closure].reduce((sum, f) => sum + bytesOf(f), 0);
const kb = (n) => `${(n / 1024).toFixed(1)}KB`;

if (added.length) {
  console.error(`  ✗ ${added.length} מודולים חדשים נכנסו למטען שנשלח בכל עמוד:\n`);
  for (const f of added) {
    console.error(`      ${String(bytesOf(f)).padStart(6)}  ${f}`);
    /* שרשרת הייבוא הקצרה ביותר משורש לקוח, כדי שיהיה ברור מי גרר את זה */
    let chain = null;
    for (const root of [...roots].sort()) {
      const prev = new Map([[root, null]]);
      const q = [root];
      while (q.length) {
        const cur = q.shift();
        if (cur === f) break;
        for (const dep of importsOf(cur)) if (!prev.has(dep)) { prev.set(dep, cur); q.push(dep); }
      }
      if (prev.has(f)) {
        const path = [];
        for (let c = f; c != null; c = prev.get(c)) path.unshift(c);
        if (!chain || path.length < chain.length) chain = path;
      }
    }
    if (chain) console.error(`              ${chain.join(" -> ")}`);
  }
  console.error("");
  console.error(`    סך המטען עכשיו ${kb(totalBytes)} ב-${closure.size} מודולים.`);
  console.error("    זה נשלח לכל דפדפן בכל כתובת באתר, גם בעמודים שלא משתמשים בו.");
  console.error("    תיקון: להעביר את הנתונים כ-prop מהשרת, או היטל מיוצר קטן");
  console.error("    (הדפוס קיים ב-scripts/generate-client-data.ts).");
  console.error("    אם התוספת מכוונת, להוסיף אותה ל-LAYOUT_CLIENT_BASELINE ולהסביר למה.\n");
  process.exit(1);
}

if (removed.length) {
  console.error(`  ✗ ${removed.length} מודולים יצאו מהמטען. זו בשורה טובה, והבדיקה נכשלת בכוונה:\n`);
  for (const f of removed) console.error(`      ${f}`);
  console.error("");
  console.error("    בסיס שנשאר רחב נותן לשיפור להישחק בשקט חזרה.");
  console.error("    להסיר אותם מ-LAYOUT_CLIENT_BASELINE ולנעול את הרווח.\n");
  process.exit(1);
}

console.log(
  `תקין. ${clientRoots.length} רכיבי לקוח נסרקו, אף אחד מהם לא מגיע ל-${Object.keys(FORBIDDEN).length} המאגרים הכבדים.`,
);
console.log(
  `מטען כל עמוד: ${kb(totalBytes)} ב-${closure.size} מודולים מ-${roots.size} רכיבי לקוח, ללא שינוי מהבסיס.`,
);
if (allowedHits.size) {
  console.log(`\nחריגים מאושרים (${allowedHits.size}), מחוץ לעמודי הליבה:`);
  for (const k of allowedHits) console.log(`  · ${k.split("|")[0]}\n      ${ALLOWED[k]}`);
}
