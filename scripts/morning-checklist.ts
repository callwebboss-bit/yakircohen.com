/**
 * morning:checklist - עמוד המצב של הלינקים לתשלום, שיקיר עובד איתו.
 *
 * כותב את docs/morning-checklist.html מהנתונים (הקטלוג, morning-links.json,
 * הדלפק). המצב של כל שירות מגיע מהקוד, לא מסימון ידני; ה-V הידני היחיד הוא
 * חמשת שלבי ההקמה ב-docs/MORNING-LINKS.md. בעמוד אין סודות: רק URL-ים
 * ציבוריים, מחירים ופירוט. אחרי כל ריצה מפרסמים מחדש כ-Artifact.
 *
 *   npm run morning:checklist
 */
import { writeFileSync } from "node:fs";
import { getBankTransferLine, missingBaseLinks, MORNING_LINKS } from "../lib/sales/morning-links";
import { buildSalesBook, type SalesCard } from "../lib/sales/sales-book";
import { nisText } from "../lib/sales/sales-copy";

const OUT = "docs/morning-checklist.html";
const book = buildSalesBook();
const today = new Date().toLocaleDateString("he-IL", { timeZone: "Asia/Jerusalem" });
const missing = missingBaseLinks(MORNING_LINKS);

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type LinkState = { label: string; cls: string };
function linkState(card: SalesCard): LinkState {
  if (!card.payLink) return { label: "אין", cls: "none" };
  if (card.payLink.kind === "fixed") return { label: "קבוע", cls: "fixed" };
  return { label: card.priceFrom ? "סכום פתוח (החל מ)" : "סכום פתוח", cls: "open" };
}
function detailState(card: SalesCard): LinkState {
  const inc = card.included?.length ?? 0;
  const exc = card.excluded?.length ?? 0;
  if (inc && exc) return { label: `יש (${inc} + ${exc})`, cls: "fixed" };
  if (inc || exc) return { label: "חלקי", cls: "open" };
  return { label: "חסר", cls: "none" };
}

const steps: { title: string; who: string; done: boolean; note: string }[] = [
  { title: "0.1 מפתח API ב-.env.local", who: "יקיר", done: false, note: "מורנינג > הגדרות > כלים למפתחים" },
  { title: "0.2 גילוי: npm run morning:api -- --all", who: "ביחד", done: false, note: "מסלול A / B / C" },
  { title: "0.3 לינק ניסיון מהטלפון, כלקוח", who: "יקיר", done: false, note: "שדות חובה, לחיצות, שדה הערה" },
  {
    title: "1 שבוע עם שני לינקים",
    who: "יקיר",
    done: missing.length === 0 || Boolean(MORNING_LINKS.cards.song_recording?.url && MORNING_LINKS.open.url),
    note: `סכום פתוח: ${MORNING_LINKS.open.url ? "יש" : "אין"}, הקלטת שיר: ${MORNING_LINKS.cards.song_recording?.url ? "יש" : "אין"}`,
  },
  { title: "4 פירוט ל-20 כרטיסים + פריטים במורנינג", who: "ביחד", done: false, note: "רק אחרי השבוע" },
];

const fixedCount = book.cards.filter((c) => c.payLink?.kind === "fixed").length;
const withDetail = book.cards.filter((c) => c.included?.length && c.excluded?.length).length;

const rows = book.cards
  .map((card) => {
    const link = linkState(card);
    const detail = detailState(card);
    const url = card.payLink?.url ?? "";
    return `<tr class="${card.featured ? "featured" : ""}">
<td>${esc(card.title)}${card.featured ? ' <span class="tag">נפוץ</span>' : ""}<div class="id">${card.id}</div></td>
<td class="num">${card.priceFrom ? "מ-" : ""}${esc(nisText(card.inclVat))}</td>
<td><span class="state ${detail.cls}">${detail.label}</span></td>
<td><span class="state ${link.cls}">${link.label}</span></td>
<td>${url ? `<button type="button" class="copy" data-copy="${esc(url)}">העתק לינק</button>` : card.morningLinkFields ? `<details><summary>מה להקליד</summary><pre>${esc(card.morningLinkFields)}</pre></details>` : ""}</td>
</tr>`;
  })
  .join("\n");

/* בלי doctype/html/head/body: ה-Artifact עוטף בעצמו, והקובץ המקומי נפתח בדפדפן גם ככה */
const html = `<title>לינקים לתשלום</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;700&display=swap">
<style>
/* פריסה: עמוד מצב אחד, מדדים למעלה, שלבים, ואז טבלה מסוננת. ניטרלים עם נטייה חמה קלה, אדום המותג כהדגשה */
:root{--bg:#fff;--fg:#1a1a1a;--muted:#666;--line:#e3e3e3;--card:#f6f6f6;--red:#b3261e;--green:#1b7f3b;--amber:#9a6700}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#121212;--fg:#eee;--muted:#aaa;--line:#333;--card:#1e1e1e;--red:#ff8a80;--green:#7ed49a;--amber:#f2c66d;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#121212;--fg:#eee;--muted:#aaa;--line:#333;--card:#1e1e1e;--red:#ff8a80;--green:#7ed49a;--amber:#f2c66d;color-scheme:dark}
*{box-sizing:border-box}html{direction:rtl}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 Heebo,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;padding-block:16px;padding-inline:16px}
main{max-width:980px;margin:0 auto}h1{font-size:1.5rem;margin:0 0 4px}h2{font-size:1.1rem;margin:24px 0 8px}.sub{color:var(--muted);margin:0 0 16px}
.kpi{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}.kpi div{background:var(--card);border-radius:10px;padding:10px 12px}.kpi b{display:block;font-size:1.4rem}.kpi span{color:var(--muted);font-size:.85rem}
ol.steps{list-style:none;padding:0;margin:0;display:grid;gap:6px}ol.steps li{display:flex;gap:10px;align-items:flex-start;background:var(--card);border-radius:10px;padding:10px 12px}
ol.steps .box{width:22px;height:22px;border-radius:6px;border:2px solid var(--muted);flex:none;margin-top:2px;display:grid;place-items:center;font-size:.8rem}ol.steps .done .box{background:var(--green);border-color:var(--green);color:#fff}
ol.steps small{display:block;color:var(--muted)}
table{width:100%;border-collapse:collapse;font-size:.92rem}th,td{text-align:right;padding:8px 6px;border-bottom:1px solid var(--line);vertical-align:top}th{color:var(--muted);font-weight:600;font-size:.8rem;position:sticky;top:0;background:var(--bg)}
td.num{white-space:nowrap}.id{color:var(--muted);font-size:.75rem;direction:ltr;text-align:right}.tag{font-size:.7rem;color:var(--red);border:1px solid var(--red);border-radius:999px;padding:0 6px}
.state{display:inline-block;border-radius:999px;padding:1px 8px;font-size:.8rem;border:1px solid var(--line)}.state.fixed{color:var(--green);border-color:var(--green)}.state.open{color:var(--amber);border-color:var(--amber)}.state.none{color:var(--muted)}
button.copy{min-height:36px;border:1px solid var(--line);background:var(--card);color:var(--fg);border-radius:8px;padding:4px 10px;cursor:pointer;font:inherit;font-size:.85rem}
details summary{cursor:pointer;color:var(--muted);font-size:.85rem}pre{white-space:pre-wrap;background:var(--card);padding:8px;border-radius:8px;font-size:.8rem;direction:rtl}
.filter{width:100%;min-height:44px;border:1px solid var(--line);border-radius:10px;padding:8px 12px;font:inherit;background:var(--bg);color:var(--fg);margin:8px 0 12px}
@media (max-width:600px){th:nth-child(3),td:nth-child(3){display:none}}
</style>
</head>
<body>
<main>
<h1>לינקים לתשלום במורנינג</h1>
<p class="sub">מצב מהקוד, ${esc(today)}. V ידני רק לשלבי ההקמה, ב-docs/MORNING-LINKS.md. יעד החודש הראשון: 10 תשלומים בלינק.</p>
<div class="kpi">
<div><b>${fixedCount}</b><span>לינקים קבועים</span></div>
<div><b>${MORNING_LINKS.open.url ? "יש" : "אין"}</b><span>לינק סכום פתוח</span></div>
<div><b>${MORNING_LINKS.deposit.url ? "יש" : "אין"}</b><span>לינק מקדמה (באישור)</span></div>
<div><b>${withDetail}/${book.cards.length}</b><span>כרטיסים עם כלול + לא כלול</span></div>
<div><b>${getBankTransferLine() ? "יש" : "אין"}</b><span>שורת "או בהעברה"</span></div>
</div>
<h2>שלבי ההקמה</h2>
<ol class="steps">
${steps.map((s) => `<li class="${s.done ? "done" : ""}"><span class="box">${s.done ? "V" : ""}</span><div><div>${esc(s.title)} <small>${esc(s.who)}: ${esc(s.note)}</small></div></div></li>`).join("\n")}
</ol>
<h2>כל השירותים (${book.cards.length})</h2>
<input class="filter" type="search" placeholder="סינון: שיר, פודקאסט, DJ" aria-label="סינון שירותים">
<table>
<thead><tr><th>שירות</th><th>מחיר כולל מע״מ</th><th>כלול / לא כלול</th><th>לינק</th><th></th></tr></thead>
<tbody>
${rows}
</tbody>
</table>
</main>
<script>document.documentElement.setAttribute("dir","rtl");document.documentElement.setAttribute("lang","he");
document.addEventListener("click",function(e){var b=e.target.closest("button.copy");if(!b)return;var t=b.getAttribute("data-copy");try{navigator.clipboard.writeText(t).then(function(){b.textContent="הועתק";setTimeout(function(){b.textContent="העתק לינק"},1800)})}catch(err){window.prompt("העתיקו:",t)}});
var f=document.querySelector(".filter");f.addEventListener("input",function(){var q=f.value.trim();document.querySelectorAll("tbody tr").forEach(function(tr){tr.style.display=!q||tr.textContent.indexOf(q)!==-1?"":"none"})});
</script>
`;
writeFileSync(OUT, html);
console.log(`morning:checklist - ${book.cards.length} שירותים, ${fixedCount} לינקים קבועים, ${withDetail} עם פירוט מלא. נכתב: ${OUT}`);
