/**
 * morning:api - שלב 0.2 בתוכנית הלינקים: גילוי מה ה-API של מורנינג באמת מאפשר.
 *
 * רץ רק במחשב של יקיר עם המפתח ב-.env.local. מדפיס סטטוסים ושמות שדות, אף פעם
 * לא טוקן, סוד או פרטי לקוח (stripPrivate). התוצאה קובעת מסלול A / B / C
 * (docs/MORNING-LINKS.md, "שלב 0").
 *
 *   npm run morning:api -- --whoami         טוקן + פרטי העסק (שם בלבד)
 *   npm run morning:api -- --probe-links    האם יש GET /payment/links, ומה השדות
 *   npm run morning:api -- --items-search   האם פריטים נתמכים (POST /items/search)
 *   npm run morning:api -- --probe-form     POST /payments/form על 1 ₪, רק כדי לראות url ושדות
 *   npm run morning:api -- --all            הכל, בסדר הזה
 *   --sandbox   מול sandbox.d.greeninvoice.co.il (דורש מפתחות sandbox נפרדים)
 */
import { existsSync, readFileSync } from "node:fs";
import { MorningClient, stripPrivate } from "../lib/morning/client";

/* .env.local ביד, כמו scripts/add-resend-dns.mjs: רק המפתחות שצריך, בלי לדרוס */
function loadEnvLocal(): void {
  if (!existsSync(".env.local")) return;
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*(MORNING_API_ID|MORNING_API_SECRET|MORNING_SANDBOX_API_ID|MORNING_SANDBOX_API_SECRET)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const argv = process.argv.slice(2);
const has = (f: string) => argv.includes(`--${f}`) || argv.includes("--all");
const sandbox = argv.includes("--sandbox");

loadEnvLocal();
if (sandbox) {
  process.env.MORNING_API_ID = process.env.MORNING_SANDBOX_API_ID;
  process.env.MORNING_API_SECRET = process.env.MORNING_SANDBOX_API_SECRET;
}
let client: MorningClient;
try {
  client = MorningClient.fromEnv(process.env, { sandbox });
} catch (err) {
  console.error(`morning:api - ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}

function show(title: string, res: { status: number; body: unknown; text: string }) {
  console.log(`\n== ${title}: HTTP ${res.status}`);
  if (res.body != null) console.log(JSON.stringify(stripPrivate(res.body), null, 2));
  else if (res.text) console.log(res.text.slice(0, 300));
  if (res.body && typeof res.body === "object" && !Array.isArray(res.body)) {
    console.log("שדות:", Object.keys(res.body as object).join(", "));
  }
}

async function main() {
  if (has("whoami")) {
    /* שני נתיבים מוכרים, לא בטוח איזה קיים */
    for (const path of ["/businesses/me", "/account/me", "/business"]) {
      const res = await client.get(path);
      show(`whoami ${path}`, res);
      if (res.ok) break;
    }
  }
  if (has("probe-links")) {
    for (const path of ["/payment/links?pageSize=1", "/payments/links?pageSize=1"]) {
      const res = await client.get(path);
      show(`probe-links GET ${path}`, res);
      if (res.status !== 404) break;
    }
    const search = await client.post("/payment/links/search", { page: 1, pageSize: 1 });
    show("probe-links POST /payment/links/search", search);
    console.log(
      "\nפענוח: 200 עם רשימה של לינקים קבועים (שם, מחיר, url) = מסלול A. 200 עם בקשות תשלום ללקוח = מסלול B. 404/405 = מסלול C.",
    );
  }
  if (has("items-search")) {
    show("items-search", await client.post("/items/search", { page: 1, pageSize: 1 }));
  }
  if (has("probe-form")) {
    const res = await client.post("/payments/form", {
      description: "בדיקת מערכת, לא לתשלום",
      type: 320,
      lang: "he",
      currency: "ILS",
      vatType: 1,
      amount: 1,
      maxPayments: 1,
      pluginId: undefined,
      income: [{ description: "בדיקת מערכת", quantity: 1, price: 1, currency: "ILS", vatType: 1 }],
      remarks: "probe",
      custom: "probe",
      successUrl: "https://yakircohen.com/",
      failureUrl: "https://yakircohen.com/",
    });
    show("probe-form POST /payments/form", res);
    console.log("\nאם חזר url: זה דף תשלום לעסקה אחת. לפתוח בטלפון עד מסך האשראי, לא לשלם.");
  }
  if (!argv.some((a) => a.startsWith("--"))) console.log("ראו את הכותרת של scripts/morning-api.ts לדגלים.");
}

main().catch((err: unknown) => {
  console.error(`morning:api - ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
