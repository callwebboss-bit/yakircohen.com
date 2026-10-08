import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

/* החלטת הבעלים 8.10.2026: הקלוסר פנימי בלבד ולא ניגש לאתר דרך הרשת. הבדיקה הזו
   שומרת שחיבור שהוסר לא יחזור בטעות. */
const root = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
/* בלי הערות, כדי שהסבר בעברית או באנגלית על מה שהוסר לא ייחשב כחזרה שלו */
const read = (rel: string) =>
  fs
    .readFileSync(path.join(root, rel), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

test("אין נתיב אנליטיקס שנועד לקלוסר", () => {
  assert.equal(fs.existsSync(path.join(root, "app/api/analytics/realtime/route.ts")), false);
  assert.doesNotMatch(read("lib/analytics/ga4-realtime.ts"), /CLOSER_ANALYTICS_TOKEN/);
});

test("ייצוא הלידים רק לקוקי של האדמין, בלי Bearer", () => {
  const route = read("app/api/admin/leads/export/route.ts");
  assert.match(route, /isAdminAuthenticated\(\)/);
  assert.doesNotMatch(route, /Bearer|authorization/i);
  assert.doesNotMatch(read("lib/admin-auth.ts"), /isAdminRequestAuthorized|startsWith\("Bearer "\)/);
});

test("webhook הקלוסר אינו קורא משתני סביבה ואינו שולח בקשה", () => {
  const src = read("lib/closer-webhook.ts");
  assert.doesNotMatch(src, /process\.env|fetch\(/);
});
