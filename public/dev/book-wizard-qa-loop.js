/**
 * QA loop for /book#studio — paste in DevTools console or load in dev.
 * Usage: qaLoop(checks) — polls until all pass or timeout.
 */
async function qaLoop(checks, { intervalMs = 1000, timeoutMs = 120000 } = {}) {
  const start = Date.now();
  const pad = (s) => (s + "………………………………").slice(0, 42);
  return new Promise((resolve) => {
    const tick = () => {
      const results = checks.map((c) => {
        let ok = false;
        let err = null;
        try {
          ok = !!c.test();
        } catch (e) {
          err = e.message;
        }
        return { name: c.name, ok, err };
      });
      console.clear();
      console.log(
        "%cQA LOOP — " + new Date().toLocaleTimeString(),
        "font-weight:bold;color:#06c",
      );
      results.forEach((r) =>
        console.log(
          `${r.ok ? "✅" : "❌"} ${pad(r.name)} ${r.err ? "⚠ " + r.err : ""}`,
        ),
      );
      const allPass = results.every((r) => r.ok);
      const expired = Date.now() - start > timeoutMs;
      if (allPass) {
        console.log("%c🎉 כל הבדיקות עברו — מושלם.", "color:#0a0;font-weight:bold");
        resolve(true);
      } else if (expired) {
        console.warn("⏱ timeout — חלק מהבדיקות עדיין נכשלות.");
        resolve(false);
      } else {
        setTimeout(tick, intervalMs);
      }
    };
    tick();
  });
}

const BOOK_WIZARD_QA_CHECKS = [
  {
    name: "אין תמונות ללא alt",
    test: () =>
      document.querySelectorAll('img:not([alt]), img[alt=""]').length === 0,
  },
  {
    name: "אין inputs ללא label/aria",
    test: () =>
      [...document.querySelectorAll("input,textarea,select")].every(
        (i) =>
          i.getAttribute("aria-label") ||
          i.closest("label") ||
          (i.id && document.querySelector(`label[for="${i.id}"]`)),
      ),
  },
  {
    name: "JS scripts ≤ 25",
    test: () =>
      performance
        .getEntriesByType("resource")
        .filter((r) => /\.js(\?|$)/.test(r.name)).length <= 25,
  },
  {
    name: "transferSize כולל < 600KB",
    test: () =>
      performance.getEntriesByType("resource").reduce((a, r) => a + (r.transferSize || 0), 0) /
        1024 <
      600,
  },
  {
    name: "בדיוק h1 אחד בעמוד",
    test: () => document.querySelectorAll("h1").length === 1,
  },
  {
    name: "כל הכפתורים בעלי שם נגיש",
    test: () =>
      [...document.querySelectorAll("button")].every(
        (b) => b.textContent.trim() || b.getAttribute("aria-label"),
      ),
  },
  {
    name: "honeypot ריק ותקין",
    test: () => {
      const w = [...document.querySelectorAll("input")].find((i) =>
        (i.name || "").toLowerCase().includes("website"),
      );
      return !w || !w.value;
    },
  },
  {
    name: "תאימות שפה וכיווניות RTL",
    test: () =>
      document.documentElement.dir === "rtl" &&
      document.documentElement.lang === "he",
  },
  {
    name: "אין טיוטת studio-recording ב-LS",
    test: () => !localStorage.getItem("yakir-booking-draft:studio-recording"),
  },
];

if (typeof window !== "undefined") {
  window.qaLoop = qaLoop;
  window.BOOK_WIZARD_QA_CHECKS = BOOK_WIZARD_QA_CHECKS;
  console.info(
    "book-wizard-qa-loop loaded. Run: qaLoop(BOOK_WIZARD_QA_CHECKS)",
  );
}
