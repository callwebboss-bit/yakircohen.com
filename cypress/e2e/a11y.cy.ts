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

// אין חריגים: גם color-contrast וגם scrollable-region-focusable נאכפים.
// scrollable-region-focusable הוצא מהחריגים ב-7.10.2026 (F-22) אחרי שטבלאות
// גולשות נעטפות ב-components/ui/ScrollableTable.tsx, שנותן להן tabindex ושם.
// טבלה חדשה עם overflow-x-auto חייבת להשתמש בו.

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
