const base = process.env.PRICING_URL ?? "http://localhost:3000/pricing";
const res = await fetch(base);
const html = res.ok ? await res.text() : "";

const checks = [
  ["HTTP 200", res.status === 200],
  ["H1 מחירון מרכזי", html.includes("מחירון מרכזי")],
  ["5 super-categories", (html.match(/pricing-super-/g) ?? []).length >= 5],
  ["אולפן והקלטות group", html.includes("pricing-super-studio")],
  ["פודקאסט group", html.includes("pricing-super-podcast")],
  ["תוכן לעסקים group", html.includes("pricing-super-business")],
  ["Hesitant CTA", html.includes("לא יודע איזה שירות מתאים")],
  ["Fixed price hero", html.includes("מחירים קבועים")],
  ["VAT note", html.includes("מע״מ מוצג בלחיצה על כל שורה")],
  ["Book CTA (not quote)", html.includes("הזמנה מקוונת") && !html.includes("קבל הצעת מחיר עכשיו")],
  ["FAQ comparison", html.includes("מה ההבדל בין חצי שעה לשעה באולפן")],
  ["FAQ unsure", html.includes("אני לא יודע איזה שירות לבחור")],
  ["Mobile podcast row", html.includes("פודקאסט בבית")],
  ["Full production row", html.includes("הפקת פודקאסט מלאה")],
];

const h1count = (html.match(/<h1[^>]*>/g) ?? []).length;
checks.push(["Single H1", h1count === 1]);

let fail = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} | ${name}`);
  if (!ok) fail += 1;
}

const anchors = [...new Set((html.match(/id="pricing-super-[^"]+"/g) ?? []))];
console.log("---");
console.log("Super-category anchors:", anchors.join(", "));
console.log("H1 count:", h1count);
console.log("HTML size:", html.length);

if (fail > 0) process.exit(1);
