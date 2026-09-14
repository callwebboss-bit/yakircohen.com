/**
 * Accessibility tests using axe-core injected directly.
 * Checks critical pages for WCAG 2.1 AA violations.
 */

const AXE_SCRIPT = "node_modules/axe-core/axe.min.js";

const CRITICAL_PAGES = [
  { path: "/", label: "דף הבית" },
  { path: "/events/dj-events", label: "DJ לאירועים" },
  { path: "/events/attractions", label: "אטרקציות" },
  { path: "/book", label: "הזמנה" },
  { path: "/contact", label: "צור קשר" },
  { path: "/pricing", label: "מחירון" },
];

// ההערה כאן סתרה את הקוד: היא אמרה ש-color-contrast מוחרג, אבל הוא לא היה
// ברשימה ולכן כן נאכף. משאירים אותו נאכף, כי ניגודיות היא כשל WCAG 1.4.3
// אמיתי ולא החלטת עיצוב, ומיישרים את ההערה למה שהקוד באמת עושה.
// scrollable-region-focusable מוחרג: דפוס ידוע של טבלאות גולשות.
const AXE_DISABLE_RULES = ["scrollable-region-focusable"];

describe("Accessibility - axe-core WCAG 2.1 AA", () => {
  CRITICAL_PAGES.forEach(({ path, label }) => {
    it(`${label} (${path}) - no critical violations`, () => {
      cy.visit(path);

      cy.readFile(AXE_SCRIPT).then((axeSource: string) => {
        cy.window().then((win) => {
          // axe injected at runtime — not part of app bundle
          (win as unknown as { eval: (source: string) => void }).eval(axeSource);
        });
      });

      cy.window().then((win: Window & { axe: typeof import("axe-core") }) => {
        return win.axe
          .run(win.document, {
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
            rules: Object.fromEntries(
              AXE_DISABLE_RULES.map((id) => [id, { enabled: false }]),
            ),
          })
          .then((results) => {
            const critical = results.violations.filter(
              (v) => v.impact === "critical" || v.impact === "serious",
            );

            if (critical.length > 0) {
              const summary = critical
                .map((v) => `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} nodes)`)
                .join("\n");
              throw new Error(`נמצאו ${critical.length} בעיות נגישות קריטיות:\n${summary}`);
            }
          });
      });
    });
  });
});
