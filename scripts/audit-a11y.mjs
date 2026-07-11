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
];

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const force = process.env.RUN_A11Y === "1" || process.env.CI_A11Y === "1";

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
const browser = await chromium.launch();
const page = await browser.newPage();

for (const path of PAGES_TO_CHECK) {
  const url = `${BASE_URL}${path}`;
  process.stdout.write(`Checking ${url} ... `);
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    if (serious.length) {
      violations += serious.length;
      console.log("FAIL");
      for (const v of serious) {
        console.error(`  [${v.impact?.toUpperCase()}] ${v.id}: ${v.description}`);
        for (const node of v.nodes.slice(0, 2)) {
          console.error(`    → ${node.html.slice(0, 120)}`);
        }
      }
    } else {
      console.log("OK");
    }
  } catch (err) {
    console.error(`\n  Error: ${err instanceof Error ? err.message : err}`);
    if (force) violations += 1;
  }
}

await browser.close();

if (violations > 0) {
  console.error(`\naudit:a11y FAILED — ${violations} critical/serious issue(s).`);
  process.exit(1);
}

console.log("\naudit:a11y OK");
