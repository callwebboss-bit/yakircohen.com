/**
 * A11y audit using axe-core via Playwright.
 * Requires: playwright + @axe-core/playwright, and a running site (BASE_URL).
 *
 * Run locally:
 *   npx playwright install chromium
 *   npm run build && npm start &
 *   npm run audit:a11y
 *
 * In CI: set RUN_A11Y=1 after install chromium. Otherwise the script exits 0 (skip).
 */

const PAGES_TO_CHECK = [
  "/",
  "/studio",
  "/podcast",
  "/events",
  "/shop",
  "/book",
  "/contact",
  "/about",
  // דפי תוכן משפטי ונגישות (F-22 / I-4, ביקורת 7.10.2026): לא נבדקו קודם
  "/accessibility",
  "/terms",
  "/privacy",
];

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const force = process.env.RUN_A11Y === "1" || process.env.CI_A11Y === "1";

// ממצאי צד שלישי שאין לנו דרך לתקן ושכבר מופיעים בהצהרת הנגישות
// ("תכנים של צד שלישי" ב-lib/data/legal/accessibility-content.tsx). צר בכוונה:
// כלל אחד, ורק בצמתים שבתוך iframe של Elfsight. כל כלל אחר באותו iframe, וכל
// color-contrast מחוץ לו, עדיין מכשיל. הצמתים מודפסים כ-KNOWN ולא נעלמים.
// החלטת הבעלים 11.10.2026. נמדד אז: 3 צמתים בדף הבית, 6 ב-/testimonials.
const KNOWN_THIRD_PARTY = [
  { rule: "color-contrast", frameHostSuffix: ".elf.site", label: "Elfsight" },
];

/** הצומת יושב בתוך iframe מוכר, והכלל שלו ברשימת היתר של אותו iframe? */
async function knownThirdParty(page, ruleId, node) {
  const [frameSelector] = node.target;
  if (node.target.length < 2 || typeof frameSelector !== "string") return null;
  const candidates = KNOWN_THIRD_PARTY.filter((k) => k.rule === ruleId);
  if (candidates.length === 0) return null;
  const src = await page
    .evaluate((sel) => document.querySelector(sel)?.getAttribute("src") ?? "", frameSelector)
    .catch(() => "");
  let host = "";
  try {
    host = new URL(src).hostname;
  } catch {
    return null;
  }
  return candidates.find((k) => host.endsWith(k.frameHostSuffix)) ?? null;
}

let chromium;
let AxeBuilder;
try {
  ({ chromium } = await import("playwright"));
  AxeBuilder = (await import("@axe-core/playwright")).default;
} catch {
  if (force) {
    console.error(
      "audit:a11y FAILED — install playwright and @axe-core/playwright (npm i -D playwright)",
    );
    process.exit(1);
  }
  console.log(
    "audit:a11y SKIPPED — playwright not installed. Set RUN_A11Y=1 after: npx playwright install chromium",
  );
  process.exit(0);
}

let violations = 0;
let errors = 0;
const browser = await chromium.launch();
// context מפורש ולא browser.newPage(): analyze() פותח עמוד ריק נוסף באותו
// context כדי לאחד את התוצאות (finishRun ב-@axe-core/playwright), ו-Playwright
// חוסם עמוד שני ב-context שנוצר דרך browser.newPage(). עד 11.10.2026 כל עמוד
// נכשל כך ב-"Please use browser.newContext()" והשגיאות נספרו כממצאים.
const context = await browser.newContext();
const page = await context.newPage();

for (const path of PAGES_TO_CHECK) {
  const url = `${BASE_URL}${path}`;
  process.stdout.write(`Checking ${url} ... `);
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
    // תכונות שנוספות אחרי הידרציה (למשל tabindex של ScrollableTable) חייבות
    // להיות במקומן לפני הסריקה, אחרת scrollable-region-focusable נכשל לשווא
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    const failing = [];
    const knownNotes = [];
    for (const v of serious) {
      const nodes = [];
      let knownCount = 0;
      let knownLabel = "";
      for (const node of v.nodes) {
        const known = await knownThirdParty(page, v.id, node);
        if (known) {
          knownCount += 1;
          knownLabel = known.label;
        } else {
          nodes.push(node);
        }
      }
      if (knownCount > 0) knownNotes.push(`${v.id} x${knownCount} inside ${knownLabel} iframe`);
      if (nodes.length > 0) failing.push({ ...v, nodes });
    }
    if (failing.length) {
      violations += failing.length;
      console.log("FAIL");
      for (const v of failing) {
        console.error(`  [${v.impact?.toUpperCase()}] ${v.id}: ${v.description}`);
        for (const node of v.nodes.slice(0, 2)) {
          console.error(`    → ${node.html.slice(0, 120)}`);
        }
      }
    } else {
      console.log("OK");
    }
    for (const note of knownNotes) {
      console.log(`  KNOWN (third party, listed in /accessibility): ${note}`);
    }
  } catch (err) {
    console.error(`\n  Error: ${err instanceof Error ? err.message : err}`);
    errors += 1;
  }
}

await browser.close();

// שגיאת טעינה או סריקה נספרת לחוד: עמוד שלא נבדק אינו ממצא נגישות
if (violations > 0 || (force && errors > 0)) {
  const parts = [];
  if (violations > 0) parts.push(`${violations} critical/serious issue(s)`);
  if (errors > 0) parts.push(`${errors} page(s) not checked (error)`);
  console.error(`\naudit:a11y FAILED: ${parts.join(", ")}.`);
  process.exit(1);
}

console.log(errors > 0 ? `\naudit:a11y OK (${errors} page(s) not checked)` : "\naudit:a11y OK");
