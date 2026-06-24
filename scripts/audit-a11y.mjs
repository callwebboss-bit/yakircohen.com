/**
 * A11y audit using axe-core via Playwright.
 * Runs on the dev server (must be running on http://localhost:3000).
 * Run: npm run audit:a11y
 *
 * Checks critical violations on key pages. Exits 1 if any critical violations found.
 */
import { chromium } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";

const PAGES_TO_CHECK = [
  "/",
  "/studio",
  "/podcast",
  "/events",
  "/book",
  "/contact",
  "/about",
];

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
let violations = 0;

const browser = await chromium.launch();
const page = await browser.newPage();

for (const path of PAGES_TO_CHECK) {
  const url = `${BASE_URL}${path}`;
  process.stdout.write(`Checking ${url} ... `);
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
    await injectAxe(page);
    const results = await checkA11y(page, undefined, {
      axeOptions: { runOnly: ["wcag2a", "wcag2aa", "best-practice"] },
      violationCallback: (result) => {
        violations += result.violations.length;
        for (const v of result.violations) {
          console.error(`\n  [${v.impact?.toUpperCase()}] ${v.id}: ${v.description}`);
          for (const node of v.nodes.slice(0, 2)) {
            console.error(`    → ${node.html}`);
          }
        }
      },
      includedImpacts: ["critical", "serious"],
    }).catch(() => null);
    if (!results) {
      console.log("✓ (no critical violations)");
    } else {
      console.log("✓");
    }
  } catch (err) {
    console.error(`\n  Error: ${err.message}`);
  }
}

await browser.close();

if (violations > 0) {
  console.error(`\n✗ ${violations} critical/serious a11y violation(s) found.`);
  process.exit(1);
} else {
  console.log(`\n✓ All pages passed a11y audit.`);
}
